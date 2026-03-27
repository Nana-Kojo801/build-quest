import { motion } from 'framer-motion'
import { Sparkles, BookOpen, Layers } from 'lucide-react'

interface QuickActionsProps {
  onGenerate: () => void
  onQuestLog: () => void
  onBrowseIdeas: () => void
  noPadding?: boolean
}

function ActionButton({
  icon,
  label,
  description,
  onClick,
  primary,
  delay,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  primary?: boolean
  delay: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-3 w-full rounded-lg border p-3 text-left
                  transition-all duration-200 ${
                    primary
                      ? 'border-primary/30 bg-primary/8 hover:border-primary/50 hover:bg-primary/12'
                      : 'border-border bg-card hover:border-border/80'
                  }`}
    >
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
          primary ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
      </div>
    </motion.button>
  )
}

export function QuickActions({ onGenerate, onQuestLog, onBrowseIdeas, noPadding }: QuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className={noPadding ? '' : 'px-4'}
    >
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
        Quick Actions
      </h2>
      <div className="flex flex-col gap-2">
        <ActionButton
          icon={<Sparkles size={15} />}
          label="Generate New Ideas"
          description="AI generates fresh project concepts for you"
          onClick={onGenerate}
          primary
          delay={0.28}
        />
        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            icon={<Layers size={14} />}
            label="Quest Log"
            description="View active projects"
            onClick={onQuestLog}
            delay={0.32}
          />
          <ActionButton
            icon={<BookOpen size={14} />}
            label="Browse Ideas"
            description="Explore saved ideas"
            onClick={onBrowseIdeas}
            delay={0.36}
          />
        </div>
      </div>
    </motion.div>
  )
}
