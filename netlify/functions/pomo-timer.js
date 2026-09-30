// netlify/functions/pomo-timer.js — enregistre l'heure de fin du pomodoro en cours.
// Le téléphone suspend l'app quand l'écran s'éteint : elle ne peut pas sonner elle-même.
// L'app envoie donc ici la liste des moments où prévenir (fin de session, fin de pause) ;
// la fonction planifiée pomo-notify envoie le push le moment venu.
// POST {subscription, events:[{at, body}]} — events vide = minuteur arrêté (on efface).

const crypto = require('crypto');
const { getStore, connectLambda } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function connect(event) {
  try { if (event && event.blobs) connectLambda(event); } catch (e) { /* variables d'env */ }
}
const json = (statusCode, obj) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });

const MAX_AHEAD_MS = 4 * 60 * 60 * 1000;   // focus 90 min + pause 30 min max : 4 h laisse de la marge
const MAX_EVENTS = 4;

function validSubscription(sub) {
  return sub && typeof sub.endpoint === 'string' && /^https:\/\//.test(sub.endpoint) && sub.endpoint.length < 1000 &&
    sub.keys && typeof sub.keys.p256dh === 'string' && typeof sub.keys.auth === 'string' &&
    sub.keys.p256dh.length < 200 && sub.keys.auth.length < 100;
}

exports.handler = async (event) => {
  connect(event);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method not allowed' });
  if ((event.body || '').length > 5000) return json(413, { error: 'too large' });
  let data;
  try { data = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'invalid json' }); }
  const sub = data.subscription;
  if (!validSubscription(sub)) return json(400, { error: 'invalid subscription' });

  const now = Date.now();
  const events = (Array.isArray(data.events) ? data.events : [])
    .filter((ev) => ev && Number.isFinite(ev.at) && ev.at > now - 60000 && ev.at < now + MAX_AHEAD_MS)
    .slice(0, MAX_EVENTS)
    .map((ev) => ({ at: Math.round(ev.at), body: String(ev.body || 'Pomodoro terminé').slice(0, 160) }))
    .sort((a, b) => a.at - b.at);

  const key = crypto.createHash('sha256').update(sub.endpoint).digest('hex');
  const store = blobStore('hunter-log-pomo-timers');
  if (!events.length) {
    await store.delete(key);
    return json(200, { ok: true, scheduled: 0 });
  }
  await store.setJSON(key, {
    subscription: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } },
    events,
    updated: now,
  });
  return json(200, { ok: true, scheduled: events.length });
};
