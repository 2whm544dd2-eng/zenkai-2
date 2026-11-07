// netlify/functions/subscribe.js — enregistre l'abonnement Web Push d'un appareil.
// Version GitHub (production) conservée ; seulement durcie (JSON invalide, fuseau par défaut).
//
//   POST { subscription, code, timezone, state:{ hasPendingTasks, commitmentForDate, commitmentTaskNames } }
//   05/11 : `code` (code d'accès) obligatoire et vérifié : sans lui, n'importe qui pouvait remplir le stockage,
//   et chaque abonnement est relu toutes les 10 min par send-reminders (crédits Netlify).
//   -> { ok:true, deviceId }

const crypto = require('crypto');
const { getStore, connectLambda } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function connect(event) {
  try { if (event && event.blobs) connectLambda(event); } catch (e) { /* variables d'env */ }
}
const CODE_RE = /^[A-Z0-9]{4,16}$/;
async function allowedCode(code) {   // même règle que oath.js
  const m = await blobStore('hunter-log-members').get(code, { type: 'json' }).catch(() => null);
  if (m && m.active === false) return 'disabled';
  if (process.env.ACCESS_MODE === 'closed' && !m) return 'not_member';
  if (!m && !(await blobStore('hunter-log-state').getMetadata(code).catch(() => null))) return 'not_member';
  return null;
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
  const code = String((payload && payload.code) || '').trim().toUpperCase();
  const refused = CODE_RE.test(code) ? await allowedCode(code) : 'missing_code';
  if (refused) {
    await store.delete(deviceId).catch(() => {});   // plus aucun rappel pour cet appareil (évite des rappels basés sur un état périmé)
    return json(403, { error: refused });
  }
  const existing = (await store.get(deviceId, { type: 'json' }).catch(() => null)) || {};

  // Abonnement remplacé sur le même appareil (nouvelle clé, réinstallation) : on supprime l'ancien,
  // sinon l'appareil reçoit chaque rappel en double (build 78).
  const replaces = payload && typeof payload.replaces === 'string' && /^[0-9a-f]{64}$/.test(payload.replaces) ? payload.replaces : null;
  if (replaces && replaces !== deviceId) await store.delete(replaces).catch(() => {});

  await store.setJSON(deviceId, {
    subscription,
    code,
    timezone: timezone || existing.timezone || 'Europe/Brussels',
    state: state || existing.state || {},
    // Gérées par send-reminders.js : ne pas les remettre à zéro à chaque mise à jour d'état.
    eveningNotifiedDate: existing.eveningNotifiedDate || null,
    blockNotified: existing.blockNotified || {},
    goalNotified: existing.goalNotified || {},
    timedNotified: existing.timedNotified || {},
    morningNotifiedDate: existing.morningNotifiedDate || null,
    updatedAt: new Date().toISOString(),
  });
  return json(200, { ok: true, deviceId });
};
