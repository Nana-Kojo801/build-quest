import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MoreHorizontal,
  Eye,
  Bookmark,
  Play,
  Archive,
  Trash2,
  Clock,
  Tag,
  Zap,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn, truncate, getCategoryColor } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types'
import type { ProjectIdea } from '@/lib/types'

const STATUS_BADGE: Record<
  ProjectIdea['status'],
  { label: string; className: string }
> = {
  idea: { label: 'Idea', className: 'bg-secondary text-muted-foreground border-border' },
  saved: { label: 'Saved', className: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  paused: { label: 'Paused', className: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  completed: { label: 'Completed', className: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
  archived: { label: 'Archived', className: 'bg-secondary text-muted-foreground/60 border-border/50' },
}

interface IdeaListCardProps {
  idea: ProjectIdea
  onViewDetails: (idea: ProjectIdea) => void
  onSave: (idea: ProjectIdea) => void
  onStartProject: (idea: ProjectIdea) => void
  onArchive: (idea: ProjectIdea) => void
  onDelete: (idea: ProjectIdea) => void
}

export function IdeaListCard({
  idea,
  onViewDetails,
  onSave,
  onStartProject,
  onArchive,
  onDelete,
}: IdeaListCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const difficultyStyle = DIFFICULTY_COLORS[idea.difficulty]
  const categoryStyle = getCategoryColor(idea.category)
  const statusMeta = STATUS_BADGE[idea.status]
  const isArchived = idea.status === 'archived'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
    >
      <Card
        className={cn(
          'group relative border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-200',
          'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
          isArchived && 'opacity-60',
        )}
      >
        {/* Subtle left accent bar */}
        <div
          className={cn(
            'absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100',
            idea.status === 'active' && 'bg-emerald-400',
            idea.status === 'saved' && 'bg-sky-400',
            idea.status === 'idea' && 'bg-primary/60',
            idea.status === 'archived' && 'bg-border',
          )}
        />

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Main content */}
            <div className="min-w-0 flex-1">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <button
                  onClick={() => onViewDetails(idea)}
                  className="text-left group/title"
                >
                  <h3 className="font-semibold text-sm leading-snug text-foreground group-hover/title:text-primary transition-colors line-clamp-1">
                    {idea.title}
                  </h3>
                </button>

                {/* Actions menu */}
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => onViewDetails(idea)}>
                      <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      View Details
                    </DropdownMenuItem>
                    {idea.status !== 'active' && idea.status !== 'archived' && (
                      <DropdownMenuItem onClick={() => onSave(idea)}>
                        <Bookmark className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {idea.status === 'saved' ? 'Unsave' : 'Save'}
                      </DropdownMenuItem>
                    )}
                    {idea.status !== 'active' && idea.status !== 'completed' && (
                      <DropdownMenuItem
                        onClick={() => onStartProject(idea)}
                        className="text-emerald-400 focus:text-emerald-400"
                      >
                        <Play className="h-3.5 w-3.5 mr-2" />
                        Start Project
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {idea.status !== 'archived' && (
                      <DropdownMenuItem
                        onClick={() => onArchive(idea)}
                        className="text-amber-400 focus:text-amber-400"
                      >
                        <Archive className="h-3.5 w-3.5 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(idea)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Pitch */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
                {truncate(idea.pitch, 120)}
              </p>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Status */}
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                    statusMeta.className,
                  )}
                >
                  {statusMeta.label}
                </span>

                {/* Difficulty */}
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-xs font-medium',
                    difficultyStyle,
                  )}
                >
                  <Zap className="h-2.5 w-2.5 mr-1" />
                  {DIFFICULTY_LABELS[idea.difficulty]}
                </span>

                {/* Category */}
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                    categoryStyle,
                  )}
                >
                  {idea.category}
                </span>

                {/* Estimated days */}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {idea.estimatedDays}d
                </span>
              </div>

              {/* Tags */}
              {idea.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-2">
                  <Tag className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                  {idea.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground/70 bg-secondary/60 rounded px-1.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                  {idea.tags.length > 4 && (
                    <span className="text-xs text-muted-foreground/50">
                      +{idea.tags.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
