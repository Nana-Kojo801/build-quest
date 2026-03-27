import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ideas: defineTable({
    localId: v.string(),
    title: v.string(),
    pitch: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    difficulty: v.string(),
    estimatedDays: v.number(),
    estimatedHoursPerDay: v.number(),
    pages: v.array(v.string()),
    features: v.array(v.string()),
    techDirection: v.string(),
    whyBuild: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    generatedAt: v.number(),
    description: v.optional(v.string()),
    roadmap: v.optional(v.string()),
    suitability: v.optional(v.string()),
    source: v.optional(v.string()),
  }).index('by_localId', ['localId']),

  projects: defineTable({
    localId: v.string(),
    ideaLocalId: v.string(),
    title: v.string(),
    pitch: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    difficulty: v.string(),
    status: v.string(),
    priority: v.number(),
    startedAt: v.number(),
    targetEndDate: v.number(),
    actualEndDate: v.optional(v.number()),
    estimatedDays: v.number(),
    estimatedHoursPerDay: v.number(),
    completedTasks: v.number(),
    totalTasks: v.number(),
    currentPhase: v.string(),
    phases: v.string(), // JSON-serialized ProjectPhase[]
    xpEarned: v.number(),
    updatedAt: v.number(),
  }).index('by_localId', ['localId']),

  tasks: defineTable({
    localId: v.string(),
    projectLocalId: v.string(),
    phaseId: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.string(),
    priority: v.string(),
    estimatedMinutes: v.number(),
    scheduledDate: v.string(),
    completedAt: v.optional(v.number()),
    carriedOverFrom: v.optional(v.string()),
    xpReward: v.number(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_localId', ['localId'])
    .index('by_project', ['projectLocalId'])
    .index('by_date', ['scheduledDate']),

  progress: defineTable({
    localId: v.string(),
    totalXP: v.number(),
    level: v.number(),
    xpToNextLevel: v.optional(v.number()),
    streak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.string(),
    totalProjectsCompleted: v.number(),
    totalTasksCompleted: v.number(),
    achievements: v.optional(v.string()), // JSON-serialized Achievement[]
    updatedAt: v.number(),
  }).index('by_localId', ['localId']),

  settings: defineTable({
    localId: v.string(),
    hoursPerDayDefault: v.number(),
    maxActiveProjects: v.number(),
    autoReschedule: v.boolean(),
    showStreakReminder: v.boolean(),
    theme: v.string(),
    openRouterModel: v.optional(v.string()),
    updatedAt: v.number(),
  }).index('by_localId', ['localId']),
})
