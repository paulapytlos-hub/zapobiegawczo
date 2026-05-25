import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FACTS = [
  { label: 'Kręgosłup', text: 'Krążki kręgosłupa są o 40% bardziej obciążone podczas siedzenia niż stania.' },
  { label: 'Oczy', text: 'Patrzenie na ekran bez przerwy powoduje zmęczenie oczu u 9 na 10 pracowników biurowych.' },
  { label: 'Energia', text: 'Krótka 2-minutowa przerwa co godzinę zmniejsza zmęczenie nawet o 30%.' },
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(20, 35, 20, 0.55)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm p-6 space-y-5"
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
            <div className="space-y-1.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'var(--accent-soft)' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3C10 3 5 6.5 5 11.5C5 14.538 7.462 17 10.5 17C13.538 17 16 14.538 16 11.5C16 6.5 10 3 10 3Z" fill="var(--accent)" opacity="0.85"/>
                </svg>
              </div>
              <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
                Cześć, dobrze że tu jesteś
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Pomagam pamiętać o przerwach podczas długiej pracy przy komputerze.
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
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    {fact.label}
                  </span>
                  <p style={{ color: 'var(--text)' }}>{fact.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleStart}
              className="w-full py-3 font-medium text-white transition-all"
              style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
            >
              Zaczynamy
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
