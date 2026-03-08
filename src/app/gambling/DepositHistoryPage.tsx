import { GamblingRouteNav } from './GamblingRouteNav'

type DepositEntry = {
  id: string
  method: string
  account: string
  submittedAt: string
  amount: string
  status: 'completed' | 'pending' | 'failed'
}

const depositEntries: DepositEntry[] = [
  {
    id: 'dep-1',
    method: 'KBZ Pay Top Up',
    account: '09*** *** 224',
    submittedAt: '08 Mar 2026 · 09:42 AM',
    amount: '+120,000 MMK',
    status: 'completed',
  },
  {
    id: 'dep-2',
    method: 'Wave Money Transfer',
    account: '09*** *** 792',
    submittedAt: '07 Mar 2026 · 07:05 PM',
    amount: '+50,000 MMK',
    status: 'pending',
  },
  {
    id: 'dep-3',
    method: 'Bank Slip Upload',
    account: 'AYA Mobile Banking',
    submittedAt: '06 Mar 2026 · 04:26 PM',
    amount: '+200,000 MMK',
    status: 'failed',
  },
]

const depositSummary = [
  { id: 'approved', label: 'Approved', value: '2' },
  { id: 'pending', label: 'Pending', value: '1' },
  { id: 'month-total', label: 'This month', value: '370,000 MMK' },
]

const statusLabelMap: Record<DepositEntry['status'], string> = {
  completed: 'Completed',
  pending: 'Checking',
  failed: 'Rejected',
}

export function DepositHistoryPage() {
  return (
    <div className="screen-root gambling-screen" data-testid="gambling-deposit-history-page">
      <header className="gambling-header">
        <p className="gambling-header__eyebrow">Funds</p>
        <h1>Deposit History</h1>
        <p className="gambling-header__caption">Track top-up requests and review each approval stage.</p>
      </header>

      <main className="screen-scroll gambling-scroll">
        <GamblingRouteNav activeId="deposit-history" />

        <section className="gambling-stat-grid" aria-label="Deposit summary metrics">
          {depositSummary.map((metric) => (
            <article key={metric.id} className="gambling-stat-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <section className="gambling-ledger-card" aria-labelledby="deposit-ledger-heading">
          <div className="gambling-ledger-card__head">
            <h2 id="deposit-ledger-heading">Recent deposits</h2>
            <p>Latest 3 requests</p>
          </div>

          <ul className="gambling-ledger-list" aria-label="Deposit list">
            {depositEntries.map((entry) => (
              <li key={entry.id} className="gambling-ledger-item">
                <div className="gambling-ledger-main">
                  <p className="gambling-ledger-title">{entry.method}</p>
                  <p className="gambling-ledger-meta">
                    {entry.account} · {entry.submittedAt}
                  </p>
                </div>

                <div className="gambling-ledger-side">
                  <p className="gambling-amount gambling-amount--positive">{entry.amount}</p>
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
