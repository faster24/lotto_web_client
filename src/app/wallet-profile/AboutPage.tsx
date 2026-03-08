import { WalletProfileRouteNav } from './WalletProfileRouteNav'

const pillars = [
  {
    id: 'clarity',
    title: 'Clear flow',
    body: 'Simple card hierarchy and focused actions reduce friction during number entry and wallet management.',
  },
  {
    id: 'speed',
    title: 'Fast mobile behavior',
    body: 'Fixed mobile frame with safe-area spacing keeps each route stable across iOS/Android browser environments.',
  },
  {
    id: 'security',
    title: 'Safety-minded UX',
    body: 'Status tags, amount highlighting, and confirmation copy are designed to prevent accidental mistakes.',
  },
]

export function AboutPage() {
  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-about-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">Product Notes</p>
        <h1>About</h1>
        <p className="wallet-profile-header__caption">Learn what shapes the wallet profile experience and design priorities.</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="about" />

        <section className="wallet-profile-card" aria-labelledby="about-intro-heading">
          <div className="wallet-profile-card__head">
            <h2 id="about-intro-heading">Lottery Web Client</h2>
            <p>Version 1.0.0</p>
          </div>
          <p className="wallet-profile-copy">
            This wallet profile suite is a mobile-first web recreation focused on route parity and readable information layers.
          </p>
        </section>

        <section className="wallet-profile-card" aria-labelledby="about-pillars-heading">
          <div className="wallet-profile-card__head">
            <h2 id="about-pillars-heading">Core principles</h2>
            <p>What we optimize for</p>
          </div>

          <ul className="wallet-profile-list" aria-label="About principles">
            {pillars.map((pillar) => (
              <li key={pillar.id} className="wallet-profile-list-item wallet-profile-list-item--stacked">
                <p className="wallet-profile-list-item__title">{pillar.title}</p>
                <p className="wallet-profile-list-item__meta">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
