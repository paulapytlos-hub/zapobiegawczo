import { useState } from 'react'
import useAppStore from '../store/useAppStore'

async function testNotification(setToast) {
  if (Notification.permission !== 'granted') {
    setToast('Najpierw włącz powiadomienia — kliknij przełącznik powyżej.')
    return
  }

  let sent = false

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
    notifPermission,
    popupEnabled, togglePopup,
    showSettings,
  } = useAppStore()

  const [customValue, setCustomValue] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  if (!showSettings) return null

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 5000)
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

  const previewBreak = () => {
    useAppStore.setState({ showBreakModal: true })
  }

  const isPreset = PRESETS.includes(intervalMinutes)

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-5 space-y-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h3 className="font-semibold text-base" style={{ color: 'var(--text)' }}>Ustawienia</h3>

      {/* Interwał */}
      <div>
        <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>
          Jak często chcesz dostawać przypomnienie?
        </p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          Aktualnie co <strong>{intervalMinutes} minut</strong>. Wybierz gotową opcję lub wpisz własną liczbę.
        </p>

        <div className="flex gap-2 mb-3">
          {PRESETS.map(min => (
            <button
              key={min}
              onClick={() => { updateInterval(min); setCustomValue('') }}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: intervalMinutes === min ? 'var(--accent)' : 'var(--surface-alt)',
                color: intervalMinutes === min ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {min} min
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max="480"
              placeholder="Własna liczba minut (1–480)..."
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
          <p className="text-xs mt-2" style={{ color: 'var(--accent)' }}>
            Ustawiono własny interwał: {intervalMinutes} minut
          </p>
        )}
      </div>

      <Divider />

      {/* Powiadomienia na pulpicie */}
      <div className="space-y-3">
        <div>
          <Toggle
            label="Powiadomienia na pulpicie"
            description="Ciche — pojawią się nawet, gdy pracujesz w innej aplikacji lub zakładce"
            checked={notifEnabled}
            onChange={toggleNotif}
          />
          {notifPermission === 'denied' && (
            <div
              className="mt-2 text-xs p-3 rounded-lg leading-relaxed"
              style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              Przeglądarka zablokowała powiadomienia. Aby odblokować: kliknij kłódkę w pasku adresu przeglądarki → "Powiadomienia" → wybierz "Zezwól".
            </div>
          )}
        </div>
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
            Wyślij testowe powiadomienie — sprawdź, czy działa
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="text-xs px-3 py-2.5 rounded-lg leading-relaxed"
          style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {toast}
        </div>
      )}

      <Divider />

      {/* Popup w aplikacji */}
      <Toggle
        label="Okienko z ćwiczeniem"
        description="Przy każdej przerwie pojawi się na ekranie propozycja krótkiego ćwiczenia"
        checked={popupEnabled}
        onChange={togglePopup}
      />

      <Divider />

      {/* Podgląd przerwy */}
      <div>
        <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>Podgląd przerwy</p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          Kliknij, żeby zobaczyć, jak wygląda okienko, które pojawi się przy każdym przypomnieniu.
        </p>
        <button
          onClick={previewBreak}
          className="w-full py-2.5 text-sm font-medium transition-all"
          style={{
            background: 'var(--surface-alt)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          Pokaż przykładowe ćwiczenie
        </button>
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: '1px', background: 'var(--border)' }} />
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</span>
        {description && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      <button
        onClick={onChange}
        className="relative w-11 h-6 rounded-full transition-all shrink-0"
        style={{ background: checked ? 'var(--accent)' : 'var(--border)' }}
        aria-label={checked ? 'Wyłącz' : 'Włącz'}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: checked ? '1.375rem' : '0.25rem' }}
        />
      </button>
    </div>
  )
}
