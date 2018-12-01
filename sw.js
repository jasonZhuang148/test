
console.log('Script loaded!')
var cacheStorageKey = 'minimal-pwa-83'

var cacheList = [
  '/',
  "index.html",
  "main.css",
  "e.png",
  "assets/icons/icon-48x48.png",
  "assets/icons/icon-72x72.png",
  "assets/icons/icon-96x96.png",
  "assets/icons/icon-128x128.png",
  "assets/icons/icon-144x144.png",
  "assets/icons/icon-152x152.png",
  "assets/icons/icon-192x192.png",
  "assets/icons/icon-512x512.png",
  "pwa-fonts.png"
]



self.addEventListener('install', function(e) {
  console.log('Cache event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    }).then(function() {
      console.log('Skip waiting!')
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('Activate event')
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      console.log('Clients claims.')
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function(e) {

  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url)
    })
  )
})
