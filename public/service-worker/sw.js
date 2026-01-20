// Service Worker - Caches pages using CacheFirst strategy
const CACHE_NAME = 'poc-cache-v1';
const CACHE_URLS = [
    'index.html',
    'marker.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching resources');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                // Force activation immediately
                return self.skipWaiting();
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - CacheFirst strategy (like the phishing page)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only handle same-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    console.log('[SW] Fetching:', event.request.url);

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    // Return cached version - this is key to the detection!
                    // The cached HTML is "frozen in time" - marker.js runs
                    // but the main script's timing check may fail
                    return cachedResponse;
                }

                console.log('[SW] Fetching from network:', event.request.url);
                return fetch(event.request).then((response) => {
                    // Cache the new response for future use
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                });
            })
    );
});
