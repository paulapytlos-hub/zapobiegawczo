import { create } from 'zustand'
import * as api from '../api/client'

const useAppStore = create((set, get) => ({
  // ── Stan sesji ──
  sessionActive: false,
  sessionPaused: false,
  elapsed: 0,           // sekundy od startu sesji
  intervalMinutes: 60,  // co ile minut przypomnienie
  sessionId: null,      // ID sesji z bazy danych
  currentExerciseId: null, // ćwiczenie pokazywane w aktualnym modalu

  // ── Statystyki ──
  breaksDone: 0,
  remindersIgnored: 0,

  // ── UI ──
  showBreakModal: false,
  showSettings: false,
  cuteMode: false,      // false = Professional, true = Cozy

  // ── Powiadomienia ──
  notifEnabled: false,
  popupEnabled: true,

  // ── Log zdarzeń ──
  logItems: [],

  // ── Akcje sesji ──
  startSession: async () => {
    set({ sessionActive: true, sessionPaused: false, elapsed: 0, sessionId: null })
    get().addLog('Sesja rozpoczęta')
    try {
      const res = await api.startSession(get().intervalMinutes)
      set({ sessionId: res.data.id })
    } catch {
      // brak backendu nie blokuje działania aplikacji
    }
  },

  pauseSession: () => {
    set({ sessionPaused: true })
    get().addLog('Sesja wstrzymana')
  },

  resumeSession: () => {
    set({ sessionPaused: false })
    get().addLog('Sesja wznowiona')
  },

  resetSession: async () => {
    const { sessionId, elapsed } = get()
    if (sessionId) {
      try {
        await api.endSession(sessionId, elapsed)
      } catch {
        // cicho ignoruj
      }
    }
    set({
      sessionActive: false,
      sessionPaused: false,
      elapsed: 0,
      sessionId: null,
      showBreakModal: false,
    })
    get().addLog('Sesja zresetowana')
  },

  tickSecond: () => {
    const { elapsed, intervalMinutes, popupEnabled, notifEnabled, remindersIgnored } = get()
    const newElapsed = elapsed + 1
    const intervalSeconds = intervalMinutes * 60

    if (newElapsed > 0 && newElapsed % intervalSeconds === 0) {
      if (popupEnabled) set({ showBreakModal: true })
      if (notifEnabled) {
        new Notification('Czas na przerwę! 🧘', {
          body: 'Wstań, rozciągnij się — Twoje ciało Ci podziękuje.',
          icon: '/favicon.svg',
        })
      }
      get().addLog('Przypomnienie o przerwie')
    }

    set({ elapsed: newElapsed })
  },

  // ── Akcje przerwy ──
  completeBreak: async () => {
    const { sessionId, currentExerciseId } = get()
    set(state => ({
      showBreakModal: false,
      breaksDone: state.breaksDone + 1,
    }))
    get().addLog('Przerwa wykonana ✓')
    if (sessionId && currentExerciseId) {
      try {
        await api.logBreak(sessionId, currentExerciseId, false)
      } catch {
        // cicho ignoruj
      }
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
      try {
        await api.logBreak(sessionId, currentExerciseId, true)
      } catch {
        // cicho ignoruj
      }
    }
  },

  dismissBreak: () => {
    set(state => ({
      showBreakModal: false,
      remindersIgnored: state.remindersIgnored + 1,
    }))
    get().addLog('Przypomnienie pominięte')
  },

  // ── Ustawienia ──
  updateInterval: (minutes) => set({ intervalMinutes: minutes }),

  toggleNotif: () => {
    const { notifEnabled } = get()
    if (!notifEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') set({ notifEnabled: true })
      })
    } else {
      set(state => ({ notifEnabled: !state.notifEnabled }))
    }
  },

  togglePopup: () => set(state => ({ popupEnabled: !state.popupEnabled })),

  toggleMode: () => {
    set(state => ({ cuteMode: !state.cuteMode }))
    const next = !get().cuteMode
    document.documentElement.setAttribute('data-theme', next ? 'cozy' : '')
  },

  // ── Log ──
  addLog: (message) => {
    const now = new Date()
    const time = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    set(state => ({
      logItems: [{ id: Date.now(), time, message }, ...state.logItems].slice(0, 50),
    }))
  },
}))

export default useAppStore
