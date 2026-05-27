import { useState, useEffect } from 'react'
import { healthFacts, healthFactsEn } from '../data/exercises'
import useAppStore from '../store/useAppStore'

export default function FactBanner() {
  const remindersIgnored = useAppStore(s => s.remindersIgnored)
  const lang = useAppStore(s => s.language)
  const [fact, setFact] = useState('')

  useEffect(() => {
    if (remindersIgnored >= 2) {
      const pool = lang === 'en' ? healthFactsEn : healthFacts
      const random = pool[Math.floor(Math.random() * pool.length)]
      setFact(random)
    }
  }, [remindersIgnored, lang])

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
