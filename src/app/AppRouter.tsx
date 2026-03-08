import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/app/auth/LoginPage'
import { RegisterPage } from '@/app/auth/RegisterPage'
import { DepositHistoryPage } from '@/app/gambling/DepositHistoryPage'
import { GamblingHistoryPage } from '@/app/gambling/GamblingHistoryPage'
import { TransactionRecordPage } from '@/app/gambling/TransactionRecordPage'
import { WithdrawalHistoryPage } from '@/app/gambling/WithdrawalHistoryPage'
import { ExploreTabPage } from '@/app/tabs/ExploreTabPage'
import { HomeTabPage } from '@/app/tabs/HomeTabPage'
import { SettingTabPage } from '@/app/tabs/SettingTabPage'
import { AboutPage } from '@/app/wallet-profile/AboutPage'
import { AdPage } from '@/app/wallet-profile/AdPage'
import { DepositPage } from '@/app/wallet-profile/DepositPage'
import { HelpCenterPage } from '@/app/wallet-profile/HelpCenterPage'
import { LotteryPage } from '@/app/wallet-profile/LotteryPage'
import { MoneyIncomePage } from '@/app/wallet-profile/MoneyIncomePage'
import { NumberPlayPage } from '@/app/wallet-profile/NumberPlayPage'
import { MobileFrameShell } from '@/layouts/MobileFrameShell'
import { type AppSectionId, allRoutes, routeMap } from './routeMap'
import { SectionPlaceholderPage } from './SectionPlaceholderPage'

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

  if (section === 'tabs' && routeId === 'explore') {
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

  return <SectionPlaceholderPage section={section} routeId={routeId} />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileFrameShell />}>
          <Route index element={<Navigate replace to={`/${routeMap.tabs[0].path}`} />} />

          {allRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={resolveRouteElement(route.section, route.id)} />
          ))}

          <Route path="*" element={<Navigate replace to={`/${routeMap.tabs[0].path}`} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
