import { headers } from "next/headers";
import {ProfilePageClient} from "./page-client";
import { auth } from "@/utils/auth";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id , DataModel } from "@/convex/_generated/dataModel";

type Profile = DataModel["profile"]["document"]
type Grade = DataModel["grade"]["document"]
type Subject = DataModel["subject"]["document"]

export default async function ProfilePage() {
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
  const profile = preloadedQueryResult(await preloadQuery(api.profile.getByEmail, { email })) as Profile
  
  // // Get role
  // const role = useQuery(api.profile.determineRoleFromEmail, email ? { email } : "skip");
  const role = preloadedQueryResult(await preloadQuery(api.profile.determineRoleFromEmail,{ email })) as string
  // // Get grades and subjects for teachers
  // const grades = useQuery(api.grade.list);
  const grades = preloadedQueryResult(await preloadQuery(api.grade.list)) as Grade[]
  // const subjects = useQuery(api.subject.list);
  const subjects = preloadedQueryResult(await preloadQuery(api.subject.list)) as Subject[]


  
  return <ProfilePageClient email={email} name={name} profile={profile} role={role} grades={grades} subjects={subjects} />
} 