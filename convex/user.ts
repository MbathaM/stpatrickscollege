import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("user", {
      email: args.email,
      name: args.name,
      image: args.image,
      emailVerified: true,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Get a user by user email
export const getByUserEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
      const user = await ctx.db
        .query("user")
        .filter((q) => q.eq(q.field("email"), args.email))
        .collect();
      return user[0];
    },
  });
