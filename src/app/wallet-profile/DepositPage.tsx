import { useTranslation } from 'react-i18next'
import { WalletProfileRouteNav } from './WalletProfileRouteNav'

type Channel = { id: string; nameKey: string; eta: string; fee: string }
type RecentDeposit = { id: string; channel: string; submittedAt: string; amount: string; status: string }

const channels: Channel[] = [
  { id: 'kbz', nameKey: 'KBZ Pay', eta: '1-3 min', fee: 'No fee' },
  { id: 'wave', nameKey: 'Wave Money', eta: 'Instant', fee: 'No fee' },
  { id: 'bank', nameKey: 'Bank Slip', eta: '5-15 min', fee: 'Bank charge may apply' },
]

const recentDeposits: RecentDeposit[] = [
  { id: 'dep-1', channel: 'KBZ Pay', submittedAt: 'Today, 12:18 PM', amount: '+120,000 MMK', status: 'Approved' },
  { id: 'dep-2', channel: 'Wave Money', submittedAt: 'Yesterday, 08:02 PM', amount: '+60,000 MMK', status: 'Checking' },
]

export function DepositPage() {
  const { t } = useTranslation()

  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-deposit-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">{t('deposit.eyebrow')}</p>
        <h1>{t('deposit.title')}</h1>
        <p className="wallet-profile-header__caption">{t('deposit.desc')}</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="deposit" />

        <section className="wallet-profile-card" aria-labelledby="deposit-channel-heading">
          <div className="wallet-profile-card__head">
            <h2 id="deposit-channel-heading">{t('deposit.chooseChannel')}</h2>
            <p>{t('deposit.manualFlow')}</p>
          </div>

          <ul className="wallet-profile-list" aria-label={t('deposit.chooseChannel')}>
            {channels.map((channel) => (
              <li key={channel.id} className="wallet-profile-list-item wallet-profile-list-item--stacked">
                <p className="wallet-profile-list-item__title">{channel.nameKey}</p>
                <p className="wallet-profile-list-item__meta">
                  ETA {channel.eta} · {channel.fee}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="wallet-profile-card" aria-labelledby="deposit-form-heading">
          <div className="wallet-profile-card__head">
            <h2 id="deposit-form-heading">{t('deposit.submitRequest')}</h2>
            <p>{t('deposit.uiOnlyDraft')}</p>
          </div>

          <form className="wallet-profile-form" onSubmit={(event) => event.preventDefault()}>
            <label className="wallet-profile-form__field" htmlFor="deposit-amount">
              {t('deposit.amountLabel')}
              <input id="deposit-amount" type="text" inputMode="numeric" placeholder={t('deposit.amountPlaceholder')} />
            </label>
            <label className="wallet-profile-form__field" htmlFor="deposit-note">
              {t('deposit.transferNote')}
              <input id="deposit-note" type="text" placeholder={t('deposit.transferNotePlaceholder')} />
            </label>
            <button type="submit" className="wallet-profile-primary-btn">
              {t('deposit.createTicket')}
            </button>
          </form>
        </section>

        <section className="wallet-profile-card" aria-labelledby="deposit-recent-heading">
          <div className="wallet-profile-card__head">
            <h2 id="deposit-recent-heading">{t('deposit.recentRequests')}</h2>
            <p>{t('deposit.recentItems')}</p>
          </div>

          <ul className="wallet-profile-list" aria-label={t('deposit.recentRequests')}>
            {recentDeposits.map((entry) => (
              <li key={entry.id} className="wallet-profile-list-item">
                <div>
                  <p className="wallet-profile-list-item__title">{entry.channel}</p>
                  <p className="wallet-profile-list-item__meta">
                    {entry.submittedAt} · {entry.status}
                  </p>
                </div>
                <p className="wallet-profile-list-item__amount wallet-profile-list-item__amount--positive">{entry.amount}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
