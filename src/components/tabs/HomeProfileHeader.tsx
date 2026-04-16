import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMe } from '@/api/client'
import type { User } from '@/api/types'

export function HomeProfileHeader() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let active = true

    void getMe()
      .then((response) => {
        if (active) setUser(response.data.user)
      })
      .catch(() => {
        if (active) setUser(null)
      })

    return () => {
      active = false
    }
  }, [])

  const displayName = user?.username?.trim() || user?.name?.trim() || user?.email || ''
  const avatarText = displayName.slice(0, 2).toUpperCase() || '--'

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-[#0c1324] shadow-[0_8px_32px_rgba(7,13,31,0.6)] border-b border-white/5">
      <div className="flex items-center gap-3">
        <Link
          to="/user/profile"
          aria-label="Open profile"
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#51e1a5]/30 bg-[#121c38] text-[#51e1a5] text-sm font-bold shrink-0"
        >
          {avatarText}
        </Link>
        <div className="flex flex-col leading-tight">
          <span className="font-bold italic tracking-tighter text-xl text-[#51e1a5]">{displayName}</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] tracking-widest uppercase text-white/50">Verified User: {avatarText}</span>
            <span
              className="material-symbols-outlined text-[#51e1a5]"
              style={{ fontSize: '12px', fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Open notifications"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#23293c] hover:opacity-80 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[#51e1a5]">notifications</span>
      </button>
    </header>
  )
}
