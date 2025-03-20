import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    contact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("manufacturer", {
      name: args.name,
      ...(args.description ? { description: args.description } : {}),
      ...(args.contact ? { contact: args.contact } : {}),
    });
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("manufacturer")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("manufacturer").collect();
  },
});

export const getById = query({
  args: { id: v.id("manufacturer") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("manufacturer"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    contact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    id: v.id("manufacturer"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("manufacturer").collect()).length;
  },
});