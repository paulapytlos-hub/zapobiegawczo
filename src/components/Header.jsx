import useAppStore from '../store/useAppStore'

export default function Header() {
  const { cuteMode, toggleMode } = useAppStore()

  return (
    <header
      className="flex items-center justify-between px-5 py-4"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <LeafIcon />
        <div>
          <span className="font-semibold text-base tracking-tight" style={{ color: 'var(--text)' }}>
            Zapobiegawczo
          </span>
          <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>
            zadbaj o siebie
          </p>
        </div>
      </div>

      <button
        onClick={toggleMode}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
        style={{
          background: 'var(--surface-alt)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
        {cuteMode ? 'Cozy' : 'Wellness'}
      </button>
    </header>
  )
}

function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="8" fill="var(--accent-soft)" />
      <path
        d="M14 6C14 6 8 9 8 15C8 18.314 10.686 21 14 21C17.314 21 20 18.314 20 15C20 9 14 6 14 6Z"
        fill="var(--accent)"
        opacity="0.9"
      />
      <line x1="14" y1="21" x2="14" y2="23" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="13" x2="11" y2="16" stroke="var(--surface)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
