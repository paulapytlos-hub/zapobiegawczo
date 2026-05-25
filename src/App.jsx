import { useEffect, useRef } from 'react'
import useAppStore from './store/useAppStore'
import Header from './components/Header'
import SessionTimer from './components/SessionTimer'
import BreakModal from './components/BreakModal'
import WelcomeModal from './components/WelcomeModal'
import SettingsPanel from './components/SettingsPanel'
import FactBanner from './components/FactBanner'
import SessionLog from './components/SessionLog'
import ExercisesSection from './components/ExercisesSection'

export default function App() {
  const { sessionActive, sessionPaused, tickSecond, cuteMode, showBreakModal } = useAppStore()
  const titleFlashRef = useRef(null)

  // Główna pętla timera
  useEffect(() => {
    if (!sessionActive || sessionPaused) return
    const id = setInterval(() => tickSecond(), 1000)
    return () => clearInterval(id)
  }, [sessionActive, sessionPaused, tickSecond])

  // Synchronizuj motyw
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', cuteMode ? 'light' : '')
  }, [cuteMode])

  // Rejestruj Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* ignoruj błędy SW */ })
    }
  }, [])

  // Migający tytuł zakładki gdy break modal jest aktywny
  // Działa nawet gdy przeglądarka jest zminimalizowana lub karta nieaktywna
  useEffect(() => {
    if (showBreakModal) {
      let blink = false
      titleFlashRef.current = setInterval(() => {
        document.title = blink ? 'Zapobiegawczo' : '⏸ Czas na przerwę!'
        blink = !blink
      }, 1000)
    } else {
      clearInterval(titleFlashRef.current)
      document.title = 'Zapobiegawczo — zadbaj o siebie'
    }
    return () => clearInterval(titleFlashRef.current)
  }, [showBreakModal])

  const bgGradient = cuteMode ? {} : {
    backgroundImage: 'radial-gradient(ellipse 90% 50% at 15% -5%, rgba(61, 220, 132, 0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 85% 90%, rgba(0, 120, 60, 0.05) 0%, transparent 50%)',
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg)', ...bgGradient }}>
      <Header />
      <main className="max-w-md mx-auto">
        <FactBanner />
        <SessionTimer />
        <SettingsPanel />
        <ExercisesSection />
        <SessionLog />
      </main>
      <BreakModal />
      <WelcomeModal />
    </div>
  )
}
