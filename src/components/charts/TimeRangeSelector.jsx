import { TIME_RANGES } from '../../lib/constants'
import useAppStore from '../../stores/useAppStore'
import PillButton from '../ui/PillButton'

export default function TimeRangeSelector() {
  const selectedRange = useAppStore((s) => s.selectedRange)
  const setSelectedRange = useAppStore((s) => s.setSelectedRange)

  return (
    <div className="flex gap-2 flex-wrap">
      {TIME_RANGES.map((range) => (
        <PillButton
          key={range.value}
          active={selectedRange === range.value}
          onClick={() => setSelectedRange(range.value)}
        >
          {range.label}
        </PillButton>
      ))}
    </div>
  )
}
