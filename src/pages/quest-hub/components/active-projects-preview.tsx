import { motion } from 'framer-motion'
import { ChevronRight, Layers, Target, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calcProgress } from '@/lib/utils'
import type { ActiveProject } from '@/lib/types'

interface ActiveProjectsPreviewProps {
  projects: ActiveProject[]
  onViewProject: (id: string) => void
  onViewAll: () => void
  /** For desktop left panel: taller card list without outer padding */
  panelMode?: boolean
}

// ─── Project list item — reference-style compact card ────────────────────────

function ProjectListItem({
  project,
  onView,
  index,
}: {
  project: ActiveProject
  onView: () => void
  index: number
}) {
  const pct = calcProgress(project.completedTasks, project.totalTasks)
  const daysLeft = Math.max(
    0,
    Math.ceil((project.targetEndDate - Date.now()) / (1000 * 60 * 60 * 24))
  )

  return (
    <motion.button
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.07 }}
      onClick={onView}
      className="w-full text-left rounded-lg border border-border bg-card
                 hover:border-border/80 hover:bg-secondary/30
                 transition-all duration-200 p-3 group"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground truncate">{project.title}</p>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{project.category}</p>
        </div>
        <ChevronRight
          size={13}
          className="text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 mt-0.5 transition-colors"
        />
      </div>

      {/* Progress bar */}
      <div className="stat-bar-track mb-1.5">
        <motion.div
          className="stat-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: index * 0.07 + 0.2, ease: 'easeOut' }}
        />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground tabular-nums">
          {project.completedTasks}/{project.totalTasks} tasks
        </span>
        <div className="flex items-center gap-1">
          <Target size={9} className={daysLeft <= 2 ? 'text-orange-400' : 'text-muted-foreground/60'} />
          <span className={daysLeft <= 2 ? 'text-orange-400 font-semibold' : 'text-muted-foreground'}>
            {daysLeft === 0 ? 'Due today' : `${daysLeft}d`}
          </span>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyProjects({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8 gap-3 text-center"
    >
      <div className="w-12 h-12 rounded-lg border border-border bg-secondary/60 flex items-center justify-center">
        <Layers size={18} className="text-muted-foreground/50" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">No active quests</p>
        <p className="text-xs text-muted-foreground mt-1">
          Generate an idea and start building.
        </p>
      </div>
      <Button variant="quest" size="sm" onClick={onStart}>
        <Plus size={13} />
        Start a Project
      </Button>
    </motion.div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function ActiveProjectsPreview({
  projects,
  onViewProject,
  onViewAll,
  panelMode,
}: ActiveProjectsPreviewProps) {
  const preview   = panelMode ? projects : projects.slice(0, 2)
  const remaining = projects.length - preview.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={panelMode ? '' : 'px-4'}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Projects
          </h2>
          {projects.length > 0 && (
            <span className="text-[10px] font-bold text-muted-foreground bg-secondary
                             rounded px-1.5 py-0.5 tabular-nums">
              {projects.length}
            </span>
          )}
        </div>
        {projects.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="h-6 text-xs gap-0.5 text-muted-foreground hover:text-foreground px-2"
          >
            All <ChevronRight size={10} />
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyProjects onStart={onViewAll} />
      ) : (
        <div className="flex flex-col gap-2">
          {preview.map((project, i) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onView={() => onViewProject(project.id)}
              index={i}
            />
          ))}
          {remaining > 0 && (
            <button
              onClick={onViewAll}
              className="text-[11px] text-muted-foreground hover:text-primary text-center py-1.5
                         transition-colors font-medium"
            >
              +{remaining} more project{remaining !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
