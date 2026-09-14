self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(list=>{
    if(list.length>0) return list[0].focus();
    return self.clients.openWindow('.');
  }));
});
// Notification reçue depuis le serveur (Web Push) — fonctionne même app fermée,
// contrairement au check périodique côté page qui, lui, s'arrête en arrière-plan.
self.addEventListener('push', e => {
  let data = {title:'SYSTEM // Hunter Log', body:''};
  try{ data = e.data ? e.data.json() : data; }catch(err){ if(e.data) data.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(data.title, {body:data.body, vibrate:[30,40,30]}));
});
