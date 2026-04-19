import { SelectionCenter } from '@/components/bets/SelectionCenter'
import { screenRoot, screenScroll, tabScreen } from '@/styles/tw'

export function ExploreTabPage() {
    return (
        <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-explore-page">
            <main className={screenScroll}>
                <SelectionCenter />
            </main>
        </div>
    )
}
