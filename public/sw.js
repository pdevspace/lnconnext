// Service Worker for Bitcoin Events PWA
const CACHE_NAME = 'bitcoin-events-v1';
const STATIC_CACHE = 'bitcoin-events-static-v1';
const DYNAMIC_CACHE = 'bitcoin-events-dynamic-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/bitcoiner',
  '/organizer',
  '/event',
  '/calendar',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/_next/static/css/',
  '/_next/static/js/',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/bitcoiner/',
  '/api/organizer/',
  '/api/event/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Check if it's an API request
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request);
    }
    
    // Check if it's a static asset
    if (url.pathname.startsWith('/_next/static/') || 
        url.pathname.endsWith('.png') || 
        url.pathname.endsWith('.jpg') || 
        url.pathname.endsWith('.jpeg') || 
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.ico')) {
      return await handleStaticAsset(request);
    }
    
    // Handle page requests
    return await handlePageRequest(request);
    
  } catch (error) {
    console.error('Error in handleRequest:', error);
    return await getOfflineFallback(request);
  }
}

async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for API request, trying cache:', url.pathname);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Offline - data not available',
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleStaticAsset(request) {
  // Try cache first for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Error fetching static asset:', error);
    return new Response('Asset not available offline', { status: 404 });
  }
}

async function handlePageRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for page requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for page request, trying cache:', url.pathname);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try to serve index.html for SPA routing
    if (url.pathname.startsWith('/bitcoiner/') || 
        url.pathname.startsWith('/organizer/') || 
        url.pathname.startsWith('/event/')) {
      const indexResponse = await caches.match('/');
      if (indexResponse) {
        return indexResponse;
      }
    }
    
    return await getOfflineFallback(request);
  }
}

async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return offline page for HTML requests
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlineResponse = await caches.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Create a simple offline page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Bitcoin Events</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f9fafb;
            color: #1f2937;
            text-align: center;
          }
          .container {
            max-width: 400px;
            margin: 50px auto;
            padding: 40px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            background: #f7931a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
          }
          h1 {
            margin: 0 0 16px;
            font-size: 24px;
            font-weight: 600;
          }
          p {
            margin: 0 0 24px;
            color: #6b7280;
            line-height: 1.5;
          }
          .retry-btn {
            background: #f7931a;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .retry-btn:hover {
            background: #e6850e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">₿</div>
          <h1>You're Offline</h1>
          <p>It looks like you're not connected to the internet. Some features may not be available, but you can still browse cached content.</p>
          <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Return generic offline response for other requests
  return new Response('Offline', { status: 503 });
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Background sync triggered');
  // Implement background sync logic here
  // For example, sync any pending data when connection is restored
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: '/icon-192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
