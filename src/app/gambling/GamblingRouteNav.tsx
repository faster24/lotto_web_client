import { Link } from 'react-router-dom'
import { routeMap } from '@/app/routeMap'

type GamblingRouteId = (typeof routeMap.gambling)[number]['id']

type GamblingRouteNavProps = {
  activeId: GamblingRouteId
}

export function GamblingRouteNav({ activeId }: GamblingRouteNavProps) {
  return (
    <nav aria-label="Gambling section routes" className="gambling-route-nav">
      {routeMap.gambling.map((route) => {
        const className =
          route.id === activeId ? 'gambling-route-nav__link gambling-route-nav__link--active' : 'gambling-route-nav__link'

        return (
          <Link key={route.id} to={`/${route.path}`} className={className}>
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}
