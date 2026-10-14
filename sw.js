// sw.js — ZENKAI / Hunter Log
// Service worker statique (remplace l'ancien enregistrement via blob: URL,
// que Chrome/Firefox refusent silencieusement : "Failed to register a
// ServiceWorker: The URL protocol of the script ('blob:...') is not supported").
// Sert les notifications Web Push reçues même quand l'app est fermée.

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => { const keys = await caches.keys(); await Promise.all(keys.filter(k => k.startsWith('zenkai-') && k !== CACHE).map(k => caches.delete(k))); await self.clients.claim(); })()));
// build 78 : l'app s'ouvre aussi sans réseau. Réseau d'abord (les mises à jour arrivent toujours),
// et la dernière copie reçue sert de secours hors ligne. Les fonctions serveur ne sont jamais mises en cache.
const CACHE = 'zenkai-v78';
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if(req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/.netlify/')) return;
  // 10/10 : seule l'app (/ ou /index.html) sert de copie hors ligne ; /admin.html et les autres pages ne la remplacent plus
  const isPage = url.pathname === '/' || url.pathname === '/index.html' || (req.mode === 'navigate' && !url.pathname.endsWith('.html'));
  const isAsset = url.pathname.startsWith('/badges/') || url.pathname.startsWith('/avatars/');
  if(!isPage && !isAsset) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if(isAsset){   // écussons : cache d'abord (ils ne changent quasiment jamais)
      const hit = await cache.match(req); if(hit) return hit;
      const res = await fetch(req); if(res.ok) cache.put(req, res.clone()); return res;
    }
    try{
      const res = await fetch(req);
      if(res.ok) cache.put(isPage ? '/index.html' : req, res.clone());
      return res;
    }catch(err){
      return (await cache.match('/index.html')) || (await cache.match(req)) || Response.error();
    }
  })());
});

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
  let data = {title:'SYSTÈME // ZENKAI', body:''};
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
    return self.registration.showNotification(data.title || 'SYSTÈME // ZENKAI', opts);
  })());
});
