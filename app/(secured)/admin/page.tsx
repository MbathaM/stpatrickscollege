import { headers } from "next/headers";
import AdminDashboardPageClient from "./page-client";
import { api } from "@/convex/_generated/api";
import {
  preloadQuery,
  preloadedQueryResult,
  fetchMutation,
} from "convex/nextjs";
import { auth } from "@/utils/auth";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Not authenticated</div>;
  }
  const email = session?.user?.email || "";
  const name = session?.user?.name || "";

  const teacherCount = preloadedQueryResult(
    await preloadQuery(api.profile.countByRole, { role: "teacher" })
  );
  const studentCount = preloadedQueryResult(
    await preloadQuery(api.profile.countByRole, { role: "student" })
  );
  const subjectCount = preloadedQueryResult(
    await preloadQuery(api.subject.count)
  );
  const gradeCount = preloadedQueryResult(
    await preloadQuery(api.grade.count)
  );
  const examCount = preloadedQueryResult(
    await preloadQuery(api.exams.count)
  );

  return (
    <AdminDashboardPageClient
      name={name}
      email={email}
      teacherCount={teacherCount}
      studentCount={studentCount}
      subjectCount={subjectCount}
      gradeCount={gradeCount}
      examCount={examCount}
    />
  );
}
