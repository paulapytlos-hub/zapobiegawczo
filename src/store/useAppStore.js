import { create } from 'zustand'
import * as api from '../api/client'

async function sendNotification(title, body) {
  // Direct API — pewniejsze gdy zakładka jest otwarta w tle
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.svg', tag: 'zapobiegawczo-break', renotify: true })
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
  breaksDone: (() => {
    try {
      const today = new Date().toISOString().split('T')[0]
      if (localStorage.getItem('zapobiegawczo_breaksdate') !== today) return 0
      return parseInt(localStorage.getItem('zapobiegawczo_breaks') || '0')
    } catch { return 0 }
  })(),
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

  // ── Poziom zdrowia (persystuje) ──
  xp: (() => { try { return parseInt(localStorage.getItem('zapobiegawczo_xp') || '0') } catch { return 0 } })(),

  earnXP: (amount) => {
    const next = get().xp + amount
    try { localStorage.setItem('zapobiegawczo_xp', String(next)) } catch { /* ignoruj */ }
    set({ xp: next })
  },

  resetDay: () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem('zapobiegawczo_xp', '0')
      localStorage.setItem('zapobiegawczo_water', '0')
      localStorage.setItem('zapobiegawczo_waterdate', today)
      localStorage.setItem('zapobiegawczo_breaks', '0')
      localStorage.setItem('zapobiegawczo_breaksdate', today)
    } catch {}
    set({ xp: 0, waterGlasses: 0, breaksDone: 0, lastWaterAt: null })
  },

  // ── Czas pracy (dzienny) ──
  workHours: (() => { try { return parseFloat(localStorage.getItem('zapobiegawczo_workhours') || '8') } catch { return 8 } })(),
  setWorkHours: (h) => {
    try { localStorage.setItem('zapobiegawczo_workhours', String(h)) } catch { /* ignoruj */ }
    set({ workHours: h })
  },

  // ── Język ──
  language: (() => { try { return localStorage.getItem('zapobiegawczo_language') || 'pl' } catch { return 'pl' } })(),
  setLanguage: (lang) => {
    try { localStorage.setItem('zapobiegawczo_language', lang) } catch { /* ignoruj */ }
    set({ language: lang })
  },

  // ── Tryb siedzący ──
  sittingMode: (() => { try { return localStorage.getItem('zapobiegawczo_sitting') === '1' } catch { return false } })(),
  setSittingMode: (val) => {
    try { localStorage.setItem('zapobiegawczo_sitting', val ? '1' : '0') } catch { /* ignoruj */ }
    set({ sittingMode: val })
    get().addLog(val ? 'Tryb siedzący włączony' : 'Tryb siedzący wyłączony')
  },

  // ── Seria (streak) ──
  streakDays: (() => {
    try {
      const lastDate = localStorage.getItem('zapobiegawczo_laststreakdate')
      const streak = parseInt(localStorage.getItem('zapobiegawczo_streak') || '0')
      if (!lastDate || streak === 0) return 0
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      return (lastDate === today || lastDate === yesterday) ? streak : 0
    } catch { return 0 }
  })(),
  lastStreakDate: (() => { try { return localStorage.getItem('zapobiegawczo_laststreakdate') || null } catch { return null } })(),

  checkStreak: () => {
    const { waterGlasses, breaksDone, workHours, intervalMinutes } = get()
    const breakGoal = Math.max(1, Math.floor(workHours * 60 / intervalMinutes))
    if (waterGlasses < 8 || breaksDone < breakGoal) return
    const today = new Date().toISOString().split('T')[0]
    const lastDate = get().lastStreakDate
    if (lastDate === today) return
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const newStreak = lastDate === yesterday ? get().streakDays + 1 : 1
    try {
      localStorage.setItem('zapobiegawczo_streak', String(newStreak))
      localStorage.setItem('zapobiegawczo_laststreakdate', today)
    } catch { /* ignoruj */ }
    set({ streakDays: newStreak, lastStreakDate: today })
    get().addLog(`Seria: ${newStreak} ${newStreak === 1 ? 'dzień' : 'dni'} z rzędu! 🔥`)
  },

  // ── Nawodnienie ──
  waterGlasses: (() => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const saved = localStorage.getItem('zapobiegawczo_waterdate')
      if (saved !== today) return 0
      return parseInt(localStorage.getItem('zapobiegawczo_water') || '0')
    } catch { return 0 }
  })(),
  lastWaterAt: null,

  addWaterGlass: () => {
    const glasses = get().waterGlasses
    const next = glasses + 1
    try {
      localStorage.setItem('zapobiegawczo_water', String(next))
      localStorage.setItem('zapobiegawczo_waterdate', new Date().toISOString().split('T')[0])
    } catch { /* ignoruj */ }
    set({ waterGlasses: next, lastWaterAt: Date.now() })
    get().earnXP(3)
    get().addLog(`Szklanka wody (${next}) (+3 XP)`)
    get().checkStreak()
  },

  removeWaterGlass: () => {
    const glasses = get().waterGlasses
    if (glasses <= 0) return
    const next = glasses - 1
    try {
      localStorage.setItem('zapobiegawczo_water', String(next))
      localStorage.setItem('zapobiegawczo_waterdate', new Date().toISOString().split('T')[0])
    } catch { /* ignoruj */ }
    set({ waterGlasses: next, lastWaterAt: next > 0 ? get().lastWaterAt : null })
    const newXp = Math.max(0, get().xp - 3)
    try { localStorage.setItem('zapobiegawczo_xp', String(newXp)) } catch { /* ignoruj */ }
    set({ xp: newXp })
    get().addLog(`Cofnięto szklankę (${next}) (-3 XP)`)
  },

  resetWater: () => {
    try {
      localStorage.setItem('zapobiegawczo_water', '0')
      localStorage.setItem('zapobiegawczo_waterdate', new Date().toISOString().split('T')[0])
    } catch { /* ignoruj */ }
    set({ waterGlasses: 0, lastWaterAt: null })
  },

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
    const newBreaks = get().breaksDone + 1
    try {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem('zapobiegawczo_breaks', String(newBreaks))
      localStorage.setItem('zapobiegawczo_breaksdate', today)
    } catch {}
    set({ showBreakModal: false, breakIsPreview: false, breaksDone: newBreaks })
    get().earnXP(15)
    get().addLog('Przerwa wykonana (+15 XP)')
    get().checkStreak()
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
