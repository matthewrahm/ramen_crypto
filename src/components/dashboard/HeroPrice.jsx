import { motion } from 'framer-motion'
import usePriceStore from '../../stores/usePriceStore'
import useAppStore from '../../stores/useAppStore'
import { ASSETS } from '../../lib/constants'
import { formatPrice, formatPercent, formatCompact } from '../../lib/formatters'
import AnimatedNumber from '../ui/AnimatedNumber'
import StatCard from './StatCard'

export default function HeroPrice() {
  const selectedAsset = useAppStore((s) => s.selectedAsset)
  const prices = usePriceStore((s) => s.prices)
  const stats = usePriceStore((s) => s.stats)

  const asset = ASSETS.find((a) => a.binanceSymbol === selectedAsset)
  const price = prices[selectedAsset]
  const stat = stats[selectedAsset] || {}
  const isPositive = stat.changePercent >= 0

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: asset?.color + '20', color: asset?.color }}
        >
          {asset?.symbol?.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{asset?.name}</h2>
          <span className="text-sm text-text-muted">{asset?.symbol}/USDT</span>
        </div>
      </div>

      <div className="flex items-baseline gap-4 mt-2">
        <span className="text-4xl sm:text-5xl lg:text-7xl font-bold font-mono text-text-primary tracking-tight">
          <AnimatedNumber value={price} format={(v) => formatPrice(v)} />
        </span>
        <motion.span
          key={stat.changePercent}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg font-semibold px-3 py-1 rounded-full ${
            isPositive
              ? 'bg-accent-green/15 text-accent-green'
              : 'bg-accent-red/15 text-accent-red'
          }`}
        >
          {formatPercent(stat.changePercent)}
        </motion.span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <StatCard label="24h High" value={formatPrice(stat.high)} />
        <StatCard label="24h Low" value={formatPrice(stat.low)} />
        <StatCard label="24h Change" value={formatPrice(Math.abs(stat.change))} positive={isPositive} />
        <StatCard label="24h Volume" value={formatCompact(stat.quoteVolume)} />
      </div>
    </div>
  )
}
