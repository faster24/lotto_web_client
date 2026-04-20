import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LIVE_API_URL = '/live-proxy'
const FIVE_MINUTES_MS = 60 * 1000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readTwodValue(payload: unknown): string | null {
  if (!isRecord(payload)) return null
  const live = payload.live
  if (isRecord(live) && (typeof live.twod === 'string' || typeof live.twod === 'number')) {
    const digits = String(live.twod).replace(/\D/g, '')
    return digits.length > 0 ? digits.slice(-2).padStart(2, '0') : '--'
  }
  const payout = payload.payout
  if (!isRecord(payout)) return null
  const payoutLive = payout.live
  if (!isRecord(payoutLive)) return null
  const twod = payoutLive.twod
  if (!isRecord(twod)) return null
  const value = twod.value
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const digits = String(value).replace(/\D/g, '')
  return digits.length > 0 ? digits.slice(-2).padStart(2, '0') : null
}

export function SelectionCenter() {
  const navigate = useNavigate()
  const [liveNumber, setLiveNumber] = useState('--')

  useEffect(() => {
    let mounted = true

    const refreshLive = async () => {
      try {
        const res = await fetch(LIVE_API_URL, { cache: 'no-store' })
        if (!res.ok) return
        const payload = (await res.json()) as unknown
        const next = readTwodValue(payload)
        if (mounted && next != null) setLiveNumber(next)
      } catch {
        // silent — UI shows '--'
      }
    }

    void refreshLive()
    const id = window.setInterval(() => void refreshLive(), FIVE_MINUTES_MS)
    return () => {
      mounted = false
      window.clearInterval(id)
    }
  }, [])

  const goToPlace = (betType: '2D' | '3D') => {
    void navigate(betType === '2D' ? '/bets/2d' : '/bets/3d')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#51e1a5] font-bold">
            Choose your game
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase mt-0.5">
            Selection Center
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#51e1a5] animate-pulse" />
          <span className="text-[0.6rem] font-bold text-[#51e1a5] uppercase tracking-widest">
            Live Rounds
          </span>
        </div>
      </div>

      {/* 3D Featured card */}
      <div
        className="relative overflow-hidden rounded-xl bg-[#19202d] border border-[#51e1a5]/20 shadow-[0_0_24px_rgba(81,225,165,0.08)] active:scale-[0.98] transition-transform duration-200 cursor-pointer"
        onClick={() => goToPlace('3D')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#51e1a5]/8 via-transparent to-[#0097ff]/6 pointer-events-none" />
        <div className="relative z-10 p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <span className="px-3 py-1 bg-[#51e1a5] text-[#003824] text-[0.6rem] font-semibold uppercase tracking-widest rounded-full shadow-[0_0_12px_rgba(81,225,165,0.4)]">
              Featured Dimension
            </span>
            <span className="material-symbols-outlined text-[#51e1a5] text-xl">rocket_launch</span>
          </div>
          <div>
            <h3 className="text-4xl font-bold tracking-tight text-white">3D ROUNDS</h3>
            <p className="text-sm text-white/50 font-medium mt-1">
              Three-digit premium rounds with higher multipliers.
            </p>
          </div>
          <button
            type="button"
            className="self-start flex items-center gap-2 px-6 py-3 bg-[#51e1a5] text-[#003824] rounded-lg font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform shadow-[0_0_16px_rgba(81,225,165,0.3)]"
            onClick={(e) => { e.stopPropagation(); goToPlace('3D') }}
          >
            Enter Arena
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 2D + Multiplier row */}
      <div className="flex flex-col gap-4">
        {/* 2D Classic card */}
        <div
          className="relative overflow-hidden rounded-xl bg-[#19202d] border border-white/8 flex flex-col justify-between p-5 gap-3 active:scale-[0.98] transition-transform duration-200 cursor-pointer"
          onClick={() => goToPlace('2D')}
        >
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#51e1a5]">2D CLASSIC</h3>
            <p className="text-[0.6rem] text-white/40 font-bold uppercase tracking-widest mt-0.5">
              Instant Results
            </p>
          </div>
          <p className="text-4xl font-bold text-white">{liveNumber}</p>
          <button
            type="button"
            className="w-full py-2.5 bg-[#23293c] text-[#51e1a5] border border-[#51e1a5]/20 rounded-lg font-bold text-xs uppercase tracking-widest flex justify-center items-center gap-1.5 active:scale-95 transition-transform hover:bg-[#51e1a5]/10"
            onClick={(e) => { e.stopPropagation(); goToPlace('2D') }}
          >
            Quick Play
            <span className="material-symbols-outlined text-sm">bolt</span>
          </button>
        </div>

        {/* Active Multiplier card */}
        <div className="rounded-xl bg-[#19202d] border-l-4 border-[#51e1a5] border border-white/8 flex flex-col justify-center p-5 gap-1">
          <p className="text-[0.6rem] font-semibold text-[#51e1a5] uppercase tracking-widest">
            Active Multiplier
          </p>
          <p className="text-3xl font-bold text-white">
            x80
          </p>
          <p className="text-[0.6rem] text-white/40 font-bold uppercase tracking-widest mt-0.5">
            Premium Bonus Active
          </p>
        </div>
      </div>
    </div>
  )
}
