import { Link, useLocation } from 'react-router-dom'

type ResultEntry = {
    period: string
    time: string
    number: string
}

export type HistoryDay = {
    id: string
    date: string
    results: ResultEntry[]
}

type ExploreHistorySectionProps = {
    historyDays: HistoryDay[]
    loading: boolean
    error: string | null
}

const RESULT_TABS = [
    { to: '/results/2d', label: '2D Results', description: 'Two-digit draws' },
    { to: '/results/3d', label: '3D Results', description: 'Three-digit draws' },
]

export function ExploreHistorySection({ historyDays, loading, error }: ExploreHistorySectionProps) {
    const { pathname } = useLocation()

    return (
        <section className="explore-history" aria-labelledby="explore-history-heading">
            <h2 id="explore-history-heading">Recent History</h2>

            <div role="tablist" aria-label="Result type" className="flex gap-2">
                {RESULT_TABS.map((tab) => {
                    const isActive = pathname.startsWith(tab.to)
                    return (
                        <Link
                            key={tab.to}
                            to={tab.to}
                            role="tab"
                            aria-selected={isActive}
                            className={[
                                'flex flex-1 flex-col gap-0.5 rounded-xl border px-3 py-2.5 transition-colors no-underline',
                                isActive
                                    ? 'border-[rgb(59_130_246_/_45%)] bg-[rgb(59_130_246_/_12%)]'
                                    : 'border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/7',
                            ].join(' ')}
                        >
                            <span className={`text-[0.8rem] font-semibold leading-none ${isActive ? 'text-[#93c5fd]' : 'text-[#c9d4e8]'}`}>
                                {tab.label}
                            </span>
                            <span className="text-[0.68rem] leading-none text-[#8a9bb3]">{tab.description}</span>
                        </Link>
                    )
                })}
            </div>

            {loading && (
                <p className="m-0 rounded-xl border border-white/12 bg-white/5 p-2.5 text-[0.86rem] text-[#93c5fd]">
                    Loading data...
                </p>
            )}

            {!loading && error != null && (
                <p className="m-0 rounded-xl border border-[rgb(255_77_77_/_40%)] bg-white/5 p-2.5 text-[0.86rem] text-[#ff9b93]">
                    {error}
                </p>
            )}

            {!loading && error == null && historyDays.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-14 px-6 text-center">
                    <span
                        className="material-symbols-outlined text-[2.8rem] text-[#2a3a5c] select-none"
                        aria-hidden="true"
                    >
                        inbox
                    </span>
                    <p className="m-0 text-[0.95rem] font-semibold text-[#4a5d7a]">No data here</p>
                    <p className="m-0 text-[0.78rem] leading-[1.5] text-[#3a4d66] max-w-[220px]">No 2D results available yet.</p>
                </div>
            )}

            <ul className="explore-history__list">
                {historyDays.map((day) => (
                    <li key={day.id} className="explore-history-card">
                        <p className="explore-history-card__date">{day.date}</p>

                        <ul className="explore-history-card__results" aria-label={`Result entries for ${day.date}`}>
                            {day.results.map((result) => (
                                <li key={`${day.id}-${result.period}`} className="explore-history-result">
                                    <p>{result.period}</p>
                                    <small>{result.time}</small>
                                    <strong>{result.number}</strong>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </section>
    )
}
