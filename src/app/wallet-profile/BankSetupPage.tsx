import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createMyBankInfo, setWalletCurrency } from '@/api/client'
import type { WalletBankInfo, WalletCurrency } from '@/api/types'
import { BANKS, banksByCurrency } from '@/constants/banks'
import { useWallet } from '@/contexts/WalletContext'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[rgb(5_10_31_/_68%)] px-3 py-2.5 text-[0.9rem] text-[#f7f9ff] placeholder:text-[#3a4d66] outline-none focus:border-[rgb(59_130_246_/_50%)] focus:ring-1 focus:ring-[rgb(59_130_246_/_25%)] transition-colors'

const labelClass = 'text-[0.75rem] font-semibold uppercase tracking-widest text-[#4a5d7a]'

export function BankSetupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { wallet, walletLoading, refreshWallet } = useWallet()

  const from = (location.state as { from?: string } | null)?.from ?? '/tabs/home'

  const existingCurrency = wallet?.currency as WalletCurrency | null | undefined
  const currencyLocked = existingCurrency != null

  const [currency, setCurrency] = useState<WalletCurrency>(existingCurrency ?? 'MMK')
  const [bankName, setBankName] = useState<WalletBankInfo['bank_name']>('KBZ')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [bankSearch, setBankSearch] = useState('')
  const [showBankList, setShowBankList] = useState(false)
  const bankComboRef = useRef<HTMLDivElement>(null)

  // Sync currency if wallet loads after mount (existing users)
  useEffect(() => {
    if (existingCurrency != null) {
      setCurrency(existingCurrency)
    }
  }, [existingCurrency])

  // Reset bank selection when currency changes
  useEffect(() => {
    const first = banksByCurrency(currency)[0]
    if (first != null) setBankName(first.code)
  }, [currency])

  // Close bank dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bankComboRef.current && !bankComboRef.current.contains(e.target as Node)) {
        setShowBankList(false)
        setBankSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => { document.removeEventListener('mousedown', handler) }
  }, [])

  const filteredBanks = banksByCurrency(currency).filter((b) => {
    const q = bankSearch.toLowerCase()
    return q === '' || b.code.toLowerCase().includes(q) || b.label.toLowerCase().includes(q)
  })

  const selectedBankLabel = BANKS.find((b) => b.code === bankName)?.label ?? ''

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      if (!currencyLocked) {
        await setWalletCurrency({ currency })
      }
      await createMyBankInfo({ bank_name: bankName, account_name: accountName.trim(), account_number: accountNumber.trim() })
      refreshWallet()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (walletLoading) {
    return (
      <div className={`${screenRoot} ${apiScreen}`}>
        <div className="flex h-full items-center justify-center">
          <p className="text-[0.86rem] text-[#93c5fd]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="bank-setup-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Account Setup</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          Bank Setup
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
          Link your bank account to enable withdrawals.
        </p>
      </header>

      <main className={screenScroll}>
        {/* Warning banner */}
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#fcd34d] text-[1.1rem] shrink-0 mt-0.5">warning</span>
          <p className="m-0 text-[0.82rem] text-[#fef3c7] leading-relaxed">
            Your currency cannot be changed after setup. Choose the currency you use for all deposits and bets.
          </p>
        </div>

        <form className="grid gap-5" onSubmit={(e) => void onSubmit(e)}>
          {/* Currency selector */}
          <div className="grid gap-2">
            <span className={labelClass}>Currency</span>
            {currencyLocked ? (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3">
                <span className="material-symbols-outlined text-[1rem] text-[#00e676]">lock</span>
                <div>
                  <p className="m-0 text-[0.88rem] font-bold text-white">{currency}</p>
                  <p className="m-0 text-[0.7rem] text-[#8a9bb3]">
                    {currency === 'MMK' ? 'Myanmar Kyat' : 'Thai Baht'} — cannot be changed
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {(['MMK', 'THB'] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3.5 transition-all active:scale-[0.98] ${
                      currency === code
                        ? 'border-[#00e676]/40 bg-[#00e676]/10'
                        : 'border-white/10 bg-white/4 hover:border-white/20'
                    }`}
                  >
                    <span className={`text-[0.88rem] font-bold ${currency === code ? 'text-[#00e676]' : 'text-white'}`}>
                      {code}
                    </span>
                    <span className="text-[0.7rem] text-[#8a9bb3]">
                      {code === 'MMK' ? 'Myanmar Kyat' : 'Thai Baht'}
                    </span>
                    {currency === code && (
                      <span className="material-symbols-outlined text-[0.9rem] text-[#00e676] self-end">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bank name — searchable combobox filtered by currency */}
          <div className="grid gap-2" ref={bankComboRef}>
            <span className={labelClass}>Bank Name</span>
            <div className="relative">
              <input
                className={inputClass}
                value={showBankList ? bankSearch : `${bankName} — ${selectedBankLabel}`}
                placeholder="Search bank..."
                onFocus={() => { setShowBankList(true); setBankSearch('') }}
                onChange={(e) => setBankSearch(e.currentTarget.value)}
                readOnly={!showBankList}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[1rem] text-[#4a5d7a]">
                {showBankList ? 'expand_less' : 'expand_more'}
              </span>
              {showBankList && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-white/10 bg-[rgb(8_14_40)] shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                  {filteredBanks.length > 0 ? filteredBanks.map((b) => (
                    <button
                      key={b.code}
                      type="button"
                      className={`w-full text-left px-3 py-2.5 text-[0.88rem] flex items-center gap-2.5 transition-colors hover:bg-white/6 ${
                        bankName === b.code ? 'bg-[rgb(59_130_246_/_12%)] text-[#93c5fd]' : 'text-[#e2e8f0]'
                      }`}
                      onClick={() => { setBankName(b.code); setShowBankList(false); setBankSearch('') }}
                    >
                      <span className="font-bold w-14 shrink-0">{b.code}</span>
                      <span className="text-[#8a9bb3] text-[0.82rem]">{b.label}</span>
                      {bankName === b.code && (
                        <span className="ml-auto material-symbols-outlined text-[0.9rem] text-[#93c5fd]">check</span>
                      )}
                    </button>
                  )) : (
                    <div className="px-3 py-4 text-center text-[0.84rem] text-[#4a5d7a]">No banks found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account name */}
          <div className="grid gap-2">
            <label htmlFor="bank-setup-account-name" className={labelClass}>Account Name</label>
            <input
              id="bank-setup-account-name"
              className={inputClass}
              placeholder="e.g. Aung Ko Ko"
              value={accountName}
              onChange={(e) => setAccountName(e.currentTarget.value)}
              required
            />
          </div>

          {/* Account number */}
          <div className="grid gap-2">
            <label htmlFor="bank-setup-account-number" className={labelClass}>Account Number</label>
            <input
              id="bank-setup-account-number"
              className={inputClass}
              placeholder="e.g. 09123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.currentTarget.value)}
              required
            />
          </div>

          {error != null && (
            <p className="m-0 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-[0.82rem] text-red-400">
              {error}
            </p>
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
                Confirm & Enter
              </span>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
