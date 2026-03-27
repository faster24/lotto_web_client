import { Link } from 'react-router-dom'

type ActionItem = {
  id: string
  title: string
  subtitle: string
  path: string
}

const actionItems: ActionItem[] = [
  {
    id: 'bet-history',
    title: 'Bet History',
    subtitle: 'Review your latest rounds',
    path: '/bets',
  },
  {
    id: 'transactions',
    title: 'Transactions',
    subtitle: 'Money movement timeline',
    path: '/gambling/transaction-record',
  },
  {
    id: 'tickets',
    title: 'Lottery Records',
    subtitle: 'Saved entries and outcomes',
    path: '/results/2d',
  },
  {
    id: 'withdrawal',
    title: 'Withdrawal',
    subtitle: 'Payout statuses and detail',
    path: '/gambling/withdrawal-history',
  },
]

export function ActionGrid() {
  return (
    <section className="setting-action-grid" aria-labelledby="setting-action-grid-heading">
      <ul className="setting-menu-list">
        {actionItems.map((item) => (
          <li key={item.id}>
            <Link to={item.path} className="setting-menu-item setting-action-grid__item">
              <span className="setting-action-grid__content">
                <span>{item.title}</span>
                <span className="setting-action-grid__hint">{item.subtitle}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
