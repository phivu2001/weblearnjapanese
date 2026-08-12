"""Smoke tests for the FastAPI/SQLite implementation."""

from fastapi.testclient import TestClient

from main import app


def test_learning_endpoints() -> None:
    with TestClient(app) as client:
        lessons = client.get("/api/lessons")
        assert lessons.status_code == 200
        assert len(lessons.json()) == 50

        detail = client.get("/api/lessons/1")
        assert detail.status_code == 200
        assert detail.json()["sentence_count"] == 3

        sentences = client.get("/api/lessons/1/sentences")
        assert sentences.status_code == 200
        assert len(sentences.json()) == 3
        assert [chunk["order_index"] for chunk in sentences.json()[0]["chunks"]] == [1, 2, 3]

        passages = client.get("/api/lessons/2/passages")
        assert passages.status_code == 200
        assert len(passages.json()) == 1

        assert client.get("/api/lessons/99").status_code == 404

