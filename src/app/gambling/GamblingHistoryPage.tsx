import { useEffect, useState } from 'react'
import { listBets } from '@/api/client'
import type { Bet } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { screenRoot, screenScroll, apiScreen, apiHeader } from '@/styles/tw'

const statusConfig: Record<Bet['status'], { label: string; className: string }> = {
  PENDING:  { label: 'Pending',  className: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
  ACCEPTED: { label: 'Accepted', className: 'bg-[#00e676]/12 text-[#00e676] border-[#00e676]/25' },
  REJECTED: { label: 'Rejected', className: 'bg-red-500/12 text-red-400 border-red-500/25' },
  REFUNDED: { label: 'Refunded', className: 'bg-blue-500/12 text-blue-400 border-blue-500/25' },
}


function formatOpenTime(time: string) {
  const [h, m] = time.split(':')
  const hour = parseInt(h ?? '0', 10)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${suffix}`
}

export function GamblingHistoryPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listBets()
      .then((res) => setBets(res.data.bets))
      .catch(() => setError('Unable to load bet history. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="gambling-history-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Activity</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          Bet History
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
          Your past wagers, results, and payout status.
        </p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel
          loading={loading}
          error={error}
          empty={!loading && error == null && bets.length === 0}
          emptyMessage="No bets placed yet. Head to the Bets tab to place your first wager."
        />

        {bets.length > 0 && (
          <ul className="m-0 list-none grid gap-3 p-0">
            {bets.map((bet) => {
              const status = statusConfig[bet.status]
              return (
                <li
                  key={bet.id}
                  className="rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4"
                >
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[0.72rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/5 text-[#f7f9ff] border-white/10">
                      {bet.bet_type}
                    </span>
                    <span className={`text-[0.72rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="mb-2">
                    <p className="m-0 text-[0.7rem] uppercase tracking-widest text-[#8a9bb3]">Total Wager</p>
                    <p className="m-0 text-[1.1rem] font-bold text-[#f7f9ff]">
                      {bet.total_amount} <span className="text-[0.8rem] font-normal text-[#8a9bb3]">{bet.currency}</span>
                    </p>
                  </div>

                  {/* Numbers */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {bet.bet_numbers.map((n, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 text-[0.78rem] text-[#e2e8f0]"
                      >
                        <span className="font-bold">{String(n.number).padStart(2, '0')}</span>
                        <span className="text-[#8a9bb3]">× {n.amount}</span>
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-1">
                    <p className="m-0 text-[0.7rem] text-[#8a9bb3]">{bet.stock_date}</p>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00e676]/10 border border-[#00e676]/20 text-[0.72rem] font-semibold text-[#00e676]">
                      <span className="material-symbols-outlined text-[0.85rem] leading-none">schedule</span>
                      {formatOpenTime(bet.target_opentime)}
                    </span>
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
