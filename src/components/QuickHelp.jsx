import { useState } from 'react'
import useAppStore from '../store/useAppStore'
import { quickHelpData } from '../data/quickHelpData'
import { areaColor } from '../utils/areaColor'
import { useT } from '../hooks/useT'
import BodyDiagram from './BodyDiagram'

export default function QuickHelp() {
  const openQuickHelpModal = useAppStore(s => s.openQuickHelpModal)
  const colorblindMode = useAppStore(s => s.colorblindMode)
  const lang = useAppStore(s => s.language)
  const t = useT()
  const [hoveredArea, setHoveredArea] = useState(null)

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
          {t.quickHelpTitle}
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {t.quickHelpSub}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-4 gap-2">
            {quickHelpData.map(item => (
              <button
                key={item.id}
                onClick={() => openQuickHelpModal(item.id)}
                onMouseEnter={e => {
                  setHoveredArea(item.id)
                  const c = areaColor(item.areaColor, colorblindMode)
                  e.currentTarget.style.borderColor = c
                  e.currentTarget.style.background = `${c}18`
                }}
                onMouseLeave={e => {
                  setHoveredArea(null)
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--surface)'
                }}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all text-center"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: areaColor(item.areaColor, colorblindMode) }}
                />
                <span className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'en' ? item.areaEn : item.area}
                </span>
              </button>
            ))}
          </div>
        </div>
        <BodyDiagram hoveredArea={hoveredArea} />
      </div>
    </div>
  )
}
