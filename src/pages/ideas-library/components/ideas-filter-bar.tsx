import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type IdeaStatusFilter = 'all' | 'idea' | 'saved' | 'active' | 'archived'

const STATUS_OPTIONS: { value: IdeaStatusFilter; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'idea', label: 'Ideas' },
  { value: 'saved', label: 'Saved' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]

const CATEGORY_OPTIONS = [
  'All Categories',
  'Web App',
  'Mobile App',
  'CLI Tool',
  'API / Backend',
  'Dev Tool',
  'Game',
  'AI / ML',
  'Browser Extension',
  'Desktop App',
]

interface IdeasFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: IdeaStatusFilter
  onStatusFilterChange: (value: IdeaStatusFilter) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  resultCount: number
  className?: string
}

export function IdeasFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  resultCount,
  className,
}: IdeasFilterBarProps) {
  const hasActiveFilters =
    search.length > 0 || statusFilter !== 'all' || categoryFilter !== 'All Categories'

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search ideas by title, tag, or pitch…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/60 focus:border-primary/50"
          />
        </div>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusFilterChange(v as IdeaStatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border/60">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category filter */}
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full sm:w-44 bg-secondary/50 border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Result summary + clear */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {resultCount === 0 ? 'No ideas found' : `${resultCount} idea${resultCount !== 1 ? 's' : ''} found`}
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              onSearchChange('')
              onStatusFilterChange('all')
              onCategoryFilterChange('All Categories')
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
