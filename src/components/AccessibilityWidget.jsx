import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../store/useAppStore'

const FONT_OPTIONS = [
  { value: 'small',  label: 'A−', title: 'Mały tekst' },
  { value: 'normal', label: 'A',  title: 'Normalny tekst' },
  { value: 'large',  label: 'A+', title: 'Duży tekst' },
  { value: 'xlarge', label: 'A++', title: 'Bardzo duży tekst' },
]

const THEME_OPTIONS = [
  { value: 'dark',  label: 'Ciemny',  desc: 'Domyślny' },
  { value: 'night', label: 'Nocny',   desc: 'Bez niebieskiego światła' },
  { value: 'light', label: 'Jasny',   desc: 'Wellness' },
]

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const {
    theme, setTheme,
    fontSize, setFontSize,
    highContrast, setHighContrast,
    colorblindMode, setColorblind,
    reduceMotion, setReduceMotion,
  } = useAppStore()

  return (
    <>
      {/* Pływający przycisk */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Otwórz opcje dostępności"
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center justify-center gap-1 transition-all"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <AccessIcon />
        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1 }}>
          DOSTĘPNOŚĆ
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm overflow-y-auto"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)',
                maxHeight: '90vh',
              }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            >
              {/* Nagłówek */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <AccessIcon size={22} />
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>
                    Dostępność
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Zamknij"
                  style={{
                    fontSize: '1.4rem',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    lineHeight: 1,
                    minHeight: 'unset',
                    padding: '4px 8px',
                  }}
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-5 space-y-7">

                {/* ROZMIAR TEKSTU */}
                <Section title="Rozmiar tekstu">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Zmień rozmiar czcionki w całej aplikacji
                  </p>
                  <div className="flex gap-2">
                    {FONT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setFontSize(opt.value)}
                        title={opt.title}
                        aria-pressed={fontSize === opt.value}
                        className="flex-1 py-3 rounded-xl font-bold transition-all"
                        style={{
                          fontSize: opt.value === 'small' ? '0.85rem'
                            : opt.value === 'large' ? '1.1rem'
                            : opt.value === 'xlarge' ? '1.3rem' : '1rem',
                          background: fontSize === opt.value ? 'var(--accent)' : 'var(--surface-alt)',
                          color: fontSize === opt.value ? '#fff' : 'var(--text)',
                          border: `2px solid ${fontSize === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Section>

                {/* MOTYW */}
                <Section title="Motyw kolorystyczny">
                  <div className="space-y-2">
                    {THEME_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        aria-pressed={theme === opt.value}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: theme === opt.value ? 'var(--accent-soft)' : 'var(--surface-alt)',
                          border: `2px solid ${theme === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                        }}
                      >
                        <div className="text-left">
                          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', display: 'block' }}>
                            {opt.label}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {opt.desc}
                          </span>
                        </div>
                        {theme === opt.value && (
                          <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </Section>

                {/* WYSOKI KONTRAST */}
                <Section title="Kontrast">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Zwiększa kontrast tekstu do poziomu WCAG AAA (7:1)
                  </p>
                  <div className="flex gap-2">
                    <ModeButton
                      active={!highContrast}
                      onClick={() => setHighContrast(false)}
                      label="Normalny"
                    />
                    <ModeButton
                      active={highContrast}
                      onClick={() => setHighContrast(true)}
                      label="Wysoki kontrast"
                    />
                  </div>
                </Section>

                {/* DALTONIZM */}
                <Section title="Daltonizm">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Zastępuje kolory paletą bezpieczną dla deuteranopii i protanopii (8% mężczyzn). Wszystkie etykiety są też opisane tekstem.
                  </p>
                  <div className="flex gap-2">
                    <ModeButton
                      active={!colorblindMode}
                      onClick={() => setColorblind(false)}
                      label="Standardowe"
                    />
                    <ModeButton
                      active={colorblindMode}
                      onClick={() => setColorblind(true)}
                      label="Bezpieczna paleta"
                    />
                  </div>
                </Section>

                {/* ANIMACJE */}
                <Section title="Animacje">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Wyłącza animacje przejść — ważne przy epilepsji i nadwrażliwości na ruch (WCAG 2.3.3)
                  </p>
                  <div className="flex gap-2">
                    <ModeButton
                      active={!reduceMotion}
                      onClick={() => setReduceMotion(false)}
                      label="Włączone"
                    />
                    <ModeButton
                      active={reduceMotion}
                      onClick={() => setReduceMotion(true)}
                      label="Zredukowane"
                    />
                  </div>
                </Section>

                {/* Informacja o prawie */}
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
                >
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Aplikacja dąży do zgodności z <strong style={{ color: 'var(--text)' }}>WCAG 2.1 poziom AA</strong> oraz Europejskim Aktem o Dostępności (EAA, Dyrektywa 2019/882). Wszystkie tryby można łączyć dowolnie.
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p
        className="uppercase tracking-widest mb-3"
        style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.12em' }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}

function ModeButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="flex-1 py-3 rounded-xl font-medium transition-all"
      style={{
        fontSize: '0.9rem',
        background: active ? 'var(--accent)' : 'var(--surface-alt)',
        color: active ? '#fff' : 'var(--text)',
        border: `2px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      {label}
    </button>
  )
}

function AccessIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="4" r="2" />
      <path d="M19 9H5a1 1 0 000 2h5.5l-1.8 8.1a1 1 0 001.95.44L12 14l1.35 5.55a1 1 0 001.95-.44L13.5 11H19a1 1 0 000-2z"/>
    </svg>
  )
}
