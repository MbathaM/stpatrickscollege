import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getAdUserByEmail } from "@/helpers/get-ad-user";
import { Id } from "@/convex/_generated/dataModel";

// Create a schema for validating the request body
const createUserSchema = z.object({
  email: z.string().email(),
  userId: z.string(),
});

// Create a new Hono instance for the AD user routes
const adUserRoute = new Hono()
  // Route to create a new AD user
  .post(
    "/aduser",
    validator("json", (value, c) => {
      const parsed = createUserSchema.safeParse(value);
      if (!parsed.success) {
        return c.json({ error: parsed.error }, 400);
      }
      return parsed.data;
    }),
    async (c) => {
      const { email, userId } = c.req.valid("json");
      const { user: userData, error: userError } =
        await getAdUserByEmail(email);
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      try {
        if (userError || !userData) {
          return c.json({ error: userError || "User not found in AD" }, 404);
        }
        // Create the user in Convex
        const result = await convex.mutation(api.ad_user.create, {
          userId: userId as unknown as Id<"user">,
          intraId: userData.id,
          displayName: userData.displayName,
          givenName: userData.givenName,
          surname: userData.surname,
          email: userData.mail,
          mobilePhone: userData.mobilePhone || undefined,
        });

        return c.json({ success: true, id: result }, 201);
      } catch (error) {
        console.error("Error creating user:", error);
        return c.json({ error: "Failed to create user" }, 500);
      }
    }
  );

export { adUserRoute };
