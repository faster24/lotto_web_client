import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAnnouncements } from '@/api/client'
import type { Announcement } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function AnnouncementsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<Announcement[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const response = await listAnnouncements()
        setItems(response.data.announcements)
      } catch {
        setError('Unable to load announcements.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="announcements-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Announcement</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Announcements</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">List endpoint from `/announcements`.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={items.length === 0} emptyMessage="No announcements." />

        {items.length > 0 && (
          <section className={apiCard}>
            <ul className="grid list-none gap-2 p-0 m-0">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/3 p-2.5">
                  <div>
                    <p>{item.title}</p>
                    <p className="m-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{item.summary}</p>
                  </div>
                  <Link className={apiButton} to={`/announcements/${item.id}`}>
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
