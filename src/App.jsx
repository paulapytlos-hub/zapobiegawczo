import { useEffect } from 'react'
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
  const { sessionActive, sessionPaused, tickSecond, cuteMode } = useAppStore()

  useEffect(() => {
    if (!sessionActive || sessionPaused) return
    const id = setInterval(() => tickSecond(), 1000)
    return () => clearInterval(id)
  }, [sessionActive, sessionPaused, tickSecond])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', cuteMode ? 'cozy' : '')
  }, [cuteMode])

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg)' }}>
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
