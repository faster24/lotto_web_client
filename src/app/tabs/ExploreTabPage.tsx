import { routeMap } from '@/app/routeMap'
import { TabShell } from '@/components/primitives/TabShell'
import { ExploreHistorySection } from '@/components/tabs/ExploreHistorySection'

export function ExploreTabPage() {
  return (
    <div className="screen-root tab-screen" data-testid="tabs-explore-page">
      <header className="tab-top-header">
        <p className="tab-top-header__eyebrow">Archive</p>
        <h1>Explore</h1>
        <p className="tab-top-header__caption">List cards from recent draw history.</p>
      </header>

      <main className="screen-scroll tab-screen__scroll">
        <TabShell items={routeMap.tabs} activeId="explore" />
        <ExploreHistorySection />
      </main>
    </div>
  )
}
