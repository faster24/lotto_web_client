import { Link } from 'react-router-dom'
import { BetActivityGrid } from '@/components/bets/BetActivityGrid'
import { BetTypeSelector } from '@/components/bets/BetTypeSelector'
import { CardIcon } from '@/components/primitives/CardIcon'
import { screenRoot, screenScroll, tabHeader, tabHeaderEyebrow, tabHeaderTitle, tabScreen } from '@/styles/tw'

const financeItems = [
  {
    id: 'deposit',
    path: '/wallet-profile/deposit',
    label: 'Deposit',
    caption: 'Top up balance',
    icon: '/assets/icons/noun-deposit-7804216.svg',
    accentColor: '#00e676',
  },
  {
    id: 'withdrawal-history',
    path: '/gambling/withdrawal-history',
    label: 'Withdrawal',
    caption: 'View past payouts',
    icon: '/assets/icons/noun-withdraw-7548534.svg',
    accentColor: '#93c5fd',
  },
]

export function BetTabPage() {
  return (
    <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-bet-page">
      <header className={tabHeader}>
        <p className={tabHeaderEyebrow}>Play</p>
        <h1 className={tabHeaderTitle}>Bet Hub</h1>
      </header>

      <main className={screenScroll}>
        {/* Game selection */}
        <BetTypeSelector />

        {/* Finance */}
        <section>
          <p className="mb-3 px-0.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#8a9bb3]">
            Finance
          </p>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
            {financeItems.map(({ id, path, label, caption, icon, accentColor }) => (
              <li key={id}>
                <Link
                  to={path}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] transition-all duration-200 hover:border-white/16 hover:bg-white/5 active:scale-[0.97]"
                >
                  <CardIcon src={icon} color={accentColor} size="clamp(3rem, 14vw, 4rem)" />
                  <div className="-mt-1 text-center">
                    <span className="block text-[0.85rem] font-bold leading-tight text-[#f7f9ff]">{label}</span>
                    <span className="text-[0.68rem] text-[#8a9bb3]">{caption}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Activity shortcuts */}
        <BetActivityGrid />
      </main>
    </div>
  )
}
