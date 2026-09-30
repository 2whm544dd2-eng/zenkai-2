// netlify/functions/pomo-notify.js — fonction planifiée (chaque minute, voir netlify.toml).
// Envoie les notifications de fin de pomodoro enregistrées par pomo-timer.
// Précision : jusqu'à ~1 min de retard (le planificateur Netlify tourne à la minute).

const webpush = require('web-push');
const { getStore, connectLambda } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function connect(event) {
  try { if (event && event.blobs) connectLambda(event); } catch (e) { /* variables d'env */ }
}

// true = envoyé, false = échec passager, null = abonnement mort (410/404)
async function sendPush(subscription, payload) {
  try { await webpush.sendNotification(subscription, JSON.stringify(payload), { TTL: 600, urgency: 'high' }); return true; }
  catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) return null;
    console.error('pomo-notify: push failed', err.statusCode);
    return false;
  }
}

const STALE_MS = 10 * 60 * 1000;   // une notification ratée de plus de 10 min n'a plus de sens

exports.handler = async (event) => {
  connect(event);
  const store = blobStore('hunter-log-pomo-timers');
  const { blobs } = await store.list();
  if (!blobs.length) return { statusCode: 200, body: 'idle' };   // cas courant : rien à faire, sortie immédiate

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error('pomo-notify: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY manquantes dans les variables Netlify');
    return { statusCode: 500, body: 'vapid keys missing' };
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:contact@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const now = Date.now();
  let sent = 0;
  for (const { key } of blobs) {
    const record = await store.get(key, { type: 'json' }).catch(() => null);
    if (!record || !record.subscription || !Array.isArray(record.events)) { await store.delete(key); continue; }
    const due = record.events.filter((ev) => ev.at <= now);
    let rest = record.events.filter((ev) => ev.at > now);
    if (due.length) {
      // Si plusieurs échéances sont passées (ex. fin de session ET fin de pause), seule la
      // plus récente est utile.
      const last = due[due.length - 1];
      if (now - last.at <= STALE_MS) {
        const r = await sendPush(record.subscription, { title: 'SYSTEM // Hunter Log', body: last.body, tag: 'hunter-log-pomo', pomoAt: last.at });
        if (r === null) { await store.delete(key); continue; }
        if (r === false) rest = [last].concat(rest);   // réessai à la prochaine minute
        else sent++;
      }
    }
    if (!rest.length) await store.delete(key);
    else if (rest.length !== record.events.length || due.length) await store.setJSON(key, { ...record, events: rest });
  }
  return { statusCode: 200, body: `sent ${sent}` };
};
