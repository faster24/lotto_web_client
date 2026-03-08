import { GamblingRouteNav } from './GamblingRouteNav'

type TransactionRow = {
  id: string
  time: string
  category: string
  reference: string
  amount: string
  direction: 'credit' | 'debit'
  status: 'completed' | 'pending' | 'failed'
}

const transactionRows: TransactionRow[] = [
  {
    id: 'txn-1',
    time: '08 Mar · 12:18 PM',
    category: 'Deposit',
    reference: 'KBZ Pay Manual',
    amount: '120,000 MMK',
    direction: 'credit',
    status: 'completed',
  },
  {
    id: 'txn-2',
    time: '08 Mar · 12:03 PM',
    category: '2D Stake',
    reference: 'Morning Draw #831',
    amount: '6,000 MMK',
    direction: 'debit',
    status: 'completed',
  },
  {
    id: 'txn-3',
    time: '07 Mar · 04:10 PM',
    category: 'Withdrawal',
    reference: 'Wave Pay Payout',
    amount: '50,000 MMK',
    direction: 'debit',
    status: 'pending',
  },
  {
    id: 'txn-4',
    time: '06 Mar · 09:20 AM',
    category: 'Lotto Stake',
    reference: 'Weekly Ticket #4472',
    amount: '8,000 MMK',
    direction: 'debit',
    status: 'failed',
  },
]

const statusLabelMap: Record<TransactionRow['status'], string> = {
  completed: 'Done',
  pending: 'In review',
  failed: 'Declined',
}

const amountClassMap: Record<TransactionRow['direction'], string> = {
  credit: 'gambling-amount gambling-amount--positive',
  debit: 'gambling-amount gambling-amount--negative',
}

export function TransactionRecordPage() {
  return (
    <div className="screen-root gambling-screen" data-testid="gambling-transaction-record-page">
      <header className="gambling-header">
        <p className="gambling-header__eyebrow">Ledger</p>
        <h1>Transaction Record</h1>
        <p className="gambling-header__caption">Combined wallet and betting actions in one timeline.</p>
      </header>

      <main className="screen-scroll gambling-scroll">
        <GamblingRouteNav activeId="transaction-record" />

        <section className="gambling-ledger-card" aria-labelledby="transaction-record-heading">
          <div className="gambling-ledger-card__head">
            <h2 id="transaction-record-heading">Unified history</h2>
            <p>Wallet + play movements</p>
          </div>

          <div className="gambling-table-wrap">
            <table className="gambling-table">
              <caption className="gambling-table__caption">Latest financial actions</caption>
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">Category</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactionRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.time}</td>
                    <td>{row.category}</td>
                    <td>{row.reference}</td>
                    <td>
                      <span className={amountClassMap[row.direction]}>{row.amount}</span>
                    </td>
                    <td>
                      <span className={`gambling-status-pill gambling-status-pill--${row.status}`}>
                        {statusLabelMap[row.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
