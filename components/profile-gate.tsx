import { User } from "better-auth/types";
import {  DataModel } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type Profile = DataModel["profile"]["document"] | null
export default function ProfileGate({
  children,
  user,
  profile,
  pathname
}: {
  children: React.ReactNode;
  user: User | null;
  profile: Profile
  pathname: string
}) {

  // **Return children immediately if user is not logged in**
  if (!user) return <>{children}</>;

  // Get the current path from headers to work in both client and server components

  const isOnboardingPage = pathname.includes("/onboarding");

  // Only redirect to onboarding if profile is incomplete AND we're not already on the onboarding page
  if (user && profile?.isComplete === false && !isOnboardingPage) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
