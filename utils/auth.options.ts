import { sendSignInEmail, sendVerifyAccountEmail, sendForgotPasswordEmail } from "@/lib/send-email";
import { BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { convexAdapter } from "@better-auth-kit/convex";
import { getAdUserByEmail } from "@/helpers/get-ad-user";
import { ConvexClient } from "convex/browser";

const convexClient = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const authOptions = {
  //...config options
  secret: process.env.BETTER_AUTH_SECRET,
  database: convexAdapter(convexClient),
  rateLimit: {
    storage: "database",
  },
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["microsoft"]
    },
  },
  plugins: [
    //...plugins
    emailOTP({
      disableSignUp: false,
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
        // Check if the email belongs to an existing Azure AD user before proceeding
        const { user, error } = await getAdUserByEmail(email);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (error !== null)
          throw new APIError("BAD_REQUEST", {
            message: error,
          });

        const givenName = user?.givenName as string;
        const surname = user?.surname as string;

        if (type === "sign-in") {
          await sendSignInEmail(email, givenName, surname, otp);
        } else if (type === "email-verification") {
          await sendVerifyAccountEmail(email, givenName, surname, otp);
        } else {
          // Send the OTP for password reset
          await sendForgotPasswordEmail(email, givenName, surname, otp);
        }
      },
    }),
    nextCookies(),
  ]
} satisfies BetterAuthOptions;

export { authOptions }