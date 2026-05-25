import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exercises } from '../data/exercises'
import useAppStore from '../store/useAppStore'

export default function ExercisesSection() {
  const [openId, setOpenId] = useState(null)
  const sectionRef = useRef(null)
  const quickHelpId = useAppStore(s => s.quickHelpId)
  const setQuickHelp = useAppStore(s => s.setQuickHelp)

  useEffect(() => {
    if (!quickHelpId) return
    setOpenId(quickHelpId)
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    setQuickHelp(null)
  }, [quickHelpId, setQuickHelp])

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <div className="mx-4 mt-6" ref={sectionRef}>
      <div className="flex items-baseline justify-between mb-3">
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 500,
            fontSize: '1.1rem',
            color: 'var(--text)',
          }}
        >
          Ćwiczenia
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {exercises.length} ćwiczeń
        </span>
      </div>

      <div className="space-y-2">
        {exercises.map(ex => (
          <div
            key={ex.id}
            className="overflow-hidden"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
            }}
          >
            <button
              onClick={() => toggle(ex.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
              style={{ background: openId === ex.id ? 'var(--surface-alt)' : 'transparent' }}
            >
              {/* Kolorowy znacznik obszaru */}
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: ex.areaColor }}
              />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                  {ex.namepl}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {ex.area} · {ex.time}
                </p>
              </div>

              {/* Strzałka */}
              <svg
                width="14" height="14" viewBox="0 0 14 14"
                fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"
                style={{
                  transform: openId === ex.id ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  shrink: 0,
                }}
              >
                <path d="M5 3l4 4-4 4" />
              </svg>
            </button>

            <AnimatePresence initial={false}>
              {openId === ex.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    className="px-4 pb-4 pt-3 space-y-4"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <ol className="space-y-2.5">
                      {ex.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 text-white"
                            style={{ background: ex.areaColor }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ color: 'var(--text)', lineHeight: 1.5 }}>{step}</span>
                        </li>
                      ))}
                    </ol>

                    {ex.note && (
                      <p
                        className="text-xs px-3 py-2 rounded-lg italic"
                        style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}
                      >
                        {ex.note}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
