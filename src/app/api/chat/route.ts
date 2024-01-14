import { Message, StreamingTextResponse } from "ai";
import { ChatMessage, MessageContent, MessageType, OpenAI } from "llamaindex";
import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "./engine";
import { LlamaIndexStream } from "./llamaindex-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getLastMessageContent = (
  textMessage: string,
  imageUrl: string | undefined
): MessageContent => {
  if (!imageUrl) return textMessage;
  return [
    {
      type: "text",
      text: textMessage,
    },
    {
      type: "image_url",
      image_url: {
        url: imageUrl,
      },
    },
  ];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, data }: { messages: Message[]; data: any } = body;
    const lastMessage = messages.pop();
    if (!messages || !lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        {
          error:
            "messages are required in the request body and the last message must be from the user",
        },
        { status: 400 }
      );
    }

    const llm = new OpenAI({
      model:
        (process.env.MODEL as
          | "gpt-3.5-turbo"
          | "gpt-3.5-turbo-16k"
          | "gpt-3.5-turbo-1106"
          | "gpt-4"
          | "gpt-4-32k"
          | "gpt-4-1106-preview"
          | "gpt-4-vision-preview") || "gpt-3.5-turbo",
      maxTokens: 512,
    });

    const chatEngine = await createChatEngine(llm);

    const lastMessageContent = getLastMessageContent(
      lastMessage.content,
      data?.imageUrl
    );

    const convertToChatMessage = function (message: Message): ChatMessage {
      return {
        content: message.content,
        role: message.role as MessageType, // 这里假设 Message$1 的 role 字段与 MessageType 兼容
      };
    };

    const chatMessages: ChatMessage[] = messages.map(convertToChatMessage);
    const response = await chatEngine.chat(
      lastMessageContent as MessageContent,
      chatMessages,
      true
    );

    // Transform the response into a readable stream
    const stream = LlamaIndexStream(response);

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("[LlamaIndex]", error);
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
