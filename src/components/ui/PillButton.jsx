import { motion } from 'framer-motion'

export default function PillButton({ children, active = false, onClick, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer
        ${active
          ? 'bg-accent-purple text-white'
          : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text-primary'
        }
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
