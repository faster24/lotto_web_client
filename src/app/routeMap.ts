export type AppSectionId = 'auth' | 'tabs' | 'gambling' | 'wallet-profile' | 'user-api'

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
      label: 'Lobby',
      description: 'Primary dashboard shell for live numbers and quick actions.',
    },
    {
      id: 'bets',
      section: 'tabs',
      path: 'tabs/bets',
      label: 'My Bets',
      description: 'Bet center shell for placing and tracking rounds.',
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
  'user-api': [
    {
      id: 'user-profile',
      section: 'user-api',
      path: 'user/profile',
      label: 'Profile',
      description: 'Authenticated profile payload from /me.',
    },
    {
      id: 'user-bank-info',
      section: 'user-api',
      path: 'user/bank-info',
      label: 'Bank Info',
      description: 'Bank account create/update/clear flow from /me/bank-info.',
    },
    {
      id: 'bets',
      section: 'user-api',
      path: 'bets',
      label: 'Bets',
      description: 'List and create bets using /bets.',
    },
    {
      id: 'announcements',
      section: 'user-api',
      path: 'announcements',
      label: 'Announcements',
      description: 'Notices feed from /announcements.',
    },
    {
      id: 'odd-settings',
      section: 'user-api',
      path: 'odd-settings',
      label: 'Odd Settings',
      description: 'Public odd settings from /odd-settings.',
    },
    {
      id: 'results-2d',
      section: 'user-api',
      path: 'results/2d',
      label: '2D Results',
      description: '2D result history from /two-d-results.',
    },
    {
      id: 'results-2d-latest',
      section: 'user-api',
      path: 'results/2d/latest',
      label: 'Latest 2D',
      description: 'Latest 2D result from /two-d-results/latest.',
    },
    {
      id: 'results-3d',
      section: 'user-api',
      path: 'results/3d',
      label: '3D Results',
      description: '3D result history from /three-d-results.',
    },
    {
      id: 'results-3d-latest',
      section: 'user-api',
      path: 'results/3d/latest',
      label: 'Latest 3D',
      description: 'Latest 3D result from /three-d-results/latest.',
    },
  ],
}

export const allRoutes = Object.values(routeMap).flat()
