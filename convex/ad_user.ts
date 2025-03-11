import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.string(),
    intraId: v.string(),
    displayName: v.string(),
    givenName: v.string(),
    surname: v.string(),
    email: v.string(),
    mobilePhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ad_user", {
      userId: args.userId as Id<"user">,
      intraId: args.intraId,
      displayName: args.displayName,
      surname: args.surname,
      givenName: args.givenName,
      email: args.email,
      mobilePhone: args.mobilePhone,
    });
  },
});

// Get a ad_user by user email
export const getByUserEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("ad_user")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return profiles[0];
  },
});

// Get a ad_user by user ID
export const getByUserId = query({
  args: { userId: v.id("ad_user") },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("ad_user")
      .filter((q) =>
        q.eq(q.field("userId"), args.userId as unknown as Id<"user">)
      )
      .collect();
    return profiles[0];
  },
});
