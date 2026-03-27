import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, SkipForward, Zap, Clock, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatDuration, formatRelativeDate } from '@/lib/utils'
import type { Task } from '@/lib/types'

interface TaskItemRowProps {
  task: Task
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  onUncomplete: (id: string) => void
}

const PRIORITY_COLORS = {
  high: 'text-rose-400 bg-rose-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  low: 'text-sky-400 bg-sky-500/10',
}

const STATUS_STYLES = {
  pending: '',
  in_progress: 'border-l-2 border-l-primary',
  completed: 'opacity-60',
  skipped: 'opacity-40',
  carried_over: 'border-l-2 border-l-amber-500',
}

export function TaskItemRow({ task, onComplete, onSkip, onUncomplete }: TaskItemRowProps) {
  const [expanded, setExpanded] = useState(false)
  const isCompleted = task.status === 'completed'
  const isSkipped = task.status === 'skipped'
  const isLocked = isCompleted || isSkipped

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={cn(
        'rounded-lg border border-border bg-background/50 overflow-hidden transition-colors',
        STATUS_STYLES[task.status],
        !isLocked && 'hover:border-border/80 hover:bg-secondary/20'
      )}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-3">
        {/* Complete toggle */}
        <button
          onClick={() => isCompleted ? onUncomplete(task.id) : onComplete(task.id)}
          disabled={isSkipped}
          className={cn(
            'flex-shrink-0 mt-0.5 transition-all duration-200 rounded-full',
            isSkipped ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
          )}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted ? (
            <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-400/20" />
          ) : (
            <Circle size={18} className="text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span
              className={cn(
                'text-sm font-medium leading-snug',
                isCompleted ? 'line-through text-muted-foreground' : 'text-foreground',
                isSkipped && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </span>

            {/* Priority badge */}
            <span
              className={cn(
                'flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded',
                PRIORITY_COLORS[task.priority]
              )}
            >
              {task.priority}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {formatDuration(task.estimatedMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <Zap size={10} className="text-amber-400/60" />
              {task.xpReward} XP
            </span>
            <span className={cn(
              task.status === 'carried_over' && 'text-amber-400'
            )}>
              {formatRelativeDate(task.scheduledDate)}
            </span>
          </div>
        </div>

        {/* Right side: expand + skip */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isLocked && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSkip(task.id)}
              className="h-6 w-6 text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10"
              title="Skip task"
            >
              <SkipForward size={12} />
            </Button>
          )}
          {task.description && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setExpanded((e) => !e)}
              className="h-6 w-6 text-muted-foreground"
            >
              <ChevronDown
                size={12}
                className={cn('transition-transform duration-200', expanded && 'rotate-180')}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded description */}
      <AnimatePresence>
        {expanded && task.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0 ml-7">
              <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
                {task.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
