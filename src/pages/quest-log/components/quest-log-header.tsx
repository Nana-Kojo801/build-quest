import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { Flame, CheckCircle2, Clock } from 'lucide-react'
import { cn, formatDuration, calcProgress } from '@/lib/utils'
import type { Task } from '@/lib/types'

interface QuestLogHeaderProps {
  todayTasks: Task[]
  streak: number
  todayStr: string
}

export function QuestLogHeader({ todayTasks, streak, todayStr }: QuestLogHeaderProps) {
  const completedToday = todayTasks.filter((t) => t.status === 'completed').length
  const totalToday = todayTasks.length
  const progress = calcProgress(completedToday, totalToday)
  const allDone = totalToday > 0 && completedToday === totalToday

  const totalMinutes = todayTasks.reduce((s, t) => s + t.estimatedMinutes, 0)
  const completedMinutes = todayTasks
    .filter((t) => t.status === 'completed')
    .reduce((s, t) => s + t.estimatedMinutes, 0)

  const dateLabel = (() => {
    try { return format(parseISO(todayStr), 'EEEE, MMMM d') }
    catch { return todayStr }
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-4 mt-4 rounded-lg border border-border bg-card overflow-hidden"
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Quest Log
            </p>
            <h1 className="text-lg font-black text-foreground mt-0.5 tracking-tight">{dateLabel}</h1>
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 rounded-md px-2.5 py-1.5 shrink-0"
            >
              <Flame size={13} className="text-orange-400" />
              <span className="text-sm font-black text-orange-400">{streak}</span>
              <span className="text-[10px] text-orange-400/60 font-medium">
                {streak === 1 ? 'day' : 'days'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className={cn(allDone ? 'text-primary' : 'text-muted-foreground')} />
            <span className="text-[13px] font-semibold text-foreground">
              {completedToday}
              <span className="text-muted-foreground font-normal">/{totalToday} tasks</span>
            </span>
          </div>
          {totalMinutes > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                {formatDuration(completedMinutes)} / {formatDuration(totalMinutes)}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {totalToday > 0 && (
          <div className="space-y-1.5">
            <div className="stat-bar-track">
              <motion.div
                className="stat-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{progress}% complete</span>
              {allDone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold text-primary"
                >
                  All done!
                </motion.span>
              )}
            </div>
          </div>
        )}
        {totalToday === 0 && (
          <p className="text-[13px] text-muted-foreground">No tasks scheduled for today.</p>
        )}
      </div>
    </motion.div>
  )
}
