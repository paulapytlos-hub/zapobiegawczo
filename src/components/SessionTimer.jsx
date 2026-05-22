import useAppStore from '../store/useAppStore'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SessionTimer() {
  const {
    sessionActive, sessionPaused, elapsed,
    intervalMinutes, breaksDone, remindersIgnored,
    startSession, pauseSession, resumeSession, resetSession,
    showSettings, toggleSettings = () => useAppStore.setState(s => ({ showSettings: !s.showSettings })),
  } = useAppStore()

  const intervalSeconds = intervalMinutes * 60
  const progress = sessionActive ? (elapsed % intervalSeconds) / intervalSeconds : 0
  const timeToBreak = intervalSeconds - (elapsed % intervalSeconds)
  const circumference = 2 * Math.PI * 54

  return (
    <div
      className="mx-4 mt-4 rounded-2xl p-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Okrągły timer */}
      <div className="flex justify-center mb-4">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-alt)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke="var(--accent)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
              {formatTime(elapsed)}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {sessionActive && !sessionPaused ? 'aktywna' : sessionPaused ? 'pauza' : 'nieaktywna'}
            </span>
          </div>
        </div>
      </div>

      {/* Info do przerwy */}
      {sessionActive && (
        <p className="text-center text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Przerwa za <strong style={{ color: 'var(--accent)' }}>{formatTime(timeToBreak)}</strong>
        </p>
      )}

      {/* Statystyki */}
      <div className="flex justify-center gap-8 mb-5">
        <Stat label="Przerwy" value={breaksDone} />
        <Stat label="Pominięte" value={remindersIgnored} />
        <Stat label="Interwał" value={`${intervalMinutes}m`} />
      </div>

      {/* Przyciski */}
      <div className="flex gap-2">
        {!sessionActive ? (
          <button
            onClick={startSession}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ background: 'var(--accent)' }}
          >
            Start sesji
          </button>
        ) : sessionPaused ? (
          <button
            onClick={resumeSession}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ background: 'var(--accent)' }}
          >
            Wznów
          </button>
        ) : (
          <button
            onClick={pauseSession}
            className="flex-1 py-3 rounded-xl font-semibold transition-all"
            style={{ background: 'var(--surface-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Pauza
          </button>
        )}
        {sessionActive && (
          <button
            onClick={resetSession}
            className="px-4 py-3 rounded-xl transition-all"
            style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            ↺
          </button>
        )}
        <button
          onClick={() => useAppStore.setState(s => ({ showSettings: !s.showSettings }))}
          className="px-4 py-3 rounded-xl transition-all"
          style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          ⚙️
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}
