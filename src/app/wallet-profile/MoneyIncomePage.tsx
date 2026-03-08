import { Link } from 'react-router-dom'
import { WalletProfileRouteNav } from './WalletProfileRouteNav'

const recommendations = [
  {
    id: 'rec-1',
    draw: 'Today 12:01 PM',
    market: '2D',
    numbers: ['54', '45', '99'],
    note: 'VIP range with balanced reverse pairs.',
  },
  {
    id: 'rec-2',
    draw: 'Today 04:30 PM',
    market: '3D',
    numbers: ['128', '280'],
    note: 'Shortlist for straight and wheel combos.',
  },
]

export function MoneyIncomePage() {
  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-money-income-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">Income Feed</p>
        <h1>Money Income</h1>
        <p className="wallet-profile-header__caption">See curated number suggestions and expected return context.</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="money-income" />

        <section className="wallet-profile-stat-grid" aria-label="Income overview">
          <article className="wallet-profile-stat-card">
            <p>Win ratio</p>
            <strong>67%</strong>
          </article>
          <article className="wallet-profile-stat-card">
            <p>Best market</p>
            <strong>2D Noon</strong>
          </article>
          <article className="wallet-profile-stat-card">
            <p>Est. today</p>
            <strong>+82,000 MMK</strong>
          </article>
        </section>

        <section className="wallet-profile-card" aria-labelledby="money-income-recommend-heading">
          <div className="wallet-profile-card__head">
            <h2 id="money-income-recommend-heading">Admin recommendations</h2>
            <p>Updated daily</p>
          </div>

          <ul className="wallet-profile-recommend-list" aria-label="Recommendation cards">
            {recommendations.map((item) => (
              <li key={item.id} className="wallet-profile-recommend-card">
                <p className="wallet-profile-recommend-card__meta">
                  {item.market} · {item.draw}
                </p>

                <ul className="wallet-profile-number-chip-list" aria-label={`${item.market} recommendations`}>
                  {item.numbers.map((number) => (
                    <li key={number}>{number}</li>
                  ))}
                </ul>

                <p className="wallet-profile-recommend-card__note">{item.note}</p>

                <Link to="/wallet-profile/number-play" className="wallet-profile-secondary-link">
                  Play these numbers
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
