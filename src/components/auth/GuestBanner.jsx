import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/useAuthStore'

export default function GuestBanner() {
  const [dismissed, setDismissed] = useState(false)
  const session = useAuthStore((s) => s.session)
  const isGuest = useAuthStore((s) => s.isGuest)
  const navigate = useNavigate()

  if (session || !isGuest || dismissed) return null

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-accent-purple/10 border-b border-accent-purple/20 text-sm">
      <span className="text-text-secondary">
        You're in guest mode.{' '}
        <button
          onClick={() => navigate('/auth')}
          className="text-accent-purple hover:underline font-medium cursor-pointer"
        >
          Sign up
        </button>{' '}
        to save your data across devices.
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="text-text-muted hover:text-text-primary ml-4 cursor-pointer"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
