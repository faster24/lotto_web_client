import { GamblingRouteNav } from './GamblingRouteNav'

type GamblingEntry = {
  id: string
  market: '2D' | '3D' | 'Lotto'
  round: string
  playedAt: string
  picks: string[]
  stake: string
  payout: string
  status: 'won' | 'open' | 'lost'
}

const gamblingEntries: GamblingEntry[] = [
  {
    id: 'gamble-1',
    market: '2D',
    round: 'Morning Draw',
    playedAt: '08 Mar 2026 · 11:42 AM',
    picks: ['53', '12', '99'],
    stake: '6,000 MMK',
    payout: '42,000 MMK',
    status: 'won',
  },
  {
    id: 'gamble-2',
    market: '3D',
    round: 'Evening Draw',
    playedAt: '07 Mar 2026 · 03:27 PM',
    picks: ['128', '777'],
    stake: '4,000 MMK',
    payout: 'Pending',
    status: 'open',
  },
  {
    id: 'gamble-3',
    market: 'Lotto',
    round: 'Weekly Ticket',
    playedAt: '06 Mar 2026 · 10:14 AM',
    picks: ['A - 123456', 'B - 654321'],
    stake: '8,000 MMK',
    payout: '0 MMK',
    status: 'lost',
  },
]

const statusLabelMap: Record<GamblingEntry['status'], string> = {
  won: 'Won',
  open: 'Open',
  lost: 'Lost',
}

const statusClassMap: Record<GamblingEntry['status'], string> = {
  won: 'gambling-status-pill gambling-status-pill--completed',
  open: 'gambling-status-pill gambling-status-pill--pending',
  lost: 'gambling-status-pill gambling-status-pill--failed',
}

export function GamblingHistoryPage() {
  return (
    <div className="screen-root gambling-screen" data-testid="gambling-history-page">
      <header className="gambling-header">
        <p className="gambling-header__eyebrow">Gameplay</p>
        <h1>Gambling History</h1>
        <p className="gambling-header__caption">Review your picks, rounds, and outcomes across games.</p>
      </header>

      <main className="screen-scroll gambling-scroll">
        <GamblingRouteNav activeId="gambling-history" />

        <section className="gambling-ledger-card" aria-labelledby="gambling-history-heading">
          <div className="gambling-ledger-card__head">
            <h2 id="gambling-history-heading">Bet slips</h2>
            <p>Latest round activity</p>
          </div>

          <ul className="gambling-ledger-list gambling-ledger-list--stacked" aria-label="Bet history list">
            {gamblingEntries.map((entry) => (
              <li key={entry.id} className="gambling-ledger-item gambling-ledger-item--stacked">
                <div className="gambling-ledger-main">
                  <p className="gambling-ledger-title">
                    {entry.market} · {entry.round}
                  </p>
                  <p className="gambling-ledger-meta">{entry.playedAt}</p>
                </div>

                <span className={statusClassMap[entry.status]}>{statusLabelMap[entry.status]}</span>

                <ul className="gambling-chip-row" aria-label={`${entry.market} picks`}>
                  {entry.picks.map((pick) => (
                    <li key={pick} className="gambling-chip-row__item">
                      {pick}
                    </li>
                  ))}
                </ul>

                <p className="gambling-ledger-submeta">
                  Stake <strong>{entry.stake}</strong> · Payout <strong>{entry.payout}</strong>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
