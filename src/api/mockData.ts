import type { Announcement, Bet, OddSetting, ThreeDResult, TwoDResult, User, WalletBankInfo } from './types'

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
