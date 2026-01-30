import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import RamenLogo from '../components/ui/RamenLogo'
import { isSupabaseConfigured } from '../lib/supabase'

const OAUTH_PROVIDERS = [
  { id: 'google', label: 'Google', icon: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.94 6.06a5.98 5.98 0 011.06 3.44h-4.5v-1.5h2.84a4.49 4.49 0 00-3.84-2.16 4.5 4.5 0 100 9 4.49 4.49 0 003.84-2.16h1.63a5.98 5.98 0 01-5.47 3.66A6 6 0 1116.94 8.06z' },
  { id: 'github', label: 'GitHub', icon: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z' },
  { id: 'discord', label: 'Discord', icon: 'M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z' },
]

export default function AuthPage() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, signUp, signInWithOAuth, continueAsGuest } = useAuth()
  const navigate = useNavigate()

  const configured = isSupabaseConfigured()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!configured) {
      setError('Supabase is not configured. Add your credentials to .env')
      return
    }
    setError('')
    setSuccess('')
    setSubmitting(true)

    const fn = mode === 'signin' ? signIn : signUp
    const { error: authError } = await fn(email, password)

    setSubmitting(false)
    if (authError) {
      setError(authError.message)
    } else if (mode === 'signup') {
      setSuccess('Check your email to confirm your account!')
    } else {
      navigate('/')
    }
  }

  const handleOAuth = async (provider) => {
    if (!configured) return
    const { error: oauthError } = await signInWithOAuth(provider)
    if (oauthError) setError(oauthError.message)
  }

  const handleGuest = () => {
    continueAsGuest()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      {/* Enhanced animated background */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb--purple" />
        <div className="auth-bg-orb auth-bg-orb--green" />
        <div className="auth-bg-orb auth-bg-orb--gold" />
        <div className="auth-bg-orb auth-bg-orb--red" />
        <div className="auth-bg-grid" />
        <div className="auth-steam auth-steam--1" />
        <div className="auth-steam auth-steam--2" />
        <div className="auth-steam auth-steam--3" />
        {/* Ramen bowl watermark */}
        <svg className="auth-bowl-watermark" viewBox="0 0 64 64" width="280" height="280" aria-hidden="true">
          <path d="M8 30 Q8 52 32 52 Q56 52 56 30 Z" fill="currentColor" />
          <ellipse cx="32" cy="30" rx="26" ry="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M16 28 Q20 18 24 22 Q28 26 30 16 Q32 10 34 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 28 Q30 20 34 24 Q38 28 40 18 Q42 12 46 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 12 Q24 8 22 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M40 10 Q42 6 40 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="10" x2="52" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="48" y1="8" x2="54" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="glass-card w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <RamenLogo size={56} />
          <h1 className="text-2xl font-bold text-text-primary mt-4">Welcome to the kitchen</h1>
          <p className="text-text-secondary text-sm mt-1">Track crypto, cook profits</p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-xl bg-bg-primary/50 p-1 mb-6">
          <button
            onClick={() => { setMode('signin'); setError(''); setSuccess('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-accent-purple text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-accent-purple text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Sign Up
          </button>
        </div>

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
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Min 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border text-text-primary text-sm focus:outline-none focus:border-accent-purple transition-colors"
            />
          </div>

          {error && <p className="text-accent-red text-sm">{error}</p>}
          {success && <p className="text-accent-green text-sm">{success}</p>}

          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full py-2.5 rounded-xl bg-accent-purple text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Cooking...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'signin' && (
          <button
            onClick={() => navigate('/reset-password')}
            className="text-text-muted text-xs hover:text-accent-purple mt-3 block mx-auto cursor-pointer"
          >
            Forgot password?
          </button>
        )}

        {/* OAuth buttons */}
        {configured && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-text-muted text-xs">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex gap-3">
              {OAUTH_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleOAuth(provider.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-bg-hover hover:text-text-primary transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={provider.icon} />
                  </svg>
                  {provider.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Guest mode */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGuest}
            className="text-text-secondary text-sm hover:text-accent-purple transition-colors cursor-pointer"
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  )
}
