import usePortfolioStore from '../../stores/usePortfolioStore'
import usePriceStore from '../../stores/usePriceStore'
import { ASSETS } from '../../lib/constants'
import GlassCard from '../ui/GlassCard'

export default function AllocationDonut() {
  const positions = usePortfolioStore((s) => s.positions)
  const prices = usePriceStore((s) => s.prices)

  const allocations = ASSETS.map((asset) => {
    const assetPositions = positions.filter(
      (p) => p.asset === asset.binanceSymbol && p.type === 'buy'
    )
    const value = assetPositions.reduce(
      (sum, p) => sum + p.quantity * (prices[p.asset] || 0),
      0
    )
    return { symbol: asset.symbol, color: asset.color, value }
  }).filter((a) => a.value > 0)

  const total = allocations.reduce((sum, a) => sum + a.value, 0)

  if (total === 0) {
    return (
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Allocation
        </h3>
        <p className="text-text-muted text-sm">No toppings yet. Buy some assets to fill your bowl.</p>
      </GlassCard>
    )
  }

  const size = 120
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <GlassCard className="p-5">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Allocation
      </h3>
      <div className="flex items-center justify-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {allocations.map((alloc) => {
            const pct = alloc.value / total
            const dashArray = pct * circumference
            const dashOffset = -offset
            offset += dashArray
            return (
              <circle
                key={alloc.symbol}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={alloc.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            )
          })}
        </svg>
        <div className="flex flex-col gap-2">
          {allocations.map((alloc) => (
            <div key={alloc.symbol} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.color }} />
              <span className="text-sm text-text-secondary">
                {alloc.symbol} — {((alloc.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
