import { Outlet } from 'react-router-dom'

export function MobileFrameShell() {
  return (
    <div className="mobile-frame-shell" data-testid="mobile-frame-shell">
      <div className="mobile-frame-shell__frame">
        <div className="mobile-frame-shell__viewport">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
