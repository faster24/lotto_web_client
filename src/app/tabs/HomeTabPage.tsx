import { HomeProfileHeader } from '@/components/tabs/HomeProfileHeader'
import { LiveNumberCard } from '@/components/tabs/LiveNumberCard'
import { BalancePill } from '@/components/wallet/BalancePill'
import { screenRoot, screenScroll, tabScreen } from '@/styles/tw'

export function HomeTabPage() {
  return (
    <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-home-page">
      <HomeProfileHeader />

      <main className={screenScroll}>
        <div className="flex justify-end">
          <BalancePill />
        </div>
        <LiveNumberCard />
      </main>
    </div>
  )
}
