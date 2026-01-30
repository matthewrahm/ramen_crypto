import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export default function AnimatedNumber({ value, format, className = '' }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (v) => (format ? format(v) : v.toFixed(2)))
  const [text, setText] = useState(format ? format(value || 0) : '0.00')
  const ref = useRef(null)

  useEffect(() => {
    if (value != null && !isNaN(value)) {
      spring.set(Number(value))
    }
  }, [value, spring])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      setText(v)
    })
    return unsubscribe
  }, [display])

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  )
}
