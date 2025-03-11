import { getSession } from "@/helpers/get-sessions";
import { getRoleByEmail } from "@/lib/utils";
import { redirect } from "next/navigation";

import { OnboardingStudentForm } from "./student-form";
import { OnboardingTeacherForm } from "./teacher-form"; // Ensure this import is correct

export default async function OnboardingPage() {
  const { user, session } = await getSession();

  if (!session) {
    redirect("/sign-in");
  }
  const role = getRoleByEmail(user?.email || "");
  const email = user?.email ?? "";
  return role === "teacher" ? (
    <OnboardingTeacherForm email={email} />
  ) : (
    <OnboardingStudentForm email={email} />
  );
}
