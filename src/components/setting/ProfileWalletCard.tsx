import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getMe } from '@/api/client'
import type { User } from '@/api/types'

export function ProfileWalletCard() {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        let active = true

        void getMe()
            .then((response) => {
                if (active) {
                    setUser(response.data.user)
                }
            })
            .catch(() => {
                if (active) {
                    setUser(null)
                }
            })

        return () => {
            active = false
        }
    }, [])

    const displayName = useMemo(() => {
        const username = user?.name?.trim()
        if (username != null && username.length > 0) return username
        if (user?.email != null && user.email.length > 0) return user.email
        return t('user.unknownUser')
    }, [user, t])

    const fullUid = user != null ? (user.uuid ?? String(user.id)) : null
    const trimmedUid = fullUid != null
        ? (fullUid.includes('-') ? fullUid.split('-')[0] + '...' : fullUid)
        : '-'
    const avatarText = displayName.slice(0, 2).toUpperCase()

    const copyUid = async () => {
        if (fullUid == null) return

        try {
            await navigator.clipboard?.writeText(fullUid)
        } catch (error) {
            void error
        }

        setCopied(true)

        window.setTimeout(() => {
            setCopied(false)
        }, 1200)
    }

    return (
        <section
            className="relative overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-6"
            aria-labelledby="setting-profile-heading"
        >
            {/* Decorative blur circle */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#00e676]/5 blur-3xl" />

            <div className="flex items-center gap-5">
                {/* Avatar */}
                <span
                    aria-hidden
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00e676] to-[#00c896] text-2xl font-extrabold text-[#003824] shadow-lg shadow-[#00e676]/20"
                >
                    {avatarText}
                </span>

                <div className="flex-1 min-w-0">
                    <h2 id="setting-profile-heading" className="m-0 text-base font-bold text-[#f7f9ff]">
                        {displayName}
                    </h2>

                    {/* UID + role row */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#00e676] transition hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => void copyUid()}
                            disabled={user == null}
                        >
                            <span>ID: {trimmedUid}</span>
                            {copied ? (
                                <span className="material-symbols-outlined text-[0.9rem]">check</span>
                            ) : (
                                <span className="material-symbols-outlined text-[0.9rem]">content_copy</span>
                            )}
                        </button>

                        {user?.role != null && (
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-widest ${user.role === 'vip' ? 'border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24]' : 'border-[#93c5fd]/25 bg-[#93c5fd]/8 text-[#93c5fd]'}`}>
                                {user.role === 'vip' && <span className="material-symbols-outlined text-[0.75rem] leading-none mr-1">workspace_premium</span>}
                                {user.role.toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
