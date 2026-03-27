import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '@/api/client'

type ServiceItem = {
  id: string
  title: string
  subtitle: string
  path: string
}

const serviceItems: ServiceItem[] = [
  {
    id: 'announcements',
    title: 'Announcements',
    subtitle: 'Platform updates and notices',
    path: '/announcements',
  },
  {
    id: 'about',
    title: 'About',
    subtitle: 'Terms, versions, and policy',
    path: '/wallet-profile/about',
  },
]

export function ServiceCenterCard() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null)

  const onLogout = async () => {
    setIsLoggingOut(true)
    setLogoutMessage(null)

    try {
      const response = await logoutUser()
      setLogoutMessage(response.message)
      void navigate('/auth/login', { replace: true })
    } catch {
      setLogoutMessage('Logout failed.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <section className="service-center-card" aria-labelledby="service-center-heading">
      <h2 id="service-center-heading">Service Center</h2>

      <ul className="service-center-grid">
        {serviceItems.map((item) => (
          <li key={item.id}>
            <Link to={item.path} className="service-center-item">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </Link>
          </li>
        ))}
      </ul>

      <button type="button" className="service-center-logout" onClick={() => setIsConfirmOpen(true)} disabled={isLoggingOut}>
        {isLoggingOut ? 'Logging out...' : 'Log out'}
      </button>
      {logoutMessage != null && <p className="service-center-note">{logoutMessage}</p>}

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(4_10_31_/_56%)] p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            aria-describedby="logout-confirm-description"
            className="w-full max-w-sm rounded-2xl border border-[rgb(255_255_255_/_16%)] bg-[#0f1d38] p-5 shadow-[0_18px_42px_rgb(4_10_31_/_45%)]"
          >
            <h3 id="logout-confirm-title" className="m-0 text-base font-semibold text-[#f5f8ff]">
              Confirm logout
            </h3>
            <p id="logout-confirm-description" className="mt-2 mb-0 text-sm text-[#a7b4cb]">
              You will be redirected to the login page.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="h-10 rounded-xl border border-[rgb(255_255_255_/_22%)] bg-transparent text-sm font-semibold text-[#d5def0] transition hover:bg-[rgb(255_255_255_/_8%)]"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-10 rounded-xl border-0 bg-[#00e676] text-sm font-semibold text-[#04141f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => {
                  setIsConfirmOpen(false)
                  void onLogout()
                }}
                disabled={isLoggingOut}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
