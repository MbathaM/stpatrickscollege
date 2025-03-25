import { getAdUsers } from "@/helpers/get-ad-user";
import { AzureUser } from "@/types";
import { CommentForm } from "./comment-form";
import { getGrades, getSubjects } from "@/helpers/get-grade_subjects";
import { api } from "@/convex/_generated/api";
import { auth } from "@/utils/auth";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { headers } from "next/headers";

async function getAzureUsers(): Promise<AzureUser[]> {
  const data = await getAdUsers();
  // console.log(data);
  return data;
}
export default async function CommentPage() {
  const data = await getAzureUsers();

  const session = await auth.api.getSession({
    headers: await headers()
})
if(!session) {
    return <div>Not authenticated</div>
}
  const email = session?.user?.email ?? "";

  // Get user profile
  const profile = preloadedQueryResult(
    await preloadQuery(api.profile.getByEmail, { email })
  );
  const grades = await getGrades();
  const subjects = await getSubjects();
  
  const users = data.map((user) => ({
    value: user.id,
    label: user.displayName,
  }));

  return <CommentForm profile={profile} grades={grades} subjects={subjects} users={users} />;
}
