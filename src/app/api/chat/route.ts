import { convertToModelMessages, streamText, tool, UIMessage } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { z } from 'zod';
import { Card } from '@/lib/game';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    temperature: 1,
    tools: {
      playCard: tool({
        description: "Play a card on a certian cell if it requires one",
        inputSchema: z.object({
          card: z.enum([Card.X, Card.O]),
          cell: z.object({
            row: z.number().int().nonnegative().describe("The zero-based index of the target row"),
            col: z.number().int().nonnegative().describe("The zero-based index of the target column")
          }).optional()
        }),
      })
    },
  });

  return result.toUIMessageStreamResponse();
}
