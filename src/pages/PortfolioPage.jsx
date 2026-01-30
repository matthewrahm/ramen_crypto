import { motion } from 'framer-motion'
import PaperTradeForm from '../components/portfolio/PaperTradeForm'
import PositionsList from '../components/portfolio/PositionsList'
import PortfolioSummary from '../components/portfolio/PortfolioSummary'
import AllocationDonut from '../components/portfolio/AllocationDonut'
import DCASimulator from '../components/portfolio/DCASimulator'
import WhatIfCalculator from '../components/portfolio/WhatIfCalculator'
import ErrorBoundary from '../components/ui/ErrorBoundary'

export default function PortfolioPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6">Paper Trading Portfolio</h2>

      <ErrorBoundary>
        <PortfolioSummary />
      </ErrorBoundary>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ErrorBoundary>
            <PaperTradeForm />
          </ErrorBoundary>
          <ErrorBoundary>
            <AllocationDonut />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <PositionsList />
          </ErrorBoundary>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ErrorBoundary>
          <DCASimulator />
        </ErrorBoundary>
        <ErrorBoundary>
          <WhatIfCalculator />
        </ErrorBoundary>
      </div>
    </motion.div>
  )
}
