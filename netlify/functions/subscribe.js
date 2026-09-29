// netlify/functions/subscribe.js — enregistre l'abonnement Web Push d'un appareil.
// Version GitHub (production) conservée ; seulement durcie (JSON invalide, fuseau par défaut).
//
//   POST { subscription, timezone, state:{ hasPendingTasks, commitmentForDate, commitmentTaskNames } }
//   -> { ok:true, deviceId }

const crypto = require('crypto');
const { getStore, connectLambda } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function connect(event) {
  try { if (event && event.blobs) connectLambda(event); } catch (e) { /* variables d'env */ }
}
const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(obj),
});

exports.handler = async (event) => {
  connect(event);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  let payload;
  try { payload = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
  const { subscription, timezone, state } = payload || {};
  if (!subscription || typeof subscription.endpoint !== 'string') return json(400, { error: 'missing_subscription' });

  // Identifiant stable par appareil, dérivé de l'endpoint (jamais l'endpoint en clair comme clé).
  const deviceId = crypto.createHash('sha256').update(subscription.endpoint).digest('hex');
  const store = blobStore('hunter-log-subscribers');
  const existing = (await store.get(deviceId, { type: 'json' }).catch(() => null)) || {};

  await store.setJSON(deviceId, {
    subscription,
    timezone: timezone || existing.timezone || 'Europe/Brussels',
    state: state || existing.state || {},
    // Gérées par send-reminders.js : ne pas les remettre à zéro à chaque mise à jour d'état.
    eveningNotifiedDate: existing.eveningNotifiedDate || null,
    morningNotifiedDate: existing.morningNotifiedDate || null,
    updatedAt: new Date().toISOString(),
  });
  return json(200, { ok: true, deviceId });
};
