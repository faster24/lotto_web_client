import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDeposit, listBankSettings } from '@/api/client'
import type { AdminBankSetting } from '@/api/types'
import { useToast } from '@/contexts/ToastContext'
import { useWallet } from '@/contexts/WalletContext'

export type DepositFormState = {
  claimed_amount: string
  transfer_note: string
  proof_image: File | null
}

const initialForm: DepositFormState = {
  claimed_amount: '',
  transfer_note: '',
  proof_image: null,
}

export function useDepositForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { wallet, refreshWallet } = useWallet()
  const [form, setForm] = useState<DepositFormState>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [bankSettings, setBankSettings] = useState<AdminBankSetting[]>([])
  const [bankSettingsLoading, setBankSettingsLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const response = await listBankSettings()
        setBankSettings(response.data.admin_bank_settings.filter((s) => s.is_active))
      } finally {
        setBankSettingsLoading(false)
      }
    })()
  }, [])

  const walletCurrency = wallet?.currency ?? null
  const matchingBanks = walletCurrency != null
    ? bankSettings.filter((s) => s.currency === walletCurrency)
    : bankSettings

  // Auto-select: prefer is_primary, else first match
  const selectedBank: AdminBankSetting | null =
    matchingBanks.find((s) => s.is_primary) ?? matchingBanks[0] ?? null

  const onFileChange = (file: File | null) => {
    setMessage(null)
    if (proofPreviewUrl != null) URL.revokeObjectURL(proofPreviewUrl)
    if (file == null) {
      setForm((prev) => ({ ...prev, proof_image: null }))
      setProofPreviewUrl(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setMessage('Proof image must be an image file (JPG/PNG/WEBP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage('Proof image must be under 10MB.')
      return
    }
    setForm((prev) => ({ ...prev, proof_image: file }))
    setProofPreviewUrl(URL.createObjectURL(file))
  }

  const onSubmit = async () => {
    setMessage(null)

    const amount = Number(form.claimed_amount.trim())
    if (!Number.isInteger(amount) || amount < 1) {
      setMessage('Amount must be a whole number of at least 1.')
      return
    }

    if (form.proof_image == null) {
      setMessage('Proof of payment image is required.')
      return
    }

    if (selectedBank == null) {
      setMessage('No active bank account available. Please contact support.')
      return
    }

    if (walletCurrency == null) {
      setMessage('Wallet currency not set. Please set your currency first.')
      return
    }

    try {
      setIsSubmitting(true)
      await createDeposit({
        admin_bank_setting_id: selectedBank.id,
        currency: walletCurrency,
        claimed_amount: amount,
        proof_image: form.proof_image,
        ...(form.transfer_note.trim().length > 0 ? { transfer_note: form.transfer_note.trim() } : {}),
      })
      showToast('Deposit request submitted!', 'success')
      refreshWallet()
      navigate('/gambling/deposit-history')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Deposit submission failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form, setForm, isSubmitting, message, onSubmit,
    proofPreviewUrl, fileInputRef, onFileChange,
    selectedBank, bankSettingsLoading, walletCurrency,
  }
}
