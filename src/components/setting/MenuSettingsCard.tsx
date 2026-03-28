import { useId, useState } from 'react'
import { Link } from 'react-router-dom'

type Language = 'English' | 'Thai' | 'Myanmar'

const languageOptions: Language[] = ['English', 'Thai', 'Myanmar']

export function MenuSettingsCard() {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('Myanmar')
    const languageSelectId = useId()

    return (
        <section
            className="rounded-[1.1rem] border border-white/12 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4"
            aria-labelledby="setting-menu-heading"
        >
            <h2 id="setting-menu-heading" className="m-0 font-[var(--font-display)] text-[1.14rem]">
                Menu Settings
            </h2>

            <ul className="m-0 mt-3 list-none space-y-[0.45rem] p-0">
                <li>
                    <Link
                        to="/odd-settings"
                        className="flex w-full items-center justify-between rounded-[0.7rem] border border-white/12 bg-white/4 px-[0.72rem] py-[0.64rem] text-[0.85rem] text-[#f7f9ff]"
                    >
                        <span>Odd Settings</span>
                        <span className="text-[0.75rem] text-[#8a9bb3]">Open</span>
                    </Link>
                </li>

                <li>
                    <label
                        className="flex w-full items-center justify-between rounded-[0.7rem] border border-white/12 bg-white/4 px-[0.72rem] py-[0.64rem] text-[0.85rem] text-[#f7f9ff]"
                        htmlFor={languageSelectId}
                    >
                        <span>Language</span>
                        <select
                            id={languageSelectId}
                            value={selectedLanguage}
                            className="min-w-[6.6rem] rounded-[0.65rem] border border-white/12 bg-[#0b132b] px-[0.45rem] py-[0.34rem] text-[#f7f9ff]"
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
