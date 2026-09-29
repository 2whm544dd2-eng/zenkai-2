// netlify/functions/members.js — registre des codes membres (accès payant / Skool).
//
// Nouveau sur GitHub. Utilise le store que sync-state.js consulte déjà en production
// ("hunter-log-members", clé = CODE, champ `active`) : désactiver un membre ici coupe
// immédiatement sa synchro.
//
// Contrat (écran admin de index.html) :
//   GET                                     -> { members: [{ code, label, active }] }
//   POST { action:"register", code, label } -> crée un membre (si le label est un email,
//                                              il est indexé pour l'annulation Skool)
//   POST { action:"toggle", code, active }  -> active / désactive
//   POST { action:"disableByEmail", email } -> désactive via l'email
// Auth : header "x-admin-secret" = variable d'environnement ADMIN_SECRET.
// Si ADMIN_SECRET n'est pas définie sur Netlify, tout est refusé.

const { getStore, connectLambda } = require('@netlify/blobs');
const crypto = require('crypto');

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
const CODE_RE = /^[A-Z0-9]{4,16}$/;

function secretMatches(given) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || typeof given !== 'string' || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const publicShape = (m) => ({ code: m.code, label: m.label || m.email || '(sans nom)', active: m.active !== false });

exports.handler = async (event) => {
  connect(event);
  if (!process.env.ADMIN_SECRET) return json(500, { error: 'admin_secret_not_configured' });
  const headers = event.headers || {};
  if (!secretMatches(headers['x-admin-secret'])) return json(401, { error: 'unauthorized' });

  const members = blobStore('hunter-log-members');
  const emails = blobStore('hunter-log-member-emails'); // email (minuscule) -> code

  if (event.httpMethod === 'GET') {
    const { blobs } = await members.list();
    const list = [];
    for (const { key } of blobs) {
      const m = await members.get(key, { type: 'json' }).catch(() => null);
      if (m) list.push({ ...m, code: m.code || key });
    }
    list.sort((a, b) => (b.created || 0) - (a.created || 0));
    return json(200, { members: list.map(publicShape) });
  }

  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  let body;
  try { body = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
  const action = body && body.action;
  const code = (body && body.code ? String(body.code) : '').trim().toUpperCase();

  if (action === 'register') {
    if (!CODE_RE.test(code)) return json(400, { error: 'bad_code' });
    if (await members.getMetadata(code)) return json(409, { error: 'code_exists' });
    const label = String(body.label || '').trim().slice(0, 80) || null;
    const email = String(body.email || (label && label.includes('@') ? label : '')).trim().toLowerCase() || null;
    await members.setJSON(code, { code, label, email, active: true, created: Date.now() });
    if (email) await emails.set(email, code);
    return json(200, { ok: true, code });
  }

  if (action === 'toggle' || action === 'enable' || action === 'disable') {
    if (!CODE_RE.test(code)) return json(400, { error: 'bad_code' });
    const m = await members.get(code, { type: 'json' });
    if (!m) return json(404, { error: 'code_not_found' });
    m.active = action === 'toggle' ? !!body.active : action === 'enable';
    m.changedAt = Date.now();
    await members.setJSON(code, m);
    return json(200, { ok: true, member: publicShape(m) });
  }

  if (action === 'disableByEmail') {
    const email = String(body.email || '').trim().toLowerCase();
    if (!email) return json(400, { error: 'missing_email' });
    const found = await emails.get(email);
    if (!found) return json(404, { error: 'email_not_found' });
    const m = await members.get(found, { type: 'json' });
    if (m) { m.active = false; m.changedAt = Date.now(); await members.setJSON(found, m); }
    return json(200, { ok: true, code: found });
  }

  return json(400, { error: 'unknown_action' });
};
