import useAppStore from '../store/useAppStore'

const INTERVALS = [15, 30, 45, 60, 90, 120]

export default function SettingsPanel() {
  const {
    intervalMinutes, updateInterval,
    notifEnabled, toggleNotif,
    popupEnabled, togglePopup,
    showSettings,
  } = useAppStore()

  if (!showSettings) return null

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-4 space-y-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Ustawienia</h3>

      {/* Interwał */}
      <div>
        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
          Przypomnienie co (minuty)
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERVALS.map(min => (
            <button
              key={min}
              onClick={() => updateInterval(min)}
              className="px-3 py-1 rounded-full text-sm font-medium transition-all"
              style={{
                background: intervalMinutes === min ? 'var(--accent)' : 'var(--surface-alt)',
                color: intervalMinutes === min ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {min}
            </button>
          ))}
        </div>
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
