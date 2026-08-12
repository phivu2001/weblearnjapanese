"""Idempotent seed data for all 50 lessons and demo content for lessons 1-2."""

from __future__ import annotations

import json

from sqlalchemy import select

from database import SessionLocal, create_db_and_tables
from models import Chunk, Lesson, Passage, Sentence


LESSON_DESCRIPTIONS = [
    "Giới thiệu bản thân",
    "Đồ vật và đại từ chỉ định",
    "Địa điểm và phương hướng",
    "Thời gian và lịch sinh hoạt",
    "Di chuyển và phương tiện",
    "Hành động hằng ngày",
    "Cho, nhận và công cụ",
    "Tính từ và miêu tả",
    "Sở thích và năng lực",
    "Sự tồn tại của người và vật",
    "Số lượng và khoảng thời gian",
    "So sánh và lựa chọn",
    "Mong muốn và mục đích",
    "Yêu cầu và hướng dẫn",
    "Hành động đang diễn ra",
    "Nối câu và trình tự hành động",
    "Cấm đoán và nghĩa vụ",
    "Khả năng và sở thích",
    "Kinh nghiệm và thay đổi",
    "Mệnh đề bổ nghĩa",
    "Thể thông thường",
    "Mệnh đề danh từ và trích dẫn",
    "Thời điểm và tình huống",
    "Cho và nhận hành động",
    "Điều kiện và giả định",
    "Giải thích nguyên nhân",
    "Khả năng và giác quan",
    "Hành động đồng thời",
    "Tự động từ và trạng thái",
    "Chuẩn bị và hoàn tất",
    "Ý định và kế hoạch",
    "Lời khuyên và suy đoán",
    "Mệnh lệnh và truyền đạt",
    "Bị động",
    "Danh từ hóa hành động",
    "Mục đích và công dụng",
    "Trạng thái kết quả",
    "Điều kiện cần thiết",
    "Nguyên nhân và hệ quả",
    "Hỏi gián tiếp và thử làm",
    "Cho và nhận lịch sự",
    "Mục đích và nỗ lực",
    "Vẻ ngoài và xu hướng",
    "Giả định và nhượng bộ",
    "Trường hợp và hoàn cảnh",
    "Cấu trúc ところ và vừa mới",
    "Truyền đạt thông tin",
    "Thể sai khiến",
    "Kính ngữ",
    "Khiêm nhường ngữ",
]


DEMO_SENTENCES = {
    1: [
        {
            "full_japanese": "わたしはマイです。",
            "full_romaji": "Watashi wa Mai desu.",
            "full_vietnamese": "Tôi là Mai.",
            "chunks": [
                (1, "わたし", "tôi", False),
                (2, "は", "trợ từ chủ đề", True),
                (3, "マイです。", "là Mai", False),
            ],
        },
        {
            "full_japanese": "サントスさんはブラジル人です。",
            "full_romaji": "Santosu-san wa Burajiru-jin desu.",
            "full_vietnamese": "Anh Santos là người Brazil.",
            "chunks": [
                (1, "サントスさん", "anh Santos", False),
                (2, "は", "trợ từ chủ đề", True),
                (3, "ブラジル人です。", "là người Brazil", False),
            ],
        },
        {
            "full_japanese": "ミラーさんは会社員じゃありません。",
            "full_romaji": "Miraa-san wa kaishain ja arimasen.",
            "full_vietnamese": "Anh Miller không phải là nhân viên công ty.",
            "chunks": [
                (1, "ミラーさんは", "anh Miller", False),
                (2, "会社員", "nhân viên công ty", False),
                (3, "じゃありません。", "không phải là", True),
            ],
        },
    ],
    2: [
        {
            "full_japanese": "これは日本語の辞書です。",
            "full_romaji": "Kore wa Nihongo no jisho desu.",
            "full_vietnamese": "Đây là từ điển tiếng Nhật.",
            "chunks": [
                (1, "これは", "đây thì", True),
                (2, "日本語の", "của tiếng Nhật", False),
                (3, "辞書です。", "là từ điển", False),
            ],
        },
        {
            "full_japanese": "その傘はわたしのです。",
            "full_romaji": "Sono kasa wa watashi no desu.",
            "full_vietnamese": "Chiếc ô đó là của tôi.",
            "chunks": [
                (1, "その傘は", "chiếc ô đó", False),
                (2, "わたしの", "của tôi", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "これはだれの名刺ですか。",
            "full_romaji": "Kore wa dare no meishi desu ka.",
            "full_vietnamese": "Đây là danh thiếp của ai?",
            "chunks": [
                (1, "これは", "đây thì", False),
                (2, "だれの", "của ai", True),
                (3, "名刺ですか。", "là danh thiếp phải không", False),
            ],
        },
    ],
}


DEMO_PASSAGES = {
    1: {
        "title": "はじめまして — Lần đầu gặp mặt",
        "content": [
            {"text": "はじめまして。", "meaning": "Rất hân hạnh được gặp bạn.", "note": "Lời chào khi gặp lần đầu."},
            {"text": "わたし", "meaning": "tôi", "note": "Đại từ nhân xưng lịch sự, trung tính."},
            {"text": "は", "meaning": "trợ từ chủ đề", "note": "Viết là は nhưng đọc là わ khi làm trợ từ."},
            {"text": "グエンです。", "meaning": "là Nguyễn.", "note": "です kết thúc câu danh từ theo lối lịch sự."},
            {"text": "ベトナム人です。", "meaning": "Tôi là người Việt Nam.", "note": "Tên quốc gia + 人（じん）chỉ quốc tịch."},
            {"text": "どうぞよろしくお願いします。", "meaning": "Rất mong được bạn giúp đỡ.", "note": "Câu chào kết thúc phần tự giới thiệu."},
        ],
    },
    2: {
        "title": "これは何ですか — Đây là gì?",
        "content": [
            {"text": "これは", "meaning": "cái này", "note": "これ dùng cho vật ở gần người nói."},
            {"text": "日本語", "furigana": "にほんご", "meaning": "tiếng Nhật", "note": "日本 + 語（ngôn ngữ)."},
            {"text": "の辞書です。", "furigana": "のじしょです", "meaning": "là từ điển của…", "note": "の nối hai danh từ."},
            {"text": "あれは", "meaning": "cái kia", "note": "あれ dùng cho vật xa cả người nói lẫn người nghe."},
            {"text": "だれの傘ですか。", "furigana": "だれのかさですか", "meaning": "là ô của ai?", "note": "だれの dùng để hỏi sở hữu."},
        ],
    },
}


def seed_database() -> None:
    create_db_and_tables()
    with SessionLocal() as db:
        for lesson_id, description in enumerate(LESSON_DESCRIPTIONS, start=1):
            lesson = db.get(Lesson, lesson_id)
            if lesson is None:
                db.add(
                    Lesson(
                        id=lesson_id,
                        title=f"Bài {lesson_id}",
                        description=description,
                    )
                )
            else:
                lesson.title = f"Bài {lesson_id}"
                lesson.description = description
        db.commit()

        for lesson_id, sentence_items in DEMO_SENTENCES.items():
            existing = db.scalar(
                select(Sentence.id).where(Sentence.lesson_id == lesson_id).limit(1)
            )
            if existing is not None:
                continue

            for item in sentence_items:
                sentence = Sentence(
                    lesson_id=lesson_id,
                    full_japanese=item["full_japanese"],
                    full_romaji=item["full_romaji"],
                    full_vietnamese=item["full_vietnamese"],
                    audio_url=None,
                )
                sentence.chunks = [
                    Chunk(
                        order_index=order,
                        japanese=japanese,
                        vietnamese=vietnamese,
                        is_grammar_key=is_key,
                    )
                    for order, japanese, vietnamese, is_key in item["chunks"]
                ]
                db.add(sentence)

        for lesson_id, passage_item in DEMO_PASSAGES.items():
            existing = db.scalar(
                select(Passage.id).where(Passage.lesson_id == lesson_id).limit(1)
            )
            if existing is None:
                db.add(
                    Passage(
                        lesson_id=lesson_id,
                        title=passage_item["title"],
                        content=json.dumps(passage_item["content"], ensure_ascii=False),
                    )
                )

        db.commit()


if __name__ == "__main__":
    seed_database()
    print("Seed complete: 50 lessons and demo data for lessons 1-2.")
