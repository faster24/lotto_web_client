import { Link } from 'react-router-dom'
import { BetActivityGrid } from '@/components/bets/BetActivityGrid'
import { BetTypeSelector } from '@/components/bets/BetTypeSelector'
import { screenRoot, screenScroll, tabHeader, tabHeaderEyebrow, tabHeaderTitle, tabScreen } from '@/styles/tw'

const financeItems = [
  {
    id: 'deposit',
    path: '/wallet-profile/deposit',
    label: 'Deposit',
    caption: 'Top up balance',
    icon: 'add_card',
    accentColor: '#00e676',
    bgAccent: 'rgba(0,230,118,0.10)',
  },
  {
    id: 'withdrawal-history',
    path: '/gambling/withdrawal-history',
    label: 'Withdrawal',
    caption: 'View past payouts',
    icon: 'history',
    accentColor: '#93c5fd',
    bgAccent: 'rgba(147,197,253,0.10)',
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
            {financeItems.map(({ id, path, label, caption, icon, accentColor, bgAccent }) => (
              <li key={id}>
                <Link
                  to={path}
                  className="flex h-full flex-col items-start gap-4 rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4 transition-colors hover:bg-white/5 active:scale-95"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: bgAccent }}>
                    <span className="material-symbols-outlined text-[1.1rem]" style={{ color: accentColor }}>{icon}</span>
                  </div>
                  <div>
                    <span className="block text-[0.82rem] font-semibold text-[#f7f9ff]">{label}</span>
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
