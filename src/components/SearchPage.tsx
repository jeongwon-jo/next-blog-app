import IconButton from "@/components/IconButton";
import Message, { MessageProps } from "@/components/Message";
import { Post } from "@/types";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RxReset } from "react-icons/rx";
import { PostCardProps } from "./PostCard";

const SUGGESTED_QUESTIONS = [
  "최근에 쓴 글이 뭐야?",
  "Next.js에 대해 설명해줘",
  "React 훅은 어떻게 써?",
  "TypeScript 쓰면 뭐가 좋아?",
]

export const SearchPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messageParams, setMessageParams] = useState<ChatCompletionMessageParam[]>(() => {
    if (typeof window === "undefined") return [];
    const existing = localStorage.getItem("messages");
    if (!existing) return [];
    return JSON.parse(existing);
  });

  const [isPending, setIsPending] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (msgs: ChatCompletionMessageParam[]) => {
    setIsPending(true);
    setStreamingContent("");
    setError(null);

    try {
      const response = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });

      if (!response.ok || !response.body) throw new Error();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6));

          if (data.type === "chunk") {
            content += data.content;
            setStreamingContent(content);
          }
          if (data.type === "done") {
            setMessageParams(data.messages);
            localStorage.setItem("messages", JSON.stringify(data.messages));
            setStreamingContent("");
          }
          if (data.type === "error") {
            setError(data.message);
          }
        }
      }
    } catch {
      setError("답변을 가져오지 못했어요. 다시 시도해주세요.");
    } finally {
      setIsPending(false);
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending || !inputRef.current?.value.trim()) return;

    const nextMessages: ChatCompletionMessageParam[] = [
      ...messageParams,
      { content: inputRef.current.value, role: "user" },
    ];
    setMessageParams(nextMessages);
    sendMessage(nextMessages);
    inputRef.current.value = "";
  }, [isPending, messageParams, sendMessage]);

  const handleSuggest = useCallback((question: string) => {
    if (isPending) return;
    const nextMessages: ChatCompletionMessageParam[] = [
      ...messageParams,
      { content: question, role: "user" },
    ];
    setMessageParams(nextMessages);
    sendMessage(nextMessages);
  }, [isPending, messageParams, sendMessage]);

  const handleReset = useCallback(() => {
    if (window.confirm("대화를 초기화 하시겠습니까?")) {
      setMessageParams([]);
      localStorage.removeItem("messages");
    }
  }, []);

  const messagePropsList = useMemo(() => {
    let posts: Post[] = [];
    return messageParams.reduce<MessageProps[]>((acc, cur) => {
      if (cur.role === "tool" && typeof cur.content === "string") {
        posts.push(JSON.parse(cur.content) as Omit<PostCardProps, "className">);
      }
      if (cur.role === "user") {
        posts = [];
        return [...acc, cur as MessageProps];
      }
      if (cur.role === "assistant") {
        const result = [...acc, { ...cur, posts: [...posts] } as MessageProps];
        posts = [];
        return result;
      }
      return acc;
    }, []);
  }, [messageParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagePropsList, isPending, streamingContent]);

  return (
    <div className="flex h-full flex-1 flex-col text-sm">
      <div className="flex-1 overflow-y-auto">
        <Message content="무엇이든 물어보세요" role="assistant" />

        {messageParams.length === 0 && (
          <div className="container mt-4 flex flex-wrap gap-2 px-4 text-sm">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSuggest(q)}
                disabled={isPending}
                className="rounded-full border-2 border-fuchsia-200 bg-white px-4 py-2 text-sm font-medium text-fuchsia-600 transition-all hover:border-fuchsia-400 hover:bg-fuchsia-50 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messagePropsList.map((props, i) =>
          props.content != null ? <Message {...props} key={i} /> : null
        )}

        {isPending && (
          <Message content={streamingContent || "생각중..."} role="assistant" />
        )}

        {error && (
          <div className="container mt-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
            ⚠️ {error}
            <button
              onClick={() => setError(null)}
              className="ml-3 text-xs text-red-400 underline hover:text-red-600"
            >
              닫기
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="container mt-5">
        <form onSubmit={handleSubmit} className="flex items-center rounded-lg border-2 border-fuchsia-200 px-2 focus-within:border-fuchsia-400">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 rounded-2xl p-2 outline-none"
            placeholder="무엇이든 물어보세요!"
            disabled={isPending}
          />
          <div className="flex items-center gap-2">
            <IconButton Icon={AiOutlineSearch} type="submit" className="text-fuchsia-500 hover:text-fuchsia-700" />
            <IconButton Icon={RxReset} className="text-fuchsia-500 hover:text-fuchsia-700" onClick={handleReset} />
          </div>
        </form>
      </div>
    </div>
  );
}
