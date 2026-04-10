import { useTranslation } from 'react-i18next'
import { BetsContent } from '@/components/bets/BetsContent'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function BetsPage() {
  const { t } = useTranslation()

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="bets-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('bets.headerEyebrow')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{t('bets.headerTitle')}</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{t('bets.headerDesc')}</p>
      </header>

      <main className={screenScroll}>
        <BetsContent />
      </main>
    </div>
  )
}
