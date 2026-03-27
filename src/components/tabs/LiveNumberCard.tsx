import { useEffect, useMemo, useState } from 'react'

type SessionStat = {
  label: string
  value: string
  highlight?: boolean
}

const DEFAULT_SESSION_STATS: SessionStat[] = [
  { label: 'Morning', value: '--' },
  { label: 'Noon', value: '--' },
  { label: 'Evening', value: '--', highlight: true },
]

const LIVE_API_URL = 'https://api.thaistock2d.com/live'
const FIVE_MINUTES_MS = 5 * 60 * 1000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readTwodValue(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null
  }

  const live = payload.live

  if (isRecord(live) && (typeof live.twod === 'string' || typeof live.twod === 'number')) {
    const digits = String(live.twod).replace(/\D/g, '')

    if (digits.length > 0) {
      return digits.slice(-2).padStart(2, '0')
    }
  }

  // Backward-compat fallback for nested legacy shape.
  const payout = payload.payout

  if (!isRecord(payout)) {
    return null
  }

  const payoutLive = payout.live

  if (!isRecord(payoutLive)) {
    return null
  }

  const twod = payoutLive.twod

  if (!isRecord(twod)) {
    return null
  }

  const value = twod.value

  if (typeof value !== 'string' && typeof value !== 'number') {
    return null
  }

  const digits = String(value).replace(/\D/g, '')
  return digits.length > 0 ? digits.slice(-2).padStart(2, '0') : null
}

function readUpdatedTimeText(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null
  }

  const live = payload.live

  if (isRecord(live) && typeof live.time === 'string') {
    return live.time
  }

  if (typeof payload.server_time === 'string') {
    return payload.server_time
  }

  return null
}

function sanitizeTwod(value: unknown): string {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return '--'
  }

  const digits = String(value).replace(/\D/g, '')

  if (digits.length === 0) {
    return '--'
  }

  return digits.slice(-2).padStart(2, '0')
}

function readSessionStats(payload: unknown): { morning: string; noon: string; evening: string } {
  if (!isRecord(payload) || !Array.isArray(payload.result)) {
    return { morning: '--', noon: '--', evening: '--' }
  }

  const morning = sanitizeTwod(payload.result[0] && isRecord(payload.result[0]) ? payload.result[0].twod : null)
  const noon = sanitizeTwod(payload.result[1] && isRecord(payload.result[1]) ? payload.result[1].twod : null)
  const evening = sanitizeTwod(payload.result[3] && isRecord(payload.result[3]) ? payload.result[3].twod : null)

  return { morning, noon, evening }
}

export function LiveNumberCard() {
  const [liveNumber, setLiveNumber] = useState('45')
  const [lastUpdatedTimeText, setLastUpdatedTimeText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionStats, setSessionStats] = useState<SessionStat[]>(DEFAULT_SESSION_STATS)

  useEffect(() => {
    let mounted = true

    const refresh = async () => {
      try {
        const response = await fetch(LIVE_API_URL, { cache: 'no-store' })

        if (!response.ok) {
          throw new Error(`Live request failed (${response.status})`)
        }

        const payload = (await response.json()) as unknown
        const next = readTwodValue(payload)
        const updatedAt = readUpdatedTimeText(payload)
        const stats = readSessionStats(payload)

        if (next == null) {
          throw new Error('Missing live.twod from live response')
        }

        if (!mounted) {
          return
        }

        setLiveNumber(next)
        setLastUpdatedTimeText(updatedAt ?? new Date().toLocaleTimeString())
        setSessionStats([
          { label: 'Morning', value: stats.morning },
          { label: 'Noon', value: stats.noon },
          { label: 'Evening', value: stats.evening, highlight: true },
        ])
        setError(null)
      } catch {
        if (!mounted) {
          return
        }

        setError('Live update unavailable. Showing last known number.')
      }
    }

    void refresh()

    const intervalId = window.setInterval(() => {
      void refresh()
    }, FIVE_MINUTES_MS)

    return () => {
      mounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const renderedNumber = useMemo(() => liveNumber.padStart(2, '0').slice(-2), [liveNumber])
  const leftDigit = renderedNumber[0] ?? '-'
  const rightDigit = renderedNumber[1] ?? '-'

  const lastUpdatedLabel = useMemo(() => {
    if (lastUpdatedTimeText == null) {
      return 'Last updated: pending'
    }

    return `Last updated: ${lastUpdatedTimeText}`
  }, [lastUpdatedTimeText])

  return (
    <section className="live-number-card" aria-labelledby="live-number-heading">
      <div className="live-number-card__header">
        <p className="live-pill">
          <span aria-hidden className="live-pill__dot" />
          LIVE
        </p>
        <p className="live-number-card__time">{lastUpdatedLabel}</p>
      </div>

      <h2 id="live-number-heading" className="live-number-card__title">
        Current Number
      </h2>

      <div className="live-number-row live-number-row--fading">
        <div className="live-number-digit live-number-digit--fading">{leftDigit}</div>
        <span className="live-number-separator" aria-hidden>
          -
        </span>
        <div className="live-number-digit live-number-digit--fading">{rightDigit}</div>
      </div>

      {error != null && <p className="live-number-card__error">{error}</p>}

      <div className="live-stats-grid">
        {sessionStats.map((stat) => (
          <article
            key={stat.label}
            className={stat.highlight ? 'live-stat live-stat--highlight' : 'live-stat'}
            aria-label={`${stat.label} session value ${stat.value}`}
          >
            <p className="live-stat__label">{stat.label}</p>
            <p className="live-stat__value">{stat.value}</p>
          </article>
        ))}
      </div>

    </section>
  )
}
