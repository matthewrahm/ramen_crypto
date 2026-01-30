import { motion } from 'framer-motion'
import useSentimentStore from '../../stores/useSentimentStore'
import Skeleton from '../ui/Skeleton'

function getColor(value) {
  if (value <= 20) return '#FF3B69'
  if (value <= 40) return '#FF8C42'
  if (value <= 60) return '#FFD700'
  if (value <= 80) return '#7FD858'
  return '#14F195'
}

export default function FearGreedGauge() {
  const current = useSentimentStore((s) => s.current)
  const loading = useSentimentStore((s) => s.loading)

  if (loading || !current) {
    return <Skeleton className="w-full max-w-sm mx-auto" height="240px" />
  }

  const value = current.value
  const color = getColor(value)
  const angle = -90 + (value / 100) * 180
  const radius = 90
  const cx = 120
  const cy = 110

  // Arc path
  const startAngle = -180
  const endAngle = 0
  const arcStart = {
    x: cx + radius * Math.cos((startAngle * Math.PI) / 180),
    y: cy + radius * Math.sin((startAngle * Math.PI) / 180),
  }
  const arcEnd = {
    x: cx + radius * Math.cos((endAngle * Math.PI) / 180),
    y: cy + radius * Math.sin((endAngle * Math.PI) / 180),
  }

  // Needle endpoint
  const needleAngle = (-180 + (value / 100) * 180) * (Math.PI / 180)
  const needleX = cx + (radius - 15) * Math.cos(needleAngle)
  const needleY = cy + (radius - 15) * Math.sin(needleAngle)

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Fear & Greed Index</h3>
      <svg viewBox="0 0 240 140" className="w-full max-w-xs">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3B69" />
            <stop offset="25%" stopColor="#FF8C42" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="75%" stopColor="#7FD858" />
            <stop offset="100%" stopColor="#14F195" />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="rgba(42,42,62,0.5)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Colored arc */}
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ x2: cx - radius + 15, y2: cy }}
          animate={{ x2: needleX, y2: needleY }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="5" fill={color} />

        {/* Labels */}
        <text x="30" y="125" fill="#8888aa" fontSize="9" textAnchor="middle">Fear</text>
        <text x="210" y="125" fill="#8888aa" fontSize="9" textAnchor="middle">Greed</text>
      </svg>

      <motion.div
        className="text-center mt-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-4xl font-bold font-mono" style={{ color }}>
          {value}
        </span>
        <p className="text-sm text-text-secondary mt-1">{current.label}</p>
      </motion.div>
    </div>
  )
}
