import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ReactNode } from "react";
import { getSession } from "@/helpers/get-sessions";
import { redirect } from "next/navigation";
import Unauthorised from "@/components/errors/unauthorized";
import { getRoleByEmail } from "@/lib/utils";
export default async function AdminLayout({
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

  // If the user is not an teacher, block them from accessing the admin dashboard
  const role = getRoleByEmail(email);

  if (role == "student") {
   return <Unauthorised />
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
