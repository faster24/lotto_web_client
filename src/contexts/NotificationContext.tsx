import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { getNotificationStats, hasAuthToken, registerFcmToken } from '@/api/client'
import type { NotificationStats } from '@/api/types'
import { useToast } from '@/contexts/ToastContext'
import { useWallet } from '@/contexts/WalletContext'
import { dispatchDepositNotification, type DepositNotificationType } from '@/lib/depositNotificationBus'
import { dispatchBetNotification, type BetNotificationType } from '@/lib/betNotificationBus'
import { dispatchWithdrawalNotification, type WithdrawalNotificationType } from '@/lib/withdrawalNotificationBus'
import { listenForForegroundMessages, requestPushPermissionAndToken } from '@/lib/firebase'

const DEPOSIT_NOTIFICATION_TYPES: ReadonlySet<string> = new Set(['deposit_approved', 'deposit_rejected'])
const WITHDRAWAL_NOTIFICATION_TYPES: ReadonlySet<string> = new Set(['withdrawal_completed'])
const BET_NOTIFICATION_TYPES: ReadonlySet<string> = new Set(['bet_won'])

type NotificationContextValue = {
  notificationStats: NotificationStats | null
  refreshNotificationStats: () => void
  registerPushToken: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const FCM_TOKEN_DEVICE_TYPE = 'web' as const

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast()
  const { refreshWallet } = useWallet()
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  const fetchStats = useCallback(async () => {
    if (!hasAuthToken()) {
      return
    }

    try {
      const response = await getNotificationStats()
      setNotificationStats(response.data)
    } catch (err) {
      // Non-critical — stats are supplementary UI, fail silently
      console.warn('[fcm] fetchStats failed', err)
    } finally {
      // empty finally keeps eslint-plugin-react-hooks' set-state-in-effect heuristic
      // from misclassifying the await above as a synchronous setState call
    }
  }, [])

  const refreshNotificationStats = useCallback(() => {
    void fetchStats()
  }, [fetchStats])

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') void fetchStats()
    }
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [fetchStats])

  const registerPushToken = useCallback(async () => {
    try {
      const token = await requestPushPermissionAndToken()
      if (token == null) {
        return
      }

      await registerFcmToken({
        token,
        device_type: FCM_TOKEN_DEVICE_TYPE,
        device_name: navigator.userAgent.slice(0, 255),
      })
    } catch (error) {
      // Must never block/break login UX — log and move on
      console.warn('[fcm] registerPushToken failed', error)
    }
  }, [])

  useEffect(() => {
    void fetchStats()

    if (!hasAuthToken()) {
      return
    }

    let active = true
    void listenForForegroundMessages((payload) => {
      if (!active) {
        return
      }

      const title = payload.notification?.title ?? 'Notification'
      const body = payload.notification?.body
      showToast(body != null ? `${title}: ${body}` : title, 'info')
      void fetchStats()

      const notificationType = payload.data?.type
      if (notificationType != null) {
        if (DEPOSIT_NOTIFICATION_TYPES.has(notificationType)) {
          refreshWallet()
          dispatchDepositNotification({
            type: notificationType as DepositNotificationType,
            depositId: payload.data?.deposit_id ?? null,
          })
        } else if (WITHDRAWAL_NOTIFICATION_TYPES.has(notificationType)) {
          refreshWallet()
          dispatchWithdrawalNotification({
            type: notificationType as WithdrawalNotificationType,
            withdrawalId: payload.data?.withdrawal_id ?? null,
          })
        } else if (BET_NOTIFICATION_TYPES.has(notificationType)) {
          refreshWallet()
          dispatchBetNotification({
            type: notificationType as BetNotificationType,
            betId: payload.data?.bet_id ?? null,
          })
        }
      }
    }).then((unsubscribe) => {
      if (active) {
        unsubscribeRef.current = unsubscribe
      } else {
        unsubscribe()
      }
    })

    return () => {
      active = false
      unsubscribeRef.current?.()
      unsubscribeRef.current = null
    }
  }, [fetchStats, showToast, refreshWallet])

  return (
    <NotificationContext.Provider value={{ notificationStats, refreshNotificationStats, registerPushToken }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (ctx == null) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
