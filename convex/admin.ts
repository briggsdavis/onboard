import { query } from "./_generated/server"
import { v } from "convex/values"

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
