import { User } from "better-auth/types";
import {  DataModel } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";

type Profile = DataModel["profile"]["document"] | null
export default function ProfileGate({
  children,
  user,
  profile
}: {
  children: React.ReactNode;
  user: User | null;
  profile: Profile
}) {

  // **Return children immediately if user is not logged in**
if (!user) return <>{children}</>;

if (user && profile?.isComplete === false) {
  redirect("/onboarding");
  }

  return <>{children}</>;
}
