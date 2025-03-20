"use client";

import { User } from "better-auth/types";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";

export default function ProfileGate({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const router = useRouter();

  // **Always call the hook, but use a fallback when user is null**
  const profile = useQuery(
    api.profile.getByEmail,
    user?.email ? { email: user.email } : "skip"
  );

  useEffect(() => {
    if (profile === undefined) return; // Wait until the query resolves

    if (!profile || !profile.isComplete) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  // **Return children immediately if user is not logged in**
  if (!user) return <>{children}</>;

  // **Show loading state while fetching**
  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="flex items-center text-sm">
          <Loader2 className="animate-spin mr-2" />
          Loading...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
