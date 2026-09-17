const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let payload;
  try { payload = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }
  const { subscription, timezone, state } = payload || {};
  if (!subscription || !subscription.endpoint) return { statusCode: 400, body: 'Missing subscription' };

  const deviceId = crypto.createHash('sha256').update(subscription.endpoint).digest('hex');
  const store = blobStore('hunter-log-subscribers');
  const existing = (await store.get(deviceId, { type: 'json' })) || {};
  const record = {
    subscription,
    timezone: timezone || existing.timezone || 'Europe/Paris',
    state: state || existing.state || {},
    eveningNotifiedDate: existing.eveningNotifiedDate || null,
    morningNotifiedDate: existing.morningNotifiedDate || null,
    updatedAt: new Date().toISOString(),
  };
  await store.setJSON(deviceId, record);
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, deviceId }) };
};
