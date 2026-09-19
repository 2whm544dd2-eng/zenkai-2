const { getStore } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function normalizeCode(code) {
  return (code || '').toString().trim().toUpperCase();
}
async function isRevoked(code) {
  const members = blobStore('hunter-log-members');
  const record = await members.get(code, { type: 'json' });
  return !!record && record.active === false;
}

exports.handler = async (event) => {
  const store = blobStore('hunter-log-state');

  if (event.httpMethod === 'GET') {
    const code = normalizeCode(event.queryStringParameters && event.queryStringParameters.code);
    if (!code) return { statusCode: 400, body: 'Missing code' };
    if (await isRevoked(code)) return { statusCode: 403, body: 'Access revoked' };
    const record = await store.get(code, { type: 'json' });
    if (!record) return { statusCode: 404, body: 'Not found' };
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) };
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try { payload = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }
    const code = normalizeCode(payload.code);
    const { state } = payload;
    if (!code || !state) return { statusCode: 400, body: 'Missing fields' };
    if (await isRevoked(code)) return { statusCode: 403, body: 'Access revoked' };

    const updatedAt = Date.now();
    await store.setJSON(code, { state, updatedAt });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, updatedAt }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
