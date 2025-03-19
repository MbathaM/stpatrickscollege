import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { v } from "convex/values";

// Function to get all students with their subjects, grades, and exams
// Also calculates adjusted exam durations based on concession time
export const getStudentsWithExams = query({
  handler: async (ctx) => {
    // Get all profiles with role "student"
    const studentProfiles = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();

    // Get all exams, grades, and subjects for later use
    const exams = await ctx.db.query("exam").collect();
    const grades = await ctx.db.query("grade").collect();
    const subjects = await ctx.db.query("subject").collect();

    // Process each student profile
    const studentsWithExams = await Promise.all(
      studentProfiles.map(async (profile) => {
        // Get the ad_user information for this profile
        const adUser = await ctx.db.get(profile.userId);

        // Find all exams that match this student's grade and subjects
        const matchingExams = exams.filter((exam) => {
          // Check if the exam's grade is in the student's grades
          const gradeMatch = profile.gradeIds?.includes(exam.gradeId);
          // Check if the exam's subject is in the student's subjects
          const subjectMatch = profile.subjectIds?.includes(exam.subjectId);
          
          return gradeMatch && subjectMatch;
        });

        // Process each matching exam to include additional information
        const processedExams = matchingExams.map((exam) => {
          // Find the grade and subject information for this exam
          const grade = grades.find((g) => g._id === exam.gradeId);
          const subject = subjects.find((s) => s._id === exam.subjectId);

          // Calculate the new duration based on concession time (if applicable)
          let newDuration = exam.duration;
          
          if (profile.hasConcession && profile.concessionTime) {
            // Calculate how many full hours the exam duration covers
            const fullHours = Math.ceil(exam.duration / 60);
            
            // Add concession time for each hour (or part thereof)
            newDuration = exam.duration + (fullHours * profile.concessionTime);
          }

          return {
            _id: exam._id,
            name: exam.name,
            duration: exam.duration, // Original duration
            newDuration: newDuration, // Adjusted duration with concession
            date: exam.date,
            grade: grade ? grade.name : null,
            subject: subject ? subject.name : null,
          };
        });

        // Return the student with their exams
        return {
          _id: profile._id,
          userId: profile.userId,
          name: adUser ? `${adUser.givenName} ${adUser.surname}` : "Unknown",
          email: adUser ? adUser.email : null,
          isStudent: profile.role === "student",
          hasConcession: profile.hasConcession || false,
          concessionType: profile.concessionType || null,
          concessionTime: profile.concessionTime || null,
          exams: processedExams,
        };
      })
    );

    return studentsWithExams;
  },
});

// Function to get all students with their exams for a specific date
export const getStudentsWithExamsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    // Get all profiles with role "student"
    const studentProfiles = await ctx.db
      .query("profile")
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();

    // Get all exams, grades, and subjects for later use
    const exams = await ctx.db.query("exam").collect();
    const grades = await ctx.db.query("grade").collect();
    const subjects = await ctx.db.query("subject").collect();

    // Process each student profile
    const studentsWithExams = await Promise.all(
      studentProfiles.map(async (profile) => {
        // Get the ad_user information for this profile
        const adUser = await ctx.db.get(profile.userId);

        // Find all exams that match this student's grade and subjects AND the specified date
        const matchingExams = exams.filter((exam) => {
          // Check if the exam's grade is in the student's grades
          const gradeMatch = profile.gradeIds?.includes(exam.gradeId);
          // Check if the exam's subject is in the student's subjects
          const subjectMatch = profile.subjectIds?.includes(exam.subjectId);
          // Check if the exam is on the specified date
          const dateMatch = exam.date === args.date;
          
          return gradeMatch && subjectMatch && dateMatch;
        });

        // Process each matching exam to include additional information
        const processedExams = matchingExams.map((exam) => {
          // Find the grade and subject information for this exam
          const grade = grades.find((g) => g._id === exam.gradeId);
          const subject = subjects.find((s) => s._id === exam.subjectId);

          // Calculate the new duration based on concession time (if applicable)
          let newDuration = exam.duration;
          
          if (profile.hasConcession && profile.concessionTime) {
            // Calculate how many full hours the exam duration covers
            const fullHours = Math.ceil(exam.duration / 60);
            
            // Add concession time for each hour (or part thereof)
            newDuration = exam.duration + (fullHours * profile.concessionTime);
          }

          return {
            _id: exam._id,
            name: exam.name,
            duration: exam.duration, // Original duration
            newDuration: newDuration, // Adjusted duration with concession
            date: exam.date,
            grade: grade ? grade.name : null,
            subject: subject ? subject.name : null,
          };
        });

        // Return the student with their exams
        return {
          _id: profile._id,
          userId: profile.userId,
          name: adUser ? `${adUser.givenName} ${adUser.surname}` : "Unknown",
          email: adUser ? adUser.email : null,
          isStudent: profile.role === "student",
          hasConcession: profile.hasConcession || false,
          concessionType: profile.concessionType || null,
          concessionTime: profile.concessionTime || null,
          exams: processedExams,
        };
      })
    );

    // Filter out students who don't have any exams on the specified date
    const studentsWithExamsOnDate = studentsWithExams.filter(
      (student) => student.exams.length > 0
    );

    return studentsWithExamsOnDate;
  },
});

// Function to get a specific student with their exams
export const getStudentWithExams = query({
  args: { profileId: v.id("profile") },
  handler: async (ctx, args) => {
    // Get the student profile
    const profile = await ctx.db.get(args.profileId);
    
    if (!profile || profile.role !== "student") {
      throw new Error("Student profile not found");
    }

    // Get the ad_user information
    const adUser = await ctx.db.get(profile.userId);

    // Get all exams that match this student's grade and subjects
    const exams = await ctx.db.query("exam").collect();
    const grades = await ctx.db.query("grade").collect();
    const subjects = await ctx.db.query("subject").collect();

    // Find matching exams
    const matchingExams = exams.filter((exam) => {
      const gradeMatch = profile.gradeIds?.includes(exam.gradeId);
      const subjectMatch = profile.subjectIds?.includes(exam.subjectId);
      return gradeMatch && subjectMatch;
    });

    // Process each matching exam
    const processedExams = matchingExams.map((exam) => {
      const grade = grades.find((g) => g._id === exam.gradeId);
      const subject = subjects.find((s) => s._id === exam.subjectId);

      // Calculate the new duration based on concession time
      let newDuration = exam.duration;
      
      if (profile.hasConcession && profile.concessionTime) {
        // Calculate how many full hours the exam duration covers
        const fullHours = Math.ceil(exam.duration / 60);
        
        // Add concession time for each hour (or part thereof)
        newDuration = exam.duration + (fullHours * profile.concessionTime);
      }

      return {
        _id: exam._id,
        name: exam.name,
        duration: exam.duration,
        newDuration: newDuration,
        date: exam.date,
        grade: grade ? grade.name : null,
        subject: subject ? subject.name : null,
      };
    });

    // Return the student with their exams
    return {
      _id: profile._id,
      userId: profile.userId,
      name: adUser ? `${adUser.givenName} ${adUser.surname}` : "Unknown",
      email: adUser ? adUser.email : null,
      isStudent: profile.role === "student",
      hasConcession: profile.hasConcession || false,
      concessionType: profile.concessionType || null,
      concessionTime: profile.concessionTime || null,
      exams: processedExams,
    };
  },
});