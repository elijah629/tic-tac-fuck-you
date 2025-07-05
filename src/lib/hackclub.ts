import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const BASEURL = "https://ai.hackclub.com"; // Read this website before usage

const base_hackclub = createOpenAICompatible({
  baseURL: BASEURL,
  name: "hackclub",
  async fetch(input, init) {
    return await fetch(input, init).then(ndjsonToSSE);
  }
});

async function ndjsonToSSE(response: Response): Promise<Response> {
  if (!response.body) {
    throw new Error("Response has no body");
  }

  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();
  let buffer = "";

  const sseStream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode incoming NDJSON chunk and accumulate
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!; // keep incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          // Wrap each JSON object as an SSE "data:" block
          const sseChunk = `data: ${trimmed}\n\n`;
          controller.enqueue(encoder.encode(sseChunk));
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    }
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

/* Since the API does not officially support tools, we have to do this voodo shit */
// NOTE: The AI cannot read responses with this wrapper, you can only read the calls.
// You are the executor and do not return an output

export const hackclub = base_hackclub("")/*wrapLanguageModel({
  model: base_hackclub(""), // The API automatically ignores this and picks whatever the hackclub devs set it to
  middleware: createToolMiddleware({
  toolCallTag: "<tool_call>",
  toolCallEndTag: "</tool_call>",
  toolResponseTag: "<tool_response>",
  toolResponseEndTag: "</tool_response>",
    toolSystemPromptTemplate(tools) {
      return `You are a function calling AI model.
You are provided with function signatures within <tools></tools> XML tags.
You may call one or more functions to assist with the user query.
Don't make assumptions about what values to plug into functions.
Here are the available tools: <tools>${tools}</tools>
Use the following pydantic model json schema for each tool call you will make: {'title': 'FunctionCall', 'type': 'object', 'properties': {'arguments': {'title': 'Arguments', 'type': 'object'}, 'name': {'title': 'Name', 'type': 'string'}}, 'required': ['arguments', 'name']}
For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:
<tool_call>
{'arguments': <args-dict>, 'name': <function-name>}
</tool_call>`;
    },
  })
});*/;
