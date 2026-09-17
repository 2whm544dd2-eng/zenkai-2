const webpush = require('web-push');
const { getStore } = require('@netlify/blobs');

function blobStore(name) {
  return getStore({ name, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN });
}

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:contact@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function todayInTimezone(timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', hour12:false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return { dateStr: `${get('year')}-${get('month')}-${get('day')}`, hour: parseInt(get('hour'), 10) };
}

exports.handler = async () => {
  const store = blobStore('hunter-log-subscribers');
  const { blobs } = await store.list();
  for (const { key: deviceId } of blobs) {
    const record = await store.get(deviceId, { type: 'json' });
    if (!record || !record.subscription) continue;
    const { dateStr: today, hour } = todayInTimezone(record.timezone);
    const state = record.state || {};
    let changed = false;
    const alreadySetForTomorrow = state.commitmentForDate && state.commitmentForDate > today;
    if (hour >= 20 && !alreadySetForTomorrow && state.hasPendingTasks && record.eveningNotifiedDate !== today) {
      const sent = await sendPush(record.subscription, { title:'SYSTEM // Hunter Log', body:"🌙 Quelle(s) tâche(s) sont non-négociables demain ?" });
      if (sent) { record.eveningNotifiedDate = today; changed = true; }
      else if (sent === null) { await store.delete(deviceId); continue; }
    }
    if (state.commitmentForDate === today && Array.isArray(state.commitmentTaskNames) && state.commitmentTaskNames.length && record.morningNotifiedDate !== today) {
      const sent = await sendPush(record.subscription, { title:'SYSTEM // Hunter Log', body:`🌟 Non-négociable aujourd'hui : ${state.commitmentTaskNames.join(', ')}` });
      if (sent) { record.morningNotifiedDate = today; changed = true; }
      else if (sent === null) { await store.delete(deviceId); continue; }
    }
    if (changed) await store.setJSON(deviceId, record);
  }
  return { statusCode: 200, body: 'ok' };
};

async function sendPush(subscription, payload) {
  try { await webpush.sendNotification(subscription, JSON.stringify(payload)); return true; }
  catch (err) { if (err.statusCode === 410 || err.statusCode === 404) return null; console.error('Push failed:', err.statusCode, err.body); return false; }
}
