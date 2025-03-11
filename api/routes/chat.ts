import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { OpenAI } from "openai";

const schema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string()
  })).optional(),
});

const chatRoute = new Hono().post(
  "/chat",
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid input!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { message, history = [] } = c.req.valid("json");

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      // Prepare messages array with history and new message
      const messages = [
        ...history,
        { role: "user", content: message }
      ];

      // Create a streaming response
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })) as OpenAI.Chat.ChatCompletionMessageParam[],
        stream: true,
      });

      // Set up streaming response
      c.header("Content-Type", "text/event-stream");
      c.header("Cache-Control", "no-cache");
      c.header("Connection", "keep-alive");

      // Create a readable stream to send to the client
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } catch (error) {
      console.error("Error in chat completion:", error);
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
);

export { chatRoute };