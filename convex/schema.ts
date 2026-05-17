import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  submissions: defineTable({
    answers: v.any(),
    submittedAt: v.string(),
  }),
})
