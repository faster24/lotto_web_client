const BET_NOTIFICATION_EVENT = 'zarmani:bet-notification'

export type BetNotificationType = 'bet_won'

export type BetNotificationDetail = {
  type: BetNotificationType
  betId: string | null
}

export function dispatchBetNotification(detail: BetNotificationDetail) {
  window.dispatchEvent(new CustomEvent<BetNotificationDetail>(BET_NOTIFICATION_EVENT, { detail }))
}

export function listenForBetNotifications(handler: (detail: BetNotificationDetail) => void): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<BetNotificationDetail>).detail)
  }
  window.addEventListener(BET_NOTIFICATION_EVENT, listener)
  return () => window.removeEventListener(BET_NOTIFICATION_EVENT, listener)
}
