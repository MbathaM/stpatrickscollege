import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const initGrades = mutation({
  handler: async (ctx) => {
    // Check if grades already exist
    const existingGrades = await ctx.db.query("grade").collect();
    if (existingGrades.length > 0) {
      return { status: "skipped", message: "Grades already initialized" };
    }

    // Create grades from 1 to 12
    const grades = [];
    for (let gradeNumber = 1; gradeNumber <= 12; gradeNumber++) {
      const grade = await ctx.db.insert("grade", {
        name: gradeNumber,
      });
      grades.push(grade);
    }

    return { status: "success", message: "Grades initialized successfully", grades };
  },
});