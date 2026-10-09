// อัปเดตเลขเวอร์ชันแคชเพื่อบังคับให้เบราว์เซอร์โหลด index.html ตัวใหม่ล่าสุด
const CACHE = 'shop-v18';
const FILES = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ลองโหลดจากเน็ตก่อน (ได้เวอร์ชันล่าสุด) ถ้าออฟไลน์ค่อยดึงจาก Cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
