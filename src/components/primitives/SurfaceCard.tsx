import type { ReactNode } from 'react'

type SurfaceCardProps = {
  title: string
  eyebrow?: string
  description?: string
  className?: string
  children?: ReactNode
}

export function SurfaceCard({ title, eyebrow, description, className, children }: SurfaceCardProps) {
  const cardClassName =
    className == null
      ? 'rounded-[1.25rem] border border-white/12 bg-[linear-gradient(145deg,rgb(255_255_255_/_4%)_0%,rgb(255_255_255_/_1%)_100%),#0b132b] p-5 shadow-[0_24px_40px_rgb(2_7_19_/_34%)]'
      : `rounded-[1.25rem] border border-white/12 bg-[linear-gradient(145deg,rgb(255_255_255_/_4%)_0%,rgb(255_255_255_/_1%)_100%),#0b132b] p-5 shadow-[0_24px_40px_rgb(2_7_19_/_34%)] ${className}`

  return (
    <section className={cardClassName}>
      {eyebrow == null ? null : <p className="mb-2 mt-0 text-[0.76rem] uppercase tracking-[0.12em] text-[#00e676]">{eyebrow}</p>}
      <h2 className="m-0 text-[1.28rem] [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif]">{title}</h2>
      {description == null ? null : <p className="mt-2 mb-0 text-[#8a9bb3]">{description}</p>}
      {children}
    </section>
  )
}
