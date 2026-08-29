const CACHE='siabsen-qr-v1';
const APP_SHELL=['./','./index.html','./scanner.html','./css/style.css','./js/config.js','./js/api.js','./js/auth.js','./js/ui.js','./js/qr.js','./js/app.js','./manifest.json','./assets/logo.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
    const copy=r.clone(); caches.open(CACHE).then(x=>x.put(e.request,copy)); return r;
  }).catch(()=>caches.match('./index.html'))));
});
