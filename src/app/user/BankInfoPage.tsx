import { type FormEvent, useEffect, useState } from 'react'
import { clearMyBankInfo, createMyBankInfo, getMyBankInfo, updateMyBankInfo } from '@/api/client'
import type { WalletBankInfo } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const emptyForm: WalletBankInfo = {
  bank_name: 'KBZ',
  account_name: '',
  account_number: '',
}

export function BankInfoPage() {
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
        setError('Unable to load bank info.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    try {
      const fn = bankInfo == null ? createMyBankInfo : updateMyBankInfo
      const response = await fn(form)
      setBankInfo(response.data.bank_info)
      setMessage(response.message)
    } catch {
      setMessage('Request failed. Please try again.')
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
      setMessage('Clear action failed.')
    }
  }

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="bank-info-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Wallet</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Bank Info</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Create, update, or clear `/me/bank-info`.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={false} emptyMessage="" />

        {!loading && error == null && (
          <section className={apiCard}>
            <h2 className="m-0 mb-2 text-[1.12rem]">Bank account</h2>
            <form className="grid gap-2.5" onSubmit={(event) => void onSubmit(event)}>
              <label>
                Bank
                <select
                  className="w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-2.5 py-2 text-[#f7f9ff]"
                  value={form.bank_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, bank_name: event.currentTarget.value as WalletBankInfo['bank_name'] }))}
                >
                  {['KBZ', 'AYA', 'CB', 'UAB', 'YOMA', 'OTHER'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Account name
                <input
                  className="w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-2.5 py-2 text-[#f7f9ff]"
                  value={form.account_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, account_name: event.currentTarget.value }))}
                  required
                />
              </label>
              <label>
                Account number
                <input
                  className="w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-2.5 py-2 text-[#f7f9ff]"
                  value={form.account_number}
                  onChange={(event) => setForm((prev) => ({ ...prev, account_number: event.currentTarget.value }))}
                  required
                />
              </label>
              <div className="grid gap-2">
                <button type="submit" className={apiButton}>
                  {bankInfo == null ? 'Create Bank Info' : 'Update Bank Info'}
                </button>
                <button type="button" className={apiButton} onClick={() => void onClear()}>
                  Clear Bank Info
                </button>
              </div>
            </form>
            {message != null && <p className="mt-2 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{message}</p>}
          </section>
        )}
      </main>
    </div>
  )
}
