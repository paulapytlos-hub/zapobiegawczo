import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../store/useAppStore'
import { quickHelpData } from '../data/quickHelpData'
import { areaColor } from '../utils/areaColor'
import { useT } from '../hooks/useT'

export default function QuickHelpModal() {
  const { quickHelpModalArea, closeQuickHelpModal, colorblindMode, sittingMode } = useAppStore()
  const lang = useAppStore(s => s.language)
  const t = useT()
  const [fasciaOpen, setFasciaOpen] = useState(false)

  const data = quickHelpData.find(d => d.id === quickHelpModalArea)
  const color = data ? areaColor(data.areaColor, colorblindMode) : null
  const visibleExercises = data
    ? (sittingMode ? data.exercises.filter(ex => !ex.requiresStanding) : data.exercises)
    : []

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0, 5, 2, 0.75)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && closeQuickHelpModal()}
        >
          <motion.div
            className="w-full max-w-sm flex flex-col"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-md)',
              maxHeight: '88vh',
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          >
            {/* Nagłówek */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="font-semibold" style={{ color: 'var(--text)' }}>
                  {lang === 'en' ? data.areaEn : data.area}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}>
                  {t.quickHelpTag}
                </span>
              </div>
              <button
                onClick={closeQuickHelpModal}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                {t.closeBtn}
              </button>
            </div>

            {/* Scrollowalna treść */}
            <div className="overflow-y-auto px-5 py-4 space-y-5">

              {/* O powięzi */}
              <button
                onClick={() => setFasciaOpen(o => !o)}
                className="w-full text-left p-3 rounded-xl transition-all"
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: data.areaColor }}>
                    {t.fasciaTitle}
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    style={{
                      color: 'var(--text-muted)',
                      transform: fasciaOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </div>
                {fasciaOpen && (
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'en' ? (data.fasciaNote_en || data.fasciaNote) : data.fasciaNote}
                  </p>
                )}
              </button>

              {/* Ćwiczenia */}
              {sittingMode && visibleExercises.length < data.exercises.length && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}>
                  {t.sittingHidden}
                </p>
              )}
              {visibleExercises.map((ex, i) => {
                const displayName = lang === 'en' ? (ex.name_en || ex.name) : ex.name
                const displaySteps = lang === 'en' ? (ex.stepsEn || ex.steps) : ex.steps
                const displayNote = lang === 'en' ? (ex.note_en || ex.note) : ex.note

                return (
                  <div key={i} className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                        {i + 1}. {displayName}
                      </h3>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{ex.time}</span>
                    </div>

                    <ol className="space-y-2">
                      {displaySteps.map((step, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                            style={{ background: data.areaColor, color: '#fff' }}
                          >
                            {j + 1}
                          </span>
                          <span style={{ color: 'var(--text)', lineHeight: 1.5 }}>{step}</span>
                        </li>
                      ))}
                    </ol>

                    {displayNote && (
                      <p
                        className="text-xs px-3 py-2 rounded-lg italic leading-relaxed"
                        style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}
                      >
                        {displayNote}
                      </p>
                    )}

                    {i < visibleExercises.length - 1 && (
                      <div style={{ height: '1px', background: 'var(--border)' }} />
                    )}
                  </div>
                )
              })}

              <div className="pb-2" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
