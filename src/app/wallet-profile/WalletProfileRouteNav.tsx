import { Link } from 'react-router-dom'
import { routeMap } from '@/app/routeMap'

type WalletProfileRouteId = (typeof routeMap['wallet-profile'])[number]['id']

type WalletProfileRouteNavProps = {
  activeId: WalletProfileRouteId
}

export function WalletProfileRouteNav({ activeId }: WalletProfileRouteNavProps) {
  return (
    <nav aria-label="Wallet and profile routes" className="wallet-profile-route-nav">
      {routeMap['wallet-profile'].map((route) => {
        const className =
          route.id === activeId
            ? 'wallet-profile-route-nav__link wallet-profile-route-nav__link--active'
            : 'wallet-profile-route-nav__link'

        return (
          <Link key={route.id} to={`/${route.path}`} className={className}>
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}
