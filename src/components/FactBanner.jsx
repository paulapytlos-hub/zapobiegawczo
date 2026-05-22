import { useState, useEffect } from 'react'
import { healthFacts } from '../data/exercises'
import useAppStore from '../store/useAppStore'

export default function FactBanner() {
  const remindersIgnored = useAppStore(s => s.remindersIgnored)
  const [fact, setFact] = useState('')

  useEffect(() => {
    if (remindersIgnored >= 2) {
      const random = healthFacts[Math.floor(Math.random() * healthFacts.length)]
      setFact(random)
    }
  }, [remindersIgnored])

  if (remindersIgnored < 2) return null

  return (
    <div
      className="mx-4 mt-3 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
    >
      <span className="shrink-0">💡</span>
      <span>{fact}</span>
    </div>
  )
}
