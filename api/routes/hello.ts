import { Hono } from "hono";

const helloRoute = new Hono().get("/hello", async (c) => {
  try {
    return c.json({ message: "Melusi Mbatha" }, 200);
  } catch (error) {
    console.error("Error handling /hello request:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

export { helloRoute };
