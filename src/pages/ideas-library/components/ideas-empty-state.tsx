import { motion } from 'framer-motion'
import { Lightbulb, Sparkles, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface IdeasEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function IdeasEmptyState({ hasFilters, onClearFilters }: IdeasEmptyStateProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      {hasFilters ? (
        <>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/60 border border-border/60">
            <Search className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1.5">
            No ideas match your filters
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-5">
            Try adjusting your search or filter settings to find what you're looking for.
          </p>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear all filters
          </Button>
        </>
      ) : (
        <>
          {/* Decorative glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full scale-150" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10 border border-primary/25">
              <Lightbulb className="h-10 w-10 text-primary" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-primary animate-pulse" />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            Your Quest Board is Empty
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
            Generate your first project idea and watch your quest log come alive. Every great build starts with a spark.
          </p>

          <Button
            variant="quest"
            size="lg"
            onClick={() => navigate('/generate')}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Generate Ideas
          </Button>
        </>
      )}
    </motion.div>
  )
}
