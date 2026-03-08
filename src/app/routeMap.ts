export type AppSectionId = 'auth' | 'tabs' | 'gambling' | 'wallet-profile'

export type AppRouteDefinition = {
  id: string
  section: AppSectionId
  path: string
  label: string
  description: string
}

export const routeMap: Record<AppSectionId, AppRouteDefinition[]> = {
  auth: [
    {
      id: 'login',
      section: 'auth',
      path: 'auth/login',
      label: 'Login',
      description: 'Authentication entry shell for credential and OTP flows.',
    },
    {
      id: 'register',
      section: 'auth',
      path: 'auth/register',
      label: 'Register',
      description: 'Account onboarding shell for identity and phone setup.',
    },
  ],
  tabs: [
    {
      id: 'home',
      section: 'tabs',
      path: 'tabs/home',
      label: 'Home',
      description: 'Primary dashboard shell for live numbers and quick actions.',
    },
    {
      id: 'explore',
      section: 'tabs',
      path: 'tabs/explore',
      label: 'Explore',
      description: 'Discovery shell for side widgets and recommendations.',
    },
    {
      id: 'setting',
      section: 'tabs',
      path: 'tabs/setting',
      label: 'Setting',
      description: 'Settings shell for profile tools and service cards.',
    },
  ],
  gambling: [
    {
      id: 'deposit-history',
      section: 'gambling',
      path: 'gambling/deposit-history',
      label: 'Deposit History',
      description: 'Transaction ledger shell for recent deposits.',
    },
    {
      id: 'gambling-history',
      section: 'gambling',
      path: 'gambling/gambling-history',
      label: 'Gambling History',
      description: 'Bet history shell for previous rounds and outcomes.',
    },
    {
      id: 'transaction-record',
      section: 'gambling',
      path: 'gambling/transaction-record',
      label: 'Transaction Record',
      description: 'Combined wallet and play transactions shell.',
    },
    {
      id: 'withdrawal-history',
      section: 'gambling',
      path: 'gambling/withdrawal-history',
      label: 'Withdrawal History',
      description: 'Payout history shell for cash-out records.',
    },
  ],
  'wallet-profile': [
    {
      id: 'number-play',
      section: 'wallet-profile',
      path: 'wallet-profile/number-play',
      label: 'Number Play',
      description: 'Ticket composition shell for 2D/3D selections.',
    },
    {
      id: 'deposit',
      section: 'wallet-profile',
      path: 'wallet-profile/deposit',
      label: 'Deposit',
      description: 'Funding shell with payment channel cards.',
    },
    {
      id: 'money-income',
      section: 'wallet-profile',
      path: 'wallet-profile/money-income',
      label: 'Money Income',
      description: 'Income summary shell for balances and statements.',
    },
    {
      id: 'lottery',
      section: 'wallet-profile',
      path: 'wallet-profile/lottery',
      label: 'Lottery',
      description: 'Lottery detail shell for ticket and round snapshots.',
    },
    {
      id: 'about',
      section: 'wallet-profile',
      path: 'wallet-profile/about',
      label: 'About',
      description: 'Informational shell for app details and policies.',
    },
    {
      id: 'help-center',
      section: 'wallet-profile',
      path: 'wallet-profile/help-center',
      label: 'Help Center',
      description: 'Support shell for issue reporting and assistance.',
    },
    {
      id: 'ad',
      section: 'wallet-profile',
      path: 'wallet-profile/ad',
      label: 'Ad',
      description: 'Ad and promotion shell for campaign cards.',
    },
  ],
}

export const allRoutes = Object.values(routeMap).flat()
