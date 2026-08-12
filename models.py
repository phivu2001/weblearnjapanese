"""SQLAlchemy models for lessons, reading passages, sentences and chunks."""

from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[str] = mapped_column(String)

    passages: Mapped[list["Passage"]] = relationship(
        back_populates="lesson", cascade="all, delete-orphan"
    )
    sentences: Mapped[list["Sentence"]] = relationship(
        back_populates="lesson", cascade="all, delete-orphan"
    )


class Passage(Base):
    __tablename__ = "passages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lesson_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(Text)

    lesson: Mapped[Lesson] = relationship(back_populates="passages")
    sentences: Mapped[list["Sentence"]] = relationship(back_populates="passage")


class Sentence(Base):
    __tablename__ = "sentences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lesson_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=True
    )
    passage_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("passages.id", ondelete="SET NULL"), nullable=True
    )
    full_japanese: Mapped[str] = mapped_column(String)
    full_romaji: Mapped[str] = mapped_column(String)
    full_vietnamese: Mapped[str] = mapped_column(String)
    audio_url: Mapped[str | None] = mapped_column(String, nullable=True)

    lesson: Mapped[Lesson | None] = relationship(back_populates="sentences")
    passage: Mapped[Passage | None] = relationship(back_populates="sentences")
    chunks: Mapped[list["Chunk"]] = relationship(
        back_populates="sentence",
        cascade="all, delete-orphan",
        order_by="Chunk.order_index",
    )


class Chunk(Base):
    __tablename__ = "chunks"
    __table_args__ = (
        Index("idx_chunks_sentence_order", "sentence_id", "order_index", unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sentence_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sentences.id", ondelete="CASCADE"), nullable=False
    )
    order_index: Mapped[int] = mapped_column(Integer)
    japanese: Mapped[str] = mapped_column(String)
    vietnamese: Mapped[str] = mapped_column(String)
    is_grammar_key: Mapped[bool] = mapped_column(Boolean, default=False)

    sentence: Mapped[Sentence] = relationship(back_populates="chunks")

