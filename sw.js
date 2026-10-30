const CACHE_NAME = 'kurd-tv-radio-v2.0-live';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  // Always fetch live video/audio streams directly from network
  if (
    url.includes('.m3u8') ||
    url.includes('.ts') ||
    url.includes('.fmp4') ||
    url.includes('.mp3') ||
    url.includes('.aac') ||
    url.includes('api.alquran.cloud') ||
    url.includes('version.json')
  ) {
    return;
  }

  // Network First for HTML & Assets to ensure instant updates, fallback to cache
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && e.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => caches.match(e.request))
  );
});
