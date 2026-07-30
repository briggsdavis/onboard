import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"

export const listSubmissions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("submissions").order("desc").collect()
  },
})

export const getSubmission = query({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const setArchived = mutation({
  args: { id: v.id("submissions"), archived: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archived: args.archived })
  },
})

export const deleteSubmission = mutation({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.id)
    if (!submission) throw new Error("Submission not found")
    const files = [
      ...(submission.logo ?? []),
      ...(submission.images ?? []),
      ...(submission.imagery ?? []),
      ...(submission.inspiration?.files ?? []),
      ...(submission.competitors?.files ?? []),
    ]
    await Promise.all(files.map((file) => ctx.storage.delete(file.storageId as Id<"_storage">)))
    await ctx.db.delete(args.id)
  },
})
