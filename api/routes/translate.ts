import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

const schema = z.object({
  text: z.string(),
  sourceLanguage: z.string().optional(),
  targetLanguage: z.string(),
});

const translateRoute = new Hono().post(
  "/translate",
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid input!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { text, sourceLanguage, targetLanguage } = c.req.valid("json");

    // Using M2M100 model for translation
    const model = "@cf/meta/m2m100-1.2b";

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
            text,
            source_lang: sourceLanguage,
            target_lang: targetLanguage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudflare API error:", response.status, errorData);
        return c.json(
          { error: "Failed to translate text", status: response.status },
          500
        );
      }

      const data = await response.json();
      console.log("Success:", data.result.translated_text);
      return c.json(data.result.translated_text, 200);
    } catch (error) {
      console.error("Error translating text:", error);
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
);

export { translateRoute };