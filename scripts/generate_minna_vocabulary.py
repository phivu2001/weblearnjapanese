"""Generate the frontend Minna no Nihongo vocabulary dataset from saved pages.

Usage:
    python scripts/generate_minna_vocabulary.py <html-directory> <output.ts>

The saved pages contain one vocabulary table per lesson with kana, kanji and
Vietnamese meanings. The generator deliberately ignores grammar, kanji-study
and dialogue tables so the practice mode contains vocabulary entries only.
"""

from __future__ import annotations

from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value).replace("\xa0", " ")).strip()


class TableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tables: list[list[list[str]]] = []
        self._table: list[list[str]] | None = None
        self._row: list[str] | None = None
        self._cell: list[str] | None = None
        self._table_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        del attrs
        if tag == "table":
            self._table_depth += 1
            if self._table_depth == 1:
                self._table = []
        elif self._table_depth == 1 and tag == "tr":
            self._row = []
        elif self._table_depth == 1 and tag in {"td", "th"}:
            self._cell = []
        elif self._cell is not None and tag == "br":
            self._cell.append(" ")

    def handle_data(self, data: str) -> None:
        if self._cell is not None:
            self._cell.append(data)

    def handle_endtag(self, tag: str) -> None:
        if self._table_depth == 1 and tag in {"td", "th"} and self._cell is not None:
            if self._row is not None:
                self._row.append(clean_text("".join(self._cell)))
            self._cell = None
        elif self._table_depth == 1 and tag == "tr" and self._row is not None:
            if self._table is not None and any(self._row):
                self._table.append(self._row)
            self._row = None
        elif tag == "table" and self._table_depth > 0:
            if self._table_depth == 1 and self._table:
                self.tables.append(self._table)
                self._table = None
            self._table_depth -= 1


def extract_lesson(path: Path, lesson_id: int) -> list[dict[str, object]]:
    parser = TableParser()
    parser.feed(path.read_text(encoding="utf-8"))

    vocabulary_table: list[list[str]] | None = None
    for table in parser.tables:
        header = " | ".join(table[0]).lower() if table else ""
        if "từ vựng" in header and "chữ hán" in header and "nghĩa" in header:
            vocabulary_table = table
            break

    if vocabulary_table is None:
        raise ValueError(f"Không tìm thấy bảng từ vựng trong {path}")

    result: list[dict[str, object]] = []
    seen: set[tuple[str, str]] = set()
    for row in vocabulary_table[1:]:
        if len(row) < 4 or not row[0].strip().isdigit():
            continue
        kana = clean_text(row[1])
        kanji = clean_text(row[2])
        vietnamese = clean_text(" ".join(row[3:]))
        if not kana or not vietnamese:
            continue

        key = (kana, kanji)
        if key in seen:
            continue
        seen.add(key)
        item_index = len(result) + 1
        result.append(
            {
                "id": lesson_id * 1000 + item_index,
                "japanese": kanji or kana,
                "kana": kana,
                "vietnamese": vietnamese,
            }
        )

    if not 15 <= len(result) <= 100:
        raise ValueError(
            f"Số mục bất thường ở Bài {lesson_id}: {len(result)} ({path})"
        )
    return result


def render_typescript(lessons: dict[int, list[dict[str, object]]]) -> str:
    lines = [
        "// Generated from the Vietnamese Minna no Nihongo lesson vocabulary tables.",
        "// Regenerate with scripts/generate_minna_vocabulary.py; do not edit by hand.",
        "export type MinnaVocabularyItem = {",
        "  id: number;",
        "  japanese: string;",
        "  kana: string;",
        "  vietnamese: string;",
        "};",
        "",
        "export const minnaVocabulary: Record<number, MinnaVocabularyItem[]> = {",
    ]
    for lesson_id, items in lessons.items():
        lines.append(f"  {lesson_id}: [")
        for item in items:
            serialized = json.dumps(item, ensure_ascii=False, separators=(",", ":"))
            lines.append(f"    {serialized},")
        lines.append("  ],")
    lines.extend(["};", ""])
    return "\n".join(lines)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(
            "Usage: python scripts/generate_minna_vocabulary.py <html-directory> <output.ts>"
        )

    input_dir = Path(sys.argv[1]).resolve()
    output_path = Path(sys.argv[2]).resolve()
    lessons: dict[int, list[dict[str, object]]] = {}
    for lesson_id in range(1, 51):
        source = input_dir / f"lesson-{lesson_id:02d}.html"
        if not source.exists():
            raise FileNotFoundError(source)
        lessons[lesson_id] = extract_lesson(source, lesson_id)

    output_path.write_text(render_typescript(lessons), encoding="utf-8")
    counts = ", ".join(f"{lesson}:{len(items)}" for lesson, items in lessons.items())
    print(f"Generated {sum(map(len, lessons.values()))} items across 50 lessons.")
    print(f"Counts: {counts}")


if __name__ == "__main__":
    main()
