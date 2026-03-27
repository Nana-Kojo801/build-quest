// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type ProjectStatus = 'idea' | 'saved' | 'active' | 'paused' | 'completed' | 'archived'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'carried_over'
export type TaskPriority = 'low' | 'medium' | 'high'

// ─── Generated Project Idea ───────────────────────────────────────────────────

export interface ProjectIdea {
  id: string
  title: string
  pitch: string
  /** Longer description (AI-generated, 2-3 sentences) */
  description?: string
  category: string
  tags: string[]
  difficulty: Difficulty
  estimatedDays: number
  estimatedHoursPerDay: number
  pages: string[]
  features: string[]
  techDirection: string
  whyBuild: string
  /** Rough implementation roadmap (AI-generated) */
  roadmap?: string
  /** MVP | Portfolio | Monetization | Learning */
  suitability?: string
  /** Whether the idea came from AI generation or the local mock pool */
  source?: 'ai' | 'mock'
  status: ProjectStatus
  createdAt: number
  updatedAt: number
  generatedAt: number
}

// ─── Active Project ───────────────────────────────────────────────────────────

export interface ActiveProject {
  id: string
  ideaId: string
  title: string
  pitch: string
  category: string
  tags: string[]
  difficulty: Difficulty
  status: ProjectStatus
  priority: number          // 1 = highest
  startedAt: number
  targetEndDate: number
  actualEndDate?: number
  estimatedDays: number
  estimatedHoursPerDay: number
  completedTasks: number
  totalTasks: number
  currentPhase: string
  phases: ProjectPhase[]
  xpEarned: number
  updatedAt: number
}

export interface ProjectPhase {
  id: string
  projectId: string
  title: string
  description: string
  order: number
  estimatedDays: number
  completedDays: number
  status: 'pending' | 'active' | 'completed'
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export interface Task {
  id: string
  projectId: string
  phaseId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  estimatedMinutes: number
  actualMinutes?: number
  scheduledDate: string    // ISO date "YYYY-MM-DD"
  completedAt?: number
  carriedOverFrom?: string // original scheduled date
  xpReward: number
  order: number
  createdAt: number
  updatedAt: number
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export interface DaySchedule {
  date: string            // "YYYY-MM-DD"
  tasks: Task[]
  totalMinutes: number
  completedMinutes: number
  isToday: boolean
  isPast: boolean
}

// ─── Bundle Export ────────────────────────────────────────────────────────────

export interface BundleExport {
  id: string
  ideaId: string
  projectTitle: string
  generatedPrompt: string
  claudeConfig: ClaudeConfig
  exportedAt: number
  downloadCount: number
}

export interface ClaudeConfig {
  projectName: string
  description: string
  techStack: string[]
  pages: PageSpec[]
  components: ComponentSpec[]
  uiStyle: string
  rules: string[]
}

export interface PageSpec {
  name: string
  route: string
  description: string
  components: string[]
  mockData?: string
}

export interface ComponentSpec {
  name: string
  description: string
  props?: string[]
}

// ─── User Progress / Gamification ────────────────────────────────────────────

export interface UserProgress {
  id: string
  totalXP: number
  level: number
  xpToNextLevel: number
  streak: number
  longestStreak: number
  lastActiveDate: string
  totalProjectsCompleted: number
  totalTasksCompleted: number
  achievements: Achievement[]
  updatedAt: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number
  xpBonus: number
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  id: string
  hoursPerDayDefault: number
  maxActiveProjects: number
  autoReschedule: boolean
  showStreakReminder: boolean
  theme: 'dark'
  convexUrl?: string
  /** OpenRouter API key — stored locally only, never synced to Convex */
  openRouterApiKey?: string
  /** OpenRouter model id, e.g. "google/gemini-flash-1.5" */
  openRouterModel?: string
  updatedAt: number
}

// ─── UI State (not persisted) ─────────────────────────────────────────────────

export interface UIState {
  activeTab: string
  isGenerating: boolean
  generatingProjectId: string | null
  toast: ToastMessage | null
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant: 'default' | 'success' | 'destructive' | 'xp'
  xpAmount?: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'text-emerald-400 bg-emerald-400/10',
  intermediate: 'text-sky-400 bg-sky-400/10',
  advanced: 'text-amber-400 bg-amber-400/10',
  expert: 'text-rose-400 bg-rose-400/10',
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: 'Idea',
  saved: 'Saved',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  archived: 'Archived',
}

export const XP_PER_LEVEL = 1000
export const XP_TASK_BASE = 50
export const XP_PROJECT_COMPLETE = 500
