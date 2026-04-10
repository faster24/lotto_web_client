import { useTranslation } from 'react-i18next'
import { WalletProfileRouteNav } from './WalletProfileRouteNav'

export function HelpCenterPage() {
  const { t } = useTranslation()

  const supportChannels = [
    {
      id: 'facebook',
      title: t('helpCenter.fbSupport'),
      detail: t('helpCenter.fbSupportDesc'),
      href: 'https://facebook.com',
    },
    {
      id: 'telegram',
      title: t('helpCenter.telegram'),
      detail: t('helpCenter.telegramDesc'),
      href: 'https://t.me',
    },
    {
      id: 'viber',
      title: t('helpCenter.viber'),
      detail: t('helpCenter.viberDesc'),
      href: 'viber://chat',
    },
  ]

  const faqItems = [
    {
      id: 'faq-1',
      question: t('helpCenter.faqQ1'),
      answer: t('helpCenter.faqA1'),
    },
    {
      id: 'faq-2',
      question: t('helpCenter.faqQ2'),
      answer: t('helpCenter.faqA2'),
    },
  ]

  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-help-center-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">{t('helpCenter.eyebrow')}</p>
        <h1>{t('helpCenter.title')}</h1>
        <p className="wallet-profile-header__caption">{t('helpCenter.desc')}</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <WalletProfileRouteNav activeId="help-center" />

        <section className="wallet-profile-card" aria-labelledby="help-center-contacts-heading">
          <div className="wallet-profile-card__head">
            <h2 id="help-center-contacts-heading">{t('helpCenter.contactChannels')}</h2>
            <p>{t('helpCenter.availableDaily')}</p>
          </div>

          <ul className="wallet-profile-list" aria-label={t('helpCenter.contactChannels')}>
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
            <h2 id="help-center-faq-heading">{t('helpCenter.faq')}</h2>
            <p>{t('helpCenter.quickAnswers')}</p>
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
