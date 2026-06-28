import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { listNotificationLogs, markAllNotificationsAsRead } from '@/api/client'
import type { NotificationLogEntry } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { useNotifications } from '@/contexts/NotificationContext'
import { listenForDepositNotifications } from '@/lib/depositNotificationBus'
import { apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const PER_PAGE = 20

const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: string; className: string }> = {
  deposit_approved: { icon: 'check_circle', className: 'bg-[#00e676]/12 text-[#00e676]' },
  deposit_rejected: { icon: 'cancel', className: 'bg-red-500/12 text-red-400' },
  bet_won: { icon: 'emoji_events', className: 'bg-[#00e676]/12 text-[#00e676]' },
  bet_paid_out: { icon: 'payments', className: 'bg-[#00e676]/12 text-[#00e676]' },
}

const DEFAULT_NOTIFICATION_TYPE_CONFIG = { icon: 'notifications', className: 'bg-[#93c5fd]/12 text-[#93c5fd]' }

function getNotificationTypeConfig(notificationType: string) {
  return NOTIFICATION_TYPE_CONFIG[notificationType] ?? DEFAULT_NOTIFICATION_TYPE_CONFIG
}

export function NotificationsPage() {
  const { t } = useTranslation()
  const { refreshNotificationStats } = useNotifications()
  const [items, setItems] = useState<NotificationLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const load = async (pageNum: number, append: boolean) => {
    try {
      const response = await listNotificationLogs({ page: pageNum, per_page: PER_PAGE })
      const fetched = response.data.data
      setItems((prev) => (append ? [...prev, ...fetched] : fetched))
      setHasMore(response.data.current_page < response.data.last_page)

      if (pageNum === 1) {
        markAllNotificationsAsRead()
          .then(() => refreshNotificationStats())
          .catch(() => {
            // Non-critical — the badge will simply stay stale until the next successful sync
          })
      }
    } catch {
      setError(t('notifications.loadError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load(1, false)
  }, [])

  useEffect(() => {
    return listenForDepositNotifications(() => {
      setPage(1)
      void load(1, false)
    })
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="notifications-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('notifications.eyebrow')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{t('notifications.title')}</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{t('notifications.desc')}</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={!loading && error == null && items.length === 0} emptyMessage={t('notifications.empty')} />

        {items.length > 0 && (
          <section className={apiCard}>
            <ul className="grid list-none gap-2 p-0 m-0">
              {items.map((item) => {
                const typeConfig = getNotificationTypeConfig(item.notification_type)

                return (
                  <li key={item.id} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 p-3">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeConfig.className}`}>
                      <span className="material-symbols-outlined text-[1.1rem]">{typeConfig.icon}</span>
                    </span>
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-semibold text-[#f7f9ff]">{item.title}</p>
                      <p className="m-0 mt-1 text-[0.82rem] leading-[1.4] text-[#8a9bb3]">{item.body}</p>
                      <p className="m-0 mt-2 text-[0.7rem] uppercase tracking-wide text-[#5d6f8c]">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>

            {hasMore && (
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-white/12 bg-white/4 py-3 text-[0.82rem] font-semibold text-[#8a9bb3] hover:text-white transition-colors"
                onClick={() => {
                  const next = page + 1
                  setPage(next)
                  void load(next, true)
                }}
              >
                {t('notifications.loadMore')}
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
