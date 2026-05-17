import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const submit = mutation({
  args: {
    answers: v.any(),
    submittedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("submissions", {
      answers: args.answers,
      submittedAt: args.submittedAt,
    })
    return id
  },
})
