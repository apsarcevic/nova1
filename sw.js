self.addEventListener("install", (e) => {
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  // SW ready
});

self.addEventListener("push", (e) => {
  const data = e.data ? e.data.json() : { title: "Test Push", body: "No payload" };
  e.waitUntil(
    self.registration.showNotification(data.title || "Test", {
      body: data.body || "Body",
      icon: data.icon || "/icon.png",
      data: data.data || {}
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(clients.openWindow(url));
});
