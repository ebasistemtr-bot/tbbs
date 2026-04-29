const CACHE_NAME = "TBBSY-v6";

self.addEventListener("install", (e) => {
    console.log("[Service Worker] Motor Kuruluyor... Versiyon:", CACHE_NAME);
    // Yeni versiyon geldiğinde tarayıcının bekletmesini engelle ve anında kur
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    console.log("[Service Worker] Yeni versiyon aktif edildi!");
    // Eski versiyonlara ait önbellekleri (cache) temizle
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("[Service Worker] Eski önbellek siliniyor:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Sayfayı yenilemeye gerek kalmadan kontrolü anında ele al
    );
});

// Çevrimdışı (offline) çalışmayı desteklemek için basit bir ağ yakalayıcı
self.addEventListener("fetch", (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});