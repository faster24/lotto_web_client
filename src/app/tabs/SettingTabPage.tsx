import { ActionGrid } from '@/components/setting/ActionGrid'
import { MenuSettingsCard } from '@/components/setting/MenuSettingsCard'
import { ProfileWalletCard } from '@/components/setting/ProfileWalletCard'
import { ServiceCenterCard } from '@/components/setting/ServiceCenterCard'
import { screenRoot, screenScroll, tabHeader, tabHeaderCaption, tabHeaderEyebrow, tabHeaderTitle, tabScreen } from '@/styles/tw'

export function SettingTabPage() {
  return (
    <div className={`${screenRoot} ${tabScreen}`} data-testid="tabs-setting-page">
      <header className={tabHeader}>
        <p className={tabHeaderEyebrow}>Preferences</p>
        <h1 className={tabHeaderTitle}>Setting</h1>
        <p className={tabHeaderCaption}>
          Profile cards, quick actions, and service tools.
        </p>
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
