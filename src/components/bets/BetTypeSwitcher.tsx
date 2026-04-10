import { useTranslation } from 'react-i18next'
import { apiCard } from '@/styles/tw'
import type { BetCreateInput } from '@/api/types'
import { betTypeCatalog } from './betTypeCatalog'

type Props = {
    activeBetTypeId: string
    onSelect: (id: string, payloadBetType: BetCreateInput['bet_type'] | undefined) => void
}

const captionKeyMap: Record<string, string> = {
    '2D': 'bets.twoDCaption',
    '3D': 'bets.threeDCaption',
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
                    const captionKey = captionKeyMap[item.id] ?? ''

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-controls={`bet-panel-${item.id}`}
                            id={`bet-tab-${item.id}`}
                            className={`cursor-pointer rounded-xl border p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${tabClassName}`}
                            onClick={() => onSelect(item.id, item.payloadBetType)}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${active ? 'bg-[rgb(0_230_118)] shadow-[0_0_15px_rgba(0,230,118,0.4)]' : 'bg-white/5 border border-white/10'}`}>
                                <span className={`text-2xl font-bold ${active ? 'text-[#003824]' : 'text-[#00e676]'}`}>{item.label}</span>
                            </div>
                            <p className={`m-0 text-[0.65rem] tracking-widest uppercase ${active ? 'font-bold text-[#00e676]' : 'font-medium text-[#8a9bb3]'}`}>
                                {captionKey ? t(captionKey) : item.caption}
                            </p>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
