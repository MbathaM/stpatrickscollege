import { APIError } from "better-auth/api";
import { client } from "@/api/client";

export async function createAdUser(
  email: string,
  userId: string
): Promise<{ error: string | null; success: boolean }> {
  try {
    const data = await client.api.aduser.$post({
      json: {
        email,
        userId,
      },
    });

    if ("error" in data && typeof data.error === "string") {
      throw new APIError("BAD_REQUEST", {
        message: data.error,
      });
    }
    return { error: null, success: true };
  } catch (error) {
    console.error("Error creating AD user:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create user",
      success: false,
    };
  }
}
