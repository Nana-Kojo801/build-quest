import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn, calcProgress } from '@/lib/utils'
import type { ProjectPhase, Task } from '@/lib/types'

interface PhaseTimelineProps {
  phases: ProjectPhase[]
  tasks: Task[]
}

function getPhaseTaskCounts(phase: ProjectPhase, tasks: Task[]) {
  const phaseTasks = tasks.filter((t) => t.phaseId === phase.id)
  const completed = phaseTasks.filter((t) => t.status === 'completed').length
  return { total: phaseTasks.length, completed }
}

export function PhaseTimeline({ phases, tasks }: PhaseTimelineProps) {
  const sorted = [...phases].sort((a, b) => a.order - b.order)

  return (
    <div className="px-4">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Phase Timeline
      </h2>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-4 top-5 bottom-5 w-px bg-border" />

        <div className="space-y-4">
          {sorted.map((phase, idx) => {
            const { total, completed } = getPhaseTaskCounts(phase, tasks)
            const pct = calcProgress(completed, total)
            const isCompleted = phase.status === 'completed' || pct === 100
            const isActive = phase.status === 'active' && !isCompleted
            const isPending = phase.status === 'pending' && !isCompleted

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                className="relative flex gap-3"
              >
                {/* Phase icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all',
                      isCompleted && 'border-emerald-500 bg-emerald-500/20',
                      isActive && 'border-primary bg-primary/20 animate-pulse-glow',
                      isPending && 'border-border bg-background'
                    )}
                  >
                    {isCompleted && <CheckCircle2 size={14} className="text-emerald-400" />}
                    {isActive && <Loader2 size={14} className="text-primary animate-spin" />}
                    {isPending && <Circle size={14} className="text-muted-foreground" />}
                  </div>
                </div>

                {/* Phase content */}
                <div className="flex-1 pb-1 min-w-0">
                  <div className="rounded-xl border border-border bg-card p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Phase {phase.order + 1}
                        </span>
                        <h3 className={cn(
                          'text-sm font-semibold leading-tight mt-0.5',
                          isCompleted ? 'text-muted-foreground' : 'text-foreground'
                        )}>
                          {phase.title}
                        </h3>
                      </div>
                      <div
                        className={cn(
                          'text-xs font-bold flex-shrink-0',
                          isCompleted ? 'text-emerald-400' : isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      >
                        {pct}%
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {phase.description}
                    </p>

                    <div className="stat-bar-track">
                      <div className="stat-bar-fill" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                      <span>{completed}/{total} tasks</span>
                      <span>{phase.estimatedDays}d estimated</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
