import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const upsert = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('ideas')
      .withIndex('by_localId', (q) => q.eq('localId', args.localId))
      .unique()
    if (existing) {
      if (args.updatedAt > existing.updatedAt) {
        await ctx.db.replace(existing._id, args)
      }
    } else {
      await ctx.db.insert('ideas', args)
    }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('ideas').order('desc').take(500)
  },
})

export const updateStatus = mutation({
  args: { localId: v.string(), status: v.string() },
  handler: async (ctx, { localId, status }) => {
    const existing = await ctx.db
      .query('ideas')
      .withIndex('by_localId', (q) => q.eq('localId', localId))
      .unique()
    if (existing) {
      await ctx.db.patch(existing._id, { status, updatedAt: Date.now() })
    }
  },
})

export const removeByLocalId = mutation({
  args: { localId: v.string() },
  handler: async (ctx, { localId }) => {
    const existing = await ctx.db
      .query('ideas')
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
    const ideas = await ctx.db.query('ideas').take(500)
    for (const idea of ideas) {
      await ctx.db.delete(idea._id)
    }
  },
})
