import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, LineSeries } from 'lightweight-charts'
import { ASSETS, TIME_RANGES } from '../../lib/constants'
import { fetchKlines } from '../../services/binanceRest'
import { normalizeToPercent } from '../../lib/chartHelpers'
import useAppStore from '../../stores/useAppStore'
import useThemeStore from '../../stores/useThemeStore'
import { getChartColors } from '../../lib/chartTheme'
import PillButton from '../ui/PillButton'
import Skeleton from '../ui/Skeleton'

export default function ComparisonChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [enabledAssets, setEnabledAssets] = useState(
    ASSETS.map((a) => a.binanceSymbol)
  )
  const [loading, setLoading] = useState(true)
  const selectedRange = useAppStore((s) => s.selectedRange)
  const theme = useThemeStore((s) => s.theme)

  const toggle = (symbol) => {
    setEnabledAssets((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    )
  }

  useEffect(() => {
    if (!chartRef.current) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const range = TIME_RANGES.find((r) => r.value === selectedRange) || TIME_RANGES[0]

      if (chartInstance.current) {
        chartInstance.current.remove()
        chartInstance.current = null
      }

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
        rightPriceScale: {
          borderColor: colors.borderColor,
        },
        timeScale: { borderColor: colors.borderColor },
      })

      chartInstance.current = chart

      for (const asset of ASSETS) {
        if (!enabledAssets.includes(asset.binanceSymbol)) continue

        try {
          const klines = await fetchKlines(asset.binanceSymbol, range.interval, range.limit)
          if (cancelled) return

          const lineData = klines.map((k) => ({
            time: Math.floor(k[0] / 1000),
            value: parseFloat(k[4]),
          }))

          const normalized = normalizeToPercent(lineData)

          const series = chart.addSeries(LineSeries, {
            color: asset.color,
            lineWidth: 2,
            title: asset.symbol,
            priceLineVisible: false,
          })
          series.setData(normalized)
        } catch { /* skip failed asset */ }
      }

      chart.timeScale().fitContent()
      setLoading(false)

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          chart.applyOptions({ width: entry.contentRect.width })
        }
      })
      ro.observe(chartRef.current)

      return () => ro.disconnect()
    }

    const cleanup = load()
    return () => {
      cancelled = true
      cleanup?.then?.((fn) => fn?.())
      if (chartInstance.current) {
        chartInstance.current.remove()
        chartInstance.current = null
      }
    }
  }, [enabledAssets, selectedRange, theme])

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          Performance Comparison (% Change)
        </h3>
        <div className="flex gap-2">
          {ASSETS.map((asset) => (
            <PillButton
              key={asset.binanceSymbol}
              active={enabledAssets.includes(asset.binanceSymbol)}
              onClick={() => toggle(asset.binanceSymbol)}
              className="!text-xs"
            >
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: asset.color }} />
              {asset.symbol}
            </PillButton>
          ))}
        </div>
      </div>
      {loading && <Skeleton className="w-full" height="350px" />}
      <div ref={chartRef} className={`w-full h-[350px] ${loading ? 'hidden' : ''}`} />
    </div>
  )
}
