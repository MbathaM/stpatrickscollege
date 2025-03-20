import Unauthorised from "@/components/errors/unauthorized";
import ProfileGate from "@/components/profile-gate";
import { api } from "@/convex/_generated/api";
import { getSession } from "@/helpers/get-sessions";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { headers } from "next/headers";

export default async function SecuredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getSession();
  const headersList = headers();
  const pathname = (await headersList).get("x-pathname") || "";
  const user = data?.user;
  if (!user) {
    return <Unauthorised />
  }
  const email = user?.email as string;
  const profile = preloadedQueryResult(await preloadQuery(api.profile.getByEmail, { email }));
  return <ProfileGate user={user} profile={profile} pathname={pathname}>{ children }</ProfileGate>;
}
