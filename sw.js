/* Service worker: papar notifikasi walaupun app ditutup / skrin padam. */
const CACHE = "dkp-shell-v1";
const SHELL = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/badge-72.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Fail app: cuba rangkaian dahulu, jika luar talian guna simpanan
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});

self.addEventListener("push", e => {
  let d = {};
  try { const j = e.data ? e.data.json() : {}; d = j.data || (j.notification ? j.notification : j); } catch (err) { d = { title: "Pesanan", body: e.data ? e.data.text() : "" }; }
  const kind = d.kind || "";
  const title = d.title || "Pesanan Tambahan";
  const opts = {
    body: d.body || "",
    tag: d.tag || ("n-" + Date.now()),
    renotify: true,                 // berbunyi lagi walaupun tag sama
    requireInteraction: true,       // kekal di skrin sehingga ditekan
    icon: "icons/icon-192.png",
    badge: "icons/badge-72.png",
    vibrate: kind === "sedia" ? [400, 150, 400, 150, 400] : [600, 200, 600, 200, 600],
    data: { kind, url: "./?tab=pesanan&seg=" + (kind === "sedia" ? "sedia" : "baru") }
  };
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    // beritahu app yang terbuka supaya muat semula (app sendiri yang berbunyi bila di skrin)
    cs.forEach(c => c.postMessage({ type: "push", kind, title, body: opts.body }));
    const onScreen = cs.some(c => c.visibilityState === "visible" && c.focused);
    if (!onScreen || kind === "test") await self.registration.showNotification(title, opts);
  })());
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of cs) { if (c.url.startsWith(self.registration.scope)) { await c.focus(); c.postMessage({ type: "open", url }); return; } }
    await self.clients.openWindow(url);
  })());
});
