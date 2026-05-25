import useAppStore from '../store/useAppStore'

const GOAL = 8

const WATER_FACTS = [
  'Wypij pierwszą szklankę — nawodniony mózg działa o 14% szybciej.',
  '1–2% odwodnienia obniża koncentrację jak nieprzespana noc.',
  'Mózg składa się w 75% z wody. Dbasz o niego każdą szklanką.',
  'Woda wspomaga produkcję mazi stawowej — chroni kręgosłup.',
  'Odwodnienie zwiększa kortyzol — woda redukuje stres.',
  'Połowa normy! Regularne nawodnienie redukuje bóle głowy o 40%.',
  'Jeszcze dwie szklanki do celu — Twoje stawy Ci dziękują.',
  'Ostatnia prosta — krążenie i energia na najwyższym poziomie!',
  'Cel osiągnięty! Twoje ciało i umysł są w pełni nawodnione. 🌸',
]

export default function WaterTracker() {
  const waterGlasses = useAppStore(s => s.waterGlasses)
  const lastWaterAt = useAppStore(s => s.lastWaterAt)
  const addWaterGlass = useAppStore(s => s.addWaterGlass)
  const resetWater = useAppStore(s => s.resetWater)

  const nudge = lastWaterAt && (Date.now() - lastWaterAt) > 60 * 60 * 1000
  const done = waterGlasses >= GOAL

  return (
    <div
      className="rounded-xl p-3 flex flex-col items-center gap-2"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${nudge ? 'var(--accent)' : 'var(--border)'}`,
        transition: 'border-color 0.3s',
      }}
    >
      {/* Tytuł */}
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
        Woda
      </p>

      {/* Kwiatek */}
      <FlowerSVG stage={waterGlasses} />

      {/* Licznik */}
      <p className="text-sm font-bold" style={{ color: done ? 'var(--accent)' : 'var(--text)' }}>
        {waterGlasses}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/{GOAL}</span>
      </p>

      {/* Kropki postępu */}
      <div className="flex flex-wrap gap-1 justify-center">
        {Array.from({ length: GOAL }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: i < waterGlasses ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Nudge badge */}
      {nudge && !done && (
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium text-center"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          Czas na szklankę!
        </span>
      )}

      {/* Fakt */}
      <p
        className="text-center leading-snug"
        style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.45 }}
      >
        {WATER_FACTS[Math.min(waterGlasses, WATER_FACTS.length - 1)]}
      </p>

      {/* Przycisk */}
      <button
        onClick={addWaterGlass}
        disabled={done}
        className="w-full py-2 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: done ? 'var(--border)' : 'var(--accent)',
          color: done ? 'var(--text-muted)' : '#fff',
          opacity: done ? 0.7 : 1,
        }}
      >
        {done ? '🌸 Cel!' : '💧 +1'}
      </button>

      {waterGlasses > 0 && (
        <button
          onClick={resetWater}
          className="text-xs"
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          reset
        </button>
      )}
    </div>
  )
}

function FlowerSVG({ stage }) {
  const stemH = stage === 0 ? 0 : 18 + (stage / GOAL) * 52
  const flowerY = 108 - stemH
  const showLeaves = stage >= 2
  const showBud = stage >= 4
  const petalCount = stage <= 5 ? Math.max(0, stage - 4) * 2 : stage <= 7 ? 4 : 6
  const petalR = stage >= 8 ? 11 : 8
  const budR = stage >= 8 ? 9 : stage >= 6 ? 7 : 5
  const leafY = 108 - stemH * 0.58

  return (
    <svg viewBox="0 0 70 120" width="72" height="112">
      {/* Ziemia */}
      <ellipse cx="35" cy="114" rx="25" ry="6" fill="#b08060" opacity="0.35" />

      {/* Nasionko (etap 0) */}
      {stage === 0 && (
        <ellipse cx="35" cy="110" rx="6" ry="4" fill="#8B6B47" opacity="0.7" />
      )}

      {/* Łodyga */}
      {stage > 0 && (
        <line
          x1="35" y1="112" x2="35" y2={112 - stemH}
          stroke="#4a8a3a" strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'all 0.5s ease' }}
        />
      )}

      {/* Liście */}
      {showLeaves && (
        <>
          <path
            d={`M35 ${leafY} C20 ${leafY - 12} 16 ${leafY + 6} 28 ${leafY + 10}`}
            fill="#5aaa4a" opacity="0.9"
          />
          <path
            d={`M35 ${leafY} C50 ${leafY - 12} 54 ${leafY + 6} 42 ${leafY + 10}`}
            fill="#5aaa4a" opacity="0.9"
          />
        </>
      )}

      {/* Płatki */}
      {petalCount > 0 && Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i * (360 / petalCount) - 90) * (Math.PI / 180)
        const dist = budR + petalR * 0.6
        const px = 35 + Math.cos(angle) * dist
        const py = flowerY + Math.sin(angle) * dist
        return (
          <ellipse
            key={i}
            cx={px} cy={py}
            rx={petalR * 0.55} ry={petalR}
            transform={`rotate(${i * (360 / petalCount)}, ${px}, ${py})`}
            fill="var(--accent)"
            opacity={stage >= 8 ? 0.9 : 0.75}
            style={{ transition: 'all 0.4s ease' }}
          />
        )
      })}

      {/* Środek kwiatu */}
      {showBud && (
        <circle
          cx="35" cy={flowerY} r={budR}
          fill={stage >= 6 ? '#f5c842' : '#6ac06a'}
          style={{ transition: 'all 0.4s ease' }}
        />
      )}
    </svg>
  )
}
