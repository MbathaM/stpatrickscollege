import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new profile
export const create = mutation({
  args: {
    userId: v.id("ad_user"),
    role: v.string(),
    classroom: v.optional(v.number()),
    gradeIds: v.optional(v.array(v.id("grade"))),
    subjectIds: v.optional(v.array(v.id("subject"))),
    hasConcession: v.optional(v.boolean()),
    concessionType: v.optional(v.string()),
    concessionTime: v.optional(v.number()),
    isComplete: v.optional(v.boolean()),
    permissions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Set default permissions based on role
    let permissions = args.permissions || [];
    if (args.role === "teacher" && !permissions.includes("teacher")) {
      permissions.push("teacher");
    } else if (args.role === "student" && !permissions.includes("student")) {
      permissions.push("student");
    }

    return await ctx.db.insert("profile", {
      userId: args.userId,
      role: args.role,
      classroom: args.classroom,
      gradeIds: args.gradeIds,
      subjectIds: args.subjectIds,
      hasConcession: args.hasConcession ?? false,
      concessionType: args.concessionType,
      concessionTime: args.concessionTime,
      isComplete: args.isComplete ?? true, // Correct defaulting behavior
      permissions: permissions,
    });
  },
});

// Get a profile by ID
export const getById = query({
  args: { id: v.id("profile") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a profile by user email
export const getByUserEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // First, find the ad_user with this email
    const users = await ctx.db
      .query("ad_user")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (users.length === 0) {
      return null;
    }

    // Then find the profile associated with this user
    const userId = users[0]._id;
    const profiles = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return profiles[0];
  },
});

// Get a profile by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // First, find the ad_user with this email
    const users = await ctx.db
      .query("ad_user")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (users.length === 0) {
      return null;
    }

    // Then find the profile associated with this user
    const userId = users[0]._id;
    const profiles = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return profiles[0];
  },
});

// Get a profile by user ID
export const getByUserId = query({
  args: { userId: v.id("ad_user") },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return profiles[0];
  },
});

// List all profiles
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("profile").collect();
  },
});

// List profiles by role
export const listByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();
  },
});

// Update a profile
export const update = mutation({
  args: {
    id: v.id("profile"),
    role: v.optional(v.string()),
    classroom: v.optional(v.number()),
    gradeIds: v.optional(v.array(v.id("grade"))),
    subjectIds: v.optional(v.array(v.id("subject"))),
    hasConcession: v.optional(v.boolean()),
    concessionType: v.optional(v.string()),
    concessionTime: v.optional(v.number()),
    permissions: v.optional(v.array(v.string())),
    isComplete: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;

    // If role is changing, ensure appropriate permissions are set
    if (fields.role) {
      const existingProfile = await ctx.db.get(id);
      let permissions =
        fields.permissions || existingProfile?.permissions || [];

      // Add role-based permission if not already present
      if (fields.role === "teacher" && !permissions.includes("teacher")) {
        permissions.push("teacher");
      } else if (
        fields.role === "student" &&
        !permissions.includes("student")
      ) {
        permissions.push("student");
      }

      fields.permissions = permissions;
    }

    return await ctx.db.patch(id, fields);
  },
});

// Delete a profile
export const remove = mutation({
  args: { id: v.id("profile") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Add a permission to a profile
export const addPermission = mutation({
  args: {
    id: v.id("profile"),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    const permissions = profile.permissions || [];
    if (!permissions.includes(args.permission)) {
      permissions.push(args.permission);
      return await ctx.db.patch(args.id, { permissions });
    }

    return profile;
  },
});

// Remove a permission from a profile
export const removePermission = mutation({
  args: {
    id: v.id("profile"),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.id);
    if (!profile) {
      throw new Error("Profile not found");
    }

    const permissions = profile.permissions || [];
    const updatedPermissions = permissions.filter((p) => p !== args.permission);

    return await ctx.db.patch(args.id, { permissions: updatedPermissions });
  },
});

export const determineRoleFromEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if email starts with a number (student)
    const isStudent = /^\d/.test(args.email.split("@")[0]);
    return isStudent ? "student" : "teacher";
  },
});

export const isProfileComplete = query({
  args: { userId: v.id("ad_user") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return profile ? profile.isComplete : false;
  },
});

export const countByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();
    return profiles.length;
  },
});
