const CACHE_NAME = "loom-client-shell-v1";
const SHELL = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("loom-client-shell-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )),
    self.clients.claim(),
  ]));
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return cache.match("./");
    })
  );
});
