// netlify/functions/sync-state.js — synchro multi-appareils par code.
//
// Base : la version en production sur GitHub (qui fonctionne). Mêmes stores, mêmes
// clés, même format de données -> les sauvegardes déjà synchronisées restent lisibles.
//   store "hunter-log-state"   : clé = CODE, valeur = { state, updatedAt }
//   store "hunter-log-members" : clé = CODE, valeur = { code, label, email, active, created }
//
// Contrat (identique à ce que index.html envoie) :
//   GET  ?code=XXXXXXXX   -> 200 { state, updatedAt } | 404 (rien encore sauvegardé)
//   POST { code, state, baseTs? } -> 200 { ok:true, updatedAt } | 409 { error:"conflict", state, updatedAt }
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

// build 78 : ACCESS_MODE=closed (bêta privée) → seuls les codes membres actifs, sur 2 appareils au plus.
// Un appareil d'une ancienne version (sans deviceId) n'est pas bloqué : il reçoit la mise à jour au prochain lancement.
const MAX_DEVICES = 2;
const DEVICE_RE = /^[a-z0-9]{12,40}$/;
function registerDevice(m, deviceId) {
  const day = new Date().toISOString().slice(0, 10);
  m.devices = Array.isArray(m.devices) ? m.devices : [];
  const d = m.devices.find((x) => x.id === deviceId);
  if (d) { if (d.last !== day) { d.last = day; return { ok: true, changed: true }; } return { ok: true, changed: false }; }
  if (m.devices.length >= MAX_DEVICES) return { ok: false };
  m.devices.push({ id: deviceId, first: day, last: day });
  return { ok: true, changed: true };
}
async function checkAccess(stateStore, code, deviceId) {
  const members = blobStore('hunter-log-members');
  const member = await members.get(code, { type: 'json' }).catch(() => null);
  if (member && member.active === false) return { ok: false, error: 'disabled' };
  if (process.env.ACCESS_MODE === 'closed' && !member) return { ok: false, error: 'not_member' };
  if (process.env.SYNC_MEMBERS_ONLY === 'true' && !member) {
    const existing = await stateStore.getMetadata(code).catch(() => null);
    if (!existing) return { ok: false, error: 'not_member' };
  }
  let changed = false;
  if (member && deviceId && DEVICE_RE.test(deviceId)) {
    const r = registerDevice(member, deviceId);
    if (!r.ok) return { ok: false, error: 'too_many_devices' };
    changed = r.changed;
  }
  return { ok: true, member, members, changed };
}
// Suivi d'usage visible dans /admin : uniquement des chiffres (niveau, jours actifs), jamais le contenu.
function usageOf(state) {
  const days = new Set(), now = new Date();
  const from = new Date(now.getTime() - 6 * 864e5).toISOString().slice(0, 10);
  (Array.isArray(state.history) ? state.history : []).forEach((h) => { if (h && h.date >= from && (h.xpGained || 0) > 0) days.add(h.date); });
  const t = state.todayStats || {};
  if (t.date && t.date >= from && (t.xpGained || 0) > 0) days.add(t.date);
  const all = [...(Array.isArray(state.history) ? state.history : []).filter((h) => h && (h.xpGained || 0) > 0).map((h) => h.date), (t.xpGained || 0) > 0 ? t.date : null].filter(Boolean).sort();
  return { level: Number(state.hunterLevel) || 1, daysActive7: days.size, lastActive: all.length ? all[all.length - 1] : null };
}

exports.handler = async (event) => {
  connect(event);
  const store = blobStore('hunter-log-state');

  if (event.httpMethod === 'GET') {
    const code = normalizeCode(event.queryStringParameters && event.queryStringParameters.code);
    if (!CODE_RE.test(code)) return json(400, { error: 'bad_code' });
    const access = await checkAccess(store, code, String(event.queryStringParameters.device || '').toLowerCase());
    if (!access.ok) return json(403, { error: access.error });
    if (access.changed) await access.members.setJSON(code, access.member).catch(() => {});
    // build 78 : ?since=<horodatage connu de l'app> → si rien n'a changé, réponse de quelques octets
    // (lecture des seules métadonnées) au lieu de renvoyer tout l'état à chaque vérification.
    const since = Number(event.queryStringParameters && event.queryStringParameters.since) || 0;
    if (since > 0) {
      const meta = await store.getMetadata(code).catch(() => null);
      const mts = meta && meta.metadata && Number(meta.metadata.updatedAt);
      if (mts && mts <= since) return json(200, { unchanged: true, updatedAt: mts });
    }
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
    const access = await checkAccess(store, code, String(payload.deviceId || '').toLowerCase());
    if (!access.ok) return json(403, { error: access.error });
    if (access.member) {   // dernière activité + chiffres d'usage (écrits seulement s'ils changent)
      const m = access.member, usage = usageOf(state), day = new Date().toISOString().slice(0, 10);
      if (access.changed || m.lastSeen !== day || JSON.stringify(m.usage) !== JSON.stringify(usage)) {
        m.lastSeen = day; m.usage = usage;
        await access.members.setJSON(code, m).catch(() => {});
      }
    }

    // Anti-écrasement : l'app envoie baseTs = version serveur dont descend son état. Si le serveur
    // a reçu depuis une version plus récente (autre appareil), on refuse et on renvoie cette
    // version : l'appareil en retard la charge au lieu d'écraser les changements de l'autre.
    // Les anciennes versions de l'app (sans baseTs) gardent l'ancien comportement.
    if (typeof payload.baseTs === 'number') {
      const current = await store.get(code, { type: 'json' }).catch(() => null);
      if (current && current.updatedAt > payload.baseTs) {
        return json(409, { error: 'conflict', state: current.state, updatedAt: current.updatedAt });
      }
    }
    const updatedAt = Date.now(); // le serveur est la seule horloge de référence
    await store.setJSON(code, { state, updatedAt }, { metadata: { updatedAt } });
    return json(200, { ok: true, updatedAt });
  }

  return json(405, { error: 'method_not_allowed' });
};
