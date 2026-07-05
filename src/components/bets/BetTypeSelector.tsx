import { useNavigate } from 'react-router-dom'
import { CardIcon } from '@/components/primitives/CardIcon'

type CardConfig = {
  type: '2D' | '3D'
  path: string
  label: string
  caption: string
  icon: string
  accentColor: string
}

const cards: CardConfig[] = [
  {
    type: '2D',
    path: '/bets/2d',
    label: '2D',
    caption: 'Two-digit · Instant rounds',
    icon: '/assets/icons/noun-two-7144005.svg',
    accentColor: '#51e1a5',
  },
  {
    type: '3D',
    path: '/bets/3d',
    label: '3D',
    caption: 'Three-digit · Higher odds',
    icon: '/assets/icons/noun-three-7144024.svg',
    accentColor: '#93c5fd',
  },
]

export function BetTypeSelector() {
  const navigate = useNavigate()

  return (
    <section>
      <p className="mb-3 px-0.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#8a9bb3]">
        Select Game
      </p>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
        {cards.map(({ type, path, label, caption, icon, accentColor }) => (
          <li key={type}>
            <button
              type="button"
              onClick={() => navigate(path)}
              className="flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] transition-all duration-200 hover:border-white/16 hover:bg-white/5 active:scale-[0.97]"
            >
              <CardIcon src={icon} color={accentColor} size="clamp(3.5rem, 16vw, 5rem)" />

              <div className="-mt-1 text-center">
                <p className="m-0 text-[1.1rem] font-bold leading-tight text-[#f7f9ff]">{label}</p>
                <p className="m-0 text-[0.68rem] leading-tight text-[#8a9bb3]">{caption}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
