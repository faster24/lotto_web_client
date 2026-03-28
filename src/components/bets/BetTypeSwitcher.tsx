import { apiCard } from '@/styles/tw'
import type { BetCreateInput } from '@/api/types'
import { betTypeCatalog } from './betTypeCatalog'

type Props = {
    activeBetTypeId: string
    onSelect: (id: string, payloadBetType: BetCreateInput['bet_type'] | undefined) => void
}

export function BetTypeSwitcher({ activeBetTypeId, onSelect }: Props) {
    return (
        <section className={`${apiCard} border-white/14 bg-[linear-gradient(162deg,rgb(11_19_43_/_95%)_0%,rgb(6_13_33_/_92%)_100%)]`}>
            <div className="mb-3">
                <h2 className="m-0 text-[1.15rem]">Choose your favourite</h2>
                <p className="m-0 mt-1 text-[0.78rem] text-[#8a9bb3]">2D or 3D to open the matching create card.</p>
            </div>
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
                            className={`min-h-[44px] cursor-pointer rounded-xl border px-3 py-2.5 text-left text-[0.8rem] font-semibold transition-colors ${tabClassName}`}
                            onClick={() => onSelect(item.id, item.payloadBetType)}
                        >
                            <span className="block text-[0.9rem]">{item.label}</span>
                            <span className="mt-0.5 block text-[0.73rem] font-medium text-[#8a9bb3]">{item.caption}</span>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
