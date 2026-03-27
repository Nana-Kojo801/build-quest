import { create } from 'zustand'
import { convexClient } from '@/lib/convex-client'
import { api } from '../../convex/_generated/api'
import { generateId, todayStr, addDays } from '@/lib/utils'
import { useProjectStore } from './project-store'
import type { Task, DaySchedule } from '@/lib/types'

type AnyDoc = Record<string, unknown>

function taskFromDoc(doc: AnyDoc): Task {
  return {
    id: doc.localId as string,
    projectId: doc.projectLocalId as string,
    phaseId: doc.phaseId as string,
    title: doc.title as string,
    description: doc.description as string,
    status: doc.status as Task['status'],
    priority: doc.priority as Task['priority'],
    estimatedMinutes: doc.estimatedMinutes as number,
    scheduledDate: doc.scheduledDate as string,
    completedAt: doc.completedAt as number | undefined,
    carriedOverFrom: doc.carriedOverFrom as string | undefined,
    xpReward: doc.xpReward as number,
    order: doc.order as number,
    createdAt: doc.createdAt as number,
    updatedAt: doc.updatedAt as number,
  }
}

interface TaskStore {
  tasks: Task[]
  loadTasks: () => Promise<void>
  loadTasksForProject: (projectId: string) => Promise<void>
  generateTasksForProject: (projectId: string, phases: { id: string; title: string; estimatedDays: number }[]) => Promise<void>
  completeTask: (id: string) => Promise<void>
  uncompleteTask: (id: string) => Promise<void>
  skipTask: (id: string) => Promise<void>
  rescheduleTask: (id: string, newDate: string) => Promise<void>
  rescheduleOverdue: () => Promise<void>
  getDaySchedule: (date: string) => DaySchedule
  getTodayTasks: () => Task[]
  getOverdueTasks: () => Task[]
  getProjectTasks: (projectId: string) => Task[]
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  loadTasks: async () => {
    const docs = await convexClient.query(api.tasks.list, {})
    const tasks = docs.map((d) => taskFromDoc(d as AnyDoc))
    tasks.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    set({ tasks })
  },

  loadTasksForProject: async (projectId) => {
    const docs = await convexClient.query(api.tasks.listByProject, { projectLocalId: projectId })
    const tasks = docs.map((d) => taskFromDoc(d as AnyDoc))
    tasks.sort((a, b) => a.order - b.order)
    set((s) => {
      const others = s.tasks.filter((t) => t.projectId !== projectId)
      return { tasks: [...others, ...tasks] }
    })
  },

  generateTasksForProject: async (projectId, phases) => {
    // Check if tasks already exist for this project
    const existing = await convexClient.query(api.tasks.listByProject, { projectLocalId: projectId })
    if (existing.length > 0) return

    const today = todayStr()
    const allTasks: Task[] = []
    let dateOffset = 0

    for (const phase of phases) {
      for (let day = 0; day < phase.estimatedDays; day++) {
        const taskCount = day === 0 ? 3 : 2
        for (let t = 0; t < taskCount; t++) {
          const task: Task = {
            id: generateId(),
            projectId,
            phaseId: phase.id,
            title: generateTaskTitle(phase.title, day, t),
            description: generateTaskDescription(phase.title),
            status: 'pending',
            priority: t === 0 ? 'high' : 'medium',
            estimatedMinutes: t === 0 ? 60 : 45,
            scheduledDate: addDays(today, dateOffset),
            xpReward: 50 + (t === 0 ? 25 : 0),
            order: allTasks.length,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          allTasks.push(task)
        }
        dateOffset++
      }
    }

    await convexClient.mutation(api.tasks.bulkInsert, {
      tasks: allTasks.map((task) => ({
        localId: task.id,
        projectLocalId: task.projectId,
        phaseId: task.phaseId,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        estimatedMinutes: task.estimatedMinutes,
        scheduledDate: task.scheduledDate,
        xpReward: task.xpReward,
        order: task.order,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    })

    set((s) => {
      const others = s.tasks.filter((t) => t.projectId !== projectId)
      return { tasks: [...others, ...allTasks] }
    })
  },

  completeTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task || task.status === 'completed') return

    const result = await convexClient.mutation(api.tasks.completeAndUpdateProject, { localId: id })
    if (!result) return

    const now = Date.now()
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status: 'completed' as const, completedAt: now, updatedAt: now } : t
      ),
    }))

    // Update project completedTasks in local state
    const updatedTasks = get().tasks.map((t) =>
      t.id === id ? { ...t, status: 'completed' as const } : t
    )
    const projectTasks = updatedTasks.filter((t) => t.projectId === task.projectId)
    const completedCount = projectTasks.filter((t) => t.status === 'completed').length
    useProjectStore.setState((s) => ({
      projects: s.projects.map((p) =>
        p.id === task.projectId ? { ...p, completedTasks: completedCount } : p
      ),
    }))

    // Update XP/progress in Convex and reload progress
    await convexClient.mutation(api.progress.addXP, { amount: result.xpReward })
    await convexClient.mutation(api.progress.incrementTasksCompleted, {})

    const progressDoc = await convexClient.query(api.progress.get, {})
    if (progressDoc) {
      useProjectStore.setState({
        progress: {
          id: progressDoc.localId,
          totalXP: progressDoc.totalXP,
          level: progressDoc.level,
          xpToNextLevel: progressDoc.xpToNextLevel ?? (1000 - (progressDoc.totalXP % 1000)),
          streak: progressDoc.streak,
          longestStreak: progressDoc.longestStreak,
          lastActiveDate: progressDoc.lastActiveDate,
          totalProjectsCompleted: progressDoc.totalProjectsCompleted,
          totalTasksCompleted: progressDoc.totalTasksCompleted,
          achievements: progressDoc.achievements ? JSON.parse(progressDoc.achievements) : [],
          updatedAt: progressDoc.updatedAt,
        },
      })
    }
  },

  uncompleteTask: async (id) => {
    const now = Date.now()
    await convexClient.mutation(api.tasks.updateById, { localId: id, status: 'pending' })
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status: 'pending' as const, completedAt: undefined, updatedAt: now } : t
      ),
    }))
  },

  skipTask: async (id) => {
    const now = Date.now()
    await convexClient.mutation(api.tasks.updateById, { localId: id, status: 'skipped' })
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status: 'skipped' as const, updatedAt: now } : t
      ),
    }))
  },

  rescheduleTask: async (id, newDate) => {
    const now = Date.now()
    const task = get().tasks.find((t) => t.id === id)
    await convexClient.mutation(api.tasks.updateById, {
      localId: id,
      scheduledDate: newDate,
      carriedOverFrom: task?.scheduledDate,
      status: 'carried_over',
    })
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id
          ? { ...t, scheduledDate: newDate, carriedOverFrom: task?.scheduledDate, status: 'carried_over' as const, updatedAt: now }
          : t
      ),
    }))
  },

  rescheduleOverdue: async () => {
    const today = todayStr()
    const tomorrow = addDays(today, 1)
    const overdue = get().tasks.filter(
      (t) => t.scheduledDate < today && t.status === 'pending'
    )
    for (const task of overdue) {
      await get().rescheduleTask(task.id, tomorrow)
    }
  },

  getDaySchedule: (date) => {
    const today = todayStr()
    const dayTasks = get().tasks.filter((t) => t.scheduledDate === date)
    const totalMinutes = dayTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)
    const completedMinutes = dayTasks
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.estimatedMinutes, 0)
    return {
      date,
      tasks: dayTasks,
      totalMinutes,
      completedMinutes,
      isToday: date === today,
      isPast: date < today,
    }
  },

  getTodayTasks: () => {
    const today = todayStr()
    return get().tasks.filter((t) => t.scheduledDate === today)
  },

  getOverdueTasks: () => {
    const today = todayStr()
    return get().tasks.filter((t) => t.scheduledDate < today && t.status === 'pending')
  },

  getProjectTasks: (projectId) => {
    return get().tasks.filter((t) => t.projectId === projectId)
  },
}))

// ─── Task content generators ─────────────────────────────────────────────────

function generateTaskTitle(phase: string, day: number, taskIndex: number): string {
  const titles: Record<string, string[][]> = {
    'Setup & Architecture': [
      ['Initialize project structure and configure tooling', 'Set up routing and app shell'],
      ['Define data models and state management', 'Configure component library'],
      ['Set up local persistence layer', 'Wire up navigation'],
    ],
    'Core Features': [
      ['Build primary feature: data listing view', 'Implement create/add flow'],
      ['Build detail view and item management', 'Add filtering and search'],
      ['Implement edit and update flows', 'Add delete with confirmation'],
      ['Build secondary features', 'Connect state to UI'],
      ['Add real-time updates and feedback', 'Implement error handling'],
    ],
    'UI Polish': [
      ['Refine visual design and spacing', 'Add loading and skeleton states'],
      ['Implement empty states', 'Add animations and transitions'],
      ['Responsive layout fixes', 'Accessibility improvements'],
    ],
    'Testing & Launch': [
      ['Write unit tests for core logic', 'Add integration tests'],
      ['Fix identified bugs', 'Performance optimization'],
      ['Final QA pass', 'Prepare deployment configuration'],
    ],
  }
  const phaseTitles = titles[phase] ?? [['Work on feature', 'Continue implementation']]
  const dayTitles = phaseTitles[day % phaseTitles.length]
  return dayTitles[taskIndex % dayTitles.length]
}

function generateTaskDescription(phase: string): string {
  const descriptions: Record<string, string> = {
    'Setup & Architecture': 'Set up foundational code, architecture, and tooling for this phase.',
    'Core Features': 'Implement core product functionality with real UI and stubbed backend logic.',
    'UI Polish': 'Improve visual quality, responsiveness, and user experience.',
    'Testing & Launch': 'Ensure quality, fix issues, and prepare for production.',
  }
  return descriptions[phase] ?? 'Continue work on this project phase.'
}
