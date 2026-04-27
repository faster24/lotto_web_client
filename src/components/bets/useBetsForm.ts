import { type FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBet, listBankSettings } from '@/api/client'
import type { AdminBankSetting, BetCreateInput, BetTargetOpenTime } from '@/api/types'

// ── MMT Timezone Helpers ─────────────────────────────────────────────────────

export const MMT_OFFSET_MS = (6 * 60 + 30) * 60 * 1000 // UTC+6:30

export function mmtTotalMinutes(): number {
    const d = new Date(Date.now() + MMT_OFFSET_MS)
    return d.getUTCHours() * 60 + d.getUTCMinutes()
}

function getInitialOpenTime(): BetTargetOpenTime {
    return mmtTotalMinutes() < 12 * 60 + 1 ? '12:01:00' : '16:30:00'
}

// ── Types ────────────────────────────────────────────────────────────────────

export type BetCreateFormState = {
    pay_slip_image: File | null
    bet_type: BetCreateInput['bet_type']
    currency: BetCreateInput['currency']
    target_opentime: BetTargetOpenTime
    transaction_id_last_two_digits: string
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

export const TARGET_OPEN_TIME_OPTIONS: BetTargetOpenTime[] = ['12:01:00', '16:30:00']

export const TARGET_OPEN_TIME_LABELS: Record<string, string> = {
    '12:01:00': '12:01 PM',
    '16:30:00': '4:30 PM',
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
    { code: 'MMK', name: 'Myanmar Kyat', flagClass: 'fi-mm' },
    { code: 'THB', name: 'Thai Baht', flagClass: 'fi-th' },
]

function mapBankSetting(setting: AdminBankSetting): AdminPaymentAccount {
    return {
        id: String(setting.id),
        currency: setting.currency,
        bankName: setting.bank_name,
        accountHolder: setting.account_holder_name,
        accountNumber: setting.account_number,
    }
}

const initialForm: BetCreateFormState = {
    pay_slip_image: null,
    bet_type: '2D',
    currency: 'MMK',
    target_opentime: getInitialOpenTime(),
    transaction_id_last_two_digits: '',
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
    const navigate = useNavigate()
    const [form, setForm] = useState<BetCreateFormState>(initialForm)
    const [betRows, setBetRows] = useState<BetNumberRow[]>([createEmptyRow()])
    const [rowErrors, setRowErrors] = useState<Record<string, BetRowError>>({})
    const [message, setMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(2)
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
    const [highlightedCurrencyIndex, setHighlightedCurrencyIndex] = useState(0)
    const [copiedAccountKey, setCopiedAccountKey] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const currencySelectRef = useRef<HTMLDivElement | null>(null)
    const currencyButtonRef = useRef<HTMLButtonElement | null>(null)

    const [allBankSettings, setAllBankSettings] = useState<AdminPaymentAccount[]>([])
    const [bankSettingsLoading, setBankSettingsLoading] = useState(true)

    useEffect(() => {
        void (async () => {
            try {
                const response = await listBankSettings()
                setAllBankSettings(response.data.admin_bank_settings.filter(s => s.is_active).map(mapBankSetting))
            } finally {
                setBankSettingsLoading(false)
            }
        })()
    }, [])

    const isTwoDType = activePayloadBetType === '2D'
    const isThreeDType = activePayloadBetType === '3D'
    const canCreateForActiveType = activePayloadBetType != null
    const selectedCurrency = CURRENCY_OPTIONS.find((item) => item.code === form.currency) ?? CURRENCY_OPTIONS[0]!
    const paymentAccounts = allBankSettings.filter((account) => account.currency === form.currency)

    const validAmountTotal = betRows.reduce((sum, row) => {
        const parsed = Number(row.amount)
        if (!Number.isInteger(parsed) || parsed < 1) return sum
        return sum + parsed
    }, 0)

    const typePillClassName = isThreeDType
        ? 'border-[rgb(245_158_11_/_42%)] bg-[rgb(245_158_11_/_14%)] text-[#fbbf24]'
        : 'border-[rgb(0_230_118_/_42%)] bg-[rgb(0_230_118_/_14%)] text-[#86efac]'

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
                    if (number.length !== 2 || value < 0 || value > 99) {
                        rowError.number = 'Number must be between 00 and 99.'
                    }
                } else if (number.length > 3 || value < 0 || value > 999) {
                    rowError.number = 'Number must be between 0 and 999.'
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
            await createBet({
                pay_slip_image: form.pay_slip_image,
                bet_type: activePayloadBetType,
                currency: form.currency,
                ...(activePayloadBetType === '2D' ? { target_opentime: form.target_opentime } : {}),
                transaction_id_last_two_digits: form.transaction_id_last_two_digits,
                bet_numbers: normalized,
            })

            setMessage('Bet placed successfully!')
            navigate('/gambling/gambling-history')
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
        bankSettingsLoading,
        typePillClassName,
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
