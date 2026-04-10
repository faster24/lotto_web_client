import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type ActionItem = {
  id: string
  titleKey: string
  subtitleKey: string
  path: string
  icon: string
}

const actionItems: ActionItem[] = [
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
    id: 'withdrawal',
    titleKey: 'settings.withdrawal',
    subtitleKey: 'settings.withdrawalSubtitle',
    path: '/gambling/withdrawal-history',
    icon: 'payments',
  },
]

export function ActionGrid() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="setting-action-grid-heading">
      <h2 id="setting-action-grid-heading" className="sr-only">{t('settings.quickActions')}</h2>
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
                <span className="block text-[0.85rem] font-semibold text-[#f7f9ff]">{t(item.titleKey)}</span>
                <span className="text-[0.7rem] text-[#8a9bb3]">{t(item.subtitleKey)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
