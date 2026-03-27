export type ApiMode = 'mock' | 'live'

export type UserRole = 'user' | 'vip'

export type User = {
  id: number
  username: string | null
  email: string
  role: UserRole | null
  roles: string[]
  is_banned: boolean
  banned_at: string | null
  created_at: string
  updated_at: string
}

export type AuthData = {
  user: User
  token: string
}

export type RegisterInput = {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export type LoginInput = {
  email: string
  password: string
}

export type WalletBankInfo = {
  bank_name: 'KBZ' | 'AYA' | 'CB' | 'UAB' | 'YOMA' | 'OTHER'
  account_name: string
  account_number: string
}

export type BetType = '2D' | '3D'
export type BetCurrency = 'MMK' | 'THB'
export type BetTargetOpenTime = '11:00:00' | '12:01:00' | '15:00:00' | '16:30:00'

export type BetNumberInput = {
  number: string
  amount: number
}

export type Bet = {
  id: string
  bet_type: BetType
  currency: BetCurrency
  total_amount: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REFUNDED'
  bet_result_status: 'OPEN' | 'WON' | 'LOST' | 'INVALID'
  payout_status: 'PENDING' | 'PAID_OUT' | 'REFUNDED'
  stock_date: string
  target_opentime: BetTargetOpenTime
  bet_numbers: BetNumberInput[]
  placed_at: string
}

export type Announcement = {
  id: number
  title: string
  summary: string
  description: string
  created_at: string
  updated_at: string
}

export type OddSetting = {
  id: number
  bet_type: '2D' | '3D'
  currency: 'MMK' | 'THB'
  user_type: UserRole
  odd: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type TwoDResult = {
  id: number
  history_id: string
  stock_date: string | null
  stock_datetime: string | null
  open_time: string | null
  twod: string | null
  set_index: string | null
  value: string | null
}

export type ThreeDResult = {
  id: number
  stock_date: string
  threed: string
  created_at: string
  updated_at: string
}

export type BetCreateInput = {
  pay_slip_image: File
  bet_type: BetType
  currency: BetCurrency
  target_opentime: BetTargetOpenTime
  bet_numbers: BetNumberInput[]
}

export type ApiResult<T> = {
  message: string
  data: T
  errors: Record<string, string[]> | null
}
