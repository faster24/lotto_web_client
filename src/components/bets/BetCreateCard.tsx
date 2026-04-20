import type { RefObject } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { BetCreateInput, WalletBankInfo } from '@/api/types'
import { apiButton } from '@/styles/tw'
import {
    CURRENCY_OPTIONS,
    TARGET_OPEN_TIME_OPTIONS,
    TARGET_OPEN_TIME_LABELS,
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

// ── TargetOpenTimeSelector ───────────────────────────────────────────────────

function secondsUntil(openTime: string): number {
    const now = new Date()
    const parts = openTime.split(':')
    const h = parseInt(parts[0] ?? '0', 10)
    const m = parseInt(parts[1] ?? '0', 10)
    const s = parseInt(parts[2] ?? '0', 10)
    const target = new Date(now)
    target.setHours(h, m, s, 0)
    return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
}

function formatCountdown(totalSeconds: number): string {
    if (totalSeconds === 0) return 'Closed today'
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
}

type TargetOpenTimeSelectorProps = {
    form: BetCreateFormState
    setForm: React.Dispatch<React.SetStateAction<BetCreateFormState>>
}

function TargetOpenTimeSelector({ form, setForm }: TargetOpenTimeSelectorProps) {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [countdown, setCountdown] = useState(() => secondsUntil(form.target_opentime))

    useEffect(() => {
        const id = window.setInterval(() => {
            setCountdown(secondsUntil(form.target_opentime))
        }, 1000)
        return () => window.clearInterval(id)
    }, [form.target_opentime])

    const selectedLabel = TARGET_OPEN_TIME_LABELS[form.target_opentime] ?? form.target_opentime

    return (
        <div className="mb-5">
            <p className="text-[0.6rem] font-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                {t('bets.targetOpenTime')}
            </p>
            <div
                className="bg-[#1f2634] rounded-xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all border border-transparent hover:border-[#51e1a5]/20"
                onClick={() => setOpen((v) => !v)}
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#51e1a5] text-[1.25rem]">schedule</span>
                    <div>
                        <p className="text-sm font-bold text-white">{selectedLabel}</p>
                        <p className="text-[0.6rem] text-white/40 font-medium uppercase tracking-tight mt-0.5">
                            Closing in {formatCountdown(countdown)}
                        </p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-white/40 text-[1.1rem]">
                    {open ? 'expand_less' : 'expand_more'}
                </span>
            </div>

            {open && (
                <div className="mt-2 flex flex-col gap-2">
                    {TARGET_OPEN_TIME_OPTIONS.map((value) => {
                        const isActive = form.target_opentime === value
                        return (
                            <button
                                key={value}
                                type="button"
                                className={`rounded-xl p-3 flex items-center justify-between transition-all active:scale-[0.98] ${
                                    isActive
                                        ? 'bg-[#51e1a5]/10 border border-[#51e1a5]/20 text-[#51e1a5]'
                                        : 'bg-[#19202d] border border-transparent text-white/60 hover:text-white'
                                }`}
                                onClick={() => {
                                    setForm((prev) => ({ ...prev, target_opentime: value as BetCreateInput['target_opentime'] }))
                                    setOpen(false)
                                }}
                            >
                                <span className="text-sm font-bold">{TARGET_OPEN_TIME_LABELS[value] ?? value}</span>
                                {isActive && (
                                    <span className="material-symbols-outlined text-[#51e1a5] text-[1rem]">check</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}


// ── SmartGenerateCard ────────────────────────────────────────────────────────

type GeneratorKey = 'reverse' | 'double' | 'nakkhat' | 'power' | 'brother' | 'khway' | 'a-par'

const NAKKHAT_PAIRS: [string, string][] = [
    ['07', '70'], ['18', '81'], ['24', '42'], ['35', '53'], ['69', '96'],
]

const POWER_PAIRS: [string, string][] = [
    ['05', '50'], ['16', '61'], ['27', '72'], ['38', '83'], ['49', '94'],
]

const BROTHER_PAIRS: [string, string][] = [
    ['01', '10'], ['12', '21'], ['23', '32'], ['34', '43'], ['45', '54'],
    ['56', '65'], ['67', '76'], ['78', '87'], ['89', '98'], ['90', '09'],
]

type GeneratorDef = {
    key: GeneratorKey
    icon: string
    label: string
    description: string
    fields: { number: boolean; amount: boolean; digits?: boolean }
    numberLabel?: string
    numberHint?: string
    numberMaxLength?: number
}

type SmartGenerateCardProps = {
    betRows: BetNumberRow[]
    setBetRows: React.Dispatch<React.SetStateAction<BetNumberRow[]>>
    isTwoDType: boolean
}

function SmartGenerateCard({ betRows, setBetRows, isTwoDType }: SmartGenerateCardProps) {
    const [open, setOpen] = useState(false)
    const [activeGen, setActiveGen] = useState<GeneratorKey | null>(null)
    const [modalNumber, setModalNumber] = useState('')
    const [modalAmount, setModalAmount] = useState('')
    const [modalError, setModalError] = useState<string | null>(null)
    const [modalDigits, setModalDigits] = useState<Set<string>>(new Set())
    const [modalIncludeDoubles, setModalIncludeDoubles] = useState(false)

    const maxDigits = isTwoDType ? 2 : 3

    const generators: GeneratorDef[] = [
        {
            key: 'reverse',
            icon: 'sync_alt',
            label: 'Reverse',
            description: 'Add a number + its mirror',
            fields: { number: true, amount: true },
            numberLabel: `Number (${isTwoDType ? '01–99' : '1–999'})`,
            numberHint: 'Both the number and its reverse will be added.',
        },
        {
            key: 'double',
            icon: 'filter_2',
            label: 'Double',
            description: isTwoDType ? 'All doubles 00–99' : 'All doubles 000–999',
            fields: { number: false, amount: true },
        },
        ...(isTwoDType ? [
            {
                key: 'nakkhat' as GeneratorKey,
                icon: 'stars',
                label: 'Nakkhat',
                description: '10 lucky pairs',
                fields: { number: false, amount: true },
            },
            {
                key: 'power' as GeneratorKey,
                icon: 'bolt',
                label: 'Power',
                description: '10 pairs diff. of 5',
                fields: { number: false, amount: true },
            },
            {
                key: 'brother' as GeneratorKey,
                icon: 'group',
                label: 'Brother',
                description: '20 consecutive pairs',
                fields: { number: false, amount: true },
            },
            {
                key: 'khway' as GeneratorKey,
                icon: 'casino',
                label: 'Khway',
                description: 'Permutation wheel',
                fields: { number: false, amount: true, digits: true },
            },
            {
                key: 'a-par' as GeneratorKey,
                icon: 'tag',
                label: 'A-Par',
                description: 'All 19 pairs with digit',
                fields: { number: true, amount: true },
                numberLabel: 'Digit (0–9)',
                numberHint: 'Generates all 19 numbers containing this digit.',
                numberMaxLength: 1,
            },
        ] : []),
    ]

    const openModal = (key: GeneratorKey) => {
        setActiveGen(key)
        setModalNumber('')
        setModalAmount('')
        setModalError(null)
        setModalDigits(new Set())
        setModalIncludeDoubles(false)
    }

    const closeModal = () => {
        setActiveGen(null)
        setModalError(null)
    }

    const mergeRows = (prev: BetNumberRow[], newRows: BetNumberRow[]): BetNumberRow[] => {
        const filled = prev.filter((r) => r.number !== '' || r.amount !== '')
        return filled.length > 0 ? [...filled, ...newRows] : newRows
    }

    const confirm = () => {
        setModalError(null)
        const amount = modalAmount.trim()
        const amountVal = Number(amount)
        if (!/^\d+$/.test(amount) || !Number.isInteger(amountVal) || amountVal < 1) {
            setModalError('Amount must be an integer ≥ 1.')
            return
        }

        if (activeGen === 'reverse') {
            const num = modalNumber.trim()
            if (!/^\d+$/.test(num) || num.length < 2 || num.length > maxDigits) {
                setModalError(isTwoDType ? 'Enter exactly 2 digits.' : 'Enter 2 or 3 digits.')
                return
            }
            const rev = num.split('').reverse().join('')
            const existing = new Set(betRows.map((r) => r.number))
            const toAdd: BetNumberRow[] = []
            if (!existing.has(num)) toAdd.push({ ...createEmptyRow(), number: num, amount })
            if (rev !== num && !existing.has(rev) && !toAdd.some((r) => r.number === rev)) {
                toAdd.push({ ...createEmptyRow(), number: rev, amount })
            }
            if (toAdd.length > 0) setBetRows((prev) => mergeRows(prev, toAdd))
        }

        if (activeGen === 'a-par') {
            const digit = modalNumber.trim()
            if (!/^\d$/.test(digit)) {
                setModalError('Enter exactly 1 digit (0–9).')
                return
            }
            const existing = new Set(betRows.map((r) => r.number))
            const candidates = new Set<string>()
            for (let i = 0; i <= 9; i++) {
                candidates.add(`${digit}${i}`)
                candidates.add(`${i}${digit}`)
            }
            const newRows = [...candidates]
                .filter((n) => !existing.has(n))
                .map((n) => ({ ...createEmptyRow(), number: n, amount }))
            if (newRows.length > 0) setBetRows((prev) => mergeRows(prev, newRows))
        }

        const pairSets: Partial<Record<GeneratorKey, [string, string][]>> = {
            nakkhat: NAKKHAT_PAIRS,
            power: POWER_PAIRS,
            brother: BROTHER_PAIRS,
        }
        const pairSet = activeGen != null ? pairSets[activeGen] : undefined
        if (pairSet != null) {
            const existing = new Set(betRows.map((r) => r.number))
            const newRows = pairSet.flatMap(([a, b]) => [a, b])
                .filter((n) => !existing.has(n))
                .map((n) => ({ ...createEmptyRow(), number: n, amount }))
            if (newRows.length > 0) setBetRows((prev) => mergeRows(prev, newRows))
        }

        if (activeGen === 'khway') {
            if (modalDigits.size < 2) {
                setModalError('Select at least 2 digits.')
                return
            }
            const existing = new Set(betRows.map((r) => r.number))
            const newRows: BetNumberRow[] = []
            for (const a of modalDigits) {
                for (const b of modalDigits) {
                    if (a === b && !modalIncludeDoubles) continue
                    const num = `${a}${b}`
                    if (!existing.has(num)) newRows.push({ ...createEmptyRow(), number: num, amount })
                }
            }
            if (newRows.length > 0) setBetRows((prev) => mergeRows(prev, newRows))
        }

        if (activeGen === 'double') {
            const digits = isTwoDType ? 2 : 3
            const doubles = Array.from({ length: 10 }, (_, i) => String(i).repeat(digits))
            const existing = new Set(betRows.map((r) => r.number))
            const newRows = doubles
                .filter((n) => !existing.has(n))
                .map((n) => ({ ...createEmptyRow(), number: n, amount }))
            if (newRows.length > 0) setBetRows((prev) => mergeRows(prev, newRows))
        }

        closeModal()
    }

    const activeDef = generators.find((g) => g.key === activeGen)

    return (
        <>
            <div className="rounded-xl border border-[#51e1a5]/15 bg-[#51e1a5]/4 overflow-hidden">
                <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 active:bg-[#51e1a5]/8 transition-colors"
                    onClick={() => setOpen((v) => !v)}
                >
                    <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#51e1a5] text-[1.1rem]">auto_awesome</span>
                        <div className="text-left">
                            <p className="text-[0.75rem] font-bold text-[#51e1a5] uppercase tracking-widest leading-none">Smart Generate</p>
                            <p className="text-[0.62rem] text-white/35 mt-0.5 leading-none">Auto-fill number patterns</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-white/30 text-[1rem]">
                        {open ? 'expand_less' : 'expand_more'}
                    </span>
                </button>

                {open && (
                    <div className="px-3 pb-3 pt-1 grid grid-cols-3 gap-2 border-t border-[#51e1a5]/10">
                        {generators.map((gen) => (
                            <button
                                key={gen.key}
                                type="button"
                                className="flex flex-col items-center justify-center gap-1.5 h-16 w-full rounded-xl bg-[#19202d] border border-[#51e1a5]/20 text-[#51e1a5] hover:bg-[#51e1a5]/10 active:scale-95 transition-all"
                                onClick={() => openModal(gen.key)}
                            >
                                <span className="material-symbols-outlined text-[1.1rem]">{gen.icon}</span>
                                <p className="text-[0.72rem] font-bold uppercase tracking-wide leading-none">{gen.label}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {activeGen != null && activeDef != null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={closeModal}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-[22rem] bg-[#19202d] rounded-2xl border border-white/10 p-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-[#51e1a5] text-[1.2rem]">{activeDef.icon}</span>
                                <div>
                                    <p className="text-[0.78rem] font-bold text-white uppercase tracking-wide leading-none">{activeDef.label}</p>
                                    <p className="text-[0.62rem] text-white/40 mt-0.5 leading-none">{activeDef.description}</p>
                                </div>
                            </div>
                            <button type="button" className="text-white/40 hover:text-white transition-colors" onClick={closeModal}>
                                <span className="material-symbols-outlined text-[1.2rem]">close</span>
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                            {activeDef.fields.number && (
                                <div>
                                    <label className="block text-[0.72rem] text-[#8a9bb3] mb-1.5">{activeDef.numberLabel}</label>
                                    <input
                                        className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] text-center text-xl font-bold tracking-widest focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
                                        inputMode="numeric"
                                        maxLength={activeDef.numberMaxLength ?? maxDigits}
                                        placeholder={activeDef.numberMaxLength === 1 ? '5' : (isTwoDType ? '12' : '123')}
                                        value={modalNumber}
                                        onChange={(e) => {
                                            setModalError(null)
                                            const limit = activeDef.numberMaxLength ?? maxDigits
                                            setModalNumber(e.currentTarget.value.replace(/\D/g, '').slice(0, limit))
                                        }}
                                        autoFocus
                                    />
                                    {activeDef.numberHint != null && (
                                        <p className="mt-1 text-[0.62rem] text-white/35">{activeDef.numberHint}</p>
                                    )}
                                </div>
                            )}

                            {activeDef.fields.digits === true && (
                                <>
                                    <div>
                                        <label className="block text-[0.72rem] text-[#8a9bb3] mb-2">Select digits</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {Array.from({ length: 10 }, (_, i) => String(i)).map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    className={`h-10 rounded-xl border font-bold text-sm transition-all active:scale-95 ${
                                                        modalDigits.has(d)
                                                            ? 'bg-[#51e1a5]/15 border-[#51e1a5]/40 text-[#51e1a5]'
                                                            : 'bg-[#19202d] border-white/12 text-white/50 hover:text-white'
                                                    }`}
                                                    onClick={() => {
                                                        setModalError(null)
                                                        setModalDigits((prev) => {
                                                            const next = new Set(prev)
                                                            next.has(d) ? next.delete(d) : next.add(d)
                                                            return next
                                                        })
                                                    }}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-[#51e1a5]"
                                            checked={modalIncludeDoubles}
                                            onChange={(e) => setModalIncludeDoubles(e.currentTarget.checked)}
                                        />
                                        <span className="text-[0.72rem] text-white/60">Include doubles (11, 22…)</span>
                                    </label>

                                    {modalDigits.size >= 2 && (
                                        <p className="text-[0.65rem] text-[#51e1a5]">
                                            Will generate {modalDigits.size * (modalIncludeDoubles ? modalDigits.size : modalDigits.size - 1)} numbers
                                        </p>
                                    )}
                                </>
                            )}

                            <div>
                                <label className="block text-[0.72rem] text-[#8a9bb3] mb-1.5">Amount per number</label>
                                <input
                                    className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] text-center text-xl font-bold tracking-widest focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
                                    type="number"
                                    min={1}
                                    step={1}
                                    placeholder="100"
                                    value={modalAmount}
                                    onChange={(e) => {
                                        setModalError(null)
                                        setModalAmount(e.currentTarget.value)
                                    }}
                                    autoFocus={!activeDef.fields.number && !activeDef.fields.digits}
                                />
                            </div>
                        </div>

                        {modalError != null && (
                            <p className="text-[0.72rem] text-[#ff9b93]">{modalError}</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                className="flex-1 h-12 rounded-xl border border-white/12 bg-white/4 text-white/60 text-[0.8rem] font-semibold hover:text-white transition-colors"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#00e676] to-[#2ac48b] text-[#003824] text-[0.8rem] font-bold uppercase tracking-wide shadow-[0_8px_16px_rgba(0,230,118,0.25)] active:scale-95 transition-all"
                                onClick={confirm}
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// ── BetNumbersSummary ─────────────────────────────────────────────────────────

type BetNumbersSummaryProps = {
    betRows: BetNumberRow[]
    validAmountTotal: number
    currency: BetCreateInput['currency']
}

function BetNumbersSummary({ betRows, validAmountTotal, currency }: BetNumbersSummaryProps) {
    const filled = betRows.filter((r) => r.number !== '')
    if (filled.length === 0) return null

    return (
        <div className="mt-3 rounded-xl border border-white/10 bg-[#0e131e] p-3">
            <div className="flex items-center justify-between mb-2.5">
                <p className="text-[0.65rem] font-bold text-white/40 uppercase tracking-widest">Bet Summary</p>
                <p className="text-[0.65rem] font-semibold text-[#51e1a5]">
                    {filled.length} numbers · {validAmountTotal.toLocaleString()} {currency}
                </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {filled.map((row) => {
                    const amountVal = Number(row.amount)
                    const validAmount = /^\d+$/.test(row.amount.trim()) && Number.isInteger(amountVal) && amountVal >= 1
                    return (
                        <span
                            key={row.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.72rem] font-bold tabular-nums ${
                                validAmount
                                    ? 'bg-[#51e1a5]/8 border border-[#51e1a5]/20 text-[#51e1a5]'
                                    : 'bg-amber-500/8 border border-amber-500/20 text-amber-400'
                            }`}
                        >
                            {row.number}
                            {row.amount !== '' && (
                                <span className="font-normal opacity-50">·{row.amount}</span>
                            )}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

// ── StepNumbers (Step 2) ─────────────────────────────────────────────────────

type StepNumbersProps = {
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
    selectCurrency: (code: BetCreateInput['currency']) => void
    isTwoDType: boolean
    validAmountTotal: number
    goToStepThree: () => void
}

function StepNumbers({
    form, setForm,
    betRows, setBetRows,
    rowErrors, setRowErrors,
    isCurrencyOpen, setIsCurrencyOpen,
    highlightedCurrencyIndex, setHighlightedCurrencyIndex,
    selectedCurrency, currencySelectRef, currencyButtonRef, selectCurrency,
    isTwoDType, validAmountTotal, goToStepThree,
}: StepNumbersProps) {
    const { t } = useTranslation()
    return (
        <>
            <TargetOpenTimeSelector form={form} setForm={setForm} />

            <div className="mb-1" ref={currencySelectRef}>
                <p className="text-[0.6rem] font-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                    {t('bets.currency')}
                </p>
                <button
                    ref={currencyButtonRef}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isCurrencyOpen}
                    aria-controls="currency-options"
                    className="w-full bg-[#1f2634] rounded-xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all border border-transparent hover:border-[#51e1a5]/20 focus:outline-none"
                    onClick={() => setIsCurrencyOpen((prev) => !prev)}
                    onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setIsCurrencyOpen(true)
                        }
                    }}
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#51e1a5] text-[1.25rem]">payments</span>
                        <p className="text-sm font-bold text-white">{selectedCurrency.code}</p>
                    </div>
                    <span className="material-symbols-outlined text-white/40 text-[1.1rem]">
                        {isCurrencyOpen ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
                {isCurrencyOpen && (
                    <ul id="currency-options" role="listbox" aria-label={t('bets.currencyOptions')} className="mt-2 flex flex-col gap-2"
                        onKeyDown={(event) => {
                            if (event.key === 'ArrowDown') { event.preventDefault(); setHighlightedCurrencyIndex((prev) => Math.min(prev + 1, CURRENCY_OPTIONS.length - 1)); return }
                            if (event.key === 'ArrowUp') { event.preventDefault(); setHighlightedCurrencyIndex((prev) => Math.max(prev - 1, 0)); return }
                            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); const active = CURRENCY_OPTIONS[highlightedCurrencyIndex]; if (active != null) selectCurrency(active.code); return }
                            if (event.key === 'Escape') { event.preventDefault(); setIsCurrencyOpen(false); currencyButtonRef.current?.focus() }
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
                                        className={`w-full rounded-xl p-3 flex items-center justify-between transition-all active:scale-[0.98] ${isSelected || isHighlighted ? 'bg-[#51e1a5]/10 border border-[#51e1a5]/20 text-[#51e1a5]' : 'bg-[#19202d] border border-transparent text-white/60 hover:text-white'}`}
                                        onMouseEnter={() => setHighlightedCurrencyIndex(index)}
                                        onClick={() => selectCurrency(option.code)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <CurrencyFlag code={option.code} />
                                            <span className="text-sm font-bold">{option.code}</span>
                                        </span>
                                        {isSelected && <span className="material-symbols-outlined text-[#51e1a5] text-[1rem]">check</span>}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            <div className="pt-3">
                <SmartGenerateCard betRows={betRows} setBetRows={setBetRows} isTwoDType={isTwoDType} />
            </div>

            <BetNumbersSummary betRows={betRows} validAmountTotal={validAmountTotal} currency={form.currency} />

            <fieldset className="m-0 mt-3 rounded-xl border border-white/12 bg-white/3 p-2.5 sm:p-3">
                <legend className="px-1 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">{t('bets.betNumbers')}</legend>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-0.5">
                {betRows.map((row) => (
                    <div key={row.id} className="rounded-xl border border-white/12 bg-[rgb(5_10_31_/_56%)] p-2.5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            {(() => {
                                const amt = Number(row.amount)
                                const valid = /^\d+$/.test(row.amount.trim()) && Number.isInteger(amt) && amt >= 1
                                return (
                                    <div>
                                        <p className="text-[0.6rem] text-white/30 uppercase tracking-widest leading-none">Potential Win</p>
                                        <p className={`text-[0.8rem] font-bold tabular-nums mt-0.5 leading-none ${valid ? 'text-[#51e1a5]' : 'text-white/20'}`}>
                                            {valid ? `x ${(amt * 80).toLocaleString()}` : '—'}
                                        </p>
                                    </div>
                                )
                            })()}
                            <button
                                type="button"
                                aria-label={t('bets.removeNumberRow')}
                                title={t('bets.removeNumberRow')}
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
                                <span className="material-symbols-outlined text-[1.1rem]">close</span>
                            </button>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-[0.74rem] text-[#8a9bb3]" htmlFor={`bet-number-${row.id}`}>
                                    {t('bets.numberRange', { range: isTwoDType ? '00-99' : '0-999' })}
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
                                    {t('bets.amount')}
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
                </div>

                <div className="flex items-center justify-between mt-2.5">
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-500/25 bg-red-500/8 text-red-400 text-[0.75rem] font-semibold uppercase tracking-wide hover:bg-red-500/15 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={betRows.length === 1 && betRows[0]?.number === '' && betRows[0]?.amount === ''}
                        onClick={() => {
                            setBetRows([createEmptyRow()])
                            setRowErrors({})
                        }}
                    >
                        <span className="material-symbols-outlined text-[1.1rem]">delete_sweep</span>
                        Clear All
                    </button>
                    <button
                        type="button"
                        aria-label={t('bets.addNumberRow')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#51e1a5]/30 bg-[#51e1a5]/8 text-[#51e1a5] text-[0.75rem] font-semibold uppercase tracking-wide hover:bg-[#51e1a5]/15 active:scale-95 transition-all"
                        onClick={() => setBetRows((prev) => [...prev, createEmptyRow()])}
                    >
                        <span className="material-symbols-outlined text-[1.1rem]">add</span>
                    </button>
                </div>
            </fieldset>

            <button
                type="button"
                aria-label={t('bets.nextStep')}
                className="mt-4 h-14 w-full bg-gradient-to-r from-[#00e676] to-[#2ac48b] rounded-2xl flex items-center justify-between px-6 shadow-[0_12px_24px_rgba(0,230,118,0.3)] active:scale-95 transition-all duration-300"
                onClick={goToStepThree}
            >
                <span className="font-semibold text-[0.9rem] text-[#003824] tracking-tight uppercase">{t('common.next')}</span>
                <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#003824] text-[20px]">arrow_forward</span>
                </div>
            </button>
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
    const { t } = useTranslation()
    return (
        <>
            <section className="rounded-xl border border-[rgb(245_158_11_/_22%)] bg-[rgb(245_158_11_/_8%)] p-3.5">
                <div className="mb-2.5">
                    <h3 className="m-0 text-[0.9rem] font-semibold text-[#fef3c7]">{t('bets.adminAccounts')}</h3>
                    <p className="m-0 mt-1 text-[0.74rem] leading-[1.45] text-[#fcd34d]">
                        {t('bets.transferNote', { currency: form.currency })}
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
                                    <dt className="text-[0.66rem] uppercase tracking-[0.06em] text-[#8a9bb3]">{t('bets.accountHolder')}</dt>
                                    <dd className="m-0 flex items-center justify-between gap-2">
                                        <span className="text-[0.8rem] text-[#f7f9ff]">{account.accountHolder}</span>
                                    </dd>
                                </div>

                                <div className="grid gap-0.5">
                                    <dt className="text-[0.66rem] uppercase tracking-[0.06em] text-[#8a9bb3]">{t('bets.accountNumber')}</dt>
                                    <dd className="m-0 flex items-center justify-between gap-2">
                                        <span className="text-[0.88rem] font-semibold tracking-[0.04em] text-[#fef3c7]">{account.accountNumber}</span>
                                        <button
                                            type="button"
                                            aria-label={copiedAccountKey === `${account.id}-number` ? t('bets.copiedAccountNumber') : t('bets.copyAccountNumber')}
                                            title={copiedAccountKey === `${account.id}-number` ? t('bets.copiedAccountNumber') : t('bets.copyAccountNumber')}
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
                        {t('bets.noAdminAccount', { currency: form.currency })}
                    </p>
                )}
            </section>

            {/* Payout Account */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">{t('bets.payoutAccount')}</span>
                    <Link
                        to="/user/bank-info"
                        className="text-[0.72rem] font-medium text-[#93c5fd] hover:text-[#60a5fa] transition-colors"
                    >
                        {bankInfo == null ? t('bets.setUpNow') : t('bets.manage')}
                    </Link>
                </div>

                {bankInfo == null ? (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-[rgb(245_158_11_/_35%)] bg-[rgb(245_158_11_/_6%)] px-3.5 py-3">
                        <span className="material-symbols-outlined text-[#fcd34d] text-[1.1rem] shrink-0">account_balance</span>
                        <div>
                            <p className="m-0 text-[0.78rem] font-medium text-[#fef3c7]">{t('bets.noPayoutAccount')}</p>
                            <p className="m-0 mt-0.5 text-[0.7rem] text-[#fcd34d]">{t('bets.addBankAccount')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-white/10 bg-[rgb(5_10_31_/_68%)] px-3.5 py-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#00e676] text-[1.1rem] shrink-0">account_balance</span>
                            <span className="text-[0.82rem] font-semibold text-[#f7f9ff]">{bankInfo.bank_name}</span>
                            <span className="ml-auto text-[0.66rem] uppercase tracking-widest text-[#00e676]/60 bg-[rgb(0_230_118_/_8%)] px-2 py-0.5 rounded-full">{t('bets.verified')}</span>
                        </div>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 m-0">
                            <div>
                                <dt className="text-[0.65rem] uppercase tracking-[0.06em] text-[#8a9bb3]">{t('bets.accountHolder')}</dt>
                                <dd className="m-0 mt-0.5 text-[0.8rem] text-[#f7f9ff]">{bankInfo.account_name}</dd>
                            </div>
                            <div>
                                <dt className="text-[0.65rem] uppercase tracking-[0.06em] text-[#8a9bb3]">{t('bets.accountNumber')}</dt>
                                <dd className="m-0 mt-0.5 text-[0.8rem] font-semibold tracking-[0.04em] text-[#e2e8f0]">{bankInfo.account_number}</dd>
                            </div>
                        </dl>
                        <p className="m-0 text-[0.68rem] text-[#8a9bb3]">{t('bets.winningsTransferred')}</p>
                        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/8">
                            <span className="material-symbols-outlined text-[#fcd34d] text-[1rem] shrink-0 mt-px">warning</span>
                            <p className="m-0 text-[0.68rem] text-[#fcd34d] leading-relaxed">{t('bets.doubleCheck')}</p>
                        </div>
                    </div>
                )}
            </div>

            <label className="block space-y-1.8">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">{t('bets.paySlipImage')}</span>
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
                <p className="m-0 text-[0.72rem] text-[#8a9bb3]">{t('bets.uploadImageHint')}</p>
                {form.pay_slip_image != null && (
                    <p className="m-0 text-[0.74rem] text-[#93c5fd]">{t('bets.selected', { name: form.pay_slip_image.name })}</p>
                )}
            </label>

            {/* Transaction ID */}
            <label className="block space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-[#8a9bb3]">
                        {t('bets.transactionIdLastTwo')}
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
                    placeholder={t('bets.transactionIdExample')}
                    required
                    value={form.transaction_id_last_two_digits}
                    onChange={(event) => {
                        const v = event.currentTarget.value.replace(/\D/g, '').slice(0, 2)
                        setForm((prev) => ({ ...prev, transaction_id_last_two_digits: v }))
                    }}
                />
                <p className="m-0 text-[0.72rem] text-[#8a9bb3]">
                    {t('bets.transactionIdHint')}
                </p>
            </label>

            <div className="my-3 rounded-xl border border-white/12 bg-[rgb(7_15_37_/_70%)] p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2 text-[0.82rem]">
                    <span className="text-[#8a9bb3]">{t('bets.estimatedTotal')}</span>
                    <strong className="text-[#f7f9ff]">{formatAmount(validAmountTotal, form.currency)}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        aria-label={t('bets.previousStep')}
                        title={t('bets.previousStep')}
                        className={`${apiButton} h-14 w-full !justify-between px-6`}
                        onClick={onBack}
                    >
                        <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
                        <span className="font-semibold text-[0.9rem] uppercase tracking-tight">{t('common.back')}</span>
                    </button>
                    <button
                        type="submit"
                        aria-label={t('bets.submitBet')}
                        title={t('bets.submitBet')}
                        className="h-16 w-full bg-gradient-to-r from-[#00e676] to-[#2ac48b] rounded-2xl flex items-center justify-between px-6 shadow-[0_12px_24px_rgba(0,230,118,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 group"
                        disabled={!canCreateForActiveType || isSubmitting}
                    >
                        <span className="font-semibold text-[0.9rem] text-[#003824] tracking-tight uppercase">
                            {isSubmitting ? t('bets.submitting') : t('bets.confirmWager')}
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
    goToStepTwo: _goToStepTwo,
    goToStepThree,
    setMessage,
    onSubmit,
}: BetCreateCardProps) {
    const { t } = useTranslation()
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
                    <h2 className="m-0 text-[1.12rem]">{t('bets.placeYourBet')}</h2>
                    <p className="m-0 mt-1 text-[0.8rem] text-[#8a9bb3]">{activeBetTypeCaption}</p>
                </div>
                <span className={`inline-flex rounded-full border px-2 py-1 text-[0.68rem] font-semibold tracking-[0.04em] ${typePillClassName}`}>
                    {t('bets.market', { label: activeBetTypeLabel })}
                </span>
            </div>


            <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
                {currentStep === 2 && (
                    <StepNumbers
                        form={form}
                        setForm={setForm}
                        betRows={betRows}
                        setBetRows={setBetRows}
                        rowErrors={rowErrors}
                        setRowErrors={setRowErrors}
                        isCurrencyOpen={isCurrencyOpen}
                        setIsCurrencyOpen={setIsCurrencyOpen}
                        highlightedCurrencyIndex={highlightedCurrencyIndex}
                        setHighlightedCurrencyIndex={setHighlightedCurrencyIndex}
                        selectedCurrency={selectedCurrency}
                        currencySelectRef={currencySelectRef}
                        currencyButtonRef={currencyButtonRef}
                        selectCurrency={selectCurrency}
                        isTwoDType={isTwoDType}
                        validAmountTotal={validAmountTotal}
                        goToStepThree={goToStepThree}
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
