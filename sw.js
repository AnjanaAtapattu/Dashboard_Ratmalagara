var CACHE_NAME = 'coconut-dashboard-v3.0';
var ASSETS = [
  './',
  './index.html',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './manifest.webmanifest',
  './qgis2web_2026_05_18-14_42_39_257126/indexCoconut.html',
  './qgis2web_2026_05_18-14_42_39_257126/css/leaflet.css',
  './qgis2web_2026_05_18-14_42_39_257126/css/qgis2web.css',
  './qgis2web_2026_05_18-14_42_39_257126/css/L.Control.Layers.Tree.css',
  './qgis2web_2026_05_18-14_42_39_257126/css/L.Control.Locate.min.css',
  './qgis2web_2026_05_18-14_42_39_257126/css/fontawesome-all.min.css',
  './qgis2web_2026_05_18-14_42_39_257126/css/leaflet.photon.css',
  './qgis2web_2026_05_18-14_42_39_257126/css/leaflet-measure.css',
  './qgis2web_2026_05_18-14_42_39_257126/js/leaflet.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/qgis2web_expressions.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/L.Control.Layers.Tree.min.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/L.Control.Locate.min.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/leaflet.rotatedMarker.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/leaflet.pattern.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/leaflet-hash.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/Autolinker.min.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/rbush.min.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/labelgun.min.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/labels.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/leaflet.photon.js',
  './qgis2web_2026_05_18-14_42_39_257126/js/leaflet-measure.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/Boundary_2.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/Critical_3.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/Severs_Stress_4.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/Mid_Stress_5.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/Unhealthy_6.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/Moderate_7.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/Healthy_8.js',
  './qgis2web_2026_05_18-14_42_39_257126/data/RatmalagaraEstate_1.png',
  './qgis2web_2026_05_18-14_42_39_257126/css/images/layers.png',
  './qgis2web_2026_05_18-14_42_39_257126/css/images/layers-2x.png',
  './qgis2web_2026_05_18-14_42_39_257126/css/images/marker-icon.png',
  './qgis2web_2026_05_18-14_42_39_257126/css/images/marker-icon-2x.png',
  './qgis2web_2026_05_18-14_42_39_257126/css/images/marker-shadow.png',
  './qgis2web_2026_05_18-14_42_39_257126/legend/Boundary_2.png',
  './qgis2web_2026_05_18-14_42_39_257126/legend/Critical_3.png',
  './qgis2web_2026_05_18-14_42_39_257126/legend/Healthy_8.png',
  './qgis2web_2026_05_18-14_42_39_257126/legend/Mid_Stress_5.png',
  './qgis2web_2026_05_18-14_42_39_257126/legend/Moderate_7.png',
  './qgis2web_2026_05_18-14_42_39_257126/legend/Severs_Stress_4.png',
  './qgis2web_2026_05_18-14_42_39_257126/legend/Unhealthy_6.png',
  './qgis2web_2026_05_18-14_42_39_257126/webfonts/fa-solid-900.woff2',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Network-first for API calls (weather), cache-first for everything else
  if (e.request.url.includes('api.open-meteo.com')) {
    e.respondWith(
      fetch(e.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(e.request);
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
          return response;
        });
      })
    );
  }
});
