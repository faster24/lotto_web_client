type SessionStat = {
  label: string
  value: string
  highlight?: boolean
}

const sessionStats: SessionStat[] = [
  { label: 'Morning', value: '45' },
  { label: 'Noon', value: '89' },
  { label: 'Evening', value: '85', highlight: true },
]

export function LiveNumberCard() {
  return (
    <section className="live-number-card" aria-labelledby="live-number-heading">
      <div className="live-number-card__header">
        <p className="live-pill">
          <span aria-hidden className="live-pill__dot" />
          LIVE
        </p>
        <p className="live-number-card__time">04:30 PM</p>
      </div>

      <h2 id="live-number-heading" className="live-number-card__title">
        Current Number
      </h2>

      <div className="live-number-row">
        <div className="live-number-digit">8</div>
        <span className="live-number-separator" aria-hidden>
          -
        </span>
        <div className="live-number-digit">5</div>
      </div>

      <div className="live-stats-grid">
        {sessionStats.map((stat) => (
          <article
            key={stat.label}
            className={stat.highlight ? 'live-stat live-stat--highlight' : 'live-stat'}
            aria-label={`${stat.label} session value ${stat.value}`}
          >
            <p className="live-stat__label">{stat.label}</p>
            <p className="live-stat__value">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
