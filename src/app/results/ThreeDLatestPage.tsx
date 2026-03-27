import { useEffect, useState } from 'react'
import { getLatestThreeDResult } from '@/api/client'
import type { ThreeDResult } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function ThreeDLatestPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<ThreeDResult | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const response = await getLatestThreeDResult()
        setItem(response.data.three_d_result)
      } catch {
        setError('Unable to load latest 3D result.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="three-d-latest-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Result</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Latest 3D Result</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Latest endpoint from `/three-d-results/latest`.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={item == null} emptyMessage="No latest result available." />

        {item != null && (
          <section className={`${apiCard} text-center`}>
            <p className="m-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{item.stock_date}</p>
            <h2 className="m-0 text-[2.4rem] text-[#00e676] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{item.threed}</h2>
          </section>
        )}
      </main>
    </div>
  )
}
