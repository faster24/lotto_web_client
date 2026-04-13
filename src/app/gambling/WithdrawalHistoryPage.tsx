import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { listPayoutHistory } from '@/api/client'
import type { Bet } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

function formatDateTime(iso: string | null) {
  if (iso == null) return null
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function WithdrawalHistoryPage() {
  const { t } = useTranslation()
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const payoutStatusConfig: Partial<Record<Bet['payout_status'], { label: string; className: string }>> = {
    PAID_OUT: { label: t('gambling.paidOut'), className: 'bg-[#00e676]/12 text-[#00e676] border-[#00e676]/25' },
    REFUNDED: { label: t('gambling.refunded'), className: 'bg-blue-500/12 text-blue-400 border-blue-500/25' },
  }

  useEffect(() => {
    listPayoutHistory()
      .then((res) => setBets(res.data.payout_history))
      .catch(() => setError(t('gambling.loadPayoutError')))
      .finally(() => setLoading(false))
  }, [t])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="gambling-withdrawal-history-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">
          {t('gambling.payoutsEyebrow')}
        </p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          {t('gambling.withdrawalHistoryTitle')}
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
          {t('gambling.withdrawalHistoryDesc')}
        </p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel
          loading={loading}
          error={error}
          empty={!loading && error == null && bets.length === 0}
          emptyMessage={t('gambling.noPayoutRecords')}
        />

        {bets.length > 0 && (
          <ul className="m-0 list-none grid gap-3 p-0">
            {bets.map((bet) => {
              const payout = payoutStatusConfig[bet.payout_status] ?? { label: bet.payout_status, className: 'bg-white/5 text-[#8a9bb3] border-white/10' }
              const paidAt = formatDateTime(bet.paid_out_at)
              return (
                <li
                  key={bet.id}
                  className="rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[0.72rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/5 text-[#f7f9ff] border-white/10">
                      {bet.bet_type}
                    </span>
                    <span className={`text-[0.72rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${payout.className}`}>
                      {payout.label}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="m-0 text-[0.7rem] uppercase tracking-widest text-[#8a9bb3]">
                      {t('gambling.amountLabel')}
                    </p>
                    <p className="m-0 text-[1.1rem] font-bold text-[#f7f9ff]">
                      {bet.total_amount} <span className="text-[0.8rem] font-normal text-[#8a9bb3]">{bet.currency}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="m-0 text-[0.7rem] text-[#8a9bb3]">{t('gambling.drawDate')}: {bet.stock_date}</p>
                    {paidAt != null && (
                      <p className="m-0 text-[0.68rem] text-[#8a9bb3]">{t('gambling.paidDate')}: {paidAt}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}