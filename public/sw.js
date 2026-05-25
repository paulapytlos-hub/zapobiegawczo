self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  self.registration.showNotification(data.title || 'Czas na przerwę', {
    body: data.body || 'Wstań i rozciągnij się.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    silent: true,
    tag: 'zapobiegawczo-break',
    requireInteraction: false,
  })
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title || 'Czas na przerwę', {
      body: event.data.body || 'Wstań i rozciągnij się — Twoje ciało Ci podziękuje.',
      icon: '/favicon.svg',
      silent: true,
      tag: 'zapobiegawczo-break',
      requireInteraction: false,
    })
  }
})

self.addEventListener('notificationclick', () => {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    if (clients.length > 0) clients[0].focus()
  })
})
