type ResultEntry = {
  period: string
  time: string
  number: string
}

type HistoryDay = {
  id: string
  date: string
  results: ResultEntry[]
}

const historyDays: HistoryDay[] = [
  {
    id: '5-mar',
    date: '5 March 2026',
    results: [
      { period: 'Morning', time: '12:01 PM', number: '45' },
      { period: 'Noon', time: '02:30 PM', number: '92' },
      { period: 'Evening', time: '04:30 PM', number: '18' },
    ],
  },
  {
    id: '4-mar',
    date: '4 March 2026',
    results: [
      { period: 'Morning', time: '12:01 PM', number: '11' },
      { period: 'Noon', time: '02:30 PM', number: '34' },
      { period: 'Evening', time: '04:30 PM', number: '78' },
    ],
  },
  {
    id: '3-mar',
    date: '3 March 2026',
    results: [
      { period: 'Morning', time: '12:01 PM', number: '05' },
      { period: 'Noon', time: '02:30 PM', number: '67' },
      { period: 'Evening', time: '04:30 PM', number: '99' },
    ],
  },
]

export function ExploreHistorySection() {
  return (
    <section className="explore-history" aria-labelledby="explore-history-heading">
      <h2 id="explore-history-heading">Recent Draw History</h2>
      <div className="explore-history__actions">
        <Link to="/results/2d" className="explore-history__link">
          2D History API
        </Link>
        <Link to="/results/3d" className="explore-history__link">
          3D History API
        </Link>
      </div>

      <ul className="explore-history__list">
        {historyDays.map((day) => (
          <li key={day.id} className="explore-history-card">
            <p className="explore-history-card__date">{day.date}</p>

            <ul className="explore-history-card__results" aria-label={`Result entries for ${day.date}`}>
              {day.results.map((result) => (
                <li key={`${day.id}-${result.period}`} className="explore-history-result">
                  <p>{result.period}</p>
                  <small>{result.time}</small>
                  <strong>{result.number}</strong>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
import { Link } from 'react-router-dom'
