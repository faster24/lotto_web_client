import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { createBet, listBets } from '@/api/client'
import type { Bet, BetCreateInput } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard } from '@/styles/tw'
import { betTypeCatalog } from './betTypeCatalog'

type BetCreateFormState = {
    pay_slip_image: File | null
    bet_type: BetCreateInput['bet_type']
    currency: BetCreateInput['currency']
    target_opentime: BetCreateInput['target_opentime']
}

type BetNumberRow = {
    id: string
    number: string
    amount: string
}

type BetRowError = {
    number?: string
    amount?: string
}

type CurrencyOption = {
    code: BetCreateInput['currency']
    name: string
    flagClass: string
}

const TARGET_OPEN_TIME_OPTIONS: BetCreateInput['target_opentime'][] = ['12:01:00', '16:30:00']
const CURRENCY_OPTIONS: CurrencyOption[] = [
    { code: 'MMK', name: 'Myanmar Kyat', flagClass: 'fi-mm' },
    { code: 'THB', name: 'Thai Baht', flagClass: 'fi-th' },
]

const initialForm: BetCreateFormState = {
    pay_slip_image: null,
    bet_type: '2D',
    currency: 'MMK',
    target_opentime: '16:30:00',
}

function createEmptyRow(): BetNumberRow {
    return {
        id: crypto.randomUUID(),
        number: '',
        amount: '',
    }
}

function formatAmount(value: number, currency: BetCreateInput['currency']) {
    if (!Number.isFinite(value) || value < 0) {
        return `0 ${currency}`
    }

    return `${value.toLocaleString()} ${currency}`
}

function CurrencyFlag({ code }: { code: BetCreateInput['currency'] }) {
    const option = CURRENCY_OPTIONS.find((item) => item.code === code) ?? CURRENCY_OPTIONS[0]
    return <span aria-hidden="true" className={`fi ${option.flagClass} h-[14px] w-5 overflow-hidden rounded-[3px] border border-white/10`} />
}

export function BetsContent() {
    const defaultType = betTypeCatalog[0]
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [bets, setBets] = useState<Bet[]>([])
    const [activeBetTypeId, setActiveBetTypeId] = useState(defaultType?.id ?? '2D')
    const [form, setForm] = useState<BetCreateFormState>(initialForm)
    const [betRows, setBetRows] = useState<BetNumberRow[]>([createEmptyRow()])
    const [rowErrors, setRowErrors] = useState<Record<string, BetRowError>>({})
    const [message, setMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
    const [highlightedCurrencyIndex, setHighlightedCurrencyIndex] = useState(0)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const currencySelectRef = useRef<HTMLDivElement | null>(null)
    const currencyButtonRef = useRef<HTMLButtonElement | null>(null)

    const activeBetType = betTypeCatalog.find((item) => item.id === activeBetTypeId) ?? defaultType
    const activePayloadBetType = activeBetType?.payloadBetType
    const isTwoDType = activePayloadBetType === '2D'
    const canCreateForActiveType = activePayloadBetType != null
    const filteredBets = activePayloadBetType == null ? [] : bets.filter((bet) => bet.bet_type === activePayloadBetType)
    const showBetList = activePayloadBetType !== '2D'

    const validAmountTotal = betRows.reduce((sum, row) => {
        const parsed = Number(row.amount)
        if (!Number.isInteger(parsed) || parsed < 1) {
            return sum
        }

        return sum + parsed
    }, 0)
    const selectedCurrency = CURRENCY_OPTIONS.find((item) => item.code === form.currency) ?? CURRENCY_OPTIONS[0]

    const load = async () => {
        setError(null)

        try {
            const response = await listBets()
            setBets(response.data.bets)
        } catch {
            setError('Unable to load bets.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    useEffect(() => {
        if (!isCurrencyOpen) {
            return
        }

        const selectedIndex = CURRENCY_OPTIONS.findIndex((item) => item.code === form.currency)
        setHighlightedCurrencyIndex(selectedIndex === -1 ? 0 : selectedIndex)
    }, [form.currency, isCurrencyOpen])

    useEffect(() => {
        if (!isCurrencyOpen) {
            return
        }

        const onMouseDown = (event: MouseEvent) => {
            if (currencySelectRef.current == null) {
                return
            }

            if (!currencySelectRef.current.contains(event.target as Node)) {
                setIsCurrencyOpen(false)
            }
        }

        document.addEventListener('mousedown', onMouseDown)
        return () => {
            document.removeEventListener('mousedown', onMouseDown)
        }
    }, [isCurrencyOpen])

    const validateRows = (rows: BetNumberRow[]) => {
        const errors: Record<string, BetRowError> = {}
        const normalized: BetCreateInput['bet_numbers'] = []
        const isTwoD = activePayloadBetType === '2D'

        rows.forEach((row) => {
            const number = row.number.trim()
            const amount = row.amount.trim()
            const rowError: BetRowError = {}

            if (!/^\d+$/.test(number)) {
                rowError.number = isTwoD ? 'Use exactly 2 digits (01 to 99).' : 'Use 1 to 3 digits.'
            } else {
                const value = Number(number)
                if (isTwoD) {
                    if (number.length !== 2 || value < 1 || value > 99) {
                        rowError.number = 'Number must be between 01 and 99.'
                    }
                } else if (number.length > 3 || value < 1 || value > 999) {
                    rowError.number = 'Number must be between 1 and 999.'
                }
            }

            const amountValue = Number(amount)

            if (!/^\d+$/.test(amount) || !Number.isInteger(amountValue) || amountValue < 1) {
                rowError.amount = 'Amount must be an integer >= 1.'
            }

            if (rowError.number != null || rowError.amount != null) {
                errors[row.id] = rowError
                return
            }

            normalized.push({
                number,
                amount: amountValue,
            })
        })

        return { errors, normalized }
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage(null)

        if (currentStep !== 3) {
            return
        }

        if (activePayloadBetType == null) {
            setMessage('This bet type is not available for create yet.')
            return
        }

        if (form.pay_slip_image == null) {
            setMessage('Pay slip image is required.')
            return
        }

        const { errors: nextErrors, normalized } = validateRows(betRows)
        setRowErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            setMessage('Please fix invalid number rows.')
            return
        }

        if (normalized.length === 0) {
            setMessage('At least one bet number is required.')
            return
        }

        try {
            setIsSubmitting(true)
            const response = await createBet({
                pay_slip_image: form.pay_slip_image,
                bet_type: activePayloadBetType,
                currency: form.currency,
                target_opentime: form.target_opentime,
                bet_numbers: normalized,
            })

            setMessage(response.message)
            await load()
            setForm((prev) => ({ ...prev, pay_slip_image: null, bet_type: activePayloadBetType }))
            setBetRows([createEmptyRow()])
            setRowErrors({})
            setCurrentStep(1)

            if (fileInputRef.current != null) {
                fileInputRef.current.value = ''
            }
        } catch (caughtError) {
            setMessage(caughtError instanceof Error ? caughtError.message : 'Create bet failed.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const goToStepTwo = () => {
        if (activePayloadBetType == null) {
            setMessage('This bet type is not available for create yet.')
            return
        }

        setMessage(null)
        setCurrentStep(2)
    }

    const goToStepThree = () => {
        const { errors: nextErrors, normalized } = validateRows(betRows)
        setRowErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            setMessage('Please fix invalid number rows.')
            return
        }

        if (normalized.length === 0) {
            setMessage('At least one bet number is required.')
            return
        }

        setMessage(null)
        setCurrentStep(3)
    }

    const selectCurrency = (code: BetCreateInput['currency']) => {
        setForm((prev) => ({ ...prev, currency: code }))
        setIsCurrencyOpen(false)
        currencyButtonRef.current?.focus()
    }

    return (
        <>
            <section className={apiCard}>
                <h2 className="m-0 mb-2 text-[1.12rem]">Bet Types</h2>
                <p className="m-0 mb-3 text-[0.8rem] text-[#8a9bb3]">Choose category, then enter numbers and amount per row.</p>
                <div role="tablist" aria-label="Bet type switcher" className="grid grid-cols-2 gap-2">
                    {betTypeCatalog.map((item) => {
                        const active = item.id === activeBetTypeId
                        const tabClassName = active
                            ? 'border-[rgb(0_230_118_/_44%)] bg-[linear-gradient(140deg,rgb(0_230_118_/_16%)_0%,rgb(0_151_255_/_10%)_100%)] text-[#00e676] shadow-[0_0_0_1px_rgb(0_230_118_/_20%),0_10px_24px_rgb(0_230_118_/_12%)]'
                            : 'border-white/12 bg-white/3 text-[#8a9bb3] hover:border-[rgb(0_230_118_/_28%)] hover:text-[#f7f9ff]'

                        return (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                aria-controls={`bet-panel-${item.id}`}
                                id={`bet-tab-${item.id}`}
                                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-left text-[0.8rem] font-semibold transition-colors min-h-[44px] ${tabClassName}`}
                                onClick={() => {
                                    setActiveBetTypeId(item.id)

                                    if (item.payloadBetType == null) {
                                        setMessage('This bet type is not available for create yet.')
                                        return
                                    }

                                    setForm((prev) => ({ ...prev, bet_type: item.payloadBetType! }))
                                    setRowErrors({})
                                    setMessage(null)
                                    setCurrentStep(1)
                                }}
                            >
                                <span className="block text-[0.9rem]">{item.label}</span>
                                <span className="mt-0.5 block text-[0.73rem] font-medium text-[#8a9bb3]">{item.caption}</span>
                            </button>
                        )
                    })}
                </div>
            </section>

            <section className={apiCard} role="tabpanel" id={`bet-panel-${activeBetTypeId}`} aria-labelledby={`bet-tab-${activeBetTypeId}`}>
                <h2 className="m-0 mb-1 text-center text-[1.12rem]">Place Your Bet</h2>
                <p className="m-0 mb-3 text-center text-[0.82rem] text-[#8a9bb3]">{activeBetType?.caption ?? ''}</p>

                <div className="mb-3 grid grid-cols-3 gap-1.5" aria-label="Bet create steps">
                    {[
                        { id: 1, label: 'Setup' },
                        { id: 2, label: 'Numbers' },
                        { id: 3, label: 'Pay Slip' },
                    ].map((step) => {
                        const isActive = currentStep === step.id
                        const isDone = currentStep > step.id

                        return (
                            <div
                                key={step.id}
                                className={`rounded-lg border px-2 py-2 text-center ${isDone
                                    ? 'border-[rgb(0_230_118_/_35%)] bg-[rgb(0_230_118_/_14%)] text-[#86efac]'
                                    : isActive
                                        ? 'border-[rgb(59_130_246_/_42%)] bg-[rgb(59_130_246_/_16%)] text-[#93c5fd]'
                                        : 'border-white/10 bg-white/3 text-[#8a9bb3]'
                                    }`}
                            >
                                <span className="mx-auto mb-1 inline-flex h-6 w-6 items-center justify-center">
                                    {step.id === 1 && (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                                            <circle cx="8" cy="6" r="1.4" fill="currentColor" />
                                            <circle cx="14" cy="12" r="1.4" fill="currentColor" />
                                            <circle cx="10" cy="18" r="1.4" fill="currentColor" />
                                        </svg>
                                    )}
                                    {step.id === 2 && (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M7 4v16M17 4v16M5 8h14M5 16h14" strokeLinecap="round" />
                                        </svg>
                                    )}
                                    {step.id === 3 && (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M7 3h8l4 4v14H7z" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15 3v5h5M10 12h6M10 16h6" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </span>
                                <span className="block text-[0.72rem] font-semibold">{step.label}</span>
                            </div>
                        )
                    })}
                </div>

                <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
                    {currentStep === 1 && (
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
                                                    if (active != null) {
                                                        selectCurrency(active.code)
                                                    }
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
                                                            className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors ${isHighlighted
                                                                ? 'bg-[rgb(59_130_246_/_20%)] text-[#f7f9ff]'
                                                                : 'text-[#cbd5e1] hover:bg-white/7'
                                                                }`}
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
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
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
                    )}

                    {currentStep === 2 && (
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
                                                className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/4 text-[#f7f9ff] transition-colors hover:border-[rgb(248_113_113_/_45%)] hover:text-[#fecaca] disabled:cursor-not-allowed disabled:opacity-50"
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
                                                {rowErrors[row.id]?.number != null && <p className="m-0 mt-1 text-[0.72rem] text-[#ff9b93]">{rowErrors[row.id]?.number}</p>}
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
                                                {rowErrors[row.id]?.amount != null && <p className="m-0 mt-1 text-[0.72rem] text-[#ff9b93]">{rowErrors[row.id]?.amount}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex">
                                    <button
                                        type="button"
                                        aria-label="Add number row"
                                        title="Add number row"
                                        className="cursor-pointer inline-flex h-11 w-full items-center justify-center rounded-xl border border-[rgb(59_130_246_/_35%)] bg-[rgb(59_130_246_/_10%)] text-[#93c5fd] transition-colors hover:border-[rgb(59_130_246_/_55%)] hover:bg-[rgb(59_130_246_/_16%)]"
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
                                    onClick={() => {
                                        setMessage(null)
                                        setCurrentStep(1)
                                    }}
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
                    )}

                    {currentStep === 3 && (
                        <>
                            <label className="block space-y-1.8">
                                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">Pay Slip Image</span>
                                <input
                                    ref={fileInputRef}
                                    className="h-11 w-full rounded-xl border border-dashed border-white/20 bg-[rgb(5_10_31_/_68%)] px-4 py-2 text-[#f7f9ff] file:mr-3 file:rounded-lg file:border-0 file:bg-[rgb(59_130_246_/_18%)] file:px-2.5 file:py-1 file:text-[0.76rem] file:font-semibold file:text-[#93c5fd]"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files?.[0] ?? null
                                        setForm((prev) => ({
                                            ...prev,
                                            pay_slip_image: file,
                                        }))
                                    }}
                                    required
                                />
                                <p className="m-0 text-[0.72rem] text-[#8a9bb3]">Upload JPG/PNG/WEBP up to 10MB.</p>
                                {form.pay_slip_image != null && (
                                    <p className="m-0 text-[0.74rem] text-[#93c5fd]">Selected: {form.pay_slip_image.name}</p>
                                )}
                            </label>

                            <div className="rounded-xl border border-white/12 bg-[rgb(7_15_37_/_70%)] p-3.5 my-3">
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
                                        onClick={() => {
                                            setMessage(null)
                                            setCurrentStep(2)
                                        }}
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
                                        className="my-[5px] inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-[0.8rem] border border-[rgb(0_230_118_/_38%)] bg-[rgb(0_230_118_/_14%)] px-3 py-2 text-[0.9rem] font-semibold leading-[1.35] text-[#86efac] transition-colors hover:border-[rgb(0_230_118_/_58%)] hover:bg-[rgb(0_230_118_/_20%)] disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={!canCreateForActiveType || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 3a9 9 0 1 1-9 9" strokeLinecap="round" />
                                                </svg>
                                                <span className="sr-only">Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 2 11 13" strokeLinecap="round" />
                                                    <path d="m22 2-7 20-4-9-9-4z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span className="sr-only">Submit</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </form>

            </section>

            {showBetList && (
                <ApiStatePanel loading={loading} error={error} empty={filteredBets.length === 0} emptyMessage={`No ${activeBetType?.label ?? ''} bets yet.`} />
            )}

            {showBetList && filteredBets.length > 0 && (
                <section className={apiCard}>
                    <h2 className="m-0 mb-2 text-[1.12rem]">{activeBetType?.label ?? ''} Bet List</h2>
                    <ul className="m-0 grid list-none gap-2.5 p-0">
                        {filteredBets.map((bet) => (
                            <li key={bet.id} className="rounded-xl border border-white/8 bg-white/3 p-2.5">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="m-0 text-[0.9rem] font-semibold">
                                        {bet.bet_type} · {bet.total_amount} {bet.currency}
                                    </p>
                                    <Link className={`${apiButton} min-h-[44px]`} to={`/bets/${bet.id}`}>
                                        View
                                    </Link>
                                </div>
                                <p className="mt-1 mb-0 text-[0.82rem] leading-[1.45] text-[#8a9bb3]">
                                    Numbers: {bet.bet_numbers.map((item) => item.number).join(', ')}
                                </p>
                                <p className="m-0 text-[0.82rem] leading-[1.45] text-[#8a9bb3]">
                                    {bet.stock_date} {bet.target_opentime}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {message != null && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(4_10_31_/_56%)] p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="bet-message-title"
                        aria-describedby="bet-message-description"
                        className="w-full max-w-sm rounded-2xl border border-[rgb(255_255_255_/_16%)] bg-[#0f1d38] p-5 shadow-[0_18px_42px_rgb(4_10_31_/_45%)]"
                    >
                        <h3 id="bet-message-title" className="m-0 text-base font-semibold text-[#f5f8ff]">
                            Bet Message
                        </h3>
                        <p id="bet-message-description" className="mt-2 mb-0 text-sm text-[#a7b4cb]">
                            {message}
                        </p>
                        <button
                            type="button"
                            className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl border-0 bg-[#00e676] text-sm font-semibold text-[#04141f] transition hover:brightness-110"
                            onClick={() => setMessage(null)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
