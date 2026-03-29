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
        d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm7.43-2.02c.04-.32.07-.64.07-.98s-.03-.67-.07-1l2.14-1.63c.19-.14.24-.42.12-.64l-2.03-3.46c-.12-.22-.39-.3-.61-.22l-2.52 1c-.53-.4-1.09-.73-1.71-.98L14.4 3.1c-.04-.24-.25-.42-.5-.42h-4c-.25 0-.46.18-.5.42l-.38 2.57c-.62.25-1.18.59-1.71.98l-2.52-1c-.23-.09-.49 0-.61.22L2.15 9.33c-.12.21-.08.5.12.64L4.41 11.5c-.04.33-.07.67-.07 1s.03.65.07.98L2.27 15.1c-.19.15-.24.42-.12.64l2.03 3.46c.12.22.39.3.61.22l2.52-1c.53.4 1.09.73 1.71.98l.38 2.57c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.57c.62-.25 1.18-.58 1.71-.98l2.52 1c.23.09.49 0 .61-.22l2.03-3.46c.12-.22.07-.49-.12-.64l-2.14-1.62Z"
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
