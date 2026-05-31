export type ApiMode = 'mock' | 'live'

export type UserRole = 'user' | 'vip'

export type User = {
    id: number
    uuid?: string
    username: string | null
    name: string | null
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

export type AdminBankSetting = {
    id: number
    bank_name: string
    account_holder_name: string
    account_number: string
    is_active: boolean
    is_primary: boolean
    currency: 'THB' | 'MMK'
    created_at: string
    updated_at: string
}

export type WalletBankInfo = {
    bank_name: 'KBZ' | 'AYA' | 'CB' | 'UAB' | 'YOMA' | 'SCB' | 'KBANK' | 'BBL' | 'KTB' | 'BAY' | 'TTB' | 'GSB'
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
    paid_out_at: string | null
    stock_date: string
    target_opentime: BetTargetOpenTime | null
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
    bet_type: BetType
    currency: BetCurrency
    target_opentime?: BetTargetOpenTime
    bet_numbers: BetNumberInput[]
}

export type ApiResult<T> = {
    message: string
    data: T
    errors: Record<string, string[]> | null
}

// ── Wallet ────────────────────────────────────────────────────────────────────

export type WalletCurrency = 'MMK' | 'THB'

export type Wallet = {
    id: number
    user_id: number
    balance: number
    currency: WalletCurrency | null
    currency_locked_at: string | null
    bank_name: WalletBankInfo['bank_name'] | null
    account_name: string | null
    account_number: string | null
    created_at: string
    updated_at: string
}

export type WalletTransactionType =
    | 'DEPOSIT'
    | 'BET_PLACE'
    | 'BET_REFUND'
    | 'BET_WIN'
    | 'WITHDRAWAL'
    | 'WITHDRAWAL_REFUND'
    | 'ADJUSTMENT'

export type WalletTransactionDirection = 'CREDIT' | 'DEBIT'

export type WalletTransaction = {
    id: string
    wallet_id: number
    user_id: number
    type: WalletTransactionType
    direction: WalletTransactionDirection
    amount: number
    balance_after: number
    currency: WalletCurrency
    reference_type: string | null
    reference_id: string | null
    note: string | null
    created_by_user_id: string
    created_at: string
    updated_at: string
}

// ── Deposits ──────────────────────────────────────────────────────────────────

export type DepositStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type Deposit = {
    id: string
    user_id: number
    admin_bank_setting_id: number
    currency: WalletCurrency
    claimed_amount: number
    approved_amount: number | null
    transfer_note: string | null
    status: DepositStatus
    admin_note: string | null
    rejection_reason: string | null
    reviewed_by_user_id: string | null
    reviewed_at: string | null
    proof_of_payment: {
        exists: boolean
        download_url: string | null
        file_name: string | null
        mime_type: string | null
        size: number | null
    }
    created_at: string
    updated_at: string
}

// ── Withdrawals ───────────────────────────────────────────────────────────────

export type WithdrawalStatus = 'PENDING' | 'COMPLETED' | 'REJECTED'

export type WithdrawalBankSnapshot = {
    bank_name: string
    account_name: string
    account_number: string
}

export type Withdrawal = {
    id: string
    user_id: number
    currency: WalletCurrency
    amount: number
    status: WithdrawalStatus
    bank_snapshot: WithdrawalBankSnapshot
    admin_note: string | null
    rejection_reason: string | null
    reviewed_by_user_id: string | null
    reviewed_at: string | null
    payout_proof: {
        exists: boolean
        download_url: string | null
        file_name: string | null
        mime_type: string | null
        size: number | null
    }
    created_at: string
    updated_at: string
}

// ── Input types ───────────────────────────────────────────────────────────────

export type SetWalletCurrencyInput = {
    currency: WalletCurrency
}

export type CreateDepositInput = {
    claimed_amount: number
    transfer_note?: string
    proof_image: File
}

export type CreateWithdrawalInput = {
    currency: WalletCurrency
    amount: number
}
