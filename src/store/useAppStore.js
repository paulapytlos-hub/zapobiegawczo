import { create } from 'zustand'
import * as api from '../api/client'

// Wysyła powiadomienie przez Service Worker (działa gdy karta jest w tle)
// lub fallback do zwykłego Notification API
async function sendNotification(title, body) {
  try {
    const reg = await navigator.serviceWorker?.ready
    if (reg) {
      reg.active?.postMessage({ type: 'SHOW_NOTIFICATION', title, body })
      return
    }
  } catch { /* ignoruj */ }
  // fallback
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.svg', silent: true, tag: 'zapobiegawczo-break' })
  }
}

const useAppStore = create((set, get) => ({
  // ── Stan sesji ──
  sessionActive: false,
  sessionPaused: false,
  awayMode: false,        // "Wychodzę z biura"
  elapsed: 0,
  intervalMinutes: 60,
  sessionId: null,
  currentExerciseId: null,

  // ── Statystyki ──
  breaksDone: 0,
  remindersIgnored: 0,

  // ── UI ──
  showBreakModal: false,
  breakIsPreview: false,
  showSettings: false,
  cuteMode: false,
  showWelcome: (() => { try { return !localStorage.getItem('zapobiegawczo_welcomed') } catch { return false } })(),

  // ── Profil ──
  userName: (() => { try { return localStorage.getItem('zapobiegawczo_name') || '' } catch { return '' } })(),
  setUserName: (name) => {
    try { localStorage.setItem('zapobiegawczo_name', name) } catch { /* ignoruj */ }
    set({ userName: name })
  },

  // ── Powiadomienia ──
  notifEnabled: false,
  notifPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
  popupEnabled: true,

  // ── Log zdarzeń ──
  logItems: [],

  // ── Akcje sesji ──
  startSession: async () => {
    set({ sessionActive: true, sessionPaused: false, awayMode: false, elapsed: 0, sessionId: null })
    get().addLog('Sesja rozpoczęta')
    // Zapytaj o powiadomienia przy pierwszym starcie
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        set({ notifPermission: perm, notifEnabled: perm === 'granted' })
      })
    }
    try {
      const res = await api.startSession(get().intervalMinutes)
      set({ sessionId: res.data.id })
    } catch { /* brak backendu nie blokuje */ }
  },

  pauseSession: () => {
    set({ sessionPaused: true })
    get().addLog('Sesja wstrzymana')
  },

  resumeSession: () => {
    set({ sessionPaused: false, awayMode: false })
    get().addLog('Sesja wznowiona')
  },

  goAway: () => {
    set({ sessionPaused: true, awayMode: true })
    get().addLog('Wyszłam z biura')
  },

  comeBack: () => {
    set({ sessionPaused: false, awayMode: false })
    get().addLog('Wróciłam do biura')
  },

  resetSession: async () => {
    const { sessionId, elapsed } = get()
    if (sessionId) {
      try { await api.endSession(sessionId, elapsed) } catch { /* ignoruj */ }
    }
    set({
      sessionActive: false, sessionPaused: false, awayMode: false,
      elapsed: 0, sessionId: null, showBreakModal: false,
    })
    get().addLog('Sesja zakończona')
  },

  tickSecond: () => {
    const { elapsed, intervalMinutes, popupEnabled, notifEnabled } = get()
    const newElapsed = elapsed + 1
    const intervalSeconds = intervalMinutes * 60

    if (newElapsed > 0 && newElapsed % intervalSeconds === 0) {
      if (popupEnabled) set({ showBreakModal: true })
      if (notifEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        sendNotification('Czas na przerwę', 'Wstań i rozciągnij się — Twoje ciało Ci podziękuje.')
      }
      get().addLog('Przypomnienie o przerwie')
    }

    set({ elapsed: newElapsed })
  },

  // ── Akcje przerwy ──
  completeBreak: async () => {
    const { sessionId, currentExerciseId } = get()
    set(state => ({ showBreakModal: false, breakIsPreview: false, breaksDone: state.breaksDone + 1 }))
    get().addLog('Przerwa wykonana')
    if (sessionId && currentExerciseId) {
      try { await api.logBreak(sessionId, currentExerciseId, false) } catch { /* ignoruj */ }
    }
  },

  snoozeBreak: async () => {
    const { sessionId, currentExerciseId } = get()
    set(state => ({
      showBreakModal: false,
      breakIsPreview: false,
      remindersIgnored: state.remindersIgnored + 1,
      elapsed: state.elapsed - 5 * 60,
    }))
    get().addLog('Przerwa odłożona o 5 min')
    if (sessionId && currentExerciseId) {
      try { await api.logBreak(sessionId, currentExerciseId, true) } catch { /* ignoruj */ }
    }
  },

  dismissBreak: () => {
    set(state => ({ showBreakModal: false, breakIsPreview: false, remindersIgnored: state.remindersIgnored + 1 }))
    get().addLog('Przypomnienie pominięte')
  },

  // ── Ustawienia ──
  updateInterval: (minutes) => set({ intervalMinutes: minutes }),

  requestNotifPermission: () => {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission().then(perm => {
      set({ notifPermission: perm, notifEnabled: perm === 'granted' })
    })
  },

  toggleNotif: () => {
    const { notifEnabled, notifPermission } = get()
    if (!notifEnabled && notifPermission !== 'granted') {
      get().requestNotifPermission()
    } else {
      set(state => ({ notifEnabled: !state.notifEnabled }))
    }
  },

  togglePopup: () => set(state => ({ popupEnabled: !state.popupEnabled })),

  openBreakPreview: () => set({ showBreakModal: true, breakIsPreview: true }),

  openWelcome: () => set({ showWelcome: true }),
  closeWelcome: () => {
    try { localStorage.setItem('zapobiegawczo_welcomed', '1') } catch { /* ignoruj */ }
    set({ showWelcome: false })
  },

  toggleMode: () => {
    const next = !get().cuteMode
    set({ cuteMode: next })
    document.documentElement.setAttribute('data-theme', next ? 'light' : '')
  },

  addLog: (message) => {
    const now = new Date()
    const time = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    set(state => ({
      logItems: [{ id: Date.now(), time, message }, ...state.logItems].slice(0, 50),
    }))
  },
}))

export default useAppStore
