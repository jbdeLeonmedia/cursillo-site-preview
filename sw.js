/* National Cursillo Movement service worker v3-20261125. Network-first pages, cache-first hashed assets. No update prompts. */
const B='/cursillo-site-preview/';
const CACHE='ncm-v3-20261125-b20daeb4b9';
const CORE=["/cursillo-site-preview/", "/cursillo-site-preview/espanol/", "/cursillo-site-preview/tieng-viet/", "/cursillo-site-preview/404.html", "/cursillo-site-preview/manifest.webmanifest", "/cursillo-site-preview/assets/css/site.7432927185.css", "/cursillo-site-preview/assets/js/site.42893a4734.js", "/cursillo-site-preview/assets/js/data.ab75e48e67.js", "/cursillo-site-preview/assets/brand/favicon.svg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request; if(req.method!=='GET')return; const url=new URL(req.url); if(url.origin!==location.origin)return;
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res})
   .catch(()=>caches.match(req).then(r=>r||caches.match(url.pathname.startsWith(B+'espanol/')?B+'espanol/':url.pathname.startsWith(B+'tieng-viet/')?B+'tieng-viet/':B))));return;
 }
 if(url.pathname.startsWith(B+'assets/')){
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res})));
 }
});
