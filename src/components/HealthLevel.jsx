import useAppStore from '../store/useAppStore'

const WATER_GOAL = 8
const MIN_H = 1
const MAX_H = 12

function formatHours(h) {
  const whole = Math.floor(h)
  const half = h % 1 !== 0
  if (half) return `${whole}h 30`
  return `${whole}h`
}

function Bar({ value, max }) {
  const pct = Math.min(value / max, 1) * 100
  const done = value >= max
  return (
    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--accent)',
          opacity: done ? 1 : 0.75,
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

  // Dynamiczne tło toru slidera
  const sliderPct = ((workHours - MIN_H) / (MAX_H - MIN_H)) * 100
  const sliderBg = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${sliderPct}%, var(--border) ${sliderPct}%, var(--border) 100%)`

  return (
    <div
      className="rounded-xl p-3 space-y-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        Dzień
      </p>

      {/* Czas pracy — slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Czas pracy
          </p>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent)' }}>
            {formatHours(workHours)}
          </span>
        </div>
        <input
          type="range"
          className="work-slider"
          min={MIN_H}
          max={MAX_H}
          step={0.5}
          value={workHours}
          onChange={e => setWorkHours(parseFloat(e.target.value))}
          style={{ background: sliderBg }}
        />
        <div className="flex justify-between mt-0.5">
          <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>1h</span>
          <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>12h</span>
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

      {/* Przerwy */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: '0.65rem', color: 'var(--text)' }}>🧘 Przerwy</span>
          <span style={{ fontSize: '0.65rem', fontWeight: '600', color: breaksDoneGoal ? 'var(--accent)' : 'var(--text-muted)' }}>
            {breaksDone}/{breakGoal}{breaksDoneGoal ? ' ✓' : ''}
          </span>
        </div>
        <Bar value={breaksDone} max={breakGoal} />
        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
          co {intervalMinutes} min · cel: {breakGoal} przerwy
        </p>
      </div>
    </div>
  )
}
