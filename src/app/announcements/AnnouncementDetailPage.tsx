import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAnnouncementById } from '@/api/client'
import type { Announcement } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function AnnouncementDetailPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<Announcement | null>(null)

  useEffect(() => {
    void (async () => {
      const announcementId = Number(id)

      if (Number.isNaN(announcementId)) {
        setError('Invalid announcement id.')
        setLoading(false)
        return
      }

      try {
        const response = await getAnnouncementById(announcementId)
        setItem(response.data.announcement)
      } catch {
        setError('Unable to load announcement detail.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="announcement-detail-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">Announcement</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">Announcement Detail</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">Detail endpoint from {'`/announcements/{announcement}`'}.</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={item == null} emptyMessage="Announcement not found." />

        {item != null && (
          <section className={apiCard}>
            <h2 className="m-0 mb-2 text-[1.12rem]">{item.title}</h2>
            <p>{item.summary}</p>
            <p className="m-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{item.description}</p>
          </section>
        )}

        <Link className={apiButton} to="/announcements">Back</Link>
      </main>
    </div>
  )
}
