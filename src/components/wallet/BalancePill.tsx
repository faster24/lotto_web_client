import { useWallet } from '@/contexts/WalletContext'

export function BalancePill() {
  const { wallet, walletLoading } = useWallet()

  if (walletLoading) {
    return (
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.72rem] font-bold text-white/30">
        ---
      </span>
    )
  }

  if (wallet == null) return null

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#00e676]/25 bg-[#00e676]/10 px-2.5 py-0.5 text-[0.72rem] font-bold text-[#00e676]">
      {wallet.balance.toLocaleString()} {wallet.currency}
    </span>
  )
}
