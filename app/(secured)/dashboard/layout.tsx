import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ReactNode } from "react";
import { getSession } from "@/helpers/get-sessions";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";

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

  // Create a Convex HTTP client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  // Determine the user's role from their email
  const role = await convex.query(api.profile.determineRoleFromEmail, { email });
  
  // Get the user's profile
  const profile = await convex.query(api.profile.getByEmail, { email });
  
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
