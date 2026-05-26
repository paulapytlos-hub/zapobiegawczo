import useAppStore from '../store/useAppStore'

const WATER_GOAL = 8
const HOUR_PRESETS = [4, 6, 8, 10]

function Bar({ value, max }) {
  const pct = Math.min(value / max, 1) * 100
  const done = value >= max
  return (
    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: done ? 'var(--accent)' : 'var(--accent)',
          opacity: done ? 1 : 0.7,
          borderRadius: '99px',
          transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
    </div>
  )
}

export default function HealthLevel() {
  const waterGlasses = useAppStore(s => s.waterGlasses)
  const breaksDone = useAppStore(s => s.breaksDone)
  const workHours = useAppStore(s => s.workHours)
  const setWorkHours = useAppStore(s => s.setWorkHours)
  const intervalMinutes = useAppStore(s => s.intervalMinutes)

  const breakGoal = Math.max(1, Math.floor(workHours * 60 / intervalMinutes))
  const waterDone = waterGlasses >= WATER_GOAL
  const breaksDoneGoal = breaksDone >= breakGoal

  return (
    <div
      className="rounded-xl p-3 space-y-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        Dzień
      </p>

      {/* Czas pracy */}
      <div>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Czas pracy
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px' }}>
          {HOUR_PRESETS.map(h => (
            <button
              key={h}
              onClick={() => setWorkHours(h)}
              style={{
                padding: '3px 0',
                fontSize: '0.6rem',
                fontWeight: workHours === h ? '700' : '400',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: workHours === h ? 'var(--accent)' : 'var(--surface-alt)',
                color: workHours === h ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      {/* Nawodnienie */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: '0.65rem', color: 'var(--text)' }}>💧 Woda</span>
          <span style={{ fontSize: '0.65rem', fontWeight: '600', color: waterDone ? 'var(--accent)' : 'var(--text-muted)' }}>
            {waterGlasses}/{WATER_GOAL}{waterDone ? ' ✓' : ''}
          </span>
        </div>
        <Bar value={waterGlasses} max={WATER_GOAL} />
      </div>

      {/* Ćwiczenia */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: '0.65rem', color: 'var(--text)' }}>🧘 Przerwy</span>
          <span style={{ fontSize: '0.65rem', fontWeight: '600', color: breaksDoneGoal ? 'var(--accent)' : 'var(--text-muted)' }}>
            {breaksDone}/{breakGoal}{breaksDoneGoal ? ' ✓' : ''}
          </span>
        </div>
        <Bar value={breaksDone} max={breakGoal} />
        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
          co {intervalMinutes} min · {workHours}h pracy
        </p>
      </div>
    </div>
  )
}
