const CACHE_NAME = 'h3alb-v40';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './firebase-config.js',
  './logo1.png',
  './texture.webp',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Outfit:wght@400;600;700&display=swap'
];

// 1. Install - Cache core shell
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// 2. Activate - Cleanup old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

// 3. Fetch - Smart Strategy
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Strategy A: Cache First for Fonts, Icons & Images (Static, rarely change)
  // الصور تُخزَّن وتُخدَم من الكاش مباشرة بعد أول تحميل → سرعة وسلاسة وتوفير بيانات.
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com') ||
      url.hostname.includes('unpkg.com') ||
      /\.(webp|png|jpe?g|gif|avif|svg)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        return cached || fetch(e.request).then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
          return res;
        });
      })
    );
    return;
  }

  // Strategy B: Stale-While-Revalidate for JS, CSS, HTML
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networked = fetch(e.request).then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return res;
      }).catch(() => null);

      return cached || networked;
    })
  );
});
