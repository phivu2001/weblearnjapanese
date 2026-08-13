# Manabu — Japanese Learning Web App

Ứng dụng học tiếng Nhật theo phương pháp Chunking, bám theo lộ trình 50 bài Minna no Nihongo.

File `MO_WEB_HOC_TIENG_NHAT.bat` chỉ khởi động ứng dụng; nó không seed hoặc ghi lại dữ liệu bài học.

## Tính năng

- Dashboard responsive gồm 50 bài học.
- Bài 1–25 có dữ liệu học hoàn chỉnh (22–25 câu mỗi bài và một bài đọc tương tác).
- 8 chế độ: học từ vựng, học ngữ pháp, điền cụm còn thiếu, kéo thả xếp câu, nghe chép, đọc tương tác, chọn câu Kanji từ Kana và học cách đọc Kanji từng từ.
- Một bài đặc biệt ngoài 50 bài với 66 ví dụ luyện chọn 22 từ để hỏi theo ngữ cảnh.
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

Khi sửa dữ liệu Python, đồng bộ dữ liệu cho bản web độc lập bằng:

```powershell
.\.venv\Scripts\python.exe scripts\export_edge_data.py
```

## Cấu trúc chính

- `database.py`, `models.py`, `schemas.py`: database và hợp đồng dữ liệu.
- `seed.py`: seed idempotent 50 bài và nội dung đã biên soạn cho Bài 1–25.
- `lesson_data_02_05.py`: câu, chunk và bài đọc của Bài 2–5.
- `lesson_data_06_10.py`: câu, chunk và bài đọc của Bài 6–10.
- `lesson_data_11_15.py`: câu, chunk và bài đọc của Bài 11–15.
- `lesson_data_16_20.py`, `lesson_data_21_25.py`: câu, chunk và bài đọc của Bài 16–25.
- `main.py`: các REST endpoint FastAPI.
- `app/LearningApp.tsx`, `app/globals.css`: giao diện và tương tác học.
- `worker/api-data.ts`: dữ liệu read-only cho bản web được xuất bản.
