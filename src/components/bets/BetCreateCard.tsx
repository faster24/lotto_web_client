import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { BetCreateInput, BetTargetOpenTime } from '@/api/types'
import { apiButton } from '@/styles/tw'
import {
    TARGET_OPEN_TIME_OPTIONS,
    TARGET_OPEN_TIME_LABELS,
    utcTotalMinutes,
    createEmptyRow,
    formatAmount,
    type BetCreateFormState,
    type BetNumberRow,
    type BetRowError,
} from './useBetsForm'
import { parsePastedBets } from './parsePastedBets'
import { parsePastedBets3D } from './parsePastedBets3D'

const DEV_BYPASS_OPEN_TIME =
    import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_OPEN_TIME === 'true'

// ── TargetOpenTimeSelector ───────────────────────────────────────────────────

// openTime values are MMT (e.g. '16:30:00'); offset to UTC by subtracting 6h30m
const MMT_OFFSET_MIN = 390

function secondsUntil(openTime: string): number {
    const parts = openTime.split(':')
    const h = parseInt(parts[0] ?? '0', 10)
    const m = parseInt(parts[1] ?? '0', 10)
    const s = parseInt(parts[2] ?? '0', 10)
    const now = new Date()
    const target = new Date()
    const closeMMT = h * 60 + m - 30
    target.setUTCHours(Math.floor((closeMMT - MMT_OFFSET_MIN) / 60), (closeMMT - MMT_OFFSET_MIN) % 60, s, 0)
    return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
}

function isSessionExpired(openTime: string): boolean {
    const parts = openTime.split(':')
    const h = parseInt(parts[0] ?? '0', 10)
    const m = parseInt(parts[1] ?? '0', 10)
    return utcTotalMinutes() >= h * 60 + m - MMT_OFFSET_MIN - 30
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

    if (!DEV_BYPASS_OPEN_TIME && isSessionExpired('16:30:00')) {
        return (
            <div className="mb-5">
                <p className="text-[0.6rem] font-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                    {t('bets.targetOpenTime')}
                </p>
                <div className="bg-[#1f2634] rounded-xl p-4 flex items-center gap-3 border border-red-500/20">
                    <span className="material-symbols-outlined text-red-400 text-[1.25rem]">lock</span>
                    <div>
                        <p className="text-sm font-bold text-red-400">Betting closed for today</p>
                        <p className="text-[0.6rem] text-white/40 font-medium uppercase tracking-tight mt-0.5">
                            Opens tomorrow at 12:01 PM (MMT)
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const availableOptions = DEV_BYPASS_OPEN_TIME
        ? TARGET_OPEN_TIME_OPTIONS
        : TARGET_OPEN_TIME_OPTIONS.filter((v) => !isSessionExpired(v))
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
                    {availableOptions.map((value) => {
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
                                    setForm((prev) => ({ ...prev, target_opentime: value as BetTargetOpenTime }))
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

type GeneratorKey = 'reverse' | 'double' | 'nakkhat' | 'power' | 'brother' | 'khway' | 'a-par' | 'paste'

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
    const [pasteText, setPasteText] = useState('')
    const pasteTextareaRef = useRef<HTMLTextAreaElement>(null)

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
            {
                key: 'paste' as GeneratorKey,
                icon: 'content_paste',
                label: 'Paste',
                description: 'Parse pasted bet text',
                fields: { number: false, amount: false },
            },
        ] : [
            {
                key: 'paste' as GeneratorKey,
                icon: 'content_paste',
                label: 'Paste',
                description: 'Parse pasted 3D bets (Direct & Box)',
                fields: { number: false, amount: false },
            },
        ]),
    ]

    const openModal = (key: GeneratorKey) => {
        setActiveGen(key)
        setModalNumber('')
        setModalAmount('')
        setModalError(null)
        setModalDigits(new Set())
        setModalIncludeDoubles(false)
        setPasteText('')
        if (key === 'paste') { setModalAmount('100'); setTimeout(() => pasteTextareaRef.current?.focus(), 50) }
    }

    const closeModal = () => {
        setActiveGen(null)
        setModalError(null)
        setPasteText('')
    }

    const mergeRows = (prev: BetNumberRow[], newRows: BetNumberRow[]): BetNumberRow[] => {
        const filled = prev.filter((r) => r.number !== '' || r.amount !== '')
        return filled.length > 0 ? [...filled, ...newRows] : newRows
    }

    const confirm = () => {
        setModalError(null)

        if (activeGen === 'paste') {
            const amt = modalAmount.trim()
            if (!/^\d+$/.test(amt) || Number(amt) < 1) {
                setModalError('Enter a valid default amount (integer ≥ 1).')
                return
            }
            const rows = isTwoDType
                ? parsePastedBets(pasteText, amt)
                : parsePastedBets3D(pasteText, amt)
            if (rows.length === 0) {
                setModalError(
                    isTwoDType
                        ? 'No valid 2-digit numbers found.'
                        : 'No valid 3-digit numbers found. Each line must start with a 3-digit number.',
                )
                return
            }
            setBetRows((prev) => mergeRows(prev, rows))
            closeModal()
            return
        }

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
                            {activeGen === 'paste' && (
                                <>
                                    <div>
                                        <label className="block text-[0.72rem] text-[#8a9bb3] mb-1.5">Default Amount</label>
                                        <input
                                            className="h-11 w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 text-[#f7f9ff] text-center text-xl font-bold tracking-widest focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
                                            type="number"
                                            min={1}
                                            step={1}
                                            placeholder="500"
                                            value={modalAmount}
                                            onChange={(e) => { setModalError(null); setModalAmount(e.currentTarget.value) }}
                                            autoFocus
                                        />
                                        <p className="mt-1 text-[0.62rem] text-white/35">Used when no amount is found on a line.</p>
                                    </div>
                                    <div>
                                        <label className="block text-[0.72rem] text-[#8a9bb3] mb-1.5">Bet Text</label>
                                        <textarea
                                            ref={pasteTextareaRef}
                                            rows={6}
                                            className="w-full rounded-xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-3 py-2.5 text-[#f7f9ff] text-sm leading-relaxed resize-none focus:border-[rgb(0_230_118_/_55%)] focus:outline-none"
                                            placeholder={isTwoDType ? `12.24.56 = 500\n12.25 = r600\n1ပါ 500\nပါဝါ 1000\nနက်ခတ် 500` : `123=500/200\n456.300r100\n789-1000-500`}
                                            value={pasteText}
                                            onChange={(e) => { setModalError(null); setPasteText(e.currentTarget.value) }}
                                        />
                                    </div>
                                    {pasteText.trim() && (
                                        (() => {
                                            const count = (isTwoDType ? parsePastedBets : parsePastedBets3D)(pasteText, modalAmount.trim() || '0').length
                                            return count > 0 ? (
                                                <p className="text-[0.72rem] text-[#51e1a5]">{count} bet row{count !== 1 ? 's' : ''} ready</p>
                                            ) : null
                                        })()
                                    )}
                                </>
                            )}
                            {activeGen !== 'paste' && activeDef.fields.number && (
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

                            {activeGen !== 'paste' && activeDef.fields.digits === true && (
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

                            {activeGen !== 'paste' && (
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
                            )}
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
                                {activeGen === 'paste' ? 'Apply' : 'Generate'}
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
    currency: BetCreateInput['currency']
    isTwoDType: boolean
    validAmountTotal: number
    goToStepThree: () => void
}

function StepNumbers({
    form, setForm,
    betRows, setBetRows,
    rowErrors, setRowErrors,
    currency,
    isTwoDType, validAmountTotal, goToStepThree,
}: StepNumbersProps) {
    const { t } = useTranslation()
    return (
        <>
            {isTwoDType && <TargetOpenTimeSelector form={form} setForm={setForm} />}

            <div className="pt-3">
                <SmartGenerateCard betRows={betRows} setBetRows={setBetRows} isTwoDType={isTwoDType} />
            </div>

            <BetNumbersSummary betRows={betRows} validAmountTotal={validAmountTotal} currency={currency} />

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

// ── StepConfirm (Step 3) ─────────────────────────────────────────────────────

type StepConfirmProps = {
    betRows: BetNumberRow[]
    validAmountTotal: number
    currency: BetCreateInput['currency']
    walletBalance: number
    isSubmitting: boolean
    message: string | null
    onBack: () => void
}

function StepConfirm({ betRows, validAmountTotal, currency, walletBalance, isSubmitting, message, onBack }: StepConfirmProps) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const isInsufficient = validAmountTotal > walletBalance
    const balanceAfter = walletBalance - validAmountTotal

    return (
        <>
            {/* Bet Summary */}
            <div className="rounded-xl border border-white/10 bg-[#0e131e] p-4">
                <p className="text-[0.65rem] font-bold text-white/40 uppercase tracking-widest mb-3">Bet Summary</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {betRows.filter((r) => r.number !== '').map((row) => {
                        const amt = Number(row.amount)
                        const valid = /^\d+$/.test(row.amount.trim()) && Number.isInteger(amt) && amt >= 1
                        return (
                            <span key={row.id} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.72rem] font-bold tabular-nums ${valid ? 'bg-[#51e1a5]/8 border border-[#51e1a5]/20 text-[#51e1a5]' : 'bg-amber-500/8 border border-amber-500/20 text-amber-400'}`}>
                                {row.number}
                                {row.amount !== '' && <span className="font-normal opacity-50">·{row.amount}</span>}
                            </span>
                        )
                    })}
                </div>
                <div className="flex justify-between pt-3 border-t border-white/8">
                    <p className="text-sm text-white/60">Total</p>
                    <p className="text-sm font-bold text-white">{validAmountTotal.toLocaleString()} {currency}</p>
                </div>
            </div>

            {/* Balance */}
            <div className="rounded-xl border border-white/10 bg-[#0e131e] p-4">
                <div className="flex justify-between mb-2">
                    <p className="text-sm text-white/60">{t('wallet.balance')}</p>
                    <p className="text-sm font-semibold text-white">{walletBalance.toLocaleString()} {currency}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-sm text-white/60">After this bet</p>
                    <p className={`text-sm font-semibold ${isInsufficient ? 'text-red-400' : 'text-[#00e676]'}`}>
                        {isInsufficient ? 'Insufficient' : `${balanceAfter.toLocaleString()} ${currency}`}
                    </p>
                </div>
            </div>

            {message != null && (
                <p className="text-red-400 text-sm">{message}</p>
            )}

            {isInsufficient && (
                <button
                    type="button"
                    onClick={() => navigate('/wallet-profile/deposit')}
                    className="w-full rounded-xl border border-[rgb(0_230_118_/_35%)] bg-[rgb(0_230_118_/_10%)] text-[#00e676] py-3 text-sm font-semibold hover:bg-[rgb(0_230_118_/_16%)] transition-colors"
                >
                    → Top up wallet
                </button>
            )}

            <div className="my-3 rounded-xl border border-white/12 bg-[rgb(7_15_37_/_70%)] p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2 text-[0.82rem]">
                    <span className="text-[#8a9bb3]">{t('bets.estimatedTotal')}</span>
                    <strong className="text-[#f7f9ff]">{formatAmount(validAmountTotal, currency)}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        aria-label={t('bets.previousStep')}
                        className={`${apiButton} h-14 w-full !justify-between px-6`}
                        onClick={onBack}
                    >
                        <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
                        <span className="font-semibold text-[0.9rem] uppercase tracking-tight">{t('common.back')}</span>
                    </button>
                    <button
                        type="submit"
                        aria-label={t('bets.submitBet')}
                        className="h-16 w-full bg-gradient-to-r from-[#00e676] to-[#2ac48b] rounded-2xl flex items-center justify-between px-6 shadow-[0_12px_24px_rgba(0,230,118,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 group"
                        disabled={isSubmitting || isInsufficient}
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
    currency: BetCreateInput['currency']
    copiedAccountKey: string | null
    copyAccountValue: (key: string, value: string) => Promise<void>
    canCreateForActiveType: boolean
    isTwoDType: boolean
    isThreeDType: boolean
    validAmountTotal: number
    walletBalance: number
    isSubmitting: boolean
    typePillClassName: string
    message: string | null
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
    rowErrors,
    setRowErrors,
    currency,
    copiedAccountKey: _copiedAccountKey,
    copyAccountValue: _copyAccountValue,
    canCreateForActiveType: _canCreateForActiveType,
    isTwoDType,
    validAmountTotal,
    walletBalance,
    isSubmitting,
    typePillClassName,
    message,
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
                        currency={currency}
                        isTwoDType={isTwoDType}
                        validAmountTotal={validAmountTotal}
                        goToStepThree={goToStepThree}
                    />
                )}

                {currentStep === 3 && (
                    <StepConfirm
                        betRows={betRows}
                        validAmountTotal={validAmountTotal}
                        currency={currency}
                        walletBalance={walletBalance}
                        isSubmitting={isSubmitting}
                        message={message}
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
