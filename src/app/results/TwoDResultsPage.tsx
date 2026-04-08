import { useEffect, useState } from 'react'
import { listTwoDResultsLastFiveDays } from '@/api/client'
import type { TwoDResult } from '@/api/types'
import { ExploreHistorySection, type HistoryDay } from '@/components/tabs/ExploreHistorySection'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const OPEN_TIME_PERIODS: Record<string, string> = {
  '12:01:00': 'Morning',
  '16:30:00': 'Evening',
}

function formatStockDate(date: string) {
  const [, month, day] = date.split('-')
  const m = parseInt(month ?? '1', 10)
  const d = parseInt(day ?? '1', 10)
  const year = date.slice(0, 4)
  return `${d} ${MONTH_NAMES[m - 1] ?? ''} ${year}`
}

function formatOpenTime(time: string) {
  const [h, m] = time.split(':')
  const hour = parseInt(h ?? '0', 10)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${suffix}`
}

function mapToHistoryDays(results: TwoDResult[]): HistoryDay[] {
  const byDate = new Map<string, TwoDResult[]>()
  for (const r of results) {
    const key = r.stock_date ?? 'Unknown'
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(r)
  }

  return [...byDate.entries()].map(([date, entries]) => ({
    id: date,
    date: date === 'Unknown' ? date : formatStockDate(date),
    results: [...entries].sort((a, b) => (a.open_time ?? '').localeCompare(b.open_time ?? '')).map((r) => ({
      period: OPEN_TIME_PERIODS[r.open_time ?? ''] ?? formatOpenTime(r.open_time ?? ''),
      time: r.open_time != null ? formatOpenTime(r.open_time) : '—',
      number: r.twod ?? '—',
    })),
  }))
}

export function TwoDResultsPage() {
  const [historyDays, setHistoryDays] = useState<HistoryDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listTwoDResultsLastFiveDays()
      .then((res) => setHistoryDays(mapToHistoryDays(res.data.two_d_results)))
      .catch(() => setError('Unable to load 2D results. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="two-d-results-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Result</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Recent Draw History</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Browse recent 2D and 3D draw cards.</p>
      </header>

      <main className={screenScroll}>
        <ExploreHistorySection historyDays={historyDays} loading={loading} error={error} />
      </main>
    </div>
  )
}
