import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const initSubjects = mutation({
  handler: async (ctx) => {
    // Check if subjects already exist
    const existingSubjects = await ctx.db.query("subject").collect();
    if (existingSubjects.length > 0) {
      return { status: "skipped", message: "Subjects already initialized" };
    }

    // List of subjects to initialize
    const subjectList = [
      "English", "Afrikaans", "isiXhosa", "Mathematics", "Natural Science",
      "Geography", "History", "Technology", "Music", "Art", "Dance", "Drama",
      "Economic Management Sciences", "Life Orientation", "Core Mathematics",
      "Mathematical Literacy", "Accounting", "Business Studies",
      "Information Technology", "Computer Application Technology", "Life Science", "Physical Science",
      "Engineering Graphics and Design", "Dramatic Arts", "Visual Art",
      "AP English", "AP Afrikaans", "AP Mathematics"
    ];

    // Create subjects
    const subjects = [];
    for (const subjectName of subjectList) {
      const subject = await ctx.db.insert("subject", {
        name: subjectName,
      });
      subjects.push(subject);
    }

    return { status: "success", message: "Subjects initialized successfully", subjects };
  },
});