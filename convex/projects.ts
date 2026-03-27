import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const upsert = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('projects')
      .withIndex('by_localId', (q) => q.eq('localId', args.localId))
      .unique()
    if (existing) {
      if (args.updatedAt > existing.updatedAt) {
        await ctx.db.replace(existing._id, args)
      }
    } else {
      await ctx.db.insert('projects', args)
    }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('projects').order('desc').take(200)
  },
})

export const updateById = mutation({
  args: {
    localId: v.string(),
    status: v.optional(v.string()),
    completedTasks: v.optional(v.number()),
    currentPhase: v.optional(v.string()),
    xpEarned: v.optional(v.number()),
    actualEndDate: v.optional(v.number()),
    phases: v.optional(v.string()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, { localId, ...patch }) => {
    const existing = await ctx.db
      .query('projects')
      .withIndex('by_localId', (q) => q.eq('localId', localId))
      .unique()
    if (!existing) return
    const changes = Object.fromEntries(
      Object.entries(patch).filter(([, val]) => val !== undefined),
    )
    await ctx.db.patch(existing._id, { ...changes, updatedAt: Date.now() })
  },
})

export const removeByLocalId = mutation({
  args: { localId: v.string() },
  handler: async (ctx, { localId }) => {
    const existing = await ctx.db
      .query('projects')
      .withIndex('by_localId', (q) => q.eq('localId', localId))
      .unique()
    if (existing) {
      await ctx.db.delete(existing._id)
    }
  },
})

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').take(200)
    for (const project of projects) {
      await ctx.db.delete(project._id)
    }
  },
})
