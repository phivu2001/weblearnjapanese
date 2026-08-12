# Manabu — Japanese Learning Web App

Ứng dụng học tiếng Nhật theo phương pháp Chunking, bám theo lộ trình 50 bài Minna no Nihongo.

## Tính năng

- Dashboard responsive gồm 50 bài học.
- Bài 1 và Bài 2 có dữ liệu mẫu hoàn chỉnh.
- 4 chế độ: điền cụm còn thiếu, kéo thả xếp câu, nghe chép và đọc tương tác.
- FastAPI + SQLite + SQLAlchemy ORM, quan hệ và thứ tự chunk được tải bằng eager loading.
- Edge API read-only tương đương để bản frontend có thể chạy độc lập khi được xuất bản.

## Chạy backend

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe seed.py
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Tài liệu OpenAPI: `http://127.0.0.1:8000/docs`.

## Chạy frontend

Trong terminal thứ hai:

```powershell
pnpm install
pnpm dev
```

Mở địa chỉ Local URL được in trong terminal. Khi chạy ở localhost, frontend tự dùng FastAPI tại `http://127.0.0.1:8000/api`.

## Kiểm thử

```powershell
.\.venv\Scripts\python.exe -m pytest tests\test_api.py
pnpm test
```

Nếu không cài pytest, có thể dùng FastAPI `TestClient` hoặc chạy API rồi kiểm tra `/api/health`.

## Cấu trúc chính

- `database.py`, `models.py`, `schemas.py`: database và hợp đồng dữ liệu.
- `seed.py`: seed idempotent 50 bài và nội dung mẫu.
- `main.py`: các REST endpoint FastAPI.
- `app/LearningApp.tsx`, `app/globals.css`: giao diện và tương tác học.
- `worker/api-data.ts`: dữ liệu read-only cho bản web được xuất bản.
