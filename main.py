"""FastAPI application for the chunk-based Japanese learning web app."""

from __future__ import annotations

import json
import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models import Lesson, Passage, Sentence
from schemas import (
    HealthResponse,
    LessonDetailResponse,
    LessonResponse,
    PassageResponse,
    SentenceResponse,
)
from seed import seed_database


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
    allow_methods=["GET"],
    allow_headers=["*"],
)


def get_lesson_or_404(lesson_id: int, db: Session) -> Lesson:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học.")
    return lesson


@app.get("/api/health", response_model=HealthResponse, tags=["System"])
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


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
