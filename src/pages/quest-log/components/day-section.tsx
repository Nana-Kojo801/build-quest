import { motion } from 'framer-motion'
import { cn, formatDateLabel, formatDuration, calcProgress } from '@/lib/utils'
import { TaskItem } from './task-item'
import type { Task, ActiveProject } from '@/lib/types'
import { PartyPopper } from 'lucide-react'

interface DaySectionProps {
  date: string
  tasks: Task[]
  projects: ActiveProject[]
  isToday?: boolean
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  onUncomplete?: (id: string) => void
}

function getProjectIndex(projects: ActiveProject[], projectId: string): number {
  const idx = projects.findIndex((p) => p.id === projectId)
  return idx === -1 ? 0 : idx
}

export function DaySection({
  date,
  tasks,
  projects,
  isToday = false,
  onComplete,
  onSkip,
  onUncomplete,
}: DaySectionProps) {
  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalCount = tasks.length
  const progress = calcProgress(completedCount, totalCount)
  const totalMinutes = tasks.reduce((s, t) => s + t.estimatedMinutes, 0)

  // Group tasks by project for today, flat for upcoming
  const grouped = isToday
    ? tasks.reduce<Record<string, Task[]>>((acc, t) => {
        if (!acc[t.projectId]) acc[t.projectId] = []
        acc[t.projectId].push(t)
        return acc
      }, {})
    : null

  if (totalCount === 0 && isToday) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-3 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/40 py-10"
      >
        <PartyPopper size={32} className="text-emerald-400 opacity-80" />
        <p className="text-sm font-semibold text-foreground">All caught up!</p>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          No tasks scheduled for today. Pick up something new or enjoy the break.
        </p>
      </motion.div>
    )
  }

  if (totalCount === 0) return null

  return (
    <div className="mx-4">
      {/* Section header */}
      <div className="flex items-center gap-2 py-2">
        <span
          className={cn(
            'text-sm font-semibold',
            isToday ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {formatDateLabel(date)}
        </span>
        {isToday && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/20">
            Today
          </span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {completedCount}/{totalCount} · {formatDuration(totalMinutes)}
        </span>
      </div>

      {/* Progress bar for today */}
      {isToday && totalCount > 0 && (
        <div className="stat-bar-track mb-3">
          <div className="stat-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Task list — grouped by project for today, flat otherwise */}
      {grouped ? (
        <div className="space-y-4">
          {Object.entries(grouped).map(([projectId, projectTasks]) => {
            const project = projects.find((p) => p.id === projectId)
            const pidx = getProjectIndex(projects, projectId)
            return (
              <div key={projectId}>
                {project && (
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 pl-1">
                    {project.title}
                  </p>
                )}
                <div className="space-y-1.5">
                  {projectTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      project={project}
                      projectIndex={pidx}
                      onComplete={onComplete}
                      onSkip={onSkip}
                      onUncomplete={onUncomplete}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              project={projects.find((p) => p.id === task.projectId)}
              projectIndex={getProjectIndex(projects, task.projectId)}
              onComplete={onComplete}
              onSkip={onSkip}
            />
          ))}
        </div>
      )}
    </div>
  )
}
