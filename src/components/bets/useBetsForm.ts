import { type FormEvent, useEffect, useRef, useState } from 'react'
import { createBet, listBets } from '@/api/client'
import type { Bet, BetCreateInput } from '@/api/types'

// ── Types ────────────────────────────────────────────────────────────────────

export type BetCreateFormState = {
    pay_slip_image: File | null
    bet_type: BetCreateInput['bet_type']
    currency: BetCreateInput['currency']
    target_opentime: BetCreateInput['target_opentime']
}

export type BetNumberRow = {
    id: string
    number: string
    amount: string
}

export type BetRowError = {
    number?: string
    amount?: string
}

export type CurrencyOption = {
    code: BetCreateInput['currency']
    name: string
    flagClass: string
}

export type AdminPaymentAccount = {
    id: string
    currency: BetCreateInput['currency']
    bankName: string
    accountHolder: string
    accountNumber: string
    note?: string
}

// ── Constants ────────────────────────────────────────────────────────────────

export const TARGET_OPEN_TIME_OPTIONS: BetCreateInput['target_opentime'][] = ['12:01:00', '16:30:00']

export const CURRENCY_OPTIONS: CurrencyOption[] = [
    { code: 'MMK', name: 'Myanmar Kyat', flagClass: 'fi-mm' },
    { code: 'THB', name: 'Thai Baht', flagClass: 'fi-th' },
]

export const ADMIN_PAYMENT_ACCOUNTS: AdminPaymentAccount[] = [
    {
        id: 'kbz-main',
        currency: 'MMK',
        bankName: 'KBZ Bank',
        accountHolder: 'Zarmani108 Trading Co., Ltd',
        accountNumber: '027123456789001',
        note: 'Primary collection account',
    },
    {
        id: 'aya-alt-mmk',
        currency: 'MMK',
        bankName: 'AYA Bank',
        accountHolder: 'Zarmani108 Trading Co., Ltd',
        accountNumber: '011987654321008',
        note: 'Use if KBZ transfer is unavailable',
    },
    {
        id: 'kbank-thb',
        currency: 'THB',
        bankName: 'Kasikornbank',
        accountHolder: 'Zarmani108 Trading Thailand',
        accountNumber: '014-2-78901-7',
        note: 'Thai Baht transfer account',
    },
    {
        id: 'scb-thb',
        currency: 'THB',
        bankName: 'Siam Commercial Bank',
        accountHolder: 'Zarmani108 Trading Co., Ltd',
        accountNumber: '405-889-1034',
        note: 'Alternative THB account',
    },
]

const initialForm: BetCreateFormState = {
    pay_slip_image: null,
    bet_type: '2D',
    currency: 'MMK',
    target_opentime: '12:01:00',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function createEmptyRow(): BetNumberRow {
    return { id: crypto.randomUUID(), number: '', amount: '' }
}

export function formatAmount(value: number, currency: BetCreateInput['currency']) {
    if (!Number.isFinite(value) || value < 0) {
        return `0 ${currency}`
    }
    return `${value.toLocaleString()} ${currency}`
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useBetsForm(_activeBetTypeId: string, activePayloadBetType: BetCreateInput['bet_type'] | undefined) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [bets, setBets] = useState<Bet[]>([])
    const [form, setForm] = useState<BetCreateFormState>(initialForm)
    const [betRows, setBetRows] = useState<BetNumberRow[]>([createEmptyRow()])
    const [rowErrors, setRowErrors] = useState<Record<string, BetRowError>>({})
    const [message, setMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
    const [highlightedCurrencyIndex, setHighlightedCurrencyIndex] = useState(0)
    const [copiedAccountKey, setCopiedAccountKey] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const currencySelectRef = useRef<HTMLDivElement | null>(null)
    const currencyButtonRef = useRef<HTMLButtonElement | null>(null)

    const isTwoDType = activePayloadBetType === '2D'
    const isThreeDType = activePayloadBetType === '3D'
    const canCreateForActiveType = activePayloadBetType != null
    const filteredBets = activePayloadBetType == null ? [] : bets.filter((bet) => bet.bet_type === activePayloadBetType)
    const showBetList = activePayloadBetType !== '2D'
    const selectedCurrency = CURRENCY_OPTIONS.find((item) => item.code === form.currency) ?? CURRENCY_OPTIONS[0]!
    const paymentAccounts = ADMIN_PAYMENT_ACCOUNTS.filter((account) => account.currency === form.currency)

    const validAmountTotal = betRows.reduce((sum, row) => {
        const parsed = Number(row.amount)
        if (!Number.isInteger(parsed) || parsed < 1) return sum
        return sum + parsed
    }, 0)

    const typePillClassName = isThreeDType
        ? 'border-[rgb(245_158_11_/_42%)] bg-[rgb(245_158_11_/_14%)] text-[#fbbf24]'
        : 'border-[rgb(0_230_118_/_42%)] bg-[rgb(0_230_118_/_14%)] text-[#86efac]'

    const stepActiveClassName = isThreeDType
        ? 'border-[rgb(245_158_11_/_44%)] bg-[rgb(245_158_11_/_14%)] text-[#fbbf24]'
        : 'border-[rgb(59_130_246_/_42%)] bg-[rgb(59_130_246_/_16%)] text-[#93c5fd]'

    const stepDoneClassName = isThreeDType
        ? 'border-[rgb(245_158_11_/_35%)] bg-[rgb(245_158_11_/_10%)] text-[#fde68a]'
        : 'border-[rgb(0_230_118_/_35%)] bg-[rgb(0_230_118_/_14%)] text-[#86efac]'

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
        if (!isCurrencyOpen) return
        const selectedIndex = CURRENCY_OPTIONS.findIndex((item) => item.code === form.currency)
        setHighlightedCurrencyIndex(selectedIndex === -1 ? 0 : selectedIndex)
    }, [form.currency, isCurrencyOpen])

    useEffect(() => {
        if (!isCurrencyOpen) return
        const onMouseDown = (event: MouseEvent) => {
            if (currencySelectRef.current == null) return
            if (!currencySelectRef.current.contains(event.target as Node)) {
                setIsCurrencyOpen(false)
            }
        }
        document.addEventListener('mousedown', onMouseDown)
        return () => { document.removeEventListener('mousedown', onMouseDown) }
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

            normalized.push({ number, amount: amountValue })
        })

        return { errors, normalized }
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setMessage(null)

        if (currentStep !== 3) return

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

    const copyAccountValue = async (key: string, value: string) => {
        try {
            await navigator.clipboard?.writeText(value)
            setCopiedAccountKey(key)
            window.setTimeout(() => setCopiedAccountKey((current) => (current === key ? null : current)), 1200)
        } catch {
            setMessage('Unable to copy account detail.')
        }
    }

    return {
        // data
        loading,
        error,
        bets,
        filteredBets,
        showBetList,
        // form
        form,
        setForm,
        betRows,
        setBetRows,
        rowErrors,
        setRowErrors,
        currentStep,
        setCurrentStep,
        // currency dropdown
        isCurrencyOpen,
        setIsCurrencyOpen,
        highlightedCurrencyIndex,
        setHighlightedCurrencyIndex,
        selectedCurrency,
        currencySelectRef,
        currencyButtonRef,
        // file upload
        fileInputRef,
        // computed
        isTwoDType,
        isThreeDType,
        canCreateForActiveType,
        validAmountTotal,
        paymentAccounts,
        typePillClassName,
        stepActiveClassName,
        stepDoneClassName,
        // feedback
        message,
        setMessage,
        isSubmitting,
        copiedAccountKey,
        // handlers
        selectCurrency,
        copyAccountValue,
        goToStepTwo,
        goToStepThree,
        onSubmit,
    }
}
