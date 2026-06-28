const WITHDRAWAL_NOTIFICATION_EVENT = 'zarmani:withdrawal-notification'

export type WithdrawalNotificationType = 'withdrawal_completed'

export type WithdrawalNotificationDetail = {
  type: WithdrawalNotificationType
  withdrawalId: string | null
}

export function dispatchWithdrawalNotification(detail: WithdrawalNotificationDetail) {
  window.dispatchEvent(new CustomEvent<WithdrawalNotificationDetail>(WITHDRAWAL_NOTIFICATION_EVENT, { detail }))
}

export function listenForWithdrawalNotifications(handler: (detail: WithdrawalNotificationDetail) => void): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<WithdrawalNotificationDetail>).detail)
  }
  window.addEventListener(WITHDRAWAL_NOTIFICATION_EVENT, listener)
  return () => window.removeEventListener(WITHDRAWAL_NOTIFICATION_EVENT, listener)
}
