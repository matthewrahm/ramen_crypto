import { useState, useEffect } from 'react'
import { LOADING_MESSAGES } from '../../lib/ramenMessages'

export default function RamenLoader({ message, className = '' }) {
  const [msgIndex, setMsgIndex] = useState(
    () => Math.floor(Math.random() * LOADING_MESSAGES.length)
  )

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const displayMessage = message || LOADING_MESSAGES[msgIndex]

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}>
      <div className="ramen-spin w-10 h-10">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="spin-g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
          </defs>
          <path
            d="M8 30 Q8 52 32 52 Q56 52 56 30 Z"
            fill="url(#spin-g)"
            opacity="0.15"
            stroke="url(#spin-g)"
            strokeWidth="2"
          />
          <ellipse cx="32" cy="30" rx="26" ry="6" fill="none" stroke="url(#spin-g)" strokeWidth="2.5" />
          <path
            d="M16 28 Q20 18 24 22 Q28 26 30 16 Q32 10 34 14"
            fill="none"
            stroke="url(#spin-g)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="ramen-noodle"
          />
        </svg>
      </div>
      <p className="text-sm text-text-secondary animate-pulse">{displayMessage}</p>
    </div>
  )
}
