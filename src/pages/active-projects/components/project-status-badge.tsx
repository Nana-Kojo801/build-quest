import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/types'

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string; dot: string }
> = {
  idea: {
    label: 'Idea',
    className: 'bg-secondary text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
  saved: {
    label: 'Saved',
    className: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    dot: 'bg-sky-400',
  },
  active: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400 animate-pulse',
  },
  paused: {
    label: 'Paused',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    dot: 'bg-violet-400',
  },
  archived: {
    label: 'Archived',
    className: 'bg-secondary text-muted-foreground/60 border-border/50',
    dot: 'bg-muted-foreground/40',
  },
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  className?: string
  showDot?: boolean
}

export function ProjectStatusBadge({
  status,
  className,
  showDot = true,
}: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dot)} />
      )}
      {config.label}
    </span>
  )
}
