import { getSession } from "@/helpers/get-sessions";
import { OnboardingStudentForm } from "./student-form";
import { OnboardingTeacherForm } from "./teacher-form";
import { getRoleByEmail } from "@/lib/utils";
import { getGrades, getSubjects } from "@/helpers/get-grade_subjects";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function OnboardingPage() {
  const { user } = await getSession();

  const email = user?.email as string;
  const role = getRoleByEmail(email);
  const grades = await getGrades();
  const subjects = await getSubjects();

  const ad_user = preloadedQueryResult(
    await preloadQuery(api.ad_user.getByUserEmail, { email: email })
  );

  if (role === "teacher") {
    return (
      <OnboardingTeacherForm
        subjects={subjects}
        grades={grades}
        ad_user={ad_user}
      />
    );
  } else
    return (
      <OnboardingStudentForm
        subjects={subjects}
        grades={grades}
        ad_user={ad_user}
      />
    );
}
