"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Image from "next/image";
import { Send } from "lucide-react";

import ContextPanel from "@/app/components/chat/ContextPanel";
import { Button } from "@/components/ui/button";

type WorkspaceChatProps = {
  subject: string;
};

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export default function WorkspaceChat({ subject }: WorkspaceChatProps) {
  const [input, setInput] = useState("");
  const [data, setData] = useState<any[]>([]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { subject },
      }),
    [subject]
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onData: (part) => {
      if (part.type !== "data-context") {
        return;
      }

      setData((previous) => [...previous, part.data as any]);
    },
  });

  const isBusy = status === "submitted" || status === "streaming";

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setInput(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = input.trim();
    if (!value) {
      return;
    }

    await sendMessage({ text: value });
    setInput("");
  }

  return (
    <div className="flex h-[65vh] gap-6 w-full">
      <div className="w-[40%] h-full">
        <ContextPanel data={data} />
      </div>
      <div className="w-[60%] h-full">
        <section className="h-full w-full rounded-3xl border border-white bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 p-8 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <div className="flex flex-col items-center gap-3">
                    <Image
                      src="/rere-waving.png"
                      alt="Rere AI"
                      width={28}
                      height={28}
                      className="rounded-full bg-indigo-100 p-0.5"
                    />
                    <p>
                      Ask anything about {subject}. I will ground answers using your retrieved notes.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const text = getMessageText(message);
                  if (!text) {
                    return null;
                  }

                  const isUser = message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={isUser ? "flex justify-end" : "flex justify-start"}
                    >
                      {!isUser ? (
                        <div className="mr-2 mt-1 shrink-0">
                          <Image
                            src="/rere-waving.png"
                            alt="Rere AI"
                            width={28}
                            height={28}
                            className="rounded-full bg-indigo-100 p-0.5"
                          />
                        </div>
                      ) : null}
                      <div
                        className={[
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                          isUser
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "border border-white bg-white/60 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-slate-100",
                        ].join(" ")}
                      >
                        {text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="sticky bottom-0 mt-5 pt-3">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-black/20"
              >
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={`Ask about ${subject}...`}
                  className="h-10 flex-1 bg-transparent px-1 text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
                  disabled={isBusy}
                />

                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  disabled={isBusy || input.trim().length === 0}
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </Button>
              </form>

              {error ? (
                <p className="mt-2 px-2 text-xs text-rose-600 dark:text-rose-400">{error.message}</p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
