import type { ReactNode } from 'react'

type AuthScreenProps = {
  testId: string
  title: string
  subtitle?: string
  children: ReactNode
}

type AuthCardProps = {
  label: string
  apiNote: string
  children: ReactNode
}

type AuthFieldProps = {
  htmlFor: string
  label: string
  children: ReactNode
}

type AuthFeedbackProps = {
  kind: 'error' | 'success'
  message: string
}

export function AuthScreen({ testId, title, subtitle, children }: AuthScreenProps) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-[radial-gradient(circle_at_10%_0%,rgb(0_230_118_/_11%),transparent_38%),radial-gradient(circle_at_100%_40%,rgb(0_151_255_/_14%),transparent_44%),linear-gradient(165deg,rgb(6_14_36)_0%,rgb(4_10_31)_100%)]"
      data-testid={testId}
    >
      <header className="px-5 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-10">
        <p className="m-0 text-[0.72rem] uppercase tracking-[0.14em] text-[#00e676]">Zarmani108</p>
        <h1 className="mt-2 mb-0 [font-family:'Noe_Display','Iowan_Old_Style','Palatino_Linotype',serif] text-[clamp(1.58rem,5.1vw,2.08rem)] leading-[1.08]">
          {title}
        </h1>
        {subtitle != null && <p className="mt-3 mb-0 text-[0.85rem] leading-[1.5] text-[#8a9bb3]">{subtitle}</p>}
      </header>
      <main className="flex-1 overflow-y-auto px-5 pb-[calc(2rem+env(safe-area-inset-bottom))]">{children}</main>
    </div>
  )
}

export function AuthCard({ label, apiNote, children }: AuthCardProps) {
  return (
    <div className="my-[10px] grid gap-4 rounded-[1.65rem] border border-white/12 bg-[linear-gradient(160deg,rgb(21_34_67_/_92%)_0%,rgb(10_18_41_/_92%)_100%)] p-5 shadow-[0_30px_46px_rgb(2_7_19_/_42%),inset_0_1px_0_rgb(255_255_255_/_7%)]">
      <p className="m-0 text-[0.76rem] uppercase tracking-[0.1em] text-[#00e676]">{label}</p>
      <p className="mt-[-0.2rem] mb-0 text-[0.73rem] tracking-[0.03em] text-[#93c5fd]">{apiNote}</p>
      {children}
    </div>
  )
}

export function AuthField({ htmlFor, label, children }: AuthFieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="ml-0.5 text-[0.83rem] font-semibold">
        {label}
      </label>
      {children}
    </div>
  )
}

export function AuthFeedback({ kind, message }: AuthFeedbackProps) {
  const kindClass =
    kind === 'error'
      ? 'border-[rgb(255_77_77_/_45%)] bg-[rgb(255_77_77_/_10%)] text-[#ffb3aa]'
      : 'border-[rgb(0_230_118_/_45%)] bg-[rgb(0_230_118_/_10%)] text-[#00e676]'

  return <p className={`m-0 rounded-xl border px-2.5 py-2 text-[0.78rem] leading-[1.4] ${kindClass}`}>{message}</p>
}

export const authInputClassName =
  'h-11 w-full rounded-2xl border border-white/12 bg-[rgb(5_10_31_/_68%)] px-4 text-[0.92rem] text-[#f7f9ff] placeholder:text-[#8a9bb3] transition-colors focus:border-[rgb(0_230_118_/_55%)] focus:outline-none focus:ring-2 focus:ring-[rgb(0_230_118_/_22%)]'

export const authPasswordWrapClassName = 'grid grid-cols-[minmax(0,1fr)_auto] gap-2'

export const authToggleClassName =
  'cursor-pointer rounded-2xl border border-white/12 bg-white/5 px-3 text-[0.76rem] font-semibold text-[#8a9bb3] transition-colors hover:border-[rgb(0_230_118_/_36%)] hover:text-[#f7f9ff] focus:outline-none focus:ring-2 focus:ring-[rgb(0_230_118_/_25%)]'

export const authPrimaryButtonClassName =
  'inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[rgb(0_230_118_/_38%)] bg-[linear-gradient(150deg,#00e676_0%,#19f38a_100%)] px-4 py-2.5 text-[0.9rem] font-bold text-[#04122d] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60'

export const authSecondaryButtonClassName =
  'inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/4 px-4 py-2.5 text-[0.9rem] font-bold text-[#f7f9ff] transition-colors hover:border-[rgb(0_230_118_/_36%)] hover:text-[#ffffff] disabled:cursor-not-allowed disabled:opacity-60'
