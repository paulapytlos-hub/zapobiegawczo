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
    sessionActive, sessionPaused, awayMode, elapsed,
    intervalMinutes, breaksDone, remindersIgnored,
    startSession, pauseSession, resumeSession, resetSession,
    goAway, comeBack,
    notifPermission, notifEnabled, requestNotifPermission,
  } = useAppStore()

  const intervalSeconds = intervalMinutes * 60
  const progress = sessionActive ? (elapsed % intervalSeconds) / intervalSeconds : 0
  const timeToBreak = intervalSeconds - (elapsed % intervalSeconds)
  const circumference = 2 * Math.PI * 54

  const showNotifBanner = sessionActive && notifPermission !== 'granted' && !notifEnabled

  return (
    <div className="mx-4 mt-5 space-y-3">

      {/* Banner — włącz powiadomienia */}
      {showNotifBanner && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm"
          style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="font-medium" style={{ color: 'var(--text)' }}>
              Włącz powiadomienia na pulpicie
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Dostaniesz cichą notyfikację nawet gdy jesteś na innej karcie
            </p>
          </div>
          <button
            onClick={requestNotifPermission}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            Włącz
          </button>
        </div>
      )}

      {/* Karta timera */}
      <div
        className="p-6"
        style={{
          background: awayMode ? 'var(--surface-alt)' : 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          transition: 'background 0.3s',
        }}
      >
        {/* Status pill */}
        <div className="flex justify-center mb-5">
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{
              background: awayMode
                ? 'var(--surface)'
                : sessionActive && !sessionPaused
                  ? 'var(--accent-soft)'
                  : 'var(--surface-alt)',
              color: awayMode
                ? 'var(--text-muted)'
                : sessionActive && !sessionPaused
                  ? 'var(--accent)'
                  : 'var(--text-muted)',
            }}
          >
            {awayMode ? 'poza biurem' : sessionActive && !sessionPaused ? 'aktywna' : sessionPaused ? 'wstrzymana' : 'nieaktywna'}
          </span>
        </div>

        {/* Okrągły timer */}
        <div className="flex justify-center mb-5">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-alt)" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke={awayMode ? 'var(--border)' : 'var(--accent)'} strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-light font-mono tracking-tight" style={{ color: 'var(--text)' }}>
                {formatTime(elapsed)}
              </span>
            </div>
          </div>
        </div>

        {/* Info do przerwy */}
        {sessionActive && !awayMode && (
          <p className="text-center text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Następna przerwa za{' '}
            <span className="font-semibold" style={{ color: 'var(--accent)' }}>
              {formatTime(timeToBreak)}
            </span>
          </p>
        )}

        {awayMode && (
          <p className="text-center text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Timer wstrzymany — wróć gdy będziesz gotowa
          </p>
        )}

        {/* Statystyki */}
        <div
          className="flex justify-center mb-5 overflow-hidden"
          style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
        >
          <Stat label="Przerwy" value={breaksDone} />
          <Stat label="Pominięte" value={remindersIgnored} border />
          <Stat label="Interwał" value={`${intervalMinutes}m`} border />
        </div>

        {/* Przyciski główne */}
        <div className="flex gap-2 mb-2">
          {awayMode ? (
            <button
              onClick={comeBack}
              className="flex-1 py-3 font-medium text-white transition-all"
              style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
            >
              Wróciłam do biura
            </button>
          ) : !sessionActive ? (
            <button
              onClick={startSession}
              className="flex-1 py-3 font-medium text-white transition-all"
              style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
            >
              Rozpocznij sesję
            </button>
          ) : sessionPaused ? (
            <button
              onClick={resumeSession}
              className="flex-1 py-3 font-medium text-white transition-all"
              style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
            >
              Wznów
            </button>
          ) : (
            <button
              onClick={pauseSession}
              className="flex-1 py-3 font-medium transition-all"
              style={{
                background: 'var(--surface-alt)', color: 'var(--text)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              }}
            >
              Pauza
            </button>
          )}

          {sessionActive && !awayMode && (
            <button
              onClick={resetSession}
              title="Zakończ sesję"
              className="px-4 py-3 transition-all"
              style={{
                background: 'var(--surface-alt)', color: 'var(--text-muted)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              }}
            >
              <ResetIcon />
            </button>
          )}

          <button
            onClick={() => useAppStore.setState(s => ({ showSettings: !s.showSettings }))}
            className="px-4 py-3 flex items-center gap-2 transition-all"
            style={{
              background: 'var(--surface-alt)', color: 'var(--text-muted)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            }}
          >
            <SettingsIcon />
            <span className="text-sm">Ustawienia</span>
          </button>
        </div>

        {/* Przycisk "Wychodzę z biura" */}
        {sessionActive && !awayMode && (
          <button
            onClick={goAway}
            className="w-full py-2.5 text-sm transition-all"
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Wychodzę z biura
          </button>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, border }) {
  return (
    <div
      className="flex-1 py-3 text-center"
      style={{ borderLeft: border ? '1px solid var(--border)' : 'none' }}
    >
      <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 8a6 6 0 1 0 1.5-4" />
      <polyline points="2,4 2,8 6,8" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" />
    </svg>
  )
}
