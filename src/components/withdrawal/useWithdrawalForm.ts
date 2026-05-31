import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWithdrawal } from '@/api/client'
import { useToast } from '@/contexts/ToastContext'
import { useWallet } from '@/contexts/WalletContext'

export function useWithdrawalForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { wallet, refreshWallet } = useWallet()
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const parsedAmount = Number(amount.trim())
  const isValidAmount = /^\d+$/.test(amount.trim()) && Number.isInteger(parsedAmount) && parsedAmount >= 1
  const isInsufficient = wallet != null && isValidAmount && parsedAmount > wallet.balance
  const balanceAfter = wallet != null && isValidAmount && !isInsufficient ? wallet.balance - parsedAmount : null
  const hasBankInfo = wallet?.bank_name != null && wallet?.account_name != null && wallet?.account_number != null

  const onSubmit = async () => {
    setMessage(null)

    if (!isValidAmount) {
      setMessage('Amount must be a whole number of at least 1.')
      return
    }

    if (isInsufficient) {
      setMessage('Amount exceeds your available balance.')
      return
    }

    if (!hasBankInfo) {
      setMessage('Please set up your bank info before requesting a withdrawal.')
      return
    }

    if (wallet == null || wallet.currency == null) {
      setMessage('Wallet not available.')
      return
    }

    try {
      setIsSubmitting(true)
      await createWithdrawal({ currency: wallet.currency, amount: parsedAmount })
      showToast('Withdrawal request submitted!', 'success')
      refreshWallet()
      navigate('/gambling/withdrawal-history')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Withdrawal submission failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { amount, setAmount, isSubmitting, message, onSubmit, parsedAmount, isValidAmount, isInsufficient, balanceAfter, hasBankInfo }
}
