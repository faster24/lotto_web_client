import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="screen-root wallet-profile-screen" data-testid="wallet-profile-about-page">
      <header className="wallet-profile-header">
        <p className="wallet-profile-header__eyebrow">{t('about.eyebrow')}</p>
        <h1>{t('about.title')}</h1>
        <p className="wallet-profile-header__caption">{t('about.desc')}</p>
      </header>

      <main className="screen-scroll wallet-profile-scroll">
        <section className="wallet-profile-card" aria-labelledby="about-privacy-heading">
          <div className="wallet-profile-card__head">
            <h2 id="about-privacy-heading">{t('about.privacyTitle')}</h2>
          </div>
          <p className="wallet-profile-copy">{t('about.privacyBody')}</p>
        </section>

        <section className="wallet-profile-card" aria-labelledby="about-policy-heading">
          <div className="wallet-profile-card__head">
            <h2 id="about-policy-heading">{t('about.policyTitle')}</h2>
          </div>
          <p className="wallet-profile-copy">{t('about.policyBody')}</p>
        </section>
      </main>
    </div>
  )
}
