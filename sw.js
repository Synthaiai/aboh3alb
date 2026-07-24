const CACHE_NAME = 'h3alb-v42';
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
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Strategy A: Cache First for Fonts, Icons & Images (Static, rarely change)
  // الصور والخطوط تُخدَم من الكاش مباشرة → سرعة وسلاسة وتوفير بيانات وتعمل أوفلاين.
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com') ||
      url.hostname.includes('unpkg.com') ||
      /\.(webp|png|jpe?g|gif|avif|svg|woff2?)$/i.test(url.pathname)) {
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

  // Strategy B: Network First for HTML, JS, CSS (دائماً أحدث نسخة عند وجود نت)
  // أونلاين → نجيب الجديد من الشبكة ونحدّث الكاش. أوفلاين → نرجع للكاش فيشتغل الموقع بدون نت.
  e.respondWith(
    fetch(e.request).then(res => {
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
      return res;
    }).catch(() =>
      caches.match(e.request).then(cached => cached || caches.match('./index.html'))
    )
  );
});
