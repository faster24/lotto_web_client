import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listOddSettings } from '@/api/client'
import type { OddSetting } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function OddSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<OddSetting[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const response = await listOddSettings()
        setItems(response.data.odd_settings)
      } catch {
        setError('Unable to load odd settings.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="odd-settings-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Odds</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Odd Settings</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">List endpoint from `/odd-settings`.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={items.length === 0} emptyMessage="No odd settings." />

        {items.length > 0 && (
          <section className={apiCard}>
            <ul className="grid list-none gap-2 p-0 m-0">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/3 p-2.5">
                  <div>
                    <p>{item.bet_type} · {item.user_type}</p>
                    <p className="m-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Odd: {item.odd} {item.currency}</p>
                  </div>
                  <Link className={apiButton} to={`/odd-settings/${item.id}`}>
                    Detail
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
