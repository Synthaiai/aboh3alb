const CACHE_NAME = 'h3alb-v44';
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
    // addAll يفشل كله إذا فشل ملف واحد → نضيف كل ملف على حدة
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(ASSETS.map(a => cache.add(a).catch(() => {})))
    )
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

/* الطلبات التي لا يجوز للـ SW أن يلمسها أبداً:
   اتصال فايربيس الحيّ (long-polling / websocket) وواتساب.
   كان الكود القديم يخزّن هذه الطلبات، وأخطر من ذلك: عند انقطاع النت يرجّع
   محتوى index.html كجواب لطلب فايربيس → مكتبة فايربيس تتوهان والموقع يعلّق.
   ملاحظة: تُفحَص بعد الخطوط والصور، لأن fonts.googleapis.com ينتهي
   بـ googleapis.com ولازم يبقى مخزّناً حتى تشتغل الخطوط بدون نت. */
function isLiveApi(url) {
  const h = url.hostname;
  return h.endsWith('firebaseio.com') ||
         h.endsWith('firebasedatabase.app') ||
         h.endsWith('googleapis.com') ||
         h.endsWith('google-analytics.com') ||
         h.endsWith('wa.me') ||
         h.endsWith('whatsapp.com');
}

function isStaticAsset(url) {
  return url.hostname.includes('fonts.googleapis.com') ||
         url.hostname.includes('fonts.gstatic.com') ||
         url.hostname.includes('unpkg.com') ||
         /\.(webp|png|jpe?g|gif|avif|svg|woff2?)$/i.test(url.pathname);
}

// 3. Fetch - Smart Strategy
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  let url;
  try { url = new URL(e.request.url); } catch (err) { return; }

  // Strategy A: Cache First للصور والخطوط (ثابتة، سرعة وتوفير بيانات وتعمل أوفلاين)
  if (isStaticAsset(url)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && (res.ok || res.type === 'opaque')) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone)).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  // اتصال حيّ (فايربيس/واتساب) → للشبكة مباشرة بلا أي تدخّل من الكاش
  if (isLiveApi(url)) return;

  // Strategy B: Network First لملفات الموقع نفسه (HTML/CSS/JS)
  // أونلاين → أحدث نسخة ونحدّث الكاش. أوفلاين → الكاش فيشتغل الموقع بدون نت.
  if (url.origin !== self.location.origin) return;   // أي نطاق آخر: لا نتدخّل

  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.ok) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone)).catch(() => {});
      }
      return res;
    }).catch(() =>
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        // بديل الصفحة الكاملة يُعطى فقط لطلبات تنقّل حقيقية، لا لأي ملف
        if (e.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      })
    )
  );
});
