import { useEffect, useState } from 'react'
import { listAcceptedPayments } from '@/api/client'
import type { Bet } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

function formatOpenTime(time: string | null | undefined) {
  if (!time) return null
  const [h, m] = time.split(':')
  const hour = parseInt(h ?? '0', 10)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${suffix}`
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function TransactionRecordPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listAcceptedPayments()
      .then((res) => setBets(res.data.accepted_payments))
      .catch(() => setError('Unable to load transactions. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="gambling-transaction-record-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Ledger</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          Accepted Payments
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
          Confirmed bet payments accepted by the system.
        </p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel
          loading={loading}
          error={error}
          empty={!loading && error == null && bets.length === 0}
          emptyMessage="No accepted payments yet."
        />

        {bets.length > 0 && (
          <ul className="m-0 list-none grid gap-3 p-0">
            {bets.map((bet) => (
              <li
                key={bet.id}
                className="rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4"
              >
                {/* Header row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/5 text-[#f7f9ff] border-white/10">
                    {bet.bet_type}
                  </span>
                  <span className="text-[0.72rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-[#00e676]/12 text-[#00e676] border-[#00e676]/25">
                    Accepted
                  </span>
                </div>

                {/* Amount */}
                <div className="mb-2">
                  <p className="m-0 text-[0.7rem] uppercase tracking-widest text-[#8a9bb3]">Total Wager</p>
                  <p className="m-0 text-[1.1rem] font-bold text-[#f7f9ff]">
                    {bet.total_amount} <span className="text-[0.8rem] font-normal text-[#8a9bb3]">{bet.currency}</span>
                  </p>
                </div>

                {/* Bet numbers */}
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
                  <p className="m-0 text-[0.7rem] text-[#8a9bb3]">{formatDateTime(bet.placed_at)}</p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00e676]/10 border border-[#00e676]/20 text-[0.72rem] font-semibold text-[#00e676]">
                    <span className="material-symbols-outlined text-[0.85rem] leading-none">schedule</span>
                    {bet.stock_date}{formatOpenTime(bet.target_opentime) ? ` · ${formatOpenTime(bet.target_opentime)}` : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
