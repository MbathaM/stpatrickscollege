import {
  preloadQuery,
  preloadedQueryResult,
  fetchMutation,
} from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAdUserByEmail } from "@/helpers/get-ad-user";
import { getRoleByEmail } from "@/lib/utils";
import { APIError } from "better-auth/api";

export async function afterDBCreate(
  email: string,
  id: string
): Promise<{ error: string | null; success: boolean }> {
  try {
    const { user, error } = await getAdUserByEmail(email);
    if (error) {
      throw new APIError("BAD_REQUEST", {
        message: error,
      });
    }
    if (user) {
      await fetchMutation(api.ad_user.create, {
        userId: id,
        intraId: user.id,
        displayName: user.displayName,
        givenName: user.givenName,
        surname: user.surname,
        mobilePhone: user.mobilePhone ?? undefined,
        email: user.mail,
      });
    }
    const ad_user = preloadedQueryResult(
      await preloadQuery(api.ad_user.getByUserEmail, { email })
    );
    if (!ad_user) {
      throw new APIError("BAD_REQUEST", {
        message: "AD user not found",
      });
    }

    const role = getRoleByEmail(email);
    await fetchMutation(api.profile.create, {
      userId: ad_user._id,
      role: role,
      isComplete: false,
    });

    return { error: null, success: true };
  } catch (error) {
    console.error("Error creating AD user:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create user",
      success: false,
    };
  }
}
