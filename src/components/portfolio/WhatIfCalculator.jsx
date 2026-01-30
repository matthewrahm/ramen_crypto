import { useState } from 'react'
import { ASSETS } from '../../lib/constants'
import { fetchKlinesRange } from '../../services/binanceRest'
import { calculateWhatIf } from '../../lib/portfolioMath'
import usePriceStore from '../../stores/usePriceStore'
import { formatPrice, formatPercent } from '../../lib/formatters'
import GlassCard from '../ui/GlassCard'

export default function WhatIfCalculator() {
  const [asset, setAsset] = useState(ASSETS[0].binanceSymbol)
  const [amount, setAmount] = useState('1000')
  const [date, setDate] = useState('2025-01-01')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const prices = usePriceStore((s) => s.prices)

  async function calculate() {
    setLoading(true)
    try {
      const startTime = new Date(date).getTime()
      const endTime = startTime + 86400000
      const klines = await fetchKlinesRange(asset, '1d', startTime, endTime)

      if (klines.length === 0) {
        setResult({ error: 'No data for that date' })
        setLoading(false)
        return
      }

      const priceAtDate = parseFloat(klines[0][4])
      const currentPrice = prices[asset] || 0
      const amountUSD = parseFloat(amount) || 0

      const whatIf = calculateWhatIf(amountUSD, priceAtDate, currentPrice)
      setResult({ ...whatIf, priceAtDate, currentPrice })
    } catch (err) {
      setResult({ error: err.message })
    }
    setLoading(false)
  }

  const assetInfo = ASSETS.find((a) => a.binanceSymbol === asset)

  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-semibold text-text-primary mb-4">What If Calculator</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1">Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-purple"
          >
            {ASSETS.map((a) => (
              <option key={a.binanceSymbol} value={a.binanceSymbol}>{a.symbol}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-purple"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-purple"
          />
        </div>
      </div>
      <button
        onClick={calculate}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-accent-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Brewing results...' : 'Calculate'}
      </button>

      {result && !result.error && (
        <div className="mt-4 p-4 bg-bg-elevated rounded-xl">
          <p className="text-sm text-text-secondary mb-2">
            Your <span className="font-mono font-semibold text-text-primary">{formatPrice(parseFloat(amount))}</span> of{' '}
            <span className="text-text-primary font-semibold">{assetInfo.symbol}</span> on {date} would be worth:
          </p>
          <p className={`text-2xl font-bold font-mono ${result.pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {formatPrice(result.currentValue)}
          </p>
          <p className={`text-sm font-mono ${result.pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {result.pnl >= 0 ? '+' : ''}{formatPrice(result.pnl)} ({formatPercent(result.pnlPercent)})
          </p>
        </div>
      )}

      {result?.error && (
        <p className="mt-4 text-sm text-accent-red">{result.error}</p>
      )}
    </GlassCard>
  )
}
