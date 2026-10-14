// netlify/functions/oath.js — "Serment Inné" : objectif public + classement + encouragements (build 78).
//
//   GET                       -> { oaths: [{ id, displayName, text, level, rank, cheers, cheeredToday? }] }
//                                (public, trié par niveau ; ?code=XXX ajoute cheeredToday pour ce joueur)
//   GET ?me=CODE              -> { me: { cheers, recent:[{name, at}] } }   (léger : une seule lecture)
//   POST { code, displayName, text, level, rank, subscription? }
//                             -> enregistre / remplace le serment lié à ce code
//                                (les encouragements sont conservés tant que le texte ne change pas)
//   POST { action:'cheer', code, target, fromName }
//                             -> encourage le serment `target` (id public), 1 fois par jour et par serment,
//                                + notification push au propriétaire s'il l'a autorisée.
//
// L'id public est un hachage du code : le code de synchro n'est jamais exposé dans le classement.
// Accepté pour un code qui a une sauvegarde synchronisée ou une fiche membre, et qui n'est pas désactivé.

const crypto = require('crypto');
const { getStore, connectLambda } = require('@netlify/blobs');
let webpush = null; try { webpush = require('web-push'); } catch (e) { /* notifications facultatives */ }

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
const publicId = (code) => crypto.createHash('sha256').update('zenkai-oath:' + code).digest('hex').slice(0, 16);
const dayKey = () => new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 10);   // jour ~ heure de Bruxelles

async function allowedCode(code, members) {
  const m = await members.get(code, { type: 'json' }).catch(() => null);
  if (m && m.active === false) return 'disabled';
  if (process.env.ACCESS_MODE === 'closed' && !m) return 'not_member';   // build 78 : bêta privée
  if (!m && !(await blobStore('hunter-log-state').getMetadata(code).catch(() => null))) return 'not_member';
  return null;
}

exports.handler = async (event) => {
  connect(event);
  const oaths = blobStore('hunter-log-oaths');
  const members = blobStore('hunter-log-members');
  const q = event.queryStringParameters || {};

  if (event.httpMethod === 'GET') {
    if (process.env.ACCESS_MODE === 'closed') {   // build 78 : lecture du classement réservée aux codes actifs
      const c = String(q.code || q.me || '').trim().toUpperCase();
      if (!CODE_RE.test(c)) return json(403, { error: 'not_member' });
      const refused = await allowedCode(c, members);
      if (refused) return json(403, { error: refused });
    }
    if (q.me) {   // compteur personnel : une seule lecture de blob
      const code = String(q.me).trim().toUpperCase();
      if (!CODE_RE.test(code)) return json(400, { error: 'bad_code' });
      const o = await oaths.get(code, { type: 'json' }).catch(() => null);
      return json(200, { me: o ? { cheers: o.cheers || 0, recent: (o.recent || []).slice(-20) } : null });
    }
    const viewer = q.code && CODE_RE.test(String(q.code).toUpperCase()) ? publicId(String(q.code).toUpperCase()) : null;
    const today = dayKey();
    const { blobs } = await oaths.list();
    const list = [];
    for (const { key } of blobs) {
      const o = await oaths.get(key, { type: 'json' }).catch(() => null);
      if (!o) continue;
      const m = await members.get(key, { type: 'json' }).catch(() => null);
      if (m && m.active === false) continue; // ex-membres retirés du classement public
      list.push({ ...o, id: publicId(key) });
    }
    list.sort((a, b) => (b.level || 0) - (a.level || 0) || (b.updated || 0) - (a.updated || 0));
    return json(200, {
      oaths: list.slice(0, 100).map((o) => ({
        id: o.id, displayName: o.displayName, text: o.text, level: o.level || null, rank: o.rank || null,
        cheers: o.cheers || 0,
        ...(viewer ? { mine: o.id === viewer, cheeredToday: !!(o.cheerLog && o.cheerLog[viewer] === today) } : {}),
      })),
    });
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
    const code = String((body && body.code) || '').trim().toUpperCase();
    if (!CODE_RE.test(code)) return json(400, { error: 'missing_fields' });
    const refused = await allowedCode(code, members);
    if (refused) return json(403, { error: refused });

    // ---- encourager un serment
    if (body.action === 'cheer') {
      const target = String(body.target || '');
      const myId = publicId(code);
      if (!/^[0-9a-f]{16}$/.test(target) || target === myId) return json(400, { error: 'bad_target' });
      const { blobs } = await oaths.list();
      const key = (blobs.find(({ key }) => publicId(key) === target) || {}).key;
      if (!key) return json(404, { error: 'not_found' });
      const o = await oaths.get(key, { type: 'json' }).catch(() => null);
      if (!o) return json(404, { error: 'not_found' });
      const today = dayKey();
      o.cheerLog = o.cheerLog || {};
      if (o.cheerLog[myId] === today) return json(200, { ok: true, already: true, cheers: o.cheers || 0 });
      // on ne garde que les entrées du jour (le journal ne grossit pas indéfiniment)
      for (const k of Object.keys(o.cheerLog)) if (o.cheerLog[k] !== today) delete o.cheerLog[k];
      o.cheerLog[myId] = today;
      o.cheers = (o.cheers || 0) + 1;
      const fromName = String(body.fromName || '').trim().slice(0, 30) || 'Un chasseur';
      o.recent = (o.recent || []).concat([{ name: fromName, at: Date.now() }]).slice(-20);
      await oaths.setJSON(key, o);

      // notification push au propriétaire (facultative)
      if (webpush && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && Array.isArray(o.subs) && o.subs.length) {
        webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:contact@example.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
        const payload = JSON.stringify({ title: 'SERMENT INNÉ', body: `🔥 ${fromName} t'encourage : « ${String(o.text).slice(0, 80)} »`, tag: 'zenkai-cheer' });
        const alive = [];
        for (const s of o.subs) {
          try { await webpush.sendNotification(s, payload, { TTL: 3600 }); alive.push(s); }
          catch (e) { if (!(e && (e.statusCode === 404 || e.statusCode === 410))) alive.push(s); }
        }
        if (alive.length !== o.subs.length) { o.subs = alive; await oaths.setJSON(key, o); }
      }
      return json(200, { ok: true, cheers: o.cheers });
    }

    // ---- prêter / mettre à jour son serment
    const displayName = String((body && body.displayName) || '').trim().slice(0, 30);
    const text = String((body && body.text) || '').trim().slice(0, 280);
    const level = Math.max(1, Math.min(999, parseInt(body && body.level, 10) || 1));
    const rank = ['E', 'D', 'C', 'B', 'A', 'S'].includes(body && body.rank) ? body.rank : null;
    if (!displayName || !text) return json(400, { error: 'missing_fields' });

    const prev = (await oaths.get(code, { type: 'json' }).catch(() => null)) || {};
    const sameOath = prev.text === text;   // nouveau serment = compteur remis à zéro
    let subs = Array.isArray(prev.subs) ? prev.subs : [];
    const sub = body.subscription;
    if (sub && typeof sub.endpoint === 'string' && !subs.some((s) => s.endpoint === sub.endpoint)) subs = subs.concat([sub]).slice(-3);
    await oaths.setJSON(code, {
      displayName, text, level, rank, updated: Date.now(),
      cheers: sameOath ? (prev.cheers || 0) : 0,
      recent: sameOath ? (prev.recent || []) : [],
      cheerLog: sameOath ? (prev.cheerLog || {}) : {},
      subs,
    });
    return json(200, { ok: true, id: publicId(code) });
  }

  return json(405, { error: 'method_not_allowed' });
};
