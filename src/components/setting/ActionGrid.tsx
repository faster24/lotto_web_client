type ActionItem = {
  id: string
  title: string
  subtitle: string
  accent: 'blue' | 'green' | 'orange' | 'purple'
}

const actionItems: ActionItem[] = [
  {
    id: 'bet-history',
    title: 'Bet History',
    subtitle: 'Review your latest rounds',
    accent: 'blue',
  },
  {
    id: 'transactions',
    title: 'Transactions',
    subtitle: 'Money movement timeline',
    accent: 'green',
  },
  {
    id: 'tickets',
    title: 'Lottery Records',
    subtitle: 'Saved entries and outcomes',
    accent: 'orange',
  },
  {
    id: 'withdrawal',
    title: 'Withdrawal',
    subtitle: 'Payout statuses and detail',
    accent: 'purple',
  },
]

export function ActionGrid() {
  return (
    <section className="setting-action-grid" aria-labelledby="setting-action-grid-heading">
      <h2 id="setting-action-grid-heading">Quick Actions</h2>

      <ul className="setting-action-grid__list">
        {actionItems.map((item) => (
          <li key={item.id}>
            <button type="button" className={`setting-action-card setting-action-card--${item.accent}`}>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
