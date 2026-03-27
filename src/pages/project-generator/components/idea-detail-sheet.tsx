import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Bookmark,
  BookmarkCheck,
  Play,
  RefreshCw,
  Clock,
  Layers,
  Tag,
  Lightbulb,
  Cpu,
  Star,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, getCategoryColor } from '@/lib/utils'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '@/lib/types'
import type { ProjectIdea } from '@/lib/types'

interface IdeaDetailSheetProps {
  idea: ProjectIdea | null
  isSaved: boolean
  isSaving?: boolean
  isStarting: boolean
  total?: number
  currentIndex?: number
  onClose: () => void
  onSave: () => void
  onStart: () => void
  onDismiss?: () => void
  onPrev?: () => void
  onNext?: () => void
  onRegenerate: () => void
}

export function IdeaDetailSheet({
  idea,
  isSaved,
  isSaving,
  isStarting,
  total,
  currentIndex,
  onClose,
  onSave,
  onStart,
  onDismiss,
  onPrev,
  onNext,
  onRegenerate,
}: IdeaDetailSheetProps) {
  const hasNav = total !== undefined && total > 1 && currentIndex !== undefined

  return (
    <AnimatePresence>
      {idea && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-3xl max-h-[92vh] flex flex-col shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Top bar: navigation + close */}
            <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0">
              {hasNav ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-muted-foreground tabular-nums px-1">
                    {currentIndex + 1} / {total}
                  </span>
                  <button
                    onClick={onNext}
                    disabled={currentIndex === total - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div />
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              {/* Header */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Badge
                    className={cn(
                      'text-xs px-2.5 py-0.5 border',
                      DIFFICULTY_COLORS[idea.difficulty]
                    )}
                  >
                    {DIFFICULTY_LABELS[idea.difficulty]}
                  </Badge>
                  <Badge
                    className={cn(
                      'text-xs px-2.5 py-0.5 border',
                      getCategoryColor(idea.category)
                    )}
                  >
                    {idea.category}
                  </Badge>
                </div>

                <h2 className="text-xl font-bold text-foreground leading-snug mb-2">
                  {idea.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {idea.pitch}
                </p>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/40 border border-border/50 mb-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} className="text-primary" />
                  <span className="font-medium text-foreground">{idea.estimatedDays} days</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} className="text-muted-foreground" />
                  <span>{idea.estimatedHoursPerDay}h/day</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Layers size={12} className="text-muted-foreground" />
                  <span>{idea.pages.length} pages</span>
                </div>
              </div>

              {/* Why build */}
              <Section icon={<Lightbulb size={14} className="text-amber-400" />} title="Why Build This">
                <p className="text-sm text-muted-foreground leading-relaxed">{idea.whyBuild}</p>
              </Section>

              {/* Pages */}
              <Section icon={<Layers size={14} className="text-violet-400" />} title="Pages">
                <div className="flex flex-wrap gap-1.5">
                  {idea.pages.map((page) => (
                    <span
                      key={page}
                      className="text-xs bg-secondary text-foreground rounded-lg px-2.5 py-1 border border-border/60"
                    >
                      {page}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Features */}
              <Section icon={<CheckSquare size={14} className="text-sky-400" />} title="Features">
                <ul className="space-y-1.5">
                  {idea.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Tech direction */}
              <Section icon={<Cpu size={14} className="text-emerald-400" />} title="Tech Direction">
                <p className="text-sm text-muted-foreground leading-relaxed">{idea.techDirection}</p>
              </Section>

              {/* Tags */}
              <Section icon={<Tag size={14} className="text-muted-foreground" />} title="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {idea.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[11px]">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </Section>

              {/* XP reward preview */}
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <Star size={14} className="text-amber-400 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Starting this project will generate a full task schedule and earn you XP as you complete tasks.
                </p>
              </div>
            </div>

            {/* Action buttons — sticky footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-border/50 bg-card">
              <div className="flex items-center gap-2">
                {onDismiss ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onDismiss}
                    className="flex-shrink-0 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    title="Dismiss idea"
                  >
                    <Trash2 size={15} />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onRegenerate}
                    className="flex-shrink-0"
                    title="Regenerate ideas"
                  >
                    <RefreshCw size={15} />
                  </Button>
                )}

                <Button
                  variant={isSaved ? 'secondary' : 'xp'}
                  size="default"
                  onClick={onSave}
                  disabled={isSaved || isSaving}
                  className="flex-1 gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving…
                    </>
                  ) : isSaved ? (
                    <>
                      <BookmarkCheck size={15} />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark size={15} />
                      Save
                    </>
                  )}
                </Button>

                <Button
                  variant="quest"
                  size="default"
                  onClick={onStart}
                  disabled={isStarting}
                  className="flex-1 gap-2"
                >
                  {isStarting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw size={14} />
                      </motion.span>
                      Starting…
                    </>
                  ) : (
                    <>
                      <Play size={14} className="fill-current" />
                      Start Project
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}
