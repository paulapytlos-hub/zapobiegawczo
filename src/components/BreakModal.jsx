import { useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exercises } from '../data/exercises'
import useAppStore from '../store/useAppStore'

export default function BreakModal() {
  const { showBreakModal, breakIsPreview, completeBreak, snoozeBreak } = useAppStore()
  const closePreview = () => useAppStore.setState({ showBreakModal: false, breakIsPreview: false })

  const exercise = useMemo(
    () => exercises[Math.floor(Math.random() * exercises.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showBreakModal]
  )

  useEffect(() => {
    if (showBreakModal && exercise) {
      useAppStore.setState({ currentExerciseId: exercise.id })
    }
  }, [showBreakModal, exercise])

  return (
    <AnimatePresence>
      {showBreakModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(20, 35, 20, 0.55)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm p-6 space-y-4"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-md)',
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          >
            {/* Nagłówek */}
            <div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Czas na przerwę
              </span>
              <h2 className="text-lg font-semibold mt-2" style={{ color: 'var(--text)' }}>
                {exercise.namepl}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {exercise.time} — zrób to teraz
              </p>
            </div>

            {/* Kroki */}
            <ol className="space-y-2.5">
              {exercise.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--text)' }}>{step}</span>
                </li>
              ))}
            </ol>

            {/* Przyciski */}
            <div className="space-y-2 pt-1">
              {breakIsPreview ? (
                <>
                  <p className="text-xs text-center pb-1" style={{ color: 'var(--text-muted)' }}>
                    Podgląd — tak wygląda okienko przy każdej przerwie
                  </p>
                  <button
                    onClick={closePreview}
                    className="w-full py-3 font-medium text-white transition-all"
                    style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
                  >
                    Zamknij podgląd
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={completeBreak}
                    className="w-full py-3 font-medium text-white transition-all"
                    style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
                  >
                    Gotowe
                  </button>
                  <button
                    onClick={snoozeBreak}
                    className="w-full py-2.5 text-sm transition-all"
                    style={{
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Przypomnij za 5 minut
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
