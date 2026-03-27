import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ChevronDown, ChevronUp, FastForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TaskItem } from './task-item'
import type { Task, ActiveProject } from '@/lib/types'

interface OverdueSectionProps {
  tasks: Task[]
  projects: ActiveProject[]
  onComplete: (id: string) => void
  onSkip: (id: string) => void
  onCarryAll: () => void
}

function getProjectIndex(projects: ActiveProject[], projectId: string): number {
  const idx = projects.findIndex((p) => p.id === projectId)
  return idx === -1 ? 0 : idx
}

export function OverdueSection({ tasks, projects, onComplete, onSkip, onCarryAll }: OverdueSectionProps) {
  const [open, setOpen] = useState(true)
  const [carrying, setCarrying] = useState(false)

  if (tasks.length === 0) return null

  async function handleCarryAll() {
    setCarrying(true)
    onCarryAll()
    setTimeout(() => setCarrying(false), 800)
  }

  return (
    <div className="mx-4">
      {/* Header toggle */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 py-2 group"
      >
        <div className="flex items-center gap-2 flex-1">
          <AlertTriangle size={14} className="text-rose-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-rose-400">Overdue</span>
          <Badge variant="destructive" className="h-4 text-[10px] px-1.5 py-0">
            {tasks.length}
          </Badge>
        </div>
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="overdue-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pb-2">
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

            {/* Carry all forward CTA */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCarryAll}
              disabled={carrying}
              className="w-full mt-1 mb-3 border-rose-500/25 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/40 gap-1.5"
            >
              <FastForward size={13} />
              {carrying ? 'Moving tasks…' : 'Carry All Forward to Tomorrow'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
