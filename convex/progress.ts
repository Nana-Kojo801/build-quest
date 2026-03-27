import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

function getPrevDay(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query('progress')
      .withIndex('by_localId', (q) => q.eq('localId', 'progress'))
      .unique()
    if (!existing) {
      await ctx.db.insert('progress', {
        localId: 'progress',
        totalXP: 0,
        level: 1,
        xpToNextLevel: 1000,
        streak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        totalProjectsCompleted: 0,
        totalTasksCompleted: 0,
        achievements: '[]',
        updatedAt: Date.now(),
      })
    }
  },
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('progress')
      .withIndex('by_localId', (q) => q.eq('localId', 'progress'))
      .unique()
  },
})

export const getByLocalId = query({
  args: { localId: v.string() },
  handler: async (ctx, { localId }) => {
    return await ctx.db
      .query('progress')
      .withIndex('by_localId', (q) => q.eq('localId', localId))
      .unique()
  },
})

export const addXP = mutation({
  args: { amount: v.number() },
  handler: async (ctx, { amount }) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_localId', (q) => q.eq('localId', 'progress'))
      .unique()
    if (!progress) return

    const newTotal = progress.totalXP + amount
    const newLevel = Math.floor(newTotal / 1000) + 1
    const xpToNext = 1000 - (newTotal % 1000)

    const today = new Date().toISOString().slice(0, 10)
    let { streak, longestStreak, lastActiveDate } = progress

    if (lastActiveDate !== today) {
      if (lastActiveDate === getPrevDay(today)) {
        streak += 1
        longestStreak = Math.max(streak, longestStreak)
      } else {
        streak = 1
      }
      lastActiveDate = today
    }

    await ctx.db.patch(progress._id, {
      totalXP: newTotal,
      level: newLevel,
      xpToNextLevel: xpToNext,
      streak,
      longestStreak,
      lastActiveDate,
      updatedAt: Date.now(),
    })
  },
})

export const incrementTasksCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_localId', (q) => q.eq('localId', 'progress'))
      .unique()
    if (!progress) return
    await ctx.db.patch(progress._id, {
      totalTasksCompleted: progress.totalTasksCompleted + 1,
      updatedAt: Date.now(),
    })
  },
})

export const incrementProjectsCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_localId', (q) => q.eq('localId', 'progress'))
      .unique()
    if (!progress) return
    await ctx.db.patch(progress._id, {
      totalProjectsCompleted: progress.totalProjectsCompleted + 1,
      updatedAt: Date.now(),
    })
  },
})

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const progress = await ctx.db
      .query('progress')
      .withIndex('by_localId', (q) => q.eq('localId', 'progress'))
      .unique()
    if (progress) {
      await ctx.db.patch(progress._id, {
        totalXP: 0,
        level: 1,
        xpToNextLevel: 1000,
        streak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        totalProjectsCompleted: 0,
        totalTasksCompleted: 0,
        achievements: '[]',
        updatedAt: Date.now(),
      })
    }
  },
})
