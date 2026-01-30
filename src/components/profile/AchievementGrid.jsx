const ACHIEVEMENTS = [
  { id: 'first_trade', name: 'First Trade', desc: 'Execute your first paper trade', icon: '\uD83D\uDCC8' },
  { id: 'diamond_hands', name: 'Diamond Hands', desc: 'Hold a position for 30+ days', icon: '\uD83D\uDC8E' },
  { id: 'diversified', name: 'Diversified', desc: 'Hold 3+ different assets', icon: '\uD83C\uDF10' },
  { id: 'ten_trades', name: 'Active Trader', desc: 'Complete 10 trades', icon: '\u26A1' },
  { id: 'profit_10x', name: '10x Gain', desc: 'Achieve a 10x gain on any position', icon: '\uD83D\uDE80' },
  { id: 'streak_7', name: 'Weekly Warrior', desc: '7-day login streak', icon: '\uD83D\uDD25' },
  { id: 'sentiment_check', name: 'Market Whisperer', desc: 'Check sentiment 10 times', icon: '\uD83D\uDD2E' },
  { id: 'portfolio_100k', name: 'Six Figures', desc: 'Grow portfolio past $100K', icon: '\uD83D\uDCB0' },
]

export default function AchievementGrid({ unlocked = [] }) {
  const unlockedIds = new Set(unlocked.map((a) => a.achievement_id))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedIds.has(achievement.id)
        return (
          <div
            key={achievement.id}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
              isUnlocked
                ? 'border-accent-purple/30 bg-accent-purple/5'
                : 'border-border bg-bg-surface/30 opacity-40'
            }`}
          >
            <span className="text-2xl">{achievement.icon}</span>
            <span className={`text-xs font-semibold text-center ${isUnlocked ? 'text-text-primary' : 'text-text-muted'}`}>
              {achievement.name}
            </span>
            <span className="text-[10px] text-text-muted text-center leading-tight">
              {achievement.desc}
            </span>
          </div>
        )
      })}
    </div>
  )
}
