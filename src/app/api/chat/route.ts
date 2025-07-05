import { convertToModelMessages, streamText, UIMessage } from "ai";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { auth } from "@/lib/auth";
import { ratelimit } from "@/lib/redis";
import { hackclub } from "@/lib/hackclub";

export const maxDuration = 30;

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    const session = await auth();

    const id = session?.user?.name;

    if (!id) return new Response("Unauthorized", { status: 401 });

    const { success } = await ratelimit.blockUntilReady(id, 10_000);

    if (!success) return new Response("Too Many Requests", { status: 429 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: hackclub, //groq(MODEL),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    //toolChoice: "required",
    /*tools: {
      playMove: tool({
        description: "Plays a move",
        inputSchema: moveSchema,
        execute: () => true,
      }),
    },*/
  });

  return result.toUIMessageStreamResponse();
}
