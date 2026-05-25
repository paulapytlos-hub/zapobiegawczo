import useAppStore from '../store/useAppStore'

export default function Header() {
  const { cuteMode, toggleMode, openWelcome, userName } = useAppStore()

  return (
    <header
      className="relative flex items-center justify-center px-5 py-5"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Przycisk pomocy — lewy róg */}
      <button
        onClick={openWelcome}
        title="Jak korzystać z aplikacji?"
        className="absolute left-5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
        style={{
          background: 'var(--surface-alt)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="7" cy="7" r="6" />
          <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.5 7 6.75 7 8" />
          <circle cx="7" cy="10" r="0.5" fill="currentColor" stroke="none" />
        </svg>
        Pomoc
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
          Zapobiegawczo
        </h1>
        {userName ? (
          <p
            className="text-sm"
            style={{ color: 'var(--accent)', letterSpacing: '0.01em', opacity: 0.9 }}
          >
            Hello, {userName}
          </p>
        ) : (
          <p className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Twój system zdrowia przy pracy
          </p>
        )}
      </div>

      {/* Przełącznik motywu — prawy róg */}
      <button
        onClick={toggleMode}
        className="absolute right-5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
        style={{
          background: 'var(--surface-alt)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <span
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--accent)', display: 'inline-block',
          }}
        />
        {cuteMode ? 'Ciemny' : 'Jasny'}
      </button>
    </header>
  )
}
