import useAppStore from '../store/useAppStore'

export default function LanguageToggle() {
  const language = useAppStore(s => s.language)
  const setLanguage = useAppStore(s => s.setLanguage)

  return (
    <button
      onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
      title={language === 'pl' ? 'Switch to English' : 'Przełącz na polski'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        background: 'var(--surface-alt)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontSize: '0.72rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.color = 'var(--accent)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--text-muted)'
      }}
    >
      <span style={{ opacity: language === 'pl' ? 1 : 0.45 }}>PL</span>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: language === 'en' ? 1 : 0.45 }}>EN</span>
    </button>
  )
}
