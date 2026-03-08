import { WalletProfileRouteNav } from './WalletProfileRouteNav'

const supportChannels = [
  {
    id: 'facebook',
    title: 'Facebook Support',
    detail: 'Chat with live support agents',
    href: 'https://facebook.com',
  },
  {
    id: 'telegram',
    title: 'Telegram Line',
    detail: 'Fast response for payment and ticket issues',
    href: 'https://t.me',
  },
  {
    id: 'viber',
    title: 'Viber Contact',
    detail: 'Voice and text support for urgent cases',
    href: 'viber://chat',
  },
]

const faqItems = [
  {
    id: 'faq-1',
    question: 'How long does a deposit approval take?',
    answer: 'Most requests are approved within a few minutes when transfer notes are complete.',
  },
  {
    id: 'faq-2',
    question: 'Can I edit a number slip after submit?',
    answer: 'No, submitted slips are locked, so review picks and stake before final confirmation.',
  },
]

export function HelpCenterPage() {
  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-help-center-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">Support</p>
        <h1>Help Center</h1>
        <p className="wallet-profile-header__caption">Reach support channels and browse quick answers for common issues.</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="help-center" />

        <section className="wallet-profile-card" aria-labelledby="help-center-contacts-heading">
          <div className="wallet-profile-card__head">
            <h2 id="help-center-contacts-heading">Contact channels</h2>
            <p>Available daily</p>
          </div>

          <ul className="wallet-profile-list" aria-label="Support channels">
            {supportChannels.map((channel) => (
              <li key={channel.id} className="wallet-profile-list-item wallet-profile-list-item--stacked">
                <a href={channel.href} className="wallet-profile-support-link" target="_blank" rel="noreferrer">
                  {channel.title}
                </a>
                <p className="wallet-profile-list-item__meta">{channel.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="wallet-profile-card" aria-labelledby="help-center-faq-heading">
          <div className="wallet-profile-card__head">
            <h2 id="help-center-faq-heading">FAQ</h2>
            <p>2 quick answers</p>
          </div>

          <dl className="wallet-profile-faq-list">
            {faqItems.map((faq) => (
              <div key={faq.id} className="wallet-profile-faq-item">
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  )
}
