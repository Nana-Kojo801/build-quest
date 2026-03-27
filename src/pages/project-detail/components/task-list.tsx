import { motion } from 'framer-motion'
import { Loader2, Inbox } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { TaskItemRow } from './task-item-row'
import { cn } from '@/lib/utils'
import type { ProjectPhase, Task } from '@/lib/types'

interface TaskListProps {
  phases: ProjectPhase[]
  tasks: Task[]
  isLoading: boolean
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  onUncomplete: (id: string) => void
}

export function TaskList({ phases, tasks, isLoading, onComplete, onSkip, onUncomplete }: TaskListProps) {
  const sorted = [...phases].sort((a, b) => a.order - b.order)

  if (isLoading) {
    return (
      <div className="px-4 py-8 flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Generating tasks…</span>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="px-4 py-10 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
          <Inbox size={20} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">No tasks yet</p>
          <p className="text-xs text-muted-foreground mt-1">Tasks will appear here once generated.</p>
        </div>
      </div>
    )
  }

  // Build default open values: first active or pending phase
  const defaultOpen = sorted
    .filter((p) => p.status === 'active' || p.status === 'pending')
    .slice(0, 1)
    .map((p) => p.id)

  return (
    <div className="px-4">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Tasks by Phase
      </h2>

      <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-2">
        {sorted.map((phase, idx) => {
          const phaseTasks = tasks
            .filter((t) => t.phaseId === phase.id)
            .sort((a, b) => a.order - b.order)
          const completedCount = phaseTasks.filter((t) => t.status === 'completed').length
          const allDone = phaseTasks.length > 0 && completedCount === phaseTasks.length

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <AccordionItem
                value={phase.id}
                className={cn(
                  'rounded-xl border border-border bg-card overflow-hidden',
                  allDone && 'border-emerald-500/20 bg-emerald-500/5'
                )}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                    {/* Phase order chip */}
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0',
                        allDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : phase.status === 'active'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      )}
                    >
                      {phase.order + 1}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <span className={cn(
                        'text-sm font-semibold',
                        allDone ? 'text-muted-foreground' : 'text-foreground'
                      )}>
                        {phase.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {allDone ? (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">Done</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {completedCount}/{phaseTasks.length}
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2">
                    {phaseTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No tasks in this phase.
                      </p>
                    ) : (
                      phaseTasks.map((task) => (
                        <TaskItemRow
                          key={task.id}
                          task={task}
                          onComplete={onComplete}
                          onSkip={onSkip}
                          onUncomplete={onUncomplete}
                        />
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          )
        })}
      </Accordion>
    </div>
  )
}
