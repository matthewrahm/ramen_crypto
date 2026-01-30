import usePortfolioStore from '../../stores/usePortfolioStore'
import usePriceStore from '../../stores/usePriceStore'
import { calculatePnL } from '../../lib/portfolioMath'
import { formatPrice, formatPercent, formatDate } from '../../lib/formatters'
import GlassCard from '../ui/GlassCard'

export default function PositionsList() {
  const positions = usePortfolioStore((s) => s.positions)
  const removePosition = usePortfolioStore((s) => s.removePosition)
  const prices = usePriceStore((s) => s.prices)

  if (positions.length === 0) {
    return (
      <GlassCard className="p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Positions</h3>
        <p className="text-text-muted text-sm">Your bowl is empty. Place a trade to add some noodles!</p>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-5 overflow-x-auto">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Positions</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-muted text-xs uppercase tracking-wider">
            <th className="text-left pb-3">Asset</th>
            <th className="text-left pb-3">Type</th>
            <th className="text-right pb-3">Qty</th>
            <th className="text-right pb-3">Entry</th>
            <th className="text-right pb-3">Current</th>
            <th className="text-right pb-3">P&L</th>
            <th className="text-right pb-3">Date</th>
            <th className="text-right pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => {
            const currentPrice = prices[pos.asset] || 0
            const { pnl, pnlPercent } = calculatePnL(pos, currentPrice)
            const isPositive = pnl >= 0

            return (
              <tr key={pos.id} className="border-t border-border/50">
                <td className="py-2.5 font-semibold text-text-primary">{pos.symbol}</td>
                <td className="py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    pos.type === 'buy' ? 'bg-accent-green/15 text-accent-green' : 'bg-accent-red/15 text-accent-red'
                  }`}>
                    {pos.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono text-text-secondary">
                  {pos.quantity.toFixed(6)}
                </td>
                <td className="py-2.5 text-right font-mono text-text-secondary">
                  {formatPrice(pos.entryPrice)}
                </td>
                <td className="py-2.5 text-right font-mono text-text-primary">
                  {formatPrice(currentPrice)}
                </td>
                <td className={`py-2.5 text-right font-mono font-semibold ${
                  isPositive ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  {formatPrice(Math.abs(pnl))} ({formatPercent(pnlPercent)})
                </td>
                <td className="py-2.5 text-right text-text-muted text-xs">
                  {formatDate(pos.date)}
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => removePosition(pos.id)}
                    className="text-text-muted hover:text-accent-red transition-colors cursor-pointer"
                    aria-label="Remove position"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </GlassCard>
  )
}
