import { useEffect, useRef, useCallback } from 'react'
import { createChart, ColorType, CrosshairMode, CandlestickSeries, LineSeries } from 'lightweight-charts'
import useChartStore from '../../stores/useChartStore'
import useAppStore from '../../stores/useAppStore'
import useIndicators from '../../hooks/useIndicators'
import useIndicatorStore from '../../stores/useIndicatorStore'
import { COLORS, ASSETS } from '../../lib/constants'
import { getChartColors } from '../../lib/chartTheme'
import useThemeStore from '../../stores/useThemeStore'
import Skeleton from '../ui/Skeleton'

export default function PriceChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const mainSeries = useRef(null)
  const overlaySeriesRefs = useRef({})

  const candles = useChartStore((s) => s.candles)
  const loading = useChartStore((s) => s.loading)
  const chartType = useAppStore((s) => s.chartType)
  const selectedAsset = useAppStore((s) => s.selectedAsset)
  const active = useIndicatorStore((s) => s.active)
  const theme = useThemeStore((s) => s.theme)
  const indicators = useIndicators()

  const asset = ASSETS.find((a) => a.binanceSymbol === selectedAsset)

  const initChart = useCallback(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.remove()
      chartInstance.current = null
      mainSeries.current = null
      overlaySeriesRefs.current = {}
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
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: {
        borderColor: colors.borderColor,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: colors.borderColor,
        timeVisible: true,
      },
      handleScroll: { vertTouchDrag: false },
    })

    chart.timeScale().fitContent()
    chartInstance.current = chart

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        chart.applyOptions({ width, height })
      }
    })
    ro.observe(chartRef.current)

    return () => ro.disconnect()
  }, [theme])

  useEffect(() => {
    const cleanup = initChart()
    return () => {
      cleanup?.()
      if (chartInstance.current) {
        chartInstance.current.remove()
        chartInstance.current = null
      }
    }
  }, [initChart])

  useEffect(() => {
    if (!chartInstance.current || !candles.length) return

    const chart = chartInstance.current

    if (mainSeries.current) {
      chart.removeSeries(mainSeries.current)
      mainSeries.current = null
    }

    Object.values(overlaySeriesRefs.current).forEach((s) => {
      try { chart.removeSeries(s) } catch { /* already removed */ }
    })
    overlaySeriesRefs.current = {}

    if (chartType === 'candlestick') {
      mainSeries.current = chart.addSeries(CandlestickSeries, {
        upColor: '#14F195',
        downColor: '#FF3B69',
        borderUpColor: '#14F195',
        borderDownColor: '#FF3B69',
        wickUpColor: '#14F195',
        wickDownColor: '#FF3B69',
      })
      mainSeries.current.setData(candles)
    } else {
      mainSeries.current = chart.addSeries(LineSeries, {
        color: asset?.color || COLORS.purple,
        lineWidth: 2,
        crosshairMarkerRadius: 4,
      })
      mainSeries.current.setData(
        candles.map((c) => ({ time: c.time, value: c.close }))
      )
    }

    chart.timeScale().fitContent()
  }, [candles, chartType, asset])

  useEffect(() => {
    if (!chartInstance.current) return
    const chart = chartInstance.current

    Object.values(overlaySeriesRefs.current).forEach((s) => {
      try { chart.removeSeries(s) } catch { /* already removed */ }
    })
    overlaySeriesRefs.current = {}

    const overlayConfigs = {
      sma50: { color: COLORS.sma50, lineWidth: 1 },
      sma200: { color: COLORS.sma200, lineWidth: 1 },
      ema50: { color: COLORS.ema50, lineWidth: 1 },
      ema200: { color: COLORS.ema200, lineWidth: 1 },
      bbUpper: { color: COLORS.bbUpper, lineWidth: 1, lineStyle: 2 },
      bbMiddle: { color: COLORS.bbMiddle, lineWidth: 1 },
      bbLower: { color: COLORS.bbLower, lineWidth: 1, lineStyle: 2 },
    }

    Object.entries(overlayConfigs).forEach(([key, config]) => {
      if (indicators[key] && indicators[key].length > 0) {
        const series = chart.addSeries(LineSeries, {
          color: config.color,
          lineWidth: config.lineWidth,
          lineStyle: config.lineStyle || 0,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: false,
        })
        series.setData(indicators[key])
        overlaySeriesRefs.current[key] = series
      }
    })
  }, [indicators, active])

  if (loading) {
    return <Skeleton className="w-full" height="400px" />
  }

  return (
    <div className="glass-card p-2 sm:p-4">
      <div ref={chartRef} className="w-full h-[350px] sm:h-[400px] lg:h-[450px]" />
    </div>
  )
}
