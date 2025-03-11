// hooks/use-azure-user.ts
import { getAdUsers } from "@/helpers/get-ad-user";
import { AzureUser } from "@/types";
import { useEffect, useState } from "react";

export const useAzureUser = (email: string): { user: AzureUser | null; loading: boolean; error: string | null } => {
  const [user, setUser] = useState<AzureUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users from Azure AD
        const users = await getAdUsers();

        // Find the user with the matching email
        const foundUser = users.find((user) => user.mail === email);

        if (foundUser) {
          setUser(foundUser);
        } else {
          setError("User not found in Azure AD.");
        }
      } catch (error) {
        console.error("Error fetching Azure AD users:", error);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  return { user, loading, error };
};