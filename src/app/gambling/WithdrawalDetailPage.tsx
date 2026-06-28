import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cancelWithdrawal, downloadWithdrawalProof, getWithdrawalById } from '@/api/client'
import { listenForWithdrawalNotifications } from '@/lib/withdrawalNotificationBus'
import type { Withdrawal } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { useToast } from '@/contexts/ToastContext'
import { useWallet } from '@/contexts/WalletContext'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const STATUS_CONFIG: Record<Withdrawal['status'], { label: string; className: string }> = {
  COMPLETED: { label: 'Completed', className: 'bg-[#00e676]/12 text-[#00e676] border-[#00e676]/25' },
  PENDING: { label: 'Pending', className: 'bg-amber-500/12 text-amber-400 border-amber-500/25' },
  REJECTED: { label: 'Rejected', className: 'bg-red-500/12 text-red-400 border-red-500/25' },
}

function formatDate(iso: string | null) {
  if (iso == null) return null
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function WithdrawalDetailPage() {
  const { t } = useTranslation()
  const { withdrawalId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { refreshWallet } = useWallet()
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (withdrawalId == null) { setError('Missing withdrawal ID.'); setLoading(false); return }
    getWithdrawalById(withdrawalId)
      .then((res) => setWithdrawal(res.data.withdrawal))
      .catch(() => setError('Unable to load withdrawal detail.'))
      .finally(() => setLoading(false))
  }, [withdrawalId])

  useEffect(() => {
    if (withdrawalId == null) return
    return listenForWithdrawalNotifications((detail) => {
      if (detail.withdrawalId !== withdrawalId) return
      getWithdrawalById(withdrawalId).then((res) => setWithdrawal(res.data.withdrawal))
    })
  }, [withdrawalId])

  const onDownload = async () => {
    if (withdrawalId == null) return
    try {
      const blob = await downloadWithdrawalProof(withdrawalId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = withdrawal?.payout_proof.file_name ?? 'payout-proof'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      showToast('Failed to download proof.', 'error')
    }
  }

  const onCancel = async () => {
    if (withdrawalId == null) return
    setCancelling(true)
    try {
      await cancelWithdrawal(withdrawalId)
      showToast(t('withdrawal.cancelled'), 'info')
      refreshWallet()
      navigate('/gambling/withdrawal-history')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Cancel failed.', 'error')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  const status = withdrawal != null ? STATUS_CONFIG[withdrawal.status] : null

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="withdrawal-detail-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('withdrawal.withdrawalDetail')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          Withdrawal
        </h1>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={!loading && error == null && withdrawal == null} emptyMessage="Withdrawal not found." />

        {withdrawal != null && status != null && (
          <section className={apiCard}>
            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex rounded-full border px-3 py-1 text-[0.72rem] font-bold uppercase tracking-widest ${status.className}`}>
                {status.label}
              </span>
            </div>

            <dl className="grid gap-3">
              <div className="flex justify-between">
                <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">Amount</dt>
                <dd className="m-0 text-[0.9rem] font-bold text-white">{withdrawal.amount.toLocaleString()} {withdrawal.currency}</dd>
              </div>

              {/* Bank snapshot */}
              <div className="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2">
                <p className="m-0 text-[0.68rem] uppercase tracking-widest text-[#8a9bb3]">{t('withdrawal.bankSnapshot')}</p>
                <p className="m-0 text-[0.82rem] font-semibold text-white">{withdrawal.bank_snapshot.bank_name}</p>
                <p className="m-0 text-[0.75rem] text-[#8a9bb3]">{withdrawal.bank_snapshot.account_name} · {withdrawal.bank_snapshot.account_number}</p>
              </div>

              {withdrawal.admin_note != null && (
                <div>
                  <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">Admin Note</dt>
                  <dd className="m-0 mt-1 text-[0.82rem] text-white">{withdrawal.admin_note}</dd>
                </div>
              )}

              {withdrawal.rejection_reason != null && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/8 p-3">
                  <p className="m-0 text-[0.72rem] uppercase tracking-widest text-red-400 mb-1">{t('withdrawal.rejectionReason')}</p>
                  <p className="m-0 text-[0.82rem] text-red-300">{withdrawal.rejection_reason}</p>
                </div>
              )}

              <div className="flex justify-between">
                <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">Submitted</dt>
                <dd className="m-0 text-[0.78rem] text-[#8a9bb3]">{formatDate(withdrawal.created_at)}</dd>
              </div>

              {withdrawal.reviewed_at != null && (
                <div className="flex justify-between">
                  <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">Reviewed</dt>
                  <dd className="m-0 text-[0.78rem] text-[#8a9bb3]">{formatDate(withdrawal.reviewed_at)}</dd>
                </div>
              )}
            </dl>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/8">
              {withdrawal.status === 'COMPLETED' && withdrawal.payout_proof.exists && (
                <button type="button" className={apiButton} onClick={() => void onDownload()}>
                  <span className="material-symbols-outlined text-[1rem]">download</span>
                  {t('withdrawal.downloadProof')}
                </button>
              )}

              {withdrawal.status === 'PENDING' && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-[0.8rem] border border-red-500/35 bg-red-500/10 px-3 py-2 text-[0.9rem] font-semibold text-red-400 hover:bg-red-500/16"
                  onClick={() => setShowConfirm(true)}
                >
                  <span className="material-symbols-outlined text-[1rem]">cancel</span>
                  {t('withdrawal.cancelWithdrawal')}
                </button>
              )}
            </div>
          </section>
        )}

        <Link className={apiButton} to="/gambling/withdrawal-history">
          ← Back to Withdrawal History
        </Link>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowConfirm(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-[22rem] bg-[#19202d] rounded-2xl border border-white/10 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="m-0 text-[1rem] font-bold text-white">{t('withdrawal.cancelConfirmTitle')}</h3>
              <p className="m-0 text-[0.86rem] text-[#8a9bb3]">{t('withdrawal.cancelConfirmBody')}</p>
              <div className="flex gap-2">
                <button type="button" className="flex-1 h-11 rounded-xl border border-white/12 text-[0.82rem] text-white/60 hover:text-white" onClick={() => setShowConfirm(false)}>
                  Keep
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  className="flex-1 h-11 rounded-xl border border-red-500/35 bg-red-500/10 text-[0.82rem] font-semibold text-red-400 hover:bg-red-500/16 disabled:opacity-60"
                  onClick={() => void onCancel()}
                >
                  {cancelling ? '...' : t('withdrawal.cancelConfirmYes')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
