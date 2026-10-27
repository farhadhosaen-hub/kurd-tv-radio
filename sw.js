const CACHE_NAME = 'kurd-tv-radio-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Let network handle media streams directly
  if (e.request.url.includes('.m3u8') || e.request.url.includes('.ts') || e.request.url.includes('.fmp4') || e.request.url.includes('.mp3')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});