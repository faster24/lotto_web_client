import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import zarmaniLogo from '@/assets/Zarmani_Brand_logo.png'

type SessionResult = {
  label: string
  time: string
  value: string
}

const LIVE_API_URL = '/live-proxy'
const FIVE_MINUTES_MS = 5 * 60 * 1000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function sanitizeTwod(value: unknown): string {
  if (typeof value !== 'string' && typeof value !== 'number') return '--'
  const digits = String(value).replace(/\D/g, '')
  if (digits.length === 0) return '--'
  return digits.slice(-2).padStart(2, '0')
}

function readTwodValue(payload: unknown): string | null {
  if (!isRecord(payload)) return null

  const live = payload.live

  if (isRecord(live) && (typeof live.twod === 'string' || typeof live.twod === 'number')) {
    const digits = String(live.twod).replace(/\D/g, '')
    // Field present but no digits means market is closed / not yet announced.
    return digits.length > 0 ? digits.slice(-2).padStart(2, '0') : '--'
  }

  // Backward-compat fallback for nested legacy shape.
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

function readUpdatedTimeText(payload: unknown): string | null {
  if (!isRecord(payload)) return null
  const live = payload.live
  if (isRecord(live) && typeof live.time === 'string') return live.time
  if (typeof payload.server_time === 'string') return payload.server_time
  return null
}

function formatOpenTime(openTime: string): string {
  const parts = openTime.split(':')
  const hour = parseInt(parts[0] ?? '0', 10)
  const min = parts[1] ?? '00'
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${min} ${suffix}`
}

function sessionLabel(openTime: string): string {
  const hour = parseInt(openTime.split(':')[0] ?? '0', 10)
  if (hour < 12) return 'Morning'
  if (hour < 14) return 'Noon'
  if (hour < 17) return 'Evening'
  return 'Night'
}

function sessionIcon(label: string): string {
  if (label === 'Morning') return 'wb_twilight'
  if (label === 'Noon') return 'light_mode'
  return 'nights_stay'
}

const EXCLUDED_HOURS = new Set([11, 15])

function readSessionStats(payload: unknown): SessionResult[] {
  if (!isRecord(payload) || !Array.isArray(payload.result)) return []
  return (payload.result as unknown[])
    .filter(isRecord)
    .filter((r) => {
      const hour = parseInt((typeof r.open_time === 'string' ? r.open_time : '').split(':')[0] ?? '0', 10)
      return !EXCLUDED_HOURS.has(hour)
    })
    .map((r) => ({
      label: sessionLabel(typeof r.open_time === 'string' ? r.open_time : ''),
      time: formatOpenTime(typeof r.open_time === 'string' ? r.open_time : ''),
      value: sanitizeTwod(r.twod),
    }))
}

export function LiveNumberCard() {
  const [liveNumber, setLiveNumber] = useState('--')
  const [lastUpdatedTimeText, setLastUpdatedTimeText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionStats, setSessionStats] = useState<SessionResult[]>([])

  useEffect(() => {
    let mounted = true

    const refresh = async () => {
      try {
        const response = await fetch(LIVE_API_URL, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Live request failed (${response.status})`)

        const payload = (await response.json()) as unknown
        const next = readTwodValue(payload)
        const updatedAt = readUpdatedTimeText(payload)
        const stats = readSessionStats(payload)

        if (next == null) throw new Error('Unexpected live response shape')

        if (!mounted) return

        setLiveNumber(next)
        setLastUpdatedTimeText(updatedAt ?? new Date().toLocaleTimeString())
        setSessionStats(stats)
        setError(null)
      } catch {
        if (!mounted) return
        setError('Live update unavailable')
      }
    }

    void refresh()
    const intervalId = window.setInterval(() => void refresh(), FIVE_MINUTES_MS)
    return () => {
      mounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const lastUpdatedLabel = useMemo(
    () => (lastUpdatedTimeText == null ? 'Pending...' : `Updated ${lastUpdatedTimeText}`),
    [lastUpdatedTimeText],
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative w-60 h-60 flex items-center justify-center">
          {/* Glow rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[#51e1a5]/20 animate-pulse" />
          <div className="absolute inset-5 rounded-full border border-[#51e1a5]/10" />

          {/* Content */}
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden">
            <img src={zarmaniLogo} alt="Zarmani" className="w-full h-full object-cover opacity-50" />

            {/* Overlay: LIVE pill + number */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-1 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-[#51e1a5]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase font-bold text-white">LIVE</span>
              </div>
              <p className="text-5xl font-bold tracking-tighter text-white drop-shadow-lg">{liveNumber}</p>
              <p className="text-[10px] text-white/60">{lastUpdatedLabel}</p>
            </div>
          </div>
        </div>

        {error != null && (
          <p className="mt-2 text-[11px] text-red-400/80 text-center">{error}</p>
        )}
      </section>

      {/* Bento grid */}
      <section className="grid grid-cols-2 gap-3" aria-label="Current numbers">
        <div className="bg-[rgba(35,41,60,0.4)] backdrop-blur border border-[#3c4a3c]/20 rounded-xl p-5 flex flex-col items-center shadow-[0_0_20px_rgba(81,225,165,0.1)]">
          <span className="text-[10px] uppercase tracking-widest text-[#51e1a5] mb-2">Current 2D</span>
          <span className="text-4xl font-bold text-white">{liveNumber}</span>
        </div>
        <div className="bg-[rgba(35,41,60,0.4)] backdrop-blur border border-[#3c4a3c]/20 rounded-xl p-5 flex flex-col items-center shadow-[0_0_20px_rgba(81,225,165,0.1)]">
          <span className="text-[10px] uppercase tracking-widest text-[#51e1a5] mb-2">Current 3D</span>
          <span className="text-4xl font-bold text-white">--</span>
        </div>
      </section>

      {/* Daily Results */}
      <section>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-semibold text-white m-0">Daily Results</h2>
          <span className="text-[10px] text-white/30 uppercase tracking-wider">{lastUpdatedLabel}</span>
        </div>

        <div className="flex flex-col gap-2">
          {sessionStats.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-4">No results yet</p>
          ) : (
            sessionStats.map((stat, i) => (
              <div
                key={i}
                className="bg-[#151b2d] rounded-xl p-4 flex items-center justify-between hover:bg-[#23293c] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#2e3447] flex items-center justify-center text-[#51e1a5]">
                    <span className="material-symbols-outlined text-[1.2rem]">{sessionIcon(stat.label)}</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 leading-none mb-1">{stat.label}</p>
                    <p className="font-semibold text-base text-white leading-none">{stat.time}</p>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${stat.value === '--' ? 'text-white/25' : 'text-[#51e1a5]'}`}>
                  {stat.value}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <Link
        to="/tabs/bets"
        className="flex items-center justify-center h-14 rounded-xl bg-gradient-to-br from-[#51e1a5] to-[#2ac48b] text-[#003824] font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(81,225,165,0.3)] hover:opacity-90 active:scale-95 transition-all"
      >
        Place Bet
      </Link>
    </div>
  )
}
