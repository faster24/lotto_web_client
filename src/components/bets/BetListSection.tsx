import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Bet } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard } from '@/styles/tw'

type Props = {
    loading: boolean
    error: string | null
    bets: Bet[]
    label: string
}

export function BetListSection({ loading, error, bets, label }: Props) {
    const { t } = useTranslation()

    return (
        <>
            <ApiStatePanel loading={loading} error={error} empty={bets.length === 0} emptyMessage={t('bets.emptyList', { label })} />

            {bets.length > 0 && (
                <section className={apiCard}>
                    <h2 className="m-0 mb-2 text-[1.12rem]">{t('bets.listHeading', { label })}</h2>
                    <ul className="m-0 grid list-none gap-2.5 p-0">
                        {bets.map((bet) => (
                            <li key={bet.id} className="rounded-xl border border-white/8 bg-white/3 p-2.5">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="m-0 text-[0.9rem] font-semibold">
                                        {bet.bet_type} · {bet.total_amount} {bet.currency}
                                    </p>
                                    <Link className={`${apiButton} min-h-[44px]`} to={`/bets/${bet.id}`}>
                                        {t('common.view')}
                                    </Link>
                                </div>
                                <p className="mt-1 mb-0 text-[0.82rem] leading-[1.45] text-[#8a9bb3]">
                                    Numbers: {bet.bet_numbers.map((item) => item.number).join(', ')}
                                </p>
                                <p className="m-0 text-[0.82rem] leading-[1.45] text-[#8a9bb3]">
                                    {bet.stock_date} {bet.target_opentime}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    )
}
