import { useTranslation } from 'react-i18next'
import { ActionGrid } from '@/components/setting/ActionGrid'
import { MenuSettingsCard } from '@/components/setting/MenuSettingsCard'
import { ProfileWalletCard } from '@/components/setting/ProfileWalletCard'
import { ServiceCenterCard } from '@/components/setting/ServiceCenterCard'
import { screenRoot, screenScroll, tabHeader, tabHeaderEyebrow, tabHeaderTitle, tabScreen } from '@/styles/tw'

export function SettingTabPage() {
  const { t } = useTranslation()

  return (
    <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-setting-page">
      <header className={tabHeader}>
        <p className={tabHeaderEyebrow}>{t('settings.preferences')}</p>
        <h1 className={tabHeaderTitle}>{t('settings.title')}</h1>
      </header>

      <main className={screenScroll}>
        <ProfileWalletCard />
        <ActionGrid />
        <MenuSettingsCard />
        <ServiceCenterCard />
      </main>
    </div>
  )
}
