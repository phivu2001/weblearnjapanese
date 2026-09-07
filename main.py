"""FastAPI application for the chunk-based Japanese learning web app."""

from __future__ import annotations

import json
import os
import re
import unicodedata
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models import Lesson, Passage, Sentence
from schemas import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    LessonDetailResponse,
    LessonResponse,
    PassageResponse,
    PronunciationEvaluateRequest,
    PronunciationEvaluateResponse,
    PronunciationTokenFeedback,
    RoleplayChatRequest,
    RoleplaySessionRequest,
    RoleplaySessionResponse,
    SentenceResponse,
)
from seed import seed_database


def load_local_env() -> None:
    env_path = Path(__file__).with_name(".env")
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


load_local_env()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Normal app launches only read the existing database. Seeding is an explicit
    # maintenance action so opening the .bat file never rewrites lesson content.
    if os.getenv("AUTO_SEED", "false").lower() in {"1", "true", "yes"}:
        seed_database()
    yield


app = FastAPI(
    title="Nihongo Chunk API",
    description="REST API cho ứng dụng học tiếng Nhật theo phương pháp Chunking.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def build_fallback_chat_reply(payload: ChatRequest) -> str:
    last_message = payload.messages[-1].content.strip() if payload.messages else ""
    lesson_context = ""
    if payload.lesson_title or payload.lesson_description:
        lesson_context = f" trong {payload.lesson_title or 'bài hiện tại'}"
        if payload.lesson_description:
            lesson_context += f" ({payload.lesson_description})"

    if not last_message:
        return "Bạn hãy nhập câu hỏi tiếng Nhật hoặc tiếng Việt, mình sẽ giúp giải thích theo từng cụm."

    return (
        "Mình đã sẵn sàng làm trợ lý học tiếng Nhật"
        f"{lesson_context}. Hiện backend chưa có GEMINI_API_KEY nên đây là phản hồi mẫu.\n\n"
        f"Bạn vừa hỏi: “{last_message[:240]}”.\n\n"
        "Gợi ý học nhanh: hãy gửi một câu tiếng Nhật, ví dụ “わたしは 学生です”, "
        "mình sẽ tách cụm, giải thích trợ từ, nghĩa tiếng Việt và cách đọc. "
        "Để bật AI thật, thêm GEMINI_API_KEY vào file môi trường rồi khởi động lại web."
    )


def build_gemini_fallback_chat_reply(payload: ChatRequest) -> str:
    last_message = payload.messages[-1].content.strip() if payload.messages else ""
    lesson_context = ""
    if payload.lesson_title or payload.lesson_description:
        lesson_context = f" trong {payload.lesson_title or 'bài hiện tại'}"
        if payload.lesson_description:
            lesson_context += f" ({payload.lesson_description})"

    if not last_message:
        return "Bạn hãy nhập câu hỏi tiếng Nhật hoặc tiếng Việt, mình sẽ giúp giải thích theo từng cụm."

    return (
        "Mình đã sẵn sàng làm trợ lý học tiếng Nhật"
        f"{lesson_context}. Hiện backend chưa có GEMINI_API_KEY nên đây là phản hồi mẫu.\n\n"
        f"Bạn vừa hỏi: “{last_message[:240]}”.\n\n"
        "Gợi ý học nhanh: hãy gửi một câu tiếng Nhật, ví dụ “わたしは 学生です”, "
        "mình sẽ tách cụm, giải thích trợ từ, nghĩa tiếng Việt và cách đọc. "
        "Để bật Gemini AI thật, thêm GEMINI_API_KEY vào file môi trường rồi khởi động lại web."
    )


def sanitize_chat_messages(payload: ChatRequest) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [
        {
            "role": "system",
            "content": (
                "Bạn là Manabu AI, trợ lý luyện tiếng Nhật cho người Việt. "
                "Giải thích ngắn gọn, thân thiện, ưu tiên N5/N4, phương pháp chunking. "
                "Khi người học gửi tiếng Nhật, hãy tách cụm, nêu nghĩa tiếng Việt, cách đọc, "
                "điểm ngữ pháp và một ví dụ gần giống. Không bịa dữ liệu bài học."
            ),
        }
    ]
    if payload.lesson_title or payload.lesson_description:
        messages.append(
            {
                "role": "system",
                "content": (
                    "Ngữ cảnh bài học hiện tại: "
                    f"{payload.lesson_title or ''} - {payload.lesson_description or ''}"
                ).strip(),
            }
        )

    for message in payload.messages[-12:]:
        role = message.role if message.role in {"user", "assistant"} else "user"
        content = message.content.strip()
        if not content:
            continue
        messages.append({"role": role, "content": content[:1200]})
    return messages


def build_chat_system_instruction(payload: ChatRequest) -> str:
    instruction = (
        "Bạn là Manabu AI, trợ lý luyện tiếng Nhật cho người Việt. "
        "Giải thích ngắn gọn, thân thiện, ưu tiên N5/N4, phương pháp chunking. "
        "Khi người học gửi tiếng Nhật, hãy tách cụm, nêu nghĩa tiếng Việt, cách đọc, "
        "điểm ngữ pháp và một ví dụ gần giống. Không bịa dữ liệu bài học."
    )
    if payload.lesson_title or payload.lesson_description:
        instruction += (
            "\nNgữ cảnh bài học hiện tại: "
            f"{payload.lesson_title or ''} - {payload.lesson_description or ''}"
        ).strip()

    return instruction


def build_gemini_contents(payload: ChatRequest) -> list[dict[str, object]]:
    contents: list[dict[str, object]] = []
    for message in payload.messages[-12:]:
        content = message.content.strip()
        if not content:
            continue
        contents.append(
            {
                "role": "model" if message.role == "assistant" else "user",
                "parts": [{"text": content[:1200]}],
            }
        )

    while contents and contents[0].get("role") == "model":
        contents.pop(0)

    return contents or [{"role": "user", "parts": [{"text": "Xin chào"}]}]


def build_gemini_request_body(payload: ChatRequest) -> dict[str, object]:
    return {
        "systemInstruction": {
            "parts": [{"text": build_chat_system_instruction(payload)}]
        },
        "contents": build_gemini_contents(payload),
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 700,
        },
    }


def extract_gemini_reply(data: dict[str, object]) -> str:
    candidates = data.get("candidates")
    if not isinstance(candidates, list) or not candidates:
        return ""

    first = candidates[0]
    if not isinstance(first, dict):
        return ""

    content = first.get("content")
    if not isinstance(content, dict):
        return ""

    parts = content.get("parts")
    if not isinstance(parts, list):
        return ""

    reply_parts = [
        part.get("text", "")
        for part in parts
        if isinstance(part, dict) and isinstance(part.get("text"), str)
    ]
    return "".join(reply_parts).strip()


GEMINI_DEFAULT_API_BASE = "https://generativelanguage.googleapis.com/v1beta"


def get_gemini_api_key() -> str:
    return (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or "").strip()


def get_gemini_model() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite").strip().removeprefix("models/")


def get_gemini_api_base() -> str:
    return os.getenv("GEMINI_API_BASE", GEMINI_DEFAULT_API_BASE).strip().rstrip("/")


def build_gemini_url(model: str, action: str) -> str:
    return f"{get_gemini_api_base()}/models/{model}:{action}"


def looks_like_google_ai_studio_key(api_key: str) -> bool:
    # Google AI Studio API keys normally start with "AIza". Avoid logging or exposing
    # the actual key; this only helps users catch a copied wrong token quickly.
    return api_key.startswith("AIza") and len(api_key) >= 30


def build_gemini_connection_error_reply(exc: httpx.HTTPError, api_key: str, model: str) -> str:
    key_hint = ""
    if api_key and not looks_like_google_ai_studio_key(api_key):
        key_hint = (
            "\n\nLưu ý: GEMINI_API_KEY hiện tại không giống định dạng key Google AI Studio "
            "(thường bắt đầu bằng “AIza…”). Nếu bạn lấy nhầm token từ nơi khác, hãy tạo lại key "
            "trong Google AI Studio rồi thay vào file .env."
        )

    return (
        "Mình đã nhận được Gemini API key, nhưng máy hiện chưa mở được kết nối tới Gemini.\n\n"
        f"Model đang dùng: {model}\n"
        f"Lỗi kỹ thuật: {exc.__class__.__name__}\n\n"
        "Bạn kiểm tra theo thứ tự này nhé:\n"
        "1. Máy có vào được https://generativelanguage.googleapis.com không.\n"
        "2. VPN/proxy/firewall có chặn Google API không.\n"
        "3. Key có phải key tạo từ Google AI Studio không.\n"
        "4. Sau khi sửa .env, tắt cửa sổ .bat cũ rồi mở lại."
        f"{key_hint}"
    )



JAPANESE_SCORE_STRIP_RE = re.compile(r"[\s、。？！?!.・「」『』（）()\[\]【】…,.，;；:：~〜\-]+")


def normalize_for_japanese_speech(value: str) -> str:
    """Normalize Japanese learner/STT text for pronunciation scoring."""
    normalized = unicodedata.normalize("NFKC", value or "").casefold()
    return JAPANESE_SCORE_STRIP_RE.sub("", normalized).strip()


def levenshtein_distance(left: str, right: str) -> int:
    if left == right:
        return 0
    if not left:
        return len(right)
    if not right:
        return len(left)

    previous = list(range(len(right) + 1))
    for left_index, left_char in enumerate(left, start=1):
        current = [left_index]
        for right_index, right_char in enumerate(right, start=1):
            insert_cost = current[right_index - 1] + 1
            delete_cost = previous[right_index] + 1
            replace_cost = previous[right_index - 1] + (left_char != right_char)
            current.append(min(insert_cost, delete_cost, replace_cost))
        previous = current
    return previous[-1]


def japanese_similarity_score(
    target: str,
    transcript: str,
    variants: list[str] | None = None,
) -> int:
    normalized_transcript = normalize_for_japanese_speech(transcript)
    normalized_targets = [
        normalize_for_japanese_speech(candidate)
        for candidate in [target, *(variants or [])]
        if normalize_for_japanese_speech(candidate)
    ]
    if not normalized_targets and not normalized_transcript:
        return 100
    if not normalized_targets or not normalized_transcript:
        return 0

    best = 0
    for normalized_target in normalized_targets:
        distance = levenshtein_distance(normalized_target, normalized_transcript)
        score = (1 - distance / max(len(normalized_target), len(normalized_transcript))) * 100
        best = max(best, round(score))
    return max(0, min(100, best))


def split_target_tokens(target: str, chunks: list[str] | None) -> list[str]:
    if chunks:
        tokens = [chunk.strip() for chunk in chunks if chunk.strip()]
        if tokens:
            return tokens
    spaced = [token for token in target.split() if token.strip()]
    if spaced:
        return spaced
    return [character for character in target if normalize_for_japanese_speech(character)]


def build_pronunciation_token_feedback(
    target: str,
    transcript: str,
    chunks: list[str] | None,
    chunk_variants: list[list[str]] | None = None,
) -> list[PronunciationTokenFeedback]:
    transcript_key = normalize_for_japanese_speech(transcript)
    cursor = 0
    feedback: list[PronunciationTokenFeedback] = []

    for token_index, token in enumerate(split_target_tokens(target, chunks)):
        candidates = [token, *((chunk_variants or [])[token_index] if chunk_variants and token_index < len(chunk_variants) else [])]
        token_keys = [
            normalize_for_japanese_speech(candidate)
            for candidate in candidates
            if normalize_for_japanese_speech(candidate)
        ]
        if not token_keys:
            continue

        found_at = -1
        matched_key = ""
        for token_key in token_keys:
            local_index = transcript_key.find(token_key, cursor)
            if local_index < 0:
                local_index = transcript_key.find(token_key)
            if local_index >= 0:
                found_at = local_index
                matched_key = token_key
                break

        matched = found_at >= 0
        if matched:
            cursor = found_at + len(matched_key)
        feedback.append(
            PronunciationTokenFeedback(
                target=token,
                spoken=transcript if matched else None,
                matched=matched,
            )
        )

    return feedback


def build_roleplay_system_instruction(payload: RoleplaySessionRequest) -> str:
    scenario = payload.scenario.strip()[:180] or "Daily conversation"
    target_grammar = payload.target_grammar.strip()[:120] or "N5/N4 grammar"
    ai_role = payload.ai_role.strip()[:120] or "Japanese conversation partner"
    level = payload.level.strip()[:40] or "N5/N4"
    script_preference = payload.script_preference.strip()[:80] or "kana_with_simple_kanji"

    return f"""
You are Manabu AI, a Japanese output coach for Vietnamese learners.
Role-play configuration:
- Scenario: {scenario}
- AI role: {ai_role}
- Learner level: {level}
- Target grammar the learner must practice: {target_grammar}
- Script preference: {script_preference}

Conversation rules:
1. Stay inside the role-play scenario and behave as the AI role.
2. Keep the Japanese role-play line short: 1-2 sentences only.
3. Use beginner-friendly Japanese suitable for {level}. Prefer kana and simple kanji.
4. Actively steer the learner so they have to use: {target_grammar}.
5. If the learner's Japanese is wrong, unnatural, or does not use the target grammar, first give one concise correction in Vietnamese, then continue the role-play in Japanese.
6. If the learner writes Vietnamese or asks for help, explain briefly in Vietnamese and provide one model Japanese sentence using {target_grammar}.
7. Do not answer unrelated general questions. Gently bring the learner back to the scenario.

Response format, always plain text:
Sửa nhanh: <Vietnamese correction or "Không cần sửa.">
Mẫu đúng: <one natural Japanese model answer using the target grammar>
AI: <your in-character Japanese reply, 1-2 sentences>
""".strip()


def build_roleplay_gemini_contents(payload: RoleplayChatRequest) -> list[dict[str, object]]:
    contents: list[dict[str, object]] = []
    for message in payload.messages[-14:]:
        content = message.content.strip()
        if not content:
            continue
        contents.append(
            {
                "role": "model" if message.role == "assistant" else "user",
                "parts": [{"text": content[:1400]}],
            }
        )

    while contents and contents[0].get("role") == "model":
        contents.pop(0)

    if contents:
        return contents

    return [
        {
            "role": "user",
            "parts": [
                {
                    "text": (
                        "Start the role-play. Ask me a short Japanese question that nudges me "
                        "to use the target grammar."
                    )
                }
            ],
        }
    ]


def build_roleplay_gemini_request_body(payload: RoleplayChatRequest) -> dict[str, object]:
    return {
        "systemInstruction": {
            "parts": [{"text": build_roleplay_system_instruction(payload)}]
        },
        "contents": build_roleplay_gemini_contents(payload),
        "generationConfig": {
            "temperature": 0.55,
            "maxOutputTokens": 850,
        },
    }



def build_roleplay_opening_message(payload: RoleplaySessionRequest) -> str:
    scenario_key = unicodedata.normalize("NFKC", payload.scenario).casefold()
    grammar = payload.target_grammar.strip() or "今日の文法"
    grammar_hint = f"『{grammar}』を使って、短く答えてください。"

    if "nhà hàng" in scenario_key or "restaurant" in scenario_key or "レストラン" in scenario_key:
        return f"いらっしゃいませ。ご注文は何ですか。{grammar_hint}"
    if "nhà ga" in scenario_key or "station" in scenario_key or "駅" in scenario_key:
        return f"こんにちは。どこへ行きたいですか。{grammar_hint}"
    if "lớp" in scenario_key or "class" in scenario_key or "教室" in scenario_key:
        return f"こんにちは。きょうは何をしたいですか。{grammar_hint}"
    if "rủ" in scenario_key or "bạn" in scenario_key or "friend" in scenario_key or "友達" in scenario_key:
        return f"こんにちは。週末、何をしましょうか。{grammar_hint}"

    return f"こんにちは。ロールプレイを始めましょう。{grammar_hint}"

def build_roleplay_fallback_reply(payload: RoleplaySessionRequest) -> str:
    return (
        "Sửa nhanh: Mình chưa kết nối được Gemini, nên đây là phiên luyện mẫu offline.\n"
        f"Mẫu đúng: {build_roleplay_opening_message(payload)}\n"
        "AI: もう一度、短い日本語で答えてください。"
    )


async def iter_roleplay_text_stream(payload: RoleplayChatRequest):
    api_key = get_gemini_api_key()
    if not api_key:
        yield build_roleplay_fallback_reply(payload)
        return

    model = get_gemini_model()
    url = build_gemini_url(model, "streamGenerateContent")

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60, connect=10)) as client:
            async with client.stream(
                "POST",
                url,
                params={"key": api_key, "alt": "sse"},
                json=build_roleplay_gemini_request_body(payload),
            ) as response:
                if response.status_code >= 400:
                    try:
                        error = (await response.aread()).decode("utf-8", errors="replace")
                    except httpx.HTTPError:
                        error = ""
                    yield (
                        "Sửa nhanh: Chưa gọi được Gemini cho phòng role-play.\n"
                        "Mẫu đúng: もう一度、短い日本語で言ってください。\n"
                        f"AI: エラー {response.status_code} です。あとでまた練習しましょう。\n\n"
                        f"Chi tiết kỹ thuật: {error[:360] or 'Không có nội dung lỗi.'}"
                    )
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    raw = line.removeprefix("data:").strip()
                    if not raw or raw == "[DONE]":
                        continue
                    try:
                        data = json.loads(raw)
                    except json.JSONDecodeError:
                        continue
                    text = extract_gemini_reply(data)
                    if text:
                        yield text
    except httpx.HTTPError as exc:
        yield build_gemini_connection_error_reply(exc, api_key, model)

def get_lesson_or_404(lesson_id: int, db: Session) -> Lesson:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học.")
    return lesson



@app.post(
    "/api/ai-practice/pronunciation/evaluate",
    response_model=PronunciationEvaluateResponse,
    tags=["AI Practice"],
)
def evaluate_pronunciation(
    payload: PronunciationEvaluateRequest,
) -> PronunciationEvaluateResponse:
    normalized_target = normalize_for_japanese_speech(payload.target)
    normalized_transcript = normalize_for_japanese_speech(payload.transcript)
    return PronunciationEvaluateResponse(
        score=japanese_similarity_score(payload.target, payload.transcript, payload.variants),
        normalized_target=normalized_target,
        normalized_transcript=normalized_transcript,
        tokens=build_pronunciation_token_feedback(
            payload.target,
            payload.transcript,
            payload.chunks,
            payload.chunk_variants,
        ),
    )


@app.get("/api/ai-practice/pronunciation/status", tags=["AI Practice"])
def pronunciation_status() -> dict[str, object]:
    return {
        "browser_stt": True,
        "recommended_lang": "ja-JP",
        "server_scoring": True,
        "note": "MVP dùng Web Speech API trên trình duyệt và backend chỉ chấm điểm transcript.",
    }


@app.get("/api/ai-practice/roleplay/scenarios", tags=["AI Practice"])
def list_roleplay_scenarios() -> list[dict[str, str]]:
    return [
        {
            "scenario": "Ở nhà hàng",
            "ai_role": "Nhân viên phục vụ",
            "target_grammar": "〜てください",
            "description": "Gọi món, yêu cầu nước hoặc hỏi thực đơn.",
        },
        {
            "scenario": "Ở nhà ga",
            "ai_role": "Nhân viên nhà ga",
            "target_grammar": "〜へ行きたいです / 〜はどこですか",
            "description": "Hỏi đường, mua vé, hỏi sân ga.",
        },
        {
            "scenario": "Ở lớp học",
            "ai_role": "Giáo viên tiếng Nhật",
            "target_grammar": "〜てもいいですか / 〜てはいけません",
            "description": "Xin phép, hỏi quy định trong lớp.",
        },
        {
            "scenario": "Rủ bạn đi chơi",
            "ai_role": "Bạn người Nhật",
            "target_grammar": "〜ませんか / 〜ましょう",
            "description": "Mời đi ăn, xem phim, học chung.",
        },
    ]


@app.post(
    "/api/ai-practice/roleplay/session",
    response_model=RoleplaySessionResponse,
    tags=["AI Practice"],
)
def create_roleplay_session(payload: RoleplaySessionRequest) -> RoleplaySessionResponse:
    return RoleplaySessionResponse(
        session_id=str(uuid.uuid4()),
        opening_message=build_roleplay_opening_message(payload),
    )


@app.post("/api/ai-practice/roleplay/chat/stream", tags=["AI Practice"])
async def roleplay_chat_stream(payload: RoleplayChatRequest) -> StreamingResponse:
    return StreamingResponse(
        iter_roleplay_text_stream(payload),
        media_type="text/plain; charset=utf-8",
        headers={"x-ai-source": "gemini-roleplay-stream"},
    )

@app.get("/api/health", response_model=HealthResponse, tags=["System"])
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/ai-chat", response_model=ChatResponse, tags=["AI Tutor"])
async def ai_chat(payload: ChatRequest) -> ChatResponse:
    api_key = get_gemini_api_key()
    if not api_key:
        return ChatResponse(reply=build_gemini_fallback_chat_reply(payload), source="fallback")

    model = get_gemini_model()
    try:
        async with httpx.AsyncClient(timeout=35) as client:
            response = await client.post(
                build_gemini_url(model, "generateContent"),
                params={"key": api_key},
                json=build_gemini_request_body(payload),
            )
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        try:
            error = exc.response.json().get("error", {})
        except ValueError:
            error = {}
        status_code = exc.response.status_code
        error_code = error.get("status") or error.get("code") or "unknown_error"
        error_message = error.get("message") or str(exc)
        return ChatResponse(
            reply=(
                "Mình đã nhận được Gemini API key, nhưng Gemini đang từ chối yêu cầu.\n\n"
                f"Mã lỗi: {status_code} - {error_code}.\n"
                f"Chi tiết: {error_message}\n\n"
                "Bạn hãy kiểm tra lại GEMINI_API_KEY, quyền dùng Gemini API, quota miễn phí "
                "hoặc thử đổi GEMINI_MODEL trong file .env."
            ),
            source=f"gemini-error:{status_code}:{error_code}",
        )
    except httpx.HTTPError as exc:
        return ChatResponse(
            reply=build_gemini_connection_error_reply(exc, api_key, model),
            source=f"gemini-fallback:{exc.__class__.__name__}",
        )

    data = response.json()
    reply = extract_gemini_reply(data)
    return ChatResponse(reply=reply or build_gemini_fallback_chat_reply(payload), source="gemini")


async def iter_gemini_text_stream(payload: ChatRequest):
    api_key = get_gemini_api_key()
    if not api_key:
        yield build_gemini_fallback_chat_reply(payload)
        return

    model = get_gemini_model()
    url = build_gemini_url(model, "streamGenerateContent")

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60, connect=10)) as client:
            async with client.stream(
                "POST",
                url,
                params={"key": api_key, "alt": "sse"},
                json=build_gemini_request_body(payload),
            ) as response:
                if response.status_code >= 400:
                    try:
                        error = (await response.aread()).decode("utf-8", errors="replace")
                    except httpx.HTTPError:
                        error = ""
                    yield (
                        "Mình đã nhận được Gemini API key, nhưng Gemini đang từ chối yêu cầu.\n\n"
                        f"Mã lỗi: {response.status_code}.\n"
                        f"Chi tiết: {error[:500] or 'Không có nội dung lỗi.'}"
                    )
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    raw = line.removeprefix("data:").strip()
                    if not raw or raw == "[DONE]":
                        continue
                    try:
                        data = json.loads(raw)
                    except json.JSONDecodeError:
                        continue
                    text = extract_gemini_reply(data)
                    if text:
                        yield text
    except httpx.HTTPError as exc:
        yield build_gemini_connection_error_reply(exc, api_key, model)


@app.get("/api/ai-chat/status", tags=["AI Tutor"])
async def ai_chat_status() -> dict[str, object]:
    api_key = get_gemini_api_key()
    model = get_gemini_model()
    status: dict[str, object] = {
        "key_present": bool(api_key),
        "key_looks_like_google_ai_studio": looks_like_google_ai_studio_key(api_key)
        if api_key
        else False,
        "model": model,
        "api_base": get_gemini_api_base(),
        "ok": False,
    }
    if not api_key:
        status["message"] = "Chưa có GEMINI_API_KEY trong file .env."
        return status

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(12, connect=6)) as client:
            response = await client.get(
                f"{get_gemini_api_base()}/models/{model}",
                params={"key": api_key},
            )
            if response.status_code == 200:
                status["ok"] = True
                status["message"] = "Kết nối Gemini OK."
            else:
                status["status_code"] = response.status_code
                try:
                    error = response.json().get("error", {})
                except ValueError:
                    error = {}
                status["message"] = error.get("message") or response.text[:500]
    except httpx.HTTPError as exc:
        status["error_type"] = exc.__class__.__name__
        status["message"] = (
            "Không kết nối được tới Gemini. Hãy kiểm tra mạng, VPN/proxy/firewall "
            "hoặc key Google AI Studio."
        )
    return status


@app.post("/api/ai-chat/stream", tags=["AI Tutor"])
async def ai_chat_stream(payload: ChatRequest) -> StreamingResponse:
    return StreamingResponse(
        iter_gemini_text_stream(payload),
        media_type="text/plain; charset=utf-8",
        headers={"x-ai-source": "gemini-stream"},
    )


@app.get("/api/ai-chat/stream", tags=["AI Tutor"])
def ai_chat_stream_health() -> dict[str, str]:
    return {"status": "ok", "mode": "gemini-stream"}


@app.get("/api/lessons", response_model=list[LessonDetailResponse], tags=["Lessons"])
def list_lessons(db: Session = Depends(get_db)) -> list[LessonDetailResponse]:
    lessons = db.scalars(select(Lesson).order_by(Lesson.id)).all()
    return [
        LessonDetailResponse(
            id=lesson.id,
            title=lesson.title,
            description=lesson.description,
            sentence_count=db.scalar(
                select(func.count(Sentence.id)).where(Sentence.lesson_id == lesson.id)
            )
            or 0,
            passage_count=db.scalar(
                select(func.count(Passage.id)).where(Passage.lesson_id == lesson.id)
            )
            or 0,
        )
        for lesson in lessons
    ]


@app.get(
    "/api/lessons/{lesson_id}",
    response_model=LessonDetailResponse,
    tags=["Lessons"],
)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)) -> LessonDetailResponse:
    lesson = get_lesson_or_404(lesson_id, db)
    sentence_count = db.scalar(
        select(func.count(Sentence.id)).where(Sentence.lesson_id == lesson_id)
    )
    passage_count = db.scalar(
        select(func.count(Passage.id)).where(Passage.lesson_id == lesson_id)
    )
    return LessonDetailResponse(
        id=lesson.id,
        title=lesson.title,
        description=lesson.description,
        sentence_count=sentence_count or 0,
        passage_count=passage_count or 0,
    )


@app.get(
    "/api/lessons/{lesson_id}/sentences",
    response_model=list[SentenceResponse],
    tags=["Practice"],
)
def list_lesson_sentences(
    lesson_id: int, db: Session = Depends(get_db)
) -> list[SentenceResponse]:
    get_lesson_or_404(lesson_id, db)
    sentences = db.scalars(
        select(Sentence)
        .where(Sentence.lesson_id == lesson_id)
        .options(selectinload(Sentence.chunks))
        .order_by(Sentence.id)
    ).all()

    return [
        SentenceResponse(
            id=sentence.id,
            lesson_id=sentence.lesson_id,
            passage_id=sentence.passage_id,
            full_japanese=sentence.full_japanese,
            full_romaji=sentence.full_romaji,
            full_vietnamese=sentence.full_vietnamese,
            audio_url=sentence.audio_url,
            kanji_variants=sentence.kanji_variants,
            chunks=sorted(sentence.chunks, key=lambda chunk: chunk.order_index),
        )
        for sentence in sentences
    ]


@app.get(
    "/api/lessons/{lesson_id}/passages",
    response_model=list[PassageResponse],
    tags=["Reading"],
)
def list_lesson_passages(
    lesson_id: int, db: Session = Depends(get_db)
) -> list[PassageResponse]:
    get_lesson_or_404(lesson_id, db)
    passages = db.scalars(
        select(Passage)
        .where(Passage.lesson_id == lesson_id)
        .order_by(Passage.id)
    ).all()

    response: list[PassageResponse] = []
    for passage in passages:
        try:
            content = json.loads(passage.content)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=500, detail=f"Nội dung bài đọc {passage.id} không hợp lệ."
            ) from exc
        response.append(
            PassageResponse(
                id=passage.id,
                lesson_id=passage.lesson_id,
                title=passage.title,
                content=content,
            )
        )
    return response
