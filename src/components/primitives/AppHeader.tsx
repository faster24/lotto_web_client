type AppHeaderProps = {
  title: string
  subtitle: string
  statusText?: string
}

export function AppHeader({ title, subtitle, statusText = 'Foundation' }: AppHeaderProps) {
  return (
    <header className="app-header">
      <p className="app-header__subtitle">{subtitle}</p>
      <h1>{title}</h1>
      <p className="app-header__status">
        <span aria-hidden className="app-header__status-dot" />
        {statusText}
      </p>
    </header>
  )
}
