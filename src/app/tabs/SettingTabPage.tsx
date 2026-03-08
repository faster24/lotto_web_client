import { routeMap } from '@/app/routeMap'
import { TabShell } from '@/components/primitives/TabShell'
import { ActionGrid } from '@/components/setting/ActionGrid'
import { MenuSettingsCard } from '@/components/setting/MenuSettingsCard'
import { ProfileWalletCard } from '@/components/setting/ProfileWalletCard'
import { ServiceCenterCard } from '@/components/setting/ServiceCenterCard'

export function SettingTabPage() {
  return (
    <div className="screen-root tab-screen" data-testid="tabs-setting-page">
      <header className="tab-top-header">
        <p className="tab-top-header__eyebrow">Preferences</p>
        <h1>Setting</h1>
        <p className="tab-top-header__caption">Profile cards, quick actions, and service tools.</p>
      </header>

      <main className="screen-scroll tab-screen__scroll">
        <TabShell items={routeMap.tabs} activeId="setting" />
        <ProfileWalletCard />
        <ActionGrid />
        <MenuSettingsCard />
        <ServiceCenterCard />
      </main>
    </div>
  )
}
