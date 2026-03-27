import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTaskStore } from '@/stores/task-store'
import { useProjectStore } from '@/stores/project-store'
import { useUIStore } from '@/stores/ui-store'
import { todayStr, addDays, formatDateLabel } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { WeekStrip } from './components/week-strip'
import { DayColumn } from './components/day-column'
import { ProjectLegend } from './components/project-legend'
import type { DaySchedule } from '@/lib/types'

const PAST_DAYS = 7
const FUTURE_DAYS = 7
const TOTAL_DAYS = PAST_DAYS + FUTURE_DAYS + 1 // 15 total

export default function SchedulePage() {
  const { tasks, loadTasks, completeTask, skipTask, rescheduleTask, getDaySchedule } = useTaskStore()
  const { projects, loadProjects } = useProjectStore()
  const { addToast } = useUIStore()

  const today = todayStr()
  const [selectedDate, setSelectedDate] = useState(today)

  const isLoading = tasks.length === 0 && projects.length === 0

  useEffect(() => {
    loadTasks()
    loadProjects()
  }, [loadTasks, loadProjects])

  // Build the 15-day range
  const daySchedules = useMemo<DaySchedule[]>(() => {
    return Array.from({ length: TOTAL_DAYS }, (_, i) => {
      const date = addDays(today, i - PAST_DAYS)
      return getDaySchedule(date)
    })
  }, [today, getDaySchedule, tasks]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedSchedule = useMemo(
    () => daySchedules.find((d) => d.date === selectedDate) ?? getDaySchedule(selectedDate),
    [daySchedules, selectedDate, getDaySchedule],
  )

  // Navigate prev/next day
  function goToPrev() {
    setSelectedDate((d) => addDays(d, -1))
  }
  function goToNext() {
    setSelectedDate((d) => addDays(d, 1))
  }

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

  async function handleReschedule(id: string, newDate: string) {
    await rescheduleTask(id, newDate)
    addToast({
      title: 'Task rescheduled',
      description: `Moved to ${formatDateLabel(newDate)}`,
      variant: 'default',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex gap-2 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-20 rounded-xl flex-shrink-0" />
          ))}
        </div>
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
    <div className="flex flex-col min-h-screen">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 px-4 pt-5 pb-3"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 border border-primary/25">
          <CalendarDays size={18} className="text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-none">Schedule</h1>
          <p className="text-xs text-muted-foreground mt-0.5">2-week timeline</p>
        </div>

        {/* Today shortcut */}
        {selectedDate !== today && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(today)}
            className="ml-auto text-xs h-7 px-2.5"
          >
            Today
          </Button>
        )}
      </motion.div>

      {/* Week strip */}
      <WeekStrip
        days={daySchedules}
        projects={projects}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Project legend */}
      {projects.length > 0 && <ProjectLegend projects={projects} />}

      {/* Day navigation bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border/60">
        <Button variant="ghost" size="icon-sm" onClick={goToPrev} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} />
        </Button>
        <span className="flex-1 text-center text-sm font-semibold text-foreground">
          {formatDateLabel(selectedDate)}
          {selectedDate === today && (
            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/20">
              Today
            </span>
          )}
        </span>
        <Button variant="ghost" size="icon-sm" onClick={goToNext} className="text-muted-foreground hover:text-foreground">
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Selected day detail */}
      <ScrollArea className="flex-1 h-[calc(100vh-26rem)]">
        <div className="pt-3 pb-4">
          <DayColumn
            schedule={selectedSchedule}
            projects={projects}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onReschedule={handleReschedule}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
