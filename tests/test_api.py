"""Smoke tests for the FastAPI/SQLite implementation."""

from fastapi.testclient import TestClient

from main import app
from seed import seed_database


def test_learning_endpoints() -> None:
    seed_database()
    with TestClient(app) as client:
        lessons = client.get("/api/lessons")
        assert lessons.status_code == 200
        assert len(lessons.json()) == 50

        detail = client.get("/api/lessons/1")
        assert detail.status_code == 200
        assert detail.json()["sentence_count"] == 25

        sentences = client.get("/api/lessons/1/sentences")
        assert sentences.status_code == 200
        assert len(sentences.json()) == 25
        assert [chunk["order_index"] for chunk in sentences.json()[0]["chunks"]] == [1, 2, 3]

        for lesson_id, expected_count in {
            2: 24,
            3: 24,
            4: 24,
            5: 25,
            6: 22,
            7: 23,
            8: 24,
            9: 24,
            10: 24,
            11: 24,
            12: 24,
            13: 24,
            14: 24,
            15: 24,
            16: 24,
            17: 24,
            18: 24,
            19: 24,
            20: 24,
            21: 24,
            22: 24,
            23: 24,
            24: 24,
            25: 24,
            26: 10,
            27: 10,
            28: 10,
            29: 10,
            30: 10,
            31: 10,
            32: 10,
            33: 10,
            34: 10,
            35: 10,
            36: 10,
            37: 10,
            38: 10,
            39: 10,
            40: 10,
            41: 10,
            42: 10,
            43: 10,
            44: 10,
            45: 10,
            46: 10,
            47: 10,
            48: 10,
            49: 10,
            50: 10,
        }.items():
            lesson_sentences = client.get(f"/api/lessons/{lesson_id}/sentences")
            assert lesson_sentences.status_code == 200
            assert len(lesson_sentences.json()) == expected_count
            assert all(
                1 <= sum(chunk["is_grammar_key"] for chunk in sentence["chunks"]) <= 2
                for sentence in lesson_sentences.json()
            )

        for lesson_id in range(2, 26):
            passages = client.get(f"/api/lessons/{lesson_id}/passages")
            assert passages.status_code == 200
            assert len(passages.json()) == 1

        for lesson_id in range(26, 51):
            passages = client.get(f"/api/lessons/{lesson_id}/passages")
            assert passages.status_code == 200
            assert len(passages.json()) == 2

        assert client.get("/api/lessons/99").status_code == 404
