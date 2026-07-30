import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

export const getUrl = query({
  // Accept a plain string and normalize it ourselves so a stale/empty/malformed
  // storageId (e.g. rehydrated from localStorage) returns null instead of throwing
  // an ArgumentValidationError, which would crash the whole client.
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.storage.getUrl(args.storageId as Id<"_storage">)
    } catch {
      return null
    }
  },
})

export const getUrls = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.storageIds.map(async (storageId) => {
        try {
          return await ctx.storage.getUrl(storageId as Id<"_storage">)
        } catch {
          return null
        }
      }),
    )
  },
})
