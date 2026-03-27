import {
  Clock,
  Tag,
  Zap,
  Layers,
  Sparkles,
  Heart,
  Code2,
  Play,
  Bookmark,
  Archive,
  Trash2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, getCategoryColor } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types'
import type { ProjectIdea } from '@/lib/types'

interface IdeaDetailDialogProps {
  idea: ProjectIdea | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (idea: ProjectIdea) => void
  onStartProject: (idea: ProjectIdea) => void
  onArchive: (idea: ProjectIdea) => void
  onDelete: (idea: ProjectIdea) => void
}

export function IdeaDetailDialog({
  idea,
  open,
  onOpenChange,
  onSave,
  onStartProject,
  onArchive,
  onDelete,
}: IdeaDetailDialogProps) {
  if (!idea) return null

  const difficultyStyle = DIFFICULTY_COLORS[idea.difficulty]
  const categoryStyle = getCategoryColor(idea.category)
  const canStart = idea.status !== 'active' && idea.status !== 'completed'
  const canSave = idea.status !== 'active' && idea.status !== 'archived'
  const canArchive = idea.status !== 'archived'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {/* Status */}
            <span
              className={cn(
                'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                idea.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : idea.status === 'saved'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  : 'bg-secondary text-muted-foreground border-border',
              )}
            >
              {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
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
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Clock className="h-3 w-3" />
              {idea.estimatedDays} days
            </span>
          </div>

          <DialogTitle className="text-lg font-bold leading-snug">
            {idea.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
            {idea.pitch}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-4 py-1">
          {/* Why build */}
          <Section icon={<Heart className="h-4 w-4 text-rose-400" />} title="Why Build This">
            <p className="text-sm text-muted-foreground leading-relaxed">{idea.whyBuild}</p>
          </Section>

          {/* Tech direction */}
          <Section icon={<Code2 className="h-4 w-4 text-sky-400" />} title="Tech Direction">
            <p className="text-sm text-muted-foreground leading-relaxed">{idea.techDirection}</p>
          </Section>

          {/* Features */}
          {idea.features.length > 0 && (
            <Section icon={<Sparkles className="h-4 w-4 text-amber-400" />} title="Key Features">
              <ul className="space-y-1">
                {idea.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Pages */}
          {idea.pages.length > 0 && (
            <Section icon={<Layers className="h-4 w-4 text-violet-400" />} title="Pages / Screens">
              <div className="flex flex-wrap gap-1.5">
                {idea.pages.map((page) => (
                  <span
                    key={page}
                    className="rounded-md bg-secondary/70 border border-border/60 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {page}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Tags */}
          {idea.tags.length > 0 && (
            <Section icon={<Tag className="h-4 w-4 text-cyan-400" />} title="Tags">
              <div className="flex flex-wrap gap-1.5">
                {idea.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Section>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <div className="flex gap-2 flex-wrap">
            {canArchive && (
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                onClick={() => {
                  onArchive(idea)
                  onOpenChange(false)
                }}
              >
                <Archive className="h-3.5 w-3.5 mr-1.5" />
                Archive
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onDelete(idea)
                onOpenChange(false)
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
          <div className="flex gap-2 sm:ml-auto flex-wrap">
            {canSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onSave(idea)
                  onOpenChange(false)
                }}
              >
                <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                {idea.status === 'saved' ? 'Unsave' : 'Save'}
              </Button>
            )}
            {canStart && (
              <Button
                variant="quest"
                size="sm"
                onClick={() => {
                  onStartProject(idea)
                  onOpenChange(false)
                }}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Start Project
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      </div>
      {children}
    </div>
  )
}
