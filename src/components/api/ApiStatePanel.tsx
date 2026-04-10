import { useTranslation } from 'react-i18next'

type ApiStatePanelProps = {
  loading: boolean
  error: string | null
  empty: boolean
  emptyMessage: string
}

export function ApiStatePanel({ loading, error, empty, emptyMessage }: ApiStatePanelProps) {
  const { t } = useTranslation()
  const base = 'm-0 rounded-xl border border-white/12 bg-white/5 p-2.5 text-[0.86rem] leading-[1.45]'

  if (loading) {
    return <p className={`${base} text-[#93c5fd]`}>{t('common.loading')}</p>
  }

  if (error != null) {
    return <p className={`${base} border-[rgb(255_77_77_/_40%)] text-[#ff9b93]`}>{error}</p>
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-14 px-6 text-center">
        <span
          className="material-symbols-outlined text-[2.8rem] text-[#2a3a5c] select-none"
          aria-hidden="true"
        >
          inbox
        </span>
        <p className="m-0 text-[0.95rem] font-semibold text-[#4a5d7a]">No data here</p>
        <p className="m-0 text-[0.78rem] leading-[1.5] text-[#3a4d66] max-w-[220px]">{emptyMessage}</p>
      </div>
    )
  }

  return null
}
