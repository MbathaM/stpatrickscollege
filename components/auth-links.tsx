"use client";

import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "@/components/user-dropdown";
import { authClient } from "@/lib/auth-client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
 
export function AuthLinks() {
  const { data } = authClient.useSession()
  const user = data?.user
  const session = data?.session

  if (session && user) {
    return (
      <div className="flex gap-4">
        <UserDropdown user={user} />
      </div>

    );
  }
  return (
    <Link
      href="/sign-in"
      className={buttonVariants({ variant: "outline", size: "sm",className: "rounded-full font-bold text-blue-500" })}
    >
      sign in
      <ChevronRight className="animate-pulse ml-0 font-bold text-blue-500 h-4 w-4" />
    </Link>

  );
}
