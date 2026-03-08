export function HomeProfileHeader() {
  return (
    <header className="tabs-header">
      <div className="tabs-header__profile-wrap">
        <button type="button" className="tabs-avatar" aria-label="Open profile">
          AK
        </button>

        <div>
          <p className="tabs-header__eyebrow">Welcome back</p>
          <h1 className="tabs-header__title">
            Home <span className="tabs-header__verified">Verified</span>
          </h1>
        </div>
      </div>

      <button type="button" className="tabs-notification-btn" aria-label="Open notifications">
        <span aria-hidden className="tabs-notification-btn__badge" />
        Alerts
      </button>
    </header>
  )
}
