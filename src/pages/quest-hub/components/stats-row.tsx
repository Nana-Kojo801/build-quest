import { motion } from 'framer-motion'
import { Layers, CheckSquare, Flame, Zap } from 'lucide-react'
import type { UserProgress } from '@/lib/types'

interface StatsRowProps {
  activeProjectCount: number
  todayTaskCount: number
  completedTodayCount: number
  progress: UserProgress | null
}

function StatCard({
  icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className="rounded-lg border border-border bg-card p-3"
    >
      <div className="mb-1.5">{icon}</div>
      <div className="text-lg font-black leading-none tabular-nums text-foreground">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">{sub}</div>}
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-1.5">
        {label}
      </div>
    </motion.div>
  )
}

export function StatsRow({
  activeProjectCount,
  todayTaskCount,
  completedTodayCount,
  progress,
}: StatsRowProps) {
  const streak  = progress?.streak ?? 0
  const totalXP = progress?.totalXP ?? 0

  return (
    <div className="grid grid-cols-2 gap-2 px-4">
      <StatCard
        icon={<Layers size={13} className="text-muted-foreground" />}
        label="Active"
        value={activeProjectCount}
        sub="projects"
        delay={0.05}
      />
      <StatCard
        icon={<CheckSquare size={13} className="text-muted-foreground" />}
        label="Today"
        value={`${completedTodayCount}/${todayTaskCount}`}
        sub="tasks"
        delay={0.1}
      />
      <StatCard
        icon={<Flame size={13} className="text-orange-400" />}
        label="Streak"
        value={streak}
        sub={streak === 1 ? 'day' : 'days'}
        delay={0.15}
      />
      <StatCard
        icon={<Zap size={13} className="text-primary" />}
        label="Total XP"
        value={totalXP >= 1000 ? `${(totalXP / 1000).toFixed(1)}k` : totalXP}
        delay={0.2}
      />
    </div>
  )
}
