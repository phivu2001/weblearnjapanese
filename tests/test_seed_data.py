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
from lesson_data_26_30 import (
    LESSON_PASSAGES as LESSON_PASSAGES_26_30,
    LESSON_SENTENCES as LESSON_SENTENCES_26_30,
)
from lesson_data_31_35 import (
    LESSON_PASSAGES as LESSON_PASSAGES_31_35,
    LESSON_SENTENCES as LESSON_SENTENCES_31_35,
)
from lesson_data_36_40 import (
    LESSON_PASSAGES as LESSON_PASSAGES_36_40,
    LESSON_SENTENCES as LESSON_SENTENCES_36_40,
)
from lesson_data_41_45 import (
    LESSON_PASSAGES as LESSON_PASSAGES_41_45,
    LESSON_SENTENCES as LESSON_SENTENCES_41_45,
)
from lesson_data_46_50 import (
    LESSON_PASSAGES as LESSON_PASSAGES_46_50,
    LESSON_SENTENCES as LESSON_SENTENCES_46_50,
)


def test_authored_lessons_follow_content_contract() -> None:
    lesson_sentences = {
        **LESSON_SENTENCES_02_05,
        **LESSON_SENTENCES_06_10,
        **LESSON_SENTENCES_11_15,
        **LESSON_SENTENCES_16_20,
        **LESSON_SENTENCES_21_25,
        **LESSON_SENTENCES_26_30,
        **LESSON_SENTENCES_31_35,
        **LESSON_SENTENCES_36_40,
        **LESSON_SENTENCES_41_45,
        **LESSON_SENTENCES_46_50,
    }
    lesson_passages = {
        **LESSON_PASSAGES_02_05,
        **LESSON_PASSAGES_06_10,
        **LESSON_PASSAGES_11_15,
        **LESSON_PASSAGES_16_20,
        **LESSON_PASSAGES_21_25,
        **LESSON_PASSAGES_26_30,
        **LESSON_PASSAGES_31_35,
        **LESSON_PASSAGES_36_40,
        **LESSON_PASSAGES_41_45,
        **LESSON_PASSAGES_46_50,
    }
    assert set(lesson_sentences) == set(range(2, 51))
    assert set(lesson_passages) == set(range(2, 51))

    for lesson_id, sentences in lesson_sentences.items():
        if lesson_id <= 25:
            assert 15 <= len(sentences) <= 25
        else:
            assert len(sentences) == 10

        for sentence in sentences:
            chunks = sentence["chunks"]
            assert 2 <= len(chunks) <= 6
            assert [chunk[0] for chunk in chunks] == list(
                range(1, len(chunks) + 1)
            )
            grammar_key_count = sum(bool(chunk[3]) for chunk in chunks)
            assert 1 <= grammar_key_count <= 2
            assert "".join(chunk[1] for chunk in chunks) == sentence["full_japanese"]
            assert sentence["full_romaji"]
            assert sentence["full_vietnamese"]

        passages = lesson_passages[lesson_id]
        if isinstance(passages, dict):
            passages = [passages]
        assert len(passages) == (1 if lesson_id <= 25 else 2)
        for passage in passages:
            assert passage["title"]
            assert 6 <= len(passage["content"])
            assert all(part["meaning"] for part in passage["content"])
