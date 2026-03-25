self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const payload = (() => {
    try {
      return event.data ? event.data.json() : {};
    } catch {
      return {
        title: 'MedNexus update',
        body: event.data ? event.data.text() : 'You have a new alert.',
      };
    }
  })();

  const title = payload.title || 'MedNexus update';
  const options = {
    body: payload.body || 'You have a new alert.',
    icon: payload.icon || '/favicon.ico',
    badge: payload.badge || '/favicon.ico',
    tag: payload.tag,
    data: payload.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const raw = event.notification.data?.url;
  const pathOrUrl = typeof raw === 'string' ? raw : '/patients';
  const targetUrl = new URL(pathOrUrl, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (!('focus' in client)) {
          continue;
        }
        const windowClient = client;
        return windowClient.focus().then(() => {
          if (typeof windowClient.navigate === 'function') {
            return windowClient.navigate(targetUrl);
          }
          return undefined;
        });
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return undefined;
    })
  );
});
