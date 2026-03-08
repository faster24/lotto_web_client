import type { ReactNode } from 'react'

type SurfaceCardProps = {
  title: string
  eyebrow?: string
  description?: string
  className?: string
  children?: ReactNode
}

export function SurfaceCard({ title, eyebrow, description, className, children }: SurfaceCardProps) {
  const cardClassName = className == null ? 'surface-card' : `surface-card ${className}`

  return (
    <section className={cardClassName}>
      {eyebrow == null ? null : <p className="surface-card__eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description == null ? null : <p className="surface-card__description">{description}</p>}
      {children}
    </section>
  )
}
