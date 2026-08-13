"""FastAPI application for the chunk-based Japanese learning web app."""

from __future__ import annotations

import json
import os
from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
        f"{lesson_context}. Hiện backend chưa có OPENAI_API_KEY nên đây là phản hồi mẫu.\n\n"
        f"Bạn vừa hỏi: “{last_message[:240]}”.\n\n"
        "Gợi ý học nhanh: hãy gửi một câu tiếng Nhật, ví dụ “わたしは 学生です”, "
        "mình sẽ tách cụm, giải thích trợ từ, nghĩa tiếng Việt và cách đọc. "
        "Để bật AI thật, thêm OPENAI_API_KEY vào file môi trường rồi khởi động lại web."
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


def get_lesson_or_404(lesson_id: int, db: Session) -> Lesson:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học.")
    return lesson


@app.get("/api/health", response_model=HealthResponse, tags=["System"])
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/ai-chat", response_model=ChatResponse, tags=["AI Tutor"])
async def ai_chat(payload: ChatRequest) -> ChatResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return ChatResponse(reply=build_fallback_chat_reply(payload), source="fallback")

    model = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")
    try:
        async with httpx.AsyncClient(timeout=35) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "authorization": f"Bearer {api_key}",
                    "content-type": "application/json",
                },
                json={
                    "model": model,
                    "messages": sanitize_chat_messages(payload),
                    "temperature": 0.4,
                    "max_tokens": 700,
                },
            )
            response.raise_for_status()
    except httpx.HTTPError as exc:
        return ChatResponse(
            reply=(
                "Mình chưa gọi được AI thật lúc này, nên trả lời tạm bằng chế độ mẫu.\n\n"
                f"{build_fallback_chat_reply(payload)}"
            ),
            source=f"fallback:{exc.__class__.__name__}",
        )

    data = response.json()
    reply = (
        data.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
        .strip()
    )
    return ChatResponse(reply=reply or build_fallback_chat_reply(payload), source="openai")


@app.get("/api/lessons", response_model=list[LessonResponse], tags=["Lessons"])
def list_lessons(db: Session = Depends(get_db)) -> list[Lesson]:
    return list(db.scalars(select(Lesson).order_by(Lesson.id)).all())


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
