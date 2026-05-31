import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listDeposits } from '@/api/client'
import type { Deposit } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { GamblingRouteNav } from './GamblingRouteNav'

const STATUS_CONFIG: Record<Deposit['status'], { label: string; className: string }> = {
  APPROVED: { label: 'Approved', className: 'bg-[#00e676]/12 text-[#00e676] border-[#00e676]/25' },
  PENDING: { label: 'Pending', className: 'bg-amber-500/12 text-amber-400 border-amber-500/25' },
  REJECTED: { label: 'Rejected', className: 'bg-red-500/12 text-red-400 border-red-500/25' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function DepositHistoryPage() {
  const navigate = useNavigate()
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const load = async (pageNum: number, append: boolean) => {
    try {
      const res = await listDeposits({ page: pageNum, page_size: 20 })
      const fetched = res.data.deposits
      setDeposits((prev) => append ? [...prev, ...fetched] : fetched)
      setHasMore(fetched.length === 20)
    } catch {
      setError('Unable to load deposits. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load(1, false) }, [])

  const approvedCount = deposits.filter((d) => d.status === 'APPROVED').length
  const pendingCount = deposits.filter((d) => d.status === 'PENDING').length
  const now = new Date()
  const monthTotal = deposits
    .filter((d) => d.status === 'APPROVED' && d.reviewed_at != null && new Date(d.reviewed_at).getMonth() === now.getMonth() && new Date(d.reviewed_at).getFullYear() === now.getFullYear())
    .reduce((sum, d) => sum + (d.approved_amount ?? 0), 0)

  const currency = deposits[0]?.currency ?? 'MMK'

  const summaryMetrics = [
    { id: 'approved', label: 'Approved', value: String(approvedCount) },
    { id: 'pending', label: 'Pending', value: String(pendingCount) },
    { id: 'month-total', label: 'This month', value: `${monthTotal.toLocaleString()} ${currency}` },
  ]

  return (
    <div className="screen-root gambling-screen" data-testid="gambling-deposit-history-page">
      <header className="gambling-header">
        <p className="gambling-header__eyebrow">Funds</p>
        <h1>Deposit History</h1>
        <p className="gambling-header__caption">Track top-up requests and review each approval stage.</p>
      </header>

      <main className="screen-scroll gambling-scroll">
        <GamblingRouteNav activeId="deposit-history" />

        <section className="gambling-stat-grid" aria-label="Deposit summary metrics">
          {summaryMetrics.map((metric) => (
            <article key={metric.id} className="gambling-stat-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <ApiStatePanel loading={loading} error={error} empty={!loading && error == null && deposits.length === 0} emptyMessage="No deposit requests yet." />

        {deposits.length > 0 && (
          <section className="gambling-ledger-card" aria-labelledby="deposit-ledger-heading">
            <div className="gambling-ledger-card__head">
              <h2 id="deposit-ledger-heading">Deposits</h2>
              <p>{deposits.length} requests</p>
            </div>

            <ul className="gambling-ledger-list" aria-label="Deposit list">
              {deposits.map((deposit) => {
                const status = STATUS_CONFIG[deposit.status]
                return (
                  <li
                    key={deposit.id}
                    className="gambling-ledger-item cursor-pointer hover:bg-white/3 active:scale-[0.99] transition-all"
                    onClick={() => navigate(`/gambling/deposit-history/${deposit.id}`)}
                  >
                    <div className="gambling-ledger-main">
                      <p className="gambling-ledger-title">Deposit</p>
                      <p className="gambling-ledger-meta">
                        {formatDate(deposit.created_at)}
                        {deposit.transfer_note != null && deposit.transfer_note.length > 0 && ` · Ref: ${deposit.transfer_note}`}
                      </p>
                    </div>
                    <div className="gambling-ledger-side">
                      <p className="gambling-amount gambling-amount--positive">
                        +{deposit.claimed_amount.toLocaleString()} {deposit.currency}
                      </p>
                      <span className={`gambling-status-pill border rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>

            {hasMore && (
              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-white/12 bg-white/4 py-3 text-[0.82rem] font-semibold text-[#8a9bb3] hover:text-white transition-colors"
                onClick={() => {
                  const next = page + 1
                  setPage(next)
                  void load(next, true)
                }}
              >
                Load More
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
