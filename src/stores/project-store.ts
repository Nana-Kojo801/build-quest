import { create } from 'zustand'
import { convexClient } from '@/lib/convex-client'
import { api } from '../../convex/_generated/api'
import { generateId } from '@/lib/utils'
import type { ProjectIdea, ActiveProject, ProjectPhase, AppSettings, UserProgress } from '@/lib/types'

// ─── Convex doc → app type mappers ───────────────────────────────────────────

type AnyDoc = Record<string, unknown>

function ideaFromDoc(doc: AnyDoc): ProjectIdea {
  return {
    id: doc.localId as string,
    title: doc.title as string,
    pitch: doc.pitch as string,
    description: doc.description as string | undefined,
    category: doc.category as string,
    tags: doc.tags as string[],
    difficulty: doc.difficulty as ProjectIdea['difficulty'],
    estimatedDays: doc.estimatedDays as number,
    estimatedHoursPerDay: doc.estimatedHoursPerDay as number,
    pages: doc.pages as string[],
    features: doc.features as string[],
    techDirection: doc.techDirection as string,
    whyBuild: doc.whyBuild as string,
    roadmap: doc.roadmap as string | undefined,
    suitability: doc.suitability as string | undefined,
    source: doc.source as 'ai' | 'mock' | undefined,
    status: doc.status as ProjectIdea['status'],
    createdAt: doc.createdAt as number,
    updatedAt: doc.updatedAt as number,
    generatedAt: doc.generatedAt as number,
  }
}

function projectFromDoc(doc: AnyDoc): ActiveProject {
  return {
    id: doc.localId as string,
    ideaId: doc.ideaLocalId as string,
    title: doc.title as string,
    pitch: doc.pitch as string,
    category: doc.category as string,
    tags: doc.tags as string[],
    difficulty: doc.difficulty as ActiveProject['difficulty'],
    status: doc.status as ActiveProject['status'],
    priority: doc.priority as number,
    startedAt: doc.startedAt as number,
    targetEndDate: doc.targetEndDate as number,
    actualEndDate: doc.actualEndDate as number | undefined,
    estimatedDays: doc.estimatedDays as number,
    estimatedHoursPerDay: doc.estimatedHoursPerDay as number,
    completedTasks: doc.completedTasks as number,
    totalTasks: doc.totalTasks as number,
    currentPhase: doc.currentPhase as string,
    phases: JSON.parse(doc.phases as string) as ProjectPhase[],
    xpEarned: doc.xpEarned as number,
    updatedAt: doc.updatedAt as number,
  }
}

function progressFromDoc(doc: AnyDoc): UserProgress {
  const totalXP = doc.totalXP as number
  return {
    id: doc.localId as string,
    totalXP,
    level: doc.level as number,
    xpToNextLevel: (doc.xpToNextLevel as number | undefined) ?? (1000 - (totalXP % 1000)),
    streak: doc.streak as number,
    longestStreak: doc.longestStreak as number,
    lastActiveDate: doc.lastActiveDate as string,
    totalProjectsCompleted: doc.totalProjectsCompleted as number,
    totalTasksCompleted: doc.totalTasksCompleted as number,
    achievements: doc.achievements ? (JSON.parse(doc.achievements as string) as UserProgress['achievements']) : [],
    updatedAt: doc.updatedAt as number,
  }
}

function settingsFromDoc(doc: AnyDoc): AppSettings {
  return {
    id: 'settings',
    hoursPerDayDefault: doc.hoursPerDayDefault as number,
    maxActiveProjects: doc.maxActiveProjects as number,
    autoReschedule: doc.autoReschedule as boolean,
    showStreakReminder: doc.showStreakReminder as boolean,
    theme: (doc.theme as 'dark') ?? 'dark',
    openRouterModel: doc.openRouterModel as string | undefined,
    updatedAt: doc.updatedAt as number,
  }
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface ProjectStore {
  ideas: ProjectIdea[]
  loadIdeas: () => Promise<void>
  saveIdea: (idea: Omit<ProjectIdea, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>
  updateIdeaStatus: (id: string, status: ProjectIdea['status']) => Promise<void>
  deleteIdea: (id: string) => Promise<void>

  projects: ActiveProject[]
  loadProjects: () => Promise<void>
  startProject: (idea: ProjectIdea) => Promise<string>
  updateProject: (id: string, patch: Partial<ActiveProject>) => Promise<void>
  deleteProject: (id: string) => Promise<void>

  settings: AppSettings | null
  progress: UserProgress | null
  loadSettings: () => Promise<void>
  loadProgress: () => Promise<void>
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  ideas: [],
  loadIdeas: async () => {
    const docs = await convexClient.query(api.ideas.list, {})
    const ideas = docs.map((d) => ideaFromDoc(d as AnyDoc))
    ideas.sort((a, b) => b.createdAt - a.createdAt)
    set({ ideas })
  },
  saveIdea: async (idea) => {
    const id = generateId()
    const now = Date.now()
    const record: ProjectIdea = { ...idea, id, createdAt: now, updatedAt: now }
    await convexClient.mutation(api.ideas.upsert, {
      localId: id,
      title: record.title,
      pitch: record.pitch,
      category: record.category,
      tags: record.tags,
      difficulty: record.difficulty,
      estimatedDays: record.estimatedDays,
      estimatedHoursPerDay: record.estimatedHoursPerDay,
      pages: record.pages,
      features: record.features,
      techDirection: record.techDirection,
      whyBuild: record.whyBuild,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      generatedAt: record.generatedAt,
      ...(record.description && { description: record.description }),
      ...(record.roadmap && { roadmap: record.roadmap }),
      ...(record.suitability && { suitability: record.suitability }),
      source: record.source ?? 'ai',
    })
    set((s) => ({ ideas: [record, ...s.ideas] }))
    return id
  },
  updateIdeaStatus: async (id, status) => {
    const now = Date.now()
    await convexClient.mutation(api.ideas.updateStatus, { localId: id, status })
    set((s) => ({
      ideas: s.ideas.map((i) => (i.id === id ? { ...i, status, updatedAt: now } : i)),
    }))
  },
  deleteIdea: async (id) => {
    await convexClient.mutation(api.ideas.removeByLocalId, { localId: id })
    set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) }))
  },

  projects: [],
  loadProjects: async () => {
    const docs = await convexClient.query(api.projects.list, {})
    const projects = docs.map((d) => projectFromDoc(d as AnyDoc))
    projects.sort((a, b) => b.startedAt - a.startedAt)
    set({ projects })
  },
  startProject: async (idea) => {
    const id = generateId()
    const now = Date.now()
    const settings = get().settings
    const hoursPerDay = settings?.hoursPerDayDefault ?? 2

    const phases = buildPhasesFromIdea(idea, id)
    const totalTasks = phases.reduce((sum, p) => sum + p.estimatedDays, 0)
    const targetEnd = new Date()
    targetEnd.setDate(targetEnd.getDate() + idea.estimatedDays)

    const project: ActiveProject = {
      id,
      ideaId: idea.id,
      title: idea.title,
      pitch: idea.pitch,
      category: idea.category,
      tags: idea.tags,
      difficulty: idea.difficulty,
      status: 'active',
      priority: (get().projects.filter((p) => p.status === 'active').length) + 1,
      startedAt: now,
      targetEndDate: targetEnd.getTime(),
      estimatedDays: idea.estimatedDays,
      estimatedHoursPerDay: hoursPerDay,
      completedTasks: 0,
      totalTasks,
      currentPhase: phases[0]?.title ?? '',
      phases,
      xpEarned: 0,
      updatedAt: now,
    }

    await convexClient.mutation(api.projects.upsert, {
      localId: id,
      ideaLocalId: idea.id,
      title: project.title,
      pitch: project.pitch,
      category: project.category,
      tags: project.tags,
      difficulty: project.difficulty,
      status: project.status,
      priority: project.priority,
      startedAt: project.startedAt,
      targetEndDate: project.targetEndDate,
      estimatedDays: project.estimatedDays,
      estimatedHoursPerDay: project.estimatedHoursPerDay,
      completedTasks: 0,
      totalTasks: project.totalTasks,
      currentPhase: project.currentPhase,
      phases: JSON.stringify(phases),
      xpEarned: 0,
      updatedAt: now,
    })
    await convexClient.mutation(api.ideas.updateStatus, { localId: idea.id, status: 'active' })

    set((s) => ({
      projects: [project, ...s.projects],
      ideas: s.ideas.map((i) => (i.id === idea.id ? { ...i, status: 'active' as const } : i)),
    }))

    return id
  },
  updateProject: async (id, patch) => {
    const now = Date.now()
    const phasesJson = patch.phases ? JSON.stringify(patch.phases) : undefined
    await convexClient.mutation(api.projects.updateById, {
      localId: id,
      ...(patch.status !== undefined && { status: patch.status }),
      ...(patch.completedTasks !== undefined && { completedTasks: patch.completedTasks }),
      ...(patch.currentPhase !== undefined && { currentPhase: patch.currentPhase }),
      ...(patch.xpEarned !== undefined && { xpEarned: patch.xpEarned }),
      ...(patch.actualEndDate !== undefined && { actualEndDate: patch.actualEndDate }),
      ...(phasesJson !== undefined && { phases: phasesJson }),
      ...(patch.priority !== undefined && { priority: patch.priority }),
    })
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: now } : p
      ),
    }))
  },
  deleteProject: async (id) => {
    await convexClient.mutation(api.projects.removeByLocalId, { localId: id })
    await convexClient.mutation(api.tasks.deleteByProject, { projectLocalId: id })
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }))
  },

  settings: null,
  progress: null,
  loadSettings: async () => {
    await convexClient.mutation(api.settings.initialize, {})
    const doc = await convexClient.query(api.settings.get, {})
    set({ settings: doc ? settingsFromDoc(doc as AnyDoc) : null })
  },
  loadProgress: async () => {
    await convexClient.mutation(api.progress.initialize, {})
    const doc = await convexClient.query(api.progress.get, {})
    set({ progress: doc ? progressFromDoc(doc as AnyDoc) : null })
  },
  updateSettings: async (patch) => {
    await convexClient.mutation(api.settings.update, {
      ...(patch.hoursPerDayDefault !== undefined && { hoursPerDayDefault: patch.hoursPerDayDefault }),
      ...(patch.maxActiveProjects !== undefined && { maxActiveProjects: patch.maxActiveProjects }),
      ...(patch.autoReschedule !== undefined && { autoReschedule: patch.autoReschedule }),
      ...(patch.showStreakReminder !== undefined && { showStreakReminder: patch.showStreakReminder }),
      ...(patch.theme !== undefined && { theme: patch.theme }),
      ...(patch.openRouterModel !== undefined && { openRouterModel: patch.openRouterModel }),
    })
    set((s) => ({
      settings: s.settings ? { ...s.settings, ...patch, updatedAt: Date.now() } : null,
    }))
  },
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPhasesFromIdea(idea: ProjectIdea, projectId: string): ProjectPhase[] {
  const totalDays = idea.estimatedDays
  const phaseTemplates = [
    { title: 'Setup & Architecture', pct: 0.15 },
    { title: 'Core Features', pct: 0.45 },
    { title: 'UI Polish', pct: 0.25 },
    { title: 'Testing & Launch', pct: 0.15 },
  ]
  return phaseTemplates.map((t, i) => ({
    id: generateId(),
    projectId,
    title: t.title,
    description: getPhaseDescription(t.title),
    order: i,
    estimatedDays: Math.max(1, Math.round(totalDays * t.pct)),
    completedDays: 0,
    status: i === 0 ? ('active' as const) : ('pending' as const),
  }))
}

function getPhaseDescription(phase: string): string {
  const map: Record<string, string> = {
    'Setup & Architecture': 'Configure project structure, tech stack, routing, and foundational components.',
    'Core Features': 'Build the main feature set and primary user flows.',
    'UI Polish': 'Refine visual design, animations, empty states, and responsiveness.',
    'Testing & Launch': 'Write tests, fix bugs, optimize performance, and prepare for deployment.',
  }
  return map[phase] ?? 'Work on project phase.'
}
