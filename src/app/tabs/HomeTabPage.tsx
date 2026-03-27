import { HomeProfileHeader } from '@/components/tabs/HomeProfileHeader'
import { LiveNumberCard } from '@/components/tabs/LiveNumberCard'
import { HomeBetEntryCard } from '@/components/tabs/HomeBetEntryCard'
import { screenRoot, screenScroll, tabScreen } from '@/styles/tw'

export function HomeTabPage() {
  return (
    <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-home-page">
      <HomeProfileHeader />

      <main className={screenScroll}>
        <LiveNumberCard />
        <HomeBetEntryCard />
      </main>
    </div>
  )
}
