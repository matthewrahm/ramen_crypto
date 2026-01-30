const RANKS = [
  { name: 'Instant Noodle', minXp: 0, emoji: '\uD83C\uDF5C', color: '#8888aa' },
  { name: 'Shoyu', minXp: 100, emoji: '\uD83C\uDF5C', color: '#F7931A' },
  { name: 'Tonkotsu', minXp: 500, emoji: '\uD83C\uDF72', color: '#9945FF' },
  { name: 'Wagyu Ramen', minXp: 2000, emoji: '\uD83E\uDD69', color: '#14F195' },
]

export function getRank(xp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) return RANKS[i]
  }
  return RANKS[0]
}

export function getNextRank(xp) {
  for (const rank of RANKS) {
    if (xp < rank.minXp) return rank
  }
  return null
}

export default function RamenRankBadge({ xp = 0 }) {
  const rank = getRank(xp)
  const next = getNextRank(xp)
  const progress = next ? ((xp - rank.minXp) / (next.minXp - rank.minXp)) * 100 : 100

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl"
        style={{ background: `${rank.color}20`, border: `2px solid ${rank.color}` }}
      >
        {rank.emoji}
      </div>
      <span className="text-sm font-semibold" style={{ color: rank.color }}>
        {rank.name}
      </span>
      <div className="w-full max-w-[200px]">
        <div className="flex justify-between text-xs text-text-muted mb-1">
          <span>{xp} XP</span>
          {next && <span>{next.minXp} XP</span>}
        </div>
        <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: rank.color }}
          />
        </div>
      </div>
    </div>
  )
}
