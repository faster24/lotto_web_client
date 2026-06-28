import type { WalletBankInfo } from '@/api/types'

export type BankEntry = {
  code: WalletBankInfo['bank_name']
  label: string
  currency: 'MMK' | 'THB'
}

export const BANKS: BankEntry[] = [
  { code: 'KBZ',   label: 'Kanbawza Bank',              currency: 'MMK' },
  { code: 'AYA',   label: 'AYA Bank',                   currency: 'MMK' },
  { code: 'CB',    label: 'CB Bank',                    currency: 'MMK' },
  { code: 'UAB',   label: 'United Amara Bank',          currency: 'MMK' },
  { code: 'YOMA',  label: 'Yoma Bank',                  currency: 'MMK' },
  { code: 'SCB',   label: 'Siam Commercial Bank',       currency: 'THB' },
  { code: 'KBANK', label: 'Kasikorn Bank',              currency: 'THB' },
  { code: 'BBL',   label: 'Bangkok Bank',               currency: 'THB' },
  { code: 'KTB',   label: 'Krungthai Bank',             currency: 'THB' },
  { code: 'BAY',   label: 'Bank of Ayudhya (Krungsri)', currency: 'THB' },
  { code: 'TTB',   label: 'TMBThanachart Bank',         currency: 'THB' },
  { code: 'GSB',   label: 'Government Savings Bank',    currency: 'THB' },
]

export const CURRENCY_LABEL: Record<'MMK' | 'THB', string> = {
  MMK: 'Myanmar',
  THB: 'Thailand',
}

export function banksByCurrency(currency: 'MMK' | 'THB'): BankEntry[] {
  return BANKS.filter((b) => b.currency === currency)
}
