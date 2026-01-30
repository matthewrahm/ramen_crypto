import { memo } from 'react'
import { motion } from 'framer-motion'
import usePriceStore from '../../stores/usePriceStore'
import { formatPrice, formatPercent } from '../../lib/formatters'
import MiniSparkline from '../charts/MiniSparkline'

const WatchlistCard = memo(function WatchlistCard({ asset, active, onClick }) {
  const price = usePriceStore((s) => s.prices[asset.binanceSymbol])
  const stats = usePriceStore((s) => s.stats[asset.binanceSymbol])
  const sparkline = usePriceStore((s) => s.sparklines[asset.binanceSymbol])
  const changePercent = stats?.changePercent
  const isPositive = changePercent >= 0

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer ${
        active
          ? 'bg-accent-purple/10 border border-accent-purple/30'
          : 'hover:bg-bg-hover border border-transparent'
      }`}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: asset.color + '20', color: asset.color }}
      >
        {asset.symbol.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">{asset.symbol}</span>
          <span className="text-sm font-mono text-text-primary">
            {price != null ? formatPrice(price) : '--'}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-text-muted">{asset.name}</span>
          <span className={`text-xs font-medium ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
            {changePercent != null ? formatPercent(changePercent) : '--'}
          </span>
        </div>
      </div>
      <div className="w-16 h-8 flex-shrink-0">
        <MiniSparkline data={sparkline || []} color={isPositive ? '#14F195' : '#FF3B69'} />
      </div>
    </motion.button>
  )
})

export default WatchlistCard
