import { motion } from 'framer-motion'
import useSentimentStore from '../../stores/useSentimentStore'
import GlassCard from '../ui/GlassCard'

const components = [
  { label: 'Volatility', value: 72, color: '#FF8C42' },
  { label: 'Market Momentum', value: 58, color: '#FFD700' },
  { label: 'Social Media', value: 45, color: '#9945FF' },
  { label: 'BTC Dominance', value: 65, color: '#F7931A' },
  { label: 'Google Trends', value: 38, color: '#14F195' },
]

export default function SentimentBreakdown() {
  const current = useSentimentStore((s) => s.current)

  if (!current) return null

  // Derive approximate component values from the overall score
  const factor = current.value / 50
  const adjusted = components.map((c) => ({
    ...c,
    value: Math.min(100, Math.max(5, Math.round(c.value * factor))),
  }))

  return (
    <GlassCard className="p-5">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Sentiment Components
      </h3>
      <div className="flex flex-col gap-4">
        {adjusted.map((comp) => (
          <div key={comp.label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-text-secondary">{comp.label}</span>
              <span className="text-sm font-mono text-text-primary">{comp.value}</span>
            </div>
            <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: comp.color }}
                initial={{ width: 0 }}
                animate={{ width: `${comp.value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
