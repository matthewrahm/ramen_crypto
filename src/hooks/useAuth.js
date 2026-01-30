import useAuthStore from '../stores/useAuthStore'

export default function useAuth() {
  const user = useAuthStore((s) => s.user)
  const session = useAuthStore((s) => s.session)
  const loading = useAuthStore((s) => s.loading)
  const initialized = useAuthStore((s) => s.initialized)
  const isGuest = useAuthStore((s) => s.isGuest)
  const signIn = useAuthStore((s) => s.signIn)
  const signUp = useAuthStore((s) => s.signUp)
  const signOut = useAuthStore((s) => s.signOut)
  const signInWithOAuth = useAuthStore((s) => s.signInWithOAuth)
  const resetPassword = useAuthStore((s) => s.resetPassword)
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest)

  return {
    user,
    session,
    loading,
    initialized,
    isGuest,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword,
    continueAsGuest,
  }
}
