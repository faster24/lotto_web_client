import { useEffect, useState } from 'react'
import { getLatestTwoDResult } from '@/api/client'
import type { TwoDResult } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function TwoDLatestPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<TwoDResult | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const response = await getLatestTwoDResult()
        setItem(response.data.two_d_result)
      } catch {
        setError('Unable to load latest 2D result.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="two-d-latest-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Result</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Latest 2D Result</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Latest endpoint from `/two-d-results/latest`.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={item == null} emptyMessage="No latest result available." />

        {item != null && (
          <section className={`${apiCard} text-center`}>
            <p className="m-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{item.stock_date} {item.open_time}</p>
            <h2 className="m-0 text-[2.4rem] text-[#00e676] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{item.twod ?? '--'}</h2>
            <p>History: {item.history_id}</p>
          </section>
        )}
      </main>
    </div>
  )
}
