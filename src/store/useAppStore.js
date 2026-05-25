import { create } from 'zustand'
import * as api from '../api/client'

async function sendNotification(title, body) {
  // Direct API — pewniejsze gdy zakładka jest otwarta w tle
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.svg', tag: 'zapobiegawczo-break' })
    } catch { /* ignoruj */ }
  }
  // SW — dla notyfikacji gdy strona jest całkowicie zamknięta (dodatkowe)
  try {
    const reg = await Promise.race([
      navigator.serviceWorker?.ready,
      new Promise((_, reject) => setTimeout(() => reject('timeout'), 1500)),
    ])
    if (reg?.active) {
      reg.active.postMessage({ type: 'SHOW_NOTIFICATION', title, body })
    }
  } catch { /* ignoruj */ }
}

const useAppStore = create((set, get) => ({
  // ── Stan sesji ──
  sessionActive: false,
  sessionPaused: false,
  awayMode: false,
  elapsed: 0,
  lastTickAt: null,       // timestamp ostatniego ticka — kompensuje throttling
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
  theme: 'light',      // 'dark' | 'night' | 'light'
  fontSize: 'normal',  // 'small' | 'normal' | 'large' | 'xlarge'
  highContrast: false,
  colorblindMode: false,
  reduceMotion: false,
  showWelcome: (() => { try { return !localStorage.getItem('zapobiegawczo_welcomed') } catch { return false } })(),

  // ── Szybka pomoc ──
  quickHelpId: null,
  setQuickHelp: (id) => set({ quickHelpId: id }),
  quickHelpModalArea: null,
  openQuickHelpModal: (areaId) => set({ quickHelpModalArea: areaId }),
  closeQuickHelpModal: () => set({ quickHelpModalArea: null }),

  // ── Profil ──
  userName: (() => { try { return localStorage.getItem('zapobiegawczo_name') || '' } catch { return '' } })(),
  setUserName: (name) => {
    try { localStorage.setItem('zapobiegawczo_name', name) } catch { /* ignoruj */ }
    set({ userName: name })
  },

  // ── Powiadomienia ──
  notifEnabled: typeof Notification !== 'undefined' && Notification.permission === 'granted',
  notifPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
  popupEnabled: true,

  // ── Log zdarzeń ──
  logItems: [],

  // ── Akcje sesji ──
  startSession: async () => {
    set({ sessionActive: true, sessionPaused: false, awayMode: false, elapsed: 0, lastTickAt: null, sessionId: null })
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
    set({ sessionPaused: false, awayMode: false, lastTickAt: null })
    get().addLog('Sesja wznowiona')
  },

  goAway: () => {
    set({ sessionPaused: true, awayMode: true })
    get().addLog('Wyjście z biura')
  },

  comeBack: () => {
    set({ sessionPaused: false, awayMode: false, lastTickAt: null })
    get().addLog('Powrót do biura')
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
    const { elapsed, lastTickAt, intervalMinutes, popupEnabled, notifEnabled } = get()
    const now = Date.now()
    // Kompensuj throttling Chrome w tle — jeśli minęło więcej niż 1s, dodaj realne sekundy
    const secondsPassed = lastTickAt ? Math.min(Math.round((now - lastTickAt) / 1000), 60) : 1
    const intervalSeconds = intervalMinutes * 60
    const prevElapsed = elapsed
    const newElapsed = elapsed + secondsPassed

    // Sprawdź czy przekroczyliśmy granicę interwału
    const prevBucket = Math.floor(prevElapsed / intervalSeconds)
    const newBucket = Math.floor(newElapsed / intervalSeconds)
    if (newElapsed > 0 && newBucket > prevBucket) {
      if (popupEnabled) set({ showBreakModal: true })
      if (notifEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        sendNotification('Czas na przerwę', 'Wstań i rozciągnij się — Twoje ciało Ci podziękuje.')
      }
      get().addLog('Przypomnienie o przerwie')
    }

    set({ elapsed: newElapsed, lastTickAt: now })
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
  updateInterval: (minutes) => {
    set({ intervalMinutes: minutes })
    get().addLog(`Interwał zmieniony na ${minutes} min`)
  },

  requestNotifPermission: () => {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission().then(perm => {
      set({ notifPermission: perm, notifEnabled: perm === 'granted' })
      if (perm === 'granted') get().addLog('Powiadomienia na pulpicie włączone')
    })
  },

  toggleNotif: () => {
    const { notifEnabled, notifPermission } = get()
    if (!notifEnabled && notifPermission !== 'granted') {
      get().requestNotifPermission()
    } else {
      const next = !notifEnabled
      set({ notifEnabled: next })
      get().addLog(next ? 'Powiadomienia na pulpicie włączone' : 'Powiadomienia na pulpicie wyłączone')
    }
  },

  togglePopup: () => {
    const next = !get().popupEnabled
    set({ popupEnabled: next })
    get().addLog(next ? 'Okienko z ćwiczeniem włączone' : 'Okienko z ćwiczeniem wyłączone')
  },

  openBreakPreview: () => set({ showBreakModal: true, breakIsPreview: true }),

  openWelcome: () => set({ showWelcome: true }),
  closeWelcome: () => {
    try { localStorage.setItem('zapobiegawczo_welcomed', '1') } catch { /* ignoruj */ }
    set({ showWelcome: false })
  },

  setTheme: (t) => {
    set({ theme: t })
    document.documentElement.setAttribute('data-theme', t === 'dark' ? '' : t)
  },

  setFontSize: (size) => {
    set({ fontSize: size })
    if (size === 'normal') document.documentElement.removeAttribute('data-fontsize')
    else document.documentElement.setAttribute('data-fontsize', size)
  },

  setHighContrast: (val) => {
    set({ highContrast: val })
    if (val) document.documentElement.setAttribute('data-contrast', 'high')
    else document.documentElement.removeAttribute('data-contrast')
  },

  setColorblind: (val) => {
    set({ colorblindMode: val })
    if (val) document.documentElement.setAttribute('data-colorblind', 'true')
    else document.documentElement.removeAttribute('data-colorblind')
  },

  setReduceMotion: (val) => {
    set({ reduceMotion: val })
    if (val) document.documentElement.setAttribute('data-motion', 'reduced')
    else document.documentElement.removeAttribute('data-motion')
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
