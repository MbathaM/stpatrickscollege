import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("grade", {
      name: Number(args.name),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("grade").collect();
  },
});

export const getById = query({
  args: { id: v.id("grade") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("grade"),
    name: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    id: v.id("grade"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("grade").collect()).length;
  },
});