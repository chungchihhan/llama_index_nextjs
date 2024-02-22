import React from "react";
import { Copy, Check } from "lucide-react";
import ChatAvatar from "./chat-avatar";
import Markdown from "./markdown";
import { Button } from "../button";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

// 假定 ChatAnswer 接受 chatAnswer 內容和角色作為 props
export default function ChatAnswer({
  chatAnswer,
  role,
}: {
  chatAnswer: string;
  role: string;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  return (
    <div className="flex items-start gap-4 pr-5 pt-5">
      <ChatAvatar role={role} />
      <div className="group flex flex-1 justify-between gap-2">
        <div className="flex-1">
          <Markdown content={chatAnswer} />
        </div>
        <Button
          onClick={() => copyToClipboard(chatAnswer)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 opacity-0 group-hover:opacity-100"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
