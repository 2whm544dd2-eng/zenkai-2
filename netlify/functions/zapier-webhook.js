// netlify/functions/zapier-webhook.js — automatisation Skool -> Zapier -> ZENKAI.
//
//   POST { secret, action:"join",   email } -> crée (ou réactive) le code du membre
//                                              -> { ok, code, reactivated }
//   POST { secret, action:"cancel", email } -> désactive le code lié à cet email
//
// `secret` doit être égal à la variable d'environnement ZAPIER_WEBHOOK_SECRET ; si elle
// n'est pas définie sur Netlify, tout est refusé.
// Le code renvoyé par "join" doit être transmis au membre par une étape Zapier suivante
// (email ou message Skool) : cette fonction ne l'envoie pas elle-même.

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
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // même alphabet que l'app (sans 0/O, 1/I)

function secretMatches(given) {
  const expected = process.env.ZAPIER_WEBHOOK_SECRET;
  if (!expected || typeof given !== 'string' || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function newCode() {
  let c = '';
  for (let i = 0; i < 8; i++) c += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return c;
}

exports.handler = async (event) => {
  connect(event);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!process.env.ZAPIER_WEBHOOK_SECRET) return json(500, { error: 'webhook_secret_not_configured' });

  let body;
  try { body = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
  if (!secretMatches(body && body.secret)) return json(401, { error: 'unauthorized' });

  const email = String(body.email || '').trim().toLowerCase();
  if (!email) return json(400, { error: 'missing_email' });

  const members = blobStore('hunter-log-members');
  const emails = blobStore('hunter-log-member-emails');

  if (body.action === 'join') {
    // Membre qui revient après une annulation : on réactive son ancien code (ses données
    // synchronisées sont rattachées à ce code) au lieu d'en créer un second.
    const existing = await emails.get(email);
    if (existing) {
      const m = await members.get(existing, { type: 'json' });
      if (m) {
        m.active = true;
        m.changedAt = Date.now();
        await members.setJSON(existing, m);
        return json(200, { ok: true, code: existing, reactivated: true });
      }
    }
    let code = newCode();
    while (await members.getMetadata(code)) code = newCode();
    await members.setJSON(code, { code, label: email, email, active: true, created: Date.now() });
    await emails.set(email, code);
    return json(200, { ok: true, code, reactivated: false });
  }

  if (body.action === 'cancel') {
    const code = await emails.get(email);
    if (!code) return json(404, { error: 'email_not_found' }); // membre ajouté à la main sans email
    const m = await members.get(code, { type: 'json' });
    if (m) { m.active = false; m.changedAt = Date.now(); await members.setJSON(code, m); }
    return json(200, { ok: true, code, disabled: true });
  }

  return json(400, { error: 'unknown_action' });
};
