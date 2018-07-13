self.addEventListener('install', function(event) {
  console.log("install");
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/scope-sw-test/index.html',
        '/scope-sw-test/style.css',
        '/scope-sw-test/app.js',
        '/scope-sw-test/image-list.js',
        '/scope-sw-test/star-wars-logo.jpg',
        '/scope-sw-test/gallery/bountyHunters.jpg',
        '/scope-sw-test/gallery/myLittleVader.jpg',
        '/scope-sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});
//'../sw-test/',
self.addEventListener('fetch', function(event) {
  console.log("fetch");
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
