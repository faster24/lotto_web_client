import type { AdminBankSetting, Announcement, Bet, Deposit, OddSetting, ThreeDResult, TwoDResult, User, Wallet, WalletBankInfo, WalletTransaction, Withdrawal } from './types'

export let mockUser: User = {
    id: 609763,
    username: 'Min Khant',
    name: 'Min Khant',
    email: 'minkhant@example.com',
    role: 'vip',
    roles: ['vip'],
    is_banned: false,
    banned_at: null,
    created_at: '2025-10-10T03:14:00Z',
    updated_at: '2026-03-26T08:00:00Z',
}

export function setMockUser(next: User) {
    mockUser = next
}

export const mockAdminBankSettings: AdminBankSetting[] = [
    {
        id: 1,
        bank_name: 'KBZ Bank',
        account_holder_name: 'Zarmani108 Trading Co., Ltd',
        account_number: '027123456789001',
        is_active: true,
        is_primary: true,
        currency: 'MMK',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        bank_name: 'AYA Bank',
        account_holder_name: 'Zarmani108 Trading Co., Ltd',
        account_number: '011987654321008',
        is_active: true,
        is_primary: false,
        currency: 'MMK',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 3,
        bank_name: 'Kasikornbank',
        account_holder_name: 'Zarmani108 Trading Thailand',
        account_number: '014-2-78901-7',
        is_active: true,
        is_primary: true,
        currency: 'THB',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 4,
        bank_name: 'Siam Commercial Bank',
        account_holder_name: 'Zarmani108 Trading Co., Ltd',
        account_number: '405-889-1034',
        is_active: true,
        is_primary: false,
        currency: 'THB',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
]

export let mockBankInfo: WalletBankInfo | null = {
    bank_name: 'KBZ',
    account_name: 'Min Khant',
    account_number: '09123456789',
}

export function setMockBankInfo(next: WalletBankInfo | null) {
    mockBankInfo = next
}

export let mockBets: Bet[] = [
    {
        id: 'e9f1311d-22fc-4f68-8155-3336d93c9f0e',
        bet_type: '2D',
        currency: 'MMK',
        total_amount: '1000.00',
        status: 'ACCEPTED',
        bet_result_status: 'OPEN',
        payout_status: 'PENDING',
        stock_date: '2026-03-26',
        target_opentime: '16:30:00',
        bet_numbers: [
            { number: '45', amount: 500 },
            { number: '89', amount: 500 },
        ],
        placed_at: '2026-03-26T04:40:00Z',
        paid_out_at: null,
    },
    {
        id: '64b66a80-f4ec-4e3a-a614-8cbf53da28e8',
        bet_type: '3D',
        currency: 'MMK',
        total_amount: '3000.00',
        status: 'ACCEPTED',
        bet_result_status: 'WON',
        payout_status: 'PAID_OUT',
        stock_date: '2026-03-25',
        target_opentime: '15:00:00',
        bet_numbers: [
            { number: '317', amount: 3000 },
        ],
        placed_at: '2026-03-25T03:10:00Z',
        paid_out_at: null,
    },
]

export function setMockBets(next: Bet[]) {
    mockBets = next
}

export const mockAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Service Window Update',
        summary: 'Daily maintenance moved to 01:00 AM.',
        description: 'Daily maintenance now runs from 01:00 to 01:20 AM MMT. Betting and wallet actions will be unavailable.',
        created_at: '2026-03-24T12:10:00Z',
        updated_at: '2026-03-24T12:10:00Z',
    },
    {
        id: 2,
        title: 'New VIP Bonus Rule',
        summary: 'VIP users now get faster payout review.',
        description: 'VIP profiles receive priority payout review during operating hours. Standard validation still applies.',
        created_at: '2026-03-23T08:30:00Z',
        updated_at: '2026-03-23T08:30:00Z',
    },
]

export const mockOddSettings: OddSetting[] = [
    {
        id: 1,
        bet_type: '2D',
        currency: 'MMK',
        user_type: 'user',
        odd: '80.00',
        is_active: true,
        created_at: '2026-03-20T00:00:00Z',
        updated_at: '2026-03-20T00:00:00Z',
    },
    {
        id: 2,
        bet_type: '2D',
        currency: 'MMK',
        user_type: 'vip',
        odd: '82.00',
        is_active: true,
        created_at: '2026-03-20T00:00:00Z',
        updated_at: '2026-03-20T00:00:00Z',
    },
    {
        id: 3,
        bet_type: '3D',
        currency: 'MMK',
        user_type: 'user',
        odd: '500.00',
        is_active: true,
        created_at: '2026-03-20T00:00:00Z',
        updated_at: '2026-03-20T00:00:00Z',
    },
]

export const mockTwoDResults: TwoDResult[] = [
    {
        id: 1,
        history_id: 'H20260326-1630',
        stock_date: '2026-03-26',
        stock_datetime: '2026-03-26T16:30:00+06:30',
        open_time: '16:30:00',
        twod: '85',
        set_index: 'SET',
        value: '1234.55',
    },
    {
        id: 2,
        history_id: 'H20260326-1201',
        stock_date: '2026-03-26',
        stock_datetime: '2026-03-26T12:01:00+06:30',
        open_time: '12:01:00',
        twod: '41',
        set_index: 'SET',
        value: '1229.70',
    },
    {
        id: 3,
        history_id: 'H20260325-1630',
        stock_date: '2026-03-25',
        stock_datetime: '2026-03-25T16:30:00+06:30',
        open_time: '16:30:00',
        twod: '09',
        set_index: 'SET',
        value: '1211.32',
    },
]

export let mockWallet: Wallet = {
    id: 1,
    user_id: 1,
    balance: 250_000,
    currency: 'MMK',
    currency_locked_at: '2026-03-01T09:00:00Z',
    bank_name: 'KBZ',
    account_name: 'Test User',
    account_number: '0971234567',
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-10T12:00:00Z',
}

export function setMockWallet(next: Wallet) {
    mockWallet = next
}

export const mockTransactions: WalletTransaction[] = [
    {
        id: 'txn-mock-1',
        wallet_id: 1,
        user_id: 1,
        type: 'DEPOSIT',
        direction: 'CREDIT',
        amount: 120_000,
        balance_after: 250_000,
        currency: 'MMK',
        reference_type: 'App\\Models\\Deposit',
        reference_id: 'dep-mock-1',
        note: null,
        created_by_user_id: '1',
        created_at: '2026-03-10T09:42:00Z',
        updated_at: '2026-03-10T09:42:00Z',
    },
    {
        id: 'txn-mock-2',
        wallet_id: 1,
        user_id: 1,
        type: 'BET_PLACE',
        direction: 'DEBIT',
        amount: 1_500,
        balance_after: 248_500,
        currency: 'MMK',
        reference_type: 'App\\Models\\Bet',
        reference_id: 'bet-mock-1',
        note: null,
        created_by_user_id: '1',
        created_at: '2026-03-10T10:15:00Z',
        updated_at: '2026-03-10T10:15:00Z',
    },
    {
        id: 'txn-mock-3',
        wallet_id: 1,
        user_id: 1,
        type: 'BET_WIN',
        direction: 'CREDIT',
        amount: 80_000,
        balance_after: 328_500,
        currency: 'MMK',
        reference_type: 'App\\Models\\Bet',
        reference_id: 'bet-mock-2',
        note: 'Settlement hist-001',
        created_by_user_id: '1',
        created_at: '2026-03-10T12:05:00Z',
        updated_at: '2026-03-10T12:05:00Z',
    },
]

export let mockDeposits: Deposit[] = [
    {
        id: 'dep-mock-1',
        user_id: 1,
        admin_bank_setting_id: 1,
        currency: 'MMK',
        claimed_amount: 120_000,
        approved_amount: 120_000,
        transfer_note: '234567',
        status: 'APPROVED',
        admin_note: null,
        rejection_reason: null,
        reviewed_by_user_id: 'admin-1',
        reviewed_at: '2026-03-10T09:42:00Z',
        proof_of_payment: { exists: true, download_url: null, file_name: 'slip.jpg', mime_type: 'image/jpeg', size: 204800 },
        created_at: '2026-03-10T09:30:00Z',
        updated_at: '2026-03-10T09:42:00Z',
    },
    {
        id: 'dep-mock-2',
        user_id: 1,
        admin_bank_setting_id: 1,
        currency: 'MMK',
        claimed_amount: 50_000,
        approved_amount: null,
        transfer_note: null,
        status: 'PENDING',
        admin_note: null,
        rejection_reason: null,
        reviewed_by_user_id: null,
        reviewed_at: null,
        proof_of_payment: { exists: true, download_url: null, file_name: 'proof2.jpg', mime_type: 'image/jpeg', size: 102400 },
        created_at: '2026-03-11T07:00:00Z',
        updated_at: '2026-03-11T07:00:00Z',
    },
]

export function setMockDeposits(next: Deposit[]) {
    mockDeposits = next
}

export let mockWithdrawals: Withdrawal[] = [
    {
        id: 'wth-mock-1',
        user_id: 1,
        currency: 'MMK',
        amount: 50_000,
        status: 'COMPLETED',
        bank_snapshot: { bank_name: 'KBZ', account_name: 'Test User', account_number: '0971234567' },
        admin_note: null,
        rejection_reason: null,
        reviewed_by_user_id: 'admin-1',
        reviewed_at: '2026-03-09T14:00:00Z',
        payout_proof: { exists: true, download_url: null, file_name: 'payout.jpg', mime_type: 'image/jpeg', size: 153600 },
        created_at: '2026-03-09T13:00:00Z',
        updated_at: '2026-03-09T14:00:00Z',
    },
]

export function setMockWithdrawals(next: Withdrawal[]) {
    mockWithdrawals = next
}

export const mockThreeDResults: ThreeDResult[] = [
    {
        id: 1,
        stock_date: '2026-03-26',
        threed: '981',
        created_at: '2026-03-26T10:00:00Z',
        updated_at: '2026-03-26T10:00:00Z',
    },
    {
        id: 2,
        stock_date: '2026-03-25',
        threed: '317',
        created_at: '2026-03-25T10:00:00Z',
        updated_at: '2026-03-25T10:00:00Z',
    },
]
