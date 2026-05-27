import { useState } from 'react'
import useAppStore from '../store/useAppStore'
import { useT } from '../hooks/useT'

async function testNotification(t, setToast) {
  if (Notification.permission !== 'granted') {
    setToast(t.notifFirst)
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
  } catch { /* SW niedostępny */ }

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
    setToast(t.testNotifSuccess)
  } else {
    setToast(t.testNotifFail)
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
    openBreakPreview,
    theme, setTheme,
    sittingMode, setSittingMode,
  } = useAppStore()
  const t = useT()

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
      setError(t.intervalError)
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
  const minLabel = t.minutes(intervalMinutes)

  return (
    <div
      className="mx-4 mt-4 rounded-xl p-5 space-y-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h3 className="font-semibold text-base" style={{ color: 'var(--text)' }}>{t.settingsTitle}</h3>

      {/* Wygląd */}
      <div>
        <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>{t.themeTitle}</p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{t.themeDesc}</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'dark', label: t.themeDark, desc: t.themeDarkDesc },
            { value: 'night', label: t.themeNight, desc: t.themeNightDesc },
            { value: 'light', label: t.themeLight, desc: t.themeLightDesc },
          ].map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: theme === value ? 'var(--accent-soft)' : 'var(--surface-alt)',
                border: `1px solid ${theme === value ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <span className="block text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</span>
              <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</span>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Interwał */}
      <div>
        <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>
          {t.intervalTitle}
        </p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          {t.intervalDesc(intervalMinutes, minLabel)}
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
              placeholder={t.intervalPlaceholder}
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
            {t.intervalSet}
          </button>
        </div>
        {!isPreset && (
          <p className="text-xs mt-2" style={{ color: 'var(--accent)' }}>
            {t.intervalCustomSet(intervalMinutes, minLabel)}
          </p>
        )}
      </div>

      <Divider />

      {/* Powiadomienia na pulpicie */}
      <div className="space-y-3">
        <div>
          <Toggle
            label={t.desktopNotifLabel}
            description={t.desktopNotifDesc}
            checked={notifEnabled}
            onChange={toggleNotif}
          />
          {notifPermission === 'denied' && (
            <div
              className="mt-2 text-xs p-3 rounded-lg leading-relaxed"
              style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {t.notifBlocked}
            </div>
          )}
        </div>
        {notifEnabled && (
          <button
            onClick={() => testNotification(t, showToast)}
            className="w-full py-2 text-xs rounded-lg transition-all"
            style={{
              background: 'var(--surface-alt)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            {t.testNotif}
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
        label={t.popupLabel}
        description={t.popupDesc}
        checked={popupEnabled}
        onChange={togglePopup}
      />

      <Divider />

      {/* Tryb siedzący */}
      <Toggle
        label={t.sittingLabel}
        description={t.sittingDesc}
        checked={sittingMode}
        onChange={() => setSittingMode(!sittingMode)}
      />

      <Divider />

      {/* Podgląd przerwy */}
      <div>
        <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>{t.previewTitle}</p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{t.previewDesc}</p>
        <button
          onClick={openBreakPreview}
          className="w-full py-2.5 text-sm font-medium transition-all"
          style={{
            background: 'var(--surface-alt)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {t.showPreview}
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
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: checked ? '1.375rem' : '0.25rem' }}
        />
      </button>
    </div>
  )
}
