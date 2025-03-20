import {
  preloadQuery,
  preloadedQueryResult,
  fetchMutation,
} from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAdUserByEmail, getAdUserById } from "@/helpers/get-ad-user";
import { getRoleByEmail } from "@/lib/utils";

/**
 * Manually creates a user in the system with proper records in user, ad_user, and profile tables
 * This function is flexible and will check if records already exist at each step
 * @param email - The email of the user (optional if id is provided)
 * @param id - The Azure AD user ID (optional if email is provided)
 * @returns A promise that resolves with information about created/existing records
 */
export async function manualCreateUser(email?: string, id?: string) {
  try {
    // Validate that at least one parameter is provided
    if (!email && !id) {
      throw new Error("Either email or id must be provided");
    }
    
    // Start by getting Azure AD user based on which parameter is provided
    const { user, error } = id 
      ? await getAdUserById(id)
      : await getAdUserByEmail(email!);

    if (error) {
      throw new Error(`Error fetching Azure AD user: ${error}`);
    }

    if (!user) {
      throw new Error(`User not found with ${id ? 'ID: ' + id : 'email: ' + email}`);
    }

    // Track which records were created vs retrieved
    const result = {
      success: true,
      userCreated: false,
      adUserCreated: false,
      profileCreated: false
    };

    // Extract email from user object if it wasn't provided
    if (!email && user.mail) {
      email = user.mail ?? "";
    }

    const emailLower = email ? email.toLowerCase() : "";
    
    // 1. Check if user record exists, create if not
    // Ensure email is defined before using it in preloadQuery
    if (!email) {
      throw new Error("Email is required but not available");
    }
    
    let record = preloadedQueryResult(
      await preloadQuery(api.user.getByUserEmail, { email: emailLower })
    );
    
    if (!record || !record._id) {
      // Construct name from AD user's given name and surname
      const name = `${user.givenName} ${user.surname}`.trim();
      
      // Create record in user table
      await fetchMutation(api.user.create, {
        name,
        email: emailLower,
      });
      
      // Get the created user information
      record = preloadedQueryResult(
        await preloadQuery(api.user.getByUserEmail, { email: emailLower })
      );
      
      if (!record || !record._id) {
        throw new Error(`Failed to create and retrieve user with email: ${email}`);
      }
      
      result.userCreated = true;
    }

    // 2. Check if ad_user record exists, create if not
    let ad_user = preloadedQueryResult(
      await preloadQuery(api.ad_user.getByUserEmail, { email: emailLower })
    );

    if (!ad_user || !ad_user._id) {
      // Create record in ad_user table
      await fetchMutation(api.ad_user.create, {
        userId: record._id,
        intraId: user.id,
        displayName: user.displayName,
        givenName: user.givenName,
        surname: user.surname,
        email: user.mail,
      });

      // Get the record of the new ad_user created
      ad_user = preloadedQueryResult(
        await preloadQuery(api.ad_user.getByUserEmail, { email: emailLower })
      );

      if (!ad_user || !ad_user._id) {
        throw new Error(`Failed to create and retrieve AD user with email: ${email}`);
      }
      
      result.adUserCreated = true;
    }

    // 3. Check if profile record exists, create if not
    const profile = preloadedQueryResult(
      await preloadQuery(api.profile.getByEmail, { email: emailLower })
    );

    if (!profile) {
      // Determine if user is a student or teacher
      const role = getRoleByEmail(ad_user.email);

      // Create record in profile table
      await fetchMutation(api.profile.create, {
        userId: ad_user._id,
        role,
        isComplete: false,
      });
      
      result.profileCreated = true;
    }
    
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
