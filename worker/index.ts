/** Cloudflare Worker entry point for the Manabu learning app. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { handleLearningApi } from "./api-data";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  OPENAI_API_KEY?: string;
  OPENAI_CHAT_MODEL?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type ChatMessage = {
  role: string;
  content: string;
};

type ChatPayload = {
  messages?: ChatMessage[];
  lesson_title?: string | null;
  lesson_description?: string | null;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function fallbackChatReply(payload: ChatPayload) {
  const lastMessage = payload.messages?.at(-1)?.content?.trim() ?? "";
  const lessonContext = payload.lesson_title
    ? ` trong ${payload.lesson_title}${payload.lesson_description ? ` (${payload.lesson_description})` : ""}`
    : "";

  if (!lastMessage) {
    return "Bạn hãy nhập câu hỏi tiếng Nhật hoặc tiếng Việt, mình sẽ giúp giải thích theo từng cụm.";
  }

  return [
    `Mình đã sẵn sàng làm trợ lý học tiếng Nhật${lessonContext}.`,
    "Hiện chưa có OPENAI_API_KEY nên đây là phản hồi mẫu.",
    `Bạn vừa hỏi: “${lastMessage.slice(0, 240)}”.`,
    "Gợi ý: gửi một câu tiếng Nhật, mình sẽ tách cụm, giải thích trợ từ, nghĩa tiếng Việt và cách đọc.",
  ].join("\n\n");
}

function sanitizeChatMessages(payload: ChatPayload) {
  const messages = [
    {
      role: "system",
      content:
        "Bạn là Manabu AI, trợ lý luyện tiếng Nhật cho người Việt. Giải thích ngắn gọn, thân thiện, ưu tiên N5/N4, phương pháp chunking.",
    },
  ];

  if (payload.lesson_title || payload.lesson_description) {
    messages.push({
      role: "system",
      content: `Ngữ cảnh bài học hiện tại: ${payload.lesson_title ?? ""} - ${payload.lesson_description ?? ""}`.trim(),
    });
  }

  for (const message of payload.messages?.slice(-12) ?? []) {
    const content = message.content?.trim();
    if (!content) continue;
    messages.push({
      role: message.role === "assistant" ? "assistant" : "user",
      content: content.slice(0, 1200),
    });
  }

  return messages;
}

async function handleAiChat(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/ai-chat") return null;
  if (request.method !== "POST") return json({ detail: "Method not allowed" }, 405);

  let payload: ChatPayload;
  try {
    payload = await request.json() as ChatPayload;
  } catch {
    return json({ detail: "Payload không hợp lệ." }, 400);
  }

  if (!env.OPENAI_API_KEY) {
    return json({ reply: fallbackChatReply(payload), source: "fallback" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
        messages: sanitizeChatMessages(payload),
        temperature: 0.4,
        max_tokens: 700,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI ${response.status}`);
    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return json({ reply: reply || fallbackChatReply(payload), source: "openai" });
  } catch {
    return json({ reply: fallbackChatReply(payload), source: "fallback" });
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const aiResponse = await handleAiChat(request, env);
    if (aiResponse) return aiResponse;

    const apiResponse = handleLearningApi(request);
    if (apiResponse) return apiResponse;

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
