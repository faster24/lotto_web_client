import { Link } from 'react-router-dom'
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
    <section className="setting-profile" aria-labelledby="setting-profile-heading">
      <div className="setting-profile__head">
        <span aria-hidden className="setting-profile__avatar">
          MK
        </span>

        <div>
          <h2 id="setting-profile-heading">Min Khant</h2>
          <p className="setting-profile__meta">Last login 2026-02-24 21:37:08</p>
          <button type="button" className="setting-profile__uid" onClick={() => void copyUid()}>
            UID 609763 {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <Link className="setting-profile__profile-link" to="/user/profile">
        Open Profile API Page
      </Link>
    </section>
  )
}
