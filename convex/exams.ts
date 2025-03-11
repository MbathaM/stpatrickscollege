import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    duration: v.number(),
    gradeId: v.id("grade"),
    subjectId: v.id("subject"),
    teacherId: v.id("profile"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate that the grade exists
    const grade = await ctx.db.get(args.gradeId);
    if (!grade) {
      throw new Error(`Grade with ID ${args.gradeId} not found`);
    }

    // Validate that the subject exists
    const subject = await ctx.db.get(args.subjectId);
    if (!subject) {
      throw new Error(`Subject with ID ${args.subjectId} not found`);
    }

    // Validate that the teacher exists and is a teacher
    const teacher = await ctx.db.get(args.teacherId);
    if (!teacher) {
      throw new Error(`Teacher with ID ${args.teacherId} not found`);
    }
    if (teacher.role !== "teacher") {
      throw new Error(`Profile with ID ${args.teacherId} is not a teacher`);
    }

    const now = new Date().toISOString();
    
    return await ctx.db.insert("exam", {
      name: args.name,
      duration: args.duration,
      gradeId: args.gradeId,
      subjectId: args.subjectId,
      teacherId: args.teacherId,
      date: args.date,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("exam").collect();
  },
});

export const getById = query({
  args: { id: v.id("exam") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByGrade = query({
  args: { gradeId: v.id("grade") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exam")
      .filter((q) => q.eq(q.field("gradeId"), args.gradeId))
      .collect();
  },
});

export const getBySubject = query({
  args: { subjectId: v.id("subject") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exam")
      .filter((q) => q.eq(q.field("subjectId"), args.subjectId))
      .collect();
  },
});

export const getByTeacher = query({
  args: { teacherId: v.id("profile") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exam")
      .filter((q) => q.eq(q.field("teacherId"), args.teacherId))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("exam"),
    name: v.optional(v.string()),
    duration: v.optional(v.number()),
    gradeId: v.optional(v.id("grade")),
    subjectId: v.optional(v.id("subject")),
    teacherId: v.optional(v.id("profile")),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    
    // Validate that the exam exists
    const exam = await ctx.db.get(id);
    if (!exam) {
      throw new Error(`Exam with ID ${id} not found`);
    }

    // Validate grade if provided
    if (fields.gradeId) {
      const grade = await ctx.db.get(fields.gradeId);
      if (!grade) {
        throw new Error(`Grade with ID ${fields.gradeId} not found`);
      }
    }

    // Validate subject if provided
    if (fields.subjectId) {
      const subject = await ctx.db.get(fields.subjectId);
      if (!subject) {
        throw new Error(`Subject with ID ${fields.subjectId} not found`);
      }
    }

    // Validate teacher if provided
    if (fields.teacherId) {
      const teacher = await ctx.db.get(fields.teacherId);
      if (!teacher) {
        throw new Error(`Teacher with ID ${fields.teacherId} not found`);
      }
      if (teacher.role !== "teacher") {
        throw new Error(`Profile with ID ${fields.teacherId} is not a teacher`);
      }
    }

    // Add updatedAt timestamp
    const updatedFields = {
      ...fields,
      updatedAt: new Date().toISOString(),
    };

    return await ctx.db.patch(id, updatedFields);
  },
});

export const remove = mutation({
  args: {
    id: v.id("exam"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("exam").collect()).length;
  },
});