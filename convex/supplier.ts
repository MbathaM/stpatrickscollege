import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("supplier", {
      name: args.name,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("supplier").collect();
  },
});

export const getByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("supplier")
      .filter((q) => q.eq(q.field("name"), args.name))
      .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("supplier"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("supplier"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      name: args.name,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("supplier"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("supplier").collect()).length;
  },
});