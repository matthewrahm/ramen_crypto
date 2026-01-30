import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuth from '../hooks/useAuth'
import RamenRankBadge from '../components/profile/RamenRankBadge'
import AchievementGrid from '../components/profile/AchievementGrid'
import { fetchProfile, updateProfile, fetchAchievements } from '../services/supabaseSync'

export default function ProfilePage() {
  const { user, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (!user) return
    fetchProfile(user.id).then((p) => {
      if (p) {
        setProfile(p)
        setDisplayName(p.display_name || '')
      }
    })
    fetchAchievements(user.id).then(setAchievements)
  }, [user])

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return
    await updateProfile(user.id, { display_name: displayName.trim() })
    setProfile((p) => ({ ...p, display_name: displayName.trim() }))
    setEditing(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
      >
        <p className="text-text-secondary">Sign in to view your profile</p>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-2.5 rounded-xl bg-accent-purple text-white font-medium text-sm hover:opacity-90 cursor-pointer"
        >
          Sign In
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Profile header */}
      <div className="glass-card p-6 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-accent-purple/20 border-2 border-accent-purple flex items-center justify-center text-3xl">
          {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-bg-primary border border-border text-text-primary text-sm focus:outline-none focus:border-accent-purple"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-1.5 rounded-lg bg-accent-purple text-white text-xs font-medium cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 rounded-lg border border-border text-text-secondary text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-lg font-semibold text-text-primary hover:text-accent-purple transition-colors cursor-pointer"
          >
            {profile?.display_name || user?.email?.split('@')[0] || 'Anonymous Chef'}
          </button>
        )}

        <p className="text-text-muted text-sm">{user?.email}</p>

        <RamenRankBadge xp={profile?.xp || 0} />

        {/* Streak */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">Streak:</span>
          <span className="text-accent-green font-semibold">{profile?.streak || 0} days</span>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Achievements</h2>
        <AchievementGrid unlocked={achievements} />
      </div>

      {/* Sign out */}
      <div className="flex justify-center">
        <button
          onClick={handleSignOut}
          className="px-6 py-2.5 rounded-xl border border-accent-red/30 text-accent-red text-sm font-medium hover:bg-accent-red/10 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}
