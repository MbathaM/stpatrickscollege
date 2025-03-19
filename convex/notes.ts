import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


// List all todos for the current user
export const list = query({
    handler: async (ctx) => {
      return await ctx.db.query("note").collect();
    },
  });

// Create a new note
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    userId: v.id("profile"),
    isShared: v.optional(v.boolean()),
    sharedWith: v.optional(v.array(v.id("profile"))),
    color: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("note", {
      title: args.title,
      content: args.content,
      userId: args.userId,
      isShared: args.isShared || false,
      sharedWith: args.sharedWith || [],
      color: args.color,
      tags: args.tags || [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get a note by ID
export const getById = query({
  args: { id: v.id("note") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all notes for a user (including those shared with them)
export const getByUser = query({
  args: { userId: v.id("profile") },
  handler: async (ctx, args) => {
    // Get notes owned by the user
    const ownedNotes = await ctx.db
      .query("note")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get notes shared with the user
    const sharedNotes = await ctx.db
      .query("note")
      .filter((q) => q.eq(q.field("isShared"), true)) // First filter by isShared
      .collect();

    // Manually filter sharedNotes to include only those where sharedWith includes args.userId
    const filteredSharedNotes = sharedNotes.filter((note) =>
      note.sharedWith?.includes(args.userId)
    );

    // Combine and return all notes
    return [...ownedNotes, ...filteredSharedNotes];
  },
});

// Update a note
export const update = mutation({
  args: {
    id: v.id("note"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    isShared: v.optional(v.boolean()),
    sharedWith: v.optional(v.array(v.id("profile"))),
    color: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;

    // Check if the note exists
    const note = await ctx.db.get(id);
    if (!note) {
      throw new Error("Note not found");
    }

    // Update the note with the new fields
    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Delete a note
export const remove = mutation({
  args: { id: v.id("note") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Share a note with other users
export const shareNote = mutation({
  args: {
    id: v.id("note"),
    sharedWith: v.array(v.id("profile")),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }

    return await ctx.db.patch(args.id, {
      isShared: true,
      sharedWith: args.sharedWith,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Stop sharing a note
export const stopSharing = mutation({
  args: {
    id: v.id("note"),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
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
    id: v.id("note"),
    userId: v.id("profile"),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }

    const sharedWith = note.sharedWith || [];
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
    id: v.id("note"),
    userId: v.id("profile"),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }

    const sharedWith = (note.sharedWith || []).filter(
      (id) => id !== args.userId
    );

    return await ctx.db.patch(args.id, {
      isShared: sharedWith.length > 0,
      sharedWith,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Search notes by title or content
export const searchNotes = query({
  args: {
    userId: v.id("profile"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all notes for the user
    const allNotes = await ctx.db
      .query("note")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get notes shared with the user
    const sharedNotes = await ctx.db
      .query("note")
      .filter((q) => q.eq(q.field("isShared"), true)) // First filter by isShared
      .collect();

    // Manually filter sharedNotes to include only those where sharedWith includes args.userId
    const filteredSharedNotes = sharedNotes.filter((note) =>
      note.sharedWith?.includes(args.userId)
    );

    // Combine all accessible notes
    const accessibleNotes = [...allNotes, ...filteredSharedNotes];

    // Filter notes by search term (case-insensitive)
    const searchTermLower = args.searchTerm.toLowerCase();
    return accessibleNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTermLower) ||
        note.content.toLowerCase().includes(searchTermLower)
    );
  },
});

// Filter notes by tags
export const filterByTags = query({
  args: {
    userId: v.id("profile"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all notes for the user
    const allNotes = await ctx.db
      .query("note")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get notes shared with the user
    const sharedNotes = await ctx.db
      .query("note")
      .filter((q) => q.eq(q.field("isShared"), true)) // First filter by isShared
      .collect();

    // Manually filter sharedNotes to include only those where sharedWith includes args.userId
    const filteredSharedNotes = sharedNotes.filter((note) =>
      note.sharedWith?.includes(args.userId)
    );

    // Combine all accessible notes
    const accessibleNotes = [...allNotes, ...filteredSharedNotes];

    // Filter notes that have at least one of the specified tags
    return accessibleNotes.filter((note) => {
      const noteTags = note.tags || [];
      return args.tags.some((tag) => noteTags.includes(tag));
    });
  },
});