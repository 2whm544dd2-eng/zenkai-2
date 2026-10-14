// netlify/functions/access.js — accès à l'app pendant la bêta privée + appareils par code (build 78).
//
//   GET                      -> { mode: "open" | "closed" }
//   POST { code, deviceId }  -> 200 { ok:true, mode, type, hasState }
//                               403 { error: "not_member" | "disabled" | "too_many_devices" }
//
// mode = variable d'environnement ACCESS_MODE sur Netlify :
//   - absente ou "open" : comportement actuel, l'app s'ouvre sans code (le code ne sert qu'à la synchro) ;
//   - "closed"          : bêta privée, l'app demande un code d'invitation actif au premier lancement.
// Un code = une seule sauvegarde, utilisable sur MAX_DEVICES appareils (réinitialisables depuis /admin).

const { getStore, connectLambda } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function connect(event) {
  try { if (event && event.blobs) connectLambda(event); } catch (e) { /* variables d'env */ }
}
const json = (statusCode, obj) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const CODE_RE = /^[A-Z0-9]{4,16}$/;
const DEVICE_RE = /^[a-z0-9]{12,40}$/;
const MAX_DEVICES = 2;
const accessMode = () => (process.env.ACCESS_MODE === 'closed' ? 'closed' : 'open');

// true = appareil accepté (ajouté si nouveau), false = déjà MAX_DEVICES autres appareils
function registerDevice(m, deviceId) {
  const day = new Date().toISOString().slice(0, 10);
  m.devices = Array.isArray(m.devices) ? m.devices : [];
  const d = m.devices.find((x) => x.id === deviceId);
  if (d) { if (d.last !== day) { d.last = day; return { ok: true, changed: true }; } return { ok: true, changed: false }; }
  if (m.devices.length >= MAX_DEVICES) return { ok: false };
  m.devices.push({ id: deviceId, first: day, last: day });
  return { ok: true, changed: true };
}

exports.handler = async (event) => {
  connect(event);
  const mode = accessMode();
  if (event.httpMethod === 'GET') return json(200, { mode });
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  let body;
  try { body = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
  const code = String((body && body.code) || '').replace(/\s+/g, '').toUpperCase();
  const deviceId = String((body && body.deviceId) || '').toLowerCase();
  if (!CODE_RE.test(code)) return json(400, { error: 'bad_code' });
  if (!DEVICE_RE.test(deviceId)) return json(400, { error: 'bad_device' });

  const members = blobStore('hunter-log-members');
  const m = await members.get(code, { type: 'json' }).catch(() => null);
  const hasState = !!(await blobStore('hunter-log-state').getMetadata(code).catch(() => null));
  if (!m) {
    if (mode === 'closed') return json(403, { error: 'not_member' });
    return json(200, { ok: true, mode, type: null, hasState });
  }
  if (m.active === false) return json(403, { error: 'disabled' });
  const r = registerDevice(m, deviceId);
  if (!r.ok) return json(403, { error: 'too_many_devices' });
  if (r.changed) { m.lastSeen = new Date().toISOString().slice(0, 10); await members.setJSON(code, m); }
  return json(200, { ok: true, mode, type: m.type || 'membre', hasState });
};
