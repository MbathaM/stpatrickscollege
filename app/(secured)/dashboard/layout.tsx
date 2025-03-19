import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/convex/_generated/api";
import { getSession } from "@/helpers/get-sessions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Get the user session
  const data = await getSession();
  const email = data?.user?.email;

  if (!email) {
    redirect("/sign-in");
  }

 // Determine the user's role from their email
  const role = preloadedQueryResult (await preloadQuery(api.profile.determineRoleFromEmail, { email }));
  
  // Get the user's profile
  const profile = preloadedQueryResult (await preloadQuery(api.profile.getByEmail, { email }));
  
  // If profile is not complete, redirect to onboarding
  if (!profile || !profile.isComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar role={role as "teacher" | "student"} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
