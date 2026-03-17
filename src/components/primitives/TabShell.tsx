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
      <svg aria-hidden="true" viewBox="0 0 24 24" className="tab-shell__icon">
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (id === 'explore') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="tab-shell__icon">
        <path
          d="M14.8 9.2 9.5 11.5l-2.3 5.3 5.3-2.3 2.3-5.3Zm-2.8 1.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
          fill="currentColor"
        />
        <path
          d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5A8.51 8.51 0 0 0 12 3.5Zm0 15a6.5 6.5 0 1 1 6.5-6.5 6.51 6.51 0 0 1-6.5 6.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="tab-shell__icon">
      <path
        d="M12 2.75a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5ZM4.75 10a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5ZM19.25 10a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5ZM12 15.75a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TabShell({ items, activeId }: TabShellProps) {
  return (
    <nav aria-label="Section tabs" className="tab-shell">
      {items.map((item) => {
        const activeClassName = item.id === activeId ? 'tab-shell__item tab-shell__item--active' : 'tab-shell__item'

        return (
          <Link key={item.id} className={activeClassName} to={`/${item.path}`} aria-label={item.label}>
            <TabIcon id={item.id} />
            <span className="tab-shell__label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
