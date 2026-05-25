import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exercises } from '../data/exercises'
import useAppStore from '../store/useAppStore'
import { areaColor } from '../utils/areaColor'

function parseMins(t) {
  if (t.includes('sek')) return parseInt(t) / 60
  return parseInt(t) || 1
}

const totalMins = Math.round(exercises.reduce((sum, ex) => sum + parseMins(ex.time), 0))

export default function ExerciseCircuit({ onClose }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const colorblindMode = useAppStore(s => s.colorblindMode)
  const addLog = useAppStore(s => s.addLog)

  const ex = exercises[step]
  const color = areaColor(ex.areaColor, colorblindMode)

  const handleNext = () => {
    if (step < exercises.length - 1) {
      setStep(s => s + 1)
    } else {
      addLog(`Seria ćwiczeń ukończona (~${totalMins} min)`)
      setDone(true)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-sm overflow-y-auto"
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-md)',
          maxHeight: '92vh',
        }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      >
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              className="p-8 text-center space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>🎉</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                  fontSize: '1.4rem',
                  color: 'var(--text)',
                }}
              >
                Seria zakończona!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                To <strong style={{ color: 'var(--accent)' }}>~{totalMins} minuty</strong> zainwestowane
                w zdrowie przy pracy. Twoje mięśnie i powięź Ci za to dziękują.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Regularne serie ćwiczeń redukują bóle pleców i szyi nawet o 40% — wystarczy robić to raz dziennie.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 font-medium text-white"
                style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
              >
                Zamknij
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              className="p-6 space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
            >
              {/* Nagłówek z postępem */}
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  SERIA ĆWICZEŃ
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {step + 1} / {exercises.length} · ~{totalMins} min łącznie
                </span>
              </div>

              {/* Pasek postępu */}
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${((step + 1) / exercises.length) * 100}%`,
                    background: color,
                    borderRadius: '2px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Ćwiczenie */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <h2 className="font-semibold" style={{ color: 'var(--text)', fontSize: '1.05rem' }}>
                    {ex.namepl}
                  </h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', paddingLeft: '1.1rem' }}>
                  {ex.area} · {ex.time}
                </p>
              </div>

              {/* Kroki */}
              <ol className="space-y-2.5">
                {ex.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 text-white"
                      style={{ background: color }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: 'var(--text)', lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ol>

              {ex.note && (
                <p
                  className="text-xs px-3 py-2 rounded-lg italic leading-relaxed"
                  style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}
                >
                  {ex.note}
                </p>
              )}

              {/* Przyciski nawigacji */}
              <div className="flex gap-2 pt-1">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="py-2.5 px-4 text-sm font-medium"
                    style={{
                      background: 'var(--surface-alt)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    ← Wstecz
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 text-sm font-medium text-white"
                  style={{ background: color, borderRadius: 'var(--radius-sm)' }}
                >
                  {step < exercises.length - 1 ? 'Następne →' : 'Zakończ serię'}
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Przerwij serię
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
