"use server";

import { AzureUser } from "@/types";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";

// Function to fetch all users from Azure AD
export async function getAdUsers(): Promise<AzureUser[]> {
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID!,
    process.env.AZURE_CLIENT_ID!,
    process.env.AZURE_CLIENT_SECRET!
  );

  const client = Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken(
          "https://graph.microsoft.com/.default"
        );
        return token.token;
      },
    },
  });

  let users: AzureUser[] = [];
  let nextLink: string | null = "/users"; // Initial API endpoint

  while (nextLink) {
    const response = await client.api(nextLink).get();
    if (response.value) {
      users = [...users, ...response.value]; // Append all user objects
    }
    nextLink = response["@odata.nextLink"] || null; // Check for next page
  }

  return users;
}

export async function getAdUserById(
  userId: string
): Promise<{ error: string | null; user: AzureUser | null }> {
  if (!userId || userId.trim() === "") {
    return {
      error: "User ID is required",
      user: null,
    };
  }

  // Fetch Azure AD users
  const azureUsers = await getAdUsers();

  // Find the user by ID
  const foundUser = azureUsers.find((user) => user.id === userId);

  if (!foundUser) {
    return {
      error: "User not found with the provided ID. Please verify the ID or contact IT support at it@stpatrickscollege.co.za",
      user: null,
    };
  }
  
  return { error: null, user: foundUser };
}

export async function getAdUserByEmail(
  email: string
): Promise<{ error: string | null; user: AzureUser | null }> {
  if (!email || email.trim() === "") {
    return {
      error: "Email is required",
      user: null,
    };
  }

  // Fetch Azure AD users
  const azureUsers = await getAdUsers();

  // Find the user by email
  const foundUser = azureUsers.find((user) => user.mail === email);

  if (!foundUser) {
    return {
      error: "User not found with the provided email. Please verify the email or contact IT support at it@stpatrickscollege.co.za",
      user: null,
    };
  }

  return { error: null, user: foundUser };
}