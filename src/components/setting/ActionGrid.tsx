import { Link } from 'react-router-dom'

type ActionItem = {
    id: string
    title: string
    subtitle: string
    path: string
}

const actionItems: ActionItem[] = [
    {
        id: 'bet-history',
        title: 'History',
        subtitle: 'Review your latest rounds',
        path: '/bets',
    },
    {
        id: 'transactions',
        title: 'Transactions',
        subtitle: 'Money movement timeline',
        path: '/gambling/transaction-record',
    },
    {
        id: 'tickets',
        title: 'Lottery Records',
        subtitle: 'Saved entries and outcomes',
        path: '/results/2d',
    },
    {
        id: 'withdrawal',
        title: 'Withdrawal',
        subtitle: 'Payout statuses and detail',
        path: '/gambling/withdrawal-history',
    },
]

export function ActionGrid() {
    return (
        <section
            className="rounded-[1.1rem] border border-white/12 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4"
            aria-labelledby="setting-action-grid-heading"
        >
            <h2 id="setting-action-grid-heading" className="m-0 font-[var(--font-display)] text-[1.14rem]">
                Quick Actions
            </h2>
            <ul className="m-0 mt-3 list-none space-y-[0.45rem] p-0">
                {actionItems.map((item) => (
                    <li key={item.id}>
                        <Link
                            to={item.path}
                            className="flex w-full items-center gap-2 rounded-[0.7rem] border border-white/12 bg-white/4 px-[0.72rem] py-[0.64rem] text-[0.85rem] text-[#f7f9ff]"
                        >
                            <span className="grid gap-[0.18rem]">
                                <span>{item.title}</span>
                                <span className="text-[0.68rem] text-[#8a9bb3]">{item.subtitle}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
