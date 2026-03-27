import { useEffect, useState } from 'react'
import { listThreeDResults } from '@/api/client'
import type { ThreeDResult } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function ThreeDResultsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ThreeDResult[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const response = await listThreeDResults()
        setItems(response.data.three_d_results)
      } catch {
        setError('Unable to load 3D results.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="three-d-results-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Result</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">3D Results</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">History endpoint from `/three-d-results`.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={items.length === 0} emptyMessage="No 3D results." />

        {items.length > 0 && (
          <section className={apiCard}>
            <ul className="grid list-none gap-2 p-0 m-0">
              {items.map((item) => (
                <li key={item.id} className="rounded-xl border border-white/8 bg-white/3 p-2.5">
                  <p>{item.stock_date} · {item.threed}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
