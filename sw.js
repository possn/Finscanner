const CACHE_VERSION = "finscanner-v12-shell-repair-081";
const SHELL_FILES = ["./", "./index.html", "./style.css?v=0.8.1", "./app.js?v=0.8.1", "./manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isData = url.pathname.includes("/data/") && url.pathname.endsWith(".json");
  const isNavigation = event.request.mode === "navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/");
  const isShellAsset = url.pathname.endsWith("/app.js") || url.pathname.endsWith("/style.css") || url.pathname.endsWith("/manifest.json");

  // Network-first avoids serving an old HTML shell with a new JS bundle (or the reverse).
  if (isNavigation || isShellAsset || isData) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(event.request, { cache: "no-store" });
        if (fresh && fresh.ok) {
          const clone = fresh.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return fresh;
      } catch (err) {
        return (await caches.match(event.request)) || Response.error();
      }
    })());
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
