import { useTranslation } from 'react-i18next'
import { BetsContent } from '@/components/bets/BetsContent'
import { screenRoot, screenScroll, tabHeader, tabHeaderEyebrow, tabHeaderTitle, tabScreen } from '@/styles/tw'

export function ExploreTabPage() {
    const { t } = useTranslation()

    return (
        <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-explore-page">
            <header className={tabHeader}>
                <p className={tabHeaderEyebrow}>{t('bets.betCenter')}</p>
                <h1 className={tabHeaderTitle}>Zarmani108</h1>
            </header>

            <main className={screenScroll}>
                <BetsContent />
            </main>
        </div>
    )
}
