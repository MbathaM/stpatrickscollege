import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

const schema = z.object({
  prompt: z.string(),
});

const summarizeRoute = new Hono().post(
  "/summarize",
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid input!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { prompt } = c.req.valid("json");

    // Using BART model for summarization
    const model = "@cf/facebook/bart-large-cnn";

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`,
        {
          headers: { 
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            text: prompt,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudflare API error:", response.status, errorData);
        return c.json(
          { error: "Failed to generate summary", status: response.status },
          500
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      return c.json(data.result.summary, 200);
    } catch (error) {
      console.error("Error generating summary:", error);
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
);

export { summarizeRoute };