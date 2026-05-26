import { useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exercises } from '../data/exercises'
import useAppStore from '../store/useAppStore'

function pickTwo(allExercises, sittingMode) {
  const pool = allExercises.filter(ex => !sittingMode || !ex.requiresStanding)
  if (pool.length === 0) return []
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const first = shuffled[0]
  const second = shuffled.find(ex => ex.area !== first.area) || shuffled[1]
  return second && second !== first ? [first, second] : [first]
}

export default function BreakModal() {
  const { showBreakModal, breakIsPreview, completeBreak, snoozeBreak, sittingMode } = useAppStore()
  const closePreview = () => useAppStore.setState({ showBreakModal: false, breakIsPreview: false })

  const pair = useMemo(
    () => pickTwo(exercises, sittingMode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showBreakModal]
  )

  useEffect(() => {
    if (showBreakModal && pair[0]) {
      useAppStore.setState({ currentExerciseId: pair[0].id })
    }
  }, [showBreakModal, pair])

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
            className="w-full max-w-sm flex flex-col"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-md)',
              maxHeight: '90vh',
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          >
            {/* Nagłówek */}
            <div className="px-6 pt-5 pb-2 shrink-0">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Czas na przerwę
              </span>
            </div>

            {/* Scrollowalna zawartość */}
            <div className="overflow-y-auto px-6 pb-3 space-y-5">
              {pair.map((ex, idx) => (
                <div key={ex.id}>
                  {idx > 0 && (
                    <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />
                  )}

                  {/* Fakt motywacyjny PRZED krokami */}
                  {ex.note && (
                    <div
                      className="mb-3 px-3 py-2.5 rounded-lg"
                      style={{
                        background: 'var(--accent-soft)',
                        borderLeft: '3px solid var(--accent)',
                      }}
                    >
                      <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text)' }}>
                        {ex.note}
                      </p>
                    </div>
                  )}

                  <h2 className="text-base font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
                    {ex.namepl}
                  </h2>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    {ex.area} · {ex.time}
                    {ex.requiresStanding && (
                      <span style={{ marginLeft: '6px', color: 'var(--warning)' }}>· wstań</span>
                    )}
                  </p>

                  <ol className="space-y-2.5">
                    {ex.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 text-white"
                          style={{ background: 'var(--accent)' }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ color: 'var(--text)', lineHeight: 1.5 }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}

              {/* Przypomnienie o wodzie */}
              <div
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
              >
                <span style={{ fontSize: '1.1rem' }}>💧</span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Przy okazji — wypij szklankę wody. Odwodnienie o 2% spowalnia myślenie.
                </p>
              </div>
            </div>

            {/* Przyciski */}
            <div className="px-6 pb-6 pt-2 space-y-2 shrink-0">
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
