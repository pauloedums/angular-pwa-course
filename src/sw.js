const VERSION = 'v17';

log('Installing Service Worker');

self.addEventListener('install', event => event.waitUntil(installServiceWorker()));

async function installServiceWorker() {

    log("Service Worker installation started ");

    const cache = await caches.open(getCacheName());

    return cache.addAll([
      '/',
      '/polyfills.js',
      '/styles.js',
      '/vendor.js',
      '/runtime.js',
      '/main.js',
      '/assets/bundle.css',
      '/assets/angular-pwa-course.png',
      '/assets/main-page-logo-small-hat.png'
    ]);
}

self.addEventListener('activate', () => activatedSW());

async function activatedSW(){

    log('Service Worker activated');

    const cacheKeys = await caches.keys();

    cacheKeys.forEach(cacheKey => {
      if(cacheKey !== getCacheName()){
        caches.delete(cacheKey);
      }
    });

    return clients.claim();
}

self.addEventListener('fetch', event => event.respondWith(cacheThenNetwork(event)));

async function cacheThenNetwork(event) {
  log('Intercepting request: ' + event.request.url);

    const cache = await caches.open(getCacheName());

    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
        log('From Cache: ' + event.request.url);
        return cachedResponse;
    }

    const networkResponse = await fetch(event.request);

    log('Calling network: ' + event.request.url);

    return networkResponse;

}

function getCacheName(){
  return 'app-name-' + VERSION;
}

function log(message, ...data) {
    if (data.length > 0) {
        console.log(VERSION, message, data);
    }
    else {
        console.log(VERSION, message);
    }
}

















