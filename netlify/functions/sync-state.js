const { getStore } = require('@netlify/blobs');

function normalizeCode(code) {
  return (code || '').toString().trim().toUpperCase();
}

exports.handler = async (event) => {
  const store = getStore('hunter-log-state');

  if (event.httpMethod === 'GET') {
    const code = normalizeCode(event.queryStringParameters && event.queryStringParameters.code);
    if (!code) return { statusCode: 400, body: 'Missing code' };
    const record = await store.get(code, { type: 'json' });
    if (!record) return { statusCode: 404, body: 'Not found' };
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) };
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try { payload = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }
    const code = normalizeCode(payload.code);
    const { state, updatedAt } = payload;
    if (!code || !state || !updatedAt) return { statusCode: 400, body: 'Missing fields' };

    const existing = await store.get(code, { type: 'json' });
    if (existing && existing.updatedAt > updatedAt) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, applied: false, serverUpdatedAt: existing.updatedAt }) };
    }

    await store.setJSON(code, { state, updatedAt });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, applied: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
