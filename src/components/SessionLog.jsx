import useAppStore from '../store/useAppStore'
import { useT } from '../hooks/useT'

export default function SessionLog() {
  const logItems = useAppStore(s => s.logItems)
  const t = useT()

  if (logItems.length === 0) return null

  return (
    <div
      className="mx-4 mt-4 rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      <div
        className="px-4 py-2 text-xs font-semibold uppercase tracking-wide"
        style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}
      >
        {t.sessionLogTitle}
      </div>
      <ul
        className="divide-y max-h-48 overflow-y-auto"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {logItems.map(item => (
          <li key={item.id} className="px-4 py-2 flex items-center gap-3 text-sm">
            <span className="font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
              {item.time}
            </span>
            <span style={{ color: 'var(--text)' }}>{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
