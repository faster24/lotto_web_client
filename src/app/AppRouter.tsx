import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LoginPage } from '@/app/auth/LoginPage'
import { RegisterPage } from '@/app/auth/RegisterPage'
import { hasAuthToken } from '@/api/client'
import { DepositHistoryPage } from '@/app/gambling/DepositHistoryPage'
import { GamblingHistoryPage } from '@/app/gambling/GamblingHistoryPage'
import { TransactionRecordPage } from '@/app/gambling/TransactionRecordPage'
import { WithdrawalHistoryPage } from '@/app/gambling/WithdrawalHistoryPage'
// v1: announcements not used
// import { AnnouncementsPage } from '@/app/announcements/AnnouncementsPage'
// import { AnnouncementDetailPage } from '@/app/announcements/AnnouncementDetailPage'
import { BetDetailPage } from '@/app/bets/BetDetailPage'
import { BetsPage } from '@/app/bets/BetsPage'
import { PlaceBetPage } from '@/app/bets/PlaceBetPage'
import { OddSettingDetailPage } from '@/app/odd-settings/OddSettingDetailPage'
import { OddSettingsPage } from '@/app/odd-settings/OddSettingsPage'
import { ThreeDLatestPage } from '@/app/results/ThreeDLatestPage'
import { ThreeDResultsPage } from '@/app/results/ThreeDResultsPage'
import { TwoDLatestPage } from '@/app/results/TwoDLatestPage'
import { TwoDResultsPage } from '@/app/results/TwoDResultsPage'
import { ExploreTabPage } from '@/app/tabs/ExploreTabPage'
import { HomeTabPage } from '@/app/tabs/HomeTabPage'
import { SettingTabPage } from '@/app/tabs/SettingTabPage'
import { BankInfoPage } from '@/app/user/BankInfoPage'
import { UserProfilePage } from '@/app/user/UserProfilePage'
import { AboutPage } from '@/app/wallet-profile/AboutPage'
import { AdPage } from '@/app/wallet-profile/AdPage'
import { DepositPage } from '@/app/wallet-profile/DepositPage'
import { HelpCenterPage } from '@/app/wallet-profile/HelpCenterPage'
import { LotteryPage } from '@/app/wallet-profile/LotteryPage'
import { MoneyIncomePage } from '@/app/wallet-profile/MoneyIncomePage'
import { NumberPlayPage } from '@/app/wallet-profile/NumberPlayPage'
import { MobileFrameShell } from '@/layouts/MobileFrameShell'
import { type AppRouteDefinition, type AppSectionId, allRoutes, routeMap } from './routeMap'
import { SectionPlaceholderPage } from './SectionPlaceholderPage'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (!hasAuthToken()) {
    return <Navigate replace to="/auth/login" state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

function isProtectedRoute(route: AppRouteDefinition) {
  return route.section === 'tabs' && (route.id === 'bets' || route.id === 'setting')
}

function resolveRouteElement(section: AppSectionId, routeId: string) {
  if (section === 'auth' && routeId === 'login') {
    return <LoginPage />
  }

  if (section === 'auth' && routeId === 'register') {
    return <RegisterPage />
  }

  if (section === 'tabs' && routeId === 'home') {
    return <HomeTabPage />
  }

  if (section === 'tabs' && routeId === 'bets') {
    return <ExploreTabPage />
  }

  if (section === 'tabs' && routeId === 'setting') {
    return <SettingTabPage />
  }

  if (section === 'gambling' && routeId === 'deposit-history') {
    return <DepositHistoryPage />
  }

  if (section === 'gambling' && routeId === 'gambling-history') {
    return <GamblingHistoryPage />
  }

  if (section === 'gambling' && routeId === 'transaction-record') {
    return <TransactionRecordPage />
  }

  if (section === 'gambling' && routeId === 'withdrawal-history') {
    return <WithdrawalHistoryPage />
  }

  if (section === 'wallet-profile' && routeId === 'number-play') {
    return <NumberPlayPage />
  }

  if (section === 'wallet-profile' && routeId === 'deposit') {
    return <DepositPage />
  }

  if (section === 'wallet-profile' && routeId === 'money-income') {
    return <MoneyIncomePage />
  }

  if (section === 'wallet-profile' && routeId === 'lottery') {
    return <LotteryPage />
  }

  if (section === 'wallet-profile' && routeId === 'about') {
    return <AboutPage />
  }

  if (section === 'wallet-profile' && routeId === 'help-center') {
    return <HelpCenterPage />
  }

  if (section === 'wallet-profile' && routeId === 'ad') {
    return <AdPage />
  }

  if (section === 'user-api' && routeId === 'user-profile') {
    return <UserProfilePage />
  }

  if (section === 'user-api' && routeId === 'user-bank-info') {
    return <BankInfoPage />
  }

  if (section === 'user-api' && routeId === 'bets') {
    return <BetsPage />
  }

  if (section === 'user-api' && routeId === 'bets-2d') {
    return <ProtectedRoute><PlaceBetPage betType="2D" /></ProtectedRoute>
  }

  if (section === 'user-api' && routeId === 'bets-3d') {
    return <ProtectedRoute><PlaceBetPage betType="3D" /></ProtectedRoute>
  }

  // v1: announcements not used
  // if (section === 'user-api' && routeId === 'announcements') {
  //   return <AnnouncementsPage />
  // }

  if (section === 'user-api' && routeId === 'odd-settings') {
    return <OddSettingsPage />
  }

  if (section === 'user-api' && routeId === 'results-2d') {
    return <TwoDResultsPage />
  }

  if (section === 'user-api' && routeId === 'results-2d-latest') {
    return <TwoDLatestPage />
  }

  if (section === 'user-api' && routeId === 'results-3d') {
    return <ThreeDResultsPage />
  }

  if (section === 'user-api' && routeId === 'results-3d-latest') {
    return <ThreeDLatestPage />
  }

  return <SectionPlaceholderPage section={section} routeId={routeId} />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileFrameShell />}>
          <Route index element={<Navigate replace to={`/${routeMap.tabs[0].path}`} />} />

          {allRoutes.map((route) => {
            const element = resolveRouteElement(route.section, route.id)
            const guardedElement = isProtectedRoute(route) ? <ProtectedRoute>{element}</ProtectedRoute> : element

            return <Route key={route.path} path={route.path} element={guardedElement} />
          })}

          <Route path="tabs/explore" element={<Navigate replace to="/tabs/bets" />} />
          <Route path="wallet-profile/about" element={<Navigate replace to="/privacy-policy" />} />
          <Route path="wallet-profile/privacy-policy" element={<Navigate replace to="/privacy-policy" />} />
          <Route path="bets/:betId" element={<BetDetailPage />} />
          {/* v1: announcements not used */}
          {/* <Route path="announcements/:id" element={<AnnouncementDetailPage />} /> */}
          <Route path="odd-settings/:id" element={<OddSettingDetailPage />} />

          <Route path="*" element={<Navigate replace to={`/${routeMap.tabs[0].path}`} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
