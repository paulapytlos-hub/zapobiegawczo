import { useEffect, useRef } from 'react'
import useAppStore from './store/useAppStore'
import { useT } from './hooks/useT'
import Header from './components/Header'
import SessionTimer from './components/SessionTimer'
import BreakModal from './components/BreakModal'
import WelcomeModal from './components/WelcomeModal'
import SettingsPanel from './components/SettingsPanel'
import FactBanner from './components/FactBanner'
import SessionLog from './components/SessionLog'
import ExercisesSection from './components/ExercisesSection'
import QuickHelp from './components/QuickHelp'
import QuickHelpModal from './components/QuickHelpModal'
import AccessibilityWidget from './components/AccessibilityWidget'
import WaterTracker from './components/WaterTracker'
import HealthLevel from './components/HealthLevel'
import FeedbackWidget from './components/FeedbackWidget'

export default function App() {
  const { sessionActive, sessionPaused, tickSecond, theme, fontSize, highContrast, colorblindMode, reduceMotion, showBreakModal, breakIsPreview } = useAppStore()
  const t = useT()
  const titleFlashRef = useRef(null)

  // Główna pętla timera — pauzuje gdy modal przerwy jest otwarty (nie w trybie podglądu)
  useEffect(() => {
    if (!sessionActive || sessionPaused || (showBreakModal && !breakIsPreview)) return
    const id = setInterval(() => tickSecond(), 1000)
    return () => clearInterval(id)
  }, [sessionActive, sessionPaused, showBreakModal, breakIsPreview, tickSecond])

  // Synchronizuj motyw i wszystkie tryby dostępności
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? '' : theme)
  }, [theme])

  useEffect(() => {
    if (fontSize === 'normal') document.documentElement.removeAttribute('data-fontsize')
    else document.documentElement.setAttribute('data-fontsize', fontSize)
  }, [fontSize])

  useEffect(() => {
    if (highContrast) document.documentElement.setAttribute('data-contrast', 'high')
    else document.documentElement.removeAttribute('data-contrast')
  }, [highContrast])

  useEffect(() => {
    if (colorblindMode) document.documentElement.setAttribute('data-colorblind', 'true')
    else document.documentElement.removeAttribute('data-colorblind')
  }, [colorblindMode])

  useEffect(() => {
    if (reduceMotion) document.documentElement.setAttribute('data-motion', 'reduced')
    else document.documentElement.removeAttribute('data-motion')
  }, [reduceMotion])

  // Rejestruj Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* ignoruj błędy SW */ })
    }
  }, [])

  // Migający tytuł zakładki gdy break modal jest aktywny
  useEffect(() => {
    const appName = t.appName
    const breakAlert = t.appName === 'Prevently' ? '⏸ Time for a break!' : '⏸ Czas na przerwę!'
    const idleTitle = t.appName === 'Prevently' ? 'Prevently — stay healthy at work' : 'Zapobiegawczo — zadbaj o siebie'
    if (showBreakModal) {
      let blink = false
      titleFlashRef.current = setInterval(() => {
        document.title = blink ? appName : breakAlert
        blink = !blink
      }, 1000)
    } else {
      clearInterval(titleFlashRef.current)
      document.title = idleTitle
    }
    return () => clearInterval(titleFlashRef.current)
  }, [showBreakModal, t.appName])

  const bgGradient = theme === 'light' ? {} : {
    backgroundImage: 'radial-gradient(ellipse 90% 50% at 15% -5%, rgba(45, 184, 112, 0.05) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 85% 90%, rgba(0, 100, 50, 0.04) 0%, transparent 50%)',
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg)', ...bgGradient }}>
      <Header />
      <div className="max-w-xl mx-auto">
        <FactBanner />
        <div className="flex flex-col sm:flex-row items-start gap-3 px-2">
          {/* Główna zawartość — na mobile pierwsza */}
          <main className="flex-1 min-w-0 w-full order-1 sm:order-2">
            <SessionTimer />
            <SettingsPanel />
            <QuickHelp />
            <ExercisesSection />
            <SessionLog />
          </main>
          {/* Panel boczny — na mobile po głównej treści, na desktop po lewej */}
          <div className="w-full sm:w-44 sm:shrink-0 sm:sticky sm:top-4 sm:pt-5 order-2 sm:order-1">
            {/* Mobile: dwa mini-panele obok siebie */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 pt-3 sm:pt-0">
              <WaterTracker />
              <HealthLevel />
            </div>
          </div>
        </div>
      </div>
      <BreakModal />
      <WelcomeModal />
      <QuickHelpModal />
      <AccessibilityWidget />
      <FeedbackWidget />
    </div>
  )
}
