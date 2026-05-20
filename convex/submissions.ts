import { mutation } from "./_generated/server"
import { v } from "convex/values"

const uploadedFile = v.object({
  key: v.string(),
  name: v.string(),
  type: v.string(),
  size: v.number(),
  storageId: v.string(),
})

const offering = v.object({
  id: v.string(),
  name: v.string(),
  description: v.string(),
  kind: v.union(v.literal("service"), v.literal("product")),
})

const linksValue = v.object({
  links: v.array(v.string()),
  files: v.array(uploadedFile),
})

export const submit = mutation({
  args: {
    business_name: v.optional(v.string()),
    offerings: v.optional(v.array(offering)),
    audience: v.optional(v.string()),
    vibe: v.optional(v.array(v.string())),
    branding_amount: v.optional(v.string()),
    logo: v.optional(v.array(uploadedFile)),
    colors: v.optional(v.array(v.string())),
    imagery: v.optional(v.array(uploadedFile)),
    inspiration: v.optional(linksValue),
    competitors: v.optional(linksValue),
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
