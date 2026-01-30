import GlassCard from '../ui/GlassCard'

export default function StatCard({ label, value, positive }) {
  return (
    <GlassCard className="!p-3">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className={`text-sm font-semibold font-mono ${
        positive === true ? 'text-accent-green' :
        positive === false ? 'text-accent-red' :
        'text-text-primary'
      }`}>
        {value}
      </p>
    </GlassCard>
  )
}
