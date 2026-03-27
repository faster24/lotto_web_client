type AppHeaderProps = {
  title: string
  subtitle: string
  statusText?: string
}

export function AppHeader({ title, subtitle, statusText = 'Foundation' }: AppHeaderProps) {
  return (
    <header className="border-b border-white/12 bg-gradient-to-b from-white/5 to-transparent px-6 pb-5 pt-[calc(1.25rem+env(safe-area-inset-top))]">
      <p className="m-0 text-[0.76rem] uppercase tracking-[0.13em] text-[#8a9bb3]">{subtitle}</p>
      <h1 className="mt-2 mb-3 text-[clamp(1.52rem,5vw,1.95rem)] leading-[1.07] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{title}</h1>
      <p className="m-0 inline-flex items-center gap-2 text-[0.82rem] tracking-[0.04em] text-[#00e676]">
        <span aria-hidden className="size-2 rounded-full bg-[#00e676] shadow-[0_0_14px_rgb(0_230_118_/_75%)]" />
        {statusText}
      </p>
    </header>
  )
}
