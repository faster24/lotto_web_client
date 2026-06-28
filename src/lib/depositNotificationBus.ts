const DEPOSIT_NOTIFICATION_EVENT = 'zarmani:deposit-notification'

export type DepositNotificationType = 'deposit_approved' | 'deposit_rejected'

export type DepositNotificationDetail = {
  type: DepositNotificationType
  depositId: string | null
}

export function dispatchDepositNotification(detail: DepositNotificationDetail) {
  window.dispatchEvent(new CustomEvent<DepositNotificationDetail>(DEPOSIT_NOTIFICATION_EVENT, { detail }))
}

export function listenForDepositNotifications(handler: (detail: DepositNotificationDetail) => void): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<DepositNotificationDetail>).detail)
  }

  window.addEventListener(DEPOSIT_NOTIFICATION_EVENT, listener)
  return () => window.removeEventListener(DEPOSIT_NOTIFICATION_EVENT, listener)
}
