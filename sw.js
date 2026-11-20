// Кэширование страницы «Ферриты импидера»: работа без интернета после первого открытия.
// При обновлении файлов на сайте увеличьте номер версии ниже.
var CACHE = 'ferrity-2026-11-20-1';
var FILES = ['ferrity.html', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'manifest.json'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('ferrity-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  // сначала сеть (обновления), без сети — из кэша
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
