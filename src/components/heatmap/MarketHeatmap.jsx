import useMarketStore from '../../stores/useMarketStore'
import HeatmapTile from './HeatmapTile'
import Skeleton from '../ui/Skeleton'

export default function MarketHeatmap() {
  const coins = useMarketStore((s) => s.coins)
  const loading = useMarketStore((s) => s.loading)

  if (loading && coins.length === 0) {
    return (
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Market Heatmap (Top 30)
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} height="80px" />
          ))}
        </div>
      </div>
    )
  }

  const maxMcap = Math.max(...coins.map((c) => c.market_cap || 0), 1)

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Market Heatmap (Top 30)
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2">
        {coins.map((coin) => (
          <HeatmapTile key={coin.id} coin={coin} maxMcap={maxMcap} />
        ))}
      </div>
    </div>
  )
}
