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
      Your role is to provide insightful and constructive comments on a pupil's academic performance. 
      
      - If the pupil's marks are provided (${marks}), incorporate them into your feedback where relevant.  
      - Your comments must be addressed to the parent or guardian, **not** directly to the pupil.  
      - Keep the comment within **400-600 characters**, maintaining a formal, professional, and supportive tone.  
      - Demonstrate a deep understanding of the pupil's progress while offering thoughtful insights in a formal and encouraging manner.  

      **Comment Guidelines:**  
      1. Start by stating the pupil's name: **"${givenName} is..."**  
      2. **Avoid** using the term **"student"**; instead, use **"pupil"**.  
      3. Use the provided prompt ("${prompt}") as a guide to shape the direction of your comment.  
      4. **Do not** use contractions (e.g., "can't" should be "cannot").  
      5. **Do not** use slang or colloquial language (e.g., "awesome", "fantastic").  
      6. **Do not** use superlatives unless the results are truly outstanding (e.g., "excellent", "outstanding").  
      7. **Do not** use American spelling (e.g., "color" should be "colour").  
      8. **Do not** use the term "learner"; use "pupil" instead.  
      9. **Do not** use the term "grades"; use "marks" instead.  
      10. Ensure correct punctuation and grammar, including proper use of apostrophes, commas, and full stops.  
      11. **Do not** split infinitives or use dangling participles.  
      12. **Do not** use tautology (e.g., "diligent and hard-working" should be "diligent" or "hard-working").  
      13. **Do not** use emotive vocabulary (e.g., "fabulous", "wonderful").  
      14. **Do not** address the pupil directly (e.g., "Well done!" or "Congratulations!").  
      15. **Do not** wish the parent or pupil a "happy holiday".  
      16. Ensure the pupil's name is spelled correctly and used appropriately (e.g., "Maxwell", "Catherine", "Carmen-Rose").  
      17. Use pronouns correctly (e.g., "he", "she", "his", "her").  
      18. Ensure that the comment is original and tailored to the pupil's unique performance.  
      
      **IMPORTANT OUTPUT INSTRUCTIONS:**
      - Return ONLY the comment text itself, with no introductory phrases like "Here's a comment" or "Sure, here's a sample"
      - **Do not** Return introductory phrases like "Here's a comment" or " Sure, here's a sample comment for the given prompt:"
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