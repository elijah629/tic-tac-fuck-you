import { convertToModelMessages, streamText, UIMessage } from "ai";
import { systemPrompt } from "@/lib/prompts";
import { auth, isHardcore } from "@/lib/auth";
import { ratelimit } from "@/lib/redis";
import { hackclub } from "@/lib/hackclub";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  const hardcore = await isHardcore(session);
  const id = session?.user?.name;

  if (process.env.NODE_ENV === "production") {
    // if (!id) return new Response("Unauthorized", { status: 401 });

    const { success } = await ratelimit.blockUntilReady(
      id ?? "GHOST_USER",
      10_000,
    );

    if (!success) return new Response("Too Many Requests", { status: 429 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: hackclub, //groq(MODEL),
    system: systemPrompt(id, hardcore),
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
