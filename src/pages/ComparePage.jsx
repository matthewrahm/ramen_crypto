import { motion } from 'framer-motion'
import ComparisonChart from '../components/charts/ComparisonChart'
import TimeRangeSelector from '../components/charts/TimeRangeSelector'
import MarketHeatmap from '../components/heatmap/MarketHeatmap'
import useMarketData from '../hooks/useMarketData'
import ErrorBoundary from '../components/ui/ErrorBoundary'

export default function ComparePage() {
  useMarketData()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6">Market Comparison</h2>

      <div className="mb-4">
        <TimeRangeSelector />
      </div>

      <ErrorBoundary>
        <ComparisonChart />
      </ErrorBoundary>

      <div className="mt-6">
        <ErrorBoundary>
          <MarketHeatmap />
        </ErrorBoundary>
      </div>
    </motion.div>
  )
}
