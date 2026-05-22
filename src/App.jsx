import { useEffect } from 'react'
import useAppStore from './store/useAppStore'
import Header from './components/Header'
import SessionTimer from './components/SessionTimer'
import BreakModal from './components/BreakModal'
import SettingsPanel from './components/SettingsPanel'
import FactBanner from './components/FactBanner'
import SessionLog from './components/SessionLog'

export default function App() {
  const { sessionActive, sessionPaused, tickSecond, cuteMode } = useAppStore()

  // Główna pętla timera
  useEffect(() => {
    if (!sessionActive || sessionPaused) return
    const id = setInterval(() => tickSecond(), 1000)
    return () => clearInterval(id)
  }, [sessionActive, sessionPaused, tickSecond])

  // Synchronizuj motyw na starcie
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
        <SessionLog />
      </main>
      <BreakModal />
    </div>
  )
}
