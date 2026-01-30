import { NavLink } from 'react-router-dom'
import { ASSETS } from '../../lib/constants'
import useAppStore from '../../stores/useAppStore'
import usePriceStore from '../../stores/usePriceStore'
import useAuthStore from '../../stores/useAuthStore'
import WatchlistCard from '../dashboard/WatchlistCard'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/sentiment', label: 'Sentiment', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to: '/portfolio', label: 'Portfolio', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/compare', label: 'Compare', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

const profileNavItem = {
  to: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
}

export default function Sidebar() {
  const selectedAsset = useAppStore((s) => s.selectedAsset)
  const setSelectedAsset = useAppStore((s) => s.setSelectedAsset)
  const session = useAuthStore((s) => s.session)

  const items = session ? [...navItems, profileNavItem] : navItems

  return (
    <aside className="hidden md:flex flex-col w-[280px] border-r border-border bg-bg-surface/50 h-full overflow-y-auto">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-purple/15 text-accent-purple'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`
            }
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-2 px-4">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Watchlist</h3>
        <div className="flex flex-col gap-2">
          {ASSETS.map((asset) => (
            <WatchlistCard
              key={asset.binanceSymbol}
              asset={asset}
              active={selectedAsset === asset.binanceSymbol}
              onClick={() => setSelectedAsset(asset.binanceSymbol)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
