import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  CheckCircle2,
  Circle,
  SkipForward,
  RotateCcw,
  Calendar,
} from 'lucide-react'
import { cn, formatDateLabel, formatDuration, calcProgress, addDays, todayStr } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProjectColors } from './project-legend'
import type { Task, DaySchedule, ActiveProject } from '@/lib/types'

// ── Reschedule Picker ──────────────────────────────────────────────────────

interface ReschedulePickerProps {
  task: Task
  onReschedule: (id: string, date: string) => void
  onClose: () => void
}

function ReschedulePicker({ task, onReschedule, onClose }: ReschedulePickerProps) {
  const today = todayStr()
  const options = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-1 z-30 rounded-xl border border-border bg-popover shadow-xl p-2 min-w-[170px]"
    >
      <p className="text-[10px] text-muted-foreground px-2 py-1 font-semibold uppercase tracking-wider">
        Move to…
      </p>
      {options.map((date) => (
        <button
          key={date}
          onClick={() => {
            onReschedule(task.id, date)
            onClose()
          }}
          className="w-full text-left px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-secondary transition-colors"
        >
          {formatDateLabel(date)}
        </button>
      ))}
      <button
        onClick={onClose}
        className="w-full text-left px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-secondary transition-colors mt-0.5"
      >
        Cancel
      </button>
    </motion.div>
  )
}

// ── Schedule Task Row ──────────────────────────────────────────────────────

const PRIORITY_COLORS = {
  high: 'border-l-rose-500',
  medium: 'border-l-amber-500',
  low: 'border-l-sky-500/50',
}

interface ScheduleTaskRowProps {
  task: Task
  project: ActiveProject | undefined
  projectIdx: number
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  onReschedule: (id: string, date: string) => void
}

function ScheduleTaskRow({ task, project, projectIdx, onComplete, onSkip, onReschedule }: ScheduleTaskRowProps) {
  const [showReschedule, setShowReschedule] = useState(false)
  const colors = getProjectColors(projectIdx)
  const isCompleted = task.status === 'completed'
  const isSkipped = task.status === 'skipped'

  return (
    <div
      className={cn(
        'relative group flex items-start gap-3 rounded-lg border border-border border-l-[3px] bg-card px-3 py-2.5 transition-all duration-150',
        'hover:border-primary/20 hover:bg-card/80',
        PRIORITY_COLORS[task.priority],
        (isCompleted || isSkipped) && 'opacity-50',
      )}
    >
      {/* Status icon */}
      <button
        onClick={() => !isSkipped && onComplete(task.id)}
        disabled={isSkipped}
        className="mt-0.5 flex-shrink-0"
        aria-label={isCompleted ? 'Completed' : 'Mark complete'}
      >
        {isCompleted ? (
          <CheckCircle2 size={16} className="text-emerald-400" />
        ) : (
          <Circle
            size={16}
            className={cn(
              'transition-colors',
              isSkipped ? 'text-muted-foreground/30' : 'text-muted-foreground hover:text-primary',
            )}
          />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <span className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', colors.dot)} />
          <span
            className={cn(
              'text-sm font-medium leading-snug flex-1 min-w-0',
              (isCompleted || isSkipped) && 'line-through text-muted-foreground',
            )}
          >
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 pl-4">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock size={10} />
            {formatDuration(task.estimatedMinutes)}
          </span>
          {task.carriedOverFrom && (
            <Badge variant="secondary" className="h-4 text-[10px] px-1.5 py-0 gap-0.5">
              <RotateCcw size={8} />
              carried
            </Badge>
          )}
          {project && (
            <span className={cn('text-[10px] font-medium truncate', colors.text)}>
              {project.title}
            </span>
          )}
        </div>
      </div>

      {/* Actions — visible on hover or touch */}
      {!isCompleted && !isSkipped && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSkip(task.id)}
            className="text-muted-foreground hover:text-foreground h-6 w-6"
            title="Skip"
          >
            <SkipForward size={12} />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowReschedule((p) => !p)}
              className="text-muted-foreground hover:text-foreground h-6 w-6"
              title="Reschedule"
            >
              <Calendar size={12} />
            </Button>
            <AnimatePresence>
              {showReschedule && (
                <ReschedulePicker
                  task={task}
                  onReschedule={onReschedule}
                  onClose={() => setShowReschedule(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Day Column ─────────────────────────────────────────────────────────────

interface DayColumnProps {
  schedule: DaySchedule
  projects: ActiveProject[]
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  onReschedule: (id: string, date: string) => void
}

export function DayColumn({ schedule, projects, onComplete, onSkip, onReschedule }: DayColumnProps) {
  const { date, tasks, totalMinutes, completedMinutes, isToday, isPast } = schedule
  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalCount = tasks.length
  const progress = calcProgress(completedCount, totalCount)
  const allDone = totalCount > 0 && completedCount === totalCount

  return (
    <motion.div
      key={date}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-4 mb-4"
    >
      {/* Day header */}
      <div className="flex items-center gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">{formatDateLabel(date)}</h2>
            {isToday && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/20">
                Today
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalCount === 0
              ? 'No tasks scheduled'
              : `${completedCount}/${totalCount} tasks · ${formatDuration(completedMinutes)}/${formatDuration(totalMinutes)}`}
          </p>
        </div>
        {allDone && totalCount > 0 && (
          <span className="ml-auto text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={13} />
            Done
          </span>
        )}
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="stat-bar-track mb-4">
          <div
            className={cn('stat-bar-fill', isPast && !allDone && 'bg-rose-500 shadow-none')}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Task list */}
      {totalCount === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 rounded-xl border border-dashed border-border/60 bg-card/30">
          <Calendar size={22} className="text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">Free day</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => {
            const projectIdx = projects.findIndex((p) => p.id === task.projectId)
            return (
              <ScheduleTaskRow
                key={task.id}
                task={task}
                project={projects.find((p) => p.id === task.projectId)}
                projectIdx={projectIdx === -1 ? 0 : projectIdx}
                onComplete={onComplete}
                onSkip={onSkip}
                onReschedule={onReschedule}
              />
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
