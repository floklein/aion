import { useChat } from "@ai-sdk/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/conversation";
import Loader from "@/components/loader";
import { Message, MessageContent } from "@/components/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/reasoning";
import { Response } from "@/components/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/sources";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session) {
      redirect({
        to: "/login",
      });
    }
  },
});

const models = [
  { name: "GPT-5", value: "openai/gpt-5" },
  { name: "Claude Sonnet 4", value: "anthropic/claude-sonnet-4" },
  { name: "Gemini 2.5 Flash", value: "google/gemini-2.5-flash" },
];

function HomeComponent() {
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [model, setModel] = useState("openai/gpt-5");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_SERVER_URL}/api/chat`,
    }),
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    await sendMessage(
      {
        text,
      },
      {
        body: {
          model,
          webSearch,
        },
      },
    );
    setInput("");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Conversation className="h-full flex-1 overflow-y-auto">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" && (
                <Sources>
                  <SourcesTrigger
                    count={
                      message.parts.filter((part) => part.type === "source-url")
                        .length
                    }
                  />
                  {message.parts
                    .filter((part) => part.type === "source-url")
                    .map((part, i) => (
                      <SourcesContent key={`${message.id}-${i}`}>
                        <Source
                          key={`${message.id}-${i}`}
                          href={part.url}
                          title={part.url}
                        />
                      </SourcesContent>
                    ))}
                </Sources>
              )}
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={status === "streaming"}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            </div>
          ))}
          {status === "submitted" && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="px-4 pb-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
