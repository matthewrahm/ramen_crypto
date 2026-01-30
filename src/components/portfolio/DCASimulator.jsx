import { useState, useCallback } from 'react'
import { useEffect, useRef } from 'react'
import { createChart, ColorType, AreaSeries, LineSeries } from 'lightweight-charts'
import { ASSETS } from '../../lib/constants'
import { getChartColors } from '../../lib/chartTheme'
import useThemeStore from '../../stores/useThemeStore'
import { fetchKlines } from '../../services/binanceRest'
import { simulateDCA } from '../../lib/portfolioMath'
import { formatPrice, formatPercent } from '../../lib/formatters'
import GlassCard from '../ui/GlassCard'

export default function DCASimulator() {
  const [asset, setAsset] = useState(ASSETS[0].binanceSymbol)
  const [amount, setAmount] = useState('100')
  const [frequency, setFrequency] = useState('weekly')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const theme = useThemeStore((s) => s.theme)
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  const simulate = useCallback(async () => {
    setLoading(true)
    try {
      const intervalMap = { daily: '1d', weekly: '1w', monthly: '1M' }
      const interval = intervalMap[frequency]
      const klines = await fetchKlines(asset, interval, 365)

      const prices = klines.map((k) => ({
        time: Math.floor(k[0] / 1000),
        price: parseFloat(k[4]),
      }))

      const amountPerPeriod = parseFloat(amount) || 100
      const sim = simulateDCA(prices, amountPerPeriod)
      setResult(sim)

      if (chartRef.current) {
        if (chartInstance.current) chartInstance.current.remove()

        const colors = getChartColors(theme)
        const chart = createChart(chartRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: colors.textColor,
            fontFamily: "'Inter', sans-serif",
          },
          grid: {
            vertLines: { color: colors.gridColor },
            horzLines: { color: colors.gridColor },
          },
          rightPriceScale: { borderColor: colors.borderColor },
          timeScale: { borderColor: colors.borderColor },
        })

        chartInstance.current = chart

        const valueSeries = chart.addSeries(AreaSeries, {
          topColor: 'rgba(20, 241, 149, 0.3)',
          bottomColor: 'rgba(20, 241, 149, 0.0)',
          lineColor: '#14F195',
          lineWidth: 2,
        })
        valueSeries.setData(
          sim.dataPoints.map((d) => ({ time: d.time, value: d.value }))
        )

        const investedSeries = chart.addSeries(LineSeries, {
          color: '#9945FF',
          lineWidth: 1.5,
          lineStyle: 2,
        })
        investedSeries.setData(
          sim.dataPoints.map((d) => ({ time: d.time, value: d.invested }))
        )

        chart.timeScale().fitContent()

        const ro = new ResizeObserver((entries) => {
          for (const entry of entries) {
            chart.applyOptions({ width: entry.contentRect.width })
          }
        })
        ro.observe(chartRef.current)
      }
    } catch (err) {
      console.error('DCA simulation error:', err)
    }
    setLoading(false)
  }, [asset, amount, frequency, theme])

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.remove()
        chartInstance.current = null
      }
    }
  }, [])

  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-semibold text-text-primary mb-4">DCA Simulator</h3>
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
          <label className="text-xs text-text-muted uppercase tracking-wider block mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-purple"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <button
        onClick={simulate}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-accent-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer mb-4"
      >
        {loading ? 'Simmering the numbers...' : 'Run Simulation'}
      </button>

      {result && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-xs text-text-muted">Total Invested</p>
            <p className="text-sm font-mono font-semibold text-text-primary">
              {formatPrice(result.totalInvested)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted">Final Value</p>
            <p className="text-sm font-mono font-semibold text-accent-green">
              {formatPrice(result.finalValue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted">ROI</p>
            <p className={`text-sm font-mono font-semibold ${result.roi >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {formatPercent(result.roi)}
            </p>
          </div>
        </div>
      )}

      <div ref={chartRef} className="w-full h-[200px]" />
    </GlassCard>
  )
}
