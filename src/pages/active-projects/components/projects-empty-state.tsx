import { motion } from 'framer-motion'
import { Swords, Sparkles, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface ProjectsEmptyStateProps {
  variant?: 'active' | 'paused' | 'completed' | 'all'
}

const COPY = {
  active: {
    icon: Swords,
    iconBg: 'bg-primary/15 border-primary/30',
    iconColor: 'text-primary',
    glowColor: 'bg-primary/20',
    title: 'No Active Quests',
    body: 'You have no active projects right now. Start a new quest from your Ideas Library to begin building.',
    cta: true,
  },
  paused: {
    icon: Swords,
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    iconColor: 'text-amber-400',
    glowColor: 'bg-amber-500/10',
    title: 'Nothing Paused',
    body: 'No projects are currently paused. Active quests you pause will appear here.',
    cta: false,
  },
  completed: {
    icon: Trophy,
    iconBg: 'bg-violet-500/10 border-violet-500/30',
    iconColor: 'text-violet-400',
    glowColor: 'bg-violet-500/10',
    title: 'No Completed Quests Yet',
    body: "Complete your first project to start building your trophy case. Every build counts.",
    cta: false,
  },
  all: {
    icon: Swords,
    iconBg: 'bg-primary/15 border-primary/30',
    iconColor: 'text-primary',
    glowColor: 'bg-primary/20',
    title: 'No Projects Yet',
    body: 'Generate an idea and start your first quest. The command center is waiting.',
    cta: true,
  },
}

export function ProjectsEmptyState({ variant = 'all' }: ProjectsEmptyStateProps) {
  const navigate = useNavigate()
  const config = COPY[variant]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-14 px-6 text-center"
    >
      <div className="relative mb-5">
        <div className={`absolute inset-0 blur-2xl ${config.glowColor} rounded-full scale-150`} />
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border ${config.iconBg}`}
        >
          <Icon className={`h-8 w-8 ${config.iconColor}`} />
        </div>
      </div>

      <h3 className="text-base font-bold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">{config.body}</p>

      {config.cta && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/ideas')}>
            Browse Ideas
          </Button>
          <Button variant="quest" size="sm" onClick={() => navigate('/generate')}>
            <Sparkles className="h-3.5 w-3.5" />
            Generate Ideas
          </Button>
        </div>
      )}
    </motion.div>
  )
}
