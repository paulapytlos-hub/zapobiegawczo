import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../store/useAppStore'

const FACTS = [
  { label: 'Kręgosłup', text: 'Krążki kręgosłupa są o 40% bardziej obciążone podczas siedzenia niż stania.' },
  { label: 'Energia', text: 'Krótka 2-minutowa przerwa co godzinę zmniejsza zmęczenie o 30%.' },
]

const HOW_TO_USE = [
  'Kliknij "Rozpocznij sesję" na stronie głównej',
  'Pracuj normalnie — zostaw tę kartę otwartą w przeglądarce',
  'Co godzinę pojawi się przypomnienie o przerwie',
  'Wykonaj krótkie ćwiczenie i wróć do pracy w lepszej formie',
]

export default function WelcomeModal() {
  const { showWelcome, closeWelcome, requestNotifPermission, notifPermission, setUserName, userName } = useAppStore()
  const [step, setStep] = useState(0)
  const [nameInput, setNameInput] = useState(userName || '')

  const handleEnableNotif = () => {
    requestNotifPermission()
    setTimeout(closeWelcome, 700)
  }

  const handleNext = () => {
    if (step === 0 && nameInput.trim()) {
      setUserName(nameInput.trim())
    }
    setStep(s => s + 1)
  }

  return (
    <AnimatePresence>
      {showWelcome && (
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
            {/* Progress */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? '20px' : '6px',
                    height: '6px',
                    background: i <= step ? 'var(--accent)' : 'var(--border)',
                  }}
                />
              ))}
            </div>

            {/* Krok 1: Co to jest */}
            {step === 0 && (
              <div className="space-y-4">
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
                    Pomagam zadbać o zdrowie podczas długiej pracy przy komputerze — przypominam o regularnych przerwach.
                  </p>
                </div>
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
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Jak masz na imię? <span style={{ opacity: 0.6 }}>(opcjonalnie)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Twoje imię..."
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                    maxLength={30}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: 'var(--surface-alt)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Krok 2: Jak to działa */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Jak to działa?</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Proste — wystarczą 4 kroki</p>
                </div>
                <ol className="space-y-3">
                  {HOW_TO_USE.map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                        style={{ background: 'var(--accent)' }}
                      >
                        {i + 1}
                      </span>
                      <span className="pt-1" style={{ color: 'var(--text)' }}>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Krok 3: Powiadomienia */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Powiadomienia na pulpicie</h2>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {notifPermission === 'granted'
                      ? 'Świetnie — powiadomienia są już włączone. Dostaniesz cichą notyfikację przy każdej przerwie, nawet, gdy pracujesz w innej aplikacji.'
                      : 'Żebyś dostała przypomnienie nawet, gdy ta karta jest w tle — włącz powiadomienia. Są ciche, nie przeszkadzają w pracy.'}
                  </p>
                </div>
                {notifPermission !== 'granted' && (
                  <ol className="space-y-2">
                    {[
                      'Kliknij "Włącz powiadomienia" poniżej',
                      'W okienku przeglądarki kliknij "Zezwól"',
                      'Gotowe — ciche przypomnienie przy każdej przerwie',
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl text-sm"
                        style={{ background: 'var(--surface-alt)' }}
                      >
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                          style={{ background: 'var(--accent)' }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ color: 'var(--text)' }}>{text}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {notifPermission === 'denied' && (
                  <div
                    className="text-xs p-3 rounded-xl leading-relaxed"
                    style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}
                  >
                    Przeglądarka zablokowała powiadomienia. Aby odblokować: kliknij kłódkę w pasku adresu → Powiadomienia → Zezwól.
                  </div>
                )}
              </div>
            )}

            {/* Przyciski */}
            <div className="space-y-2 pt-1">
              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="w-full py-3 font-medium text-white transition-all"
                  style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
                >
                  Dalej
                </button>
              ) : notifPermission === 'granted' ? (
                <button
                  onClick={closeWelcome}
                  className="w-full py-3 font-medium text-white transition-all"
                  style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
                >
                  Zaczynamy
                </button>
              ) : (
                <>
                  {notifPermission !== 'denied' && (
                    <button
                      onClick={handleEnableNotif}
                      className="w-full py-3 font-medium text-white transition-all"
                      style={{ background: 'var(--accent)', borderRadius: 'var(--radius-sm)' }}
                    >
                      Włącz powiadomienia
                    </button>
                  )}
                  <button
                    onClick={closeWelcome}
                    className="w-full py-2.5 text-sm transition-all"
                    style={{
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Pomiń na razie
                  </button>
                </>
              )}
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="w-full text-xs text-center pt-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Wróć
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
