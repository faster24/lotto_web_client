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

export function TabShell({ items, activeId }: TabShellProps) {
  return (
    <nav aria-label="Section tabs" className="tab-shell">
      {items.map((item) => {
        const activeClassName = item.id === activeId ? 'tab-shell__item tab-shell__item--active' : 'tab-shell__item'

        return (
          <Link key={item.id} className={activeClassName} to={`/${item.path}`}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
