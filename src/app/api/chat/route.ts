import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { moveSchema } from "@/lib/game";

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
//const MODEL = "llama-3.3-70b-versatile";
//const MODEL = "meta-llama/llama-4-maverick-17b-128e-instruct";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq(MODEL),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    temperature: 1,

    tools: {
      playMove: tool({
        description: "Plays a move",
        inputSchema: moveSchema,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
