import { useEffect, useRef } from 'react'
import { createChart, ColorType, LineSeries, HistogramSeries } from 'lightweight-charts'
import useIndicators from '../../hooks/useIndicators'
import useIndicatorStore from '../../stores/useIndicatorStore'
import useThemeStore from '../../stores/useThemeStore'
import { COLORS } from '../../lib/constants'
import { getChartColors } from '../../lib/chartTheme'

function SubChart({ title, children }) {
  return (
    <div className="glass-card p-2 sm:p-4 mt-3">
      <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  )
}

function RSIChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const indicators = useIndicators()
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    if (!chartRef.current || !indicators.rsi?.length) return

    if (chartInstance.current) {
      chartInstance.current.remove()
    }

    const colors = getChartColors(theme)
    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: colors.textColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: colors.gridColor },
        horzLines: { color: colors.gridColor },
      },
      rightPriceScale: {
        borderColor: colors.borderColor,
        scaleMargins: { top: 0.05, bottom: 0.05 },
      },
      timeScale: { borderColor: colors.borderColor, visible: false },
      handleScroll: false,
      handleScale: false,
    })

    chartInstance.current = chart

    const series = chart.addSeries(LineSeries, {
      color: COLORS.rsiLine,
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: true,
    })
    series.setData(indicators.rsi)

    // 30/70 reference lines
    const overSold = chart.addSeries(LineSeries, {
      color: 'rgba(255, 59, 105, 0.3)',
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    })
    const overBought = chart.addSeries(LineSeries, {
      color: 'rgba(20, 241, 149, 0.3)',
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    })

    const times = indicators.rsi.map((d) => d.time)
    overSold.setData(times.map((t) => ({ time: t, value: 30 })))
    overBought.setData(times.map((t) => ({ time: t, value: 70 })))

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
  }, [indicators.rsi, theme])

  return (
    <SubChart title="RSI (14)">
      <div ref={chartRef} className="w-full h-[120px]" />
    </SubChart>
  )
}

function MACDChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const indicators = useIndicators()
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    if (!chartRef.current || !indicators.macdLine?.length) return

    if (chartInstance.current) {
      chartInstance.current.remove()
    }

    const colors = getChartColors(theme)
    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: colors.textColor,
        fontFamily: "'Inter', sans-serif",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: colors.gridColor },
        horzLines: { color: colors.gridColor },
      },
      rightPriceScale: {
        borderColor: colors.borderColor,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: { borderColor: colors.borderColor, visible: false },
      handleScroll: false,
      handleScale: false,
    })

    chartInstance.current = chart

    const macdSeries = chart.addSeries(LineSeries, {
      color: COLORS.macdLine,
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: false,
    })
    macdSeries.setData(indicators.macdLine)

    const signalSeries = chart.addSeries(LineSeries, {
      color: COLORS.macdSignal,
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: false,
    })
    signalSeries.setData(indicators.macdSignal)

    const histogramSeries = chart.addSeries(HistogramSeries, {
      priceLineVisible: false,
      lastValueVisible: false,
    })
    histogramSeries.setData(
      indicators.macdHistogram.map((d) => ({
        ...d,
        color: d.value >= 0 ? COLORS.macdHistoUp : COLORS.macdHistoDown,
      }))
    )

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
  }, [indicators.macdLine, indicators.macdSignal, indicators.macdHistogram, theme])

  return (
    <SubChart title="MACD (12, 26, 9)">
      <div ref={chartRef} className="w-full h-[120px]" />
    </SubChart>
  )
}

export default function IndicatorSubChart() {
  const active = useIndicatorStore((s) => s.active)
  const showRSI = active.includes('rsi')
  const showMACD = active.includes('macd')

  if (!showRSI && !showMACD) return null

  return (
    <>
      {showRSI && <RSIChart />}
      {showMACD && <MACDChart />}
    </>
  )
}
