import { routeMap } from '@/app/routeMap'
import { TabShell } from '@/components/primitives/TabShell'
import { HistoryChatSection } from '@/components/tabs/HistoryChatSection'
import { HomeProfileHeader } from '@/components/tabs/HomeProfileHeader'
import { LiveNumberCard } from '@/components/tabs/LiveNumberCard'

export function HomeTabPage() {
  return (
    <div className="screen-root tab-screen" data-testid="tabs-home-page">
      <HomeProfileHeader />

      <main className="screen-scroll tab-screen__scroll">
        <TabShell items={routeMap.tabs} activeId="home" />
        <LiveNumberCard />
        <HistoryChatSection />
      </main>
    </div>
  )
}
