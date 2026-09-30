// netlify/functions/vapid-key.js — renvoie la clé publique VAPID configurée sur Netlify.
// Avant, la clé publique n'existait qu'en dur dans index.html : si la paire de clés des
// variables Netlify ne correspondait pas, tous les push échouaient sans message. L'app
// demande maintenant la clé ici (et garde la clé en dur comme secours).
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
  body: JSON.stringify({ key: process.env.VAPID_PUBLIC_KEY || null }),
});
