import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { MODEL, SYSTEM_PROMPT } from "@/lib/prompts";
import { moveSchema } from "@/lib/game";
import { auth } from "@/lib/auth";
import { ratelimit } from "@/lib/redis";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  const id = session?.user?.name;

  if (!id) return new Response("Unauthorized", { status: 401 });

  const { success } = await ratelimit.blockUntilReady(id, 10_000);

  if (!success) return new Response("Too Many Requests", { status: 429 });

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq(MODEL),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    temperature: 1, // fUNN!
    maxOutputTokens: 512,

    tools: {
      playMove: tool({
        description: "Plays a move",
        inputSchema: moveSchema,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
