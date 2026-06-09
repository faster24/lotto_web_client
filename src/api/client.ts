import {
  mockAdminBankSettings,
  mockAnnouncements,
  mockBankInfo,
  mockBets,
  mockDeposits,
  mockOddSettings,
  mockThreeDResults,
  mockTransactions,
  mockTwoDResults,
  mockUser,
  mockWallet,
  mockWithdrawals,
  setMockBankInfo,
  setMockBets,
  setMockDeposits,
  setMockUser,
  setMockWallet,
  setMockWithdrawals,
} from './mockData'
import type {
  AdminBankSetting,
  Announcement,
  ApiMode,
  ApiResult,
  AuthData,
  Bet,
  BetCreateInput,
  CreateDepositInput,
  CreateWithdrawalInput,
  Deposit,
  LoginInput,
  OddSetting,
  RegisterInput,
  SetWalletCurrencyInput,
  ThreeDResult,
  TwoDResult,
  User,
  Wallet,
  WalletBankInfo,
  WalletTransaction,
  WalletTransactionType,
  Withdrawal,
} from './types'

const API_MODE: ApiMode = 'mock'
const NETWORK_DELAY_MS = 260
const MOCK_AUTH_TOKEN_KEY = 'lottery-webclient-mock-token'
const AUTH_LIVE_ENABLED = (import.meta.env.VITE_AUTH_LIVE_ENABLED as string | undefined) !== 'false'
const BET_CREATE_LIVE_ENABLED = (import.meta.env.VITE_BET_CREATE_LIVE_ENABLED as string | undefined) !== 'false'
const WALLET_LIVE_ENABLED = (import.meta.env.VITE_WALLET_LIVE_ENABLED as string | undefined) !== 'false'
const BET_LIST_LIVE_ENABLED = (import.meta.env.VITE_BET_LIST_LIVE_ENABLED as string | undefined) !== 'false'
const TWOD_RESULTS_LIVE_ENABLED = (import.meta.env.VITE_TWOD_RESULTS_LIVE_ENABLED as string | undefined) !== 'false'
const PAYOUT_LIVE_ENABLED = (import.meta.env.VITE_PAYOUT_LIVE_ENABLED as string | undefined) !== 'false'
const ACCEPTED_PAYMENTS_LIVE_ENABLED = (import.meta.env.VITE_ACCEPTED_PAYMENTS_LIVE_ENABLED as string | undefined) !== 'false'
const ODD_SETTINGS_LIVE_ENABLED = (import.meta.env.VITE_ODD_SETTINGS_LIVE_ENABLED as string | undefined) !== 'false'
const BANK_SETTINGS_LIVE_ENABLED = (import.meta.env.VITE_BANK_SETTINGS_LIVE_ENABLED as string | undefined) !== 'false'
const WALLET_CURRENCY_LIVE_ENABLED = (import.meta.env.VITE_WALLET_CURRENCY_LIVE_ENABLED as string | undefined) !== 'false'
const DEPOSITS_LIVE_ENABLED = (import.meta.env.VITE_DEPOSITS_LIVE_ENABLED as string | undefined) !== 'false'
const WITHDRAWALS_LIVE_ENABLED = (import.meta.env.VITE_WITHDRAWALS_LIVE_ENABLED as string | undefined) !== 'false'
const WALLET_TRANSACTIONS_LIVE_ENABLED = (import.meta.env.VITE_WALLET_TRANSACTIONS_LIVE_ENABLED as string | undefined) !== 'false'
const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000/api/v1').replace(/\/+$/, '')

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

function ensureMockMode() {
  if (API_MODE !== 'mock') {
    throw new Error('Live mode is not wired in this phase.')
  }
}

function ok<T>(message: string, data: T): ApiResult<T> {
  return { message, data, errors: null }
}

function saveMockToken(token: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(MOCK_AUTH_TOKEN_KEY, token)
}

function clearMockToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(MOCK_AUTH_TOKEN_KEY)
}

function getAuthToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(MOCK_AUTH_TOKEN_KEY)
}

export function hasAuthToken() {
  return getAuthToken() != null
}

export function clearAuthToken() {
  clearMockToken()
}

function authOk(message: string, user: User): ApiResult<AuthData> {
  const token = `mock-token-${user.id}-${Date.now()}`
  saveMockToken(token)

  return ok<AuthData>(message, { user, token })
}

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function collectValidationMessages(errors: unknown) {
  if (errors == null || typeof errors !== 'object') {
    return []
  }

  const flatMessages: string[] = []
  Object.values(errors as Record<string, unknown>).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === 'string' && item.trim().length > 0) {
          flatMessages.push(item.trim())
        }
      })
    }
  })

  return flatMessages
}

function buildAuthErrorMessage(status: number, payload: unknown, fallbackMessage: string) {
  const body = payload as
    | {
        message?: string
        errors?: Record<string, string[]>
      }
    | undefined
  const validationMessages = collectValidationMessages(body?.errors)

  if (validationMessages.length > 0) {
    return validationMessages.join(' ')
  }

  if (typeof body?.message === 'string' && body.message.trim().length > 0) {
    return body.message.trim()
  }

  if (status === 401) {
    return 'Invalid credentials.'
  }

  if (status === 422) {
    return 'Please review the highlighted fields and try again.'
  }

  return fallbackMessage
}

async function postAuthJson<TRequest, TResponse>(path: string, payload: TRequest, fallbackMessage: string) {
  let response: Response

  try {
    response = await fetch(buildApiUrl(path), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Unable to connect to server. Please try again.')
  }

  let parsed: unknown = null

  try {
    parsed = await response.json()
  } catch {
    parsed = null
  }

  if (!response.ok) {
    throw new Error(buildAuthErrorMessage(response.status, parsed, fallbackMessage))
  }

  return parsed as TResponse
}

function buildWalletErrorMessage(status: number, payload: unknown, fallbackMessage: string) {
  const body = payload as { message?: string; errors?: Record<string, string[]> } | undefined
  const validationMessages = collectValidationMessages(body?.errors)

  if (validationMessages.length > 0) return validationMessages.join(' ')
  if (typeof body?.message === 'string' && body.message.trim().length > 0) return body.message.trim()
  if (status === 401) return 'Your session has expired. Please log in again.'
  if (status === 404) return 'Bank info not found.'
  if (status === 422) return 'Please review your bank info and try again.'

  return fallbackMessage
}

async function authedRequest<TResponse>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body: unknown,
  fallbackMessage: string,
  on404?: () => TResponse,
): Promise<TResponse> {
  const token = getAuthToken()
  let response: Response

  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body != null ? { body: JSON.stringify(body) } : {}),
    })
  } catch {
    throw new Error('Unable to connect to server. Please try again.')
  }

  let parsed: unknown = null
  try {
    parsed = await response.json()
  } catch {
    parsed = null
  }

  if (response.status === 404 && on404 != null) {
    return on404()
  }

  if (!response.ok) {
    throw new Error(buildWalletErrorMessage(response.status, parsed, fallbackMessage))
  }

  return parsed as TResponse
}

async function registerUserMock(input: RegisterInput) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  const normalizedEmail = input.email.trim().toLowerCase()

  if (normalizedEmail.length === 0 || !normalizedEmail.includes('@')) {
    throw new Error('Invalid email.')
  }

  if (input.password.length < 8) {
    throw new Error('Password must be at least 8 characters.')
  }

  if (input.password !== input.password_confirmation) {
    throw new Error('Password confirmation does not match.')
  }

  const now = new Date().toISOString()

  const nextUser: User = {
    ...mockUser,
    username: input.username.trim(),
    email: normalizedEmail,
    updated_at: now,
  }

  setMockUser(nextUser)

  return authOk('Registration successful', nextUser)
}

async function loginUserMock(input: LoginInput) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  const normalizedEmail = input.email.trim().toLowerCase()

  if (normalizedEmail !== mockUser.email.toLowerCase()) {
    throw new Error('Invalid credentials.')
  }

  if (input.password.length < 8) {
    throw new Error('Invalid credentials.')
  }

  return authOk('Login successful', mockUser)
}

export async function registerUser(input: RegisterInput) {
  if (!AUTH_LIVE_ENABLED) {
    return registerUserMock(input)
  }

  const response = await postAuthJson<RegisterInput, ApiResult<AuthData>>('/register', input, 'Registration failed.')

  if (response.data?.token == null || response.data.user == null) {
    throw new Error('Invalid registration response from server.')
  }

  saveMockToken(response.data.token)
  return response
}

export async function loginUser(input: LoginInput) {
  if (!AUTH_LIVE_ENABLED) {
    return loginUserMock(input)
  }

  const response = await postAuthJson<LoginInput, ApiResult<AuthData>>('/login', input, 'Login failed.')

  if (response.data?.token == null || response.data.user == null) {
    throw new Error('Invalid login response from server.')
  }

  saveMockToken(response.data.token)
  return response
}

export async function logoutUser() {
  if (!AUTH_LIVE_ENABLED) {
    ensureMockMode()
    await wait(NETWORK_DELAY_MS)
    clearMockToken()
    return ok('Logout successful', null)
  }

  const token = getAuthToken()
  let message = 'Logout successful'

  try {
    const response = await fetch(buildApiUrl('/logout'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    let parsed: unknown = null
    try {
      parsed = await response.json()
    } catch {
      parsed = null
    }

    if (!response.ok && response.status !== 401) {
      message = buildAuthErrorMessage(response.status, parsed, 'Unable to log out from server. Logged out on this device.')
    } else {
      const body = parsed as { message?: string } | null
      if (typeof body?.message === 'string' && body.message.trim().length > 0) {
        message = body.message.trim()
      }
    }
  } catch {
    message = 'Unable to reach server. Logged out on this device.'
  }

  clearMockToken()
  return ok(message, null)
}

export async function getMe() {
  if (AUTH_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ user: User }>>('GET', '/me', null, 'Unable to load authenticated user profile.')
  }

  ensureMockMode()
  await wait(NETWORK_DELAY_MS)
  return ok<{ user: User }>('Authenticated user profile', { user: mockUser })
}

export async function getMyBankInfo() {
  if (WALLET_LIVE_ENABLED) {
    // 404 means no bank info yet — normalise to null instead of throwing
    const token = getAuthToken()
    let response: Response
    try {
      response = await fetch(buildApiUrl('/me/bank-info'), {
        headers: {
          Accept: 'application/json',
          ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    } catch {
      throw new Error('Unable to connect to server. Please try again.')
    }

    if (response.status === 404) {
      return ok<{ bank_info: WalletBankInfo | null }>('Bank info not found', { bank_info: null })
    }

    if (!response.ok) {
      throw new Error(`Failed to load bank info (${response.status})`)
    }

    const payload = (await response.json()) as ApiResult<{ bank_info: WalletBankInfo | null }>
    return payload
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ bank_info: WalletBankInfo | null }>('Bank info retrieved', { bank_info: mockBankInfo })
}

export async function createMyBankInfo(input: WalletBankInfo) {
  if (WALLET_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ bank_info: WalletBankInfo }>>(
      'POST',
      '/me/bank-info',
      input,
      'Failed to save bank info.',
    )
  }

  await wait(NETWORK_DELAY_MS)
  setMockBankInfo(input)
  return ok<{ bank_info: WalletBankInfo }>('Bank info created', { bank_info: input })
}

export async function updateMyBankInfo(input: WalletBankInfo) {
  if (WALLET_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ bank_info: WalletBankInfo }>>(
      'PUT',
      '/me/bank-info',
      input,
      'Failed to update bank info.',
    )
  }

  await wait(NETWORK_DELAY_MS)
  setMockBankInfo(input)
  return ok<{ bank_info: WalletBankInfo }>('Bank info updated', { bank_info: input })
}

export async function listBets() {
  if (BET_LIST_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ bets: Bet[] }>>(
      'GET', '/bets', null, 'Failed to load bet history.',
      () => ok<{ bets: Bet[] }>('No bets', { bets: [] }),
    )
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ bets: Bet[] }>('Bets list', { bets: mockBets })
}

export async function listPayoutHistory() {
  if (PAYOUT_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ payout_history: Bet[] }>>(
      'GET',
      '/bets/payout-history',
      null,
      'Failed to load payout history.',
      () => ok<{ payout_history: Bet[] }>('No payout history', { payout_history: [] }),
    )
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ payout_history: Bet[] }>('Payout history', { payout_history: mockBets })
}

export async function listAcceptedPayments() {
  if (ACCEPTED_PAYMENTS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ accepted_payments: Bet[] }>>(
      'GET',
      '/bets/accepted-payments',
      null,
      'Failed to load accepted payments.',
      () => ok<{ accepted_payments: Bet[] }>('No accepted payments', { accepted_payments: [] }),
    )
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ accepted_payments: Bet[] }>('Accepted payments', { accepted_payments: mockBets })
}

export async function listBankSettings() {
  if (BANK_SETTINGS_LIVE_ENABLED) {
    const result = await authedRequest<ApiResult<Record<string, AdminBankSetting[]>>>(
      'GET',
      '/bank-settings',
      null,
      'Failed to load bank settings.',
      () => ok<Record<string, AdminBankSetting[]>>('No bank settings', { admin_bank_settings: [] }),
    )
    const settings = result.data.admin_bank_settings ?? result.data.bank_settings ?? []
    return ok<{ admin_bank_settings: AdminBankSetting[] }>(result.message, { admin_bank_settings: settings })
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ admin_bank_settings: AdminBankSetting[] }>('Bank settings', { admin_bank_settings: mockAdminBankSettings })
}

async function createBetMock(input: BetCreateInput) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  if (input.bet_numbers.length === 0) {
    throw new Error('At least one bet number is required.')
  }

  const normalizedNumbers = input.bet_numbers.map((row) => {
    const sanitizedNumber = row.number.replace(/\D/g, '')

    if (sanitizedNumber.length === 0 || sanitizedNumber.length > 3) {
      throw new Error('Invalid bet number.')
    }

    if (!Number.isInteger(row.amount) || row.amount < 1) {
      throw new Error('Invalid bet amount.')
    }

    return {
      number: String(Number(sanitizedNumber)),
      amount: row.amount,
    }
  })

  const totalAmount = normalizedNumbers.reduce((sum, row) => sum + row.amount, 0)

  const newBet: Bet = {
    id: crypto.randomUUID(),
    bet_type: input.bet_type,
    currency: input.currency,
    total_amount: totalAmount.toFixed(2),
    status: 'PENDING',
    bet_result_status: 'OPEN',
    payout_status: 'PENDING',
    stock_date: new Date().toISOString().slice(0, 10),
    target_opentime: input.target_opentime ?? '12:01:00',
    bet_numbers: normalizedNumbers,
    placed_at: new Date().toISOString(),
    paid_out_at: null,
  }

  mockBets.unshift(newBet)

  // Deduct from mock wallet balance
  setMockWallet({ ...mockWallet, balance: mockWallet.balance - totalAmount })

  return ok<{ bet: Bet }>('Bet created', { bet: newBet })
}

export async function createBet(input: BetCreateInput) {
  if (input.bet_numbers.length === 0) {
    throw new Error('At least one bet number is required.')
  }

  const normalizedNumbers = input.bet_numbers.map((row) => {
    const sanitizedNumber = row.number.replace(/\D/g, '')

    if (sanitizedNumber.length === 0 || sanitizedNumber.length > 3) {
      throw new Error('Invalid bet number.')
    }

    if (!Number.isInteger(row.amount) || row.amount < 1) {
      throw new Error('Invalid bet amount.')
    }

    return {
      number: sanitizedNumber,
      amount: row.amount,
    }
  })

  if (!BET_CREATE_LIVE_ENABLED) {
    return createBetMock(input)
  }

  const response = await authedRequest<ApiResult<{ bet: Bet }>>(
    'POST',
    '/bets',
    {
      bet_type: input.bet_type,
      currency: input.currency,
      ...(input.target_opentime != null ? { target_opentime: input.target_opentime } : {}),
      bet_numbers: normalizedNumbers,
    },
    'Create bet failed.',
  )

  if (response.data?.bet == null) {
    throw new Error('Invalid bet create response from server.')
  }

  return response
}

export async function getBetById(id: string) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  const bet = mockBets.find((item) => item.id === id) ?? null
  return ok<{ bet: Bet | null }>('Bet detail', { bet })
}

export async function deleteBetById(id: string) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  const index = mockBets.findIndex((item) => item.id === id)

  if (index !== -1) {
    const next = [...mockBets]
    next.splice(index, 1)
    setMockBets(next)
  }

  return ok('Bet deleted', null)
}

export async function listAnnouncements() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ announcements: Announcement[] }>('Announcements list', {
    announcements: mockAnnouncements,
  })
}

export async function getAnnouncementById(id: number) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  const announcement = mockAnnouncements.find((item) => item.id === id) ?? null
  return ok<{ announcement: Announcement | null }>('Announcement detail', {
    announcement,
  })
}

export async function listOddSettings() {
  if (ODD_SETTINGS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ odd_settings: OddSetting[] }>>('GET', '/odd-settings', null, 'Failed to load odd settings.')
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ odd_settings: OddSetting[] }>('Odd settings list', {
    odd_settings: mockOddSettings,
  })
}

export async function getOddSettingById(id: number) {
  if (ODD_SETTINGS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ odd_setting: OddSetting | null }>>('GET', `/odd-settings/${id}`, null, 'Failed to load odd setting.')
  }

  await wait(NETWORK_DELAY_MS)
  const oddSetting = mockOddSettings.find((item) => item.id === id) ?? null
  return ok<{ odd_setting: OddSetting | null }>('Odd setting detail', {
    odd_setting: oddSetting,
  })
}

export async function listTwoDResultsLastFiveDays() {
  if (TWOD_RESULTS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ two_d_results: TwoDResult[] }>>(
      'GET',
      '/two-d-results/last-5-days',
      null,
      'Failed to load 2D results.',
      () => ok<{ two_d_results: TwoDResult[] }>('No 2D results', { two_d_results: [] }),
    )
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ two_d_results: TwoDResult[] }>('2D results (last 5 days)', {
    two_d_results: mockTwoDResults,
  })
}

export async function listTwoDResults() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ two_d_results: TwoDResult[] }>('2D results list', {
    two_d_results: mockTwoDResults,
  })
}

export async function getLatestTwoDResult() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ two_d_result: TwoDResult | null }>('Latest 2D result', {
    two_d_result: mockTwoDResults[0] ?? null,
  })
}

export async function listThreeDResults() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ three_d_results: ThreeDResult[] }>('3D results list', {
    three_d_results: mockThreeDResults,
  })
}

export async function getLatestThreeDResult() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ three_d_result: ThreeDResult | null }>('Latest 3D result', {
    three_d_result: mockThreeDResults[0] ?? null,
  })
}

// ── Wallet ────────────────────────────────────────────────────────────────────

export async function getMyWallet(): Promise<ApiResult<{ wallet: Wallet }>> {
  if (WALLET_CURRENCY_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ wallet: Wallet }>>('GET', '/me/wallet', null, 'Failed to load wallet.')
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ wallet: Wallet }>('Wallet', { wallet: mockWallet })
}

export async function setWalletCurrency(input: SetWalletCurrencyInput): Promise<ApiResult<{ wallet: Wallet }>> {
  if (WALLET_CURRENCY_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ wallet: Wallet }>>('PUT', '/me/wallet/currency', input, 'Failed to set wallet currency.')
  }

  await wait(NETWORK_DELAY_MS)
  const next: Wallet = { ...mockWallet, currency: input.currency, currency_locked_at: new Date().toISOString() }
  setMockWallet(next)
  return ok<{ wallet: Wallet }>('Wallet currency set', { wallet: next })
}

export async function listWalletTransactions(params?: {
  page?: number
  page_size?: number
  type?: WalletTransactionType
}): Promise<ApiResult<{ transactions: WalletTransaction[] }>> {
  if (WALLET_TRANSACTIONS_LIVE_ENABLED) {
    const query = new URLSearchParams()
    if (params?.page != null) query.set('page', String(params.page))
    if (params?.page_size != null) query.set('page_size', String(params.page_size))
    if (params?.type != null) query.set('type', params.type)
    const path = `/me/wallet/transactions${query.toString() ? `?${query.toString()}` : ''}`
    return authedRequest<ApiResult<{ transactions: WalletTransaction[] }>>('GET', path, null, 'Failed to load transactions.')
  }

  await wait(NETWORK_DELAY_MS)
  const filtered = params?.type != null ? mockTransactions.filter((t) => t.type === params.type) : mockTransactions
  return ok<{ transactions: WalletTransaction[] }>('Transactions', { transactions: filtered })
}

// ── Deposits ──────────────────────────────────────────────────────────────────

async function postFormData<TResponse>(path: string, payload: FormData, fallbackMessage: string): Promise<TResponse> {
  const token = getAuthToken()
  let response: Response

  try {
    response = await fetch(buildApiUrl(path), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: payload,
    })
  } catch {
    throw new Error('Unable to connect to server. Please try again.')
  }

  let parsed: unknown = null
  try {
    parsed = await response.json()
  } catch {
    parsed = null
  }

  if (!response.ok) {
    throw new Error(buildWalletErrorMessage(response.status, parsed, fallbackMessage))
  }

  return parsed as TResponse
}

export async function createDeposit(input: CreateDepositInput): Promise<ApiResult<{ deposit: Deposit }>> {
  if (DEPOSITS_LIVE_ENABLED) {
    const payload = new FormData()
    payload.append('admin_bank_setting_id', String(input.admin_bank_setting_id))
    payload.append('currency', input.currency)
    payload.append('claimed_amount', String(input.claimed_amount))
    payload.append('proof_image', input.proof_image)
    if (input.transfer_note != null) payload.append('transfer_note', input.transfer_note)
    return postFormData<ApiResult<{ deposit: Deposit }>>('/deposits', payload, 'Create deposit failed.')
  }

  await wait(NETWORK_DELAY_MS)
  const newDeposit: Deposit = {
    id: `dep-${crypto.randomUUID()}`,
    user_id: 1,
    admin_bank_setting_id: 1,
    currency: mockWallet.currency ?? 'MMK',
    claimed_amount: input.claimed_amount,
    approved_amount: null,
    transfer_note: input.transfer_note ?? null,
    status: 'PENDING',
    admin_note: null,
    rejection_reason: null,
    reviewed_by_user_id: null,
    reviewed_at: null,
    proof_of_payment: { exists: true, download_url: null, file_name: input.proof_image.name, mime_type: input.proof_image.type, size: input.proof_image.size },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  setMockDeposits([newDeposit, ...mockDeposits])
  return ok<{ deposit: Deposit }>('Deposit created', { deposit: newDeposit })
}

export async function listDeposits(params?: {
  page?: number
  page_size?: number
}): Promise<ApiResult<{ deposits: Deposit[] }>> {
  if (DEPOSITS_LIVE_ENABLED) {
    const query = new URLSearchParams()
    if (params?.page != null) query.set('page', String(params.page))
    if (params?.page_size != null) query.set('page_size', String(params.page_size))
    const path = `/me/deposits${query.toString() ? `?${query.toString()}` : ''}`
    return authedRequest<ApiResult<{ deposits: Deposit[] }>>('GET', path, null, 'Failed to load deposits.')
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ deposits: Deposit[] }>('Deposits', { deposits: mockDeposits })
}

export async function getDepositById(depositId: string): Promise<ApiResult<{ deposit: Deposit | null }>> {
  if (DEPOSITS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ deposit: Deposit | null }>>('GET', `/me/deposits/${depositId}`, null, 'Failed to load deposit.')
  }

  await wait(NETWORK_DELAY_MS)
  const deposit = mockDeposits.find((d) => d.id === depositId) ?? null
  return ok<{ deposit: Deposit | null }>('Deposit detail', { deposit })
}

export async function cancelDeposit(depositId: string): Promise<ApiResult<{ deposit: Deposit }>> {
  if (DEPOSITS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ deposit: Deposit }>>('DELETE', `/me/deposits/${depositId}`, null, 'Failed to cancel deposit.')
  }

  await wait(NETWORK_DELAY_MS)
  const index = mockDeposits.findIndex((d) => d.id === depositId)
  if (index === -1) throw new Error('Deposit not found.')
  const cancelled = { ...mockDeposits[index]!, status: 'REJECTED' as const, updated_at: new Date().toISOString() }
  const next = [...mockDeposits]
  next[index] = cancelled
  setMockDeposits(next)
  return ok<{ deposit: Deposit }>('Deposit cancelled', { deposit: cancelled })
}

export async function downloadDepositProof(depositId: string): Promise<Blob> {
  if (DEPOSITS_LIVE_ENABLED) {
    const token = getAuthToken()
    const response = await fetch(buildApiUrl(`/me/deposits/${depositId}/proof`), {
      headers: {
        ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!response.ok) throw new Error('Failed to download deposit proof.')
    return response.blob()
  }

  await wait(NETWORK_DELAY_MS)
  return new Blob(['mock deposit proof'], { type: 'image/jpeg' })
}

// ── Withdrawals ───────────────────────────────────────────────────────────────

export async function createWithdrawal(input: CreateWithdrawalInput): Promise<ApiResult<{ withdrawal: Withdrawal }>> {
  if (WITHDRAWALS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ withdrawal: Withdrawal }>>('POST', '/withdrawals', input, 'Create withdrawal failed.')
  }

  await wait(NETWORK_DELAY_MS)
  const newWithdrawal: Withdrawal = {
    id: `wth-${crypto.randomUUID()}`,
    user_id: 1,
    currency: input.currency,
    amount: input.amount,
    status: 'PENDING',
    bank_snapshot: {
      bank_name: mockWallet.bank_name ?? 'KBZ',
      account_name: mockWallet.account_name ?? 'User',
      account_number: mockWallet.account_number ?? '0000000000',
    },
    admin_note: null,
    rejection_reason: null,
    reviewed_by_user_id: null,
    reviewed_at: null,
    payout_proof: { exists: false, download_url: null, file_name: null, mime_type: null, size: null },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  setMockWithdrawals([newWithdrawal, ...mockWithdrawals])
  setMockWallet({ ...mockWallet, balance: mockWallet.balance - input.amount })
  return ok<{ withdrawal: Withdrawal }>('Withdrawal created', { withdrawal: newWithdrawal })
}

export async function listWithdrawals(params?: {
  page?: number
  page_size?: number
}): Promise<ApiResult<{ withdrawals: Withdrawal[] }>> {
  if (WITHDRAWALS_LIVE_ENABLED) {
    const query = new URLSearchParams()
    if (params?.page != null) query.set('page', String(params.page))
    if (params?.page_size != null) query.set('page_size', String(params.page_size))
    const path = `/withdrawals${query.toString() ? `?${query.toString()}` : ''}`
    return authedRequest<ApiResult<{ withdrawals: Withdrawal[] }>>('GET', path, null, 'Failed to load withdrawals.')
  }

  await wait(NETWORK_DELAY_MS)
  return ok<{ withdrawals: Withdrawal[] }>('Withdrawals', { withdrawals: mockWithdrawals })
}

export async function getWithdrawalById(withdrawalId: string): Promise<ApiResult<{ withdrawal: Withdrawal | null }>> {
  if (WITHDRAWALS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ withdrawal: Withdrawal | null }>>('GET', `/withdrawals/${withdrawalId}`, null, 'Failed to load withdrawal.')
  }

  await wait(NETWORK_DELAY_MS)
  const withdrawal = mockWithdrawals.find((w) => w.id === withdrawalId) ?? null
  return ok<{ withdrawal: Withdrawal | null }>('Withdrawal detail', { withdrawal })
}

export async function cancelWithdrawal(withdrawalId: string): Promise<ApiResult<{ withdrawal: Withdrawal }>> {
  if (WITHDRAWALS_LIVE_ENABLED) {
    return authedRequest<ApiResult<{ withdrawal: Withdrawal }>>('POST', `/withdrawals/${withdrawalId}/cancel`, null, 'Failed to cancel withdrawal.')
  }

  await wait(NETWORK_DELAY_MS)
  const index = mockWithdrawals.findIndex((w) => w.id === withdrawalId)
  if (index === -1) throw new Error('Withdrawal not found.')
  const item = mockWithdrawals[index]!
  const cancelled = { ...item, status: 'REJECTED' as const, updated_at: new Date().toISOString() }
  const next = [...mockWithdrawals]
  next[index] = cancelled
  setMockWithdrawals(next)
  setMockWallet({ ...mockWallet, balance: mockWallet.balance + item.amount })
  return ok<{ withdrawal: Withdrawal }>('Withdrawal cancelled', { withdrawal: cancelled })
}

export async function downloadWithdrawalProof(withdrawalId: string): Promise<Blob> {
  if (WITHDRAWALS_LIVE_ENABLED) {
    const token = getAuthToken()
    const response = await fetch(buildApiUrl(`/withdrawals/${withdrawalId}/proof`), {
      headers: {
        ...(token != null ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!response.ok) throw new Error('Failed to download withdrawal proof.')
    return response.blob()
  }

  await wait(NETWORK_DELAY_MS)
  return new Blob(['mock withdrawal proof'], { type: 'image/jpeg' })
}
