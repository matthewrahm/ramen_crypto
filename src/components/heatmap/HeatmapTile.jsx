import { memo } from 'react'
import { formatPercent, formatCompact } from '../../lib/formatters'

function getHeatColor(pct) {
  if (pct >= 5) return 'rgba(20, 241, 149, 0.4)'
  if (pct >= 2) return 'rgba(20, 241, 149, 0.25)'
  if (pct >= 0) return 'rgba(20, 241, 149, 0.1)'
  if (pct >= -2) return 'rgba(255, 59, 105, 0.1)'
  if (pct >= -5) return 'rgba(255, 59, 105, 0.25)'
  return 'rgba(255, 59, 105, 0.4)'
}

const HeatmapTile = memo(function HeatmapTile({ coin, maxMcap }) {
  const pct = coin.price_change_percentage_24h_in_currency || 0
  const isPositive = pct >= 0
  const sizeRatio = Math.max(0.5, Math.min(2, Math.sqrt(coin.market_cap / maxMcap) * 3))

  return (
    <div
      className="rounded-xl p-3 flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-default border border-glass-border"
      style={{
        backgroundColor: getHeatColor(pct),
        gridRow: sizeRatio > 1.2 ? 'span 2' : 'span 1',
      }}
    >
      <div className="flex items-center gap-2">
        {coin.image && (
          <img src={coin.image} alt={coin.symbol} className="w-5 h-5 rounded-full" />
        )}
        <span className="text-sm font-semibold text-text-primary uppercase">{coin.symbol}</span>
      </div>
      <div className="mt-1">
        <span className={`text-sm font-mono font-bold ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
          {formatPercent(pct)}
        </span>
        <p className="text-xs text-text-muted mt-0.5">{formatCompact(coin.market_cap)}</p>
      </div>
    </div>
  )
})

export default HeatmapTile
