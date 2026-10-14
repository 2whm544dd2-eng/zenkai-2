// netlify/functions/send-reminders.js — fonction planifiée (toutes les 10 min, voir netlify.toml).
// Version GitHub (production) conservée, avec trois corrections :
//  1. setVapidDetails() était appelé au chargement du module : une clé VAPID absente
//     faisait planter la fonction entière sans message clair. Désormais vérifié à
//     l'exécution, avec un message explicite dans les logs Netlify.
//  2. `hour12:false` peut renvoyer "24" à minuit dans certains moteurs -> hourCycle "h23".
//  3. Un fuseau horaire invalide envoyé par un navigateur faisait planter toute la boucle
//     (donc plus aucun rappel pour personne) -> repli sur Europe/Brussels.

const webpush = require('web-push');
const { getStore, connectLambda } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function connect(event) {
  try { if (event && event.blobs) connectLambda(event); } catch (e) { /* variables d'env */ }
}

function nowInTimezone(timezone) {
  let tz = timezone || 'Europe/Brussels';
  try { new Intl.DateTimeFormat('en-CA', { timeZone: tz }); } catch (e) { tz = 'Europe/Brussels'; }
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));   // 0 = lundi
  const hour = parseInt(get('hour'), 10), minute = parseInt(get('minute'), 10);
  return { dateStr: `${get('year')}-${get('month')}-${get('day')}`, hour, minute, weekday: wd, nowMin: hour * 60 + minute };
}

// true = envoyé, false = échec passager, null = abonnement mort (410/404) à supprimer
async function sendPush(subscription, payload) {
  try { await webpush.sendNotification(subscription, JSON.stringify(payload)); return true; }
  catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) return null;
    console.error('send-reminders: push failed', err.statusCode);
    return false;
  }
}

exports.handler = async (event) => {
  connect(event);
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error('send-reminders: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY manquantes dans les variables Netlify');
    return { statusCode: 500, body: 'vapid keys missing' };
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:contact@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const store = blobStore('hunter-log-subscribers');
  const { blobs } = await store.list();
  for (const { key } of blobs) {
    const record = await store.get(key, { type: 'json' }).catch(() => null);
    if (!record || !record.subscription) continue;
    const { dateStr: today, hour, weekday, nowMin } = nowInTimezone(record.timezone);
    const state = record.state || {};
    let changed = false;
    let dead = false;

    // Soir : dès 20h, s'il reste des tâches et que demain n'est pas encore choisi.
    const alreadySetForTomorrow = state.commitmentForDate && state.commitmentForDate > today;
    if (hour >= 20 && !alreadySetForTomorrow && state.hasPendingTasks && record.eveningNotifiedDate !== today) {
      const r = await sendPush(record.subscription, { title: 'SYSTÈME // ZENKAI', body: '🌙 Quelles quêtes sont non-négociables demain ?', tag: 'hunter-log-commitment-evening' });
      if (r) { record.eveningNotifiedDate = today; changed = true; } else if (r === null) dead = true;
    }
    // Jour J : rappel des tâches non-négociables choisies la veille.
    if (!dead && hour >= 7 && state.commitmentForDate === today && Array.isArray(state.commitmentTaskNames) &&   // 10/10 : pas à minuit
        state.commitmentTaskNames.length && record.morningNotifiedDate !== today) {
      const r = await sendPush(record.subscription, { title: 'SYSTÈME // ZENKAI', body: `🌟 Non-négociable aujourd'hui : ${state.commitmentTaskNames.join(', ')}`, tag: 'hunter-log-commitment-morning' });
      if (r) { record.morningNotifiedDate = today; changed = true; } else if (r === null) dead = true;
    }

    // Journée type (build 78) : rappel ~30 min avant chaque plage du jour (tâche planifiée toutes les
    // 10 min → la fenêtre [20 ; 30[ min n'est traversée qu'une fois ; blockNotified évite tout doublon).
    if (!dead && Array.isArray(state.blocks)) {
      record.blockNotified = record.blockNotified || {};
      for (const b of state.blocks.slice(0, 40)) {
        if (!b || typeof b.start !== 'string') continue;
        // nouvelle app : plages datées (exceptions « ce jour seulement » comprises) ; ancienne : jours de la semaine
        if (b.date ? b.date !== today : !(Array.isArray(b.days) && b.days.includes(weekday))) continue;
        const [h, m] = b.start.split(':').map(Number);
        const diff = h * 60 + m - nowMin;
        if (diff >= 20 && diff < 30 && record.blockNotified[b.id] !== today) {
          const r = await sendPush(record.subscription, { title: 'SYSTÈME // ZENKAI', body: `${b.name} dans ${diff} min (${b.start})${b.link ? ' — ' + b.link : ''}`, tag: `zenkai-block-${b.id}` });
          if (r) { record.blockNotified[b.id] = today; changed = true; } else if (r === null) { dead = true; break; }
        }
      }
      for (const id of Object.keys(record.blockNotified)) if (record.blockNotified[id] !== today) { delete record.blockNotified[id]; changed = true; }
    }

    // Objectifs (build 78) : l'app envoie les rappels des 7 prochains jours (date, heure, texte), recalculés à chaque progrès.
    // Envoyé dans les 3 h qui suivent l'heure choisie, une fois par jour et par objectif.
    if (!dead && Array.isArray(state.goals)) {
      record.goalNotified = record.goalNotified || {};
      for (const g of state.goals.slice(0, 40)) {
        if (!g || g.date !== today || typeof g.at !== 'string' || typeof g.body !== 'string') continue;
        const [h, m] = g.at.split(':').map(Number);
        const late = nowMin - (h * 60 + m);
        if (late >= 0 && late < 180 && record.goalNotified[g.id] !== today) {
          const r = await sendPush(record.subscription, { title: 'SYSTÈME // ZENKAI', body: g.body.slice(0, 180), tag: `zenkai-goal-${g.id}` });
          if (r) { record.goalNotified[g.id] = today; changed = true; } else if (r === null) { dead = true; break; }
        }
      }
      for (const id of Object.keys(record.goalNotified)) if (record.goalNotified[id] !== today) { delete record.goalNotified[id]; changed = true; }
    }

    if (dead) await store.delete(key);
    else if (changed) await store.setJSON(key, record);
  }
  return { statusCode: 200, body: 'ok' };
};
