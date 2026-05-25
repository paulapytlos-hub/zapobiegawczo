import { useEffect, useRef, useState } from 'react'
import useAppStore from '../store/useAppStore'

export const LEVELS = [
  { min: 0,    max: 49,   level: 1, name: 'Kiełek',          icon: '🌱', color: '#6a9e7a' },
  { min: 50,   max: 149,  level: 2, name: 'Roślinka',        icon: '🌿', color: '#5aaa5a' },
  { min: 150,  max: 299,  level: 3, name: 'Aktywny/a',       icon: '⚡', color: '#4a8c8a' },
  { min: 300,  max: 499,  level: 4, name: 'Zadbany/a',       icon: '💪', color: '#7a9a5a' },
  { min: 500,  max: 749,  level: 5, name: 'Zdrowiec',        icon: '🌟', color: '#c8a840' },
  { min: 750,  max: 999,  level: 6, name: 'Mistrz zdrowia',  icon: '🏆', color: '#c87840' },
  { min: 1000, max: Infinity, level: 7, name: 'Guru zdrowia', icon: '👑', color: '#9a60c0' },
]

export function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[LEVELS.length - 1]
}

export function getNextLevel(xp) {
  const cur = getLevel(xp)
  return LEVELS.find(l => l.level === cur.level + 1) || null
}

export default function HealthLevel() {
  const xp = useAppStore(s => s.xp)
  const level = getLevel(xp)
  const next = getNextLevel(xp)

  const prevXp = useRef(xp)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    if (xp > prevXp.current) {
      const gained = xp - prevXp.current
      setFlash(`+${gained} XP`)
      const t = setTimeout(() => setFlash(null), 1800)
      prevXp.current = xp
      return () => clearTimeout(t)
    }
    prevXp.current = xp
  }, [xp])

  const pct = next
    ? ((xp - level.min) / (level.max - level.min + 1)) * 100
    : 100

  return (
    <div
      className="mx-4 mt-3 rounded-xl px-4 py-3 relative overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Animacja +XP */}
      {flash && (
        <span
          key={flash + xp}
          className="absolute right-4 top-2 text-sm font-bold"
          style={{
            color: level.color,
            animation: 'xpFloat 1.8s ease-out forwards',
          }}
        >
          {flash}
        </span>
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.2rem' }}>{level.icon}</span>
          <div>
            <p className="text-xs font-bold" style={{ color: level.color }}>
              Poziom {level.level} — {level.name}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {xp} XP{next ? ` · do ${next.name}: ${next.min - xp} XP` : ' · Szczyt!'}
            </p>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: level.color + '22', color: level.color }}
        >
          {Math.round(pct)}%
        </span>
      </div>

      {/* Pasek XP */}
      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${level.color}99, ${level.color})`,
            borderRadius: '3px',
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 0 6px ${level.color}60`,
          }}
        />
      </div>

      {/* Kamienie milowe */}
      {next && (
        <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
          Następny poziom: <strong style={{ color: level.color }}>{next.icon} {next.name}</strong> za {next.min - xp} XP
        </p>
      )}
    </div>
  )
}
