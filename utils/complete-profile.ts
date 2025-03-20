import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation, fetchQuery } from "convex/nextjs";

type BaseProfileData = {
  userId: Id<"ad_user">;
  subjects: string[];
};

type StudentProfileData = BaseProfileData & {
  role: "student";
  gradeId: string;
  hasConcession: boolean;
  concessionType?: string;
  concessionTime?: number;
};

type TeacherProfileData = BaseProfileData & {
  role: "teacher";
  classroom: number;
  grades: string[];
};

type ProfileData = StudentProfileData | TeacherProfileData;

export async function completeProfile(data: ProfileData, email: string) {
  // First check if a profile already exists for this user
  const existingProfile = await fetchQuery(api.profile.getByUserEmail, {
    email,
  });

  if (data.role === "student") {
    const profileData = {
      role: "student",
      userId: data.userId,
      gradeIds: [data.gradeId as Id<"grade">], // Convert single gradeId to array with one element
      subjectIds: data.subjects.map((id) => id as Id<"subject">),
      permissions: ["student"], // Set default student permission
      hasConcession: data.hasConcession,
      concessionType: data.hasConcession ? data.concessionType : undefined,
      concessionTime: data.hasConcession ? data.concessionTime : undefined,
      isComplete: true,
    };

    // If profile exists, update it; otherwise create a new one
    if (existingProfile) {
      // Remove userId from update data as it's not allowed in the update operation
      const { userId, ...updateData } = profileData;
      return await fetchMutation(api.profile.update, {
        id: existingProfile._id,
        ...updateData,
      });
    } else {
      return await fetchMutation(api.profile.create, profileData);
    }
  } else {
    const profileData = {
      role: "teacher",
      userId: data.userId,
      classroom: data.classroom,
      gradeIds: data.grades.map((id) => id as Id<"grade">),
      subjectIds: data.subjects.map((id) => id as Id<"subject">),
      permissions: ["teacher"], // Set default teacher permission
      isComplete: true,
    };

    // If profile exists, update it; otherwise create a new one
    if (existingProfile) {
      // Remove userId from update data as it's not allowed in the update operation
      const { userId, ...updateData } = profileData;
      return await fetchMutation(api.profile.update, {
        id: existingProfile._id,
        ...updateData,
      });
    } else {
      return await fetchMutation(api.profile.create, profileData);
    }
  }
}
