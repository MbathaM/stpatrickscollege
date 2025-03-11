import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    contractOption: v.optional(v.string()),
    installmentPeriod: v.optional(v.number()),
    installmentAmount: v.optional(v.string()),
    contractedEndDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contract", {
      contractOption: args.contractOption,
      installmentPeriod: args.installmentPeriod,
      installmentAmount: args.installmentAmount,
      contractedEndDate: args.contractedEndDate,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("contract").collect();
  },
});

export const getById = query({
  args: { id: v.id("contract") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("contract"),
    contractOption: v.optional(v.string()),
    installmentPeriod: v.optional(v.number()),
    installmentAmount: v.optional(v.string()),
    contractedEndDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    id: v.id("contract"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("contract").collect()).length;
  },
});