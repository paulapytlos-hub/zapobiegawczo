import useAppStore from '../store/useAppStore'
import { useT } from '../hooks/useT'

const MAX_DISPLAY = 12
const GOAL = 8

function flowerStage(index, total) {
  if (index >= total) return 0
  const age = total - index
  if (age >= 6) return 4
  if (age >= 4) return 3
  if (age >= 2) return 2
  return 1
}

const FLOWER_TYPES = ['tulip', 'daisy', 'sunflower', 'poppy']

export default function WaterTracker() {
  const waterGlasses = useAppStore(s => s.waterGlasses)
  const lastWaterAt = useAppStore(s => s.lastWaterAt)
  const addWaterGlass = useAppStore(s => s.addWaterGlass)
  const removeWaterGlass = useAppStore(s => s.removeWaterGlass)
  const resetWater = useAppStore(s => s.resetWater)
  const t = useT()
  const nudge = lastWaterAt && (Date.now() - lastWaterAt) > 60 * 60 * 1000

  const slots = Math.min(Math.max(Math.ceil(waterGlasses / 3) * 3, 3), MAX_DISPLAY)

  const glassLabel = waterGlasses === 1 ? t.waterGlass1
    : waterGlasses < 5 ? t.waterGlass24
    : t.waterGlass5

  return (
    <div
      className="rounded-xl p-3 flex flex-col items-center gap-3"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${nudge ? 'var(--accent)' : 'var(--border)'}`,
        transition: 'border-color 0.3s',
      }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        {t.waterTitle}
      </p>

      <div className="text-center">
        <span className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{waterGlasses}</span>
        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
          {glassLabel}
        </span>
        {waterGlasses >= GOAL && (
          <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>{t.waterGoal(GOAL)}</p>
        )}
      </div>

      {/* Ogród — 3 kolumny */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', width: '100%' }}>
        {Array.from({ length: slots }).map((_, i) => (
          <div key={i} className="flex justify-center">
            <MiniFlower
              stage={flowerStage(i, waterGlasses)}
              type={FLOWER_TYPES[i % FLOWER_TYPES.length]}
            />
          </div>
        ))}
      </div>

      {waterGlasses > MAX_DISPLAY && (
        <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
          {t.waterMore(waterGlasses - MAX_DISPLAY)}
        </p>
      )}

      <p style={{ fontSize: '0.63rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.45, fontStyle: 'italic' }}>
        {t.waterFacts[Math.min(waterGlasses, t.waterFacts.length - 1)]}
      </p>

      <div className="flex w-full gap-2">
        <button
          onClick={removeWaterGlass}
          disabled={waterGlasses === 0}
          className="py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{
            flex: '0 0 38px',
            background: waterGlasses === 0 ? 'var(--border)' : 'var(--surface-alt)',
            color: waterGlasses === 0 ? 'var(--text-muted)' : 'var(--text)',
            border: '1px solid var(--border)',
            cursor: waterGlasses === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          −
        </button>
        <button
          onClick={addWaterGlass}
          className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          💧 +1
        </button>
      </div>

      {waterGlasses > 0 && (
        <button
          onClick={resetWater}
          style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {t.waterReset}
        </button>
      )}
    </div>
  )
}

function MiniFlower({ stage, type }) {
  const W = 42, H = 62
  const groundY = H - 4
  const ground = <ellipse cx="21" cy={groundY} rx="14" ry="4" fill="#b08060" opacity="0.25" />

  if (stage === 0) return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {ground}
      <ellipse cx="21" cy={groundY - 3} rx="4" ry="2.5" fill="#8B6B47" opacity="0.4" />
    </svg>
  )

  switch (type) {
    case 'tulip':   return <Tulip stage={stage} W={W} H={H} ground={ground} groundY={groundY} />
    case 'daisy':   return <Daisy stage={stage} W={W} H={H} ground={ground} groundY={groundY} />
    case 'sunflower': return <Sunflower stage={stage} W={W} H={H} ground={ground} groundY={groundY} />
    case 'poppy':   return <Poppy stage={stage} W={W} H={H} ground={ground} groundY={groundY} />
    default:        return <Tulip stage={stage} W={W} H={H} ground={ground} groundY={groundY} />
  }
}

function Tulip({ stage, W, H, ground, groundY }) {
  const stemTop = groundY - [0, 20, 30, 38, 42][stage]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {ground}
      <line x1="21" y1={groundY - 2} x2="21" y2={stemTop + 2} stroke="#4a8a3a" strokeWidth="2.2" strokeLinecap="round" />
      {stage >= 2 && <>
        <path d={`M21 ${stemTop + 14} C13 ${stemTop + 8} 11 ${stemTop + 20} 18 ${stemTop + 22}`} fill="#5aaa4a" />
        <path d={`M21 ${stemTop + 14} C29 ${stemTop + 8} 31 ${stemTop + 20} 24 ${stemTop + 22}`} fill="#5aaa4a" />
      </>}
      {stage === 2 && <ellipse cx="21" cy={stemTop + 4} rx="5" ry="7" fill="#e06070" />}
      {stage === 3 && <>
        <ellipse cx="17" cy={stemTop + 5} rx="4.5" ry="8" transform={`rotate(-15,17,${stemTop + 5})`} fill="#e06070" />
        <ellipse cx="21" cy={stemTop + 3} rx="4" ry="9" fill="#e8405a" />
        <ellipse cx="25" cy={stemTop + 5} rx="4.5" ry="8" transform={`rotate(15,25,${stemTop + 5})`} fill="#e06070" />
      </>}
      {stage === 4 && <>
        <ellipse cx="15" cy={stemTop + 7} rx="5" ry="9" transform={`rotate(-25,15,${stemTop + 7})`} fill="#e06070" opacity="0.9" />
        <ellipse cx="21" cy={stemTop + 4} rx="5" ry="10" fill="#e8405a" />
        <ellipse cx="27" cy={stemTop + 7} rx="5" ry="9" transform={`rotate(25,27,${stemTop + 7})`} fill="#e06070" opacity="0.9" />
        <ellipse cx="21" cy={stemTop + 10} rx="4" ry="6" fill="#f06080" opacity="0.7" />
        <circle cx="21" cy={stemTop + 4} r="3" fill="#f5c842" opacity="0.7" />
      </>}
    </svg>
  )
}

function Daisy({ stage, W, H, ground, groundY }) {
  const stemTop = groundY - [0, 18, 28, 36, 40][stage]
  const cx = 21, cy = stemTop
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {ground}
      <line x1="21" y1={groundY - 2} x2="21" y2={stemTop + 2} stroke="#4a8a3a" strokeWidth="2" strokeLinecap="round" />
      {stage >= 2 && <>
        <path d={`M21 ${stemTop + 16} C12 ${stemTop + 10} 10 ${stemTop + 22} 17 ${stemTop + 24}`} fill="#5aaa4a" />
        <path d={`M21 ${stemTop + 16} C30 ${stemTop + 10} 32 ${stemTop + 22} 25 ${stemTop + 24}`} fill="#5aaa4a" />
      </>}
      {stage === 2 && <circle cx={cx} cy={cy} r="4.5" fill="#f5c842" />}
      {stage >= 3 && <>
        {Array.from({ length: stage === 3 ? 6 : 10 }).map((_, i) => {
          const a = (i * (360 / (stage === 3 ? 6 : 10)) - 90) * Math.PI / 180
          const r = stage === 4 ? 9 : 7
          return <ellipse key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r}
            rx="2.5" ry={stage === 4 ? 5 : 4}
            transform={`rotate(${i * (360 / (stage === 3 ? 6 : 10))},${cx + Math.cos(a) * r},${cy + Math.sin(a) * r})`}
            fill="#f0f0e0" stroke="#d0d0c0" strokeWidth="0.3" />
        })}
        <circle cx={cx} cy={cy} r={stage === 4 ? 5.5 : 4} fill="#f5c842" />
        <circle cx={cx} cy={cy} r={stage === 4 ? 3 : 2.5} fill="#e8a830" />
      </>}
    </svg>
  )
}

function Sunflower({ stage, W, H, ground, groundY }) {
  const stemTop = groundY - [0, 22, 32, 40, 44][stage]
  const cx = 21, cy = stemTop
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {ground}
      <line x1="21" y1={groundY - 2} x2="21" y2={stemTop + 2} stroke="#5a9a3a" strokeWidth="2.5" strokeLinecap="round" />
      {stage >= 2 && <>
        <path d={`M21 ${stemTop + 18} C10 ${stemTop + 10} 8 ${stemTop + 24} 16 ${stemTop + 26}`} fill="#6aaa4a" />
        <path d={`M21 ${stemTop + 18} C32 ${stemTop + 10} 34 ${stemTop + 24} 26 ${stemTop + 26}`} fill="#6aaa4a" />
      </>}
      {stage === 2 && <circle cx={cx} cy={cy} r="5" fill="#8B6B47" />}
      {stage >= 3 && <>
        {Array.from({ length: stage === 3 ? 6 : 10 }).map((_, i) => {
          const a = (i * (360 / (stage === 3 ? 6 : 10)) - 90) * Math.PI / 180
          const r = stage === 4 ? 11 : 8
          return <ellipse key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r}
            rx="3.5" ry={stage === 4 ? 7 : 5}
            transform={`rotate(${i * (360 / (stage === 3 ? 6 : 10))},${cx + Math.cos(a) * r},${cy + Math.sin(a) * r})`}
            fill="#f5c030" />
        })}
        <circle cx={cx} cy={cy} r={stage === 4 ? 7 : 5.5} fill="#5a3a1a" />
        <circle cx={cx} cy={cy} r={stage === 4 ? 5 : 3.5} fill="#7a5a2a" />
        {stage === 4 && Array.from({ length: 6 }).map((_, i) => {
          const a = (i * 60) * Math.PI / 180
          return <circle key={i} cx={cx + Math.cos(a) * 3} cy={cy + Math.sin(a) * 3} r="1" fill="#f5c842" opacity="0.7" />
        })}
      </>}
    </svg>
  )
}

function Poppy({ stage, W, H, ground, groundY }) {
  const stemTop = groundY - [0, 19, 29, 37, 41][stage]
  const cx = 21, cy = stemTop
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {ground}
      <path d={`M21 ${groundY - 2} Q18 ${groundY - 12} 21 ${stemTop + 8} Q24 ${stemTop + 4} 21 ${stemTop}`}
        fill="none" stroke="#5a9a3a" strokeWidth="1.8" strokeLinecap="round" />
      {stage >= 2 && <>
        <path d={`M21 ${stemTop + 18} C14 ${stemTop + 12} 13 ${stemTop + 22} 19 ${stemTop + 25}`} fill="#6aaa4a" opacity="0.85" />
        <path d={`M21 ${stemTop + 18} C28 ${stemTop + 12} 29 ${stemTop + 22} 23 ${stemTop + 25}`} fill="#6aaa4a" opacity="0.85" />
      </>}
      {stage === 2 && <ellipse cx={cx} cy={cy + 2} rx="4" ry="6" fill="#cc4040" opacity="0.8" />}
      {stage >= 3 && <>
        {[0, 90, 180, 270].map((deg, i) => {
          const a = (deg - 45) * Math.PI / 180
          const r = stage === 4 ? 9 : 7
          return <ellipse key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r}
            rx={stage === 4 ? 7 : 5} ry={stage === 4 ? 8 : 6}
            transform={`rotate(${deg - 45},${cx + Math.cos(a) * r},${cy + Math.sin(a) * r})`}
            fill="#dd3030" opacity={stage === 4 ? 0.95 : 0.8} />
        })}
        <circle cx={cx} cy={cy} r={stage === 4 ? 5 : 4} fill="#1a1a1a" />
        {stage === 4 && <>
          <circle cx={cx} cy={cy} r="3" fill="#2a2a2a" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 45) * Math.PI / 180
            return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * 4} y2={cy + Math.sin(a) * 4}
              stroke="#f5c842" strokeWidth="0.8" opacity="0.7" />
          })}
        </>}
      </>}
    </svg>
  )
}
