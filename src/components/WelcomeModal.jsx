import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FACTS = [
  { icon: '🦴', text: 'Krążki kręgosłupa są o 40% bardziej obciążone podczas siedzenia niż stania.' },
  { icon: '👁️', text: 'Patrzenie na ekran bez przerwy powoduje zmęczenie oczu u 9 na 10 pracowników.' },
  { icon: '💆', text: 'Krótka 2-minutowa przerwa co godzinę zmniejsza zmęczenie nawet o 30%.' },
]

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('zapobiegawczo_welcomed')
    if (!seen) setVisible(true)
  }, [])

  const handleStart = () => {
    localStorage.setItem('zapobiegawczo_welcomed', '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl p-6 space-y-5"
            style={{ background: 'var(--surface)' }}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Nagłówek */}
            <div className="text-center space-y-2">
              <p className="text-5xl">🧘</p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                Cześć! Jestem Zapobiegawczo
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Pomagam Ci pamiętać o przerwach podczas długiej pracy przy komputerze.
                Twoje ciało Ci za to podziękuje.
              </p>
            </div>

            {/* Fakty */}
            <div className="space-y-2">
              {FACTS.map((fact, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl text-sm"
                  style={{ background: 'var(--surface-alt)' }}
                >
                  <span className="text-xl shrink-0">{fact.icon}</span>
                  <p style={{ color: 'var(--text)' }}>{fact.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all"
              style={{ background: 'var(--accent)' }}
            >
              Zadbajmy o siebie — zaczynamy!
            </button>

            <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              Ustaw interwał przypomnień w ustawieniach ⚙️
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
