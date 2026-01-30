import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = false, ...props }) {
  const Component = hover ? motion.div : 'div'
  const hoverProps = hover
    ? {
        whileHover: { scale: 1.01, borderColor: 'rgba(255,255,255,0.1)' },
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <Component
      className={`glass-card p-4 ${className}`}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  )
}
