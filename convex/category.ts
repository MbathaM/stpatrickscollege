import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("asset_category", {
      category: args.name,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("asset_category").collect();
    return categories.map(category => ({
      _id: category._id,
      _creationTime: category._creationTime,
      name: category.category,
      description: "", // asset_category schema doesn't have description field
    }));
  },
});

export const getById = query({
  args: { id: v.id("asset_category") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) return null;
    
    return {
      _id: category._id,
      _creationTime: category._creationTime,
      name: category.category,
      description: "", // asset_category schema doesn't have description field
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("asset_category"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      category: args.name,
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