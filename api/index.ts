import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import type { ContextVariables } from "@/types";
import { commentRoute } from "./routes/comments";
import { auth } from "@/utils/auth";
import { cronRoute } from "./routes/cron";
import { helloRoute } from "./routes/hello";
import { adUserRoute } from "./routes/aduser";
import { summarizeRoute } from "./routes/summarize";
import { translateRoute } from "./routes/translate";
import { chatRoute } from "./routes/chat";
import { siteConfig } from "@/config/site";

const app = new Hono<{ Variables: ContextVariables }>().basePath("/api");
const origin = siteConfig.url as string;
app.use("*", logger()).use("*", prettyJSON());
app.use(
  "/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: origin, // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/", helloRoute)
  .route("/", cronRoute)
  .route("/", commentRoute)
  .route("/", adUserRoute)
  .route("/", summarizeRoute)
  .route("/", translateRoute)
  .route("/", chatRoute);

export type ApiType = typeof routes;
export { app };
