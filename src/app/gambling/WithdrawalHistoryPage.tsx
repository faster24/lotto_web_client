import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listWithdrawals } from '@/api/client'
import { listenForWithdrawalNotifications } from '@/lib/withdrawalNotificationBus'
import type { Withdrawal } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiScreen, screenRoot, screenScroll, apiHeader } from '@/styles/tw'

const STATUS_CONFIG: Record<Withdrawal['status'], { label: string; className: string }> = {
  COMPLETED: { label: 'Completed', className: 'bg-[#00e676]/12 text-[#00e676] border-[#00e676]/25' },
  PENDING: { label: 'Pending', className: 'bg-amber-500/12 text-amber-400 border-amber-500/25' },
  REJECTED: { label: 'Rejected', className: 'bg-red-500/12 text-red-400 border-red-500/25' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function WithdrawalHistoryPage() {
  const navigate = useNavigate()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const load = async (pageNum: number, append: boolean) => {
    try {
      const res = await listWithdrawals({ page: pageNum, page_size: 20 })
      const fetched = res.data.withdrawals
      setWithdrawals((prev) => append ? [...prev, ...fetched] : fetched)
      setHasMore(fetched.length === 20)
    } catch {
      setError('Unable to load withdrawal history. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load(1, false) }, [])

  useEffect(() => {
    return listenForWithdrawalNotifications(() => {
      setPage(1)
      void load(1, false)
    })
  }, [])

  const completedCount = withdrawals.filter((w) => w.status === 'COMPLETED').length
  const pendingCount = withdrawals.filter((w) => w.status === 'PENDING').length
  const totalWithdrawn = withdrawals.filter((w) => w.status === 'COMPLETED').reduce((s, w) => s + w.amount, 0)
  const currency = withdrawals[0]?.currency ?? 'MMK'

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="gambling-withdrawal-history-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Payouts</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          Withdrawal History
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
          Track withdrawal requests and transfer status.
        </p>
      </header>

      <main className={screenScroll}>
        {/* Shortcut */}
        <Link
          to="/wallet-profile/withdrawal"
          className="inline-flex items-center gap-2 rounded-xl border border-[#00e676]/25 bg-[#00e676]/8 px-4 py-3 text-[0.82rem] font-semibold text-[#00e676] hover:bg-[#00e676]/14 transition-colors w-full"
        >
          <span className="material-symbols-outlined text-[1rem]">add</span>
          Request Withdrawal →
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Completed', value: String(completedCount) },
            { label: 'Pending', value: String(pendingCount) },
            { label: 'Total', value: `${totalWithdrawn.toLocaleString()} ${currency}` },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-white/8 bg-white/3 p-3">
              <p className="m-0 text-[0.68rem] uppercase tracking-widest text-[#8a9bb3]">{m.label}</p>
              <p className="m-0 mt-1 text-[0.88rem] font-bold text-white">{m.value}</p>
            </div>
          ))}
        </div>

        <ApiStatePanel
          loading={loading}
          error={error}
          empty={!loading && error == null && withdrawals.length === 0}
          emptyMessage="No withdrawal requests yet. Tap '+ Request Withdrawal' to get started."
        />

        {withdrawals.length > 0 && (
          <ul className="m-0 list-none grid gap-3 p-0">
            {withdrawals.map((w) => {
              const status = STATUS_CONFIG[w.status]
              return (
                <li
                  key={w.id}
                  className="rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4 cursor-pointer hover:border-white/15 active:scale-[0.99] transition-all"
                  onClick={() => navigate(`/gambling/withdrawal-history/${w.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="m-0 text-[0.82rem] font-semibold text-white">Withdrawal</p>
                      <p className="m-0 text-[0.7rem] text-[#8a9bb3]">{formatDate(w.created_at)} · {w.bank_snapshot.bank_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="m-0 text-[0.9rem] font-bold text-red-400">-{w.amount.toLocaleString()} {w.currency}</p>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {hasMore && (
          <button
            type="button"
            className="w-full rounded-xl border border-white/12 bg-white/4 py-3 text-[0.82rem] font-semibold text-[#8a9bb3] hover:text-white transition-colors"
            onClick={() => {
              const next = page + 1
              setPage(next)
              void load(next, true)
            }}
          >
            Load More
          </button>
        )}
      </main>
    </div>
  )
}
