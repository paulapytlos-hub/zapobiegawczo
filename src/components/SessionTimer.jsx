import useAppStore from '../store/useAppStore'
import { useT } from '../hooks/useT'

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
  const t = useT()

  const intervalSeconds = intervalMinutes * 60
  const progress = sessionActive ? (elapsed % intervalSeconds) / intervalSeconds : 0
  const timeToBreak = intervalSeconds - (elapsed % intervalSeconds)
  const circumference = 2 * Math.PI * 54

  const showNotifBanner = sessionActive && notifPermission !== 'granted' && !notifEnabled

  const statusText = awayMode ? t.statusAway
    : sessionActive && !sessionPaused ? t.statusActive
    : sessionPaused ? t.statusPaused
    : t.statusInactive

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
              {t.enableNotifTitle}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t.enableNotifDesc}
            </p>
          </div>
          <button
            onClick={requestNotifPermission}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            {t.enableBtn}
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
            {statusText}
          </span>
        </div>

        {/* Okrągły timer */}
        <div className="flex justify-center mb-5">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-alt)" strokeWidth="6" />
              {sessionActive && !sessionPaused && !awayMode && (
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={progress > 0.8 ? '#e06040' : 'var(--accent)'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  opacity="0.18"
                  filter="url(#glow)"
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 1s ease' }}
                />
              )}
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke={awayMode ? 'var(--border)' : progress > 0.8 && sessionActive ? '#e06040' : 'var(--accent)'}
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{
                  transition: 'stroke-dashoffset 1s linear, stroke 1.5s ease',
                  animation: sessionActive && !sessionPaused && !awayMode
                    ? 'timerPulse 3s ease-in-out infinite' : 'none',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-light font-mono tracking-tight"
                style={{
                  color: progress > 0.8 && sessionActive ? '#e06040' : 'var(--text)',
                  transition: 'color 1.5s ease',
                }}
              >
                {formatTime(elapsed)}
              </span>
            </div>
          </div>
        </div>

        {/* Info do przerwy */}
        {sessionActive && !awayMode && (
          <p className="text-center text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            {t.nextBreak}{' '}
            <span className="font-semibold" style={{ color: 'var(--accent)' }}>
              {formatTime(timeToBreak)}
            </span>
          </p>
        )}

        {awayMode && (
          <p className="text-center text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            {t.timerPaused}
          </p>
        )}

        {/* Statystyki */}
        <div
          className="flex justify-center mb-5 overflow-hidden"
          style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
        >
          <Stat label={t.statBreaks} value={breaksDone} />
          <Stat label={t.statSkipped} value={remindersIgnored} border />
          <Stat label={t.statInterval} value="60m" border />
        </div>

        {/* Przyciski główne */}
        <div className="flex gap-2 mb-2">
          {awayMode ? (
            <button
              onClick={comeBack}
              className="flex-1 py-3 font-medium text-white transition-all"
              style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
            >
              {t.backFromAway}
            </button>
          ) : !sessionActive ? (
            <button
              onClick={startSession}
              className="flex-1 py-3 font-medium text-white transition-all"
              style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
            >
              {t.startSession}
            </button>
          ) : sessionPaused ? (
            <button
              onClick={resumeSession}
              className="flex-1 py-3 font-medium text-white transition-all"
              style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
            >
              {t.resume}
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
              {t.pause}
            </button>
          )}

          {sessionActive && !awayMode && (
            <button
              onClick={resetSession}
              title={t.endSessionTitle}
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
            <span className="text-sm">{t.settings}</span>
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
            {t.leaveOffice}
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
