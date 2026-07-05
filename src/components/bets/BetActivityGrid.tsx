import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CardIcon } from '@/components/primitives/CardIcon'

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
    icon: '/assets/icons/noun-history-8057329.svg',
  },
  {
    id: 'transactions',
    titleKey: 'settings.transactions',
    subtitleKey: 'settings.transactionsSubtitle',
    path: '/gambling/transaction-record',
    icon: '/assets/icons/noun-transition-5560166.svg',
  },
  {
    id: 'tickets',
    titleKey: 'settings.lotteryRecords',
    subtitleKey: 'settings.lotteryRecordsSubtitle',
    path: '/results/2d',
    icon: '/assets/icons/noun-casino-7694584.svg',
  },
  {
    id: 'bank-account',
    titleKey: 'settings.bankAccount',
    subtitleKey: 'settings.bankAccountSubtitle',
    path: '/user/bank-info',
    icon: '/assets/icons/noun-bank-6761382.svg',
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
              className="flex aspect-square w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] transition-all duration-200 hover:border-white/16 hover:bg-white/5 active:scale-[0.97]"
            >
              <CardIcon src={item.icon} color="#00e676" size="clamp(3rem, 14vw, 4rem)" />
              <div className="-mt-1 text-center">
                <span className="block text-[0.85rem] font-bold leading-tight text-[#f7f9ff]">{t(item.titleKey)}</span>
                <span className="text-[0.68rem] text-[#8a9bb3]">{t(item.subtitleKey)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
