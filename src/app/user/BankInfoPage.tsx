import { type FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clearMyBankInfo, createMyBankInfo, getMyBankInfo, updateMyBankInfo } from '@/api/client'
import type { WalletBankInfo } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const emptyForm: WalletBankInfo = {
  bank_name: 'KBZ',
  account_name: '',
  account_number: '',
}

export function BankInfoPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bankInfo, setBankInfo] = useState<WalletBankInfo | null>(null)
  const [form, setForm] = useState<WalletBankInfo>(emptyForm)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const response = await getMyBankInfo()
        setBankInfo(response.data.bank_info)
        setForm(response.data.bank_info ?? emptyForm)
      } catch {
        setError(t('wallet.loadError'))
      } finally {
        setLoading(false)
      }
    })()
  }, [t])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    try {
      const fn = bankInfo == null ? createMyBankInfo : updateMyBankInfo
      const response = await fn(form)
      setBankInfo(response.data.bank_info)
      setMessage(response.message)
    } catch {
      setMessage(t('wallet.submitError'))
    }
  }

  const onClear = async () => {
    setMessage(null)

    try {
      const response = await clearMyBankInfo()
      setBankInfo(null)
      setForm(emptyForm)
      setMessage(response.message)
    } catch {
      setMessage(t('wallet.clearError'))
    }
  }

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="bank-info-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('wallet.walletEyebrow')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{t('wallet.bankInfoTitle')}</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{t('wallet.bankInfoDesc')}</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={false} emptyMessage="" />

        {!loading && error == null && (
          <section className={apiCard}>
            {/* Section heading */}
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[1.2rem] text-[#93c5fd]">account_balance</span>
              <h2 className="m-0 text-[1.05rem] font-semibold text-[#e2e8f0]">{t('wallet.bankAccount')}</h2>
              {bankInfo != null && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-[#00e676]/25 bg-[#00e676]/10 px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wider text-[#00e676]">
                  <span className="material-symbols-outlined text-[0.75rem] leading-none">check_circle</span>
                  Saved
                </span>
              )}
            </div>

            <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)}>
              {/* Bank selector */}
              <div className="grid gap-1.5">
                <span className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#4a5d7a]">{t('wallet.bank')}</span>
                <select
                  className="w-full rounded-xl border border-white/10 bg-[rgb(5_10_31_/_68%)] px-3 py-2.5 text-[0.9rem] text-[#f7f9ff] outline-none focus:border-[rgb(59_130_246_/_50%)] focus:ring-1 focus:ring-[rgb(59_130_246_/_25%)] transition-colors"
                  value={form.bank_name}
                  onChange={(event) => { const v = event.currentTarget.value as WalletBankInfo['bank_name']; setForm((prev) => ({ ...prev, bank_name: v })) }}
                >
                  {['KBZ', 'AYA', 'CB', 'UAB', 'YOMA', 'OTHER'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              {/* Account name */}
              <div className="grid gap-1.5">
                <span className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#4a5d7a]">{t('wallet.accountName')}</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-[rgb(5_10_31_/_68%)] px-3 py-2.5 text-[0.9rem] text-[#f7f9ff] placeholder:text-[#3a4d66] outline-none focus:border-[rgb(59_130_246_/_50%)] focus:ring-1 focus:ring-[rgb(59_130_246_/_25%)] transition-colors"
                  value={form.account_name}
                  placeholder="e.g. Aung Ko Ko"
                  onChange={(event) => { const v = event.currentTarget.value; setForm((prev) => ({ ...prev, account_name: v })) }}
                  required
                />
              </div>

              {/* Account number */}
              <div className="grid gap-1.5">
                <span className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#4a5d7a]">{t('wallet.accountNumber')}</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-[rgb(5_10_31_/_68%)] px-3 py-2.5 text-[0.9rem] text-[#f7f9ff] placeholder:text-[#3a4d66] outline-none focus:border-[rgb(59_130_246_/_50%)] focus:ring-1 focus:ring-[rgb(59_130_246_/_25%)] transition-colors"
                  value={form.account_number}
                  placeholder="e.g. 09123456789"
                  onChange={(event) => { const v = event.currentTarget.value; setForm((prev) => ({ ...prev, account_number: v })) }}
                  required
                />
              </div>

              {/* Feedback message */}
              {message != null && (
                <p className="m-0 rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-[0.82rem] leading-[1.5] text-[#93c5fd]">
                  {message}
                </p>
              )}

              {/* Buttons */}
              <div className="grid gap-2.5 pt-1">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,rgb(59_130_246),rgb(99_102_241))] px-4 py-3 text-[0.95rem] font-semibold text-white shadow-[0_2px_14px_rgb(59_130_246_/_30%)] transition-all hover:brightness-110 hover:shadow-[0_4px_20px_rgb(59_130_246_/_45%)] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[1.05rem] leading-none">
                    {bankInfo == null ? 'add_circle' : 'save'}
                  </span>
                  {bankInfo == null ? t('wallet.createBankInfo') : t('wallet.updateBankInfo')}
                </button>

                {bankInfo != null && (
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgb(239_68_68_/_30%)] bg-[rgb(239_68_68_/_7%)] px-4 py-3 text-[0.95rem] font-semibold text-[#fca5a5] transition-colors hover:border-[rgb(239_68_68_/_50%)] hover:bg-[rgb(239_68_68_/_13%)] active:scale-[0.98]"
                    onClick={() => void onClear()}
                  >
                    <span className="material-symbols-outlined text-[1.05rem] leading-none">delete</span>
                    {t('wallet.clearBankInfo')}
                  </button>
                )}
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}
