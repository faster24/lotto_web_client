import {
  mockAnnouncements,
  mockBankInfo,
  mockBets,
  mockOddSettings,
  mockThreeDResults,
  mockTwoDResults,
  mockUser,
  setMockBankInfo,
  setMockBets,
  setMockUser,
} from './mockData'
import type {
  Announcement,
  ApiMode,
  ApiResult,
  AuthData,
  Bet,
  BetCreateInput,
  LoginInput,
  OddSetting,
  RegisterInput,
  ThreeDResult,
  TwoDResult,
  User,
  WalletBankInfo,
} from './types'

const API_MODE: ApiMode = 'mock'
const NETWORK_DELAY_MS = 260
const MOCK_AUTH_TOKEN_KEY = 'lottery-webclient-mock-token'
const AUTH_LIVE_ENABLED = (import.meta.env.VITE_AUTH_LIVE_ENABLED as string | undefined) !== 'false'
const BET_CREATE_LIVE_ENABLED = (import.meta.env.VITE_BET_CREATE_LIVE_ENABLED as string | undefined) !== 'false'
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

function buildBetCreateErrorMessage(status: number, payload: unknown, fallbackMessage: string) {
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
    return 'You are not authenticated. Please log in again.'
  }

  if (status === 422) {
    return 'Please review your bet form and try again.'
  }

  return fallbackMessage
}

async function postBetFormData<TResponse>(path: string, payload: FormData, fallbackMessage: string) {
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
    throw new Error(buildBetCreateErrorMessage(response.status, parsed, fallbackMessage))
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
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ user: User }>('Authenticated user profile', { user: mockUser })
}

export async function getMyBankInfo() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ bank_info: WalletBankInfo | null }>('Bank info retrieved', {
    bank_info: mockBankInfo,
  })
}

export async function createMyBankInfo(input: WalletBankInfo) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  setMockBankInfo(input)

  return ok<{ bank_info: WalletBankInfo }>('Bank info created', {
    bank_info: input,
  })
}

export async function updateMyBankInfo(input: WalletBankInfo) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  setMockBankInfo(input)

  return ok<{ bank_info: WalletBankInfo }>('Bank info updated', {
    bank_info: input,
  })
}

export async function clearMyBankInfo() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  setMockBankInfo(null)

  return ok('Bank info cleared', null)
}

export async function listBets() {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ bets: Bet[] }>('Bets list', { bets: mockBets })
}

async function createBetMock(input: BetCreateInput) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  if (!(input.pay_slip_image instanceof File)) {
    throw new Error('Pay slip image is required.')
  }

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
    target_opentime: input.target_opentime,
    bet_numbers: normalizedNumbers,
    placed_at: new Date().toISOString(),
  }

  mockBets.unshift(newBet)

  return ok<{ bet: Bet }>('Bet created', { bet: newBet })
}

export async function createBet(input: BetCreateInput) {
  if (!(input.pay_slip_image instanceof File)) {
    throw new Error('Pay slip image is required.')
  }

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

  const shouldUseLiveTwoDCreate = BET_CREATE_LIVE_ENABLED && input.bet_type === '2D'

  if (!shouldUseLiveTwoDCreate) {
    return createBetMock(input)
  }

  const payload = new FormData()
  payload.append('pay_slip_image', input.pay_slip_image)
  payload.append('bet_type', input.bet_type)
  payload.append('currency', input.currency)
  payload.append('target_opentime', input.target_opentime)

  normalizedNumbers.forEach((row, index) => {
    payload.append(`bet_numbers[${index}][number]`, row.number)
    payload.append(`bet_numbers[${index}][amount]`, String(row.amount))
  })

  const response = await postBetFormData<ApiResult<{ bet: Bet }>>('/bets', payload, 'Create bet failed.')

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
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  return ok<{ odd_settings: OddSetting[] }>('Odd settings list', {
    odd_settings: mockOddSettings,
  })
}

export async function getOddSettingById(id: number) {
  ensureMockMode()
  await wait(NETWORK_DELAY_MS)

  const oddSetting = mockOddSettings.find((item) => item.id === id) ?? null
  return ok<{ odd_setting: OddSetting | null }>('Odd setting detail', {
    odd_setting: oddSetting,
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
