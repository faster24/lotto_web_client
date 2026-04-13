import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getOddSettingById } from '@/api/client'
import type { OddSetting } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiButton, apiCard, apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

export function OddSettingDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<OddSetting | null>(null)

  useEffect(() => {
    void (async () => {
      const oddId = Number(id)

      if (Number.isNaN(oddId)) {
        setError(t('odds.invalidId'))
        setLoading(false)
        return
      }

      try {
        const response = await getOddSettingById(oddId)
        setItem(response.data.odd_setting)
      } catch {
        setError(t('odds.loadDetailError'))
      } finally {
        setLoading(false)
      }
    })()
  }, [id, t])

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="odd-setting-detail-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">
          {t('odds.eyebrow')}
        </p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">
          {t('odds.detailTitle')}
        </h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
          {t('odds.detailDesc')}
        </p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel
          loading={loading}
          error={error}
          empty={item == null}
          emptyMessage={t('odds.notFound')}
        />

        {item != null && (
          <section className={apiCard}>
            <h2 className="m-0 mb-2 text-[1.12rem]">{item.bet_type} · {item.user_type}</h2>
            <p>{t('odds.oddLabel')} {item.odd} {item.currency}</p>
            <p className="m-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">
              {t('odds.stateLabel')} {item.is_active ? t('odds.active') : t('odds.inactive')}
            </p>
          </section>
        )}

        <Link className={apiButton} to="/odd-settings">
          {t('common.back')}
        </Link>
      </main>
    </div>
  )
}