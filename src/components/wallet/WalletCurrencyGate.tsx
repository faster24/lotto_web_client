import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useWallet } from '@/contexts/WalletContext'

function LoadingScreen() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-[0.86rem] text-[#93c5fd]">Loading...</p>
    </div>
  )
}

export function RequireWalletCurrency({ children }: { children: ReactNode }) {
  const { wallet, walletLoading } = useWallet()
  const location = useLocation()

  if (walletLoading) {
    return <LoadingScreen />
  }

  if (wallet !== null && wallet.currency === null) {
    return (
      <Navigate
        replace
        to="/wallet/currency-setup"
        state={{ from: location.pathname }}
      />
    )
  }

  return <>{children}</>
}
