import useAppStore from '../store/useAppStore'

const GOAL = 8

const WATER_FACTS = [
  'Już 1–2% odwodnienia obniża koncentrację i czas reakcji — jak po nieprzespanej nocy.',
  'Mózg składa się w 75% z wody. Odwodnienie dosłownie zmniejsza jego objętość.',
  'Regularne picie wody redukuje bóle głowy z napięcia o ponad 40% u pracowników biurowych.',
  'Woda wspomaga produkcję mazi stawowej — chroni kręgosłup i stawy przy długim siedzeniu.',
  'Odwodnienie zwiększa poziom kortyzolu (hormonu stresu) — pijesz wodę, redukujesz stres.',
  'Szklanka wody przed posiłkiem poprawia trawienie i daje uczucie sytości.',
  'Nawodniony mózg przetwarza informacje o 14% szybciej. Woda = lepsze decyzje.',
  'Cel osiągnięty! Twoje ciało i umysł Ci dziękują. Jutro zacznij od nowa 💧',
]

export default function WaterTracker() {
  const waterGlasses = useAppStore(s => s.waterGlasses)
  const lastWaterAt = useAppStore(s => s.lastWaterAt)
  const addWaterGlass = useAppStore(s => s.addWaterGlass)
  const resetWater = useAppStore(s => s.resetWater)

  const sinceLastGlass = lastWaterAt
    ? timeSince(lastWaterAt)
    : null

  const pct = Math.min(waterGlasses / GOAL, 1)
  const nudge = lastWaterAt && (Date.now() - lastWaterAt) > 60 * 60 * 1000

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-5 space-y-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Nagłówek */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.1rem' }}>💧</span>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Nawodnienie</h3>
          {nudge && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Czas na szklankę!
            </span>
          )}
        </div>
        <span className="text-xs font-semibold" style={{ color: waterGlasses >= GOAL ? 'var(--accent)' : 'var(--text-muted)' }}>
          {waterGlasses} / {GOAL} szklanek
        </span>
      </div>

      {/* Kubeczki */}
      <div className="flex gap-1.5">
        {Array.from({ length: GOAL }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-7 rounded-md transition-all"
            style={{
              background: i < waterGlasses ? 'var(--accent)' : 'var(--surface-alt)',
              border: '1px solid var(--border)',
              opacity: i < waterGlasses ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Pasek procentowy */}
      <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
        <div
          style={{
            height: '100%',
            width: `${pct * 100}%`,
            background: pct >= 1 ? 'var(--accent)' : 'var(--accent)',
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Fakt o nawodnieniu */}
      <p
        className="text-xs px-3 py-2.5 rounded-lg leading-relaxed italic"
        style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
      >
        {WATER_FACTS[Math.min(waterGlasses, WATER_FACTS.length - 1)]}
      </p>

      {/* Czas od ostatniej szklanki */}
      {sinceLastGlass && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Ostatnia szklanka {sinceLastGlass} temu
          {nudge && <span style={{ color: 'var(--accent)' }}> — czas na kolejną!</span>}
        </p>
      )}

      {/* Przyciski */}
      <div className="flex gap-2">
        <button
          onClick={addWaterGlass}
          disabled={waterGlasses >= GOAL}
          className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-all"
          style={{
            background: waterGlasses >= GOAL ? 'var(--border)' : 'var(--accent)',
            opacity: waterGlasses >= GOAL ? 0.6 : 1,
          }}
        >
          {waterGlasses >= GOAL ? '🎉 Cel osiągnięty!' : '+ Wypiłem/am szklankę'}
        </button>
        {waterGlasses > 0 && (
          <button
            onClick={resetWater}
            className="px-3 py-2.5 text-xs rounded-lg transition-all"
            style={{
              background: 'var(--surface-alt)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

function timeSince(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'mniej niż minutę'
  if (mins === 1) return '1 minutę'
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  return h === 1 ? '1 godz.' : `${h} godz.`
}
