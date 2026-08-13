"""Integrity rules for authored chunk-based lesson content."""

from lesson_data_02_05 import (
    LESSON_PASSAGES as LESSON_PASSAGES_02_05,
    LESSON_SENTENCES as LESSON_SENTENCES_02_05,
)
from lesson_data_06_10 import (
    LESSON_PASSAGES as LESSON_PASSAGES_06_10,
    LESSON_SENTENCES as LESSON_SENTENCES_06_10,
)
from lesson_data_11_15 import (
    LESSON_PASSAGES as LESSON_PASSAGES_11_15,
    LESSON_SENTENCES as LESSON_SENTENCES_11_15,
)
from lesson_data_16_20 import (
    LESSON_PASSAGES as LESSON_PASSAGES_16_20,
    LESSON_SENTENCES as LESSON_SENTENCES_16_20,
)
from lesson_data_21_25 import (
    LESSON_PASSAGES as LESSON_PASSAGES_21_25,
    LESSON_SENTENCES as LESSON_SENTENCES_21_25,
)


def test_authored_lessons_follow_content_contract() -> None:
    lesson_sentences = {
        **LESSON_SENTENCES_02_05,
        **LESSON_SENTENCES_06_10,
        **LESSON_SENTENCES_11_15,
        **LESSON_SENTENCES_16_20,
        **LESSON_SENTENCES_21_25,
    }
    lesson_passages = {
        **LESSON_PASSAGES_02_05,
        **LESSON_PASSAGES_06_10,
        **LESSON_PASSAGES_11_15,
        **LESSON_PASSAGES_16_20,
        **LESSON_PASSAGES_21_25,
    }
    assert set(lesson_sentences) == set(range(2, 26))
    assert set(lesson_passages) == set(range(2, 26))

    for lesson_id, sentences in lesson_sentences.items():
        assert 15 <= len(sentences) <= 25

        for sentence in sentences:
            chunks = sentence["chunks"]
            assert 2 <= len(chunks) <= 4
            assert [chunk[0] for chunk in chunks] == list(
                range(1, len(chunks) + 1)
            )
            assert sum(bool(chunk[3]) for chunk in chunks) == 1
            assert "".join(chunk[1] for chunk in chunks) == sentence["full_japanese"]
            assert sentence["full_romaji"]
            assert sentence["full_vietnamese"]

        passage = lesson_passages[lesson_id]
        assert passage["title"]
        assert 6 <= len(passage["content"]) <= 8
        assert all(part["meaning"] and part["note"] for part in passage["content"])
