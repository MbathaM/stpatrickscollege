import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new todo
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.id("profile"),
    isCompleted: v.optional(v.boolean()),
    dueDate: v.optional(v.string()),
    priority: v.optional(v.string()),
    isShared: v.optional(v.boolean()),
    sharedWith: v.optional(v.array(v.id("profile"))),
    relatedSubjectId: v.optional(v.id("subject")),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("todo", {
      title: args.title,
      description: args.description,
      userId: args.userId,
      isCompleted: args.isCompleted || false,
      dueDate: args.dueDate,
      priority: args.priority || "medium",
      isShared: args.isShared || false,
      sharedWith: args.sharedWith || [],
      relatedSubjectId: args.relatedSubjectId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get a todo by ID
export const getById = query({
  args: { id: v.id("todo") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all todos for a user (including those shared with them)
export const getByUser = query({
  args: { userId: v.id("profile") },
  handler: async (ctx, args) => {
    // Get todos owned by the user
    const ownedTodos = await ctx.db
      .query("todo")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get todos shared with the user
    const sharedTodos = await ctx.db
      .query("todo")
      .filter((q) => q.eq(q.field("isShared"), true)) // First filter by isShared
      .collect();

    // Manually filter sharedTodos to include only those where sharedWith includes args.userId
    const filteredSharedTodos = sharedTodos.filter((todo) =>
      todo.sharedWith?.includes(args.userId)
    );

    // Combine and return all todos
    return [...ownedTodos, ...filteredSharedTodos];
  },
});

// Update a todo
export const update = mutation({
  args: {
    id: v.id("todo"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
    dueDate: v.optional(v.string()),
    priority: v.optional(v.string()),
    isShared: v.optional(v.boolean()),
    sharedWith: v.optional(v.array(v.id("profile"))),
    relatedSubjectId: v.optional(v.id("subject")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;

    // Check if the todo exists
    const todo = await ctx.db.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    // Update the todo with the new fields
    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Delete a todo
export const remove = mutation({
  args: { id: v.id("todo") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Mark a todo as completed
export const markAsCompleted = mutation({
  args: {
    id: v.id("todo"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return await ctx.db.patch(args.id, {
      isCompleted: args.isCompleted,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Share a todo with other users
export const shareTodo = mutation({
  args: {
    id: v.id("todo"),
    sharedWith: v.array(v.id("profile")),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return await ctx.db.patch(args.id, {
      isShared: true,
      sharedWith: args.sharedWith,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Stop sharing a todo
export const stopSharing = mutation({
  args: {
    id: v.id("todo"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return await ctx.db.patch(args.id, {
      isShared: false,
      sharedWith: [],
      updatedAt: new Date().toISOString(),
    });
  },
});

// Add a user to share with
export const addUserToShare = mutation({
  args: {
    id: v.id("todo"),
    userId: v.id("profile"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    const sharedWith = todo.sharedWith || [];
    if (!sharedWith.includes(args.userId)) {
      sharedWith.push(args.userId);
    }

    return await ctx.db.patch(args.id, {
      isShared: true,
      sharedWith,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Remove a user from sharing
export const removeUserFromShare = mutation({
  args: {
    id: v.id("todo"),
    userId: v.id("profile"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    const sharedWith = (todo.sharedWith || []).filter(
      (id) => id !== args.userId
    );

    return await ctx.db.patch(args.id, {
      isShared: sharedWith.length > 0,
      sharedWith,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Get todos by subject
export const getBySubject = query({
  args: {
    userId: v.id("profile"),
    subjectId: v.id("subject"),
  },
  handler: async (ctx, args) => {
    // Get todos owned by the user for this subject
    const ownedTodos = await ctx.db
      .query("todo")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("relatedSubjectId"), args.subjectId)
        )
      )
      .collect();

    // Get todos shared with the user for this subject
    const sharedTodos = await ctx.db
      .query("todo")
      .filter((q) => q.eq(q.field("isShared"), true)) // First filter by isShared
      .collect();

    // Manually filter sharedTodos to include only those where sharedWith includes args.userId
    const filteredSharedTodos = sharedTodos.filter(
      (todo) =>
        todo.sharedWith?.includes(args.userId) &&
        todo.relatedSubjectId === args.subjectId
    );

    // Combine and return all todos for this subject
    return [...ownedTodos, ...filteredSharedTodos];
  },
});

// Get todos by due date range
export const getByDueDate = query({
  args: {
    userId: v.id("profile"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all todos for the user
    const allTodos = await ctx.db
      .query("todo")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get todos shared with the user
    const sharedTodos = await ctx.db
      .query("todo")
      .filter((q) => q.eq(q.field("isShared"), true)) // First filter by isShared
      .collect();

    // Manually filter sharedTodos to include only those where sharedWith includes args.userId
    const filteredSharedTodos = sharedTodos.filter((todo) =>
      todo.sharedWith?.includes(args.userId)
    );

    // Combine all accessible todos
    const accessibleTodos = [...allTodos, ...filteredSharedTodos];

    // Filter todos by due date range
    return accessibleTodos.filter((todo) => {
      if (!todo.dueDate) return false;
      return todo.dueDate >= args.startDate && todo.dueDate <= args.endDate;
    });
  },
});

// Get todos by priority
export const getByPriority = query({
  args: {
    userId: v.id("profile"),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all todos for the user with the specified priority
    const ownedTodos = await ctx.db
      .query("todo")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("priority"), args.priority)
        )
      )
      .collect();

    // Get todos shared with the user with the specified priority
    const sharedTodos = await ctx.db
      .query("todo")
      .filter((q) => q.eq(q.field("isShared"), true)) // First filter by isShared
      .collect();

    // Manually filter sharedTodos to include only those where sharedWith includes args.userId
    const filteredSharedTodos = sharedTodos.filter(
      (todo) =>
        todo.sharedWith?.includes(args.userId) &&
        todo.priority === args.priority
    );

    // Combine and return all todos with the specified priority
    return [...ownedTodos, ...filteredSharedTodos];
  },
});

// List all todos for the current user
export const list = query({
    handler: async (ctx) => {
      return await ctx.db.query("todo").collect();
    },
  });

// Toggle todo completion status
export const toggleComplete = mutation({
  args: {
    id: v.id("todo"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error("Todo not found");

    return await ctx.db.patch(args.id, {
      isCompleted: args.isCompleted,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Share a todo
export const share = mutation({
  args: {
    id: v.id("todo"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error("Todo not found");

    return await ctx.db.patch(args.id, {
      isShared: true,
      updatedAt: new Date().toISOString(),
    });
  },
});