export default function ExerciseCard({ exercise, compact = false }) {
  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
    >
      <span className="text-3xl">{exercise.icon}</span>
      <div>
        <p className="font-semibold" style={{ color: 'var(--text)' }}>{exercise.namepl}</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{exercise.time}</p>
        {!compact && (
          <ol className="mt-2 space-y-1">
            {exercise.steps.map((step, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text)' }}>
                <span className="font-bold shrink-0" style={{ color: 'var(--accent)' }}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
