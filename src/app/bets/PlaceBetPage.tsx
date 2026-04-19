import { useNavigate } from 'react-router-dom'
import { BetsContent } from '@/components/bets/BetsContent'
import { screenRoot, screenScroll, tabScreen } from '@/styles/tw'

type Props = {
    betType: '2D' | '3D'
}

export function PlaceBetPage({ betType }: Props) {
    const navigate = useNavigate()

    return (
        <div className={`${screenRoot} ${tabScreen}`} data-testid="place-bet-page">
            <header className="sticky top-0 z-30 flex items-center justify-between px-5 h-14 bg-[#090e18]/80 backdrop-blur border-b border-white/5">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/8 active:scale-90 transition-all"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                    >
                        <span className="material-symbols-outlined text-white/40 text-xl">chevron_left</span>
                    </button>
                    <span className="text-[0.68rem] font-bold uppercase tracking-widest text-white/40">
                        {betType} Flash Mode
                    </span>
                </div>
            </header>

            <main className={screenScroll}>
                <BetsContent initialBetTypeId={betType} />
            </main>
        </div>
    )
}
