import { useEffect, useState } from 'react'
import type { BetCreateInput, WalletBankInfo } from '@/api/types'
import { getMyBankInfo } from '@/api/client'
import { betTypeCatalog } from './betTypeCatalog'
import { useBetsForm, createEmptyRow } from './useBetsForm'
import { BetTypeSwitcher } from './BetTypeSwitcher'
import { BetCreateCard } from './BetCreateCard'
import { BetMessageModal } from './BetMessageModal'

export function BetsContent() {
    const defaultType = betTypeCatalog[0]
    const [activeBetTypeId, setActiveBetTypeId] = useState(defaultType?.id ?? '2D')
    const [bankInfo, setBankInfo] = useState<WalletBankInfo | null>(null)

    useEffect(() => {
        getMyBankInfo()
            .then((result) => setBankInfo(result.data.bank_info))
            .catch(() => setBankInfo(null))
    }, [])

    const activeBetType = betTypeCatalog.find((item) => item.id === activeBetTypeId) ?? defaultType
    const activePayloadBetType = activeBetType?.payloadBetType

    const form = useBetsForm(activeBetTypeId, activePayloadBetType)

    const handleTypeSelect = (id: string, payloadBetType: BetCreateInput['bet_type'] | undefined) => {
        setActiveBetTypeId(id)

        if (payloadBetType == null) {
            form.setMessage('This bet type is not available for create yet.')
            return
        }

        form.setForm((prev) => ({ ...prev, bet_type: payloadBetType }))
        form.setRowErrors({})
        form.setMessage(null)
        form.setCurrentStep(1)
        form.setBetRows([createEmptyRow()])
    }

    return (
        <>
            <BetTypeSwitcher
                activeBetTypeId={activeBetTypeId}
                onSelect={handleTypeSelect}
            />

            <BetCreateCard
                activeBetTypeId={activeBetTypeId}
                activeBetTypeLabel={activeBetType?.label ?? ''}
                activeBetTypeCaption={activeBetType?.caption ?? ''}
                currentStep={form.currentStep}
                setCurrentStep={form.setCurrentStep}
                form={form.form}
                setForm={form.setForm}
                betRows={form.betRows}
                setBetRows={form.setBetRows}
                rowErrors={form.rowErrors}
                setRowErrors={form.setRowErrors}
                isCurrencyOpen={form.isCurrencyOpen}
                setIsCurrencyOpen={form.setIsCurrencyOpen}
                highlightedCurrencyIndex={form.highlightedCurrencyIndex}
                setHighlightedCurrencyIndex={form.setHighlightedCurrencyIndex}
                selectedCurrency={form.selectedCurrency}
                currencySelectRef={form.currencySelectRef}
                currencyButtonRef={form.currencyButtonRef}
                fileInputRef={form.fileInputRef}
                paymentAccounts={form.paymentAccounts}
                copiedAccountKey={form.copiedAccountKey}
                copyAccountValue={form.copyAccountValue}
                selectCurrency={form.selectCurrency}
                canCreateForActiveType={form.canCreateForActiveType}
                isTwoDType={form.isTwoDType}
                isThreeDType={form.isThreeDType}
                validAmountTotal={form.validAmountTotal}
                isSubmitting={form.isSubmitting}
                typePillClassName={form.typePillClassName}
                goToStepTwo={form.goToStepTwo}
                goToStepThree={form.goToStepThree}
                setMessage={form.setMessage}
                onSubmit={form.onSubmit}
                bankInfo={bankInfo}
            />

            {form.message != null && (
                <BetMessageModal
                    message={form.message}
                    onClose={() => form.setMessage(null)}
                />
            )}
        </>
    )
}
