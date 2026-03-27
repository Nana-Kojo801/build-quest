import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/stores/project-store'
import { useTaskStore } from '@/stores/task-store'
import { useUIStore } from '@/stores/ui-store'
import { HeroBanner, DesktopStatsPanel } from './components/hero-banner'
import { StatsRow } from './components/stats-row'
import { TodayTasksPreview } from './components/today-tasks-preview'
import { ActiveProjectsPreview } from './components/active-projects-preview'
import { QuickActions } from './components/quick-actions'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function HubSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="lg:hidden flex flex-col gap-4 p-4 pt-4">
        <Skeleton className="h-36 w-full rounded-lg" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="flex-1 h-20 rounded-lg" />)}
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28 rounded" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden lg:grid grid-cols-[260px_1fr_240px] gap-5 p-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24 rounded" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-44 w-full rounded-lg" />
          <Skeleton className="h-4 w-32 rounded" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuestHubPage() {
  const navigate = useNavigate()

  const { projects, progress, settings, loadProjects, loadProgress, loadSettings, loadIdeas } =
    useProjectStore()
  const { tasks, loadTasks, completeTask, uncompleteTask, getTodayTasks } = useTaskStore()
  const { addToast } = useUIStore()

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const done = () => setIsLoaded(true)
    const timeout = setTimeout(done, 2000) // safety: never stay stuck
    Promise.all([loadIdeas(), loadProjects(), loadTasks(), loadProgress(), loadSettings()])
      .finally(() => { clearTimeout(timeout); done() })
    return () => clearTimeout(timeout)
  }, [loadIdeas, loadProjects, loadTasks, loadProgress, loadSettings])

  const isLoading = !isLoaded
  const activeProjects = projects.filter((p) => p.status === 'active')
  const todayTasks = getTodayTasks()
  const completedToday = todayTasks.filter((t) => t.status === 'completed')

  const handleCompleteTask = async (id: string) => {
    await completeTask(id)
    const task = tasks.find((t) => t.id === id)
    addToast({
      title: 'Task complete!',
      description: `+${task?.xpReward ?? 50} XP earned`,
      variant: 'xp',
      xpAmount: task?.xpReward,
    })
  }

  if (isLoading) return <HubSkeleton />

  return (
    <>
      {/* ── MOBILE layout (< lg) ──────────────────────────────────── */}
      <div className="lg:hidden flex flex-col gap-4 pb-4 animate-slide-up">
        {/* Hero */}
        <HeroBanner progress={progress} />

        {/* Stats row */}
        <StatsRow
          activeProjectCount={activeProjects.length}
          todayTaskCount={todayTasks.length}
          completedTodayCount={completedToday.length}
          progress={progress}
        />

        {/* Divider */}
        <div className="mx-4 border-t border-border/40" />

        {/* Today's tasks */}
        <TodayTasksPreview
          tasks={todayTasks}
          onComplete={handleCompleteTask}
          onUncomplete={uncompleteTask}
          onViewAll={() => navigate('/quests')}
        />

        {/* Divider */}
        <div className="mx-4 border-t border-border/40" />

        {/* Active projects */}
        <ActiveProjectsPreview
          projects={activeProjects}
          onViewProject={(id) => navigate(`/projects/${id}`)}
          onViewAll={() => navigate('/projects')}
        />

        {/* Divider */}
        <div className="mx-4 border-t border-border/40" />

        {/* Quick actions */}
        <QuickActions
          onGenerate={() => navigate('/generate')}
          onQuestLog={() => navigate('/projects')}
          onBrowseIdeas={() => navigate('/ideas')}
        />

        <div className="h-2" />
      </div>

      {/* ── DESKTOP layout (≥ lg) — three columns ─────────────────── */}
      <div className="hidden lg:grid grid-cols-[260px_1fr_250px] gap-5
                      p-6 max-w-[1400px] mx-auto min-h-[calc(100vh-3.5rem)] animate-slide-up">

        {/* ── Left panel: active projects list ──────────────────── */}
        <aside className="flex flex-col gap-4">
          <ActiveProjectsPreview
            projects={activeProjects}
            onViewProject={(id) => navigate(`/projects/${id}`)}
            onViewAll={() => navigate('/projects')}
            panelMode
          />

          {/* Quick actions beneath projects */}
          <div className="border-t border-border/40 pt-4">
            <QuickActions
              onGenerate={() => navigate('/generate')}
              onQuestLog={() => navigate('/projects')}
              onBrowseIdeas={() => navigate('/ideas')}
              noPadding
            />
          </div>
        </aside>

        {/* ── Center column: hero + today's tasks ───────────────── */}
        <main className="flex flex-col gap-5 min-w-0">
          {/* Hero — shows greeting + level + XP + stat bars */}
          <HeroBanner progress={progress} />

          {/* Stats row */}
          <StatsRow
            activeProjectCount={activeProjects.length}
            todayTaskCount={todayTasks.length}
            completedTodayCount={completedToday.length}
            progress={progress}
          />

          {/* Today's tasks */}
          <TodayTasksPreview
            tasks={todayTasks}
            onComplete={handleCompleteTask}
            onUncomplete={uncompleteTask}
            onViewAll={() => navigate('/quests')}
            noPadding
          />
        </main>

        {/* ── Right panel: level/XP/stats (reference style) ─────── */}
        <aside>
          <DesktopStatsPanel
            progress={progress}
            activeProjectCount={activeProjects.length}
            todayTaskCount={todayTasks.length}
            completedTodayCount={completedToday.length}
          />
        </aside>
      </div>
    </>
  )
}
