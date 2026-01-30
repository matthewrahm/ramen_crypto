import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import useSentimentStore from '../../stores/useSentimentStore'
import useThemeStore from '../../stores/useThemeStore'
import { getChartColors } from '../../lib/chartTheme'
import Skeleton from '../ui/Skeleton'

export default function FearGreedTimeline() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const history = useSentimentStore((s) => s.history)
  const loading = useSentimentStore((s) => s.loading)
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    if (!chartRef.current || !history.length) return

    if (chartInstance.current) {
      chartInstance.current.remove()
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
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: { borderColor: colors.borderColor },
    })

    chartInstance.current = chart

    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(153, 69, 255, 0.3)',
      bottomColor: 'rgba(153, 69, 255, 0.0)',
      lineColor: '#9945FF',
      lineWidth: 2,
    })

    const data = history.map((d) => ({
      time: Math.floor(d.timestamp / 1000),
      value: d.value,
    }))

    areaSeries.setData(data)
    chart.timeScale().fitContent()

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width })
      }
    })
    ro.observe(chartRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
      chartInstance.current = null
    }
  }, [history, theme])

  if (loading) return <Skeleton className="w-full" height="200px" />

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        30-Day History
      </h3>
      <div ref={chartRef} className="w-full h-[200px]" />
    </div>
  )
}
