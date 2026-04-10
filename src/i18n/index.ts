import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import th from './locales/th'
import my from './locales/my'

export const LANG_KEY = 'lottery_lang'

const savedLang = localStorage.getItem(LANG_KEY) ?? 'en'

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
    my: { translation: my },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
