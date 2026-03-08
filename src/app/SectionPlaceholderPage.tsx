import { Link } from 'react-router-dom'
import { AppHeader } from '@/components/primitives/AppHeader'
import { SurfaceCard } from '@/components/primitives/SurfaceCard'
import { TabShell } from '@/components/primitives/TabShell'
import { type AppSectionId, routeMap } from './routeMap'

const sectionTitleMap: Record<AppSectionId, string> = {
  auth: 'Auth',
  tabs: 'Tabs',
  gambling: 'Gambling',
  'wallet-profile': 'Wallet Profile',
}

type SectionPlaceholderPageProps = {
  section: AppSectionId
  routeId: string
}

export function SectionPlaceholderPage({ section, routeId }: SectionPlaceholderPageProps) {
  const sectionRoutes = routeMap[section]
  const activeRoute = sectionRoutes.find((route) => route.id === routeId) ?? sectionRoutes[0]

  if (activeRoute == null) {
    return null
  }

  const headerTitle = `${sectionTitleMap[section]} / ${activeRoute.label}`

  return (
    <div className="screen-root" data-testid="app-shell">
      <AppHeader
        title={headerTitle}
        subtitle="Lottery web recreation"
        statusText="UI foundation active"
      />

      <main className="screen-scroll">
        <SurfaceCard
          title="Route placeholder"
          eyebrow={sectionTitleMap[section]}
          description={activeRoute.description}
        >
          <p className="body-copy">
            This baseline locks in the shell, spacing, and theme tokens before detailed page ports.
          </p>
        </SurfaceCard>

        {section === 'tabs' ? <TabShell items={routeMap.tabs} activeId={routeId} /> : null}

        <SurfaceCard
          title="Section route map"
          description="Each link is wired and ready for feature-specific UI implementation."
        >
          <div className="route-pill-grid">
            {sectionRoutes.map((route) => {
              const routeClassName = route.id === routeId ? 'route-pill route-pill--active' : 'route-pill'

              return (
                <Link key={route.path} className={routeClassName} to={`/${route.path}`}>
                  {route.label}
                </Link>
              )
            })}
          </div>
        </SurfaceCard>
      </main>
    </div>
  )
}
