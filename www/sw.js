/* Araç Defterim — çevrimdışı çalışma. İnternet varsa her zaman en yeni dosyaları alır, yoksa kayıtlı kopyayı kullanır. */
const CACHE = "arac-defterim-v1";
const FILES = [
  "./",
  "app.css",
  "app.js",
  "fonts.css",
  "fonts/figtree-latin-400-normal.woff2",
  "fonts/figtree-latin-600-normal.woff2",
  "fonts/figtree-latin-700-normal.woff2",
  "fonts/figtree-latin-ext-400-normal.woff2",
  "fonts/figtree-latin-ext-600-normal.woff2",
  "fonts/figtree-latin-ext-700-normal.woff2",
  "fonts/saira-condensed-latin-600-normal.woff2",
  "fonts/saira-condensed-latin-700-normal.woff2",
  "fonts/saira-condensed-latin-ext-600-normal.woff2",
  "fonts/saira-condensed-latin-ext-700-normal.woff2",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "index.html",
  "manifest.webmanifest",
  "vendor/app.js",
  "vendor/capacitor.js",
  "vendor/filesystem.js",
  "vendor/haptics.js",
  "vendor/local-notifications.js",
  "vendor/preferences.js",
  "vendor/share.js",
  "vendor/status-bar.js",
];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req, {ignoreSearch:true}).then(r => r || caches.match("./index.html"))));
});
