import { motion } from 'framer-motion'
import { Download, Loader2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, getCategoryColor } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types'
import type { ProjectIdea } from '@/lib/types'

interface BundlePreviewHeaderProps {
  idea: ProjectIdea
  isDownloading: boolean
  onDownload: () => void
}

export function BundlePreviewHeader({ idea, isDownloading, onDownload }: BundlePreviewHeaderProps) {
  const categoryClass = getCategoryColor(idea.category)
  const difficultyClass = DIFFICULTY_COLORS[idea.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-lg border border-border bg-card mx-4 mt-4 overflow-hidden"
    >

      <div className="relative p-5">
        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25 text-[11px] font-semibold text-primary uppercase tracking-wider">
            Claude Bundle
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-foreground leading-tight mb-1.5">
          {idea.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {idea.pitch}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={cn('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium', categoryClass)}>
            {idea.category}
          </span>
          <span className={cn('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium', difficultyClass)}>
            {DIFFICULTY_LABELS[idea.difficulty]}
          </span>
          {idea.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs gap-1">
              <Tag size={9} className="opacity-50" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Download button */}
        <Button
          variant="quest"
          size="lg"
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full gap-2 text-base"
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Packaging bundle…
            </>
          ) : (
            <>
              <Download size={16} />
              Download Claude Bundle
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Downloads a <code className="font-mono text-primary/80">.zip</code> with all Claude Code context files
        </p>
      </div>
    </motion.div>
  )
}
