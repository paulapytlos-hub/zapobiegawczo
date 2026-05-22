import useAppStore from '../store/useAppStore'

export default function Header() {
  const { cuteMode, toggleMode } = useAppStore()

  return (
    <header className="flex items-center justify-between px-6 py-4"
      style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">🧘</span>
        <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
          Zapobiegawczo
        </span>
      </div>

      <button
        onClick={toggleMode}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
        style={{
          background: 'var(--surface-alt)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
        }}
      >
        {cuteMode ? '☕ Cozy' : '💼 Professional'}
      </button>
    </header>
  )
}
