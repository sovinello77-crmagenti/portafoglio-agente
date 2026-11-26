/* Portafoglio Agente: tiene in memoria l'app per aprirla anche senza connessione.
   Prima prova la rete (così gli aggiornamenti arrivano subito), poi la copia salvata. */
const CACHE='portafoglio-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  const own=u.origin===location.origin,lib=/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if(!own&&!lib)return;                       /* OneDrive e accesso Microsoft: mai in cache */
  const key=own&&u.search?new Request(u.origin+u.pathname):r;
  e.respondWith(fetch(r,own?{cache:'no-cache'}:{}).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(key,c))}return res})
    .catch(()=>caches.match(key).then(m=>m||caches.match('./'))));
});
