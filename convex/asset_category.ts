import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("asset_category", {
      category: args.category,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("asset_category").collect();
  },
});

export const getById = query({
  args: { id: v.id("asset_category") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("asset_category"),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      category: args.category,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("asset_category"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("asset_category").collect()).length;
  },
});