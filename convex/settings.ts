import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query('settings')
      .withIndex('by_localId', (q) => q.eq('localId', 'settings'))
      .unique()
    if (!existing) {
      await ctx.db.insert('settings', {
        localId: 'settings',
        hoursPerDayDefault: 2,
        maxActiveProjects: 3,
        autoReschedule: true,
        showStreakReminder: true,
        theme: 'dark',
        openRouterModel: 'google/gemini-2.0-flash-001',
        updatedAt: Date.now(),
      })
    }
  },
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('settings')
      .withIndex('by_localId', (q) => q.eq('localId', 'settings'))
      .unique()
  },
})

export const update = mutation({
  args: {
    hoursPerDayDefault: v.optional(v.number()),
    maxActiveProjects: v.optional(v.number()),
    autoReschedule: v.optional(v.boolean()),
    showStreakReminder: v.optional(v.boolean()),
    theme: v.optional(v.string()),
    openRouterModel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('settings')
      .withIndex('by_localId', (q) => q.eq('localId', 'settings'))
      .unique()
    if (!existing) return
    const patch = Object.fromEntries(
      Object.entries(args).filter(([, val]) => val !== undefined),
    )
    await ctx.db.patch(existing._id, { ...patch, updatedAt: Date.now() })
  },
})
