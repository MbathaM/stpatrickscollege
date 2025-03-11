import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { authOptions } from "@/utils/auth.options";
import { customSession } from "better-auth/plugins";
import { siteConfig } from "@/config/site";
// import { createAuthMiddleware } from "better-auth/api";
import { createAdUser } from "./create-ad-user";

export const auth = betterAuth({
  appName: siteConfig.name,
  ...authOptions,
  // hooks: {
  //   after: createAuthMiddleware(async (ctx) => {
  //     if (ctx.path.startsWith("/sign-in")) {
  //       const newSession = ctx.context.newSession;
  //       if (newSession) {
  //         // const { user, error } = await getAdUserByEmail(newSession.user.email);
  //         // if (error) {
  //         //   throw new APIError("BAD_REQUEST", {
  //         //     message: error,
  //         //   });
  //         // }
  //         // if (!user) {
  //         //   throw new APIError("BAD_REQUEST", {
  //         //     message: "User not found",
  //         //   });
  //         // }
  //         const email = newSession.user.email;
  //         const userId = newSession.user.id;
  //         const response = await createAdUser(email, userId);
  //         if (response.error) {
  //           throw new APIError("BAD_REQUEST", {
  //             message: response.error,
  //           });
  //         }
  //       }
  //     }
  //   }),
  // },
  databaseHooks: {
    user: {
      create: {
        after: async (user, ctx) => {
          //perform additional actions, like creating a stripe customer
          const response = await createAdUser(user.email, user.id);
          if (response.error) {
            throw new APIError("BAD_REQUEST", {
              message: response.error,
            });
          }
        },
      },
    },
  },
  plugins: [
    ...(authOptions.plugins ?? []),
    customSession(async ({ user, session }) => {
      // now both user and session will infer the fields added by plugins and your custom fields
      return {
        user,
        session,
      };
    }, authOptions), // pass options here
  ],
});
