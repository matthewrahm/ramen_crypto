import usePortfolioStore from '../../stores/usePortfolioStore'
import usePriceStore from '../../stores/usePriceStore'
import { calculatePortfolioSummary } from '../../lib/portfolioMath'
import { formatPrice, formatPercent } from '../../lib/formatters'
import GlassCard from '../ui/GlassCard'
import StatCard from '../dashboard/StatCard'

export default function PortfolioSummary() {
  const positions = usePortfolioStore((s) => s.positions)
  const balance = usePortfolioStore((s) => s.balance)
  const resetPortfolio = usePortfolioStore((s) => s.resetPortfolio)
  const prices = usePriceStore((s) => s.prices)

  const { totalValue, totalInvested, totalPnL, totalPnLPercent } =
    calculatePortfolioSummary(positions, prices)

  const isPositive = totalPnL >= 0

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Portfolio Summary</h3>
        <button
          onClick={resetPortfolio}
          className="text-xs text-text-muted hover:text-accent-red transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Cash Balance" value={formatPrice(balance)} />
        <StatCard label="Holdings Value" value={formatPrice(totalValue)} />
        <StatCard
          label="Total P&L"
          value={`${formatPrice(Math.abs(totalPnL))} (${formatPercent(totalPnLPercent)})`}
          positive={isPositive}
        />
        <StatCard label="Total Invested" value={formatPrice(totalInvested)} />
      </div>
    </GlassCard>
  )
}
