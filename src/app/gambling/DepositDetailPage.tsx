import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cancelDeposit, downloadDepositProof, getDepositById } from '@/api/client'
import type { Deposit } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { useToast } from '@/contexts/ToastContext'
import { useWallet } from '@/contexts/WalletContext'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const STATUS_CONFIG: Record<Deposit['status'], { label: string; className: string }> = {
  APPROVED: { label: 'Approved', className: 'bg-[#00e676]/12 text-[#00e676] border-[#00e676]/25' },
  PENDING: { label: 'Pending', className: 'bg-amber-500/12 text-amber-400 border-amber-500/25' },
  REJECTED: { label: 'Rejected', className: 'bg-red-500/12 text-red-400 border-red-500/25' },
}

function formatDate(iso: string | null) {
  if (iso == null) return null
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function DepositDetailPage() {
  const { t } = useTranslation()
  const { depositId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { refreshWallet } = useWallet()
  const [deposit, setDeposit] = useState<Deposit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (depositId == null) { setError('Missing deposit ID.'); setLoading(false); return }
    getDepositById(depositId)
      .then((res) => setDeposit(res.data.deposit))
      .catch(() => setError('Unable to load deposit detail.'))
      .finally(() => setLoading(false))
  }, [depositId])

  const onDownload = async () => {
    if (depositId == null) return
    try {
      const blob = await downloadDepositProof(depositId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = deposit?.proof_of_payment.file_name ?? 'deposit-proof'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      showToast('Failed to download proof.', 'error')
    }
  }

  const onCancel = async () => {
    if (depositId == null) return
    setCancelling(true)
    try {
      await cancelDeposit(depositId)
      showToast(t('deposit.cancelled'), 'info')
      refreshWallet()
      navigate('/gambling/deposit-history')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Cancel failed.', 'error')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  const status = deposit != null ? STATUS_CONFIG[deposit.status] : null

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="deposit-detail-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('deposit.depositDetail')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          Deposit
        </h1>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={!loading && error == null && deposit == null} emptyMessage="Deposit not found." />

        {deposit != null && status != null && (
          <section className={apiCard}>
            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex rounded-full border px-3 py-1 text-[0.72rem] font-bold uppercase tracking-widest ${status.className}`}>
                {status.label}
              </span>
            </div>

            {/* Details */}
            <dl className="grid gap-3">
              <div className="flex justify-between">
                <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">{t('deposit.claimedAmount')}</dt>
                <dd className="m-0 text-[0.9rem] font-bold text-white">{deposit.claimed_amount.toLocaleString()} {deposit.currency}</dd>
              </div>

              {(deposit.approved_amount != null && deposit.status === 'APPROVED') && (
                <div className="flex justify-between">
                  <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">{t('deposit.approvedAmount')}</dt>
                  <dd className="m-0 text-[0.9rem] font-bold text-[#00e676]">{deposit.approved_amount.toLocaleString()} {deposit.currency}</dd>
                </div>
              )}

              {deposit.approved_amount != null && deposit.approved_amount !== deposit.claimed_amount && (
                <p className="m-0 text-[0.72rem] text-amber-400">{t('deposit.partialNote')}</p>
              )}

              {deposit.transfer_note != null && (
                <div className="flex justify-between">
                  <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">Transfer Note</dt>
                  <dd className="m-0 text-[0.82rem] text-white">{deposit.transfer_note}</dd>
                </div>
              )}

              {deposit.admin_note != null && (
                <div>
                  <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">Admin Note</dt>
                  <dd className="m-0 mt-1 text-[0.82rem] text-white">{deposit.admin_note}</dd>
                </div>
              )}

              {deposit.rejection_reason != null && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/8 p-3">
                  <p className="m-0 text-[0.72rem] uppercase tracking-widest text-red-400 mb-1">{t('deposit.rejectionReason')}</p>
                  <p className="m-0 text-[0.82rem] text-red-300">{deposit.rejection_reason}</p>
                </div>
              )}

              <div className="flex justify-between">
                <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">{t('deposit.submittedAt')}</dt>
                <dd className="m-0 text-[0.78rem] text-[#8a9bb3]">{formatDate(deposit.created_at)}</dd>
              </div>

              {deposit.reviewed_at != null && (
                <div className="flex justify-between">
                  <dt className="text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">{t('deposit.reviewedAt')}</dt>
                  <dd className="m-0 text-[0.78rem] text-[#8a9bb3]">{formatDate(deposit.reviewed_at)}</dd>
                </div>
              )}
            </dl>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/8">
              {deposit.proof_of_payment.exists && (
                <button type="button" className={apiButton} onClick={() => void onDownload()}>
                  <span className="material-symbols-outlined text-[1rem]">download</span>
                  {t('deposit.downloadProof')}
                </button>
              )}

              {deposit.status === 'PENDING' && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-[0.8rem] border border-red-500/35 bg-red-500/10 px-3 py-2 text-[0.9rem] font-semibold text-red-400 hover:bg-red-500/16"
                  onClick={() => setShowConfirm(true)}
                >
                  <span className="material-symbols-outlined text-[1rem]">cancel</span>
                  {t('deposit.cancelDeposit')}
                </button>
              )}
            </div>
          </section>
        )}

        <Link className={apiButton} to="/gambling/deposit-history">
          ← Back to Deposit History
        </Link>

        {/* Confirm dialog */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowConfirm(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-[22rem] bg-[#19202d] rounded-2xl border border-white/10 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="m-0 text-[1rem] font-bold text-white">{t('deposit.cancelConfirmTitle')}</h3>
              <p className="m-0 text-[0.86rem] text-[#8a9bb3]">{t('deposit.cancelConfirmBody')}</p>
              <div className="flex gap-2">
                <button type="button" className="flex-1 h-11 rounded-xl border border-white/12 text-[0.82rem] text-white/60 hover:text-white transition-colors" onClick={() => setShowConfirm(false)}>
                  {t('deposit.cancelConfirmCancel', 'Keep')}
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  className="flex-1 h-11 rounded-xl border border-red-500/35 bg-red-500/10 text-[0.82rem] font-semibold text-red-400 hover:bg-red-500/16 transition-colors disabled:opacity-60"
                  onClick={() => void onCancel()}
                >
                  {cancelling ? '...' : t('deposit.cancelConfirmYes')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
