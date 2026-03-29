import { useState } from 'react'

export function ProfileWalletCard() {
  const [copied, setCopied] = useState(false)

  const copyUid = async () => {
    try {
      await navigator.clipboard?.writeText('609763')
    } catch (error) {
      void error
    }

    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1200)
  }

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(160deg,rgb(11_19_43_/_94%)_0%,rgb(7_15_35_/_88%)_100%)] p-6"
      aria-labelledby="setting-profile-heading"
    >
      {/* Decorative blur circle */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#00e676]/5 blur-3xl" />

      <div className="flex items-center gap-5">
        {/* Avatar */}
        <span
          aria-hidden
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00e676] to-[#00c896] text-2xl font-extrabold text-[#003824] shadow-lg shadow-[#00e676]/20"
        >
          MK
        </span>

        <div className="flex-1 min-w-0">
          <h2 id="setting-profile-heading" className="m-0 text-base font-bold text-[#f7f9ff]">
            Min Khant
          </h2>
          <p className="mt-0.5 mb-0 text-[0.72rem] text-[#8a9bb3]">Last login: 2026-02-24 21:37</p>

          {/* UID pill */}
          <button
            type="button"
            className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#00e676] transition hover:bg-white/10"
            onClick={() => void copyUid()}
          >
            <span>UID: 609763</span>
            {copied ? (
              <span className="material-symbols-outlined text-[0.9rem]">check</span>
            ) : (
              <span className="material-symbols-outlined text-[0.9rem]">content_copy</span>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
