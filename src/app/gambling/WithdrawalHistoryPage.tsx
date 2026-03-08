import { GamblingRouteNav } from './GamblingRouteNav'

type WithdrawalEntry = {
  id: string
  destination: string
  account: string
  requestedAt: string
  amount: string
  status: 'completed' | 'pending'
}

const withdrawalEntries: WithdrawalEntry[] = [
  {
    id: 'wd-1',
    destination: 'KBZ Pay Wallet',
    account: '09*** *** 112',
    requestedAt: '08 Mar 2026 · 02:16 PM',
    amount: '-80,000 MMK',
    status: 'pending',
  },
  {
    id: 'wd-2',
    destination: 'Wave Money',
    account: '09*** *** 889',
    requestedAt: '06 Mar 2026 · 07:48 PM',
    amount: '-40,000 MMK',
    status: 'completed',
  },
]

const payoutStats = [
  { id: 'sent', label: 'Sent this week', value: '120,000 MMK' },
  { id: 'pending', label: 'Under review', value: '1 request' },
]

const statusLabelMap: Record<WithdrawalEntry['status'], string> = {
  completed: 'Transferred',
  pending: 'Reviewing',
}

export function WithdrawalHistoryPage() {
  return (
    <div className="screen-root gambling-screen" data-testid="gambling-withdrawal-history-page">
      <header className="gambling-header">
        <p className="gambling-header__eyebrow">Payouts</p>
        <h1>Withdrawal History</h1>
        <p className="gambling-header__caption">Monitor outgoing cash-out requests and transfer confirmations.</p>
      </header>

      <main className="screen-scroll gambling-scroll">
        <GamblingRouteNav activeId="withdrawal-history" />

        <section className="gambling-stat-grid gambling-stat-grid--compact" aria-label="Withdrawal summary">
          {payoutStats.map((metric) => (
            <article key={metric.id} className="gambling-stat-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <section className="gambling-ledger-card" aria-labelledby="withdrawal-ledger-heading">
          <div className="gambling-ledger-card__head">
            <h2 id="withdrawal-ledger-heading">Withdrawal requests</h2>
            <p>Most recent payout activity</p>
          </div>

          <ul className="gambling-ledger-list" aria-label="Withdrawal list">
            {withdrawalEntries.map((entry) => (
              <li key={entry.id} className="gambling-ledger-item">
                <div className="gambling-ledger-main">
                  <p className="gambling-ledger-title">{entry.destination}</p>
                  <p className="gambling-ledger-meta">
                    {entry.account} · {entry.requestedAt}
                  </p>
                </div>

                <div className="gambling-ledger-side">
                  <p className="gambling-amount gambling-amount--negative">{entry.amount}</p>
                  <span className={`gambling-status-pill gambling-status-pill--${entry.status}`}>
                    {statusLabelMap[entry.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
