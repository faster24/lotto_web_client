import { ExploreHistorySection } from '@/components/tabs/ExploreHistorySection'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function TwoDResultsPage() {
  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="two-d-results-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Result</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Recent Draw History</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Browse recent 2D and 3D draw cards.</p>
      </header>

      <main className={screenScroll}>
        <ExploreHistorySection />
      </main>
    </div>
  )
}
