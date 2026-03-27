import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMe } from '@/api/client'
import type { User } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function UserProfilePage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        void (async () => {
            try {
                const response = await getMe()
                setUser(response.data.user)
            } catch {
                setError('Unable to load user profile.')
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <div className={`${screenRoot} ${apiScreen}`} data-testid="user-profile-page">
            <header className={apiHeader}>
                <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Account</p>
                <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Profile</h1>
            </header>

            <main className={screenScroll}>
                <ApiStatePanel loading={loading} error={error} empty={user == null} emptyMessage="No user profile found." />

                {user != null && (
                    <section className={apiCard}>
                        <div className="profile-card__top">
                            <div className="profile-card__hero">
                                <div className="profile-card__avatar" aria-hidden>
                                    {(user.username ?? user.email).slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h2>{user.username ?? 'Unknown user'}</h2>
                                    <p className="profile-card__email">{user.email}</p>
                                </div>
                            </div>

                            <div className="profile-card__chips">
                                <span className="profile-chip">
                                    <svg aria-hidden viewBox="0 0 24 24" className="profile-chip__icon">
                                        <path d="M12 2.75a3.75 3.75 0 1 1 0 7.5a3.75 3.75 0 0 1 0-7.5Zm-6.5 15a6.5 6.5 0 0 1 13 0v1.5h-13v-1.5Z" fill="currentColor" />
                                    </svg>
                                    {`ROLE · ${(user.role ?? 'n/a').toUpperCase()}`}
                                </span>
                            </div>
                        </div>

                        <dl className="profile-info-list">
                            <div className="profile-info-list__row">
                                <dt>
                                    <span className="profile-info-label">
                                        <svg aria-hidden viewBox="0 0 24 24" className="profile-info-label__icon">
                                            <path d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8Zm-6 13a6 6 0 0 1 12 0v1H6v-1Z" fill="currentColor" />
                                        </svg>
                                        Display Name
                                    </span>
                                </dt>
                                <dd>{user.username ?? '-'}</dd>
                            </div>
                            <div className="profile-info-list__row">
                                <dt>
                                    <span className="profile-info-label">
                                        <svg aria-hidden viewBox="0 0 24 24" className="profile-info-label__icon">
                                            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.1.2 5.4 4.2a.8.8 0 0 0 1 0l5.4-4.2-.5-.6-5.4 4.1-5.4-4.1-.5.6Z" fill="currentColor" />
                                        </svg>
                                        Email
                                    </span>
                                </dt>
                                <dd>{user.email}</dd>
                            </div>
                            <div className="profile-info-list__row">
                                <dt>
                                    <span className="profile-info-label">
                                        Role
                                    </span>
                                </dt>
                                <dd>{(user.role ?? 'n/a').toUpperCase()}</dd>
                            </div>
                        </dl>
                    </section>
                )}

                <section className={apiCard}>
                    <h2 className="m-0 mb-2 text-[1.12rem]">Operations</h2>
                    <div className="grid gap-2">
                        <Link className={apiButton} to="/user/bank-info">
                            <svg aria-hidden viewBox="0 0 24 24" className="api-link-btn__icon">
                                <path d="M4 7.5 12 4l8 3.5v2H4v-2Zm1 4h2.3v6H5v-6Zm5.4 0h2.3v6h-2.3v-6Zm5.3 0H18v6h-2.3v-6ZM4 19.5h16v2H4v-2Z" fill="currentColor" />
                            </svg>
                            Manage Bank Info
                        </Link>
                        <Link className={apiButton} to="/bets">
                            <svg aria-hidden viewBox="0 0 24 24" className="api-link-btn__icon">
                                <path d="M4 7a2 2 0 0 1 2-2h5v2H6v10h12V7h-5V5h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm7-2h2v3h3v2h-3v3h-2v-3H8V8h3V5Z" fill="currentColor" />
                            </svg>
                            View Bets Ledger
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
