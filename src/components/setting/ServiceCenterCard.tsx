import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { logoutUser } from '@/api/client'

type ServiceItem = {
  id: string
  titleKey: string
  path: string
  icon: string
  pulse?: boolean
}

const serviceItems: ServiceItem[] = [
  {
    id: 'announcements',
    titleKey: 'settings.announcements',
    path: '/announcements',
    icon: 'campaign',
    pulse: true,
  },
  {
    id: 'about',
    titleKey: 'settings.about',
    path: '/privacy-policy',
    icon: 'info',
  },
]

export function ServiceCenterCard() {
  const { t } = useTranslation()
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
      setLogoutMessage(t('settings.logoutFailed'))
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <section aria-labelledby="service-center-heading" className="space-y-3">
      <h2
        id="service-center-heading"
        className="m-0 px-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#8a9bb3]"
      >
        {t('settings.serviceCenter')}
      </h2>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] divide-y divide-white/8">
        {serviceItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#8a9bb3] transition-colors group-hover:text-[#00e676]">
                {item.icon}
              </span>
              <span className="text-sm font-medium text-[#f7f9ff]">{t(item.titleKey)}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.pulse && (
                <span className="h-2 w-2 rounded-full bg-[#00e676] animate-pulse" />
              )}
              <span className="material-symbols-outlined text-[#8a9bb3]">chevron_right</span>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="w-full rounded-xl border border-red-500/10 bg-red-500/10 py-4 text-sm font-bold tracking-wide text-[#ff6a62] transition hover:bg-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? t('settings.loggingOut') : t('settings.logout')}
      </button>

      {logoutMessage != null && (
        <p className="m-0 text-[0.72rem] text-[#00e676]">{logoutMessage}</p>
      )}

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
              {t('settings.confirmLogout')}
            </h3>
            <p id="logout-confirm-description" className="mt-2 mb-0 text-sm text-[#a7b4cb]">
              {t('settings.logoutDescription')}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="h-10 rounded-xl border border-[rgb(255_255_255_/_22%)] bg-transparent text-sm font-semibold text-[#d5def0] transition hover:bg-[rgb(255_255_255_/_8%)]"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isLoggingOut}
              >
                {t('common.cancel')}
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
                {t('settings.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
