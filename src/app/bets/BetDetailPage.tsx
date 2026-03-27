import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { deleteBetById, getBetById } from '@/api/client'
import type { Bet } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function BetDetailPage() {
  const { betId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bet, setBet] = useState<Bet | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      if (betId == null) {
        setError('Missing bet id.')
        setLoading(false)
        return
      }

      try {
        const response = await getBetById(betId)
        setBet(response.data.bet)
      } catch {
        setError('Unable to load bet detail.')
      } finally {
        setLoading(false)
      }
    })()
  }, [betId])

  const onDelete = async () => {
    if (betId == null) {
      return
    }

    try {
      const response = await deleteBetById(betId)
      setMessage(response.message)
      setBet(null)
    } catch {
      setMessage('Delete failed.')
    }
  }

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="bet-detail-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Bet</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Bet Detail</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Detail, delete, pay-slip and payout-proof actions.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={bet == null} emptyMessage="Bet not found." />

        {bet != null && (
          <section className={apiCard}>
            <h2 className="m-0 mb-2 text-[1.12rem]">{bet.id}</h2>
            <p>{bet.bet_type} · {bet.total_amount} {bet.currency}</p>
            <p>Status: {bet.status} / {bet.payout_status}</p>
            <div className="grid gap-2">
              <button type="button" className={apiButton} onClick={() => setMessage('Pay slip download started (mock).')}>
                Download Pay Slip
              </button>
              <button type="button" className={apiButton} onClick={() => setMessage('Payout proof download started (mock).')}>
                Download Payout Proof
              </button>
              <button type="button" className={apiButton} onClick={() => void onDelete()}>
                Delete Bet
              </button>
            </div>
          </section>
        )}

        {message != null && <p className="m-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{message}</p>}
        <Link className={apiButton} to="/bets">Back to bets</Link>
      </main>
    </div>
  )
}
