"use client";

/* eslint-disable react/prop-types */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Lesson = {
  id: number;
  title: string;
  description: string;
  sentence_count?: number;
  passage_count?: number;
};

type Chunk = {
  id: number;
  order_index: number;
  japanese: string;
  vietnamese: string;
  is_grammar_key: boolean;
};

type Sentence = {
  id: number;
  lesson_id: number | null;
  passage_id: number | null;
  full_japanese: string;
  full_romaji: string;
  full_vietnamese: string;
  audio_url: string | null;
  chunks: Chunk[];
};

type PassagePart = {
  text: string;
  furigana?: string | null;
  meaning: string;
  note?: string | null;
};

type Passage = {
  id: number;
  lesson_id: number;
  title: string;
  content: PassagePart[];
};

type ModeId = "cloze" | "scramble" | "dictation" | "reading";
type Feedback = { kind: "success" | "error"; message: string } | null;

const API_BASE =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
  window.location.port !== "8000"
    ? "http://127.0.0.1:8000/api"
    : "/api";

const lessonFallback: Lesson[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Bài ${index + 1}`,
  description:
    index === 0
      ? "Giới thiệu bản thân"
      : index === 1
        ? "Đồ vật và đại từ chỉ định"
        : "Nội dung Minna no Nihongo",
}));

const modes: Array<{
  id: ModeId;
  number: string;
  glyph: string;
  title: string;
  japanese: string;
  description: string;
  accent: string;
}> = [
  {
    id: "cloze",
    number: "01",
    glyph: "文",
    title: "Điền mảnh ghép",
    japanese: "穴埋め",
    description: "Nhìn ngữ cảnh, hoàn thiện đúng cụm ngữ pháp còn thiếu.",
    accent: "coral",
  },
  {
    id: "scramble",
    number: "02",
    glyph: "並",
    title: "Xếp lại câu",
    japanese: "並べ替え",
    description: "Kéo thả các chunk để tái tạo nhịp câu tự nhiên.",
    accent: "yellow",
  },
  {
    id: "dictation",
    number: "03",
    glyph: "聴",
    title: "Nghe chép",
    japanese: "ディクテーション",
    description: "Nghe trọn câu, nhập lại chính xác điều bạn nghe thấy.",
    accent: "mint",
  },
  {
    id: "reading",
    number: "04",
    glyph: "読",
    title: "Đọc tương tác",
    japanese: "読解",
    description: "Đọc đoạn ngắn và chạm vào từng cụm để hiểu sâu.",
    accent: "lavender",
  },
];

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function Brand() {
  return (
    <div className="brand" aria-label="Manabu">
      <div className="brandMark">ま</div>
      <div>
        <strong>MANABU</strong>
        <span>CHUNK JAPANESE</span>
      </div>
    </div>
  );
}

function AppHeader({ onHome }: { onHome: () => void }) {
  return (
    <header className="siteHeader">
      <button className="brandButton" onClick={onHome} aria-label="Về trang chủ">
        <Brand />
      </button>
      <nav aria-label="Điều hướng chính">
        <a href="#lessons">50 bài học</a>
        <span className="navDot" />
        <span>Chunking method</span>
      </nav>
    </header>
  );
}

function Dashboard({ onSelect }: { onSelect: (lesson: Lesson) => void }) {
  const [lessons, setLessons] = useState<Lesson[]>(lessonFallback);
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<"all" | "basic" | "middle" | "advanced">(
    "all",
  );
  const [apiOnline, setApiOnline] = useState(true);

  useEffect(() => {
    requestJson<Lesson[]>("/lessons")
      .then((data) => {
        setLessons(data);
        setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    return lessons.filter((lesson) => {
      const matchesText = `${lesson.title} ${lesson.description}`
        .toLocaleLowerCase("vi")
        .includes(normalizedQuery);
      const matchesRange =
        range === "all" ||
        (range === "basic" && lesson.id <= 15) ||
        (range === "middle" && lesson.id > 15 && lesson.id <= 35) ||
        (range === "advanced" && lesson.id > 35);
      return matchesText && matchesRange;
    });
  }, [lessons, query, range]);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="heroCopy">
          <div className="eyebrow">
            <span>50 BÀI · 4 CÁCH LUYỆN</span>
            <i />
            <span>MINNA NO NIHONGO</span>
          </div>
          <h1 id="hero-title">
            Học theo cụm.
            <span>Nói thành câu.</span>
          </h1>
          <p>
            Đừng học từng từ rời rạc. Ghi nhớ tiếng Nhật bằng những mảnh câu có
            nghĩa — đúng cách bộ não thực sự dùng ngôn ngữ.
          </p>
          <a className="primaryCta" href="#lessons">
            Bắt đầu từ Bài 1 <ArrowIcon />
          </a>
        </div>
        <aside className="methodCard" aria-label="Phương pháp Chunking">
          <div className="japaneseStamp">塊</div>
          <div className="methodTopline">
            <span>PHƯƠNG PHÁP</span>
            <span>01 — 50</span>
          </div>
          <div className="chunkDemo" aria-label="Ví dụ chia cụm câu">
            <span>わたしは</span>
            <span>毎朝</span>
            <span>コーヒーを</span>
            <span>飲みます。</span>
          </div>
          <div className="methodFooter">
            <span>MỖI CHUNK LÀ MỘT Ý</span>
            <strong>Nhớ nhanh hơn · Dùng tự nhiên hơn</strong>
          </div>
        </aside>
      </section>

      <section className="lessonSection" id="lessons" aria-labelledby="lessons-title">
        <div className="sectionHeading">
          <div>
            <span className="sectionKicker">LỘ TRÌNH CỦA BẠN</span>
            <h2 id="lessons-title">Chọn một bài để bắt đầu</h2>
          </div>
          <div className={`apiStatus ${apiOnline ? "online" : "offline"}`}>
            <span />
            {apiOnline ? "Dữ liệu đã sẵn sàng" : "Đang xem lộ trình mẫu"}
          </div>
        </div>

        <div className="lessonToolbar">
          <label className="searchBox">
            <span aria-hidden="true">⌕</span>
            <span className="srOnly">Tìm bài học</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo số bài hoặc chủ đề..."
            />
          </label>
          <div className="rangeTabs" role="group" aria-label="Lọc theo cấp độ">
            {([
              ["all", "Tất cả"],
              ["basic", "Cơ bản 1–15"],
              ["middle", "Trung cấp 16–35"],
              ["advanced", "Nâng cao 36–50"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={range === value ? "active" : ""}
                onClick={() => setRange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="lessonGrid">
          {filtered.map((lesson) => {
            const available = lesson.id <= 2;
            return (
              <button
                className={`lessonCard ${available ? "hasContent" : ""}`}
                key={lesson.id}
                onClick={() => onSelect(lesson)}
                aria-label={`Mở ${lesson.title}: ${lesson.description}`}
              >
                <div className="lessonCardTop">
                  <span className="lessonNumber">{String(lesson.id).padStart(2, "0")}</span>
                  <span className="lessonArrow"><ArrowIcon /></span>
                </div>
                <div>
                  <span className="lessonLabel">LESSON</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.description}</p>
                </div>
                <div className="lessonMeta">
                  <span>{available ? "CÓ BÀI LUYỆN" : "TRONG LỘ TRÌNH"}</span>
                  <i />
                </div>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="emptySearch">Không tìm thấy bài học phù hợp.</div>
        )}
      </section>
    </>
  );
}

function LessonMenu({
  lesson,
  onBack,
  onMode,
}: {
  lesson: Lesson;
  onBack: () => void;
  onMode: (mode: ModeId) => void;
}) {
  const [detail, setDetail] = useState(lesson);

  useEffect(() => {
    requestJson<Lesson>(`/lessons/${lesson.id}`)
      .then(setDetail)
      .catch(() => setDetail(lesson));
  }, [lesson]);

  return (
    <main className="lessonMenuPage">
      <button className="textBack" onClick={onBack}>
        <span aria-hidden="true">←</span> Tất cả bài học
      </button>
      <section className="lessonIntro">
        <div className="lessonIntroNumber">{String(lesson.id).padStart(2, "0")}</div>
        <div>
          <span className="sectionKicker">MINNA NO NIHONGO · {detail.title.toUpperCase()}</span>
          <h1>{detail.description}</h1>
          <p>
            Chọn một cách luyện. Mỗi hoạt động giúp bạn nhìn, nghe và tái tạo
            cùng một cấu trúc câu theo một góc khác.
          </p>
        </div>
        <div className="lessonStats">
          <div><strong>{detail.sentence_count ?? (lesson.id <= 2 ? 3 : 0)}</strong><span>CÂU MẪU</span></div>
          <div><strong>4</strong><span>CHẾ ĐỘ</span></div>
        </div>
      </section>

      <section className="modeSection" aria-labelledby="mode-title">
        <div className="modeHeading">
          <span className="sectionKicker">CHỌN CÁCH LUYỆN</span>
          <h2 id="mode-title">Hôm nay bạn muốn luyện gì?</h2>
        </div>
        <div className="modeGrid">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`modeCard ${mode.accent}`}
              onClick={() => onMode(mode.id)}
            >
              <div className="modeTop">
                <span>{mode.number}</span>
                <span className="modeGlyph">{mode.glyph}</span>
              </div>
              <div>
                <span className="modeJapanese">{mode.japanese}</span>
                <h3>{mode.title}</h3>
                <p>{mode.description}</p>
              </div>
              <div className="modeAction">BẮT ĐẦU <ArrowIcon /></div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <div className={`feedback ${feedback.kind}`} role="status">
      <strong>{feedback.kind === "success" ? "Chính xác!" : "Chưa đúng."}</strong>
      <span>{feedback.message}</span>
    </div>
  );
}

function EmptyPractice({ onBack }: { onBack: () => void }) {
  return (
    <div className="emptyPractice">
      <span className="emptyGlyph">準</span>
      <h2>Nội dung đang được chuẩn bị</h2>
      <p>
        Bản mẫu hiện có bài luyện đầy đủ cho Bài 1 và Bài 2. API đã sẵn sàng để
        bạn thêm dữ liệu cho bài này.
      </p>
      <button className="secondaryButton" onClick={onBack}>Chọn chế độ khác</button>
    </div>
  );
}

function PracticeHeader({
  lesson,
  mode,
  current,
  total,
  onBack,
}: {
  lesson: Lesson;
  mode: (typeof modes)[number];
  current: number;
  total: number;
  onBack: () => void;
}) {
  return (
    <div className="practiceHeader">
      <button className="roundBack" onClick={onBack} aria-label="Quay lại menu bài học">←</button>
      <div className="practiceIdentity">
        <span>{mode.japanese}</span>
        <strong>{mode.title}</strong>
      </div>
      <div className="practiceProgress">
        <span>{lesson.title}</span>
        <strong>{total ? `${current + 1} / ${total}` : "—"}</strong>
      </div>
    </div>
  );
}

function ExerciseNav({
  index,
  total,
  onPrevious,
  onNext,
}: {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="exerciseNav">
      <button onClick={onPrevious} disabled={index === 0}>← Câu trước</button>
      <div className="progressDots" aria-label={`Câu ${index + 1} trên ${total}`}>
        {Array.from({ length: total }, (_, dot) => (
          <span key={dot} className={dot === index ? "active" : dot < index ? "done" : ""} />
        ))}
      </div>
      <button onClick={onNext} disabled={index >= total - 1}>Câu tiếp →</button>
    </div>
  );
}

function ClozeMode({ sentence }: { sentence: Sentence }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const keyChunks = sentence.chunks.filter((chunk) => chunk.is_grammar_key);

  const check = () => {
    const correct = keyChunks.every(
      (chunk) => (answers[chunk.id] ?? "").trim() === chunk.japanese,
    );
    setFeedback(
      correct
        ? { kind: "success", message: "Bạn đã đặt đúng mảnh ngữ pháp vào câu." }
        : { kind: "error", message: "Hãy nhìn nghĩa tiếng Việt và thử lại từng ký tự." },
    );
  };

  return (
    <div className="exerciseContent">
      <div className="promptBlock">
        <span className="promptLabel">DỊCH NGHĨA</span>
        <p>{sentence.full_vietnamese}</p>
      </div>
      <div className="clozeSentence" lang="ja">
        {sentence.chunks.map((chunk) =>
          chunk.is_grammar_key ? (
            <input
              key={chunk.id}
              value={answers[chunk.id] ?? ""}
              onChange={(event) => {
                setAnswers((current) => ({ ...current, [chunk.id]: event.target.value }));
                setFeedback(null);
              }}
              style={{ width: `${Math.max(4, chunk.japanese.length + 1)}em` }}
              aria-label={`Điền cụm còn thiếu: ${chunk.vietnamese}`}
              autoComplete="off"
            />
          ) : (
            <span key={chunk.id}>{chunk.japanese}</span>
          ),
        )}
      </div>
      <div className="hintLine">
        <span>GỢI Ý</span>
        {keyChunks.map((chunk) => chunk.vietnamese).join(" · ")}
      </div>
      <FeedbackBanner feedback={feedback} />
      <button className="checkButton" onClick={check}>Kiểm tra đáp án <span>↵</span></button>
    </div>
  );
}

function shuffleChunks(chunks: Chunk[]) {
  const shuffled = [...chunks].sort(() => Math.random() - 0.5);
  if (
    shuffled.length > 1 &&
    shuffled.every((chunk, index) => chunk.id === chunks[index]?.id)
  ) {
    return shuffled.reverse();
  }
  return shuffled;
}

function ScrambleMode({ sentence }: { sentence: Sentence }) {
  const [bank, setBank] = useState<Chunk[]>(() => shuffleChunks(sentence.chunks));
  const [answer, setAnswer] = useState<Chunk[]>([]);
  const [dragged, setDragged] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const reset = useCallback(() => {
    setBank(shuffleChunks(sentence.chunks));
    setAnswer([]);
    setFeedback(null);
  }, [sentence]);

  const move = (chunkId: number, destination: "bank" | "answer", at?: number) => {
    const chunk = [...bank, ...answer].find((item) => item.id === chunkId);
    if (!chunk) return;
    const nextBank = bank.filter((item) => item.id !== chunkId);
    const nextAnswer = answer.filter((item) => item.id !== chunkId);
    const target = destination === "bank" ? nextBank : nextAnswer;
    target.splice(at ?? target.length, 0, chunk);
    setBank(destination === "bank" ? target : nextBank);
    setAnswer(destination === "answer" ? target : nextAnswer);
    setFeedback(null);
  };

  const dropAt = (destination: "bank" | "answer", at?: number) => {
    if (dragged !== null) move(dragged, destination, at);
    setDragged(null);
  };

  const check = () => {
    const correct =
      answer.length === sentence.chunks.length &&
      answer.every(
        (chunk, index) =>
          chunk.order_index ===
          [...sentence.chunks].sort((a, b) => a.order_index - b.order_index)[index]?.order_index,
      );
    setFeedback(
      correct
        ? { kind: "success", message: "Nhịp câu đã đúng. Hãy đọc thành tiếng một lần nữa." }
        : { kind: "error", message: "Thứ tự chưa khớp. Chú ý trợ từ và phần kết câu." },
    );
  };

  const ChunkButton = ({ chunk, source, index }: { chunk: Chunk; source: "bank" | "answer"; index: number }) => (
    <button
      className="dragChunk"
      draggable
      onDragStart={() => setDragged(chunk.id)}
      onDragEnd={() => setDragged(null)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        dropAt(source, index);
      }}
      onClick={() => move(chunk.id, source === "bank" ? "answer" : "bank")}
      aria-label={`${chunk.japanese}. Chạm để chuyển ${source === "bank" ? "vào câu" : "về kho"}.`}
    >
      <span lang="ja">{chunk.japanese}</span>
      <small>{chunk.vietnamese}</small>
    </button>
  );

  return (
    <div className="exerciseContent scrambleContent">
      <div className="promptBlock compact">
        <span className="promptLabel">SẮP XẾP THÀNH CÂU</span>
        <p>{sentence.full_vietnamese}</p>
      </div>
      <div className="dropGroup">
        <div className="zoneLabel"><span>CÂU CỦA BẠN</span><small>Kéo hoặc chạm để sắp xếp</small></div>
        <div
          className={`dropZone ${answer.length ? "hasItems" : ""}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); dropAt("answer"); }}
        >
          {answer.length === 0 && <span className="dropPlaceholder">Thả các mảnh câu vào đây</span>}
          {answer.map((chunk, index) => <ChunkButton key={chunk.id} chunk={chunk} source="answer" index={index} />)}
        </div>
      </div>
      <div className="dropGroup">
        <div className="zoneLabel"><span>CÁC MẢNH CÂU</span><button onClick={reset}>Trộn lại ↻</button></div>
        <div
          className="chunkBank"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); dropAt("bank"); }}
        >
          {bank.map((chunk, index) => <ChunkButton key={chunk.id} chunk={chunk} source="bank" index={index} />)}
        </div>
      </div>
      <FeedbackBanner feedback={feedback} />
      <button className="checkButton" onClick={check}>Kiểm tra thứ tự <span>↵</span></button>
    </div>
  );
}

function normalizeJapanese(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\s。、！？!?.,，．「」『』・…—–-]/gu, "")
    .toLocaleLowerCase("ja");
}

function DictationMode({ sentence }: { sentence: Sentence }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, [sentence.id]);

  const play = () => {
    if (sentence.audio_url && audioRef.current) {
      void audioRef.current.play();
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence.full_japanese);
      utterance.lang = "ja-JP";
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
    }
  };

  const check = () => {
    const correct = normalizeJapanese(answer) === normalizeJapanese(sentence.full_japanese);
    setFeedback(
      correct
        ? { kind: "success", message: "Bạn đã nghe đúng toàn bộ câu." }
        : { kind: "error", message: "Nghe lại ở tốc độ chậm và kiểm tra các trợ từ." },
    );
  };

  return (
    <div className="exerciseContent dictationContent">
      <div className="audioStage">
        <div className="soundRings" aria-hidden="true"><i /><i /><i /></div>
        <button className="playButton" onClick={play} aria-label="Phát câu tiếng Nhật">▶</button>
        <div>
          <span className="promptLabel">NGHE CÂU MẪU</span>
          <p>Nhấn để nghe · Có thể nghe lại nhiều lần</p>
        </div>
        {/* A single Japanese exercise prompt does not have a separate caption track. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        {sentence.audio_url && <audio ref={audioRef} src={sentence.audio_url} preload="metadata" />}
      </div>
      <label className="dictationInput">
        <span>NHẬP CÂU BẠN NGHE ĐƯỢC</span>
        <textarea
          value={answer}
          onChange={(event) => { setAnswer(event.target.value); setFeedback(null); }}
          placeholder="日本語で入力してください…"
          lang="ja"
          rows={3}
        />
      </label>
      <div className="hintLine"><span>NGHĨA</span>{sentence.full_vietnamese}</div>
      <FeedbackBanner feedback={feedback} />
      <button className="checkButton" onClick={check}>Kiểm tra chính tả <span>↵</span></button>
    </div>
  );
}

function ReadingMode({ passage }: { passage: Passage }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="exerciseContent readingContent">
      <div className="readingTitle">
        <span className="promptLabel">BÀI ĐỌC NGẮN</span>
        <h2>{passage.title}</h2>
        <p>Di chuột hoặc chạm vào từng cụm được gạch dưới để xem giải thích.</p>
      </div>
      <div className="readingPaper" lang="ja">
        <div className="paperIndex">読<br />解</div>
        <div className="readingFlow">
          {passage.content.map((part, index) => (
            <span className="tooltipWrap" key={`${part.text}-${index}`}>
              <button
                className={`chunkTooltip ${active === index ? "active" : ""}`}
                onClick={() => setActive(active === index ? null : index)}
                aria-describedby={`tooltip-${index}`}
              >
                {part.furigana ? <ruby>{part.text}<rt>{part.furigana}</rt></ruby> : part.text}
              </button>
              <span className="tooltipCard" id={`tooltip-${index}`} role="tooltip">
                <strong>{part.meaning}</strong>
                {part.note && <small>{part.note}</small>}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="readingLegend"><i /> Cụm có thể tương tác</div>
    </div>
  );
}

function PracticeScreen({
  lesson,
  modeId,
  onBack,
}: {
  lesson: Lesson;
  modeId: ModeId;
  onBack: () => void;
}) {
  const mode = modes.find((item) => item.id === modeId) ?? modes[0];
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const path = modeId === "reading" ? "passages" : "sentences";
    requestJson<Sentence[] | Passage[]>(`/lessons/${lesson.id}/${path}`)
      .then((data) => {
        if (modeId === "reading") setPassages(data as Passage[]);
        else setSentences(data as Sentence[]);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [lesson.id, modeId]);

  const total = modeId === "reading" ? passages.length : sentences.length;
  const next = () => setIndex((current) => Math.min(current + 1, total - 1));
  const previous = () => setIndex((current) => Math.max(current - 1, 0));

  return (
    <main className="practicePage">
      <PracticeHeader lesson={lesson} mode={mode} current={index} total={total} onBack={onBack} />
      <section className={`practiceCard ${mode.accent}`}>
        {loading ? (
          <div className="loadingState"><span /><p>Đang chuẩn bị bài luyện…</p></div>
        ) : failed ? (
          <div className="emptyPractice">
            <span className="emptyGlyph">接</span>
            <h2>Chưa kết nối được dữ liệu</h2>
            <p>Hãy khởi động FastAPI ở cổng 8000 rồi tải lại chế độ luyện này.</p>
            <button className="secondaryButton" onClick={() => window.location.reload()}>Thử kết nối lại</button>
          </div>
        ) : total === 0 ? (
          <EmptyPractice onBack={onBack} />
        ) : (
          <>
            {modeId === "cloze" && <ClozeMode key={sentences[index].id} sentence={sentences[index]} />}
            {modeId === "scramble" && <ScrambleMode key={sentences[index].id} sentence={sentences[index]} />}
            {modeId === "dictation" && <DictationMode key={sentences[index].id} sentence={sentences[index]} />}
            {modeId === "reading" && <ReadingMode key={passages[index].id} passage={passages[index]} />}
            <ExerciseNav index={index} total={total} onPrevious={previous} onNext={next} />
          </>
        )}
      </section>
      <p className="practiceTip">Mẹo: Đọc thành tiếng mỗi chunk trước khi kiểm tra đáp án.</p>
    </main>
  );
}

export function LearningApp() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [mode, setMode] = useState<ModeId | null>(null);

  const goHome = () => {
    setMode(null);
    setLesson(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="appShell">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <AppHeader onHome={goHome} />
      {!lesson && <Dashboard onSelect={(selected) => { setLesson(selected); window.scrollTo(0, 0); }} />}
      {lesson && !mode && (
        <LessonMenu
          lesson={lesson}
          onBack={goHome}
          onMode={(selected) => { setMode(selected); window.scrollTo(0, 0); }}
        />
      )}
      {lesson && mode && (
        <PracticeScreen lesson={lesson} modeId={mode} onBack={() => setMode(null)} />
      )}
      <footer>
        <Brand />
        <p>Học ít hơn từng lần. Nhớ lâu hơn từng cụm.</p>
        <span>© 2026 MANABU</span>
      </footer>
    </div>
  );
}
