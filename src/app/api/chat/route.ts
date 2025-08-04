import { convertToModelMessages, streamText, UIMessage } from "ai";
import { systemPrompt } from "@/lib/prompts";
import { auth, isHardcore } from "@/lib/auth";
import { ratelimit } from "@/lib/redis";
import { hackclub } from "@/lib/hackclub";
// import { Card, extendSchema, positionSchema } from "@/types/game";

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

    // toolChoice: "required",
    /*tools: {
  [Card.X]: tool({
    description: "Plays an X card",
    inputSchema: positionSchema,
    execute: () => true,
  }),
  [Card.O]: tool({
    description: "Plays an O card",
    inputSchema: positionSchema,
    execute: () => true,
  }),
  [Card.Neutralize]: tool({
    description: "Makes a cell neutral",
    inputSchema: positionSchema,
    execute: () => true,
  }),
  [Card.Block]: tool({
    description: "Blocks a position",
    inputSchema: positionSchema,
    execute: () => true,
  }),
  [Card.Lowercase]: tool({
    description: "Lowercases a cell",
    inputSchema: positionSchema,
    execute: () => true,
  }),
  [Card.ScientificReaction]: tool({
    description: "Spawns a chemical reaction",
    inputSchema: positionSchema,
    execute: () => true,
  }),
  [Card.Roulette]: tool({
    description: "Plays a Roulette card",
    execute: () => true,
  }),
  [Card.DecrementWinLength]: tool({
    description: "Decreases win length",
    execute: () => true,
  }),
  [Card.IncrementWinLength]: tool({
    description: "Increases win length",
    execute: () => true,
  }),
  [Card.Extend]: tool({
    description: "Extends the board in a direction",
    inputSchema: extendSchema,
    execute: () => true,
  }),
    },*/
    providerOptions: {
      hackclub: {
        reasoning_effort: "none" as const,
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
