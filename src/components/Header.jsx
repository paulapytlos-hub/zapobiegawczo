import useAppStore from '../store/useAppStore'

export default function Header() {
  const { cuteMode, toggleMode } = useAppStore()

  return (
    <header
      className="relative flex items-center justify-center px-5 py-5"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
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
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
          zadbaj o siebie
        </p>
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
        {cuteMode ? 'Cozy' : 'Wellness'}
      </button>
    </header>
  )
}
