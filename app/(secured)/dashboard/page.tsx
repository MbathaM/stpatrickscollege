import { api } from "@/convex/_generated/api";
import {
  preloadQuery,
  preloadedQueryResult,
  fetchMutation,
} from "convex/nextjs";
import DashboardPageClient from "./page-client";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
})
if(!session) {
    return <div>Not authenticated</div>
}
  const email = session?.user?.email || "";
  const name = session?.user?.name || "";

  // Get user profile
  // const profile = useQuery(api.profile.getByEmail, email ? { email } : "skip");
  const profile = preloadedQueryResult(
    await preloadQuery(api.profile.getByEmail, { email })
  );

  // Get role
  // const role = useQuery(api.profile.determineRoleFromEmail, email ? { email } : "skip");
  const role = preloadedQueryResult(
    await preloadQuery(api.profile.determineRoleFromEmail, { email })
  );
  // Get grades and subjects for teachers
  // const grades = useQuery(api.grade.list);
  const grades = preloadedQueryResult(await preloadQuery(api.grade.list));
  // const subjects = useQuery(api.subject.list);
  const subjects = preloadedQueryResult(await preloadQuery(api.subject.list));

  // Filter subjects and grades based on teacher's profile
  const teacherSubjects =
    subjects?.filter((subject) => profile?.subjectIds?.includes(subject._id)) ||
    [];

  const teacherGrades =
    grades?.filter((grade) => profile?.gradeIds?.includes(grade._id)) || [];

  return (
    <DashboardPageClient
      name={name}
      email={email}
      role={role}
      profile={profile}
      grades={teacherGrades}
      subjects={teacherSubjects}
    />
  );
}
