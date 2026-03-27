import { BetsContent } from '@/components/bets/BetsContent'
import { screenRoot, screenScroll, tabHeader, tabHeaderCaption, tabHeaderEyebrow, tabHeaderTitle, tabScreen } from '@/styles/tw'

export function ExploreTabPage() {
    return (
        <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-explore-page">
            <header className={tabHeader}>
                <p className={tabHeaderEyebrow}>Bet Center</p>
                <h1 className={tabHeaderTitle}>Bets</h1>
                <p className={tabHeaderCaption}>Place and review your bets from one tab.</p>
            </header>

            <main className={screenScroll}>
                <BetsContent />
            </main>
        </div>
    )
}
