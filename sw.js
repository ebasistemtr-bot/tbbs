const CACHE_NAME = "ty-veri-ambari-v1";

self.addEventListener("install", (e) => {
    console.log("[Service Worker] Motor Kuruluyor...");
});

// Çevrimdışı (offline) çalışmayı desteklemek için basit bir ağ yakalayıcı
self.addEventListener("fetch", (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});