import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Clock, ChevronRight, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/utils'
import type { Task } from '@/lib/types'

interface TodayTasksPreviewProps {
  tasks: Task[]
  onComplete: (id: string) => void
  onUncomplete: (id: string) => void
  onViewAll: () => void
  /** When true, renders without px-4 padding (used in desktop center column) */
  noPadding?: boolean
}

function TaskRow({
  task,
  onComplete,
  onUncomplete,
  index,
}: {
  task: Task
  onComplete: (id: string) => void
  onUncomplete: (id: string) => void
  index: number
}) {
  const isDone = task.status === 'completed'

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
        isDone
          ? 'border-border/40 bg-secondary/20 opacity-60'
          : 'border-border bg-card hover:border-border/80'
      }`}
    >
      <button
        onClick={() => (isDone ? onUncomplete(task.id) : onComplete(task.id))}
        className="flex-shrink-0 transition-transform duration-150 hover:scale-110 active:scale-95"
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
      >
        {isDone ? (
          <CheckCircle2 size={18} className="text-primary" />
        ) : (
          <Circle size={18} className="text-muted-foreground/50 hover:text-primary transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-medium leading-snug truncate ${
            isDone ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Clock size={9} className="text-muted-foreground/60 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground/70">
            {formatDuration(task.estimatedMinutes)}
          </span>
          {task.priority === 'high' && !isDone && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400">
              Priority
            </span>
          )}
        </div>
      </div>

      {!isDone && (
        <div className="flex items-center gap-0.5 shrink-0">
          <span className="text-[10px] font-bold text-primary">+{task.xpReward}</span>
          <span className="text-[10px] text-muted-foreground">XP</span>
        </div>
      )}
    </motion.div>
  )
}

function EmptyTasks() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8 gap-3"
    >
      <div className="w-12 h-12 rounded-lg border border-border bg-secondary/60 flex items-center justify-center">
        <CalendarCheck size={20} className="text-muted-foreground/50" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">All clear for today</p>
        <p className="text-xs text-muted-foreground mt-1">
          No tasks scheduled. Start a project to get going.
        </p>
      </div>
    </motion.div>
  )
}

export function TodayTasksPreview({
  tasks,
  onComplete,
  onUncomplete,
  onViewAll,
  noPadding,
}: TodayTasksPreviewProps) {
  const preview = tasks.slice(0, 4)
  const remaining = tasks.length - preview.length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={noPadding ? '' : 'px-4'}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-foreground uppercase tracking-wider">
            Today's Quests
          </h2>
          {tasks.length > 0 && (
            <span className="text-[10px] text-muted-foreground bg-secondary rounded px-1.5 py-0.5 font-bold tabular-nums">
              {completedCount}/{tasks.length}
            </span>
          )}
        </div>
        {tasks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            View all <ChevronRight size={11} />
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyTasks />
      ) : (
        <div className="flex flex-col gap-1.5">
          <AnimatePresence>
            {preview.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
                index={i}
              />
            ))}
          </AnimatePresence>
          {remaining > 0 && (
            <button
              onClick={onViewAll}
              className="text-[11px] text-muted-foreground hover:text-primary text-center py-2
                         transition-colors font-medium"
            >
              +{remaining} more task{remaining !== 1 ? 's' : ''} today
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
