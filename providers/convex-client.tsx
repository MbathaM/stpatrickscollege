// "use client";

// import { ConvexProvider, ConvexReactClient } from "convex/react";
// import { ReactNode } from "react";

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   return <ConvexProvider client={convex}>{children}</ConvexProvider>;
// }

"use client";
import { createAuthClient } from "better-auth/react";
import { useCallback, useMemo } from "react";
import {
  ConvexProvider,
  ConvexProviderWithAuth,
  ConvexReactClient,
} from "convex/react";
import { ReactNode } from "react";

const { useSession } = createAuthClient();

function useAuthFromBetterAuth() {
  const { data, isPending, error, refetch } = useSession();
  const session = data?.session;
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      // If session exists, return the access token, else return null
      if (!session) return null;

      // If forceRefreshToken is true, refetch session data
      if (forceRefreshToken) {
        await refetch();
      }

      return session?.token ?? null;
    },
    [session, refetch]
  );

  return useMemo(
    () => ({
      isLoading: isPending,
      isAuthenticated: !!session,
      fetchAccessToken,
    }),
    [isPending, session, fetchAccessToken]
  );
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthFromBetterAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}