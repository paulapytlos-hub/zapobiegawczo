import { useState } from 'react'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const reset = () => {
    setMessage('')
    setRating(0)
    setHovered(0)
    setStatus('idle')
  }

  const send = async () => {
    if (!message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, rating: rating || null }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        const data = await res.json().catch(() => ({}))
        console.error('Feedback error:', res.status, data)
        setStatus('error')
      }
    } catch (e) {
      console.error('Feedback fetch error:', e)
      setStatus('error')
    }
  }

  return (
    <>
      {/* Zakładka boczna */}
      <button
        onClick={() => { setOpen(o => !o); if (open) reset() }}
        style={{
          position: 'fixed',
          right: open ? '296px' : '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          padding: '16px 11px',
          fontSize: '0.75rem',
          fontWeight: '700',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderRadius: '8px',
          zIndex: 60,
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          writingMode: 'vertical-rl',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
        aria-label="Feedback"
      >
        Feedback
      </button>

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: open ? 0 : '-280px',
          width: '280px',
          height: '100vh',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          zIndex: 59,
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          gap: '16px',
          overflowY: 'auto',
        }}
      >
        <div>
          <p className="font-semibold" style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
            Cześć! Masz feedback?
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
            Coś nie działa, czegoś brakuje, masz pomysł? Chętnie przeczytam i wdrożę.
          </p>
        </div>

        {status === 'done' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem' }}>🌱</span>
            <p className="font-medium" style={{ color: 'var(--accent)' }}>Dziękuję!</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Twoja wiadomość dotarła. Bardzo mi to pomaga rozwijać aplikację.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: '8px',
                fontSize: '0.75rem',
                color: 'var(--accent)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Wyślij kolejny
            </button>
          </div>
        ) : (
          <>
            {/* Gwiazdki */}
            <div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Ogólna ocena (opcjonalnie)
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star === rating ? 0 : star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                      fontSize: '1.4rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: star <= (hovered || rating) ? '#f5c030' : 'var(--border)',
                      transition: 'color 0.1s, transform 0.1s',
                      transform: star <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
                      padding: 0,
                    }}
                    aria-label={`${star} gwiazdka`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Wiadomość */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Wiadomość
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Co myślisz o aplikacji? Co warto poprawić lub dodać?"
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--surface-alt)',
                  border: `1px solid ${message.trim() ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {status === 'error' && (
              <p style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>
                Coś poszło nie tak — spróbuj ponownie.
              </p>
            )}

            <button
              onClick={send}
              disabled={!message.trim() || status === 'sending'}
              style={{
                padding: '10px',
                background: message.trim() ? 'var(--accent)' : 'var(--border)',
                color: message.trim() ? '#fff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {status === 'sending' ? 'Wysyłam...' : 'Wyślij'}
            </button>
          </>
        )}
      </div>

      {/* Overlay na mobile */}
      {open && (
        <div
          onClick={() => { setOpen(false); reset() }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 58,
            background: 'transparent',
          }}
        />
      )}
    </>
  )
}
