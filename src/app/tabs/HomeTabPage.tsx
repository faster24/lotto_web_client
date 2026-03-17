import { HomeProfileHeader } from '@/components/tabs/HomeProfileHeader'
import { LiveNumberCard } from '@/components/tabs/LiveNumberCard'

export function HomeTabPage() {
  return (
    <div className="screen-root tab-screen" data-testid="tabs-home-page">
      <HomeProfileHeader />

      <main className="screen-scroll tab-screen__scroll">
        <LiveNumberCard />
      </main>
    </div>
  )
}
