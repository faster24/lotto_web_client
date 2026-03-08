import { WalletProfileRouteNav } from './WalletProfileRouteNav'

const channels = [
  { id: 'kbz', name: 'KBZ Pay', eta: '1-3 min', fee: 'No fee' },
  { id: 'wave', name: 'Wave Money', eta: 'Instant', fee: 'No fee' },
  { id: 'bank', name: 'Bank Slip', eta: '5-15 min', fee: 'Bank charge may apply' },
]

const recentDeposits = [
  { id: 'dep-1', channel: 'KBZ Pay', submittedAt: 'Today, 12:18 PM', amount: '+120,000 MMK', status: 'Approved' },
  { id: 'dep-2', channel: 'Wave Money', submittedAt: 'Yesterday, 08:02 PM', amount: '+60,000 MMK', status: 'Checking' },
]

export function DepositPage() {
  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-deposit-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">Wallet Funding</p>
        <h1>Deposit</h1>
        <p className="wallet-profile-header__caption">Top up balance through trusted channels and keep proof ready.</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="deposit" />

        <section className="wallet-profile-card" aria-labelledby="deposit-channel-heading">
          <div className="wallet-profile-card__head">
            <h2 id="deposit-channel-heading">Choose channel</h2>
            <p>Manual confirmation flow</p>
          </div>

          <ul className="wallet-profile-list" aria-label="Deposit channel options">
            {channels.map((channel) => (
              <li key={channel.id} className="wallet-profile-list-item wallet-profile-list-item--stacked">
                <p className="wallet-profile-list-item__title">{channel.name}</p>
                <p className="wallet-profile-list-item__meta">
                  ETA {channel.eta} · {channel.fee}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="wallet-profile-card" aria-labelledby="deposit-form-heading">
          <div className="wallet-profile-card__head">
            <h2 id="deposit-form-heading">Submit request</h2>
            <p>UI-only draft</p>
          </div>

          <form className="wallet-profile-form" onSubmit={(event) => event.preventDefault()}>
            <label className="wallet-profile-form__field" htmlFor="deposit-amount">
              Amount (MMK)
              <input id="deposit-amount" type="text" inputMode="numeric" placeholder="Enter amount" />
            </label>
            <label className="wallet-profile-form__field" htmlFor="deposit-note">
              Transfer note
              <input id="deposit-note" type="text" placeholder="Last 6 digits or reference code" />
            </label>
            <button type="submit" className="wallet-profile-primary-btn">
              Create deposit ticket
            </button>
          </form>
        </section>

        <section className="wallet-profile-card" aria-labelledby="deposit-recent-heading">
          <div className="wallet-profile-card__head">
            <h2 id="deposit-recent-heading">Recent requests</h2>
            <p>Latest 2 items</p>
          </div>

          <ul className="wallet-profile-list" aria-label="Recent deposits">
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
