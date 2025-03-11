import { auth } from "@/utils/auth";
import { headers } from "next/headers";

type Session = (typeof auth.$Infer.Session)["session"];
type User = (typeof auth.$Infer.Session)["user"];

/**
 * Get the session for the current user
 * @returns The session and user
 */

export const getSession = async (): Promise<{
  user: User | null;
  session: Session | null;
}> => {
  "use server";
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { user: null, session: null };
  }
  return { user: session.user, session: session.session };
};
