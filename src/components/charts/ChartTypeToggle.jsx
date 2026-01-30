import useAppStore from '../../stores/useAppStore'
import PillButton from '../ui/PillButton'

export default function ChartTypeToggle() {
  const chartType = useAppStore((s) => s.chartType)
  const setChartType = useAppStore((s) => s.setChartType)

  return (
    <div className="flex gap-2">
      <PillButton active={chartType === 'candlestick'} onClick={() => setChartType('candlestick')}>
        Candles
      </PillButton>
      <PillButton active={chartType === 'line'} onClick={() => setChartType('line')}>
        Line
      </PillButton>
    </div>
  )
}
