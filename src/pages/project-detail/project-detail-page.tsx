import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectStore } from '@/stores/project-store'
import { useTaskStore } from '@/stores/task-store'
import { useUIStore } from '@/stores/ui-store'
import { ProjectHero } from './components/project-hero'
import { ProjectStats } from './components/project-stats'
import { PhaseTimeline } from './components/phase-timeline'
import { TaskList } from './components/task-list'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { projects, loadProjects, updateProject } = useProjectStore()
  const { tasks, loadTasksForProject, generateTasksForProject, completeTask, skipTask, uncompleteTask } = useTaskStore()
  const { addToast } = useUIStore()

  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false)

  const project = projects.find((p) => p.id === id)
  const projectTasks = id ? tasks.filter((t) => t.projectId === id) : []

  // Load data on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      if (projects.length === 0) {
        await loadProjects()
      }
      setIsLoading(false)
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load + generate tasks once project is known
  useEffect(() => {
    if (!project) return

    const initTasks = async () => {
      setIsGeneratingTasks(true)
      await loadTasksForProject(project.id)
      await generateTasksForProject(project.id, project.phases)
      setIsGeneratingTasks(false)
    }
    initTasks()
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTogglePause = async () => {
    if (!project) return
    const newStatus = project.status === 'paused' ? 'active' : 'paused'
    await updateProject(project.id, { status: newStatus })
    addToast({
      variant: 'default',
      title: newStatus === 'paused' ? 'Project paused' : 'Project resumed',
      description: newStatus === 'paused'
        ? 'You can resume it anytime.'
        : 'Back on track — keep building!',
    })
  }

  const handleArchive = async () => {
    if (!project) return
    await updateProject(project.id, { status: 'archived' })
    addToast({
      variant: 'default',
      title: 'Project archived',
      description: 'You can find it in your archive later.',
    })
    navigate('/projects')
  }

  const handleExport = () => {
    if (!project) return
    navigate(`/export/${project.ideaId}`)
  }

  const handleComplete = async (taskId: string) => {
    await completeTask(taskId)
    const task = projectTasks.find((t) => t.id === taskId)
    if (task) {
      addToast({
        variant: 'xp',
        title: 'Task complete!',
        description: `+${task.xpReward} XP earned`,
        xpAmount: task.xpReward,
      })
    }
  }

  const handleSkip = async (taskId: string) => {
    await skipTask(taskId)
    addToast({
      variant: 'default',
      title: 'Task skipped',
      description: 'Moved on — keep the momentum.',
    })
  }

  const handleUncomplete = async (taskId: string) => {
    await uncompleteTask(taskId)
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 pb-8">
        <div className="mx-4 mt-4 rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-20" />
          </div>
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-3 w-full mt-2" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // 404 state
  if (!isLoading && !project) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertTriangle size={24} className="text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Project not found</h2>
          <p className="text-sm text-muted-foreground">
            This project doesn't exist or may have been deleted.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/projects')}
          className="gap-2"
        >
          <ArrowLeft size={15} />
          Back to Projects
        </Button>
      </motion.div>
    )
  }

  if (!project) return null

  return (
    <div className="space-y-6 pb-8">
      <ProjectHero
        project={project}
        onBack={() => navigate('/projects')}
        onTogglePause={handleTogglePause}
        onArchive={handleArchive}
        onExport={handleExport}
      />

      <ProjectStats project={project} tasks={projectTasks} />

      <div className="mx-4 h-px bg-border" />

      <PhaseTimeline phases={project.phases} tasks={projectTasks} />

      <div className="mx-4 h-px bg-border" />

      <TaskList
        phases={project.phases}
        tasks={projectTasks}
        isLoading={isGeneratingTasks}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onUncomplete={handleUncomplete}
      />
    </div>
  )
}
