"""Pydantic response schemas used by the REST API."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class LessonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str


class LessonDetailResponse(LessonResponse):
    sentence_count: int
    passage_count: int


class ChunkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_index: int
    japanese: str
    vietnamese: str
    is_grammar_key: bool
    kanji_variants: str | None = None


class SentenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    lesson_id: int | None
    passage_id: int | None
    full_japanese: str
    full_romaji: str
    full_vietnamese: str
    audio_url: str | None
    kanji_variants: str | None = None
    chunks: list[ChunkResponse]


class PassageChunkResponse(BaseModel):
    text: str
    furigana: str | None = None
    meaning: str
    note: str | None = None


class PassageResponse(BaseModel):
    id: int
    lesson_id: int
    title: str
    content: list[PassageChunkResponse]


class HealthResponse(BaseModel):
    status: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    lesson_title: str | None = None
    lesson_description: str | None = None


class ChatResponse(BaseModel):
    reply: str
    source: str = "fallback"
