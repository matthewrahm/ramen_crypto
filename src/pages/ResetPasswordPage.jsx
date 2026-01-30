import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import RamenLogo from '../components/ui/RamenLogo'
import { isSupabaseConfigured } from '../lib/supabase'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const configured = isSupabaseConfigured()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!configured) {
      setError('Supabase is not configured')
      return
    }
    setError('')
    setSubmitting(true)
    const { error: resetError } = await resetPassword(email)
    setSubmitting(false)
    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="aurora-bg" />
      <div className="glass-card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <RamenLogo size={56} />
          <h1 className="text-2xl font-bold text-text-primary mt-4">Reset Password</h1>
          <p className="text-text-secondary text-sm mt-1">We'll send you a fresh bowl of reset noodles</p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-accent-green text-sm mb-4">
              Check your inbox — we sent a fresh bowl of reset noodles!
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="text-accent-purple text-sm hover:opacity-80 cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-text-secondary text-xs font-medium mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="chef@ramen.dev"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border text-text-primary text-sm focus:outline-none focus:border-accent-purple transition-colors"
              />
            </div>

            {error && <p className="text-accent-red text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !configured}
              className="w-full py-2.5 rounded-xl bg-accent-purple text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="text-text-muted text-sm hover:text-accent-purple cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
