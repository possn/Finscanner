const CACHE_VERSION = "v0.99.1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css?v=0.99.1",
  "./app.js?v=0.99.1",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.all(SHELL_FILES.map(async url => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (response.ok) await cache.put(url, response);
      } catch (_) { /* one optional shell asset must not abort SW install */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isData = url.pathname.includes("/data/") && (url.pathname.endsWith(".json") || url.pathname.endsWith(".txt"));
  const isNavigation = event.request.mode === "navigate";
  const isShell = /\/(?:index\.html|app\.js|style\.css|manifest\.json)$/.test(url.pathname);

  if (isNavigation || isShell || isData) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(event.request, { cache: "no-store" });
        if (fresh.ok) {
          const cache = await caches.open(CACHE_VERSION);
          await cache.put(event.request, fresh.clone());
        }
        return fresh;
      } catch (_) {
        const cached = await caches.match(event.request, { ignoreSearch: isShell || isNavigation });
        if (cached) return cached;
        if (isNavigation) return (await caches.match("./index.html", { ignoreSearch: true })) || Response.error();
        return Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch (_) { return Response.error(); }
  })());
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await clients.matchAll({type:"window", includeUncontrolled:true});
    if (all.length) { await all[0].focus(); return; }
    await clients.openWindow("./");
  })());
});
