import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const uploadedFile = v.object({
  key: v.string(),
  name: v.string(),
  type: v.string(),
  size: v.number(),
  storageId: v.string(),
})

export default defineSchema({
  submissions: defineTable({
    business_name: v.optional(v.string()),
    business_what: v.optional(v.string()),
    audience: v.optional(v.string()),
    vibe: v.optional(v.string()),
    logo: v.optional(v.array(uploadedFile)),
    colors: v.optional(v.array(v.string())),
    imagery: v.optional(v.array(uploadedFile)),
    inspiration_shots: v.optional(v.array(uploadedFile)),
    inspiration_links: v.optional(v.string()),
    competitors: v.optional(v.string()),
    pages: v.optional(v.array(v.string())),
    features: v.optional(v.array(v.string())),
    budget: v.optional(v.array(v.number())),
    deadline: v.optional(v.string()),
    notes: v.optional(v.string()),
    submittedAt: v.string(),
  }),
})
