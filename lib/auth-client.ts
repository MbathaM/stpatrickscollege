import { createAuthClient } from "better-auth/react"
import { customSessionClient, emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/utils/auth";
import { siteConfig } from "@/config/site";
import { APIError } from "better-auth/api";

export const authClient = createAuthClient({
    baseURL: siteConfig.url, // the base url of your auth server
    plugins: [
        emailOTPClient(),
        customSessionClient<typeof auth>(),
        inferAdditionalFields<typeof auth>()
    ],

    fetchOptions: {
        onError: (ctx) => {
            if (ctx.error.status === 429) {
                const retryAfter = ctx.error.headers.get("X-Retry-After");
                // console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
                throw new APIError("BAD_REQUEST", {
                    message: `Rate limit exceeded. Retry after ${retryAfter} seconds`,
                });
            } else {
                throw new APIError("BAD_REQUEST", {
                    message: ctx.error.message,
                });
            }
        },
    },
});

