import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { moveSchema } from "@/lib/game";

//const LLAMA = "meta-llama/llama-4-scout-17b-16e-instruct";
const LLAMA = "llama-3.3-70b-versatile";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq(LLAMA),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    temperature: 0, // Would increace for fun, but tool calls!

    tools: {
      playMove: tool({
        description: "Plays a move",
        inputSchema: moveSchema,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
