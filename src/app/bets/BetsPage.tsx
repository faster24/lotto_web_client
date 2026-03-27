import { BetsContent } from '@/components/bets/BetsContent'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function BetsPage() {
  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="bets-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Bet</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Bets</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">List and create bets from `/bets`.</p>
      </header>

      <main className={screenScroll}>
        <BetsContent />
      </main>
    </div>
  )
}
