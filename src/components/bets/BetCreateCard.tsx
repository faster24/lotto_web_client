import type { RefObject } from 'react'
import { Link } from 'react-router-dom'
import type { BetCreateInput, WalletBankInfo } from '@/api/types'
import { apiButton } from '@/styles/tw'
import {
    CURRENCY_OPTIONS,
    TARGET_OPEN_TIME_OPTIONS,
    createEmptyRow,
    formatAmount,
    type BetCreateFormState,
    type BetNumberRow,
    type BetRowError,
    type AdminPaymentAccount,
    type CurrencyOption,
} from './useBetsForm'

// ── CurrencyFlag ─────────────────────────────────────────────────────────────

function CurrencyFlag({ code }: { code: BetCreateInput['currency'] }) {
    const option = CURRENCY_OPTIONS.find((item) => item.code === code) ?? CURRENCY_OPTIONS[0]!
    return <span aria-hidden="true" className={`fi ${option.flagClass} h-[14px] w-5 overflow-hidden rounded-[3px] border border-white/10`} />
}

// ── StepIndicator ────────────────────────────────────────────────────────────

type StepIndicatorProps = {
    currentStep: 1 | 2 | 3
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { id: 1 as const, label: 'Setup' },
        { id: 2 as const, label: 'Numbers' },
        { id: 3 as const, label: 'Pay Slip' },
    ]

    return (
        <div className="mb-3 flex bg-[rgb(4_10_31_/_60%)] rounded-xl p-1.5 gap-1 border border-white/5" aria-label="Bet create steps">
            {steps.map((step) => {
                const isActive = currentStep === step.id
                const isDone = currentStep > step.id
                return (
                    <div
                        key={step.id}
                        className={`flex-1 py-2.5 rounded-lg text-center text-[0.72rem] font-bold uppercase tracking-wider transition-colors ${
                            isDone
                                ? 'bg-[rgb(0_230_118_/_12%)] text-[#00e676]'
                                : isActive
                                ? 'bg-[rgb(23_29_48)] text-[#f7f9ff] shadow-sm'
                                : 'text-[#8a9bb3] hover:bg-white/5'
                        }`}
                    >
                        {step.label}
                    </div>
                )
            })}
        </div>
    )
}

// ── StepSetup (Step 1) ───────────────────────────────────────────────────────

type StepSetupProps = {
    form: BetCreateFormState
    setForm: React.Dispatch<React.SetStateAction<BetCreateFormState>>
    isCurrencyOpen: boolean
    setIsCurrencyOpen: React.Dispatch<React.SetStateAction<boolean>>
    highlightedCurrencyIndex: number
    setHighlightedCurrencyIndex: React.Dispatch<React.SetStateAction<number>>
    selectedCurrency: CurrencyOption
    currencySelectRef: RefObject<HTMLDivElement | null>
    currencyButtonRef: RefObject<HTMLButtonElement | null>
    selectCurrency: (code: BetCreateInput['currency']) => void
    canCreateForActiveType: boolean
    goToStepTwo: () => void
}

function StepSetup({
    form,
    setForm,
    isCurrencyOpen,
    setIsCurrencyOpen,
    highlightedCurrencyIndex,
    setHighlightedCurrencyIndex,
    selectedCurrency,
    currencySelectRef,
    currencyButtonRef,
    selectCurrency,
    canCreateForActiveType,
    goToStepTwo,
}: StepSetupProps) {
    return (
        <>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="block space-y-1.5" ref={currencySelectRef}>
                    <span className="block text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">Currency</span>
                    <button
                        ref={currencyButtonRef}
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={isCurrencyOpen}
                        aria-controls="currency-options"
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] transition-colors focus:border-[rgb(59_130_246_/_60%)] focus:outline-none"
                        onClick={() => setIsCurrencyOpen((prev) => !prev)}
                        onKeyDown={(event) => {
                            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                setIsCurrencyOpen(true)
                            }
                        }}
                    >
                        <span className="flex items-center gap-2">
                            <CurrencyFlag code={selectedCurrency.code} />
                            <span className="text-[0.86rem] font-semibold text-[#e2e8f0]">{selectedCurrency.code}</span>
                        </span>
                        <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-4 w-4 text-[#8a9bb3] transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {isCurrencyOpen && (
                        <ul
                            id="currency-options"
                            role="listbox"
                            aria-label="Currency options"
                            aria-activedescendant={`currency-option-${CURRENCY_OPTIONS[highlightedCurrencyIndex]?.code ?? selectedCurrency.code}`}
                            className="mt-1.5 max-h-44 overflow-y-auto rounded-xl border border-white/12 bg-[rgb(5_10_31_/_96%)] p-1"
                            onKeyDown={(event) => {
                                if (event.key === 'ArrowDown') {
                                    event.preventDefault()
                                    setHighlightedCurrencyIndex((prev) => Math.min(prev + 1, CURRENCY_OPTIONS.length - 1))
                                    return
                                }
                                if (event.key === 'ArrowUp') {
                                    event.preventDefault()
                                    setHighlightedCurrencyIndex((prev) => Math.max(prev - 1, 0))
                                    return
                                }
                                if (event.key === 'Home') {
                                    event.preventDefault()
                                    setHighlightedCurrencyIndex(0)
                                    return
                                }
                                if (event.key === 'End') {
                                    event.preventDefault()
                                    setHighlightedCurrencyIndex(CURRENCY_OPTIONS.length - 1)
                                    return
                                }
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    const active = CURRENCY_OPTIONS[highlightedCurrencyIndex]
                                    if (active != null) selectCurrency(active.code)
                                    return
                                }
                                if (event.key === 'Escape') {
                                    event.preventDefault()
                                    setIsCurrencyOpen(false)
                                    currencyButtonRef.current?.focus()
                                }
                            }}
                        >
                            {CURRENCY_OPTIONS.map((option, index) => {
                                const isSelected = form.currency === option.code
                                const isHighlighted = index === highlightedCurrencyIndex
                                return (
                                    <li key={option.code}>
                                        <button
                                            id={`currency-option-${option.code}`}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors ${isHighlighted ? 'bg-[rgb(59_130_246_/_20%)] text-[#f7f9ff]' : 'text-[#cbd5e1] hover:bg-white/7'}`}
                                            onMouseEnter={() => setHighlightedCurrencyIndex(index)}
                                            onClick={() => selectCurrency(option.code)}
                                        >
                                            <span className="flex items-center gap-2">
                                                <CurrencyFlag code={option.code} />
                                                <span className="text-[0.84rem] font-medium">{option.code}</span>
                                            </span>
                                            {isSelected && (
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-[#86efac]" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="m5 12 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                <label className="block space-y-1.5">
                    <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">Target Open Time</span>
                    <select
                        className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] transition-colors focus:border-[rgb(59_130_246_/_60%)] focus:outline-none"
                        value={form.target_opentime}
                        onChange={(event) => {
                            const value = event.currentTarget.value as BetCreateInput['target_opentime']
                            setForm((prev) => ({ ...prev, target_opentime: value }))
                        }}
                    >
                        {TARGET_OPEN_TIME_OPTIONS.map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </label>
            </div>

            <button
                type="button"
                aria-label="Next step"
                title="Next step"
                className={`${apiButton} my-[5px] min-h-[44px] w-full !justify-center text-center`}
                onClick={goToStepTwo}
                disabled={!canCreateForActiveType}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14" strokeLinecap="round" />
                    <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">Next</span>
            </button>
        </>
    )
}

// ── StepNumbers (Step 2) ─────────────────────────────────────────────────────

type StepNumbersProps = {
    betRows: BetNumberRow[]
    setBetRows: React.Dispatch<React.SetStateAction<BetNumberRow[]>>
    rowErrors: Record<string, BetRowError>
    setRowErrors: React.Dispatch<React.SetStateAction<Record<string, BetRowError>>>
    isTwoDType: boolean
    goToStepThree: () => void
    onBack: () => void
}

function StepNumbers({ betRows, setBetRows, rowErrors, setRowErrors, isTwoDType, goToStepThree, onBack }: StepNumbersProps) {
    return (
        <>
            <fieldset className="m-0 space-y-2.5 rounded-xl border border-white/12 bg-white/3 p-2.5 sm:p-3">
                <legend className="px-1 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">Bet Numbers</legend>

                {betRows.map((row) => (
                    <div key={row.id} className="rounded-xl border border-white/12 bg-[rgb(5_10_31_/_56%)] p-2.5">
                        <div className="mb-2 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                aria-label="Remove number row"
                                title="Remove number row"
                                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/4 text-[#f7f9ff] transition-colors hover:border-[rgb(248_113_113_/_45%)] hover:text-[#fecaca] disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => {
                                    setBetRows((prev) => prev.filter((item) => item.id !== row.id))
                                    setRowErrors((prev) => {
                                        const next = { ...prev }
                                        delete next[row.id]
                                        return next
                                    })
                                }}
                                disabled={betRows.length === 1}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 7h16" strokeLinecap="round" />
                                    <path d="M9 7V5h6v2" strokeLinecap="round" />
                                    <path d="M8 10v8M12 10v8M16 10v8" strokeLinecap="round" />
                                    <path d="M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-[0.74rem] text-[#8a9bb3]" htmlFor={`bet-number-${row.id}`}>
                                    Number ({isTwoDType ? '01-99' : '1-999'})
                                </label>
                                <input
                                    id={`bet-number-${row.id}`}
                                    className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] transition-colors focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
                                    inputMode="numeric"
                                    value={row.number}
                                    onChange={(event) => {
                                        const maxDigits = isTwoDType ? 2 : 3
                                        const next = event.currentTarget.value.replace(/\D/g, '').slice(0, maxDigits)
                                        setBetRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, number: next } : item)))
                                        setRowErrors((prev) => ({ ...prev, [row.id]: { ...prev[row.id], number: undefined } }))
                                    }}
                                    required
                                />
                                {rowErrors[row.id]?.number != null && (
                                    <p className="m-0 mt-1 text-[0.72rem] text-[#ff9b93]">{rowErrors[row.id]?.number}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-[0.74rem] text-[#8a9bb3]" htmlFor={`bet-amount-${row.id}`}>
                                    Amount
                                </label>
                                <input
                                    id={`bet-amount-${row.id}`}
                                    className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] transition-colors focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={row.amount}
                                    onChange={(event) => {
                                        const next = event.currentTarget.value
                                        setBetRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, amount: next } : item)))
                                        setRowErrors((prev) => ({ ...prev, [row.id]: { ...prev[row.id], amount: undefined } }))
                                    }}
                                    required
                                />
                                {rowErrors[row.id]?.amount != null && (
                                    <p className="m-0 mt-1 text-[0.72rem] text-[#ff9b93]">{rowErrors[row.id]?.amount}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex">
                    <button
                        type="button"
                        aria-label="Add number row"
                        title="Add number row"
                        className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-[rgb(59_130_246_/_35%)] bg-[rgb(59_130_246_/_10%)] text-[#93c5fd] transition-colors hover:border-[rgb(59_130_246_/_55%)] hover:bg-[rgb(59_130_246_/_16%)]"
                        onClick={() => setBetRows((prev) => [...prev, createEmptyRow()])}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    aria-label="Previous step"
                    title="Previous step"
                    className={`${apiButton} my-[5px] min-h-[44px] w-full !justify-center text-center`}
                    onClick={onBack}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M19 12H5" strokeLinecap="round" />
                        <path d="m11 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="sr-only">Back</span>
                </button>
                <button
                    type="button"
                    aria-label="Next step"
                    title="Next step"
                    className={`${apiButton} my-[5px] min-h-[44px] w-full !justify-center text-center`}
                    onClick={goToStepThree}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12h14" strokeLinecap="round" />
                        <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="sr-only">Next</span>
                </button>
            </div>
        </>
    )
}

// ── StepPaySlip (Step 3) ─────────────────────────────────────────────────────

type StepPaySlipProps = {
    form: BetCreateFormState
    setForm: React.Dispatch<React.SetStateAction<BetCreateFormState>>
    paymentAccounts: AdminPaymentAccount[]
    copiedAccountKey: string | null
    copyAccountValue: (key: string, value: string) => Promise<void>
    validAmountTotal: number
    canCreateForActiveType: boolean
    isSubmitting: boolean
    fileInputRef: RefObject<HTMLInputElement | null>
    bankInfo: WalletBankInfo | null
    onBack: () => void
}

function StepPaySlip({
    form,
    setForm,
    paymentAccounts,
    copiedAccountKey,
    copyAccountValue,
    validAmountTotal,
    canCreateForActiveType,
    isSubmitting,
    fileInputRef,
    bankInfo,
    onBack,
}: StepPaySlipProps) {
    return (
        <>
            <section className="rounded-xl border border-[rgb(245_158_11_/_22%)] bg-[rgb(245_158_11_/_8%)] p-3.5">
                <div className="mb-2.5">
                    <h3 className="m-0 text-[0.9rem] font-semibold text-[#fef3c7]">Admin Accounts</h3>
                    <p className="m-0 mt-1 text-[0.74rem] leading-[1.45] text-[#fcd34d]">
                        Transfer {form.currency} to the account below, then upload the pay slip image.
                    </p>
                </div>

                <ul className="m-0 grid list-none gap-2 p-0">
                    {paymentAccounts.map((account) => (
                        <li key={account.id} className="rounded-xl border border-[rgb(245_158_11_/_22%)] bg-[rgb(7_15_37_/_72%)] p-2.5">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="m-0 text-[0.82rem] font-semibold text-[#f7f9ff]">{account.bankName}</p>
                                    {account.note != null && (
                                        <p className="m-0 mt-0.5 text-[0.68rem] leading-[1.35] text-[#fcd34d]">{account.note}</p>
                                    )}
                                </div>
                            </div>

                            <dl className="mt-2 mb-0 grid gap-1.5">
                                <div className="grid gap-0.5">
                                    <dt className="text-[0.66rem] uppercase tracking-[0.06em] text-[#8a9bb3]">Account Holder</dt>
                                    <dd className="m-0 flex items-center justify-between gap-2">
                                        <span className="text-[0.8rem] text-[#f7f9ff]">{account.accountHolder}</span>
                                    </dd>
                                </div>

                                <div className="grid gap-0.5">
                                    <dt className="text-[0.66rem] uppercase tracking-[0.06em] text-[#8a9bb3]">Account Number</dt>
                                    <dd className="m-0 flex items-center justify-between gap-2">
                                        <span className="text-[0.88rem] font-semibold tracking-[0.04em] text-[#fef3c7]">{account.accountNumber}</span>
                                        <button
                                            type="button"
                                            aria-label={copiedAccountKey === `${account.id}-number` ? 'Copied account number' : 'Copy account number'}
                                            title={copiedAccountKey === `${account.id}-number` ? 'Copied' : 'Copy account number'}
                                            className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border bg-white/6 transition-colors ${copiedAccountKey === `${account.id}-number`
                                                ? 'border-[rgb(0_230_118_/_45%)] text-[#86efac]'
                                                : 'border-white/15 text-[#cbd5e1] hover:border-[rgb(59_130_246_/_45%)] hover:text-[#93c5fd]'
                                                }`}
                                            onClick={() => void copyAccountValue(`${account.id}-number`, account.accountNumber)}
                                        >
                                            {copiedAccountKey === `${account.id}-number` ? (
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="m5 12 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="11" height="11" rx="2" />
                                                    <path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </dd>
                                </div>
                            </dl>
                        </li>
                    ))}
                </ul>

                {paymentAccounts.length === 0 && (
                    <p className="m-0 rounded-lg border border-white/12 bg-white/6 px-2.5 py-2 text-[0.76rem] text-[#fcd34d]">
                        No admin account configured for {form.currency}.
                    </p>
                )}
            </section>

            {/* Payout Account */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">Payout Account</span>
                    <Link
                        to="/user/bank-info"
                        className="text-[0.72rem] font-medium text-[#93c5fd] hover:text-[#60a5fa] transition-colors"
                    >
                        {bankInfo == null ? 'Set up now →' : 'Manage →'}
                    </Link>
                </div>

                {bankInfo == null ? (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-[rgb(245_158_11_/_35%)] bg-[rgb(245_158_11_/_6%)] px-3.5 py-3">
                        <span className="material-symbols-outlined text-[#fcd34d] text-[1.1rem] shrink-0">account_balance</span>
                        <div>
                            <p className="m-0 text-[0.78rem] font-medium text-[#fef3c7]">No payout account linked</p>
                            <p className="m-0 mt-0.5 text-[0.7rem] text-[#fcd34d]">Add a bank account so winnings can be transferred to you.</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-white/10 bg-[rgb(5_10_31_/_68%)] px-3.5 py-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#00e676] text-[1.1rem] shrink-0">account_balance</span>
                            <span className="text-[0.82rem] font-semibold text-[#f7f9ff]">{bankInfo.bank_name}</span>
                            <span className="ml-auto text-[0.66rem] uppercase tracking-widest text-[#00e676]/60 bg-[rgb(0_230_118_/_8%)] px-2 py-0.5 rounded-full">Verified</span>
                        </div>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 m-0">
                            <div>
                                <dt className="text-[0.65rem] uppercase tracking-[0.06em] text-[#8a9bb3]">Account Holder</dt>
                                <dd className="m-0 mt-0.5 text-[0.8rem] text-[#f7f9ff]">{bankInfo.account_name}</dd>
                            </div>
                            <div>
                                <dt className="text-[0.65rem] uppercase tracking-[0.06em] text-[#8a9bb3]">Account Number</dt>
                                <dd className="m-0 mt-0.5 text-[0.8rem] font-semibold tracking-[0.04em] text-[#e2e8f0]">{bankInfo.account_number}</dd>
                            </div>
                        </dl>
                        <p className="m-0 text-[0.68rem] text-[#8a9bb3]">Winnings will be transferred to this account after results are confirmed.</p>
                        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/8">
                            <span className="material-symbols-outlined text-[#fcd34d] text-[1rem] shrink-0 mt-px">warning</span>
                            <p className="m-0 text-[0.68rem] text-[#fcd34d] leading-relaxed">Please double-check your account details are correct. Incorrect bank info may result in delayed or failed payouts.</p>
                        </div>
                    </div>
                )}
            </div>

            <label className="block space-y-1.8">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">Pay Slip Image</span>
                <input
                    ref={fileInputRef}
                    className="h-11 w-full rounded-xl border border-dashed border-white/20 bg-[rgb(5_10_31_/_68%)] px-4 py-2 text-[#f7f9ff] file:mr-3 file:rounded-lg file:border-0 file:bg-[rgb(59_130_246_/_18%)] file:px-2.5 file:py-1 file:text-[0.76rem] file:font-semibold file:text-[#93c5fd]"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => {
                        const file = event.currentTarget.files?.[0] ?? null
                        setForm((prev) => ({ ...prev, pay_slip_image: file }))
                    }}
                    required
                />
                <p className="m-0 text-[0.72rem] text-[#8a9bb3]">Upload JPG/PNG/WEBP up to 10MB.</p>
                {form.pay_slip_image != null && (
                    <p className="m-0 text-[0.74rem] text-[#93c5fd]">Selected: {form.pay_slip_image.name}</p>
                )}
            </label>

            {/* Transaction ID */}
            <label className="block space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">
                        Last 2 Digits of Transaction ID
                    </span>
                    <span className={`text-[0.7rem] font-semibold tabular-nums ${form.transaction_id_last_two_digits.length === 2 ? 'text-[#00e676]' : 'text-[#8a9bb3]'}`}>
                        {form.transaction_id_last_two_digits.length}/2
                    </span>
                </div>
                <input
                    className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-4 text-[#f7f9ff] text-center text-2xl font-bold tracking-[0.3em] placeholder:text-white/20 placeholder:text-base placeholder:tracking-normal focus:border-[rgb(0_230_118_/_50%)] focus:outline-none"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    pattern="[0-9]{2}"
                    placeholder="e.g. 47"
                    required
                    value={form.transaction_id_last_two_digits}
                    onChange={(event) => {
                        const v = event.currentTarget.value.replace(/\D/g, '').slice(0, 2)
                        setForm((prev) => ({ ...prev, transaction_id_last_two_digits: v }))
                    }}
                />
                <p className="m-0 text-[0.72rem] text-[#8a9bb3]">
                    Enter the last two digits of your bank transfer reference number. This helps us verify your payment.
                </p>
            </label>

            <div className="my-3 rounded-xl border border-white/12 bg-[rgb(7_15_37_/_70%)] p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2 text-[0.82rem]">
                    <span className="text-[#8a9bb3]">Estimated Total</span>
                    <strong className="text-[#f7f9ff]">{formatAmount(validAmountTotal, form.currency)}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        aria-label="Previous step"
                        title="Previous step"
                        className={`${apiButton} my-[5px] min-h-[44px] w-full !justify-center text-center`}
                        onClick={onBack}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M19 12H5" strokeLinecap="round" />
                            <path d="m11 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="sr-only">Back</span>
                    </button>
                    <button
                        type="submit"
                        aria-label="Submit bet"
                        title="Submit bet"
                        className="h-16 w-full bg-gradient-to-r from-[#00e676] to-[#2ac48b] rounded-2xl flex items-center justify-between px-6 shadow-[0_12px_24px_rgba(0,230,118,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 group"
                        disabled={!canCreateForActiveType || isSubmitting}
                    >
                        <span className="font-semibold text-[0.9rem] text-[#003824] tracking-tight uppercase">
                            {isSubmitting ? 'Submitting…' : 'Confirm Wager'}
                        </span>
                        <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            {isSubmitting ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 animate-spin text-[#003824]" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 3a9 9 0 1 1-9 9" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <span className="material-symbols-outlined text-[#003824] text-[20px]">arrow_forward</span>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}

// ── BetCreateCard ─────────────────────────────────────────────────────────────

type BetCreateCardProps = {
    activeBetTypeId: string
    activeBetTypeLabel: string
    activeBetTypeCaption: string
    currentStep: 1 | 2 | 3
    setCurrentStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>
    form: BetCreateFormState
    setForm: React.Dispatch<React.SetStateAction<BetCreateFormState>>
    betRows: BetNumberRow[]
    setBetRows: React.Dispatch<React.SetStateAction<BetNumberRow[]>>
    rowErrors: Record<string, BetRowError>
    setRowErrors: React.Dispatch<React.SetStateAction<Record<string, BetRowError>>>
    isCurrencyOpen: boolean
    setIsCurrencyOpen: React.Dispatch<React.SetStateAction<boolean>>
    highlightedCurrencyIndex: number
    setHighlightedCurrencyIndex: React.Dispatch<React.SetStateAction<number>>
    selectedCurrency: CurrencyOption
    currencySelectRef: RefObject<HTMLDivElement | null>
    currencyButtonRef: RefObject<HTMLButtonElement | null>
    fileInputRef: RefObject<HTMLInputElement | null>
    paymentAccounts: AdminPaymentAccount[]
    copiedAccountKey: string | null
    copyAccountValue: (key: string, value: string) => Promise<void>
    selectCurrency: (code: BetCreateInput['currency']) => void
    canCreateForActiveType: boolean
    isTwoDType: boolean
    isThreeDType: boolean
    validAmountTotal: number
    isSubmitting: boolean
    typePillClassName: string
    bankInfo: WalletBankInfo | null
    goToStepTwo: () => void
    goToStepThree: () => void
    setMessage: React.Dispatch<React.SetStateAction<string | null>>
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function BetCreateCard({
    activeBetTypeId,
    activeBetTypeLabel,
    activeBetTypeCaption,
    currentStep,
    setCurrentStep,
    form,
    setForm,
    betRows,
    setBetRows,
    bankInfo,
    rowErrors,
    setRowErrors,
    isCurrencyOpen,
    setIsCurrencyOpen,
    highlightedCurrencyIndex,
    setHighlightedCurrencyIndex,
    selectedCurrency,
    currencySelectRef,
    currencyButtonRef,
    fileInputRef,
    paymentAccounts,
    copiedAccountKey,
    copyAccountValue,
    selectCurrency,
    canCreateForActiveType,
    isTwoDType,
    validAmountTotal,
    isSubmitting,
    typePillClassName,
    goToStepTwo,
    goToStepThree,
    setMessage,
    onSubmit,
}: BetCreateCardProps) {
    return (
        <section
            className="relative overflow-hidden rounded-2xl p-4 border border-white/5 shadow-2xl bg-[rgba(35,41,60,0.4)] backdrop-blur-xl"
            role="tabpanel"
            id={`bet-panel-${activeBetTypeId}`}
            aria-labelledby={`bet-tab-${activeBetTypeId}`}
        >
            <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-[rgb(59_130_246_/_15%)] blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-36 w-36 rounded-full bg-[rgb(0_230_118_/_12%)] blur-3xl" />

            <div className="relative mb-3 flex items-start justify-between gap-2">
                <div>
                    <h2 className="m-0 text-[1.12rem]">Place Your Bet</h2>
                    <p className="m-0 mt-1 text-[0.8rem] text-[#8a9bb3]">{activeBetTypeCaption}</p>
                </div>
                <span className={`inline-flex rounded-full border px-2 py-1 text-[0.68rem] font-semibold tracking-[0.04em] ${typePillClassName}`}>
                    {activeBetTypeLabel} Market
                </span>
            </div>

            <div className="relative mb-3 grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-[rgb(4_10_31_/_44%)] p-2">
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center">
                    <p className="m-0 text-[0.66rem] uppercase tracking-[0.06em] text-[#8a9bb3]">Rows</p>
                    <p className="m-0 mt-0.5 text-[0.86rem] font-semibold text-[#f7f9ff]">{betRows.length}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center">
                    <p className="m-0 text-[0.66rem] uppercase tracking-[0.06em] text-[#8a9bb3]">Currency</p>
                    <p className="m-0 mt-0.5 text-[0.86rem] font-semibold text-[#f7f9ff]">{form.currency}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center">
                    <p className="m-0 text-[0.66rem] uppercase tracking-[0.06em] text-[#8a9bb3]">Total</p>
                    <p className="m-0 mt-0.5 text-[0.86rem] font-semibold text-[#f7f9ff]">{formatAmount(validAmountTotal, form.currency)}</p>
                </div>
            </div>

            <StepIndicator
                currentStep={currentStep}
            />

            <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
                {currentStep === 1 && (
                    <StepSetup
                        form={form}
                        setForm={setForm}
                        isCurrencyOpen={isCurrencyOpen}
                        setIsCurrencyOpen={setIsCurrencyOpen}
                        highlightedCurrencyIndex={highlightedCurrencyIndex}
                        setHighlightedCurrencyIndex={setHighlightedCurrencyIndex}
                        selectedCurrency={selectedCurrency}
                        currencySelectRef={currencySelectRef}
                        currencyButtonRef={currencyButtonRef}
                        selectCurrency={selectCurrency}
                        canCreateForActiveType={canCreateForActiveType}
                        goToStepTwo={goToStepTwo}
                    />
                )}

                {currentStep === 2 && (
                    <StepNumbers
                        betRows={betRows}
                        setBetRows={setBetRows}
                        rowErrors={rowErrors}
                        setRowErrors={setRowErrors}
                        isTwoDType={isTwoDType}
                        goToStepThree={goToStepThree}
                        onBack={() => {
                            setMessage(null)
                            setCurrentStep(1)
                        }}
                    />
                )}

                {currentStep === 3 && (
                    <StepPaySlip
                        form={form}
                        setForm={setForm}
                        paymentAccounts={paymentAccounts}
                        copiedAccountKey={copiedAccountKey}
                        copyAccountValue={copyAccountValue}
                        validAmountTotal={validAmountTotal}
                        canCreateForActiveType={canCreateForActiveType}
                        isSubmitting={isSubmitting}
                        fileInputRef={fileInputRef}
                        bankInfo={bankInfo}
                        onBack={() => {
                            setMessage(null)
                            setCurrentStep(2)
                        }}
                    />
                )}
            </form>
        </section>
    )
}
