import { useEffect, useRef, useState } from 'react'
import useAppStore from '../store/useAppStore'

const XP_PER_LEVEL = 50

export function getLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL)
}

function getLevelProgress(xp) {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL
}

export default function HealthLevel() {
  const xp = useAppStore(s => s.xp)
  const breaksDone = useAppStore(s => s.breaksDone)
  const level = getLevel(xp)
  const progress = getLevelProgress(xp)
  const xpInLevel = xp % XP_PER_LEVEL

  const prevXp = useRef(xp)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    if (xp > prevXp.current) {
      const gained = xp - prevXp.current
      setFlash(`+${gained}`)
      const t = setTimeout(() => setFlash(null), 1800)
      prevXp.current = xp
      return () => clearTimeout(t)
    }
    prevXp.current = xp
  }, [xp])

  const hearts = Math.min(breaksDone, 10)
  const heartDisplay = Array.from({ length: 10 }).map((_, i) => i < hearts ? '♥' : '♡')

  return (
    <div
      className="mx-4 mt-3 relative"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
    >
      {/* +XP float */}
      {flash && (
        <span
          key={flash + xp}
          className="absolute font-bold text-sm pointer-events-none"
          style={{
            color: '#7FEE10',
            right: '12px',
            top: '-2px',
            animation: 'xpFloat 1.8s ease-out forwards',
            textShadow: '0 0 6px #7FEE1080',
            zIndex: 10,
          }}
        >
          {flash} XP
        </span>
      )}

      <div
        style={{
          background: '#1a1a1a',
          border: '2px solid #3a3a3a',
          borderRadius: '3px',
          padding: '6px 10px 5px',
          boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.5), 0 1px 0 #4a4a4a',
        }}
      >
        {/* Serduszka */}
        <div className="flex items-center justify-between mb-1.5">
          <div style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#ff4444', lineHeight: 1 }}>
            {heartDisplay.map((h, i) => (
              <span key={i} style={{ opacity: i < hearts ? 1 : 0.25 }}>{h}</span>
            ))}
          </div>
          <span style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '0.5px' }}>
            {xp} XP
          </span>
        </div>

        {/* Pasek XP — Minecraft style */}
        <div style={{ position: 'relative', height: '10px', background: '#373737', borderRadius: '2px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
          {/* Ciemniejszy pas u góry */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'rgba(0,0,0,0.3)', zIndex: 2, pointerEvents: 'none',
          }} />
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(180deg, #9FFF40 0%, #7FEE10 40%, #5DC800 100%)',
              borderRadius: '1px',
              transition: 'width 0.4s steps(20, end)',
              boxShadow: '2px 0 0 #3a7a00',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* Numer poziomu */}
        <div className="flex items-center justify-center mt-1" style={{ gap: '6px' }}>
          <span style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#7FEE10',
            textShadow: '0 2px 0 #3a7a00, 0 0 8px #7FEE1060',
            letterSpacing: '1px',
            lineHeight: 1,
          }}>
            {level}
          </span>
          <span style={{ fontSize: '0.55rem', color: '#666', letterSpacing: '0.5px', paddingTop: '2px' }}>
            {xpInLevel}/{XP_PER_LEVEL}
          </span>
        </div>
      </div>
    </div>
  )
}
