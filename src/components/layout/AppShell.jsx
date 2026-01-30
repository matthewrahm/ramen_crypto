import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import GuestBanner from '../auth/GuestBanner'

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="aurora-bg" />
      <GuestBanner />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
