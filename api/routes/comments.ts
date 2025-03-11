import { getAdUserById } from "@/helpers/get-ad-user";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";

const schema = z.object({
  grade: z.string(),
  subject: z.string(),
  student: z.string(),
  marks: z.string().optional(),
  prompt: z.string(),
});
const commentRoute = new Hono().post(
  "/comment",
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { grade, subject, student, marks, prompt } = c.req.valid("json");
    const { user } = await getAdUserById(student);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    const givenName = user.givenName;
    console.log(grade, subject, givenName, marks, prompt); //all value passed

    const model = "@hf/thebloke/llama-2-13b-chat-awq";
    // const model = "@cf/meta/llama-2-7b-chat-fp16";
    const messages = [
      {
        role: "system",
        content: `You are a highly professional and experienced Grade ${grade} ${subject} teacher. 
      Your role is to provide insightful and constructive comments on a learner's academic performance. 
      
      - If the learner's marks are provided (${marks}), incorporate them into your feedback where relevant.  
      - Your comments should be addressed to the parent or guardian, **not** directly to the learner.  
      - Keep the comment within **400 characters**, maintaining a professional, calm, and supportive tone.  
      - Demonstrate a deep understanding of the learner's progress while offering thoughtful insights in a friendly and encouraging manner.  

      **Comment Guidelines:**  
      1. Start by stating the learner's name: **"${givenName} is..."**  
      2. **Avoid** using the term **"student"**; instead, use **"learner"** or **"pupil"**.  
      3. Use the provided prompt ("${prompt}") as a guide to shape the direction of your comment.  
      
      **IMPORTANT OUTPUT INSTRUCTIONS:**
      - Return ONLY the comment text itself, with no introductory phrases like "Here's a comment" or "Sure, here's a sample"
      - Do NOT include any meta information like character count or formatting notes
      - Do NOT include any quotation marks around the comment
      - Start directly with "${givenName} is..." and end with the last sentence of your comment
      
      Ensure your response is **concise, insightful, and encouraging**.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`,
        {
          headers: { 
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            "Content-Type": "application/json",  // ✅ Ensure JSON content-type
          },
          method: "POST",
          body: JSON.stringify({ messages }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudflare API error:", response.status, errorData);
        return c.json(
          { error: "Failed to generate comment", status: response.status },
          500
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      // Return the response in a format that matches what the frontend expects
      return c.json(data.result.response, 200);
    } catch (error) {
      console.error("Error generating comment:", error);
      return c.json({ error: "An unexpected error occurred" }, 500);
    }
  }
);

export { commentRoute };
