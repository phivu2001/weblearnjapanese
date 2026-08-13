/** Cloudflare Worker entry point for the Manabu learning app. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { handleLearningApi } from "./api-data";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
  GEMINI_MODEL?: string;
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

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
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
    "Hiện chưa có GEMINI_API_KEY nên đây là phản hồi mẫu.",
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

function buildChatSystemInstruction(payload: ChatPayload) {
  let instruction =
    "Bạn là Manabu AI, trợ lý luyện tiếng Nhật cho người Việt. Giải thích ngắn gọn, thân thiện, ưu tiên N5/N4, phương pháp chunking. Khi người học gửi tiếng Nhật, hãy tách cụm, nêu nghĩa tiếng Việt, cách đọc, điểm ngữ pháp và một ví dụ gần giống. Không bịa dữ liệu bài học.";

  if (payload.lesson_title || payload.lesson_description) {
    instruction += `\nNgữ cảnh bài học hiện tại: ${payload.lesson_title ?? ""} - ${payload.lesson_description ?? ""}`.trim();
  }

  return instruction;
}

function buildGeminiContents(payload: ChatPayload): GeminiContent[] {
  const contents: GeminiContent[] = [];

  for (const message of payload.messages?.slice(-12) ?? []) {
    const content = message.content?.trim();
    if (!content) continue;
    contents.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: content.slice(0, 1200) }],
    });
  }

  while (contents[0]?.role === "model") {
    contents.shift();
  }

  return contents.length ? contents : [{ role: "user", parts: [{ text: "Xin chào" }] }];
}

function buildGeminiRequestBody(payload: ChatPayload) {
  return {
    systemInstruction: {
      parts: [{ text: buildChatSystemInstruction(payload) }],
    },
    contents: buildGeminiContents(payload),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 700,
    },
  };
}

function extractGeminiReply(data: unknown) {
  const candidates = (data as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  }).candidates;
  return candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
}

function createGeminiPlainTextStream(upstream: Response): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      let buffer = "";
      const flushEvent = (event: string) => {
        const data = event
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("\n");

        if (!data || data === "[DONE]") return;

        try {
          const text = extractGeminiReply(JSON.parse(data));
          if (text) controller.enqueue(encoder.encode(text));
        } catch {
          // Ignore malformed keep-alive or partial SSE frames.
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? "";
          for (const event of events) flushEvent(event);
        }

        buffer += decoder.decode();
        if (buffer.trim()) flushEvent(buffer);
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });
}

async function handleAiChatStream(payload: ChatPayload, env: Env): Promise<Response> {
  const apiKey = env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY;
  const headers = {
    "content-type": "text/plain; charset=utf-8",
    "x-ai-source": "gemini-stream",
  };

  if (!apiKey) {
    return new Response(fallbackChatReply(payload), {
      headers: { ...headers, "x-ai-source": "fallback" },
    });
  }

  try {
    const model = (env.GEMINI_MODEL ?? "gemini-2.5-flash").replace(/^models\//, "");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(buildGeminiRequestBody(payload)),
    });

    if (!response.ok) {
      const detailText = await response.text();
      let detail = detailText;
      try {
        const parsed = JSON.parse(detailText) as { error?: { message?: string; status?: string; code?: number } };
        detail = [parsed.error?.status ?? parsed.error?.code, parsed.error?.message].filter(Boolean).join(" - ");
      } catch {
        // Keep raw response text.
      }

      return new Response([
        "Mình đã nhận được Gemini API key, nhưng Gemini đang từ chối yêu cầu.",
        `Mã lỗi: ${response.status}${detail ? ` - ${detail}` : ""}.`,
        "Bạn hãy kiểm tra lại GEMINI_API_KEY, quota miễn phí hoặc thử đổi GEMINI_MODEL trong file môi trường.",
      ].join("\n\n"), {
        headers: { ...headers, "x-ai-source": `gemini-error:${response.status}` },
      });
    }

    return new Response(createGeminiPlainTextStream(response), { headers });
  } catch (error) {
    return new Response([
      "Mình đã nhận được Gemini API key, nhưng chưa kết nối được tới Gemini lúc này.",
      `Lỗi kỹ thuật: ${error instanceof Error ? error.name : "UnknownError"}. Hãy kiểm tra mạng rồi thử lại.`,
    ].join("\n\n"), {
      headers: { ...headers, "x-ai-source": "gemini-fallback" },
    });
  }
}

async function handleAiChat(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/ai-chat" && url.pathname !== "/api/ai-chat/stream") return null;
  if (url.pathname === "/api/ai-chat/stream" && request.method === "GET") {
    return json({ status: "ok", mode: "gemini-stream" });
  }
  if (request.method !== "POST") return json({ detail: "Method not allowed" }, 405);

  let payload: ChatPayload;
  try {
    payload = await request.json() as ChatPayload;
  } catch {
    return json({ detail: "Payload không hợp lệ." }, 400);
  }

  if (url.pathname === "/api/ai-chat/stream") {
    return handleAiChatStream(payload, env);
  }

  const apiKey = env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY;
  if (!apiKey) {
    return json({ reply: fallbackChatReply(payload), source: "fallback" });
  }

  try {
    const model = (env.GEMINI_MODEL ?? "gemini-2.5-flash").replace(/^models\//, "");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(buildGeminiRequestBody(payload)),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const data = await response.json() as { error?: { message?: string; status?: string; code?: number } };
        detail = [data.error?.status ?? data.error?.code, data.error?.message].filter(Boolean).join(" - ");
      } catch {
        detail = await response.text();
      }
      return json({
        reply: [
          "Mình đã nhận được Gemini API key, nhưng Gemini đang từ chối yêu cầu.",
          `Mã lỗi: ${response.status}${detail ? ` - ${detail}` : ""}.`,
          "Bạn hãy kiểm tra lại GEMINI_API_KEY, quota miễn phí hoặc thử đổi GEMINI_MODEL trong file môi trường.",
        ].join("\n\n"),
        source: `gemini-error:${response.status}`,
      });
    }

    const data = await response.json();
    const reply = extractGeminiReply(data);
    return json({ reply: reply || fallbackChatReply(payload), source: "gemini" });
  } catch (error) {
    return json({
      reply: [
        "Mình đã nhận được Gemini API key, nhưng chưa kết nối được tới Gemini lúc này.",
        `Lỗi kỹ thuật: ${error instanceof Error ? error.name : "UnknownError"}. Hãy kiểm tra mạng rồi thử lại.`,
      ].join("\n\n"),
      source: "gemini-fallback",
    });
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
