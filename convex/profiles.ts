import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { 
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("profiles");
    
    // Simple filter for creator role
    if (args.role) {
      q = q.filter((q) => q.eq(q.field("role"), args.role));
    }

    const profiles = await q.collect();

    // Client-side search for now (Convex search indexes can be added later)
    if (args.search) {
      const s = args.search.toLowerCase();
      return profiles.filter((p) => 
        p.fullName.toLowerCase().includes(s) || 
        p.handle?.toLowerCase().includes(s) || 
        p.category?.toLowerCase().includes(s)
      );
    }

    return profiles;
  },
});

export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

export const getById = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    fullName: v.string(),
    role: v.union(v.literal("creator"), v.literal("brand")),
    isLogin: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (args.isLogin) {
      if (!existing) {
        throw new ConvexError("This email is not registered. Please create an account first.");
      }
      if (existing.role !== args.role) {
        throw new ConvexError(`This account is registered as a ${existing.role}. Please log in as a ${existing.role}.`);
      }
      return existing._id;
    }

    // Signup flow
    if (existing) {
      return existing._id; // Or throw if we want to prevent double registration
    }

    return await ctx.db.insert("profiles", {
      userId: args.userId,
      fullName: args.fullName,
      role: args.role,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("profiles"),
    fullName: v.optional(v.string()),
    handle: v.optional(v.string()),
    category: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    startingPrice: v.optional(v.number()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});
