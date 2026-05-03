import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import OpenAI from "openai"
import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources/index.mjs"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const getFirstMessage = async (supabase: ReturnType<typeof createClient>): Promise<ChatCompletionSystemMessageParam> => {
  const { data: postMetadataList } = await supabase.from("Post").select("id, title, category, tags")
  return {
    role: "system",
    content: `너는 개발 전문 챗봇이야. 블로그 글을 참고하여 상대방의 질문에 답변해줘야해. 너가 잘 모르는 질문이라면, 다음 블로그 글들을 참고하여 답변해줘.

    [블로그 글 목록]
    ${JSON.stringify(postMetadataList ?? [])}

    너는 retrieve 함수를 사용하여 블로그 글을 가져올 수 있어. 참고하고 싶은 블로그 글이 있다면, retrieve 함수를 사용하여 블로그 글을 가져와서 답변해줘.
    답변은 마크다운 형식으로 작성해줘.`
  }
}

const getBlogContent = async (id: string, supabase: ReturnType<typeof createClient>) => {
  const { data } = await supabase.from("Post").select("*").eq("id", Number(id))
  if (!data) return {}
  return data[0]
}

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "retrieve",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "가져올 블로그 글의 id" }
        }
      },
      description: "특정 id를 가진 블로그 글의 전체 내용을 가져옵니다."
    }
  }
]

type ToolCallBuffer = {
  id: string
  type: "function"
  function: { name: string; arguments: string }
}

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as { messages: ChatCompletionMessageParam[] }
  const supabase = createClient(await cookies())
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      if (messages.length === 1) {
        messages.unshift(await getFirstMessage(supabase))
      }

      try {
        // Phase 1: stream: true로 시작 — tool_calls인지 content인지 실시간으로 감지
        const firstStream = await openai.chat.completions.create({
          messages,
          model: "gpt-4o",
          tools,
          tool_choice: "auto",
          stream: true,
        })

        let directContent = ""
        const toolCallsBuffer: Record<number, ToolCallBuffer> = {}

        for await (const chunk of firstStream) {
          const delta = chunk.choices[0]?.delta

          if (delta?.content) {
            directContent += delta.content
            send({ type: "chunk", content: delta.content })
          }

          if (delta?.tool_calls) {
            for (const tc of delta.tool_calls) {
              if (!toolCallsBuffer[tc.index]) {
                toolCallsBuffer[tc.index] = { id: "", type: "function", function: { name: "", arguments: "" } }
              }
              if (tc.id) toolCallsBuffer[tc.index].id = tc.id
              if (tc.function?.name) toolCallsBuffer[tc.index].function.name += tc.function.name
              if (tc.function?.arguments) toolCallsBuffer[tc.index].function.arguments += tc.function.arguments
            }
          }
        }

        const toolCalls = Object.values(toolCallsBuffer)

        if (toolCalls.length > 0) {
          messages.push({
            role: "assistant",
            content: directContent || null,
            tool_calls: toolCalls,
          } as ChatCompletionAssistantMessageParam)

          for (const tc of toolCalls) {
            if (tc.type !== "function") continue
            const { id } = JSON.parse(tc.function.arguments)
            const result = await getBlogContent(id, supabase)
            messages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) })
          }

          // Phase 2: tool 결과 기반 최종 답변 스트리밍
          const finalStream = await openai.chat.completions.create({
            messages,
            model: "gpt-4o",
            stream: true,
          })

          let finalContent = ""
          for await (const chunk of finalStream) {
            const text = chunk.choices[0]?.delta?.content ?? ""
            finalContent += text
            if (text) send({ type: "chunk", content: text })
          }

          messages.push({ role: "assistant", content: finalContent })
        } else {
          messages.push({ role: "assistant", content: directContent })
        }

        send({ type: "done", messages: messages.slice(1) })
      } catch {
        send({ type: "error", message: "답변을 가져오지 못했어요. 다시 시도해주세요." })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
