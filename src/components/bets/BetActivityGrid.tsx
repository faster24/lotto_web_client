import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type ActivityItem = {
  id: string
  titleKey: string
  subtitleKey: string
  path: string
  icon: string
}

const activityItems: ActivityItem[] = [
  {
    id: 'bet-history',
    titleKey: 'settings.betHistory',
    subtitleKey: 'settings.betHistorySubtitle',
    path: '/gambling/gambling-history',
    icon: 'history',
  },
  {
    id: 'transactions',
    titleKey: 'settings.transactions',
    subtitleKey: 'settings.transactionsSubtitle',
    path: '/gambling/transaction-record',
    icon: 'account_balance_wallet',
  },
  {
    id: 'tickets',
    titleKey: 'settings.lotteryRecords',
    subtitleKey: 'settings.lotteryRecordsSubtitle',
    path: '/results/2d',
    icon: 'confirmation_number',
  },
  {
    id: 'bank-account',
    titleKey: 'settings.bankAccount',
    subtitleKey: 'settings.bankAccountSubtitle',
    path: '/user/bank-info',
    icon: 'account_balance',
  },
]

export function BetActivityGrid() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="bet-activity-heading">
      <p id="bet-activity-heading" className="mb-3 px-0.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#8a9bb3]">
        Activity
      </p>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
        {activityItems.map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className="flex h-full flex-col items-start gap-4 rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4 transition-colors hover:bg-white/5 active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00e676]/10">
                <span className="material-symbols-outlined text-[1.1rem] text-[#00e676]">{item.icon}</span>
              </div>
              <div>
                <span className="block text-[0.82rem] font-semibold text-[#f7f9ff]">{t(item.titleKey)}</span>
                <span className="text-[0.68rem] text-[#8a9bb3]">{t(item.subtitleKey)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
