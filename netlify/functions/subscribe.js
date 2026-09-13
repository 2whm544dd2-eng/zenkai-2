// POST /.netlify/functions/subscribe
// Reçoit l'abonnement push du navigateur + le strict nécessaire d'état de l'app
// (fuseau horaire, si l'engagement de demain est déjà pris, les tâches non-négociables
// du jour) pour que la fonction planifiée (send-reminders.js) sache quoi envoyer et quand.
const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { subscription, timezone, state } = payload || {};
  if (!subscription || !subscription.endpoint) {
    return { statusCode: 400, body: 'Missing subscription' };
  }

  // Un identifiant stable par appareil, dérivé de l'endpoint (jamais l'endpoint en clair
  // comme clé, par simple hygiène — même si ce n'est pas une donnée ultra-sensible ici).
  const deviceId = crypto.createHash('sha256').update(subscription.endpoint).digest('hex');

  const store = getStore('hunter-log-subscribers');
  const existingRaw = await store.get(deviceId, { type: 'json' });
  const existing = existingRaw || {};

  const record = {
    subscription,
    timezone: timezone || existing.timezone || 'Europe/Paris',
    state: state || existing.state || {},
    // On ne remet PAS à zéro les dates de "déjà notifié" : elles sont gérées par
    // send-reminders.js et ne doivent pas se réinitialiser à chaque simple sync d'état.
    eveningNotifiedDate: existing.eveningNotifiedDate || null,
    morningNotifiedDate: existing.morningNotifiedDate || null,
    deadlineNotifiedDate: existing.deadlineNotifiedDate || null,
    updatedAt: new Date().toISOString(),
  };

  await store.setJSON(deviceId, record);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, deviceId }),
  };
};
