import { INDICATORS } from '../../lib/constants'
import useIndicatorStore from '../../stores/useIndicatorStore'
import PillButton from '../ui/PillButton'

export default function IndicatorToggleBar() {
  const active = useIndicatorStore((s) => s.active)
  const toggle = useIndicatorStore((s) => s.toggle)

  return (
    <div className="flex gap-2 flex-wrap">
      {INDICATORS.map((ind) => (
        <PillButton
          key={ind.id}
          active={active.includes(ind.id)}
          onClick={() => toggle(ind.id)}
        >
          {ind.label}
        </PillButton>
      ))}
    </div>
  )
}
