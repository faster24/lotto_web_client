import { Outlet, useLocation } from 'react-router-dom'
import { routeMap } from '@/app/routeMap'
import { TabShell } from '@/components/primitives/TabShell'

export function MobileFrameShell() {
  const { pathname } = useLocation()
  const activeTabId =
    routeMap.tabs.find((tab) => {
      const tabPath = `/${tab.path}`

      return pathname === tabPath || pathname.startsWith(`${tabPath}/`)
    })?.id ?? ''

  return (
    <div className="mobile-frame-shell" data-testid="mobile-frame-shell">
      <div className="mobile-frame-shell__frame">
        <div className="mobile-frame-shell__viewport">
          <Outlet />
        </div>
      </div>

      <div className="mobile-frame-shell__tab-mount">
        <TabShell items={routeMap.tabs} activeId={activeTabId} />
      </div>
    </div>
  )
}
