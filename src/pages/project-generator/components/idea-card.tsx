import { motion } from 'framer-motion'
import { Clock, Layers, Tag, Check, X, BookmarkCheck, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn, getCategoryColor } from '@/lib/utils'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '@/lib/types'
import type { ProjectIdea } from '@/lib/types'

interface IdeaCardProps {
  idea: ProjectIdea
  onClick: () => void
  onAccept: () => void
  onDeny: () => void
  isSaved: boolean
  isSaving?: boolean
  index: number
}

export function IdeaCard({ idea, onClick, onAccept, onDeny, isSaved, isSaving, index }: IdeaCardProps) {
  const diffColor = DIFFICULTY_COLORS[idea.difficulty]
  const categoryStyle = getCategoryColor(idea.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="quest-card w-full text-left"
    >
      {/* Clickable content area */}
      <button
        onClick={onClick}
        className="w-full text-left p-4 pb-3 hover:bg-white/[0.02] transition-colors duration-150 rounded-t-2xl"
      >
        {/* Top row: title + saved indicator */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-foreground leading-snug flex-1">
            {idea.title}
          </h3>
          {isSaved && (
            <BookmarkCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          )}
        </div>

        {/* Pitch */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {idea.pitch}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge className={cn('text-xs px-2 py-0.5 border', diffColor)}>
            {DIFFICULTY_LABELS[idea.difficulty]}
          </Badge>
          <Badge className={cn('text-xs px-2 py-0.5 border', categoryStyle)}>
            {idea.category}
          </Badge>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Clock size={10} className="flex-shrink-0" />
            <span>{idea.estimatedDays}d est.</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers size={10} className="flex-shrink-0" />
            <span>{idea.pages.length} pages</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag size={10} className="flex-shrink-0" />
            <span className="truncate max-w-[120px]">
              {idea.tags.slice(0, 2).join(', ')}
              {idea.tags.length > 2 ? ` +${idea.tags.length - 2}` : ''}
            </span>
          </div>
        </div>
      </button>

      {/* Accept / Deny actions */}
      <div className="flex border-t border-border/40">
        <button
          onClick={(e) => { e.stopPropagation(); onDeny() }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-rose-400 hover:bg-rose-500/5 transition-colors duration-150 rounded-bl-2xl"
        >
          <X size={13} />
          Dismiss
        </button>
        <div className="w-px bg-border/40" />
        <button
          onClick={(e) => { e.stopPropagation(); onAccept() }}
          disabled={isSaved || isSaving}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors duration-150 rounded-br-2xl',
            isSaved
              ? 'text-emerald-400 cursor-default'
              : 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/5'
          )}
        >
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          {isSaving ? 'Saving…' : isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </motion.div>
  )
}
