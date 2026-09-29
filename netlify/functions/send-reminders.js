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
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return { dateStr: `${get('year')}-${get('month')}-${get('day')}`, hour: parseInt(get('hour'), 10) };
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
    const { dateStr: today, hour } = nowInTimezone(record.timezone);
    const state = record.state || {};
    let changed = false;
    let dead = false;

    // Soir : dès 20h, s'il reste des tâches et que demain n'est pas encore choisi.
    const alreadySetForTomorrow = state.commitmentForDate && state.commitmentForDate > today;
    if (hour >= 20 && !alreadySetForTomorrow && state.hasPendingTasks && record.eveningNotifiedDate !== today) {
      const r = await sendPush(record.subscription, { title: 'SYSTEM // Hunter Log', body: '🌙 Quelle(s) tâche(s) sont non-négociables demain ?' });
      if (r) { record.eveningNotifiedDate = today; changed = true; } else if (r === null) dead = true;
    }
    // Jour J : rappel des tâches non-négociables choisies la veille.
    if (!dead && state.commitmentForDate === today && Array.isArray(state.commitmentTaskNames) &&
        state.commitmentTaskNames.length && record.morningNotifiedDate !== today) {
      const r = await sendPush(record.subscription, { title: 'SYSTEM // Hunter Log', body: `🌟 Non-négociable aujourd'hui : ${state.commitmentTaskNames.join(', ')}` });
      if (r) { record.morningNotifiedDate = today; changed = true; } else if (r === null) dead = true;
    }

    if (dead) await store.delete(key);
    else if (changed) await store.setJSON(key, record);
  }
  return { statusCode: 200, body: 'ok' };
};
