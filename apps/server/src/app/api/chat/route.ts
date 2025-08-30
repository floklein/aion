import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
  }: { messages: UIMessage[]; model: string; webSearch: boolean } =
    await req.json();
  const result = streamText({
    model: webSearch ? "perplexity/sonar" : model,
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
