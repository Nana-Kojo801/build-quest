import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Swords,
  Sparkles,
  Pause,
  CheckCircle2,
  Archive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useProjectStore } from '@/stores/project-store'
import { useTaskStore } from '@/stores/task-store'
import { useUIStore } from '@/stores/ui-store'
import { calcProgress } from '@/lib/utils'
import type { ActiveProject } from '@/lib/types'
import { ProjectCard } from './components/project-card'
import { PauseResumeDialog } from './components/pause-resume-dialog'
import { ProjectsEmptyState } from './components/projects-empty-state'

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className="text-xl font-black tabular-nums leading-none text-foreground">{value}</p>
        {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  iconColor,
  title,
  count,
}: {
  icon: React.ElementType
  iconColor: string
  title: string
  count: number
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`h-3.5 w-3.5 ${iconColor || 'text-muted-foreground'}`} />
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-medium text-muted-foreground tabular-nums">
        {count}
      </span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ActiveProjectsPage() {
  const navigate = useNavigate()
  const { projects, loadProjects, updateProject } = useProjectStore()
  const { generateTasksForProject } = useTaskStore()
  const { addToast } = useUIStore()

  const [isLoading, setIsLoading] = useState(true)
  const [pauseTarget, setPauseTarget] = useState<ActiveProject | null>(null)
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<ActiveProject | null>(null)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)

  // Load projects then generate tasks for any active ones that don't have any yet
  useEffect(() => {
    loadProjects()
      .then(() => {
        // generateTasksForProject is a no-op if tasks already exist
        const actives = useProjectStore.getState().projects.filter((p) => p.status === 'active')
        return Promise.all(actives.map((p) => generateTasksForProject(p.id, p.phases)))
      })
      .finally(() => setIsLoading(false))
  }, [loadProjects, generateTasksForProject])

  // Grouped projects
  const { activeProjects, pausedProjects, completedProjects } = useMemo(() => {
    const sorted = [...projects].sort((a, b) => a.priority - b.priority)
    return {
      activeProjects: sorted.filter((p) => p.status === 'active'),
      pausedProjects: sorted.filter((p) => p.status === 'paused'),
      completedProjects: sorted.filter((p) => p.status === 'completed'),
    }
  }, [projects])

  // ─── Stats ───────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalActive = activeProjects.length
    const totalCompleted = completedProjects.length
    const combinedTasks = [...activeProjects, ...pausedProjects].reduce(
      (acc, p) => ({ done: acc.done + p.completedTasks, total: acc.total + p.totalTasks }),
      { done: 0, total: 0 },
    )
    return {
      totalActive,
      totalCompleted,
      combinedProgress: calcProgress(combinedTasks.done, combinedTasks.total),
    }
  }, [activeProjects, pausedProjects, completedProjects])

  // ─── Priority reorder ────────────────────────────────────────────────────

  async function handlePriorityUp(project: ActiveProject) {
    const siblings = activeProjects
    const idx = siblings.findIndex((p) => p.id === project.id)
    if (idx <= 0) return
    const swapWith = siblings[idx - 1]
    await Promise.all([
      updateProject(project.id, { priority: swapWith.priority }),
      updateProject(swapWith.id, { priority: project.priority }),
    ])
  }

  async function handlePriorityDown(project: ActiveProject) {
    const siblings = activeProjects
    const idx = siblings.findIndex((p) => p.id === project.id)
    if (idx >= siblings.length - 1) return
    const swapWith = siblings[idx + 1]
    await Promise.all([
      updateProject(project.id, { priority: swapWith.priority }),
      updateProject(swapWith.id, { priority: project.priority }),
    ])
  }

  // ─── Pause / resume ──────────────────────────────────────────────────────

  function handlePauseResumeClick(project: ActiveProject) {
    setPauseTarget(project)
    setPauseDialogOpen(true)
  }

  async function confirmPauseResume(project: ActiveProject) {
    const nextStatus = project.status === 'active' ? 'paused' : 'active'
    await updateProject(project.id, { status: nextStatus })
    addToast({
      title: nextStatus === 'paused' ? 'Quest paused' : 'Quest resumed!',
      description: project.title,
      variant: nextStatus === 'active' ? 'success' : 'default',
    })
    setPauseDialogOpen(false)
  }

  // ─── Archive ─────────────────────────────────────────────────────────────

  function handleArchiveClick(project: ActiveProject) {
    setArchiveTarget(project)
    setArchiveDialogOpen(true)
  }

  async function confirmArchive() {
    if (!archiveTarget) return
    await updateProject(archiveTarget.id, { status: 'archived' })
    addToast({
      title: 'Project archived',
      description: archiveTarget.title,
      variant: 'default',
    })
    setArchiveDialogOpen(false)
    setArchiveTarget(null)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/25">
                  <Swords className="h-3.5 w-3.5 text-primary" />
                </div>
                <h1 className="text-lg font-black tracking-tight">Command Center</h1>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Manage and track all your active quests.
              </p>
            </div>
            <Button
              variant="quest"
              size="sm"
              onClick={() => navigate('/generate')}
              className="shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              New Quest
            </Button>
          </div>

          {/* Stats */}
          {!isLoading && projects.filter((p) => p.status !== 'archived').length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <StatCard label="Active"    value={stats.totalActive}          sub="quests"  />
              <StatCard label="Progress"  value={`${stats.combinedProgress}%`} sub="overall" />
              <StatCard label="Completed" value={stats.totalCompleted}        sub="total"   />
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* ── Active projects ───────────────────────────────── */}
            <section>
              <SectionHeader
                icon={Swords}
                iconColor="text-primary"
                title="Active Quests"
                count={activeProjects.length}
              />
              {activeProjects.length === 0 ? (
                <ProjectsEmptyState variant="active" />
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2">
                    {activeProjects.map((project, idx) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onPauseResume={handlePauseResumeClick}
                        onArchive={handleArchiveClick}
                        onPriorityUp={handlePriorityUp}
                        onPriorityDown={handlePriorityDown}
                        isFirst={idx === 0}
                        isLast={idx === activeProjects.length - 1}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </section>

            {/* ── Paused projects ───────────────────────────────── */}
            {pausedProjects.length > 0 && (
              <section>
                <SectionHeader
                  icon={Pause}
                  iconColor="text-amber-400"
                  title="Paused"
                  count={pausedProjects.length}
                />
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2">
                    {pausedProjects.map((project, idx) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onPauseResume={handlePauseResumeClick}
                        onArchive={handleArchiveClick}
                        onPriorityUp={handlePriorityUp}
                        onPriorityDown={handlePriorityDown}
                        isFirst={idx === 0}
                        isLast={idx === pausedProjects.length - 1}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </section>
            )}

            {/* ── Completed projects ────────────────────────────── */}
            {completedProjects.length > 0 && (
              <section>
                <SectionHeader
                  icon={CheckCircle2}
                  iconColor="text-primary"
                  title="Completed"
                  count={completedProjects.length}
                />
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2">
                    {completedProjects.map((project, idx) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onPauseResume={handlePauseResumeClick}
                        onArchive={handleArchiveClick}
                        onPriorityUp={handlePriorityUp}
                        onPriorityDown={handlePriorityDown}
                        isFirst={idx === 0}
                        isLast={idx === completedProjects.length - 1}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </section>
            )}

            {/* No projects at all */}
            {projects.filter((p) => p.status !== 'archived').length === 0 && (
              <ProjectsEmptyState variant="all" />
            )}
          </div>
        )}
      </div>

      {/* Pause / resume confirm */}
      <PauseResumeDialog
        project={pauseTarget}
        open={pauseDialogOpen}
        onOpenChange={setPauseDialogOpen}
        onConfirm={confirmPauseResume}
      />

      {/* Archive confirm */}
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border">
                <Archive className="h-5 w-5 text-muted-foreground" />
              </div>
              <AlertDialogTitle className="text-base">Archive this project?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed">
              <span className="font-medium text-foreground">{archiveTarget?.title}</span> will be
              moved to your archive. You can find it in the Ideas Library if you want to revisit it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-secondary text-foreground border border-border hover:bg-secondary/80"
              onClick={confirmArchive}
            >
              <Archive className="h-3.5 w-3.5 mr-1.5" />
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
