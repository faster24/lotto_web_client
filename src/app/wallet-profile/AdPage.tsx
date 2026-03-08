import { WalletProfileRouteNav } from './WalletProfileRouteNav'

const campaigns = [
  {
    id: 'campaign-1',
    title: 'Morning Draw Booster',
    period: '08 Mar - 31 Mar 2026',
    reward: '5% cashback on 2D stakes',
  },
  {
    id: 'campaign-2',
    title: 'Weekend Wallet Bonus',
    period: 'Every Sat/Sun',
    reward: 'Extra 3,000 MMK for deposits above 50,000 MMK',
  },
  {
    id: 'campaign-3',
    title: 'VIP Referral Season',
    period: '01 Mar - 15 Apr 2026',
    reward: 'Tiered referral points and prize draws',
  },
]

export function AdPage() {
  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-ad-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">Promotions</p>
        <h1>Ad</h1>
        <p className="wallet-profile-header__caption">Browse active campaigns, reward windows, and eligibility notes.</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="ad" />

        <section className="wallet-profile-card" aria-labelledby="ad-campaign-heading">
          <div className="wallet-profile-card__head">
            <h2 id="ad-campaign-heading">Featured campaigns</h2>
            <p>Current month</p>
          </div>

          <ul className="wallet-profile-ad-grid" aria-label="Promotion campaign cards">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="wallet-profile-ad-card">
                <p className="wallet-profile-ad-card__period">{campaign.period}</p>
                <p className="wallet-profile-ad-card__title">{campaign.title}</p>
                <p className="wallet-profile-ad-card__reward">{campaign.reward}</p>
                <button type="button" className="wallet-profile-secondary-btn">
                  View detail
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
