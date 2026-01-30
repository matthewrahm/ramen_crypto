import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './components/auth/ProtectedRoute'
import useBinanceSocket from './hooks/useBinanceSocket'
import useThemeSync from './hooks/useThemeSync'
import useAuthStore from './stores/useAuthStore'
import RamenLoader from './components/ui/RamenLoader'
import ErrorBoundary from './components/ui/ErrorBoundary'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SentimentPage = lazy(() => import('./pages/SentimentPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <RamenLoader />
    </div>
  )
}

function AppRoutes() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  useBinanceSocket()
  useThemeSync()

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public routes */}
        <Route
          path="auth"
          element={
            <Suspense fallback={<PageLoader />}>
              <AuthPage />
            </Suspense>
          }
        />
        <Route
          path="reset-password"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResetPasswordPage />
            </Suspense>
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="sentiment"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SentimentPage />
                </Suspense>
              }
            />
            <Route
              path="portfolio"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PortfolioPage />
                </Suspense>
              }
            />
            <Route
              path="compare"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ComparePage />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProfilePage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
