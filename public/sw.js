const CACHE_NAME = 'farm2home-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/images/fruits.jpg',
  '/images/vegetables.jpg',
  '/images/dry fruits.jpg',
  '/images/apple.jpg',
  '/images/banana.jpg',
  '/images/Mango.jpg',
  '/images/grapes.jpg',
  '/images/papaya.jpg',
  '/images/avacado.jpg',
  '/images/sapota.jpg',
  '/images/guva.jpg',
  '/images/cherries.jpg',
  '/images/custard apple.jpg',
  '/images/Pomegranate.jpg',
  '/images/dragon fruit.jpg',
  '/images/strawberry.jpg',
  '/images/pine apple.jpg',
  '/images/orange.jpg',
  '/images/kiwi.jpg',
  '/images/badam.jpg',
  '/images/cashews.jpg',
  '/images/pista.jpg',
  '/images/waltnuts.jpg',
  '/images/peanut.jpg',
  '/images/wheat.jpg',
  '/images/rice.jpg',
  '/images/tomato.jpg',
  '/images/onion.jpg',
  '/images/potato.jpg',
  '/images/maize.jpg',
  '/images/cabbage.jpg',
  '/images/carrot.jpg',
  '/images/brinjal.jpg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending data when connection is restored
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
} 