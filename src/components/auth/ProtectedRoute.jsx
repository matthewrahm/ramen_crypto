import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../stores/useAuthStore'
import RamenLoader from '../ui/RamenLoader'

export default function ProtectedRoute() {
  const initialized = useAuthStore((s) => s.initialized)
  const session = useAuthStore((s) => s.session)
  const isGuest = useAuthStore((s) => s.isGuest)

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RamenLoader />
      </div>
    )
  }

  if (!session && !isGuest) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}
