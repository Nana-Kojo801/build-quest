import { Trophy, Flame, Zap, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calcLevel, calcXPInLevel, calcXPProgress } from '@/lib/utils'
import type { UserProgress } from '@/lib/types'

const LEVEL_TITLES: Record<number, string> = {
  1: 'Apprentice Coder', 2: 'Junior Dev', 3: 'Code Craftsman', 4: 'Senior Builder',
  5: 'Tech Architect', 6: 'Code Wizard', 7: 'Principal Engineer', 8: 'Tech Lead',
  9: 'CTO Mode', 10: 'Legendary Builder',
}

function getLevelTitle(level: number): string {
  if (level >= 10) return LEVEL_TITLES[10]
  return LEVEL_TITLES[level] ?? `Level ${level} Builder`
}

interface Props { progress: UserProgress }

export function ProgressCard({ progress }: Props) {
  const level = calcLevel(progress.totalXP)
  const xpInLevel = calcXPInLevel(progress.totalXP)
  const xpPct = calcXPProgress(progress.totalXP)

  return (
    <Card className="quest-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy size={16} className="text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{level}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{getLevelTitle(level)}</p>
            <p className="text-xs text-muted-foreground mb-1.5">{xpInLevel} / 1000 XP to next level</p>
            <div className="xp-bar">
              <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-secondary p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame size={16} className="text-orange-400" />
            </div>
            <p className="text-lg font-bold">{progress.streak}</p>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </div>
          <div className="rounded-xl bg-secondary p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap size={16} className="text-primary" />
            </div>
            <p className="text-lg font-bold">{progress.totalXP}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          <div className="rounded-xl bg-secondary p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckSquare size={16} className="text-emerald-400" />
            </div>
            <p className="text-lg font-bold">{progress.totalTasksCompleted}</p>
            <p className="text-xs text-muted-foreground">Tasks done</p>
          </div>
        </div>

        {progress.longestStreak > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Longest streak: <span className="text-orange-400 font-semibold">{progress.longestStreak} days</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
