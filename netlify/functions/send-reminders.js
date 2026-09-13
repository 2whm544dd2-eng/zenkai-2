// Fonction planifiée (voir netlify.toml : toutes les 10 minutes).
// Pour chaque appareil abonné, calcule l'heure locale (via son fuseau horaire) et envoie
// les rappels dus : "choisis tes tâches de demain" (dès 20h) et "voici tes tâches non-
// négociables du jour" (le matin, une fois par jour).
const webpush = require('web-push');
const { getStore } = require('@netlify/blobs');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:contact@example.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Ajoute `days` jours à une date 'YYYY-MM-DD' et renvoie une chaîne 'YYYY-MM-DD'.
// (Calcul fait en UTC pour éviter tout souci de décalage horaire sur le jour civil.)
function addDaysStr(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

function todayInTimezone(timezone) {
  // Renvoie {dateStr:'YYYY-MM-DD', hour:Number} dans le fuseau horaire donné.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return { dateStr: `${get('year')}-${get('month')}-${get('day')}`, hour: parseInt(get('hour'), 10) };
}

exports.handler = async () => {
  const store = getStore('hunter-log-subscribers');
  const { blobs } = await store.list();

  for (const { key: deviceId } of blobs) {
    const record = await store.get(deviceId, { type: 'json' });
    if (!record || !record.subscription) continue;

    const { dateStr: today, hour } = todayInTimezone(record.timezone);
    const state = record.state || {};
    let changed = false;

    // --- Rappel du soir : dès 20h, si pas encore choisi pour demain ---
    const alreadySetForTomorrow = state.commitmentForDate && state.commitmentForDate > today;
    if (
      hour >= 20 &&
      !alreadySetForTomorrow &&
      state.hasPendingTasks &&
      record.eveningNotifiedDate !== today
    ) {
      const sent = await sendPush(record.subscription, {
        title: 'SYSTEM // Hunter Log',
        body: "🌙 Quelle(s) tâche(s) sont non-négociables demain ?",
      });
      if (sent) { record.eveningNotifiedDate = today; changed = true; }
      else if (sent === null) { await store.delete(deviceId); continue; } // abonnement expiré
    }

    // --- Rappel du matin : liste des tâches non-négociables du jour ---
    if (
      state.commitmentForDate === today &&
      Array.isArray(state.commitmentTaskNames) &&
      state.commitmentTaskNames.length &&
      record.morningNotifiedDate !== today
    ) {
      const sent = await sendPush(record.subscription, {
        title: 'SYSTEM // Hunter Log',
        body: `🌟 Non-négociable aujourd'hui : ${state.commitmentTaskNames.join(', ')}`,
      });
      if (sent) { record.morningNotifiedDate = today; changed = true; }
      else if (sent === null) { await store.delete(deviceId); continue; }
    }

    // --- Rappel échéances : tâches "limitées dans le temps" qui expirent demain ou aujourd'hui,
    // et tâches "urgentes" toujours ouvertes (ce type n'a pas de date, donc on les rappelle tant
    // qu'elles ne sont pas faites). Envoyé une fois par jour, à partir de 8h heure locale.
    if (hour >= 8 && record.deadlineNotifiedDate !== today) {
      const tomorrow = addDaysStr(today, 1);
      const deadlineTasks = Array.isArray(state.deadlineTasks) ? state.deadlineTasks : [];
      const dueToday = deadlineTasks.filter((t) => t.dueDate === today).map((t) => t.name);
      const dueTomorrow = deadlineTasks.filter((t) => t.dueDate === tomorrow).map((t) => t.name);
      const urgent = Array.isArray(state.urgentTaskNames) ? state.urgentTaskNames : [];

      if (dueToday.length || dueTomorrow.length || urgent.length) {
        const lines = [];
        if (dueToday.length) lines.push(`⏳ Expire aujourd'hui : ${dueToday.join(', ')}`);
        if (dueTomorrow.length) lines.push(`📅 Expire demain : ${dueTomorrow.join(', ')}`);
        if (urgent.length) lines.push(`🔥 Urgent : ${urgent.join(', ')}`);

        const sent = await sendPush(record.subscription, {
          title: 'SYSTEM // Hunter Log',
          body: lines.join('\n'),
        });
        if (sent) { record.deadlineNotifiedDate = today; changed = true; }
        else if (sent === null) { await store.delete(deviceId); continue; }
      }
    }

    if (changed) await store.setJSON(deviceId, record);
  }

  return { statusCode: 200, body: 'ok' };
};

// Retourne true si envoyé, false en cas d'erreur passagère, null si l'abonnement
// n'est plus valide (410/404 — l'utilisateur a désinstallé / réinitialisé le navigateur).
async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) return null;
    console.error('Push failed:', err.statusCode, err.body);
    return false;
  }
}

