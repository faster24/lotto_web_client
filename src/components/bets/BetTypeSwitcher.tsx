import { useTranslation } from 'react-i18next'
import { apiCard } from '@/styles/tw'
import type { BetCreateInput } from '@/api/types'
import { betTypeCatalog } from './betTypeCatalog'
import { CardIcon } from '@/components/primitives/CardIcon'

type Props = {
    activeBetTypeId: string
    onSelect: (id: string, payloadBetType: BetCreateInput['bet_type'] | undefined) => void
}

const iconMap: Record<string, string> = {
    '2D': '/assets/icons/noun-two-7144005.svg',
    '3D': '/assets/icons/noun-three-7144024.svg',
}

export function BetTypeSwitcher({ activeBetTypeId, onSelect }: Props) {
    const { t } = useTranslation()

    return (
        <section className={`${apiCard} border-white/14 bg-[linear-gradient(162deg,rgb(11_19_43_/_95%)_0%,rgb(6_13_33_/_92%)_100%)]`}>
            <div className="mb-5">
                <span className="block text-[0.68rem] uppercase tracking-[0.15em] text-[#00e676] font-semibold">{t('bets.selectionCenter')}</span>
                <h2 className="m-0 mt-1 text-[1.15rem] font-bold tracking-tight">{t('bets.chooseFavourite')}</h2>
            </div>
            <div role="tablist" aria-label={t('bets.selectionCenter')} className="grid grid-cols-2 gap-4">
                {betTypeCatalog.map((item) => {
                    const active = item.id === activeBetTypeId
                    const tabClassName = active
                        ? 'border-[rgb(0_230_118_/_44%)] bg-[linear-gradient(140deg,rgb(0_230_118_/_16%)_0%,rgb(0_151_255_/_10%)_100%)] shadow-[0_0_20px_rgba(0,230,118,0.1)]'
                        : 'border-white/12 bg-white/3 hover:border-[rgb(0_230_118_/_28%)] hover:bg-white/5'
                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-controls={`bet-panel-${item.id}`}
                            id={`bet-tab-${item.id}`}
                            className={`aspect-square cursor-pointer overflow-hidden rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${tabClassName}`}
                            onClick={() => onSelect(item.id, item.payloadBetType)}
                        >
                            <CardIcon
                                src={iconMap[item.id] ?? ''}
                                color={active ? '#00e676' : 'rgba(255,255,255,0.25)'}
                                size="clamp(3.5rem, 16vw, 5rem)"
                            />
                            <div className="-mt-1 text-center">
                                <p className={`m-0 text-[0.95rem] font-bold uppercase tracking-wide ${active ? 'text-[#00e676]' : 'text-[#8a9bb3]'}`}>
                                    {item.label}
                                </p>
                                <p className="m-0 text-[0.65rem] tracking-wide text-[#8a9bb3]">{item.caption}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
