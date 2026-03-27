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
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.05rem]">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" fill="currentColor" />
      </svg>
    )
  }

  if (id === 'explore' || id === 'bets') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.05rem]">
        <path d="M14.8 9.2 9.5 11.5l-2.3 5.3 5.3-2.3 2.3-5.3Zm-2.8 1.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
        <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5A8.51 8.51 0 0 0 12 3.5Zm0 15a6.5 6.5 0 1 1 6.5-6.5 6.51 6.51 0 0 1-6.5 6.5Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.05rem]">
      <path
        d="M12 2.75a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5ZM4.75 10a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5ZM19.25 10a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5ZM12 15.75a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TabShell({ items, activeId }: TabShellProps) {
  return (
    <nav
      aria-label="Section tabs"
      className="grid grid-cols-3 gap-2 rounded-[1.25rem] border border-white/12 bg-[#121c38] p-2 shadow-[0_16px_38px_rgb(2_7_19_/_58%)] backdrop-blur"
    >
      {items.map((item) => {
        const active = item.id === activeId
        const activeClassName = active
          ? 'text-[#00e676] border-[rgb(0_230_118_/_44%)] bg-[linear-gradient(140deg,rgb(0_230_118_/_16%)_0%,rgb(0_151_255_/_10%)_100%)]'
          : 'text-[#8a9bb3] border-white/10 bg-transparent hover:-translate-y-[1px] hover:border-[rgb(0_230_118_/_28%)] hover:text-[#f7f9ff]'

        return (
          <Link
            key={item.id}
            className={`inline-grid justify-items-center gap-1 rounded-xl border px-2 py-2 text-[0.69rem] font-semibold leading-tight tracking-[0.01em] transition-all ${activeClassName}`}
            to={`/${item.path}`}
            aria-label={item.label}
          >
            <TabIcon id={item.id} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
