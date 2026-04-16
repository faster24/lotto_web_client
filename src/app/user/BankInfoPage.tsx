import { type FormEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createMyBankInfo, getMyBankInfo, updateMyBankInfo } from '@/api/client'
import type { WalletBankInfo } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const BANKS: { code: WalletBankInfo['bank_name']; label: string; group: string }[] = [
  { code: 'KBZ', label: 'Kanbawza Bank', group: 'Myanmar' },
  { code: 'AYA', label: 'AYA Bank', group: 'Myanmar' },
  { code: 'CB', label: 'CB Bank', group: 'Myanmar' },
  { code: 'UAB', label: 'United Amara Bank', group: 'Myanmar' },
  { code: 'YOMA', label: 'Yoma Bank', group: 'Myanmar' },
  { code: 'SCB', label: 'Siam Commercial Bank', group: 'Thailand' },
  { code: 'KBANK', label: 'Kasikorn Bank', group: 'Thailand' },
  { code: 'BBL', label: 'Bangkok Bank', group: 'Thailand' },
  { code: 'KTB', label: 'Krungthai Bank', group: 'Thailand' },
  { code: 'BAY', label: 'Bank of Ayudhya (Krungsri)', group: 'Thailand' },
  { code: 'TTB', label: 'TMBThanachart Bank', group: 'Thailand' },
  { code: 'GSB', label: 'Government Savings Bank', group: 'Thailand' },
]

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
  const [showConfirm, setShowConfirm] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const [showBankList, setShowBankList] = useState(false)
  const bankComboRef = useRef<HTMLDivElement>(null)

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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (bankInfo != null) {
      setShowConfirm(true)
    } else {
      void doSubmit()
    }
  }

  const doSubmit = async () => {
    setShowConfirm(false)
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
              <div className="grid gap-1.5" ref={bankComboRef}>
                <span className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#4a5d7a]">{t('wallet.bank')}</span>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-[rgb(5_10_31_/_68%)] px-3 py-2.5 text-[0.9rem] text-[#f7f9ff] placeholder:text-[#3a4d66] outline-none focus:border-[rgb(59_130_246_/_50%)] focus:ring-1 focus:ring-[rgb(59_130_246_/_25%)] transition-colors"
                    value={showBankList ? bankSearch : `${form.bank_name} — ${BANKS.find(b => b.code === form.bank_name)?.label ?? ''}`}
                    placeholder="Search bank..."
                    onFocus={() => { setShowBankList(true); setBankSearch('') }}
                    onChange={(e) => { setBankSearch(e.currentTarget.value) }}
                    readOnly={!showBankList}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[1rem] text-[#4a5d7a]">
                    {showBankList ? 'expand_less' : 'expand_more'}
                  </span>
                  {showBankList && (() => {
                    const q = bankSearch.toLowerCase()
                    const filtered = BANKS.filter(b => b.code.toLowerCase().includes(q) || b.label.toLowerCase().includes(q))
                    const groups = ['Myanmar', 'Thailand']
                    return (
                      <div className="absolute z-20 mt-1 w-full rounded-xl border border-white/10 bg-[rgb(8_14_40)] shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                        {groups.map(group => {
                          const items = filtered.filter(b => b.group === group)
                          if (items.length === 0) return null
                          return (
                            <div key={group}>
                              <div className="px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-[#4a5d7a] bg-white/3">{group}</div>
                              {items.map(b => (
                                <button
                                  key={b.code}
                                  type="button"
                                  className={`w-full text-left px-3 py-2.5 text-[0.88rem] flex items-center gap-2.5 transition-colors hover:bg-white/6 ${form.bank_name === b.code ? 'bg-[rgb(59_130_246_/_12%)] text-[#93c5fd]' : 'text-[#e2e8f0]'}`}
                                  onClick={() => { setForm(prev => ({ ...prev, bank_name: b.code })); setShowBankList(false); setBankSearch('') }}
                                >
                                  <span className="font-bold w-14 shrink-0">{b.code}</span>
                                  <span className="text-[#8a9bb3] text-[0.82rem]">{b.label}</span>
                                  {form.bank_name === b.code && <span className="ml-auto material-symbols-outlined text-[0.9rem] text-[#93c5fd]">check</span>}
                                </button>
                              ))}
                            </div>
                          )
                        })}
                        {filtered.length === 0 && (
                          <div className="px-3 py-4 text-center text-[0.84rem] text-[#4a5d7a]">No banks found</div>
                        )}
                      </div>
                    )
                  })()}
                </div>
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

              </div>
            </form>
          </section>
        )}
      </main>

      {/* Update confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[rgb(8_14_40)] p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[1.3rem] text-[#f59e0b]">warning</span>
              <h3 className="m-0 text-[1rem] font-semibold text-[#e2e8f0]">{t('wallet.updateConfirmTitle')}</h3>
            </div>
            <p className="m-0 mb-5 text-[0.84rem] leading-[1.55] text-[#8a9bb3]">{t('wallet.updateConfirmBody')}</p>
            <div className="grid gap-2.5">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,rgb(59_130_246),rgb(99_102_241))] px-4 py-3 text-[0.95rem] font-semibold text-white shadow-[0_2px_14px_rgb(59_130_246_/_30%)] transition-all hover:brightness-110 active:scale-[0.98]"
                onClick={() => void doSubmit()}
              >
                <span className="material-symbols-outlined text-[1.05rem] leading-none">save</span>
                {t('wallet.updateConfirmYes')}
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-[0.95rem] font-semibold text-[#8a9bb3] transition-colors hover:bg-white/8 active:scale-[0.98]"
                onClick={() => { setShowConfirm(false) }}
              >
                {t('wallet.updateConfirmCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
