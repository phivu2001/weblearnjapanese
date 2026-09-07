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

type PronunciationEvaluatePayload = {
  target?: string;
  transcript?: string;
  chunks?: string[];
  variants?: string[];
  chunk_variants?: string[][];
};

type RoleplayPayload = {
  scenario?: string;
  target_grammar?: string;
  ai_role?: string;
  level?: string;
  script_preference?: string;
  messages?: ChatMessage[];
};

const roleplayScenarios = [
  { scenario: "Ở nhà hàng", ai_role: "Nhân viên phục vụ", target_grammar: "〜てください", description: "Gọi món, yêu cầu nước hoặc hỏi thực đơn." },
  { scenario: "Ở nhà ga", ai_role: "Nhân viên nhà ga", target_grammar: "〜へ行きたいです / 〜はどこですか", description: "Hỏi đường, mua vé, hỏi sân ga." },
  { scenario: "Ở lớp học", ai_role: "Giáo viên tiếng Nhật", target_grammar: "〜てもいいですか / 〜てはいけません", description: "Xin phép, hỏi quy định trong lớp." },
  { scenario: "Rủ bạn đi chơi", ai_role: "Bạn người Nhật", target_grammar: "〜ませんか / 〜ましょう", description: "Mời đi ăn, xem phim, học chung." },
];

function normalizeForJapaneseSpeech(value = "") {
  return value
    .normalize("NFKC")
    .replace(/[\s、。？！?!.・「」『』（）()\[\]【】…,.，;；:：~〜\-]+/gu, "")
    .trim()
    .toLocaleLowerCase("ja");
}

function workerLevenshteinDistance(left: string, right: string) {
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const current = [leftIndex + 1];
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      current.push(
        Math.min(
          current[rightIndex] + 1,
          previous[rightIndex + 1] + 1,
          previous[rightIndex] + (left[leftIndex] === right[rightIndex] ? 0 : 1),
        ),
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function workerSimilarityScore(target: string, transcript: string, variants: string[] = []) {
  const normalizedTranscript = normalizeForJapaneseSpeech(transcript);
  const targets = [target, ...variants].map(normalizeForJapaneseSpeech).filter(Boolean);
  if (!targets.length && !normalizedTranscript) return 100;
  if (!targets.length || !normalizedTranscript) return 0;
  return Math.max(
    0,
    ...targets.map((candidate) => {
      const distance = workerLevenshteinDistance(candidate, normalizedTranscript);
      const maxLength = Math.max(candidate.length, normalizedTranscript.length, 1);
      return Math.max(0, Math.min(100, Math.round((1 - distance / maxLength) * 100)));
    }),
  );
}

function splitWorkerTargetTokens(target: string, chunks?: string[]) {
  const chunkTokens = chunks?.map((chunk) => chunk.trim()).filter(Boolean) ?? [];
  if (chunkTokens.length) return chunkTokens;
  const spaced = target.split(/\s+/).filter(Boolean);
  return spaced.length ? spaced : [...target].filter((character) => normalizeForJapaneseSpeech(character));
}

function workerPronunciationFeedback(payload: PronunciationEvaluatePayload) {
  const target = payload.target ?? "";
  const transcript = payload.transcript ?? "";
  const transcriptKey = normalizeForJapaneseSpeech(transcript);
  let cursor = 0;
  const tokens = splitWorkerTargetTokens(target, payload.chunks).map((token, tokenIndex) => {
    const keys = [token, ...(payload.chunk_variants?.[tokenIndex] ?? [])]
      .map(normalizeForJapaneseSpeech)
      .filter(Boolean);
    let matched = false;
    let matchedIndex = -1;
    let matchedLength = 0;
    for (const key of keys) {
      const localIndex = transcriptKey.indexOf(key, cursor);
      const globalIndex = localIndex >= 0 ? localIndex : transcriptKey.indexOf(key);
      if (globalIndex >= 0) {
        matched = true;
        matchedIndex = globalIndex;
        matchedLength = key.length;
        break;
      }
    }
    if (matched) cursor = matchedIndex + matchedLength;
    return { target: token, spoken: matched ? transcript : null, matched };
  });

  return {
    score: workerSimilarityScore(target, transcript, payload.variants ?? []),
    normalized_target: normalizeForJapaneseSpeech(target),
    normalized_transcript: transcriptKey,
    tokens,
  };
}

function buildRoleplayOpeningMessage(payload: RoleplayPayload) {
  const scenarioKey = (payload.scenario ?? "").normalize("NFKC").toLocaleLowerCase("vi");
  const grammar = payload.target_grammar?.trim() || "今日の文法";
  const hint = `『${grammar}』を使って、短く答えてください。`;
  if (scenarioKey.includes("nhà hàng") || scenarioKey.includes("restaurant") || scenarioKey.includes("レストラン")) {
    return `いらっしゃいませ。ご注文は何ですか。${hint}`;
  }
  if (scenarioKey.includes("nhà ga") || scenarioKey.includes("station") || scenarioKey.includes("駅")) {
    return `こんにちは。どこへ行きたいですか。${hint}`;
  }
  if (scenarioKey.includes("lớp") || scenarioKey.includes("class") || scenarioKey.includes("教室")) {
    return `こんにちは。きょうは何をしたいですか。${hint}`;
  }
  if (scenarioKey.includes("rủ") || scenarioKey.includes("bạn") || scenarioKey.includes("friend") || scenarioKey.includes("友達")) {
    return `こんにちは。週末、何をしましょうか。${hint}`;
  }
  return `こんにちは。ロールプレイを始めましょう。${hint}`;
}

function buildRoleplaySystemInstruction(payload: RoleplayPayload) {
  const scenario = payload.scenario?.trim().slice(0, 180) || "Daily conversation";
  const targetGrammar = payload.target_grammar?.trim().slice(0, 120) || "N5/N4 grammar";
  const aiRole = payload.ai_role?.trim().slice(0, 120) || "Japanese conversation partner";
  const level = payload.level?.trim().slice(0, 40) || "N5/N4";
  const scriptPreference = payload.script_preference?.trim().slice(0, 80) || "kana_with_simple_kanji";

  return [
    "You are Manabu AI, a Japanese output coach for Vietnamese learners.",
    `Scenario: ${scenario}`,
    `AI role: ${aiRole}`,
    `Learner level: ${level}`,
    `Target grammar the learner must practice: ${targetGrammar}`,
    `Script preference: ${scriptPreference}`,
    "Rules: stay in role-play, keep Japanese short, steer the learner to use target grammar, correct mistakes briefly in Vietnamese first, then continue in Japanese.",
    "Response format: Sửa nhanh: <Vietnamese correction or Không cần sửa.>\nMẫu đúng: <one model Japanese answer>\nAI: <your in-character Japanese reply>",
  ].join("\n");
}

function buildRoleplayGeminiRequestBody(payload: RoleplayPayload) {
  const contents: GeminiContent[] = [];
  for (const message of payload.messages?.slice(-14) ?? []) {
    const content = message.content?.trim();
    if (!content) continue;
    contents.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: content.slice(0, 1400) }],
    });
  }
  while (contents[0]?.role === "model") contents.shift();

  return {
    systemInstruction: { parts: [{ text: buildRoleplaySystemInstruction(payload) }] },
    contents: contents.length ? contents : [{ role: "user", parts: [{ text: "Start the role-play." }] }],
    generationConfig: { temperature: 0.55, maxOutputTokens: 850 },
  };
}

async function handleRoleplayStream(payload: RoleplayPayload, env: Env) {
  const apiKey = env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY;
  const headers = { "content-type": "text/plain; charset=utf-8", "x-ai-source": "gemini-roleplay-stream" };
  if (!apiKey) {
    return new Response([
      "Sửa nhanh: Chưa có GEMINI_API_KEY nên đây là phiên luyện mẫu offline.",
      `Mẫu đúng: ${buildRoleplayOpeningMessage(payload)}`,
      "AI: もう一度、短い日本語で答えてください。",
    ].join("\n"), { headers: { ...headers, "x-ai-source": "fallback" } });
  }

  try {
    const model = (env.GEMINI_MODEL ?? "gemini-3.1-flash-lite").replace(/^models\//, "");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildRoleplayGeminiRequestBody(payload)),
    });
    if (!response.ok) {
      return new Response([
        "Sửa nhanh: Chưa gọi được Gemini cho phòng role-play.",
        "Mẫu đúng: もう一度、短い日本語で言ってください。",
        `AI: エラー ${response.status} です。あとでまた練習しましょう。`,
      ].join("\n"), { headers: { ...headers, "x-ai-source": `gemini-error:${response.status}` } });
    }
    return new Response(createGeminiPlainTextStream(response), { headers });
  } catch (error) {
    return new Response([
      "Sửa nhanh: Chưa kết nối được Gemini cho role-play.",
      "Mẫu đúng: もう一度、ゆっくり言ってください。",
      `AI: すみません。${error instanceof Error ? error.name : "エラー"} です。`,
    ].join("\n"), { headers: { ...headers, "x-ai-source": "gemini-fallback" } });
  }
}

async function handleAiPractice(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/ai-practice/")) return null;

  if (url.pathname === "/api/ai-practice/pronunciation/status" && request.method === "GET") {
    return json({ browser_stt: true, recommended_lang: "ja-JP", server_scoring: true });
  }

  if (url.pathname === "/api/ai-practice/roleplay/scenarios" && request.method === "GET") {
    return json(roleplayScenarios);
  }

  if (url.pathname === "/api/ai-practice/roleplay/session" && request.method === "POST") {
    const payload = await request.json().catch(() => ({})) as RoleplayPayload;
    return json({ session_id: crypto.randomUUID(), opening_message: buildRoleplayOpeningMessage(payload) });
  }

  if (url.pathname === "/api/ai-practice/pronunciation/evaluate" && request.method === "POST") {
    const payload = await request.json().catch(() => ({})) as PronunciationEvaluatePayload;
    return json(workerPronunciationFeedback(payload));
  }

  if (url.pathname === "/api/ai-practice/roleplay/chat/stream" && request.method === "POST") {
    const payload = await request.json().catch(() => ({})) as RoleplayPayload;
    return handleRoleplayStream(payload, env);
  }

  return json({ detail: "Không tìm thấy endpoint Phòng AI." }, 404);
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

    const aiPracticeResponse = await handleAiPractice(request, env);
    if (aiPracticeResponse) return aiPracticeResponse;

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
