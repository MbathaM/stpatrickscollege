import { getSession } from "@/helpers/get-sessions";
import { getRoleByEmail } from "@/lib/utils";
import { redirect } from "next/navigation";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { OnboardingStudentForm } from "./student-form";
import { OnboardingTeacherForm } from "./teacher-form"; // Ensure this import is correct
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export default async function OnboardingPage() {
  const { user, session } = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

const email = user?.email as Id<"profile">;
  const profile = preloadedQueryResult(await preloadQuery(api.profile.getByEmail, { email }));

  if (!profile) {
    redirect("/sign-in");
  }
  if (profile?.isComplete == true) {
    redirect("/dashboard");
  }
const role = profile?.role;
  // const role = getRoleByEmail(user?.email || "");
  return role === "teacher" ? (
    <OnboardingTeacherForm email={email} />
  ) : (
    <OnboardingStudentForm email={email} />
  );
}
