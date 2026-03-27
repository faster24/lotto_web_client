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
    <div
      className="relative isolate grid h-dvh min-h-dvh place-items-center px-3 md:px-6"
      style={{
        background:
          'radial-gradient(circle at 10% 0%, rgb(0 230 118 / 16%), transparent 35%), radial-gradient(circle at 100% 100%, rgb(0 230 118 / 8%), transparent 42%)',
      }}
      data-testid="mobile-frame-shell"
    >
      <div
        className="w-full max-w-[26.5rem] h-dvh min-h-dvh max-h-dvh overflow-hidden rounded-[2rem] border border-[rgb(0_230_118_/_24%)] bg-[linear-gradient(190deg,#081129_0%,#060e24_100%)] shadow-[0_40px_80px_rgb(2_6_16_/_62%),inset_0_1px_0_rgb(255_255_255_/_8%)]"
      >
        <div className="h-full">
          <Outlet />
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-[calc(clamp(0.75rem,2.1vh,1.4rem)+env(safe-area-inset-bottom))] left-1/2 z-[999] w-[min(calc(100vw-1.5rem),calc(26.5rem-1.25rem))] -translate-x-1/2">
        <div className="pointer-events-auto">
          <TabShell items={routeMap.tabs} activeId={activeTabId} />
        </div>
      </div>
    </div>
  )
}
