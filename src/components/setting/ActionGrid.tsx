import { Link } from 'react-router-dom'

type ActionItem = {
  id: string
  title: string
  subtitle: string
  path: string
  icon: string
}

const actionItems: ActionItem[] = [
  {
    id: 'bet-history',
    title: 'History',
    subtitle: 'View activity logs',
    path: '/bets',
    icon: 'history',
  },
  {
    id: 'transactions',
    title: 'Transactions',
    subtitle: 'Deposit & transfers',
    path: '/gambling/transaction-record',
    icon: 'account_balance_wallet',
  },
  {
    id: 'tickets',
    title: 'Lottery Records',
    subtitle: 'Ticket purchase history',
    path: '/results/2d',
    icon: 'confirmation_number',
  },
  {
    id: 'withdrawal',
    title: 'Withdrawal',
    subtitle: 'Request payouts',
    path: '/gambling/withdrawal-history',
    icon: 'payments',
  },
]

export function ActionGrid() {
  return (
    <section aria-labelledby="setting-action-grid-heading">
      <h2 id="setting-action-grid-heading" className="sr-only">Quick Actions</h2>
      <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">
        {actionItems.map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className="flex h-full flex-col items-start gap-4 rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-5 transition-colors hover:bg-white/5 active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00e676]/10">
                <span className="material-symbols-outlined text-[#00e676]">{item.icon}</span>
              </div>
              <div>
                <span className="block text-[0.85rem] font-semibold text-[#f7f9ff]">{item.title}</span>
                <span className="text-[0.7rem] text-[#8a9bb3]">{item.subtitle}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
