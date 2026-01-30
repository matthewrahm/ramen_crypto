import { motion } from 'framer-motion'
import FearGreedGauge from '../components/sentiment/FearGreedGauge'
import FearGreedTimeline from '../components/sentiment/FearGreedTimeline'
import SentimentBreakdown from '../components/sentiment/SentimentBreakdown'
import useFearGreed from '../hooks/useFearGreed'
import ErrorBoundary from '../components/ui/ErrorBoundary'

export default function SentimentPage() {
  useFearGreed()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6">Market Sentiment</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ErrorBoundary>
          <FearGreedGauge />
        </ErrorBoundary>
        <ErrorBoundary>
          <SentimentBreakdown />
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        <FearGreedTimeline />
      </ErrorBoundary>
    </motion.div>
  )
}
