import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  MoreHorizontal,
  Pause,
  Play,
  Archive,
  Flame,
  CalendarDays,
  CheckSquare,
  ChevronUp,
  ChevronDown,
  Zap,
  Flag,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ProjectStatusBadge } from './project-status-badge'
import { cn, calcProgress, getCategoryColor, formatTimestamp, truncate } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types'
import type { ActiveProject } from '@/lib/types'
import { differenceInDays } from 'date-fns'

interface ProjectCardProps {
  project: ActiveProject
  onPauseResume: (project: ActiveProject) => void
  onArchive: (project: ActiveProject) => void
  onPriorityUp: (project: ActiveProject) => void
  onPriorityDown: (project: ActiveProject) => void
  isFirst: boolean
  isLast: boolean
}

export function ProjectCard({
  project,
  onPauseResume,
  onArchive,
  onPriorityUp,
  onPriorityDown,
  isFirst,
  isLast,
}: ProjectCardProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const progress = calcProgress(project.completedTasks, project.totalTasks)
  const daysRemaining = differenceInDays(new Date(project.targetEndDate), new Date())
  const isOverdue = daysRemaining < 0
  const isActive = project.status === 'active'
  const isPaused = project.status === 'paused'
  const isCompleted = project.status === 'completed'
  const categoryStyle = getCategoryColor(project.category)
  const difficultyStyle = DIFFICULTY_COLORS[project.difficulty]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'group relative border-border/60 bg-card transition-all duration-200',
          'hover:border-border/90',
          isPaused && 'opacity-70',
          isCompleted && 'opacity-80',
        )}
      >
        {/* Priority indicator stripe */}
        {isActive && (
          <div
            className={cn(
              'absolute left-0 top-4 bottom-4 w-0.5 rounded-full',
              project.priority === 1
                ? 'bg-primary'
                : project.priority === 2
                ? 'bg-primary/60'
                : 'bg-border',
            )}
          />
        )}

        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <button
                  className="text-left group/title min-w-0"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <h3 className="font-semibold text-sm leading-snug text-foreground group-hover/title:text-primary transition-colors truncate">
                    {project.title}
                  </h3>
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Priority arrows — only for active projects */}
                  {isActive && (
                    <div className="hidden sm:flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-5 w-5"
                        disabled={isFirst}
                        onClick={() => onPriorityUp(project)}
                        title="Increase priority"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-5 w-5"
                        disabled={isLast}
                        onClick={() => onPriorityDown(project)}
                        title="Decrease priority"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}`)}>
                        <ExternalLink className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        View Detail
                      </DropdownMenuItem>
                      {(isActive || isPaused) && (
                        <DropdownMenuItem
                          onClick={() => onPauseResume(project)}
                          className={
                            isActive
                              ? 'text-amber-400 focus:text-amber-400'
                              : 'text-emerald-400 focus:text-emerald-400'
                          }
                        >
                          {isActive ? (
                            <Pause className="h-3.5 w-3.5 mr-2" />
                          ) : (
                            <Play className="h-3.5 w-3.5 mr-2" />
                          )}
                          {isActive ? 'Pause Quest' : 'Resume Quest'}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onArchive(project)}
                        className="text-muted-foreground focus:text-foreground"
                      >
                        <Archive className="h-3.5 w-3.5 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Pitch */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
                {truncate(project.pitch, 100)}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <ProjectStatusBadge status={project.status} />
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-xs font-medium',
                    difficultyStyle,
                  )}
                >
                  <Zap className="h-2.5 w-2.5 mr-1" />
                  {DIFFICULTY_LABELS[project.difficulty]}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                    categoryStyle,
                  )}
                >
                  {project.category}
                </span>
                {project.priority === 1 && isActive && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Flag className="h-2.5 w-2.5" />
                    Priority
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                {project.completedTasks} / {project.totalTasks} tasks
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {progress}%
              </span>
            </div>
            <div className="stat-bar-track">
              <div
                className={cn('stat-bar-fill', isPaused && 'bg-muted-foreground')}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            {/* Current phase */}
            <div className="flex items-center gap-1.5 min-w-0">
              <Flame className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">{project.currentPhase}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* XP earned */}
              <span className="inline-flex items-center gap-1 text-primary/80">
                <Zap className="h-3 w-3" />
                {project.xpEarned} XP
              </span>

              {/* Target / days remaining */}
              {!isCompleted && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1',
                    isOverdue && 'text-destructive',
                    !isOverdue && daysRemaining <= 3 && 'text-amber-400',
                  )}
                >
                  <CalendarDays className="h-3 w-3" />
                  {isOverdue
                    ? `${Math.abs(daysRemaining)}d overdue`
                    : daysRemaining === 0
                    ? 'Due today'
                    : `${daysRemaining}d left`}
                </span>
              )}
              {isCompleted && project.actualEndDate && (
                <span className="text-violet-400/80">
                  Completed {formatTimestamp(project.actualEndDate)}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-border/40">
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground/60 bg-secondary/50 rounded px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 5 && (
                <span className="text-xs text-muted-foreground/40">+{project.tags.length - 5}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
