// netlify/functions/oath.js — "Serment Inné" : objectif public + classement.
//
//   GET                                           -> { oaths: [{ displayName, text, level, rank }] }
//                                                    (public, trié par niveau décroissant)
//   POST { code, displayName, text, level, rank } -> enregistre / remplace le serment lié à ce code
// (niveau et rang sont déclarés par l'app : c'est un classement communautaire, pas un anti-triche)
//
// Accepté pour un code qui a une sauvegarde synchronisée ou une fiche membre, et qui
// n'est pas désactivé (évite qu'un code inventé au hasard remplisse le classement).
// Appelé depuis l'onglet Succès (panneau « Serment Inné ») et le classement.

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
const CODE_RE = /^[A-Z0-9]{4,16}$/;

exports.handler = async (event) => {
  connect(event);
  const oaths = blobStore('hunter-log-oaths');
  const members = blobStore('hunter-log-members');

  if (event.httpMethod === 'GET') {
    const { blobs } = await oaths.list();
    const list = [];
    for (const { key } of blobs) {
      const o = await oaths.get(key, { type: 'json' }).catch(() => null);
      if (!o) continue;
      const m = await members.get(key, { type: 'json' }).catch(() => null);
      if (m && m.active === false) continue; // ex-membres retirés du classement public
      list.push(o);
    }
    list.sort((a, b) => (b.level || 0) - (a.level || 0) || (b.updated || 0) - (a.updated || 0));
    return json(200, {
      oaths: list.slice(0, 100).map((o) => ({ displayName: o.displayName, text: o.text, level: o.level || null, rank: o.rank || null })),
    });
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
    const code = String((body && body.code) || '').trim().toUpperCase();
    const displayName = String((body && body.displayName) || '').trim().slice(0, 30);
    const text = String((body && body.text) || '').trim().slice(0, 280);
    const level = Math.max(1, Math.min(999, parseInt(body && body.level, 10) || 1));
    const rank = ['E', 'D', 'C', 'B', 'A', 'S'].includes(body && body.rank) ? body.rank : null;
    if (!CODE_RE.test(code) || !displayName || !text) return json(400, { error: 'missing_fields' });

    const m = await members.get(code, { type: 'json' }).catch(() => null);
    if (m && m.active === false) return json(403, { error: 'disabled' });
    if (!m && !(await blobStore('hunter-log-state').getMetadata(code).catch(() => null))) {
      return json(403, { error: 'not_member' });
    }

    await oaths.setJSON(code, { displayName, text, level, rank, updated: Date.now() });
    return json(200, { ok: true });
  }

  return json(405, { error: 'method_not_allowed' });
};
