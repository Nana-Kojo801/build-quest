import { motion } from 'framer-motion'
import { ArrowLeft, Pause, Play, Archive, Download, Zap, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, calcProgress, getCategoryColor, formatTimestamp } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types'
import type { ActiveProject } from '@/lib/types'

interface ProjectHeroProps {
  project: ActiveProject
  onBack: () => void
  onTogglePause: () => void
  onArchive: () => void
  onExport: () => void
}

const STATUS_CONFIG = {
  active: { label: 'Active', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  paused: { label: 'Paused', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  completed: { label: 'Completed', className: 'bg-primary/15 text-primary border-primary/30' },
  archived: { label: 'Archived', className: 'bg-secondary text-muted-foreground border-border' },
  idea: { label: 'Idea', className: 'bg-secondary text-muted-foreground border-border' },
  saved: { label: 'Saved', className: 'bg-secondary text-muted-foreground border-border' },
}

export function ProjectHero({ project, onBack, onTogglePause, onArchive, onExport }: ProjectHeroProps) {
  const progress = calcProgress(project.completedTasks, project.totalTasks)
  const statusConfig = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.active
  const difficultyClass = DIFFICULTY_COLORS[project.difficulty]
  const categoryClass = getCategoryColor(project.category)
  const isPaused = project.status === 'paused'
  const daysLeft = Math.max(0, Math.ceil((project.targetEndDate - Date.now()) / (1000 * 60 * 60 * 24)))

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-lg border border-border bg-card mx-4 mt-4 overflow-hidden"
    >

      <div className="relative p-5">
        {/* Back button + status */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1 h-8"
          >
            <ArrowLeft size={15} />
            Projects
          </Button>
          <div
            className={cn(
              'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium',
              statusConfig.className
            )}
          >
            {statusConfig.label}
          </div>
        </div>

        {/* Title & pitch */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-foreground leading-tight mb-1.5">
            {project.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.pitch}
          </p>
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={cn('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium', categoryClass)}>
            {project.category}
          </span>
          <span className={cn('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium', difficultyClass)}>
            {DIFFICULTY_LABELS[project.difficulty]}
          </span>
          {project.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag size={9} className="mr-1 opacity-60" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Progress section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Overall Progress</span>
            <span className="text-2xl font-black tabular-nums" style={{ color: 'hsl(73 96% 46%)' }}>{progress}%</span>
          </div>
          <div className="stat-bar-track h-2.5">
            <div className="stat-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{project.completedTasks} of {project.totalTasks} tasks done</span>
            <span>{project.currentPhase}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-primary" />
            <span className="text-primary font-semibold">{project.xpEarned} XP</span>
            <span>earned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Started {formatTimestamp(project.startedAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isPaused ? 'default' : 'outline'}
            size="sm"
            onClick={onTogglePause}
            className={cn('gap-1.5', isPaused && 'bg-emerald-500/90 hover:bg-emerald-500 text-white border-0')}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            variant="quest"
            size="sm"
            onClick={onExport}
            className="gap-1.5"
          >
            <Download size={13} />
            Export Bundle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onArchive}
            className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Archive size={13} />
            Archive
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
