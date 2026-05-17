import { mutation } from "./_generated/server"
import { v } from "convex/values"

const uploadedFile = v.object({
  key: v.string(),
  name: v.string(),
  type: v.string(),
  size: v.number(),
  storageId: v.string(),
})

const listItem = v.object({
  id: v.string(),
  name: v.string(),
  description: v.string(),
  itemType: v.optional(v.union(v.literal("service"), v.literal("product"))),
})

export const submit = mutation({
  args: {
    business_name: v.optional(v.string()),
    business_what: v.optional(v.array(listItem)),
    audience: v.optional(v.string()),
    vibe: v.optional(v.string()),
    branding: v.optional(v.string()),
    logo: v.optional(v.array(uploadedFile)),
    colors: v.optional(v.array(v.string())),
    imagery: v.optional(v.array(uploadedFile)),
    inspiration: v.optional(
      v.object({
        files: v.array(uploadedFile),
        links: v.array(v.string()),
      }),
    ),
    competitors: v.optional(v.array(v.string())),
    pages: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.string())),
    budget: v.optional(v.array(v.number())),
    deadline: v.optional(v.string()),
    notes: v.optional(v.string()),
    questions_for_us: v.optional(v.string()),
    submittedAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("submissions", args)
  },
})
