import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { listTwoDResultsLastFiveDays } from '@/api/client'
import type { TwoDResult } from '@/api/types'
import { ExploreHistorySection, type HistoryDay } from '@/components/tabs/ExploreHistorySection'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

const OPEN_TIME_PERIODS: Record<string, string> = {
  '12:01:00': 'home.morning',
  '16:30:00': 'home.evening',
}

function formatStockDate(date: string, t: TFunction) {
  const [, month, day] = date.split('-')
  const d = parseInt(day ?? '1', 10)
  const year = date.slice(0, 4)
  const monthStr = t(`results.months.${month as string}`)
  return `${d} ${monthStr} ${year}`
}

function formatOpenTime(time: string) {
  const [h, m] = time.split(':')
  const hour = parseInt(h ?? '0', 10)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${suffix}`
}

function mapToHistoryDays(results: TwoDResult[], t: TFunction): HistoryDay[] {
  const byDate = new Map<string, TwoDResult[]>()
  for (const r of results) {
    const key = r.stock_date ?? 'Unknown'
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(r)
  }

  return [...byDate.entries()].map(([date, entries]) => ({
    id: date,
    date: date === 'Unknown' ? date : formatStockDate(date, t),
    results: [...entries].sort((a, b) => (a.open_time ?? '').localeCompare(b.open_time ?? '')).map((r) => {
      const periodKey = OPEN_TIME_PERIODS[r.open_time ?? ''];
      return {
        period: periodKey ? t(periodKey) : formatOpenTime(r.open_time ?? ''),
        time: r.open_time != null ? formatOpenTime(r.open_time) : '—',
        number: r.twod ?? '—',
      }
    }),
  }))
}

export function TwoDResultsPage() {
  const { t } = useTranslation()
  const [historyDays, setHistoryDays] = useState<HistoryDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listTwoDResultsLastFiveDays()
      .then((res) => setHistoryDays(mapToHistoryDays(res.data.two_d_results, t)))
      .catch(() => setError(t('results.loadHistoryError')))
      .finally(() => setLoading(false))
  }, [t])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="two-d-results-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">
          {t('results.resultEyebrow')}
        </p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          {t('results.recentDrawHistory')}
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
          {t('results.recentDrawHistoryDesc')}
        </p>
      </header>

      <main className={screenScroll}>
        <ExploreHistorySection historyDays={historyDays} loading={loading} error={error} />
      </main>
    </div>
  )
}