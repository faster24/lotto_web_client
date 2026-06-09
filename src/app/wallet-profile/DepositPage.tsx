import { useTranslation } from 'react-i18next'
import { useDepositForm } from '@/components/deposit/useDepositForm'
import { useWallet } from '@/contexts/WalletContext'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function DepositPage() {
  const { t } = useTranslation()
  const { wallet } = useWallet()
  const { form, setForm, isSubmitting, message, onSubmit, proofPreviewUrl, fileInputRef, onFileChange, selectedBank, bankSettingsLoading } = useDepositForm()

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="wallet-profile-deposit-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('deposit.eyebrow')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          {t('deposit.title')}
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{t('deposit.desc')}</p>
      </header>

      <main className={screenScroll}>
        {wallet != null && (
          <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00e676] text-[1.1rem]">account_balance_wallet</span>
            <p className="m-0 text-[0.82rem] text-[#8a9bb3]">
              Transfers must be in <strong className="text-white">{wallet.currency}</strong>.
              Transfer to our account, then upload your payment proof.
            </p>
          </div>
        )}

        {bankSettingsLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-[0.82rem] text-[#8a9bb3]">
            Loading bank account info…
          </div>
        ) : selectedBank != null ? (
          <div className="rounded-xl border border-[#00e676]/20 bg-[#00e676]/5 px-4 py-3 space-y-1">
            <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#00e676]">Transfer To</p>
            <p className="m-0 text-[0.9rem] font-semibold text-white">{selectedBank.bank_name}</p>
            <p className="m-0 text-[0.82rem] text-[#8a9bb3]">{selectedBank.account_holder_name}</p>
            <p className="m-0 text-[0.82rem] font-mono text-white">{selectedBank.account_number}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-[0.82rem] text-red-400">
            No active bank account available. Please contact support.
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); void onSubmit() }}
        >
          {/* Amount */}
          <label className="block space-y-1.5">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">
              {t('deposit.amountLabel', { currency: wallet?.currency ?? 'MMK' })}
            </span>
            <input
              className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
              inputMode="numeric"
              placeholder="e.g. 50000"
              value={form.claimed_amount}
              onChange={(e) => { const v = e.currentTarget.value.replace(/\D/g, ''); setForm((prev) => ({ ...prev, claimed_amount: v })) }}
              required
            />
            {wallet != null && (
              <p className="m-0 text-[0.72rem] text-[#8a9bb3]">
                Current balance: {wallet.balance.toLocaleString()} {wallet.currency}
              </p>
            )}
          </label>

          {/* Transfer note */}
          <label className="block space-y-1.5">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">
              {t('deposit.transferNote')} <span className="normal-case font-normal opacity-60">(optional)</span>
            </span>
            <input
              className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
              placeholder={t('deposit.transferNotePlaceholder')}
              value={form.transfer_note}
              onChange={(e) => { const v = e.currentTarget.value; setForm((prev) => ({ ...prev, transfer_note: v })) }}
            />
          </label>

          {/* Proof upload */}
          <div className="space-y-1.5">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">
              {t('deposit.proofOfPayment')}
            </span>
            <label
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-white/3 p-6 cursor-pointer hover:border-[#00e676]/30 hover:bg-[#00e676]/5 transition-all"
              htmlFor="deposit-proof-image"
            >
              {proofPreviewUrl != null ? (
                <img src={proofPreviewUrl} alt="Proof preview" className="max-h-32 rounded-lg object-contain" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-white/30 text-[2.5rem]">cloud_upload</span>
                  <p className="m-0 text-[0.82rem] text-[#8a9bb3] text-center">{t('deposit.proofHint')}</p>
                </>
              )}
              {form.proof_image != null && (
                <p className="m-0 text-[0.72rem] text-[#93c5fd]">{form.proof_image.name}</p>
              )}
            </label>
            <input
              ref={fileInputRef}
              id="deposit-proof-image"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="sr-only"
              onChange={(e) => onFileChange(e.currentTarget.files?.[0] ?? null)}
              required
            />
          </div>

          {message != null && (
            <p className="m-0 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-[0.82rem] text-red-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full bg-gradient-to-r from-[#00e676] to-[#2ac48b] rounded-2xl flex items-center justify-center shadow-[0_12px_24px_rgba(0,230,118,0.3)] active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin text-[#003824]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a9 9 0 1 1-9 9" strokeLinecap="round" />
              </svg>
            ) : (
              <span className="font-semibold text-[0.95rem] text-[#003824] uppercase tracking-wide">
                {t('deposit.submitDeposit')}
              </span>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
