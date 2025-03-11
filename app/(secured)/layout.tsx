import Unauthorised from "@/components/errors/unauthorized";
import ProfileGate from "@/components/profile-gate";
import { getSession } from "@/helpers/get-sessions";

export default async function SecuredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getSession();
  const user = data?.user;
  if (!user) {
    return <Unauthorised />
  }
  return <ProfileGate user={user}>{ children }</ProfileGate>;
}
