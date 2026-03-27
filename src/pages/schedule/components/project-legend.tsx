import { cn, truncate } from '@/lib/utils'
import type { ActiveProject } from '@/lib/types'

const PROJECT_COLORS: Record<number, { dot: string; text: string; bg: string; border: string }> = {
  0: { dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/25' },
  1: { dot: 'bg-sky-500', text: 'text-sky-300', bg: 'bg-sky-500/10', border: 'border-sky-500/25' },
  2: { dot: 'bg-emerald-500', text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  3: { dot: 'bg-amber-500', text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
  4: { dot: 'bg-rose-500', text: 'text-rose-300', bg: 'bg-rose-500/10', border: 'border-rose-500/25' },
  5: { dot: 'bg-cyan-500', text: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-500/25' },
  6: { dot: 'bg-orange-500', text: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/25' },
  7: { dot: 'bg-pink-500', text: 'text-pink-300', bg: 'bg-pink-500/10', border: 'border-pink-500/25' },
}

export function getProjectColors(idx: number) {
  return PROJECT_COLORS[idx % Object.keys(PROJECT_COLORS).length]
}

interface ProjectLegendProps {
  projects: ActiveProject[]
}

export function ProjectLegend({ projects }: ProjectLegendProps) {
  if (projects.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {projects.map((project, idx) => {
        const colors = getProjectColors(idx)
        return (
          <div
            key={project.id}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1',
              colors.bg,
              colors.border,
            )}
          >
            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', colors.dot)} />
            <span className={cn('text-xs font-medium', colors.text)}>
              {truncate(project.title, 22)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
