import { motion } from 'framer-motion'
import { CheckCircle2, ListTodo, Clock, CalendarClock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn, formatDuration } from '@/lib/utils'
import type { ActiveProject, Task } from '@/lib/types'

interface ProjectStatsProps {
  project: ActiveProject
  tasks: Task[]
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  iconColor: string
  delay: number
}

function StatCard({ icon, label, value, sub, iconColor, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-4 flex flex-col gap-2 quest-card">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconColor)}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
          <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        </div>
      </Card>
    </motion.div>
  )
}

export function ProjectStats({ project, tasks }: ProjectStatsProps) {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const totalTasks = tasks.length
  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)
  const completedMinutes = tasks
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.estimatedMinutes, 0)

  const daysLeft = Math.max(0, Math.ceil((project.targetEndDate - Date.now()) / (1000 * 60 * 60 * 24)))
  const daysLeftLabel = daysLeft === 0 ? 'Due today' : daysLeft === 1 ? '1 day' : `${daysLeft} days`

  return (
    <div className="px-4">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Stats
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<CheckCircle2 size={16} className="text-emerald-400" />}
          iconColor="bg-emerald-500/10"
          label="Tasks completed"
          value={completedTasks}
          sub={`of ${totalTasks} total`}
          delay={0.05}
        />
        <StatCard
          icon={<ListTodo size={16} className="text-primary" />}
          iconColor="bg-primary/10"
          label="Tasks remaining"
          value={totalTasks - completedTasks}
          sub={`${project.phases.length} phase${project.phases.length !== 1 ? 's' : ''}`}
          delay={0.1}
        />
        <StatCard
          icon={<Clock size={16} className="text-sky-400" />}
          iconColor="bg-sky-500/10"
          label="Time invested"
          value={formatDuration(completedMinutes)}
          sub={`of ${formatDuration(totalMinutes)} est.`}
          delay={0.15}
        />
        <StatCard
          icon={<CalendarClock size={16} className="text-amber-400" />}
          iconColor="bg-amber-500/10"
          label="Days remaining"
          value={daysLeftLabel}
          sub={daysLeft > 0 ? 'until deadline' : undefined}
          delay={0.2}
        />
      </div>
    </div>
  )
}
