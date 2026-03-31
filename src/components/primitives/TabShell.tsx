import { Link } from 'react-router-dom'

type TabShellItem = {
  id: string
  label: string
  path: string
}

type TabShellProps = {
  items: TabShellItem[]
  activeId: string
}

function TabIcon({ id }: { id: string }) {
  if (id === 'home') {
    return <span className="material-symbols-outlined text-[1.2rem] leading-none">grid_view</span>
  }
  if (id === 'bets') {
    return <span className="material-symbols-outlined text-[1.2rem] leading-none">confirmation_number</span>
  }
if (id === 'setting') {
    return <span className="material-symbols-outlined text-[1.2rem] leading-none">settings</span>
  }
  return <span className="material-symbols-outlined text-[1.2rem] leading-none">apps</span>
}

export function TabShell({ items, activeId }: TabShellProps) {
  return (
    <nav
      aria-label="Section tabs"
      className="flex justify-around items-center rounded-2xl border border-white/8 bg-[#23293c]/60 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      {items.map((item) => {
        const active = item.id === activeId
        return (
          <Link
            key={item.id}
            to={`/${item.path}`}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl transition-all ${
              active
                ? 'text-[#51e1a5] bg-[#51e1a5]/10 shadow-[0_0_15px_rgba(81,225,165,0.2)] scale-110'
                : 'text-white/50 hover:text-[#51e1a5]'
            }`}
          >
            <TabIcon id={item.id} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
