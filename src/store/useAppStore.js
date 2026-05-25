import { create } from 'zustand'
import * as api from '../api/client'

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
  showSettings: false,
  cuteMode: false,

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
        new Notification('Czas na przerwę', {
          body: 'Wstań i rozciągnij się — Twoje ciało Ci podziękuje.',
          icon: '/favicon.svg',
          silent: true,  // bez dźwięku — żeby nie przeszkadzać w biurze
          tag: 'zapobiegawczo-break',  // zastępuje poprzednie powiadomienie zamiast je dublować
        })
      }
      get().addLog('Przypomnienie o przerwie')
    }

    set({ elapsed: newElapsed })
  },

  // ── Akcje przerwy ──
  completeBreak: async () => {
    const { sessionId, currentExerciseId } = get()
    set(state => ({ showBreakModal: false, breaksDone: state.breaksDone + 1 }))
    get().addLog('Przerwa wykonana')
    if (sessionId && currentExerciseId) {
      try { await api.logBreak(sessionId, currentExerciseId, false) } catch { /* ignoruj */ }
    }
  },

  snoozeBreak: async () => {
    const { sessionId, currentExerciseId } = get()
    set(state => ({
      showBreakModal: false,
      remindersIgnored: state.remindersIgnored + 1,
      elapsed: state.elapsed - 5 * 60,
    }))
    get().addLog('Przerwa odłożona o 5 min')
    if (sessionId && currentExerciseId) {
      try { await api.logBreak(sessionId, currentExerciseId, true) } catch { /* ignoruj */ }
    }
  },

  dismissBreak: () => {
    set(state => ({ showBreakModal: false, remindersIgnored: state.remindersIgnored + 1 }))
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

  toggleMode: () => {
    const next = !get().cuteMode
    set({ cuteMode: next })
    document.documentElement.setAttribute('data-theme', next ? 'cozy' : '')
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
