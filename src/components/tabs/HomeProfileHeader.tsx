import { Link } from 'react-router-dom'

export function HomeProfileHeader() {
  return (
    <header className="tabs-header">
      <div className="tabs-header__profile-wrap">
        <Link to="/user/profile" className="tabs-avatar" aria-label="Open profile">
          AK
        </Link>

        <div>
          <p className="tabs-header__eyebrow">Welcome back</p>
          <h1 className="tabs-header__title">
            Home <span className="tabs-header__verified">Verified</span>
          </h1>
        </div>
      </div>

      <button type="button" className="tabs-notification-btn" aria-label="Open notifications">
        <span aria-hidden className="tabs-notification-btn__badge" />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="tabs-notification-btn__icon"
        >
          <path
            d="M12 4.25a4.25 4.25 0 0 0-4.25 4.25v2.09c0 .75-.25 1.49-.71 2.08l-1.2 1.53A1.25 1.25 0 0 0 6.82 16h10.36a1.25 1.25 0 0 0 .98-2.2l-1.2-1.53a3.38 3.38 0 0 1-.71-2.08V8.5A4.25 4.25 0 0 0 12 4.25Z"
            fill="currentColor"
          />
          <path
            d="M9.75 17.25a2.25 2.25 0 0 0 4.5 0h-4.5Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </header>
  )
}
