import { createGroq } from "@ai-sdk/groq";

const BASEURL = "https://ai.hackclub.com"; // Read this website before usage

export const hackclub = createGroq({
  baseURL: BASEURL,
  apiKey: "tic-tac-fuck-you",
  // name: "hackclub",
  fetch(input, init) {
    console.log(input, init);
    return fetch(input, init);
  }
  /*async fetch(input, init) {
    const ini = { ...init, body: JSON.stringify({ ...JSON.parse(init!.body!.toString()), reasoning_effort: "none" }) };
    return await fetch(input, ini).then(ndjsonToSSE);
  },*/
});

/*async function ndjsonToSSE(response: Response): Promise<Response> {
  if (!response.body) {
    throw new Error("Response has no body");
  }

  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();
  const reader = response.body.getReader();

  let buffer = "";

  const sseStream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n"); // [at least one full line, incomplete lines?]
        buffer = lines.pop()!;

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          controller.enqueue(encoder.encode(`data: ${trimmed}\n\n`));
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}*/
