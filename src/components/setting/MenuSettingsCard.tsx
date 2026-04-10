import { useId } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANG_KEY } from '@/i18n/index'

type Language = 'English' | 'Thai' | 'Myanmar'

const languageOptions: Language[] = ['English', 'Thai', 'Myanmar']

const langCodeMap: Record<Language, string> = {
  English: 'en',
  Thai: 'th',
  Myanmar: 'my',
}

const langDisplayMap: Record<string, Language> = {
  en: 'English',
  th: 'Thai',
  my: 'Myanmar',
}

export function MenuSettingsCard() {
  const { t, i18n } = useTranslation()
  const languageSelectId = useId()
  const selectedLanguage = langDisplayMap[i18n.language] ?? 'English'

  const handleLanguageChange = (lang: Language) => {
    const code = langCodeMap[lang]
    void i18n.changeLanguage(code)
    localStorage.setItem(LANG_KEY, code)
  }

  return (
    <section aria-labelledby="setting-menu-heading" className="space-y-3">
      <h2
        id="setting-menu-heading"
        className="m-0 px-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#8a9bb3]"
      >
        {t('settings.menuSettings')}
      </h2>

      <div className="overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] divide-y divide-white/8">
        {/* Bank Account row */}
        <Link
          to="/user/bank-info"
          className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#8a9bb3] transition-colors group-hover:text-[#00e676]">
              account_balance
            </span>
            <div>
              <p className="text-sm font-medium text-[#f7f9ff] leading-tight">{t('settings.bankAccount')}</p>
              <p className="text-[11px] text-[#8a9bb3] leading-tight mt-0.5">{t('settings.bankAccountSubtitle')}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8a9bb3]">chevron_right</span>
        </Link>

        {/* Odd Settings row */}
        <Link
          to="/odd-settings"
          className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#8a9bb3] transition-colors group-hover:text-[#00e676]">
              settings_input_component
            </span>
            <div>
              <p className="text-sm font-medium text-[#f7f9ff] leading-tight">{t('settings.oddsPayouts')}</p>
              <p className="text-[11px] text-[#8a9bb3] leading-tight mt-0.5">{t('settings.oddsPayoutsSubtitle')}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8a9bb3]">chevron_right</span>
        </Link>

        {/* Language row */}
        <div className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#8a9bb3] transition-colors group-hover:text-[#00e676]">
              language
            </span>
            <div>
              <p className="text-sm font-medium text-[#f7f9ff] leading-tight">{t('settings.language')}</p>
              <p className="text-[11px] text-[#8a9bb3] leading-tight mt-0.5">{t('settings.languageSubtitle')}</p>
            </div>
          </div>
          <div className="relative flex items-center gap-1">
            <select
              id={languageSelectId}
              value={selectedLanguage}
              className="appearance-none bg-transparent text-xs font-semibold text-[#00e676]/80 border-0 outline-none cursor-pointer pr-4"
              onChange={(event) => handleLanguageChange(event.currentTarget.value as Language)}
            >
              {languageOptions.map((language) => (
                <option key={language} value={language} className="bg-[#0b132b] text-[#f7f9ff]">
                  {language}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-0 material-symbols-outlined text-[#8a9bb3] text-[1rem]">expand_more</span>
          </div>
        </div>
      </div>
    </section>
  )
}
