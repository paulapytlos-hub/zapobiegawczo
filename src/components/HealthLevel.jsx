import useAppStore from '../store/useAppStore'

const WATER_GOAL = 8
const BREAK_GOAL = 5

function Bar({ value, max, color }) {
  const pct = Math.min(value / max, 1) * 100
  return (
    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
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

  const waterPct = Math.round(Math.min(waterGlasses / WATER_GOAL, 1) * 100)
  const breakPct = Math.round(Math.min(breaksDone / BREAK_GOAL, 1) * 100)

  const waterDone = waterGlasses >= WATER_GOAL
  const breaksDoneGoal = breaksDone >= BREAK_GOAL

  return (
    <div
      className="mx-4 mt-3 rounded-xl px-4 py-3 space-y-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        Twój dzień
      </p>

      {/* Woda */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--text)' }}>
            💧 Nawodnienie
          </span>
          <span className="text-xs font-medium" style={{ color: waterDone ? 'var(--accent)' : 'var(--text-muted)' }}>
            {waterGlasses}/{WATER_GOAL}{waterDone ? ' ✓' : ''}
          </span>
        </div>
        <Bar
          value={waterGlasses}
          max={WATER_GOAL}
          color={waterDone ? 'var(--accent)' : 'linear-gradient(90deg, var(--accent), var(--accent))'}
        />
      </div>

      {/* Ćwiczenia */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--text)' }}>
            🧘 Przerwy na ćwiczenia
          </span>
          <span className="text-xs font-medium" style={{ color: breaksDoneGoal ? 'var(--accent)' : 'var(--text-muted)' }}>
            {breaksDone}/{BREAK_GOAL}{breaksDoneGoal ? ' ✓' : ''}
          </span>
        </div>
        <Bar
          value={breaksDone}
          max={BREAK_GOAL}
          color="var(--accent)"
        />
      </div>
    </div>
  )
}
