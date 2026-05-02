const CACHE_NAME = "TBBSY-v10";

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
// YENİ NESİL: Ağ öncelikli (Network-First) ve Otomatik Güncelleyen Strateji
self.addEventListener("fetch", (e) => {
    // Sadece "http/https" ile başlayan (sitenize ait) istekleri yakala
    if (!e.request.url.startsWith('http')) return;
    
    e.respondWith(
        fetch(e.request).then((response) => {
            // İnternet varsa YENİ dosyayı indir, anında önbelleği güncelle (Kullanıcı hep en yeniyi görsün)
            const kopya = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, kopya));
            return response;
        }).catch(() => caches.match(e.request)) // İnternet kesilirse (Offline) önbellekteki son kopyayı ver
    );
});