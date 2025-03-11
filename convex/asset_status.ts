import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("asset_status", {
      status: args.status,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("asset_status").collect();
  },
});

export const getById = query({
  args: { id: v.id("asset_status") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("asset_status"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("asset_status"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("asset_status").collect()).length;
  },
});