import { Link } from 'react-router-dom'

export function HomeBetEntryCard() {
    return (
        <section className="home-bet-entry-card" aria-labelledby="home-bet-entry-heading">
            <div className="home-bet-entry-card__actions">
                <Link to="/wallet-profile/number-play" className="home-bet-entry-card__cta" aria-label="Place a bet using the form">
                    <svg aria-hidden viewBox="0 0 24 24" className="home-bet-entry-card__icon">
                        <path d="M4 7a2 2 0 0 1 2-2h5v2H6v10h12V7h-5V5h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm7-2h2v3h3v2h-3v3h-2v-3H8V8h3V5Z" fill="currentColor" />
                    </svg>
                    Place a Bet
                </Link>

                <Link to="/bets" className="home-bet-entry-card__secondary" aria-label="View bets ledger">
                    View Bets Ledger
                </Link>
            </div>
        </section>
    )
}
