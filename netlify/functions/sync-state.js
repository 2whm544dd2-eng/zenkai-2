// netlify/functions/sync-state.js — synchro multi-appareils par code.
//
// Base : la version en production sur GitHub (qui fonctionne). Mêmes stores, mêmes
// clés, même format de données -> les sauvegardes déjà synchronisées restent lisibles.
//   store "hunter-log-state"   : clé = CODE, valeur = { state, updatedAt }
//   store "hunter-log-members" : clé = CODE, valeur = { code, label, email, active, created }
//
// Contrat (identique à ce que index.html envoie) :
//   GET  ?code=XXXXXXXX   -> 200 { state, updatedAt } | 404 (rien encore sauvegardé)
//   POST { code, state }  -> 200 { ok:true, updatedAt }
//   403 { error:"disabled" }   : code désactivé (abonnement annulé)
//   403 { error:"not_member" } : seulement si SYNC_MEMBERS_ONLY=true (voir plus bas)
//
// Règle d'accès :
//   - par défaut (comme en production aujourd'hui) : tout code marche, sauf s'il a été
//     désactivé dans le registre des membres.
//   - variable d'environnement SYNC_MEMBERS_ONLY=true (le jour où l'accès devient payant) :
//     seuls les codes membres actifs ET les codes qui ont déjà une sauvegarde (utilisateurs
//     d'avant) sont acceptés. Un code inventé au hasard est refusé.

const { getStore, connectLambda } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}
function connect(event) {
  // Filet de sécurité : si Netlify fournit le contexte Blobs dans l'événement, on l'utilise
  // (fonctionne alors même sans NETLIFY_SITE_ID / NETLIFY_AUTH_TOKEN).
  try { if (event && event.blobs) connectLambda(event); } catch (e) { /* on garde les variables d'env */ }
}
const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(obj),
});
const normalizeCode = (code) => (code || '').toString().trim().toUpperCase();
const CODE_RE = /^[A-Z0-9]{4,16}$/;

async function checkAccess(stateStore, code) {
  const member = await blobStore('hunter-log-members').get(code, { type: 'json' }).catch(() => null);
  if (member && member.active === false) return { ok: false, error: 'disabled' };
  if (process.env.SYNC_MEMBERS_ONLY === 'true' && !member) {
    const existing = await stateStore.getMetadata(code).catch(() => null);
    if (!existing) return { ok: false, error: 'not_member' };
  }
  return { ok: true };
}

exports.handler = async (event) => {
  connect(event);
  const store = blobStore('hunter-log-state');

  if (event.httpMethod === 'GET') {
    const code = normalizeCode(event.queryStringParameters && event.queryStringParameters.code);
    if (!CODE_RE.test(code)) return json(400, { error: 'bad_code' });
    const access = await checkAccess(store, code);
    if (!access.ok) return json(403, { error: access.error });
    const record = await store.get(code, { type: 'json' });
    if (!record) return json(404, { error: 'no_state' });
    return json(200, { state: record.state, updatedAt: record.updatedAt });
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try { payload = JSON.parse(event.body); } catch (e) { return json(400, { error: 'bad_json' }); }
    const code = normalizeCode(payload && payload.code);
    const state = payload && payload.state;
    if (!CODE_RE.test(code) || !state || typeof state !== 'object') return json(400, { error: 'missing_fields' });
    const access = await checkAccess(store, code);
    if (!access.ok) return json(403, { error: access.error });

    const updatedAt = Date.now(); // le serveur est la seule horloge de référence
    await store.setJSON(code, { state, updatedAt });
    return json(200, { ok: true, updatedAt });
  }

  return json(405, { error: 'method_not_allowed' });
};
