import { useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exercises } from '../data/exercises'
import useAppStore from '../store/useAppStore'
import ExerciseCard from './ExerciseCard'

export default function BreakModal() {
  const { showBreakModal, completeBreak, snoozeBreak } = useAppStore()

  const exercise = useMemo(
    () => exercises[Math.floor(Math.random() * exercises.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showBreakModal]
  )

  // Przekaż id ćwiczenia do store'a, żeby móc je zapisać w bazie
  useEffect(() => {
    if (showBreakModal && exercise) {
      useAppStore.setState({ currentExerciseId: exercise.id })
    }
  }, [showBreakModal, exercise])

  return (
    <AnimatePresence>
      {showBreakModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: 'var(--surface)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center">
              <p className="text-3xl mb-1">⏰</p>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                Czas na przerwę!
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Twoje ciało potrzebuje chwili odpoczynku
              </p>
            </div>

            <ExerciseCard exercise={exercise} />

            <div className="space-y-2 pt-2">
              <button
                onClick={completeBreak}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                style={{ background: 'var(--accent)' }}
              >
                Gotowe — rozciągnąłem się ✓
              </button>
              <button
                onClick={snoozeBreak}
                className="w-full py-2 rounded-xl text-sm transition-all"
                style={{
                  background: 'var(--surface-alt)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                Snooze — przypomnij za 5 min
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
