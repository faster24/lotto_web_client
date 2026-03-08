import { WalletProfileRouteNav } from './WalletProfileRouteNav'

const lotteryRounds = [
  {
    id: 'lot-1',
    title: 'Aung Bar Lay Lottery (Myanmar)',
    closeAt: '01 Apr 2026 · 12:00 PM',
    countdown: '24d 03:11:20',
    status: 'Open',
  },
  {
    id: 'lot-2',
    title: 'Thai Government Lottery',
    closeAt: '16 Mar 2026 · 03:30 PM',
    countdown: '08d 06:42:10',
    status: 'Open',
  },
  {
    id: 'lot-3',
    title: 'Archived March Draw',
    closeAt: '01 Mar 2026 · 12:00 PM',
    countdown: 'Closed',
    status: 'Closed',
  },
]

export function LotteryPage() {
  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-lottery-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">Lottery Rounds</p>
        <h1>Lottery</h1>
        <p className="wallet-profile-header__caption">Browse lottery rounds, close times, and entry availability.</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="lottery" />

        <section className="wallet-profile-card" aria-labelledby="lottery-rounds-heading">
          <div className="wallet-profile-card__head">
            <h2 id="lottery-rounds-heading">Active and archived rounds</h2>
            <p>3 listed campaigns</p>
          </div>

          <ul className="wallet-profile-list" aria-label="Lottery round cards">
            {lotteryRounds.map((round) => (
              <li key={round.id} className="wallet-profile-list-item wallet-profile-list-item--stacked">
                <div className="wallet-profile-row-between">
                  <p className="wallet-profile-list-item__title">{round.title}</p>
                  <span
                    className={
                      round.status === 'Open'
                        ? 'wallet-profile-status-pill wallet-profile-status-pill--open'
                        : 'wallet-profile-status-pill wallet-profile-status-pill--closed'
                    }
                  >
                    {round.status}
                  </span>
                </div>
                <p className="wallet-profile-list-item__meta">Close time · {round.closeAt}</p>
                <p className="wallet-profile-countdown">{round.countdown}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
