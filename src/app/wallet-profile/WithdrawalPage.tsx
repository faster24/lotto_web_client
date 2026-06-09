import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useWithdrawalForm } from '@/components/withdrawal/useWithdrawalForm'
import { useWallet } from '@/contexts/WalletContext'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function WithdrawalPage() {
  const { t } = useTranslation()
  const { wallet } = useWallet()
  const {
    amount, setAmount, isSubmitting, message, onSubmit,
    isValidAmount, isInsufficient, balanceAfter, hasBankInfo,
  } = useWithdrawalForm()

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="wallet-profile-withdrawal-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('withdrawal.eyebrow')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          {t('withdrawal.title')}
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{t('withdrawal.desc')}</p>
      </header>

      <main className={screenScroll}>
        {/* Bank info display */}
        {hasBankInfo && wallet != null ? (
          <div className="rounded-xl border border-white/10 bg-white/4 p-4 space-y-2">
            <p className="m-0 text-[0.72rem] uppercase tracking-widest text-[#8a9bb3]">{t('withdrawal.bankDestination')}</p>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00e676] text-[1.1rem]">account_balance</span>
              <div>
                <p className="m-0 text-[0.88rem] font-semibold text-white">{wallet.bank_name}</p>
                <p className="m-0 text-[0.75rem] text-[#8a9bb3]">{wallet.account_name} · {wallet.account_number}</p>
              </div>
            </div>
            <p className="m-0 text-[0.72rem] text-[#8a9bb3]">Funds will be sent to your registered bank account.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-400 text-[1.1rem] shrink-0 mt-0.5">warning</span>
            <div>
              <p className="m-0 text-[0.82rem] text-amber-200">{t('withdrawal.noBankInfo')}</p>
              <Link to="/user/bank-info" className="text-[0.78rem] text-[#93c5fd] hover:text-[#60a5fa] transition-colors">
                {t('withdrawal.noBankInfoCta')}
              </Link>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void onSubmit() }}>
          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]" htmlFor="withdrawal-amount">
              {t('withdrawal.amountLabel', { currency: wallet?.currency ?? 'MMK' })}
            </label>
            <input
              id="withdrawal-amount"
              className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
              inputMode="numeric"
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value.replace(/\D/g, ''))}
              required
            />
            {wallet != null && (
              <p className="m-0 text-[0.72rem] text-[#8a9bb3]">
                Available: {wallet.balance.toLocaleString()} {wallet.currency}
              </p>
            )}
            {isValidAmount && wallet != null && !isInsufficient && balanceAfter != null && (
              <p className="m-0 text-[0.72rem] text-[#00e676]">
                After withdrawal: {balanceAfter.toLocaleString()} {wallet.currency}
              </p>
            )}
            {isInsufficient && (
              <p className="m-0 text-[0.72rem] text-red-400">
                Exceeds available balance ({wallet?.balance.toLocaleString()} {wallet?.currency})
              </p>
            )}
          </div>

          {message != null && (
            <p className="m-0 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-[0.82rem] text-red-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isInsufficient || !hasBankInfo}
            className="h-14 w-full bg-gradient-to-r from-[#00e676] to-[#2ac48b] rounded-2xl flex items-center justify-center shadow-[0_12px_24px_rgba(0,230,118,0.3)] active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin text-[#003824]" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a9 9 0 1 1-9 9" strokeLinecap="round" />
              </svg>
            ) : (
              <span className="font-semibold text-[0.95rem] text-[#003824] uppercase tracking-wide">
                {isSubmitting ? t('withdrawal.submitting') : t('withdrawal.submitWithdrawal')}
              </span>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
