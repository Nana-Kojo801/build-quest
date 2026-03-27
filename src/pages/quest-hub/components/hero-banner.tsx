import { motion } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
import { calcLevel, calcXPProgress, calcXPInLevel, calcXPToNextLevel } from '@/lib/utils'
import type { UserProgress } from '@/lib/types'

interface HeroBannerProps {
  progress: UserProgress | null
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Apprentice',
  2: 'Junior Builder',
  3: 'Feature Crafter',
  4: 'Module Architect',
  5: 'Senior Hacker',
  6: 'Staff Engineer',
  7: 'Principal Dev',
  8: 'Tech Lead',
  9: 'Distinguished Eng',
  10: 'Grand Architect',
}

function getLevelTitle(level: number): string {
  if (level <= 10) return LEVEL_TITLES[level] ?? 'Grand Architect'
  return 'Legendary Builder'
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Stat bar row (reference-inspired) ───────────────────────────────────────

export function StatBar({
  label,
  value,
  max,
  display,
}: {
  label: string
  value: number
  max: number
  display?: string
}) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  const shown = display ?? String(value)

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-14 shrink-0">
        {label}
      </span>
      <div className="stat-bar-track flex-1">
        <motion.div
          className="stat-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[11px] font-bold text-foreground tabular-nums w-10 text-right shrink-0">
        {shown}
      </span>
    </div>
  )
}

// ─── Mobile / compact hero card ───────────────────────────────────────────────

export function HeroBanner({ progress }: HeroBannerProps) {
  const totalXP   = progress?.totalXP ?? 0
  const level     = calcLevel(totalXP)
  const xpInLevel = calcXPInLevel(totalXP)
  const xpToNext  = calcXPToNextLevel(totalXP)
  const xpPercent = calcXPProgress(totalXP)
  const streak    = progress?.streak ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-4 mt-4 rounded-lg border border-border bg-card overflow-hidden"
    >
      <div className="p-4">
        {/* Greeting row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {getGreeting()}, Builder
            </p>
            <h1 className="text-lg font-black text-foreground mt-0.5 tracking-tight">
              Quest Hub
            </h1>
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 rounded-md
                         bg-orange-500/10 border border-orange-500/25 px-2.5 py-1.5 shrink-0"
            >
              <Flame size={13} className="text-orange-400" />
              <span className="text-sm font-black text-orange-400">{streak}</span>
              <span className="text-[10px] text-orange-400/60 font-medium">
                {streak === 1 ? 'day' : 'days'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Level + stats row */}
        <div className="flex items-start gap-4">
          {/* Level box — reference style */}
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-md
                          border border-border bg-secondary/60 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none">
              Level
            </span>
            <motion.span
              className="text-3xl font-black leading-none mt-0.5"
              style={{ color: 'hsl(73 96% 46%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {level}
            </motion.span>
          </div>

          {/* XP + stat bars */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground truncate mb-2">
              {getLevelTitle(level)}
            </p>

            {/* XP bar */}
            <div className="stat-bar-track mb-1">
              <motion.div
                className="stat-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <Zap size={9} className="text-primary" />
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {xpInLevel.toLocaleString()} XP
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                /{xpToNext.toLocaleString()} to next
              </span>
            </div>

            {/* Attribute bars */}
            <div className="space-y-1.5">
              <StatBar label="STREAK"   value={streak}  max={30} display={`${streak}d`} />
              <StatBar
                label="TOTAL XP"
                value={Math.min(totalXP, 10000)}
                max={10000}
                display={totalXP >= 1000 ? `${(totalXP / 1000).toFixed(1)}k` : String(totalXP)}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Desktop right-panel (3-column layout) ────────────────────────────────────

interface DesktopStatsPanelProps {
  progress: UserProgress | null
  activeProjectCount: number
  todayTaskCount: number
  completedTodayCount: number
}

export function DesktopStatsPanel({
  progress,
  activeProjectCount,
  todayTaskCount,
  completedTodayCount,
}: DesktopStatsPanelProps) {
  const totalXP   = progress?.totalXP ?? 0
  const level     = calcLevel(totalXP)
  const xpInLevel = calcXPInLevel(totalXP)
  const xpToNext  = calcXPToNextLevel(totalXP)
  const xpPercent = calcXPProgress(totalXP)
  const streak    = progress?.streak ?? 0

  return (
    <div className="panel p-5 space-y-5 sticky top-4">
      {/* Level box — large reference style */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Rank
        </p>
        <div className="flex items-end gap-3">
          <div className="flex flex-col items-center justify-center w-20 h-20 rounded-md
                          border border-border bg-secondary/60 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none">
              Level
            </span>
            <motion.span
              className="text-4xl font-black leading-none mt-1"
              style={{ color: 'hsl(73 96% 46%)' }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {level}
            </motion.span>
          </div>
          <div className="pb-1">
            <p className="text-[12px] font-bold text-foreground">{getLevelTitle(level)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">
              {xpInLevel.toLocaleString()} / {xpToNext.toLocaleString()} XP
            </p>
          </div>
        </div>
      </div>

      {/* XP progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Experience
          </span>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {Math.round(xpPercent)}%
          </span>
        </div>
        <div className="stat-bar-track">
          <motion.div
            className="stat-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stat bars — reference attribute layout */}
      <div className="space-y-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          Attributes
        </p>
        <StatBar label="STREAK"  value={streak}               max={30}   display={`${streak}d`} />
        <StatBar label="ACTIVE"  value={activeProjectCount}   max={10}   display={String(activeProjectCount)} />
        <StatBar
          label="TODAY"
          value={completedTodayCount}
          max={Math.max(todayTaskCount, 1)}
          display={`${completedTodayCount}/${todayTaskCount}`}
        />
        <StatBar
          label="XP"
          value={Math.min(totalXP, 10000)}
          max={10000}
          display={totalXP >= 1000 ? `${(totalXP / 1000).toFixed(1)}k` : String(totalXP)}
        />
      </div>
    </div>
  )
}
