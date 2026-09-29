// netlify/functions/broadcast.js — notification push envoyée à tous les appareils abonnés.
//
//   POST { title?, body } + header "x-admin-secret" = ADMIN_SECRET
//   -> { ok, sent, expired, failed }
//
// Lit le même store que subscribe.js / send-reminders.js ("hunter-log-subscribers").

const webpush = require('web-push');
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
function secretMatches(given) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || typeof given !== 'string' || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

exports.handler = async (event) => {
  connect(event);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!process.env.ADMIN_SECRET) return json(500, { error: 'admin_secret_not_configured' });
  if (!secretMatches((event.headers || {})['x-admin-secret'])) return json(401, { error: 'unauthorized' });
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return json(500, { error: 'vapid_keys_not_configured' });

  let input;
  try { input = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
  const body = String((input && input.body) || '').trim();
  if (!body) return json(400, { error: 'missing_body' });
  const title = String((input && input.title) || 'SYSTEM // Hunter Log');

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:contact@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const store = blobStore('hunter-log-subscribers');
  const { blobs } = await store.list();
  const payload = JSON.stringify({ title, body });
  let sent = 0, expired = 0, failed = 0;
  for (const { key } of blobs) {
    const record = await store.get(key, { type: 'json' }).catch(() => null);
    if (!record || !record.subscription) continue;
    try {
      await webpush.sendNotification(record.subscription, payload);
      sent++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) { await store.delete(key); expired++; }
      else { failed++; console.error('broadcast: push failed', err.statusCode); }
    }
  }
  return json(200, { ok: true, sent, expired, failed });
};
