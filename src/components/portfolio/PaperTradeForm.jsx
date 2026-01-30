import { useState } from 'react'
import { ASSETS } from '../../lib/constants'
import usePriceStore from '../../stores/usePriceStore'
import usePortfolioStore from '../../stores/usePortfolioStore'
import { formatPrice } from '../../lib/formatters'
import GlassCard from '../ui/GlassCard'

export default function PaperTradeForm() {
  const [asset, setAsset] = useState(ASSETS[0].binanceSymbol)
  const [type, setType] = useState('buy')
  const [amount, setAmount] = useState('')
  const prices = usePriceStore((s) => s.prices)
  const balance = usePortfolioStore((s) => s.balance)
  const addPosition = usePortfolioStore((s) => s.addPosition)

  const currentPrice = prices[asset] || 0
  const usdAmount = parseFloat(amount) || 0
  const quantity = currentPrice > 0 ? usdAmount / currentPrice : 0
  const assetInfo = ASSETS.find((a) => a.binanceSymbol === asset)

  function handleSubmit(e) {
    e.preventDefault()
    if (usdAmount <= 0 || currentPrice <= 0) return
    if (type === 'buy' && usdAmount > balance) return

    addPosition({
      asset,
      symbol: assetInfo.symbol,
      type,
      quantity,
      entryPrice: currentPrice,
      total: usdAmount,
    })
    setAmount('')
  }

  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Paper Trade</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1">Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-purple"
          >
            {ASSETS.map((a) => (
              <option key={a.binanceSymbol} value={a.binanceSymbol}>
                {a.symbol} — {formatPrice(prices[a.binanceSymbol])}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('buy')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              type === 'buy'
                ? 'bg-accent-green text-bg-primary'
                : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setType('sell')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              type === 'sell'
                ? 'bg-accent-red text-white'
                : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover'
            }`}
          >
            Sell
          </button>
        </div>

        <div>
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1">
            Amount (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-purple"
          />
          {quantity > 0 && (
            <p className="text-xs text-text-muted mt-1">
              ≈ {quantity.toFixed(6)} {assetInfo.symbol}
            </p>
          )}
        </div>

        <div className="text-xs text-text-muted">
          Balance: <span className="font-mono text-text-secondary">{formatPrice(balance)}</span>
        </div>

        <button
          type="submit"
          disabled={usdAmount <= 0 || (type === 'buy' && usdAmount > balance)}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity cursor-pointer ${
            type === 'buy' ? 'bg-accent-green text-bg-primary' : 'bg-accent-red text-white'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {type === 'buy' ? 'Buy' : 'Sell'} {assetInfo.symbol}
        </button>
      </form>
    </GlassCard>
  )
}
