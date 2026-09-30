// sw.js — ZENKAI / Hunter Log
// Service worker statique (remplace l'ancien enregistrement via blob: URL,
// que Chrome/Firefox refusent silencieusement : "Failed to register a
// ServiceWorker: The URL protocol of the script ('blob:...') is not supported").
// Sert les notifications Web Push reçues même quand l'app est fermée.

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
  const opts = {body:data.body, vibrate:[30,40,30]};
  if(data.tag){ opts.tag = data.tag; opts.renotify = true; }
  if(data.pomoAt) opts.data = {pomoAt:data.pomoAt};
  e.waitUntil((async () => {
    if(data.tag === 'hunter-log-pomo'){
      // Fin de pomodoro envoyée par le serveur. Si l'app est à l'écran, elle a déjà
      // prévenu elle-même ; si la même notification est déjà affichée (l'app l'a montrée
      // en arrière-plan), on la remplace en silence. On affiche quand même quelque chose :
      // Chrome et Safari exigent une notification pour chaque push reçu.
      const wins = await self.clients.matchAll({type:'window', includeUncontrolled:true});
      const visible = wins.some(w => w.visibilityState === 'visible');
      const shown = await self.registration.getNotifications({tag:data.tag});
      const dup = shown.some(n => n.data && n.data.pomoAt && n.data.pomoAt === data.pomoAt);
      if(visible || dup){ opts.silent = true; opts.renotify = false; delete opts.vibrate; }
    }
    return self.registration.showNotification(data.title || 'SYSTEM // Hunter Log', opts);
  })());
});
