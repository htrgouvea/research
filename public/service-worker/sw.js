// Service Worker - Visit tracking using IndexedDB only (no localStorage)
const CACHE_NAME = 'poc-cache-v1';
const DB_NAME = 'poc-visits-db';
const DB_VERSION = 1;
const STORE_NAME = 'visits';

// ============================================
// IndexedDB Helper Functions
// ============================================

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

async function hasVisited(path) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(path);

            request.onerror = () => resolve(false);
            request.onsuccess = () => resolve(!!request.result);

            tx.oncomplete = () => db.close();
        });
    } catch (e) {
        console.log('[SW] IndexedDB error:', e);
        return false;
    }
}

async function markVisited(path) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put({
                id: path,
                timestamp: Date.now(),
                visits: 1
            });

            tx.oncomplete = () => {
                db.close();
                resolve(true);
            };
            tx.onerror = () => {
                db.close();
                resolve(false);
            };
        });
    } catch (e) {
        console.log('[SW] IndexedDB error:', e);
        return false;
    }
}

async function incrementVisit(path) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(path);

            request.onsuccess = () => {
                const data = request.result || { id: path, visits: 0 };
                data.visits = (data.visits || 0) + 1;
                data.lastVisit = Date.now();
                store.put(data);
            };

            tx.oncomplete = () => {
                db.close();
                resolve(true);
            };
        });
    } catch (e) {
        return false;
    }
}

// ============================================
// Service Worker Events
// ============================================

self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pre-caching resources');
                return cache.addAll(['index.html']);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Main fetch handler - injects visit status into HTML responses
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only handle same-origin navigation requests
    if (url.origin !== location.origin) {
        return;
    }

    // Handle HTML page requests
    if (event.request.mode === 'navigate' ||
        event.request.destination === 'document' ||
        url.pathname.endsWith('.html') ||
        url.pathname === '/' ||
        url.pathname.endsWith('/')) {

        event.respondWith(handlePageRequest(event.request, url.pathname));
        return;
    }

    // For other resources, use cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then((cached) => cached || fetch(event.request))
    );
});

async function handlePageRequest(request, path) {
    const visitPath = path || '/';
    const alreadyVisited = await hasVisited(visitPath);

    console.log('[SW] Page request:', visitPath, 'Already visited:', alreadyVisited);

    // Get the response (from cache or network)
    let response;
    try {
        const cached = await caches.match(request);
        response = cached || await fetch(request);

        // Cache the response for future use
        if (!cached && response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
    } catch (e) {
        response = await caches.match(request);
        if (!response) {
            return new Response('Offline', { status: 503 });
        }
    }

    // Modify the HTML to inject visit status
    const html = await response.text();

    // Inject a script that sets the visit status BEFORE any other script runs
    const injectedScript = `
<script>
// Injected by Service Worker - DO NOT REMOVE
window.__SW_VISIT_STATUS__ = {
    isRepeatVisit: ${alreadyVisited},
    path: "${visitPath}",
    timestamp: ${Date.now()},
    source: "service-worker-indexeddb"
};
console.log('[SW-INJECT] Visit status:', window.__SW_VISIT_STATUS__);
</script>`;

    // Inject right after <head> tag
    const modifiedHtml = html.replace(
        /<head[^>]*>/i,
        (match) => match + injectedScript
    );

    // Mark as visited AFTER serving (so first visit is clean)
    if (!alreadyVisited) {
        await markVisited(visitPath);
    } else {
        await incrementVisit(visitPath);
    }

    // Return modified response with custom header
    return new Response(modifiedHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: {
            ...Object.fromEntries(response.headers.entries()),
            'Content-Type': 'text/html; charset=utf-8',
            'X-SW-Visit-Status': alreadyVisited ? 'repeat' : 'fresh',
            'X-SW-Controlled': 'true'
        }
    });
}

// Handle messages from the page
self.addEventListener('message', async (event) => {
    const { type, path } = event.data;

    if (type === 'CHECK_VISIT') {
        const visited = await hasVisited(path || '/');
        event.source.postMessage({
            type: 'VISIT_STATUS',
            visited: visited,
            path: path
        });
    }

    if (type === 'RESET_VISITS') {
        try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).clear();
            tx.oncomplete = () => db.close();
            event.source.postMessage({ type: 'RESET_COMPLETE' });
        } catch (e) {
            event.source.postMessage({ type: 'RESET_ERROR', error: e.message });
        }
    }
});
