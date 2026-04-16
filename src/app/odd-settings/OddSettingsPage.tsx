import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { listOddSettings } from '@/api/client'
import type { OddSetting } from '@/api/types'
import { ApiStatePanel } from '@/components/api/ApiStatePanel'
import { apiHeader, apiScreen, screenRoot, screenScroll } from '@/styles/tw'

type BetGroup = {
  betType: '2D' | '3D'
  byCurrency: Record<string, { user?: OddSetting; vip?: OddSetting }>
}

function groupOdds(items: OddSetting[]): BetGroup[] {
  const map: Record<string, BetGroup['byCurrency']> = {}

  for (const item of items) {
    if (!map[item.bet_type]) map[item.bet_type] = {}
    if (!map[item.bet_type][item.currency]) map[item.bet_type][item.currency] = {}
    map[item.bet_type][item.currency][item.user_type] = item
  }

  return (['2D', '3D'] as const)
    .filter((bt) => map[bt] != null)
    .map((bt) => ({ betType: bt, byCurrency: map[bt] }))
}

type OddCardProps = {
  label: string
  item?: OddSetting
  accent: string
  bgClass: string
  borderClass: string
}

function OddCard({ label, item, accent, bgClass, borderClass }: OddCardProps) {
  const { t } = useTranslation()

  return (
    <div className={`flex flex-col gap-1.5 rounded-xl border ${borderClass} ${bgClass} px-4 py-3`}>
      <span className={`text-[0.68rem] font-bold uppercase tracking-widest ${accent}`}>{label}</span>
      {item != null ? (
        <>
          <span className="text-[1.65rem] font-bold leading-none text-[#f7f9ff] tabular-nums">
            {item.odd}
          </span>
          <span className="text-[0.72rem] text-[#5a6e8a]">
            {item.currency} · {t('odds.perUnit')}
          </span>
          <span className={`mt-0.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${item.is_active ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-white/5 text-[#5a6e8a]'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${item.is_active ? 'bg-[#00e676]' : 'bg-[#5a6e8a]'}`} />
            {item.is_active ? t('odds.active') : t('odds.inactive')}
          </span>
        </>
      ) : (
        <span className="text-[0.8rem] text-[#3a4d66]">—</span>
      )}
    </div>
  )
}

type BetTypeSectionProps = {
  group: BetGroup
}

const BET_TYPE_CONFIG = {
  '2D': {
    icon: 'looks_two',
    accentText: 'text-[#38bdf8]',
    accentBorder: 'border-[#38bdf8]/30',
    accentBg: 'bg-[#38bdf8]/6',
    pill: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/25',
  },
  '3D': {
    icon: 'looks_3',
    accentText: 'text-[#a78bfa]',
    accentBorder: 'border-[#a78bfa]/30',
    accentBg: 'bg-[#a78bfa]/6',
    pill: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/25',
  },
}

function BetTypeSection({ group }: BetTypeSectionProps) {
  const { t } = useTranslation()
  const cfg = BET_TYPE_CONFIG[group.betType]
  const titleKey = group.betType === '2D' ? 'odds.twod' : 'odds.threed'

  return (
    <section className="rounded-2xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] overflow-hidden">
      {/* Section header */}
      <div className={`flex items-center gap-3 px-4 py-3.5 border-b border-white/6 ${cfg.accentBg}`}>
        <span className={`material-symbols-outlined text-[1.4rem] ${cfg.accentText}`}>{cfg.icon}</span>
        <h2 className={`m-0 text-[1.05rem] font-bold ${cfg.accentText}`}>{t(titleKey)}</h2>
        <span className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${cfg.pill}`}>
          {group.betType}
        </span>
      </div>

      {/* Per-currency rows */}
      <div className="divide-y divide-white/5">
        {Object.entries(group.byCurrency).map(([currency, slots]) => (
          <div key={currency} className="px-4 py-4 grid gap-3">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#4a5d7a]">
              {currency}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <OddCard
                label={t('odds.userOdd')}
                item={slots.user}
                accent="text-[#93c5fd]"
                bgClass="bg-[#1e3a5f]/20"
                borderClass="border-[#93c5fd]/15"
              />
              <OddCard
                label={t('odds.vipOdd')}
                item={slots.vip}
                accent="text-[#fbbf24]"
                bgClass="bg-[#78350f]/15"
                borderClass="border-[#fbbf24]/20"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function OddSettingsPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groups, setGroups] = useState<BetGroup[]>([])

  useEffect(() => {
    void (async () => {
      try {
        const response = await listOddSettings()
        setGroups(groupOdds(response.data.odd_settings))
      } catch {
        setError(t('odds.loadError'))
      } finally {
        setLoading(false)
      }
    })()
  }, [t])

  const isEmpty = !loading && error == null && groups.length === 0

  return (
    <div className={`${screenRoot} ${apiScreen}`} data-testid="odd-settings-page">
      <header className={apiHeader}>
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.1em] text-[#93c5fd]">{t('odds.eyebrow')}</p>
        <h1 className="mt-1 mb-0 text-[clamp(1.48rem,5vw,1.9rem)] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{t('odds.title')}</h1>
        <p className="mt-1.5 mb-0 text-[0.86rem] leading-[1.45] text-[#8a9bb3]">{t('odds.desc')}</p>
      </header>

      <main className={screenScroll}>
        <ApiStatePanel loading={loading} error={error} empty={isEmpty} emptyMessage={t('odds.empty')} />

        {!loading && error == null && groups.length > 0 && (
          <div className="grid gap-4">
            {groups.map((group) => (
              <BetTypeSection key={group.betType} group={group} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
