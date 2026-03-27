import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, SkipForward, Clock, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { cn, formatDuration, truncate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CompletionAnimation } from './completion-animation'
import type { Task, ActiveProject } from '@/lib/types'

const PRIORITY_STYLES = {
  high: 'border-l-rose-500',
  medium: 'border-l-amber-500',
  low: 'border-l-sky-500/60',
}

const PRIORITY_BADGE_VARIANTS = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
} as const

const PROJECT_HUE_MAP: Record<number, string> = {
  0: 'bg-primary',
  1: 'bg-sky-500',
  2: 'bg-emerald-500',
  3: 'bg-amber-500',
  4: 'bg-rose-500',
  5: 'bg-cyan-500',
  6: 'bg-orange-500',
  7: 'bg-pink-500',
}

function getProjectDot(idx: number) {
  return PROJECT_HUE_MAP[idx % Object.keys(PROJECT_HUE_MAP).length]
}

interface TaskItemProps {
  task: Task
  project: ActiveProject | undefined
  projectIndex: number
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  onUncomplete?: (id: string) => void
  isCompleting?: boolean
}

export function TaskItem({
  task,
  project,
  projectIndex,
  onComplete,
  onSkip,
  onUncomplete,
  isCompleting = false,
}: TaskItemProps) {
  const [showXP, setShowXP] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const isCompleted = task.status === 'completed'
  const isSkipped = task.status === 'skipped'
  const isCarriedOver = task.status === 'carried_over' || !!task.carriedOverFrom

  function handleComplete() {
    if (isCompleted) {
      onUncomplete?.(task.id)
      return
    }
    setShowXP(true)
    onComplete(task.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: isCompleted || isSkipped ? 0.55 : 1, x: 0 }}
      exit={{ opacity: 0, x: 8, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-lg border-l-[3px] bg-card border border-border overflow-hidden transition-colors duration-150',
        'hover:border-border/80',
        PRIORITY_STYLES[task.priority],
        isCompleted && 'opacity-55',
        isSkipped && 'opacity-40',
      )}
    >
      {/* XP pop animation — positioned relative to the row */}
      <CompletionAnimation show={showXP} xpAmount={task.xpReward} onFinish={() => setShowXP(false)} />

      <div className="flex items-start gap-3 px-3 py-3">
        {/* Completion checkbox */}
        <button
          onClick={handleComplete}
          disabled={isSkipped || isCompleting}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150',
            isCompleted
              ? 'border-primary bg-primary/20 text-primary'
              : 'border-border hover:border-primary hover:bg-primary/10',
            isSkipped && 'opacity-40 cursor-not-allowed',
          )}
          aria-label={isCompleted ? 'Mark incomplete' : 'Complete task'}
        >
          {isCompleted && <Check size={12} strokeWidth={3} />}
        </button>

        {/* Project color dot + task info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            {/* Project dot */}
            <span
              className={cn('mt-1.5 flex-shrink-0 w-2 h-2 rounded-full', getProjectDot(projectIndex))}
              title={project?.title}
            />

            {/* Title */}
            <span
              className={cn(
                'flex-1 min-w-0 text-sm font-medium leading-snug',
                isCompleted && 'line-through text-muted-foreground',
                isSkipped && 'line-through text-muted-foreground',
              )}
            >
              {truncate(task.title, 72)}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {/* Time estimate */}
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock size={10} />
              {formatDuration(task.estimatedMinutes)}
            </span>

            {/* Priority badge */}
            <Badge variant={PRIORITY_BADGE_VARIANTS[task.priority]} className="h-4 text-[10px] px-1.5 py-0">
              {task.priority}
            </Badge>

            {/* Carried-over indicator */}
            {isCarriedOver && (
              <Badge variant="secondary" className="h-4 text-[10px] px-1.5 py-0 gap-0.5">
                <RotateCcw size={8} />
                carried
              </Badge>
            )}

            {/* Project name */}
            {project && (
              <span className="text-[11px] text-muted-foreground/70 truncate max-w-[120px]">
                {truncate(project.title, 18)}
              </span>
            )}

            {/* XP */}
            <span className="text-[10px] text-primary/70 font-medium ml-auto">+{task.xpReward} XP</span>
          </div>

          {/* Expand description */}
          {task.description && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-0.5 mt-1.5 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              {expanded ? 'hide' : 'details'}
            </button>
          )}
          {expanded && task.description && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs text-muted-foreground leading-relaxed"
            >
              {task.description}
            </motion.p>
          )}
        </div>

        {/* Actions */}
        {!isCompleted && !isSkipped && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSkip(task.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground mt-0.5"
            title="Skip task"
            aria-label="Skip task"
          >
            <SkipForward size={14} />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
