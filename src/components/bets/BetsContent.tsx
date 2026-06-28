import { useState } from 'react'
import { betTypeCatalog } from './betTypeCatalog'
import { useBetsForm } from './useBetsForm'
import { BetCreateCard } from './BetCreateCard'
import { BetMessageModal } from './BetMessageModal'

type Props = {
    initialBetTypeId?: string
}

export function BetsContent({ initialBetTypeId }: Props) {
    const defaultType = betTypeCatalog[0]
    const [activeBetTypeId] = useState(initialBetTypeId ?? defaultType?.id ?? '2D')

    const activeBetType = betTypeCatalog.find((item) => item.id === activeBetTypeId) ?? defaultType
    const activePayloadBetType = activeBetType?.payloadBetType

    const form = useBetsForm(activeBetTypeId, activePayloadBetType)

    return (
        <>
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
                currency={form.currency}
                copiedAccountKey={form.copiedAccountKey}
                copyAccountValue={form.copyAccountValue}
                canCreateForActiveType={form.canCreateForActiveType}
                isTwoDType={form.isTwoDType}
                isThreeDType={form.isThreeDType}
                validAmountTotal={form.validAmountTotal}
                walletBalance={form.walletBalance}
                isSubmitting={form.isSubmitting}
                typePillClassName={form.typePillClassName}
                message={form.message}
                goToStepTwo={form.goToStepTwo}
                goToStepThree={form.goToStepThree}
                setMessage={form.setMessage}
                onSubmit={form.onSubmit}
                pin={form.pin}
                onPinChange={form.setPin}
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
