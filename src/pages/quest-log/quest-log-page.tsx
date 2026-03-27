import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Scroll } from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { useProjectStore } from '@/stores/project-store'
import { useUIStore } from '@/stores/ui-store'
import { todayStr, addDays } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestLogHeader } from './components/quest-log-header'
import { OverdueSection } from './components/overdue-section'
import { DaySection } from './components/day-section'

const UPCOMING_DAYS = 7

export default function QuestLogPage() {
  const {
    tasks,
    loadTasks,
    completeTask,
    uncompleteTask,
    skipTask,
    rescheduleOverdue,
    getTodayTasks,
    getOverdueTasks,
    getDaySchedule,
  } = useTaskStore()

  const { projects, loadProjects, progress } = useProjectStore()
  const { addToast } = useUIStore()

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    Promise.all([loadTasks(), loadProjects()]).finally(() => setIsLoaded(true))
  }, [loadTasks, loadProjects])

  const isLoading = !isLoaded

  const today = todayStr()
  const todayTasks = getTodayTasks()
  const overdueTasks = getOverdueTasks()
  const streak = progress?.streak ?? 0

  // Upcoming: next 7 days (excluding today)
  const upcomingDays = useMemo(() => {
    return Array.from({ length: UPCOMING_DAYS }, (_, i) => {
      const date = addDays(today, i + 1)
      return getDaySchedule(date)
    }).filter((d) => d.tasks.length > 0)
  }, [today, getDaySchedule, tasks]) // eslint-disable-line react-hooks/exhaustive-deps

  // All tasks — group by date
  const allByDate = useMemo(() => {
    const dateMap: Record<string, typeof tasks> = {}
    for (const task of tasks) {
      if (!dateMap[task.scheduledDate]) dateMap[task.scheduledDate] = []
      dateMap[task.scheduledDate].push(task)
    }
    return Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b))
  }, [tasks])

  async function handleComplete(id: string) {
    const task = tasks.find((t) => t.id === id)
    await completeTask(id)
    if (task) {
      addToast({
        title: 'Quest complete!',
        description: task.title,
        variant: 'xp',
        xpAmount: task.xpReward,
      })
    }
  }

  async function handleSkip(id: string) {
    await skipTask(id)
    addToast({ title: 'Task skipped', variant: 'default' })
  }

  async function handleCarryAll() {
    await rescheduleOverdue()
    addToast({
      title: 'Tasks rescheduled',
      description: 'Overdue tasks moved to tomorrow.',
      variant: 'default',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <QuestLogHeader todayTasks={todayTasks} streak={streak} todayStr={today} />

      {/* Tabs — sticky bar, content flows naturally */}
      <div className="px-4 mt-4">
        <Tabs defaultValue="today" className="w-full">
          <div className="sticky top-0 z-10 bg-background pb-2">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="today" className="text-xs">
                Today
                {overdueTasks.length > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500/25 text-rose-400 text-[9px] font-bold">
                    {overdueTasks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── TODAY TAB ───────────────────────────────────── */}
          <TabsContent value="today">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 py-2"
            >
              {/* Overdue */}
              <OverdueSection
                tasks={overdueTasks}
                projects={projects}
                onComplete={handleComplete}
                onSkip={handleSkip}
                onCarryAll={handleCarryAll}
              />

              {/* Separator if both overdue and today have tasks */}
              {overdueTasks.length > 0 && todayTasks.length > 0 && (
                <div className="border-t border-border/60" />
              )}

              {/* Today's tasks */}
              <DaySection
                date={today}
                tasks={todayTasks}
                projects={projects}
                isToday
                onComplete={handleComplete}
                onSkip={handleSkip}
                onUncomplete={uncompleteTask}
              />
            </motion.div>
          </TabsContent>

          {/* ── UPCOMING TAB ────────────────────────────────── */}
          <TabsContent value="upcoming">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="py-2 space-y-5"
            >
              {upcomingDays.length === 0 ? (
                <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/40 py-10">
                  <Scroll size={30} className="text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">No upcoming tasks</p>
                  <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
                    Generate a new project or add tasks to fill your queue.
                  </p>
                </div>
              ) : (
                upcomingDays.map(({ date, tasks: dayTasks }) => (
                  <DaySection
                    key={date}
                    date={date}
                    tasks={dayTasks}
                    projects={projects}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                  />
                ))
              )}
            </motion.div>
          </TabsContent>

          {/* ── ALL TAB ─────────────────────────────────────── */}
          <TabsContent value="all">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="py-2 space-y-5"
            >
              {allByDate.length === 0 ? (
                <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/40 py-10">
                  <Scroll size={30} className="text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
                  <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
                    Start a project to generate your build schedule.
                  </p>
                </div>
              ) : (
                allByDate.map(([date, dateTasks]) => (
                  <DaySection
                    key={date}
                    date={date}
                    tasks={dateTasks}
                    projects={projects}
                    isToday={date === today}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                    onUncomplete={uncompleteTask}
                  />
                ))
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
