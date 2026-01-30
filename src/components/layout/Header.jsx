import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatUTCTime } from '../../lib/formatters'
import RamenLogo from '../ui/RamenLogo'
import ThemeToggle from '../ui/ThemeToggle'
import useAuthStore from '../../stores/useAuthStore'

export default function Header() {
  const [time, setTime] = useState(formatUTCTime())
  const session = useAuthStore((s) => s.session)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    const id = setInterval(() => setTime(formatUTCTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <RamenLogo size={32} />
        <div className="hidden sm:flex flex-col">
          <h1 className="text-lg font-bold text-text-primary leading-tight">Ramen Crypto Tracker</h1>
          <span className="text-[10px] text-text-muted leading-tight tracking-wide">Fuel your portfolio</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-text-muted text-sm font-mono">{time}</span>
        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" title="Live" />

        {session ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-xl hover:bg-bg-hover transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-xs font-semibold text-accent-purple">
              {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="hidden sm:inline text-sm text-text-secondary">
              {user?.user_metadata?.name || user?.email?.split('@')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="ml-2 px-4 py-1.5 rounded-xl bg-accent-purple/15 text-accent-purple text-sm font-medium hover:bg-accent-purple/25 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}
