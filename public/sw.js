self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()))

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(
      self.registration.showNotification(event.data.title || 'Czas na przerwę', {
        body: event.data.body || 'Wstań i rozciągnij się.',
        icon: '/favicon.svg',
        tag: 'zapobiegawczo-break',
        renotify: true,
      })
    )
  }
})

self.addEventListener('notificationclick', () => {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    if (clients.length > 0) clients[0].focus()
  })
})
