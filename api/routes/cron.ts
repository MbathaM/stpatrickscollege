import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";

const token = process.env.CRON_SECRET!;
const cronRoute = new Hono().get("/cron", bearerAuth({ token }), async (c) => {
  return c.json({ ok: true }, 200);
});

export { cronRoute };
