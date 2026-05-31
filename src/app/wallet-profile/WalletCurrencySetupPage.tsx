import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { setWalletCurrency } from '@/api/client'
import type { WalletCurrency } from '@/api/types'
import { useWallet } from '@/contexts/WalletContext'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const CURRENCY_OPTIONS: { code: WalletCurrency; name: string; flagClass: string }[] = [
  { code: 'MMK', name: 'Myanmar Kyat', flagClass: 'fi-mm' },
  { code: 'THB', name: 'Thai Baht', flagClass: 'fi-th' },
]

export function WalletCurrencySetupPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshWallet } = useWallet()
  const [selected, setSelected] = useState<WalletCurrency | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from ?? '/tabs/home'

  const onConfirm = async () => {
    if (selected == null) return
    setError(null)
    setIsSubmitting(true)
    try {
      await setWalletCurrency({ currency: selected })
      refreshWallet()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('wallet.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="wallet-currency-setup-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('wallet.currencySetupEyebrow')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          {t('wallet.currencySetupTitle')}
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{t('wallet.currencySetupDesc')}</p>
      </header>

      <main className={screenScroll}>
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#fcd34d] text-[1.1rem] shrink-0 mt-0.5">warning</span>
          <p className="m-0 text-[0.82rem] text-[#fef3c7] leading-relaxed">{t('wallet.currencySetupWarning')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {CURRENCY_OPTIONS.map((option) => {
            const isActive = selected === option.code
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setSelected(option.code)}
                className={`w-full flex items-center gap-4 rounded-xl border p-4 transition-all active:scale-[0.98] ${
                  isActive
                    ? 'border-[#00e676]/40 bg-[#00e676]/10 text-[#00e676]'
                    : 'border-white/10 bg-white/4 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className={`fi ${option.flagClass} h-7 w-10 overflow-hidden rounded border border-white/10`} />
                <div className="flex-1 text-left">
                  <p className="m-0 text-sm font-bold">{option.code}</p>
                  <p className="m-0 text-[0.72rem] opacity-60">{option.name}</p>
                </div>
                {isActive && <span className="material-symbols-outlined text-[1.2rem]">check_circle</span>}
              </button>
            )
          })}
        </div>

        {error != null && (
          <p className="m-0 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-[0.82rem] text-red-400">{error}</p>
        )}

        <button
          type="button"
          disabled={selected == null || isSubmitting}
          onClick={() => void onConfirm()}
          className="h-14 w-full bg-gradient-to-r from-[#00e676] to-[#2ac48b] rounded-2xl flex items-center justify-center shadow-[0_12px_24px_rgba(0,230,118,0.3)] active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin text-[#003824]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3a9 9 0 1 1-9 9" strokeLinecap="round" />
            </svg>
          ) : (
            <span className="font-semibold text-[0.95rem] text-[#003824] uppercase tracking-wide">
              {isSubmitting ? t('wallet.confirming') : t('wallet.confirmCurrency')}
            </span>
          )}
        </button>
      </main>
    </div>
  )
}
