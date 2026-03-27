type ApiStatePanelProps = {
  loading: boolean
  error: string | null
  empty: boolean
  emptyMessage: string
}

export function ApiStatePanel({ loading, error, empty, emptyMessage }: ApiStatePanelProps) {
  const base = 'm-0 rounded-xl border border-white/12 bg-white/5 p-2.5 text-[0.86rem] leading-[1.45]'

  if (loading) {
    return <p className={`${base} text-[#93c5fd]`}>Loading data...</p>
  }

  if (error != null) {
    return <p className={`${base} border-[rgb(255_77_77_/_40%)] text-[#ff9b93]`}>{error}</p>
  }

  if (empty) {
    return <p className={`${base} text-[#8a9bb3]`}>{emptyMessage}</p>
  }

  return null
}
