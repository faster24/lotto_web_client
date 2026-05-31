import { useEffect, useState } from 'react'
import { listWalletTransactions } from '@/api/client'
import type { WalletTransaction, WalletTransactionType } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { useWallet } from '@/contexts/WalletContext'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const TYPE_CONFIG: Record<WalletTransactionType, { label: string; icon: string; color: string }> = {
  DEPOSIT: { label: 'Deposit', icon: 'account_balance_wallet', color: 'text-[#00e676]' },
  BET_PLACE: { label: 'Bet Placed', icon: 'casino', color: 'text-amber-400' },
  BET_WIN: { label: 'Bet Win', icon: 'emoji_events', color: 'text-[#00e676]' },
  BET_REFUND: { label: 'Bet Refunded', icon: 'undo', color: 'text-blue-400' },
  WITHDRAWAL: { label: 'Withdrawal', icon: 'payments', color: 'text-red-400' },
  WITHDRAWAL_REFUND: { label: 'Withdrawal Refunded', icon: 'undo', color: 'text-blue-400' },
  ADJUSTMENT: { label: 'Adjustment', icon: 'tune', color: 'text-purple-400' },
}

type FilterType = WalletTransactionType | null

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All', value: null },
  { label: 'Deposits', value: 'DEPOSIT' },
  { label: 'Bets', value: 'BET_PLACE' },
  { label: 'Wins', value: 'BET_WIN' },
  { label: 'Withdrawals', value: 'WITHDRAWAL' },
  { label: 'Adjustments', value: 'ADJUSTMENT' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function TransactionRecordPage() {
  const { wallet } = useWallet()
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const load = async (type: FilterType, pageNum: number, append: boolean) => {
    setLoading(true)
    try {
      const res = await listWalletTransactions({
        ...(type != null ? { type } : {}),
        page: pageNum,
        page_size: 20,
      })
      const fetched = res.data.transactions
      setTransactions((prev) => append ? [...prev, ...fetched] : fetched)
      setHasMore(fetched.length === 20)
    } catch {
      setError('Unable to load transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    void load(filter, 1, false)
  }, [filter])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="gambling-transaction-record-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Wallet</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          Transaction Record
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Your complete wallet activity ledger.</p>
      </header>

      <main className={screenScroll}>
        {/* Balance summary */}
        {wallet != null && (
          <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00e676] text-[1.1rem]">account_balance_wallet</span>
            <p className="m-0 text-[0.82rem]">
              <span className="text-[#8a9bb3]">Balance:</span>{' '}
              <span className="font-bold text-white">{wallet.balance.toLocaleString()} {wallet.currency}</span>
            </p>
          </div>
        )}

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold transition-colors ${
                filter === opt.value
                  ? 'border-[#00e676]/40 bg-[#00e676]/12 text-[#00e676]'
                  : 'border-white/12 bg-white/4 text-[#8a9bb3] hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <ApiStatePanel loading={loading} error={error} empty={!loading && error == null && transactions.length === 0} emptyMessage="No transactions yet." />

        {transactions.length > 0 && (
          <ul className="m-0 list-none grid gap-2 p-0">
            {transactions.map((txn) => {
              const cfg = TYPE_CONFIG[txn.type]
              const isCredit = txn.direction === 'CREDIT'
              return (
                <li
                  key={txn.id}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-3.5"
                >
                  <span className={`material-symbols-outlined text-[1.4rem] shrink-0 ${cfg.color}`}>{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-[0.82rem] font-semibold text-white truncate">{cfg.label}</p>
                    <p className="m-0 text-[0.68rem] text-[#8a9bb3]">
                      {formatDate(txn.created_at)}
                      {txn.note != null && ` · ${txn.note}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`m-0 text-[0.88rem] font-bold ${isCredit ? 'text-[#00e676]' : 'text-red-400'}`}>
                      {isCredit ? '+' : '-'}{txn.amount.toLocaleString()}
                    </p>
                    <p className="m-0 text-[0.65rem] text-[#8a9bb3]">Bal: {txn.balance_after.toLocaleString()}</p>
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
              void load(filter, next, true)
            }}
          >
            Load More
          </button>
        )}
      </main>
    </div>
  )
}
