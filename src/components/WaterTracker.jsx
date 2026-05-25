import useAppStore from '../store/useAppStore'

const MAX_DISPLAY = 12   // max kwiatków widocznych w ogródku
const GOAL = 8           // cel dzienny (można pić więcej)

const WATER_FACTS = [
  'Wypij pierwszą szklankę — nawodniony mózg działa o 14% szybciej.',
  '1–2% odwodnienia obniża koncentrację jak nieprzespana noc.',
  'Mózg składa się w 75% z wody. Każda szklanka ma znaczenie.',
  'Woda wspomaga produkcję mazi stawowej — chroni kręgosłup.',
  'Odwodnienie zwiększa kortyzol — woda obniża stres.',
  'Połowa celu! Regularne nawodnienie redukuje bóle głowy o 40%.',
  'Prawie! Jeszcze trochę — krążenie i energia na najwyższym poziomie.',
  'Ostatnia szklanka do dziennego celu — cel tuż tuż!',
  'Cel osiągnięty! 🌸 Możesz pić dalej — ogródek rośnie!',
  'Bonusowa szklanka — Twoje stawy i nerki Ci dziękują.',
  'Wyjątkowo nawodniony dzień. Skóra i umysł widocznie korzystają.',
  'Mistrzyni nawodnienia! Rzadko ktoś pije tyle wody przy pracy.',
]

// Wiek kwiatu = ile szklanek wypito PO nim → im starszy tym bardziej rozwinięty
function flowerStage(index, total) {
  if (index >= total) return 0
  const age = total - index
  if (age >= 6) return 4  // pełny rozkwit
  if (age >= 4) return 3  // otwarty kwiat
  if (age >= 2) return 2  // pąk
  return 1                // kiełek
}

export default function WaterTracker() {
  const waterGlasses = useAppStore(s => s.waterGlasses)
  const addWaterGlass = useAppStore(s => s.addWaterGlass)
  const resetWater = useAppStore(s => s.resetWater)

  const displayCount = Math.max(waterGlasses, 1)
  const showSlots = Math.min(Math.ceil(displayCount / 3) * 3, MAX_DISPLAY)

  return (
    <div
      className="rounded-xl p-3 flex flex-col items-center gap-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Tytuł */}
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        Nawodnienie
      </p>

      {/* Licznik */}
      <div className="text-center">
        <span className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{waterGlasses}</span>
        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
          {waterGlasses === 1 ? 'szklanka' : waterGlasses < 5 ? 'szklanki' : 'szklanek'}
        </span>
        {waterGlasses >= GOAL && (
          <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--accent)' }}>
            cel {GOAL} ✓
          </p>
        )}
      </div>

      {/* Ogródek kwiatków — 3 kolumny */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          width: '100%',
        }}
      >
        {Array.from({ length: showSlots }).map((_, i) => (
          <div key={i} className="flex justify-center">
            <MiniFlower stage={flowerStage(i, waterGlasses)} />
          </div>
        ))}
      </div>

      {waterGlasses > MAX_DISPLAY && (
        <p className="text-xs" style={{ color: 'var(--accent)' }}>
          +{waterGlasses - MAX_DISPLAY} więcej 🌸
        </p>
      )}

      {/* Fakt */}
      <p
        className="text-center leading-snug"
        style={{
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          lineHeight: 1.45,
          fontStyle: 'italic',
        }}
      >
        {WATER_FACTS[Math.min(waterGlasses, WATER_FACTS.length - 1)]}
      </p>

      {/* Przycisk */}
      <button
        onClick={addWaterGlass}
        className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        💧 +1 szklanka
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

// Miniaturowy kwiatek SVG — 4 etapy wzrostu
function MiniFlower({ stage }) {
  const w = 42
  const h = 58

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {/* Ziemia */}
      <ellipse cx="21" cy={h - 3} rx="13" ry="4" fill="#b08060" opacity="0.3" />

      {stage === 0 && (
        /* Puste miejsce — nasionko */
        <ellipse cx="21" cy={h - 6} rx="4" ry="2.5" fill="#8B6B47" opacity="0.35" />
      )}

      {stage >= 1 && (
        /* Łodyga */
        <line
          x1="21" y1={h - 5}
          x2="21" y2={stage === 1 ? h - 22 : stage === 2 ? h - 32 : h - 38}
          stroke="#4a8a3a" strokeWidth="2" strokeLinecap="round"
        />
      )}

      {stage === 1 && (
        /* Kiełek */
        <circle cx="21" cy={h - 24} r="3.5" fill="#6ab85a" />
      )}

      {stage >= 2 && (
        /* Liście */
        <>
          <path
            d={`M21 ${h - 26} C12 ${h - 32} 10 ${h - 22} 17 ${h - 20}`}
            fill="#5aaa4a" opacity="0.85"
          />
          <path
            d={`M21 ${h - 26} C30 ${h - 32} 32 ${h - 22} 25 ${h - 20}`}
            fill="#5aaa4a" opacity="0.85"
          />
        </>
      )}

      {stage === 2 && (
        /* Pąk */
        <ellipse cx="21" cy={h - 38} rx="4" ry="6" fill="#6ab85a" />
      )}

      {stage >= 3 && (
        /* Płatki */
        <>
          {[0, 60, 120, 180, 240, 300].slice(0, stage === 3 ? 4 : 6).map((deg, i) => {
            const rad = (deg - 90) * Math.PI / 180
            const r = stage >= 4 ? 9 : 7
            const px = 21 + Math.cos(rad) * r
            const py = (h - 40) + Math.sin(rad) * r
            return (
              <ellipse
                key={i}
                cx={px} cy={py}
                rx={stage >= 4 ? 5 : 4} ry={stage >= 4 ? 7 : 5}
                transform={`rotate(${deg}, ${px}, ${py})`}
                fill="var(--accent)"
                opacity={stage >= 4 ? 0.9 : 0.75}
              />
            )
          })}
          {/* Środek */}
          <circle cx="21" cy={h - 40} r={stage >= 4 ? 5.5 : 4} fill="#f5c842" />
        </>
      )}
    </svg>
  )
}
