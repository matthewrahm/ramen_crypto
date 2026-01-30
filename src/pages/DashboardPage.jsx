import { motion } from 'framer-motion'
import HeroPrice from '../components/dashboard/HeroPrice'
import PriceChart from '../components/charts/PriceChart'
import TimeRangeSelector from '../components/charts/TimeRangeSelector'
import ChartTypeToggle from '../components/charts/ChartTypeToggle'
import IndicatorToggleBar from '../components/indicators/IndicatorToggleBar'
import IndicatorSubChart from '../components/charts/IndicatorSubChart'
import useHistoricalData from '../hooks/useHistoricalData'
import ErrorBoundary from '../components/ui/ErrorBoundary'

export default function DashboardPage() {
  useHistoricalData()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <HeroPrice />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <TimeRangeSelector />
        <div className="hidden sm:block w-px h-6 bg-border" />
        <ChartTypeToggle />
      </div>

      <ErrorBoundary>
        <PriceChart />
      </ErrorBoundary>

      <div className="mt-4 mb-2">
        <IndicatorToggleBar />
      </div>

      <ErrorBoundary>
        <IndicatorSubChart />
      </ErrorBoundary>
    </motion.div>
  )
}
