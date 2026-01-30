export default function RamenLogo({ size = 32, className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-label="Ramen Crypto Tracker logo"
    >
      <defs>
        <linearGradient id="logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id="logo-n1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
        <linearGradient id="logo-n2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14F195" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FF3B69" />
        </linearGradient>
      </defs>
      {/* Bowl body */}
      <path
        d="M8 30 Q8 52 32 52 Q56 52 56 30 Z"
        fill="url(#logo-g)"
        opacity="0.15"
        stroke="url(#logo-g)"
        strokeWidth="2"
      />
      {/* Bowl rim */}
      <ellipse cx="32" cy="30" rx="26" ry="6" fill="none" stroke="url(#logo-g)" strokeWidth="2.5" />
      {/* Noodle chart lines */}
      <path
        d="M16 28 Q20 18 24 22 Q28 26 30 16 Q32 10 34 14"
        fill="none"
        stroke="url(#logo-n1)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M26 28 Q30 20 34 24 Q38 28 40 18 Q42 12 46 16"
        fill="none"
        stroke="url(#logo-n2)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Steam wisps */}
      <path d="M22 12 Q24 8 22 4" fill="none" stroke="#9945FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M40 10 Q42 6 40 2" fill="none" stroke="#14F195" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Chopsticks */}
      <line x1="44" y1="10" x2="52" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="48" y1="8" x2="54" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}
