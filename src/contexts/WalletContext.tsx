import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { getMyWallet, hasAuthToken } from '@/api/client'
import type { Wallet } from '@/api/types'

type WalletContextValue = {
  wallet: Wallet | null
  walletLoading: boolean
  walletError: string | null
  refreshWallet: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletLoading, setWalletLoading] = useState(true)
  const [walletError, setWalletError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchWallet = useCallback(async () => {
    if (!hasAuthToken()) {
      setWalletLoading(false)
      return
    }

    try {
      const response = await getMyWallet()
      setWallet(response.data.wallet)
      setWalletError(null)
    } catch (err) {
      setWalletError(err instanceof Error ? err.message : 'Failed to load wallet.')
    } finally {
      setWalletLoading(false)
    }
  }, [])

  const refreshWallet = useCallback(() => {
    void fetchWallet()
  }, [fetchWallet])

  useEffect(() => {
    void fetchWallet()

    const startPolling = () => {
      if (intervalRef.current != null) return
      intervalRef.current = setInterval(() => {
        if (!document.hidden && hasAuthToken()) {
          void fetchWallet()
        }
      }, 15_000)
    }

    const stopPolling = () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    startPolling()

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopPolling()
      } else {
        void fetchWallet()
        startPolling()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [fetchWallet])

  return (
    <WalletContext.Provider value={{ wallet, walletLoading, walletError, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (ctx == null) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
