import { useState } from 'react'
import useAppStore from '../store/useAppStore'

async function testNotification(setToast) {
  if (Notification.permission !== 'granted') {
    setToast('Najpierw przyznaj zgodę na powiadomienia w przeglądarce.')
    return
  }

  let sent = false

  // Próba 1: przez Service Worker (działa gdy karta jest nieaktywna)
  try {
    const reg = await Promise.race([
      navigator.serviceWorker?.ready,
      new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000)),
    ])
    if (reg?.active) {
      reg.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: 'Działa!',
        body: 'Powiadomienia na pulpicie są aktywne.',
      })
      sent = true
    }
  } catch { /* SW niedostępny, próbujemy fallback */ }

  // Próba 2: bezpośrednio (fallback gdy SW nie jest gotowy)
  if (!sent) {
    try {
      new Notification('Działa!', {
        body: 'Powiadomienia na pulpicie są aktywne.',
        silent: true,
        tag: 'zapobiegawczo-test',
      })
      sent = true
    } catch { /* ignoruj */ }
  }

  if (sent) {
    setToast('Powiadomienie wysłane — sprawdź prawy dolny róg ekranu.')
  } else {
    setToast('Nie udało się wysłać. Sprawdź ustawienia powiadomień w przeglądarce.')
  }
}

const PRESETS = [30, 45, 60, 90]

export default function SettingsPanel() {
  const {
    intervalMinutes, updateInterval,
    notifEnabled, toggleNotif,
    popupEnabled, togglePopup,
    showSettings,
  } = useAppStore()

  const [customValue, setCustomValue] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  if (!showSettings) return null

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const handleCustom = (e) => {
    const val = e.target.value
    setCustomValue(val)
    setError('')
    const num = parseInt(val)
    if (val && (isNaN(num) || num < 1 || num > 480)) {
      setError('Wpisz liczbę od 1 do 480')
    }
  }

  const applyCustom = () => {
    const num = parseInt(customValue)
    if (!isNaN(num) && num >= 1 && num <= 480) {
      updateInterval(num)
      setCustomValue('')
    }
  }

  const isPreset = PRESETS.includes(intervalMinutes)

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-4 space-y-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Ustawienia</h3>

      {/* Interwał */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Przypomnienie co (minuty)
          </p>
          <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
            {intervalMinutes} min
          </span>
        </div>

        {/* Presety */}
        <div className="flex gap-2 mb-3">
          {PRESETS.map(min => (
            <button
              key={min}
              onClick={() => { updateInterval(min); setCustomValue('') }}
              className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: intervalMinutes === min ? 'var(--accent)' : 'var(--surface-alt)',
                color: intervalMinutes === min ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {min}m
            </button>
          ))}
        </div>

        {/* Własna wartość */}
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="480"
              placeholder="Własny interwał..."
              value={customValue}
              onChange={handleCustom}
              onKeyDown={e => e.key === 'Enter' && applyCustom()}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--surface-alt)',
                border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                color: 'var(--text)',
              }}
            />
            {error && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
          </div>
          <button
            onClick={applyCustom}
            disabled={!customValue || !!error}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: customValue && !error ? 'var(--accent)' : 'var(--surface-alt)',
              color: customValue && !error ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
              opacity: customValue && !error ? 1 : 0.5,
            }}
          >
            Ustaw
          </button>
        </div>
        {!isPreset && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            ✓ Własny interwał: {intervalMinutes} minut
          </p>
        )}
      </div>

      {/* Powiadomienia na pulpicie */}
      <div className="space-y-2">
        <Toggle
          label="Powiadomienia na pulpicie"
          description="Ciche — nie przeszkadzają w biurze"
          checked={notifEnabled}
          onChange={toggleNotif}
        />
        {notifEnabled && (
          <button
            onClick={() => testNotification(showToast)}
            className="w-full py-2 text-xs rounded-lg transition-all"
            style={{
              background: 'var(--surface-alt)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            Wyślij testowe powiadomienie
          </button>
        )}
      </div>

      {/* Toast potwierdzenie */}
      {toast && (
        <div
          className="text-xs px-3 py-2.5 rounded-lg"
          style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {toast}
        </div>
      )}

      {/* Popup w aplikacji */}
      <Toggle
        label="Popup w aplikacji"
        description="Modal z ćwiczeniem przy każdej przerwie"
        checked={popupEnabled}
        onChange={togglePopup}
      />
    </div>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <span className="text-sm" style={{ color: 'var(--text)' }}>{label}</span>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      <button
        onClick={onChange}
        className="relative w-10 h-6 rounded-full transition-all"
        style={{ background: checked ? 'var(--accent)' : 'var(--border)' }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: checked ? '1.25rem' : '0.25rem' }}
        />
      </button>
    </div>
  )
}
