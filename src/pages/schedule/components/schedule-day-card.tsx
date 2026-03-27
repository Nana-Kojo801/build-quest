import { cn, formatDuration, calcProgress } from '@/lib/utils'
import { getProjectColors } from './project-legend'
import type { DaySchedule, ActiveProject } from '@/lib/types'
import { format, parseISO } from 'date-fns'

interface ScheduleDayCardProps {
  schedule: DaySchedule
  projects: ActiveProject[]
  isSelected: boolean
  onClick: () => void
}

export function ScheduleDayCard({ schedule, projects, isSelected, onClick }: ScheduleDayCardProps) {
  const { date, tasks, totalMinutes, completedMinutes, isToday, isPast } = schedule

  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalCount = tasks.length
  const progress = calcProgress(completedCount, totalCount)
  const allDone = totalCount > 0 && completedCount === totalCount

  // Unique projects for this day
  const projectIds = [...new Set(tasks.map((t) => t.projectId))]
  const dayProjects = projectIds.map((pid) => ({
    project: projects.find((p) => p.id === pid),
    idx: projects.findIndex((p) => p.id === pid),
  }))

  const parsedDate = parseISO(date)
  const dayOfWeek = format(parsedDate, 'EEE')
  const dayNum = format(parsedDate, 'd')

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 transition-all duration-150 min-w-[72px] text-left',
        isToday && !isSelected && 'border-primary/40 bg-primary/8 ring-1 ring-primary/20',
        isSelected && 'border-primary bg-primary/15 ring-2 ring-primary/30 shadow-lg shadow-primary/15',
        !isToday && !isSelected && 'border-border bg-card hover:border-primary/25 hover:bg-card/80',
        isPast && !isSelected && 'opacity-65',
      )}
    >
      {/* Day label */}
      <span
        className={cn(
          'text-[10px] font-semibold uppercase tracking-wider',
          isToday ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {dayOfWeek}
      </span>

      {/* Day number */}
      <span
        className={cn(
          'text-base font-bold leading-none',
          isToday ? 'text-primary' : isSelected ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {dayNum}
      </span>

      {/* Task count */}
      {totalCount > 0 ? (
        <span className="text-[10px] text-muted-foreground">{totalCount} task{totalCount !== 1 ? 's' : ''}</span>
      ) : (
        <span className="text-[10px] text-muted-foreground/50">free</span>
      )}

      {/* Project color dots */}
      {dayProjects.length > 0 && (
        <div className="flex items-center gap-0.5 flex-wrap justify-center">
          {dayProjects.slice(0, 4).map(({ project, idx }, i) => (
            <span
              key={project?.id ?? i}
              className={cn('w-1.5 h-1.5 rounded-full', getProjectColors(idx).dot)}
            />
          ))}
          {dayProjects.length > 4 && (
            <span className="text-[9px] text-muted-foreground">+{dayProjects.length - 4}</span>
          )}
        </div>
      )}

      {/* Completion progress dot for past/today */}
      {(isToday || isPast) && totalCount > 0 && (
        <div
          className={cn(
            'w-full h-0.5 rounded-full overflow-hidden mt-0.5',
            allDone ? 'bg-emerald-500/20' : 'bg-muted',
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              allDone
                ? 'bg-emerald-500'
                : isPast
                ? 'bg-rose-500/70'
                : 'bg-primary',
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Time indicator */}
      {totalMinutes > 0 && (
        <span className="text-[9px] text-muted-foreground/60">
          {formatDuration(isPast || isToday ? completedMinutes : totalMinutes)}
          {(isToday || isPast) && totalMinutes > 0 && (
            <span className="text-muted-foreground/40">/{formatDuration(totalMinutes)}</span>
          )}
        </span>
      )}
    </button>
  )
}
