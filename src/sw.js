const VERSION = 'v7';
function log(messages) {
  console.log(VERSION, messages);
}

log('installing service worker');

self.addEventListener('install', event => event.waitUntil(installServiceWorker()));

async function installServiceWorker(){
  log('Service Worker installation started');

  const request = new Request('offline.html');
  const response = await fetch(request);

  log('response received after loading offline.html', response);


  if(response.status !== 200){
    throw new Error('Could not load offline page!');
  }

  const cache = await caches.open('app-cache');

  cache.put(request, response);

  log('Cached offline.html');

}

self.addEventListener('activate', () => {
  log('version is activated');
});


self.addEventListener('fetch', event => event.respondWith(showOfflineIfError(event)));

async function showOfflineIfError(event){
  let response
  try {
    log('Calling network: ' + event.request.url);
    response = await fetch(event.request);
  } catch (error) {
    log('Network request Failed. Serving offline page  ' + error);

    const cache = await caches.open('app-cache');

    response = cache.match('offline.html');
  }
  return response;
}
