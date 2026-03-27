import { useId, useState } from 'react'
import { Link } from 'react-router-dom'

type Language = 'English' | 'Thai' | 'Myanmar'

const languageOptions: Language[] = ['English', 'Thai', 'Myanmar']

export function MenuSettingsCard() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('Myanmar')
  const languageSelectId = useId()

  return (
    <section className="setting-menu-card" aria-labelledby="setting-menu-heading">
      <h2 id="setting-menu-heading">Menu Settings</h2>

      <ul className="setting-menu-list">
        <li>
          <button type="button" className="setting-menu-item">
            <span>Notifications</span>
            <span>On</span>
          </button>
        </li>

        <li>
          <Link to="/odd-settings" className="setting-menu-item">
            <span>Odd Settings</span>
            <span>Open</span>
          </Link>
        </li>

        <li>
          <label className="setting-language-row" htmlFor={languageSelectId}>
            <span>Language</span>
            <select
              id={languageSelectId}
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.currentTarget.value as Language)}
            >
              {languageOptions.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </li>
      </ul>
    </section>
  )
}
