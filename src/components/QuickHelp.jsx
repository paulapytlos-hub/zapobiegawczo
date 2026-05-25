import useAppStore from '../store/useAppStore'
import { exercises } from '../data/exercises'

export default function QuickHelp() {
  const setQuickHelp = useAppStore(s => s.setQuickHelp)

  return (
    <div className="mx-4 mt-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 500,
            fontSize: '1.1rem',
            color: 'var(--text)',
          }}
        >
          Szybka pomoc
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Co Cię boli?
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {exercises.map(ex => (
          <button
            key={ex.id}
            onClick={() => setQuickHelp(ex.id)}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all text-center"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = ex.areaColor
              e.currentTarget.style.background = `${ex.areaColor}18`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--surface)'
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: ex.areaColor }}
            />
            <span className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
              {ex.area}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
