import { useNavigate } from 'react-router-dom'

type CardConfig = {
  type: '2D' | '3D'
  path: string
  label: string
  caption: string
  icon: string
  accentColor: string
  bgAccent: string
}

const cards: CardConfig[] = [
  {
    type: '2D',
    path: '/bets/2d',
    label: '2D Classic',
    caption: 'Two-digit · Instant rounds',
    icon: 'bolt',
    accentColor: '#51e1a5',
    bgAccent: 'rgba(81,225,165,0.08)',
  },
  {
    type: '3D',
    path: '/bets/3d',
    label: '3D Premium',
    caption: 'Three-digit · Higher odds',
    icon: 'rocket_launch',
    accentColor: '#93c5fd',
    bgAccent: 'rgba(147,197,253,0.08)',
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
        {cards.map(({ type, path, label, caption, icon, accentColor, bgAccent }) => (
          <li key={type}>
            <button
              type="button"
              onClick={() => navigate(path)}
              className="relative w-full overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-4 text-left transition-all duration-200 hover:border-white/16 hover:bg-white/5 active:scale-[0.97]"
            >
              <div
                className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: bgAccent }}
              >
                <span className="material-symbols-outlined text-[1.1rem]" style={{ color: accentColor }}>
                  {icon}
                </span>
              </div>

              <p className="m-0 text-[0.88rem] font-bold leading-tight text-[#f7f9ff]">{label}</p>
              <p className="m-0 mt-0.5 text-[0.68rem] leading-tight text-[#8a9bb3]">{caption}</p>

              <span
                className="absolute right-3 top-3 material-symbols-outlined text-[1rem]"
                style={{ color: accentColor, opacity: 0.6 }}
              >
                arrow_forward
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
