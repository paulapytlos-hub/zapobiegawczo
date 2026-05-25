import { useState } from 'react'
import useAppStore from '../store/useAppStore'

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

  if (!showSettings) return null

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

      {/* Powiadomienia przeglądarki */}
      <Toggle
        label="Powiadomienia przeglądarki"
        checked={notifEnabled}
        onChange={toggleNotif}
      />

      {/* Popup w aplikacji */}
      <Toggle
        label="Popup w aplikacji"
        checked={popupEnabled}
        onChange={togglePopup}
      />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'var(--text)' }}>{label}</span>
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
