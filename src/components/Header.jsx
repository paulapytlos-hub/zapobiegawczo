import useAppStore from '../store/useAppStore'
import { useT } from '../hooks/useT'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  const { openWelcome, userName } = useAppStore()
  const t = useT()

  return (
    <header
      className="relative flex items-center justify-center px-5 py-5"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Pomoc — lewy róg */}
      <button
        onClick={openWelcome}
        title={t.help}
        className="absolute left-5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
        style={{
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          border: '1.5px solid var(--accent)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="7" cy="7" r="6" />
          <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.5 7 6.75 7 8" />
          <circle cx="7" cy="10" r="0.5" fill="currentColor" stroke="none" />
        </svg>
        {t.help}
      </button>

      {/* Logo — wycentrowane */}
      <div className="flex flex-col items-center gap-1">
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 500,
            fontSize: '1.6rem',
            color: 'var(--text)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          {t.appName}
        </h1>
        {userName ? (
          <p className="text-sm" style={{ color: 'var(--accent)', letterSpacing: '0.01em', opacity: 0.9 }}>
            Hello, {userName}
          </p>
        ) : (
          <p className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            {t.tagline}
          </p>
        )}
      </div>

      {/* Przełącznik języka — prawy róg */}
      <div className="absolute right-5">
        <LanguageToggle />
      </div>
    </header>
  )
}
