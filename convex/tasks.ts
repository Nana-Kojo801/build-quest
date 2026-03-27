import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const upsert = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('tasks')
      .withIndex('by_localId', (q) => q.eq('localId', args.localId))
      .unique()
    if (existing) {
      if (args.updatedAt > existing.updatedAt) {
        await ctx.db.replace(existing._id, args)
      }
    } else {
      await ctx.db.insert('tasks', args)
    }
  },
})

export const bulkInsert = mutation({
  args: {
    tasks: v.array(
      v.object({
        localId: v.string(),
        projectLocalId: v.string(),
        phaseId: v.string(),
        title: v.string(),
        description: v.string(),
        status: v.string(),
        priority: v.string(),
        estimatedMinutes: v.number(),
        scheduledDate: v.string(),
        xpReward: v.number(),
        order: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
      }),
    ),
  },
  handler: async (ctx, { tasks }) => {
    for (const task of tasks) {
      await ctx.db.insert('tasks', task)
    }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').take(2000)
  },
})

export const listByDate = query({
  args: { scheduledDate: v.string() },
  handler: async (ctx, { scheduledDate }) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_date', (q) => q.eq('scheduledDate', scheduledDate))
      .take(100)
  },
})

export const listByProject = query({
  args: { projectLocalId: v.string() },
  handler: async (ctx, { projectLocalId }) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectLocalId', projectLocalId))
      .take(200)
  },
})

export const completeAndUpdateProject = mutation({
  args: { localId: v.string() },
  handler: async (ctx, { localId }) => {
    const task = await ctx.db
      .query('tasks')
      .withIndex('by_localId', (q) => q.eq('localId', localId))
      .unique()
    if (!task || task.status === 'completed') return null

    const now = Date.now()
    await ctx.db.patch(task._id, { status: 'completed', completedAt: now, updatedAt: now })

    const projectTasks = await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectLocalId', task.projectLocalId))
      .take(200)
    const completedCount = projectTasks.filter(
      (t) => t.status === 'completed' || t.localId === localId,
    ).length

    const project = await ctx.db
      .query('projects')
      .withIndex('by_localId', (q) => q.eq('localId', task.projectLocalId))
      .unique()
    if (project) {
      await ctx.db.patch(project._id, { completedTasks: completedCount, updatedAt: now })
    }

    return { xpReward: task.xpReward }
  },
})

export const updateById = mutation({
  args: {
    localId: v.string(),
    status: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    carriedOverFrom: v.optional(v.string()),
  },
  handler: async (ctx, { localId, ...patch }) => {
    const existing = await ctx.db
      .query('tasks')
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
      .query('tasks')
      .withIndex('by_localId', (q) => q.eq('localId', localId))
      .unique()
    if (existing) {
      await ctx.db.delete(existing._id)
    }
  },
})

export const deleteByProject = mutation({
  args: { projectLocalId: v.string() },
  handler: async (ctx, { projectLocalId }) => {
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_project', (q) => q.eq('projectLocalId', projectLocalId))
      .take(500)
    for (const task of tasks) {
      await ctx.db.delete(task._id)
    }
  },
})

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query('tasks').take(2000)
    for (const task of tasks) {
      await ctx.db.delete(task._id)
    }
  },
})
