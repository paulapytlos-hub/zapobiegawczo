import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exercises } from '../data/exercises'

export default function ExercisesSection() {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <div className="mx-4 mt-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
        Ćwiczenia
      </h2>
      <div className="space-y-2">
        {exercises.map(ex => (
          <div
            key={ex.id}
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            {/* Nagłówek karty — klikalny */}
            <button
              onClick={() => toggle(ex.id)}
              className="w-full flex items-center gap-3 p-4 text-left transition-all"
              style={{ background: openId === ex.id ? 'var(--surface-alt)' : 'var(--surface)' }}
            >
              <span className="text-2xl">{ex.icon}</span>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: 'var(--text)' }}>{ex.namepl}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{ex.time}</p>
              </div>
              <span
                className="text-lg transition-transform duration-200"
                style={{
                  color: 'var(--text-muted)',
                  transform: openId === ex.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  display: 'inline-block',
                }}
              >
                ›
              </span>
            </button>

            {/* Kroki — rozwijane */}
            <AnimatePresence initial={false}>
              {openId === ex.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <ol
                    className="px-4 pb-4 space-y-2"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <div className="pt-3" />
                    {ex.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 text-white"
                          style={{ background: 'var(--accent)' }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ color: 'var(--text)' }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
