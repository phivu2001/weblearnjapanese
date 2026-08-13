"use client";

/* eslint-disable react/prop-types */

import {
  Fragment,
  type ChangeEvent as ReactChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HanziWriter from "hanzi-writer";
import { grammarPoints16to25, kanjiVocabulary16to25 } from "./lessonContent16to25";
import {
  KANJI_STUDY_GUIDES,
  type KanjiStudyGuide,
  type KanjiWordExample,
} from "./kanjiStudyData";
import {
  jlptPracticeGroups,
  jlptPracticeStats,
  type JlptPracticeGroup,
  type JlptPracticeQuestion,
  type JlptPracticeSection,
  type JlptPracticeTest,
} from "./jlptPracticeData";
import { updateSRSItem, isDueForReview } from "./srs";

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
  kanji_variants: string | null;
};

type Sentence = {
  id: number;
  lesson_id: number | null;
  passage_id: number | null;
  full_japanese: string;
  full_romaji: string;
  full_vietnamese: string;
  audio_url: string | null;
  kanji_variants: string | null;
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

type ModeId =
  | "cloze"
  | "scramble"
  | "dictation"
  | "audio-match"
  | "reading"
  | "kanji"
  | "kanji-words"
  | "kanji-writing"
  | "vocabulary"
  | "grammar"
  | "review";
type Feedback = { kind: "success" | "error"; message: string } | null;

type KanjiVocabularyItem = {
  kanji: string;
  reading: string;
  vietnamese: string;
};

type QuestionWordItem = {
  answer: string;
  meaning: string;
  sentence: string;
  vietnamese: string;
  note: string;
};

type VocabularyQuizItem = {
  id: number;
  japanese: string;
  vietnamese: string;
};

type GrammarPoint = {
  title: string;
  pattern: string;
  explanation: string;
  example: string;
  translation: string;
  question: string;
  answer: string;
  choices: string[];
};

type N5ConjugationItem = {
  verb: string;
  meaning: string;
  group: string;
  targetForm: string;
  instruction: string;
  answer: string;
  choices: string[];
  note: string;
};

type N5VerbGroup = "Nhóm 1" | "Nhóm 2" | "Nhóm 3";

type N5VerbEntry = {
  dictionary: string;
  masu: string;
  meaning: string;
  group: N5VerbGroup;
  note?: string;
};

type N5VerbFormKey =
  | "て形"
  | "た形"
  | "ない形"
  | "辞書形"
  | "ます形"
  | "ません形"
  | "ました形"
  | "ませんでした形"
  | "てください"
  | "てもいいです"
  | "てはいけません"
  | "ています"
  | "ないでください";

type N5VerbForms = Record<N5VerbFormKey, string>;

type N5AdjectiveEntry = {
  word: string;
  meaning: string;
  kind: "Tính từ い" | "Tính từ な";
  note?: string;
};

type N5AdjectiveFormKey =
  | "丁寧形"
  | "否定形"
  | "過去形"
  | "て形"
  | "名詞修飾";

type N5AdjectiveForms = Partial<Record<N5AdjectiveFormKey, string>>;

type AiChatRole = "user" | "assistant";

type AiChatMessage = {
  id: string;
  role: AiChatRole;
  content: string;
  source?: string;
};

type AiChatResponse = {
  reply: string;
  source: string;
};

type ThemeMode = "light" | "dark";

const AUTO_ADVANCE_DELAY_MS = 800;
const MANABU_STORAGE_PREFIX = "manabu";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exportUserData() {
  if (typeof window === "undefined") return;

  const backup: Record<string, string> = {};

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith(MANABU_STORAGE_PREFIX)) continue;

    const value = window.localStorage.getItem(key);
    if (value !== null) backup[key] = value;
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = "manabu_backup.json";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}

function importUserData(event: ReactChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const content = typeof reader.result === "string" ? reader.result : "";
      const parsed: unknown = JSON.parse(content);

      if (!isRecord(parsed)) {
        throw new Error("Backup payload must be an object.");
      }

      const manabuEntries = Object.entries(parsed).filter(([key]) =>
        key.startsWith(MANABU_STORAGE_PREFIX),
      );

      if (manabuEntries.length === 0) {
        throw new Error("No Manabu keys found in backup.");
      }

      for (const [key, value] of manabuEntries) {
        if (typeof value !== "string") {
          throw new Error(`Invalid value for key: ${key}`);
        }
        window.localStorage.setItem(key, value);
      }

      window.alert("Khôi phục dữ liệu thành công!");
      window.location.reload();
    } catch {
      window.alert("File sao lưu không hợp lệ. Vui lòng chọn đúng file manabu_backup.json.");
    }
  };

  reader.onerror = () => {
    window.alert("Không đọc được file sao lưu. Vui lòng thử lại.");
  };

  reader.readAsText(file);
}

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: {
      [index: number]: SpeechRecognitionAlternativeLike;
    };
  };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const API_BASE =
  typeof process !== "undefined" && process.env.VITE_API_URL
    ? process.env.VITE_API_URL
    : typeof window !== "undefined" && (window as any).__VITE_API_URL__
      ? (window as any).__VITE_API_URL__
      : typeof window !== "undefined" &&
        ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
        window.location.port !== "8000"
        ? "http://127.0.0.1:8000/api"
        : "/api";

const lessonFallback: Lesson[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Bài ${index + 1}`,
  description: [
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
    "Thể て và lời yêu cầu",
    "Xin phép, cấm đoán và trạng thái",
    "Nối câu và trình tự hành động",
    "Thể ない và nghĩa vụ",
    "Khả năng, sở thích và trước khi",
    "Trải nghiệm và sự thay đổi",
    "Thể thông thường và hội thoại thân mật",
    "Ý kiến, suy nghĩ và lời nói",
    "Mệnh đề bổ nghĩa danh từ",
    "Khi, lúc và kết quả tự nhiên",
    "Cho và nhận sự giúp đỡ",
    "Điều kiện và nhượng bộ",
  ][index] ?? "Nội dung Minna no Nihongo",
}));

const authoredSentenceCounts: Record<number, number> = {
  1: 25,
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
};

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
    id: "vocabulary",
    number: "A",
    glyph: "単",
    title: "Học từ vựng",
    japanese: "単語",
    description: "Nhìn từ hoặc cụm tiếng Nhật và chọn đúng nghĩa tiếng Việt.",
    accent: "mint",
  },
  {
    id: "grammar",
    number: "B",
    glyph: "法",
    title: "Học ngữ pháp",
    japanese: "文法",
    description: "Học công thức, đọc ví dụ và chọn thành phần đúng cho câu.",
    accent: "coral",
  },
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
    id: "audio-match",
    number: "04",
    glyph: "👂",
    title: "Nghe chọn mảnh",
    japanese: "聴解チャンク",
    description: "Nghe âm thanh và chọn đúng chữ Nhật trong từng mảnh câu.",
    accent: "sky",
  },
  {
    id: "reading",
    number: "05",
    glyph: "読",
    title: "Đọc tương tác",
    japanese: "読解",
    description: "Đọc đoạn ngắn và chạm vào từng cụm để hiểu sâu.",
    accent: "lavender",
  },
  {
    id: "kanji",
    number: "06",
    glyph: "漢",
    title: "Chọn Kanji",
    japanese: "漢字クイズ",
    description: "Đọc câu bằng Hiragana/Katakana và chọn đúng cách viết có Kanji.",
    accent: "sky",
  },
  {
    id: "kanji-words",
    number: "07",
    glyph: "語",
    title: "Kanji từng từ",
    japanese: "漢字の言葉",
    description: "Nhìn từng từ Kanji, chọn cách đọc Hiragana và ghi nhớ nghĩa.",
    accent: "plum",
  },
  {
    id: "kanji-writing",
    number: "08",
    glyph: "筆",
    title: "Luyện viết Kanji",
    japanese: "書き取り",
    description: "Tập viết Kanji theo nét hoặc tự viết mù rồi xem đáp án đúng.",
    accent: "mint",
  },
];

const kanjiVocabulary: Record<number, KanjiVocabularyItem[]> = {
  1: [
    { kanji: "私", reading: "わたし", vietnamese: "tôi" },
    { kanji: "学生", reading: "がくせい", vietnamese: "học sinh, sinh viên" },
    { kanji: "先生", reading: "せんせい", vietnamese: "thầy/cô giáo" },
    { kanji: "教師", reading: "きょうし", vietnamese: "giáo viên" },
    { kanji: "会社員", reading: "かいしゃいん", vietnamese: "nhân viên công ty" },
    { kanji: "銀行員", reading: "ぎんこういん", vietnamese: "nhân viên ngân hàng" },
    { kanji: "医者", reading: "いしゃ", vietnamese: "bác sĩ" },
    { kanji: "研究者", reading: "けんきゅうしゃ", vietnamese: "nhà nghiên cứu" },
    { kanji: "大学", reading: "だいがく", vietnamese: "đại học" },
    { kanji: "病院", reading: "びょういん", vietnamese: "bệnh viện" },
  ],
  2: [
    { kanji: "日本語", reading: "にほんご", vietnamese: "tiếng Nhật" },
    { kanji: "英語", reading: "えいご", vietnamese: "tiếng Anh" },
    { kanji: "辞書", reading: "じしょ", vietnamese: "từ điển" },
    { kanji: "本", reading: "ほん", vietnamese: "sách" },
    { kanji: "雑誌", reading: "ざっし", vietnamese: "tạp chí" },
    { kanji: "新聞", reading: "しんぶん", vietnamese: "báo" },
    { kanji: "手帳", reading: "てちょう", vietnamese: "sổ tay" },
    { kanji: "名刺", reading: "めいし", vietnamese: "danh thiếp" },
    { kanji: "鉛筆", reading: "えんぴつ", vietnamese: "bút chì" },
    { kanji: "鍵", reading: "かぎ", vietnamese: "chìa khóa" },
    { kanji: "時計", reading: "とけい", vietnamese: "đồng hồ" },
    { kanji: "傘", reading: "かさ", vietnamese: "ô, dù" },
    { kanji: "自動車", reading: "じどうしゃ", vietnamese: "ô tô" },
    { kanji: "机", reading: "つくえ", vietnamese: "bàn" },
    { kanji: "椅子", reading: "いす", vietnamese: "ghế" },
    { kanji: "お土産", reading: "おみやげ", vietnamese: "quà lưu niệm" },
    { kanji: "気持ち", reading: "きもち", vietnamese: "tấm lòng, cảm xúc" },
    { kanji: "お世話", reading: "おせわ", vietnamese: "sự giúp đỡ, chăm sóc" },
  ],
  3: [
    { kanji: "教室", reading: "きょうしつ", vietnamese: "phòng học" },
    { kanji: "会社", reading: "かいしゃ", vietnamese: "công ty" },
    { kanji: "食堂", reading: "しょくどう", vietnamese: "nhà ăn" },
    { kanji: "事務所", reading: "じむしょ", vietnamese: "văn phòng" },
    { kanji: "会議室", reading: "かいぎしつ", vietnamese: "phòng họp" },
    { kanji: "受付", reading: "うけつけ", vietnamese: "quầy lễ tân" },
    { kanji: "お手洗い", reading: "おてあらい", vietnamese: "nhà vệ sinh" },
    { kanji: "部屋", reading: "へや", vietnamese: "căn phòng" },
    { kanji: "階段", reading: "かいだん", vietnamese: "cầu thang" },
    { kanji: "電話", reading: "でんわ", vietnamese: "điện thoại" },
    { kanji: "国", reading: "くに", vietnamese: "đất nước" },
    { kanji: "靴", reading: "くつ", vietnamese: "giày" },
    { kanji: "売り場", reading: "うりば", vietnamese: "quầy bán hàng" },
    { kanji: "地下", reading: "ちか", vietnamese: "tầng hầm" },
    { kanji: "何階", reading: "なんがい", vietnamese: "tầng mấy" },
    { kanji: "円", reading: "えん", vietnamese: "yên Nhật" },
  ],
  4: [
    { kanji: "毎朝", reading: "まいあさ", vietnamese: "mỗi sáng" },
    { kanji: "起きます", reading: "おきます", vietnamese: "thức dậy" },
    { kanji: "毎晩", reading: "まいばん", vietnamese: "mỗi tối" },
    { kanji: "寝ます", reading: "ねます", vietnamese: "đi ngủ" },
    { kanji: "月曜日", reading: "げつようび", vietnamese: "thứ Hai" },
    { kanji: "火曜日", reading: "かようび", vietnamese: "thứ Ba" },
    { kanji: "水曜日", reading: "すいようび", vietnamese: "thứ Tư" },
    { kanji: "木曜日", reading: "もくようび", vietnamese: "thứ Năm" },
    { kanji: "金曜日", reading: "きんようび", vietnamese: "thứ Sáu" },
    { kanji: "土曜日", reading: "どようび", vietnamese: "thứ Bảy" },
    { kanji: "日曜日", reading: "にちようび", vietnamese: "Chủ nhật" },
    { kanji: "働きます", reading: "はたらきます", vietnamese: "làm việc" },
    { kanji: "休みます", reading: "やすみます", vietnamese: "nghỉ" },
    { kanji: "勉強します", reading: "べんきょうします", vietnamese: "học" },
    { kanji: "午前", reading: "ごぜん", vietnamese: "buổi sáng, AM" },
    { kanji: "午後", reading: "ごご", vietnamese: "buổi chiều, PM" },
    { kanji: "銀行", reading: "ぎんこう", vietnamese: "ngân hàng" },
    { kanji: "郵便局", reading: "ゆうびんきょく", vietnamese: "bưu điện" },
    { kanji: "図書館", reading: "としょかん", vietnamese: "thư viện" },
    { kanji: "美術館", reading: "びじゅつかん", vietnamese: "bảo tàng mỹ thuật" },
  ],
  5: [
    { kanji: "学校", reading: "がっこう", vietnamese: "trường học" },
    { kanji: "来週", reading: "らいしゅう", vietnamese: "tuần sau" },
    { kanji: "先週", reading: "せんしゅう", vietnamese: "tuần trước" },
    { kanji: "今週", reading: "こんしゅう", vietnamese: "tuần này" },
    { kanji: "友達", reading: "ともだち", vietnamese: "bạn bè" },
    { kanji: "家族", reading: "かぞく", vietnamese: "gia đình" },
    { kanji: "行きます", reading: "いきます", vietnamese: "đi" },
    { kanji: "来ます", reading: "きます", vietnamese: "đến" },
    { kanji: "帰ります", reading: "かえります", vietnamese: "về" },
    { kanji: "自転車", reading: "じてんしゃ", vietnamese: "xe đạp" },
    { kanji: "歩いて", reading: "あるいて", vietnamese: "đi bộ" },
    { kanji: "駅", reading: "えき", vietnamese: "nhà ga" },
    { kanji: "普通電車", reading: "ふつうでんしゃ", vietnamese: "tàu thường" },
    { kanji: "急行", reading: "きゅうこう", vietnamese: "tàu nhanh" },
    { kanji: "特急", reading: "とっきゅう", vietnamese: "tàu tốc hành đặc biệt" },
    { kanji: "新幹線", reading: "しんかんせん", vietnamese: "tàu Shinkansen" },
    { kanji: "飛行機", reading: "ひこうき", vietnamese: "máy bay" },
    { kanji: "船", reading: "ふね", vietnamese: "tàu thủy" },
    { kanji: "地下鉄", reading: "ちかてつ", vietnamese: "tàu điện ngầm" },
    { kanji: "一人", reading: "ひとり", vietnamese: "một người, một mình" },
    { kanji: "先月", reading: "せんげつ", vietnamese: "tháng trước" },
    { kanji: "今月", reading: "こんげつ", vietnamese: "tháng này" },
    { kanji: "来月", reading: "らいげつ", vietnamese: "tháng sau" },
    { kanji: "去年", reading: "きょねん", vietnamese: "năm ngoái" },
    { kanji: "今年", reading: "ことし", vietnamese: "năm nay" },
    { kanji: "来年", reading: "らいねん", vietnamese: "năm sau" },
    { kanji: "誕生日", reading: "たんじょうび", vietnamese: "sinh nhật" },
  ],
  6: [
    { kanji: "毎朝", reading: "まいあさ", vietnamese: "mỗi sáng" },
    { kanji: "朝御飯", reading: "あさごはん", vietnamese: "bữa sáng" },
    { kanji: "昼御飯", reading: "ひるごはん", vietnamese: "bữa trưa" },
    { kanji: "晩御飯", reading: "ばんごはん", vietnamese: "bữa tối" },
    { kanji: "食べます", reading: "たべます", vietnamese: "ăn" },
    { kanji: "飲みます", reading: "のみます", vietnamese: "uống" },
    { kanji: "吸います", reading: "すいます", vietnamese: "hút" },
    { kanji: "見ます", reading: "みます", vietnamese: "xem, nhìn" },
    { kanji: "聞きます", reading: "ききます", vietnamese: "nghe" },
    { kanji: "読みます", reading: "よみます", vietnamese: "đọc" },
    { kanji: "書きます", reading: "かきます", vietnamese: "viết" },
    { kanji: "買います", reading: "かいます", vietnamese: "mua" },
    { kanji: "撮ります", reading: "とります", vietnamese: "chụp ảnh" },
    { kanji: "会います", reading: "あいます", vietnamese: "gặp" },
    { kanji: "宿題", reading: "しゅくだい", vietnamese: "bài tập về nhà" },
  ],
  7: [
    { kanji: "切ります", reading: "きります", vietnamese: "cắt" },
    { kanji: "送ります", reading: "おくります", vietnamese: "gửi" },
    { kanji: "貸します", reading: "かします", vietnamese: "cho mượn" },
    { kanji: "借ります", reading: "かります", vietnamese: "mượn" },
    { kanji: "教えます", reading: "おしえます", vietnamese: "dạy, chỉ" },
    { kanji: "習います", reading: "ならいます", vietnamese: "học từ ai" },
    { kanji: "電話", reading: "でんわ", vietnamese: "điện thoại" },
    { kanji: "紙", reading: "かみ", vietnamese: "giấy" },
    { kanji: "花", reading: "はな", vietnamese: "hoa" },
    { kanji: "荷物", reading: "にもつ", vietnamese: "hành lý, bưu kiện" },
    { kanji: "お金", reading: "おかね", vietnamese: "tiền" },
    { kanji: "切符", reading: "きっぷ", vietnamese: "vé" },
    { kanji: "年賀状", reading: "ねんがじょう", vietnamese: "thiệp chúc Tết" },
    { kanji: "誕生日", reading: "たんじょうび", vietnamese: "sinh nhật" },
  ],
  8: [
    { kanji: "親切", reading: "しんせつ", vietnamese: "tốt bụng" },
    { kanji: "元気", reading: "げんき", vietnamese: "khỏe mạnh" },
    { kanji: "静か", reading: "しずか", vietnamese: "yên tĩnh" },
    { kanji: "有名", reading: "ゆうめい", vietnamese: "nổi tiếng" },
    { kanji: "大きい", reading: "おおきい", vietnamese: "to, lớn" },
    { kanji: "小さい", reading: "ちいさい", vietnamese: "nhỏ" },
    { kanji: "新しい", reading: "あたらしい", vietnamese: "mới" },
    { kanji: "古い", reading: "ふるい", vietnamese: "cũ" },
    { kanji: "暑い", reading: "あつい", vietnamese: "nóng (thời tiết)" },
    { kanji: "寒い", reading: "さむい", vietnamese: "lạnh (thời tiết)" },
    { kanji: "難しい", reading: "むずかしい", vietnamese: "khó" },
    { kanji: "易しい", reading: "やさしい", vietnamese: "dễ" },
    { kanji: "高い", reading: "たかい", vietnamese: "cao, đắt" },
    { kanji: "安い", reading: "やすい", vietnamese: "rẻ" },
    { kanji: "楽しい", reading: "たのしい", vietnamese: "vui" },
  ],
  9: [
    { kanji: "分かります", reading: "わかります", vietnamese: "hiểu" },
    { kanji: "好き", reading: "すき", vietnamese: "thích" },
    { kanji: "嫌い", reading: "きらい", vietnamese: "ghét, không thích" },
    { kanji: "上手", reading: "じょうず", vietnamese: "giỏi" },
    { kanji: "下手", reading: "へた", vietnamese: "không giỏi" },
    { kanji: "料理", reading: "りょうり", vietnamese: "nấu ăn, món ăn" },
    { kanji: "飲み物", reading: "のみもの", vietnamese: "đồ uống" },
    { kanji: "音楽", reading: "おんがく", vietnamese: "âm nhạc" },
    { kanji: "歌", reading: "うた", vietnamese: "bài hát" },
    { kanji: "野球", reading: "やきゅう", vietnamese: "bóng chày" },
    { kanji: "時間", reading: "じかん", vietnamese: "thời gian" },
    { kanji: "用事", reading: "ようじ", vietnamese: "việc bận" },
    { kanji: "約束", reading: "やくそく", vietnamese: "cuộc hẹn, lời hứa" },
    { kanji: "細かいお金", reading: "こまかいおかね", vietnamese: "tiền lẻ" },
  ],
  10: [
    { kanji: "男の人", reading: "おとこのひと", vietnamese: "người đàn ông" },
    { kanji: "女の人", reading: "おんなのひと", vietnamese: "người phụ nữ" },
    { kanji: "男の子", reading: "おとこのこ", vietnamese: "bé trai" },
    { kanji: "女の子", reading: "おんなのこ", vietnamese: "bé gái" },
    { kanji: "犬", reading: "いぬ", vietnamese: "chó" },
    { kanji: "猫", reading: "ねこ", vietnamese: "mèo" },
    { kanji: "木", reading: "き", vietnamese: "cây" },
    { kanji: "物", reading: "もの", vietnamese: "đồ vật" },
    { kanji: "箱", reading: "はこ", vietnamese: "cái hộp" },
    { kanji: "冷蔵庫", reading: "れいぞうこ", vietnamese: "tủ lạnh" },
    { kanji: "棚", reading: "たな", vietnamese: "cái kệ" },
    { kanji: "窓", reading: "まど", vietnamese: "cửa sổ" },
    { kanji: "公園", reading: "こうえん", vietnamese: "công viên" },
    { kanji: "喫茶店", reading: "きっさてん", vietnamese: "quán cà phê" },
    { kanji: "本屋", reading: "ほんや", vietnamese: "hiệu sách" },
    { kanji: "乗り場", reading: "のりば", vietnamese: "bến, điểm lên xe" },
  ],
  11: [
    { kanji: "子ども", reading: "こども", vietnamese: "trẻ em, con" },
    { kanji: "兄弟", reading: "きょうだい", vietnamese: "anh chị em" },
    { kanji: "一人", reading: "ひとり", vietnamese: "một người" },
    { kanji: "二人", reading: "ふたり", vietnamese: "hai người" },
    { kanji: "切手", reading: "きって", vietnamese: "tem" },
    { kanji: "葉書", reading: "はがき", vietnamese: "bưu thiếp" },
    { kanji: "封筒", reading: "ふうとう", vietnamese: "phong bì" },
    { kanji: "速達", reading: "そくたつ", vietnamese: "chuyển phát nhanh" },
    { kanji: "書留", reading: "かきとめ", vietnamese: "thư bảo đảm" },
    { kanji: "航空便", reading: "こうくうびん", vietnamese: "đường hàng không" },
    { kanji: "船便", reading: "ふなびん", vietnamese: "đường biển" },
    { kanji: "両親", reading: "りょうしん", vietnamese: "bố mẹ" },
    { kanji: "外国", reading: "がいこく", vietnamese: "nước ngoài" },
    { kanji: "全部", reading: "ぜんぶ", vietnamese: "toàn bộ" },
  ],
  12: [
    { kanji: "簡単", reading: "かんたん", vietnamese: "đơn giản" },
    { kanji: "近い", reading: "ちかい", vietnamese: "gần" },
    { kanji: "遠い", reading: "とおい", vietnamese: "xa" },
    { kanji: "速い", reading: "はやい", vietnamese: "nhanh" },
    { kanji: "遅い", reading: "おそい", vietnamese: "chậm, muộn" },
    { kanji: "多い", reading: "おおい", vietnamese: "nhiều" },
    { kanji: "少ない", reading: "すくない", vietnamese: "ít" },
    { kanji: "暖かい", reading: "あたたかい", vietnamese: "ấm" },
    { kanji: "涼しい", reading: "すずしい", vietnamese: "mát mẻ" },
    { kanji: "甘い", reading: "あまい", vietnamese: "ngọt" },
    { kanji: "辛い", reading: "からい", vietnamese: "cay" },
    { kanji: "重い", reading: "おもい", vietnamese: "nặng" },
    { kanji: "軽い", reading: "かるい", vietnamese: "nhẹ" },
    { kanji: "季節", reading: "きせつ", vietnamese: "mùa" },
  ],
  13: [
    { kanji: "欲しい", reading: "ほしい", vietnamese: "muốn có" },
    { kanji: "遊びます", reading: "あそびます", vietnamese: "chơi" },
    { kanji: "泳ぎます", reading: "およぎます", vietnamese: "bơi" },
    { kanji: "迎えます", reading: "むかえます", vietnamese: "đón" },
    { kanji: "疲れます", reading: "つかれます", vietnamese: "mệt" },
    { kanji: "出します", reading: "だします", vietnamese: "gửi, lấy ra" },
    { kanji: "結婚します", reading: "けっこんします", vietnamese: "kết hôn" },
    { kanji: "買い物", reading: "かいもの", vietnamese: "mua sắm" },
    { kanji: "食事", reading: "しょくじ", vietnamese: "bữa ăn" },
    { kanji: "散歩", reading: "さんぽ", vietnamese: "đi dạo" },
    { kanji: "大変", reading: "たいへん", vietnamese: "vất vả" },
    { kanji: "注文", reading: "ちゅうもん", vietnamese: "gọi món, đặt hàng" },
  ],
  14: [
    { kanji: "付けます", reading: "つけます", vietnamese: "bật, gắn" },
    { kanji: "消します", reading: "けします", vietnamese: "tắt, xóa" },
    { kanji: "開けます", reading: "あけます", vietnamese: "mở" },
    { kanji: "閉めます", reading: "しめます", vietnamese: "đóng" },
    { kanji: "急ぎます", reading: "いそぎます", vietnamese: "vội, nhanh lên" },
    { kanji: "待ちます", reading: "まちます", vietnamese: "đợi" },
    { kanji: "止めます", reading: "とめます", vietnamese: "dừng, đỗ" },
    { kanji: "曲がります", reading: "まがります", vietnamese: "rẽ" },
    { kanji: "持ちます", reading: "もちます", vietnamese: "cầm, mang" },
    { kanji: "手伝います", reading: "てつだいます", vietnamese: "giúp đỡ" },
    { kanji: "呼びます", reading: "よびます", vietnamese: "gọi" },
    { kanji: "話します", reading: "はなします", vietnamese: "nói chuyện" },
    { kanji: "住所", reading: "じゅうしょ", vietnamese: "địa chỉ" },
    { kanji: "交差点", reading: "こうさてん", vietnamese: "ngã tư" },
  ],
  15: [
    { kanji: "置きます", reading: "おきます", vietnamese: "đặt, để" },
    { kanji: "作ります", reading: "つくります", vietnamese: "làm, chế tạo" },
    { kanji: "売ります", reading: "うります", vietnamese: "bán" },
    { kanji: "知ります", reading: "しります", vietnamese: "biết" },
    { kanji: "住みます", reading: "すみます", vietnamese: "sống, cư trú" },
    { kanji: "研究します", reading: "けんきゅうします", vietnamese: "nghiên cứu" },
    { kanji: "資料", reading: "しりょう", vietnamese: "tài liệu" },
    { kanji: "時刻表", reading: "じこくひょう", vietnamese: "bảng giờ tàu xe" },
    { kanji: "服", reading: "ふく", vietnamese: "quần áo" },
    { kanji: "製品", reading: "せいひん", vietnamese: "sản phẩm" },
    { kanji: "歯医者", reading: "はいしゃ", vietnamese: "nha sĩ" },
    { kanji: "独身", reading: "どくしん", vietnamese: "độc thân" },
    { kanji: "市役所", reading: "しやくしょ", vietnamese: "tòa thị chính" },
    { kanji: "電話番号", reading: "でんわばんごう", vietnamese: "số điện thoại" },
  ],
  ...kanjiVocabulary16to25,
};

const questionWordItems: QuestionWordItem[] = [
  { answer: "だれ", meaning: "ai", sentence: "＿＿＿は せんせいですか。", vietnamese: "Ai là giáo viên?", note: "だれ dùng để hỏi người." },
  { answer: "どなた", meaning: "vị nào, ai (lịch sự)", sentence: "あのかたは ＿＿＿ですか。", vietnamese: "Vị kia là ai?", note: "どなた là cách nói lịch sự hơn của だれ." },
  { answer: "なに", meaning: "cái gì", sentence: "これは ＿＿＿ですか。", vietnamese: "Đây là cái gì?", note: "なに thường đứng trước trợ từ hoặc đứng độc lập." },
  { answer: "なん", meaning: "cái gì", sentence: "おしごとは ＿＿＿ですか。", vietnamese: "Công việc của bạn là gì?", note: "なん thường dùng trước です và các từ đếm." },
  { answer: "どこ", meaning: "ở đâu", sentence: "おてあらいは ＿＿＿ですか。", vietnamese: "Nhà vệ sinh ở đâu?", note: "どこ hỏi địa điểm." },
  { answer: "どちら", meaning: "phía nào, đâu (lịch sự)", sentence: "おくには ＿＿＿ですか。", vietnamese: "Bạn đến từ nước nào?", note: "どちら là cách lịch sự của どこ và cũng dùng hỏi phương hướng." },
  { answer: "いつ", meaning: "khi nào", sentence: "たんじょうびは ＿＿＿ですか。", vietnamese: "Sinh nhật của bạn khi nào?", note: "いつ hỏi thời điểm nói chung." },
  { answer: "なんじ", meaning: "mấy giờ", sentence: "いま ＿＿＿ですか。", vietnamese: "Bây giờ là mấy giờ?", note: "なんじ（何時）hỏi giờ cụ thể." },
  { answer: "なんようび", meaning: "thứ mấy", sentence: "きょうは ＿＿＿ですか。", vietnamese: "Hôm nay là thứ mấy?", note: "なんようび（何曜日）hỏi thứ trong tuần." },
  { answer: "なんがつ", meaning: "tháng mấy", sentence: "＿＿＿に にほんへ いきますか。", vietnamese: "Bạn đi Nhật vào tháng mấy?", note: "なんがつ（何月）hỏi tháng." },
  { answer: "なんにち", meaning: "ngày mấy", sentence: "かいぎは ＿＿＿ですか。", vietnamese: "Cuộc họp vào ngày mấy?", note: "なんにち（何日）hỏi ngày trong tháng." },
  { answer: "いくら", meaning: "bao nhiêu tiền", sentence: "このかばんは ＿＿＿ですか。", vietnamese: "Cái cặp này giá bao nhiêu?", note: "いくら dùng để hỏi giá tiền." },
  { answer: "いくつ", meaning: "bao nhiêu cái, mấy tuổi", sentence: "りんごは ＿＿＿ありますか。", vietnamese: "Có bao nhiêu quả táo?", note: "いくつ hỏi số lượng đồ vật theo cách đếm chung." },
  { answer: "なんさい", meaning: "bao nhiêu tuổi", sentence: "ミラーさんは ＿＿＿ですか。", vietnamese: "Anh Miller bao nhiêu tuổi?", note: "なんさい（何歳）hỏi tuổi; おいくつ lịch sự hơn." },
  { answer: "どう", meaning: "thế nào", sentence: "にほんごの べんきょうは ＿＿＿ですか。", vietnamese: "Việc học tiếng Nhật thế nào?", note: "どう hỏi trạng thái, cảm nhận hoặc phương pháp." },
  { answer: "どんな", meaning: "như thế nào, loại nào", sentence: "ならは ＿＿＿まちですか。", vietnamese: "Nara là thành phố như thế nào?", note: "どんな luôn đứng trước danh từ." },
  { answer: "どれ", meaning: "cái nào", sentence: "ミラーさんの かさは ＿＿＿ですか。", vietnamese: "Ô của anh Miller là cái nào?", note: "どれ đứng độc lập, không đi trực tiếp trước danh từ." },
  { answer: "どの", meaning: "cái… nào", sentence: "＿＿＿かさが ミラーさんのですか。", vietnamese: "Cái ô nào là của anh Miller?", note: "どの luôn đứng ngay trước danh từ." },
  { answer: "だれの", meaning: "của ai", sentence: "これは ＿＿＿ほんですか。", vietnamese: "Đây là sách của ai?", note: "だれの hỏi người sở hữu." },
  { answer: "どうして", meaning: "tại sao", sentence: "＿＿＿にほんごを べんきょうしますか。", vietnamese: "Tại sao bạn học tiếng Nhật?", note: "どうして hỏi lý do; câu trả lời thường dùng から." },
  { answer: "どうやって", meaning: "bằng cách nào", sentence: "＿＿＿がっこうへ いきますか。", vietnamese: "Bạn đến trường bằng cách nào?", note: "どうやって hỏi phương pháp hoặc phương tiện." },
  { answer: "どのくらい", meaning: "bao lâu, bao nhiêu", sentence: "にほんごを ＿＿＿べんきょうしましたか。", vietnamese: "Bạn đã học tiếng Nhật bao lâu?", note: "どのくらい hỏi mức độ, số lượng hoặc khoảng thời gian." },
  { answer: "だれ", meaning: "ai", sentence: "きのう ＿＿＿と とうきょうへ いきましたか。", vietnamese: "Hôm qua bạn đã đi Tokyo với ai?", note: "だれ + と dùng để hỏi người cùng thực hiện hành động." },
  { answer: "だれ", meaning: "ai", sentence: "＿＿＿が このケーキを つくりましたか。", vietnamese: "Ai đã làm chiếc bánh này?", note: "だれ + が hỏi người thực hiện hành động." },
  { answer: "どなた", meaning: "vị nào, ai (lịch sự)", sentence: "＿＿＿が やまだせんせいですか。", vietnamese: "Vị nào là thầy Yamada?", note: "どなた dùng lịch sự khi hỏi về một người." },
  { answer: "どなた", meaning: "vị nào, ai (lịch sự)", sentence: "こちらは ＿＿＿ですか。", vietnamese: "Vị này là ai?", note: "こちら và どなた tạo thành cách hỏi rất lịch sự." },
  { answer: "なに", meaning: "cái gì", sentence: "まいあさ ＿＿＿を たべますか。", vietnamese: "Mỗi sáng bạn ăn gì?", note: "なに + を hỏi đối tượng của hành động." },
  { answer: "なに", meaning: "cái gì", sentence: "スポーツは ＿＿＿が すきですか。", vietnamese: "Bạn thích môn thể thao nào?", note: "なに + が dùng khi từ hỏi là chủ thể của 好きです." },
  { answer: "なん", meaning: "cái gì", sentence: "これは ＿＿＿の ざっしですか。", vietnamese: "Đây là tạp chí về gì?", note: "なん + の hỏi loại hoặc nội dung của danh từ sau." },
  { answer: "なん", meaning: "số mấy", sentence: "でんわばんごうは ＿＿＿ばんですか。", vietnamese: "Số điện thoại là số mấy?", note: "なん đứng trước đơn vị đếm ばん（番）." },
  { answer: "どこ", meaning: "đâu", sentence: "らいしゅう ＿＿＿へ いきますか。", vietnamese: "Tuần sau bạn sẽ đi đâu?", note: "どこ + へ hỏi đích đến." },
  { answer: "どこ", meaning: "đâu", sentence: "ミラーさんは ＿＿＿から きましたか。", vietnamese: "Anh Miller đến từ đâu?", note: "どこ + から hỏi nơi xuất phát." },
  { answer: "どちら", meaning: "phía nào, đâu (lịch sự)", sentence: "エレベーターは ＿＿＿ですか。", vietnamese: "Thang máy ở phía nào?", note: "どちら hỏi phương hướng một cách lịch sự." },
  { answer: "どちら", meaning: "cái nào trong hai", sentence: "コーヒーと おちゃと ＿＿＿が すきですか。", vietnamese: "Bạn thích cà phê hay trà hơn?", note: "どちら dùng để chọn một trong hai." },
  { answer: "いつ", meaning: "khi nào", sentence: "＿＿＿にほんへ きましたか。", vietnamese: "Bạn đã đến Nhật khi nào?", note: "いつ không cần trợ từ に khi hỏi thời điểm." },
  { answer: "いつ", meaning: "khi nào", sentence: "しけんは ＿＿＿ありますか。", vietnamese: "Kỳ thi diễn ra khi nào?", note: "いつ hỏi ngày hoặc thời điểm chưa xác định." },
  { answer: "なんじ", meaning: "mấy giờ", sentence: "まいあさ ＿＿＿に おきますか。", vietnamese: "Mỗi sáng bạn thức dậy lúc mấy giờ?", note: "なんじ + に hỏi thời điểm thực hiện hành động." },
  { answer: "なんじ", meaning: "mấy giờ", sentence: "ぎんこうは ＿＿＿からですか。", vietnamese: "Ngân hàng mở cửa từ mấy giờ?", note: "なんじ + から hỏi giờ bắt đầu." },
  { answer: "なんようび", meaning: "thứ mấy", sentence: "としょかんは ＿＿＿が やすみですか。", vietnamese: "Thư viện nghỉ vào thứ mấy?", note: "なんようび hỏi thứ trong tuần." },
  { answer: "なんようび", meaning: "thứ mấy", sentence: "かいぎは ＿＿＿ですか。", vietnamese: "Cuộc họp vào thứ mấy?", note: "なんようび có thể đứng trước です để hỏi lịch." },
  { answer: "なんがつ", meaning: "tháng mấy", sentence: "たんじょうびは ＿＿＿ですか。", vietnamese: "Sinh nhật của bạn vào tháng mấy?", note: "なんがつ hỏi tháng trong năm." },
  { answer: "なんがつ", meaning: "tháng mấy", sentence: "がっこうは ＿＿＿から はじまりますか。", vietnamese: "Trường bắt đầu từ tháng mấy?", note: "なんがつ + から hỏi tháng bắt đầu." },
  { answer: "なんにち", meaning: "ngày mấy", sentence: "きょうは ＿＿＿ですか。", vietnamese: "Hôm nay là ngày mấy?", note: "なんにち hỏi ngày trong tháng." },
  { answer: "なんにち", meaning: "ngày mấy", sentence: "＿＿＿に おおさかへ いきますか。", vietnamese: "Bạn đi Osaka vào ngày mấy?", note: "なんにち + に hỏi ngày thực hiện hành động." },
  { answer: "いくら", meaning: "bao nhiêu tiền", sentence: "そのカメラは ＿＿＿ですか。", vietnamese: "Chiếc máy ảnh đó giá bao nhiêu?", note: "いくら dùng để hỏi giá sản phẩm." },
  { answer: "いくら", meaning: "bao nhiêu tiền", sentence: "コーヒーは ＿＿＿ですか。", vietnamese: "Cà phê giá bao nhiêu?", note: "いくら có thể đứng ngay trước です." },
  { answer: "いくつ", meaning: "bao nhiêu cái", sentence: "みかんを ＿＿＿かいましたか。", vietnamese: "Bạn đã mua bao nhiêu quả quýt?", note: "いくつ hỏi số lượng theo cách đếm chung." },
  { answer: "いくつ", meaning: "bao nhiêu cái", sentence: "きょうしつに いすが ＿＿＿ありますか。", vietnamese: "Trong lớp có bao nhiêu chiếc ghế?", note: "いくつ đi cùng あります để hỏi số lượng đồ vật." },
  { answer: "なんさい", meaning: "bao nhiêu tuổi", sentence: "あのこは ＿＿＿ですか。", vietnamese: "Đứa trẻ kia bao nhiêu tuổi?", note: "なんさい dùng để hỏi tuổi." },
  { answer: "なんさい", meaning: "bao nhiêu tuổi", sentence: "いもうとさんは ＿＿＿ですか。", vietnamese: "Em gái của bạn bao nhiêu tuổi?", note: "Với người lớn nên dùng おいくつ để lịch sự hơn." },
  { answer: "どう", meaning: "thế nào", sentence: "きょうの てんきは ＿＿＿ですか。", vietnamese: "Thời tiết hôm nay thế nào?", note: "どう hỏi trạng thái hoặc nhận xét." },
  { answer: "どう", meaning: "thế nào", sentence: "あたらしい しごとは ＿＿＿ですか。", vietnamese: "Công việc mới thế nào?", note: "どう dùng để hỏi cảm nhận." },
  { answer: "どんな", meaning: "loại nào, như thế nào", sentence: "やまだせんせいは ＿＿＿ひとですか。", vietnamese: "Thầy Yamada là người như thế nào?", note: "どんな đứng trước danh từ ひと." },
  { answer: "どんな", meaning: "loại nào, như thế nào", sentence: "＿＿＿ほんを よみますか。", vietnamese: "Bạn đọc loại sách nào?", note: "どんな đứng ngay trước danh từ cần mô tả." },
  { answer: "どれ", meaning: "cái nào", sentence: "あなたの じしょは ＿＿＿ですか。", vietnamese: "Từ điển của bạn là quyển nào?", note: "どれ đứng độc lập để chọn trong ba vật trở lên." },
  { answer: "どれ", meaning: "cái nào", sentence: "にほんの ワインは ＿＿＿ですか。", vietnamese: "Rượu vang Nhật là chai nào?", note: "どれ thay cho danh từ đã biết trong ngữ cảnh." },
  { answer: "どの", meaning: "cái… nào", sentence: "＿＿＿ひとが ミラーさんですか。", vietnamese: "Người nào là anh Miller?", note: "どの đứng trước danh từ ひと." },
  { answer: "どの", meaning: "quyển… nào", sentence: "＿＿＿ほんを かいましたか。", vietnamese: "Bạn đã mua quyển sách nào?", note: "どの phải đi kèm một danh từ phía sau." },
  { answer: "だれの", meaning: "của ai", sentence: "あのかさは ＿＿＿ですか。", vietnamese: "Chiếc ô kia là của ai?", note: "だれの có thể thay cho cụm danh từ sở hữu." },
  { answer: "だれの", meaning: "của ai", sentence: "これは ＿＿＿かばんですか。", vietnamese: "Đây là cặp của ai?", note: "だれの đứng trước danh từ để hỏi người sở hữu." },
  { answer: "どうして", meaning: "tại sao", sentence: "＿＿＿きょう がっこうを やすみましたか。", vietnamese: "Tại sao hôm nay bạn nghỉ học?", note: "どうして hỏi nguyên nhân của hành động." },
  { answer: "どうして", meaning: "tại sao", sentence: "＿＿＿にほんへ いきたいですか。", vietnamese: "Tại sao bạn muốn đi Nhật?", note: "Câu trả lời cho どうして thường kết thúc bằng からです." },
  { answer: "どうやって", meaning: "bằng cách nào", sentence: "＿＿＿きょうとへ いきますか。", vietnamese: "Bạn đi Kyoto bằng cách nào?", note: "どうやって hỏi phương tiện hoặc cách thức." },
  { answer: "どうやって", meaning: "đọc bằng cách nào", sentence: "このかんじは ＿＿＿よみますか。", vietnamese: "Chữ Kanji này đọc như thế nào?", note: "どうやって có thể hỏi cách thực hiện một việc." },
  { answer: "どのくらい", meaning: "bao lâu", sentence: "とうきょうから おおさかまで ＿＿＿かかりますか。", vietnamese: "Từ Tokyo đến Osaka mất bao lâu?", note: "どのくらい + かかりますか hỏi thời gian cần thiết." },
  { answer: "どのくらい", meaning: "bao lâu", sentence: "にほんに ＿＿＿いますか。", vietnamese: "Bạn sẽ ở Nhật bao lâu?", note: "どのくらい hỏi độ dài của khoảng thời gian." },
];

const n5VerbTargets: Array<{ key: N5VerbFormKey; instruction: string }> = [
  { key: "て形", instruction: "Chia sang thể て" },
  { key: "た形", instruction: "Chia sang thể た" },
  { key: "ない形", instruction: "Chia sang thể ない" },
  { key: "辞書形", instruction: "Chia sang thể từ điển" },
  { key: "ます形", instruction: "Chia sang thể ます" },
  { key: "ません形", instruction: "Chia sang thể phủ định lịch sự" },
  { key: "ました形", instruction: "Chia sang thể quá khứ lịch sự" },
  { key: "ませんでした形", instruction: "Chia sang thể phủ định quá khứ lịch sự" },
  { key: "てください", instruction: "Nói yêu cầu lịch sự ～てください" },
  { key: "てもいいです", instruction: "Nói xin phép/cho phép ～てもいいです" },
  { key: "てはいけません", instruction: "Nói cấm đoán ～てはいけません" },
  { key: "ています", instruction: "Nói hành động đang diễn ra ～ています" },
  { key: "ないでください", instruction: "Nói yêu cầu không làm ～ないでください" },
];

const n5AdjectiveTargets: Array<{ key: N5AdjectiveFormKey; instruction: string }> = [
  { key: "丁寧形", instruction: "Chia sang dạng lịch sự" },
  { key: "否定形", instruction: "Chia sang dạng phủ định" },
  { key: "過去形", instruction: "Chia sang dạng quá khứ" },
  { key: "て形", instruction: "Chia sang dạng nối て/で" },
  { key: "名詞修飾", instruction: "Chia sang dạng bổ nghĩa danh từ" },
];

const n5CoreVerbEntries: N5VerbEntry[] = [
  { dictionary: "あう", masu: "あいます", meaning: "gặp", group: "Nhóm 1" },
  { dictionary: "あく", masu: "あきます", meaning: "mở", group: "Nhóm 1" },
  { dictionary: "あける", masu: "あけます", meaning: "mở cái gì đó", group: "Nhóm 2" },
  { dictionary: "あそぶ", masu: "あそびます", meaning: "chơi", group: "Nhóm 1" },
  { dictionary: "あびる", masu: "あびます", meaning: "tắm", group: "Nhóm 2" },
  { dictionary: "ある", masu: "あります", meaning: "có, tồn tại", group: "Nhóm 1", note: "ある có phủ định đặc biệt: ない / ありません." },
  { dictionary: "あるく", masu: "あるきます", meaning: "đi bộ", group: "Nhóm 1" },
  { dictionary: "いう", masu: "いいます", meaning: "nói", group: "Nhóm 1" },
  { dictionary: "いく", masu: "いきます", meaning: "đi", group: "Nhóm 1", note: "行く là ngoại lệ ở て形/た形: いって / いった." },
  { dictionary: "いる", masu: "いります", meaning: "cần", group: "Nhóm 1" },
  { dictionary: "いる", masu: "います", meaning: "có, ở", group: "Nhóm 2" },
  { dictionary: "いれる", masu: "いれます", meaning: "cho vào", group: "Nhóm 2" },
  { dictionary: "うたう", masu: "うたいます", meaning: "hát", group: "Nhóm 1" },
  { dictionary: "うまれる", masu: "うまれます", meaning: "được sinh ra", group: "Nhóm 2" },
  { dictionary: "うる", masu: "うります", meaning: "bán", group: "Nhóm 1" },
  { dictionary: "おきる", masu: "おきます", meaning: "thức dậy", group: "Nhóm 2" },
  { dictionary: "おく", masu: "おきます", meaning: "đặt, để", group: "Nhóm 1" },
  { dictionary: "おくる", masu: "おくります", meaning: "gửi", group: "Nhóm 1" },
  { dictionary: "おす", masu: "おします", meaning: "ấn, đẩy", group: "Nhóm 1" },
  { dictionary: "おぼえる", masu: "おぼえます", meaning: "nhớ, học thuộc", group: "Nhóm 2" },
  { dictionary: "およぐ", masu: "およぎます", meaning: "bơi", group: "Nhóm 1" },
  { dictionary: "おりる", masu: "おります", meaning: "xuống xe", group: "Nhóm 2" },
  { dictionary: "おわる", masu: "おわります", meaning: "kết thúc", group: "Nhóm 1" },
  { dictionary: "かう", masu: "かいます", meaning: "mua", group: "Nhóm 1" },
  { dictionary: "かえす", masu: "かえします", meaning: "trả lại", group: "Nhóm 1" },
  { dictionary: "かえる", masu: "かえります", meaning: "về", group: "Nhóm 1" },
  { dictionary: "かかる", masu: "かかります", meaning: "mất, tốn", group: "Nhóm 1" },
  { dictionary: "かく", masu: "かきます", meaning: "viết", group: "Nhóm 1" },
  { dictionary: "かす", masu: "かします", meaning: "cho mượn", group: "Nhóm 1" },
  { dictionary: "かぶる", masu: "かぶります", meaning: "đội mũ", group: "Nhóm 1" },
  { dictionary: "かりる", masu: "かります", meaning: "mượn", group: "Nhóm 2" },
  { dictionary: "きえる", masu: "きえます", meaning: "tắt, biến mất", group: "Nhóm 2" },
  { dictionary: "きく", masu: "ききます", meaning: "nghe, hỏi", group: "Nhóm 1" },
  { dictionary: "きる", masu: "きります", meaning: "cắt", group: "Nhóm 1" },
  { dictionary: "きる", masu: "きます", meaning: "mặc", group: "Nhóm 2", note: "着ます đọc giống 来ます nhưng chia khác: きない, きて." },
  { dictionary: "くる", masu: "きます", meaning: "đến", group: "Nhóm 3", note: "来る là bất quy tắc: きます, きて, こない." },
  { dictionary: "けす", masu: "けします", meaning: "tắt, xóa", group: "Nhóm 1" },
  { dictionary: "こたえる", masu: "こたえます", meaning: "trả lời", group: "Nhóm 2" },
  { dictionary: "しぬ", masu: "しにます", meaning: "chết", group: "Nhóm 1" },
  { dictionary: "しめる", masu: "しめます", meaning: "đóng", group: "Nhóm 2" },
  { dictionary: "しる", masu: "しります", meaning: "biết", group: "Nhóm 1" },
  { dictionary: "する", masu: "します", meaning: "làm", group: "Nhóm 3", note: "する là bất quy tắc: します, して, しない." },
  { dictionary: "すう", masu: "すいます", meaning: "hút", group: "Nhóm 1" },
  { dictionary: "すむ", masu: "すみます", meaning: "sống, cư trú", group: "Nhóm 1" },
  { dictionary: "すわる", masu: "すわります", meaning: "ngồi", group: "Nhóm 1" },
  { dictionary: "だす", masu: "だします", meaning: "lấy ra, nộp", group: "Nhóm 1" },
  { dictionary: "たつ", masu: "たちます", meaning: "đứng", group: "Nhóm 1" },
  { dictionary: "たべる", masu: "たべます", meaning: "ăn", group: "Nhóm 2" },
  { dictionary: "ちがう", masu: "ちがいます", meaning: "khác, sai", group: "Nhóm 1" },
  { dictionary: "つかう", masu: "つかいます", meaning: "dùng", group: "Nhóm 1" },
  { dictionary: "つかれる", masu: "つかれます", meaning: "mệt", group: "Nhóm 2" },
  { dictionary: "つく", masu: "つきます", meaning: "đến nơi, bật sáng", group: "Nhóm 1" },
  { dictionary: "つくる", masu: "つくります", meaning: "làm, chế tạo", group: "Nhóm 1" },
  { dictionary: "つける", masu: "つけます", meaning: "bật, gắn", group: "Nhóm 2" },
  { dictionary: "つとめる", masu: "つとめます", meaning: "làm việc cho", group: "Nhóm 2" },
  { dictionary: "でかける", masu: "でかけます", meaning: "ra ngoài", group: "Nhóm 2" },
  { dictionary: "できる", masu: "できます", meaning: "có thể", group: "Nhóm 2" },
  { dictionary: "でる", masu: "でます", meaning: "ra, xuất hiện", group: "Nhóm 2" },
  { dictionary: "とる", masu: "とります", meaning: "chụp, lấy", group: "Nhóm 1" },
  { dictionary: "とまる", masu: "とまります", meaning: "dừng, ở trọ", group: "Nhóm 1" },
  { dictionary: "なく", masu: "なきます", meaning: "khóc", group: "Nhóm 1" },
  { dictionary: "なくす", masu: "なくします", meaning: "làm mất", group: "Nhóm 1" },
  { dictionary: "ならう", masu: "ならいます", meaning: "học", group: "Nhóm 1" },
  { dictionary: "なる", masu: "なります", meaning: "trở thành", group: "Nhóm 1" },
  { dictionary: "ぬぐ", masu: "ぬぎます", meaning: "cởi", group: "Nhóm 1" },
  { dictionary: "ねる", masu: "ねます", meaning: "ngủ", group: "Nhóm 2" },
  { dictionary: "のぼる", masu: "のぼります", meaning: "leo", group: "Nhóm 1" },
  { dictionary: "のむ", masu: "のみます", meaning: "uống", group: "Nhóm 1" },
  { dictionary: "はいる", masu: "はいります", meaning: "vào", group: "Nhóm 1" },
  { dictionary: "はく", masu: "はきます", meaning: "đi giày, mặc đồ dưới", group: "Nhóm 1" },
  { dictionary: "はじまる", masu: "はじまります", meaning: "bắt đầu", group: "Nhóm 1" },
  { dictionary: "はしる", masu: "はしります", meaning: "chạy", group: "Nhóm 1" },
  { dictionary: "はたらく", masu: "はたらきます", meaning: "làm việc", group: "Nhóm 1" },
  { dictionary: "はなす", masu: "はなします", meaning: "nói chuyện", group: "Nhóm 1" },
  { dictionary: "はる", masu: "はります", meaning: "dán", group: "Nhóm 1" },
  { dictionary: "ひく", masu: "ひきます", meaning: "kéo, chơi đàn", group: "Nhóm 1" },
  { dictionary: "ふる", masu: "ふります", meaning: "rơi, đổ mưa/tuyết", group: "Nhóm 1" },
  { dictionary: "まがる", masu: "まがります", meaning: "rẽ, cong", group: "Nhóm 1" },
  { dictionary: "まつ", masu: "まちます", meaning: "đợi", group: "Nhóm 1" },
  { dictionary: "みがく", masu: "みがきます", meaning: "đánh, chải", group: "Nhóm 1" },
  { dictionary: "みせる", masu: "みせます", meaning: "cho xem", group: "Nhóm 2" },
  { dictionary: "みる", masu: "みます", meaning: "xem, nhìn", group: "Nhóm 2" },
  { dictionary: "もつ", masu: "もちます", meaning: "cầm, có", group: "Nhóm 1" },
  { dictionary: "もらう", masu: "もらいます", meaning: "nhận", group: "Nhóm 1" },
  { dictionary: "やすむ", masu: "やすみます", meaning: "nghỉ", group: "Nhóm 1" },
  { dictionary: "やる", masu: "やります", meaning: "làm, cho", group: "Nhóm 1" },
  { dictionary: "よぶ", masu: "よびます", meaning: "gọi", group: "Nhóm 1" },
  { dictionary: "よむ", masu: "よみます", meaning: "đọc", group: "Nhóm 1" },
  { dictionary: "わかる", masu: "わかります", meaning: "hiểu", group: "Nhóm 1" },
  { dictionary: "わすれる", masu: "わすれます", meaning: "quên", group: "Nhóm 2" },
  { dictionary: "わたす", masu: "わたします", meaning: "trao, đưa", group: "Nhóm 1" },
  { dictionary: "わたる", masu: "わたります", meaning: "băng qua", group: "Nhóm 1" },
  { dictionary: "べんきょうする", masu: "べんきょうします", meaning: "học", group: "Nhóm 3" },
  { dictionary: "けっこんする", masu: "けっこんします", meaning: "kết hôn", group: "Nhóm 3" },
  { dictionary: "コピーする", masu: "コピーします", meaning: "photo, sao chép", group: "Nhóm 3" },
  { dictionary: "さんぽする", masu: "さんぽします", meaning: "đi dạo", group: "Nhóm 3" },
  { dictionary: "そうじする", masu: "そうじします", meaning: "dọn dẹp", group: "Nhóm 3" },
  { dictionary: "せんたくする", masu: "せんたくします", meaning: "giặt giũ", group: "Nhóm 3" },
  { dictionary: "りょうりする", masu: "りょうりします", meaning: "nấu ăn", group: "Nhóm 3" },
];

const n5CoreAdjectiveEntries: N5AdjectiveEntry[] = [
  { word: "いい", meaning: "tốt", kind: "Tính từ い", note: "いい là ngoại lệ: よくない, よかった, よくて." },
  { word: "おおきい", meaning: "to, lớn", kind: "Tính từ い" },
  { word: "ちいさい", meaning: "nhỏ", kind: "Tính từ い" },
  { word: "あたらしい", meaning: "mới", kind: "Tính từ い" },
  { word: "ふるい", meaning: "cũ", kind: "Tính từ い" },
  { word: "あつい", meaning: "nóng, dày", kind: "Tính từ い" },
  { word: "さむい", meaning: "lạnh thời tiết", kind: "Tính từ い" },
  { word: "つめたい", meaning: "lạnh khi chạm", kind: "Tính từ い" },
  { word: "あたたかい", meaning: "ấm", kind: "Tính từ い" },
  { word: "すずしい", meaning: "mát mẻ", kind: "Tính từ い" },
  { word: "あかるい", meaning: "sáng", kind: "Tính từ い" },
  { word: "くらい", meaning: "tối", kind: "Tính từ い" },
  { word: "いそがしい", meaning: "bận", kind: "Tính từ い" },
  { word: "おいしい", meaning: "ngon", kind: "Tính từ い" },
  { word: "まずい", meaning: "dở, không ngon", kind: "Tính từ い" },
  { word: "あまい", meaning: "ngọt", kind: "Tính từ い" },
  { word: "からい", meaning: "cay", kind: "Tính từ い" },
  { word: "たかい", meaning: "cao, đắt", kind: "Tính từ い" },
  { word: "やすい", meaning: "rẻ", kind: "Tính từ い" },
  { word: "ひくい", meaning: "thấp", kind: "Tính từ い" },
  { word: "ながい", meaning: "dài", kind: "Tính từ い" },
  { word: "みじかい", meaning: "ngắn", kind: "Tính từ い" },
  { word: "おもい", meaning: "nặng", kind: "Tính từ い" },
  { word: "かるい", meaning: "nhẹ", kind: "Tính từ い" },
  { word: "ひろい", meaning: "rộng", kind: "Tính từ い" },
  { word: "せまい", meaning: "hẹp", kind: "Tính từ い" },
  { word: "とおい", meaning: "xa", kind: "Tính từ い" },
  { word: "ちかい", meaning: "gần", kind: "Tính từ い" },
  { word: "はやい", meaning: "nhanh, sớm", kind: "Tính từ い" },
  { word: "おそい", meaning: "chậm, muộn", kind: "Tính từ い" },
  { word: "おもしろい", meaning: "thú vị", kind: "Tính từ い" },
  { word: "かわいい", meaning: "dễ thương", kind: "Tính từ い" },
  { word: "むずかしい", meaning: "khó", kind: "Tính từ い" },
  { word: "やさしい", meaning: "dễ, hiền", kind: "Tính từ い" },
  { word: "わかい", meaning: "trẻ", kind: "Tính từ い" },
  { word: "つよい", meaning: "mạnh", kind: "Tính từ い" },
  { word: "よわい", meaning: "yếu", kind: "Tính từ い" },
  { word: "いたい", meaning: "đau", kind: "Tính từ い" },
  { word: "ねむい", meaning: "buồn ngủ", kind: "Tính từ い" },
  { word: "きたない", meaning: "bẩn", kind: "Tính từ い" },
  { word: "あぶない", meaning: "nguy hiểm", kind: "Tính từ い" },
  { word: "おおい", meaning: "nhiều", kind: "Tính từ い" },
  { word: "すくない", meaning: "ít", kind: "Tính từ い" },
  { word: "しずか", meaning: "yên tĩnh", kind: "Tính từ な" },
  { word: "にぎやか", meaning: "náo nhiệt", kind: "Tính từ な" },
  { word: "ひま", meaning: "rảnh", kind: "Tính từ な" },
  { word: "べんり", meaning: "tiện lợi", kind: "Tính từ な" },
  { word: "げんき", meaning: "khỏe, năng động", kind: "Tính từ な" },
  { word: "すき", meaning: "thích", kind: "Tính từ な" },
  { word: "きらい", meaning: "ghét", kind: "Tính từ な" },
  { word: "じょうず", meaning: "giỏi", kind: "Tính từ な" },
  { word: "へた", meaning: "kém", kind: "Tính từ な" },
  { word: "しんせつ", meaning: "tử tế", kind: "Tính từ な" },
  { word: "たいせつ", meaning: "quan trọng", kind: "Tính từ な" },
  { word: "だいじょうぶ", meaning: "ổn, không sao", kind: "Tính từ な" },
  { word: "ゆうめい", meaning: "nổi tiếng", kind: "Tính từ な" },
  { word: "かんたん", meaning: "đơn giản", kind: "Tính từ な" },
  { word: "あんぜん", meaning: "an toàn", kind: "Tính từ な" },
  { word: "きれい", meaning: "đẹp, sạch", kind: "Tính từ な" },
];

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function makeConjugationChoices(answer: string, preferredDistractors: string[], fallbackPool: string[]) {
  const distractors = uniqueStrings([...preferredDistractors, ...fallbackPool])
    .filter((value) => value !== answer)
    .slice(0, 3);
  return [answer, ...distractors];
}

function buildGodanForms(entry: N5VerbEntry): N5VerbForms {
  const dictionary = entry.dictionary;
  const stem = entry.masu.replace(/ます$/, "");
  const base = dictionary.slice(0, -1);
  const last = dictionary[dictionary.length - 1];
  const teEnding: Record<string, string> = { う: "って", つ: "って", る: "って", む: "んで", ぶ: "んで", ぬ: "んで", く: "いて", ぐ: "いで", す: "して" };
  const taEnding: Record<string, string> = { う: "った", つ: "った", る: "った", む: "んだ", ぶ: "んだ", ぬ: "んだ", く: "いた", ぐ: "いだ", す: "した" };
  const naiEnding: Record<string, string> = { う: "わない", つ: "たない", る: "らない", む: "まない", ぶ: "ばない", ぬ: "なない", く: "かない", ぐ: "がない", す: "さない" };
  const isIkuException = dictionary === "いく";
  const isAruException = dictionary === "ある";
  const teForm = isIkuException ? "いって" : `${base}${teEnding[last] ?? "って"}`;
  const taForm = isIkuException ? "いった" : `${base}${taEnding[last] ?? "った"}`;
  const naiForm = isAruException ? "ない" : `${base}${naiEnding[last] ?? "らない"}`;
  const masenForm = isAruException ? "ありません" : `${stem}ません`;

  return {
    "て形": teForm,
    "た形": taForm,
    "ない形": naiForm,
    "辞書形": dictionary,
    "ます形": entry.masu,
    "ません形": masenForm,
    "ました形": `${stem}ました`,
    "ませんでした形": isAruException ? "ありませんでした" : `${stem}ませんでした`,
    "てください": `${teForm}ください`,
    "てもいいです": `${teForm}もいいです`,
    "てはいけません": `${teForm}はいけません`,
    "ています": `${teForm}います`,
    "ないでください": `${naiForm}でください`,
  };
}

function buildIchidanForms(entry: N5VerbEntry): N5VerbForms {
  const stem = entry.masu.replace(/ます$/, "");
  const teForm = `${stem}て`;
  const taForm = `${stem}た`;
  const naiForm = `${stem}ない`;
  return {
    "て形": teForm,
    "た形": taForm,
    "ない形": naiForm,
    "辞書形": entry.dictionary,
    "ます形": entry.masu,
    "ません形": `${stem}ません`,
    "ました形": `${stem}ました`,
    "ませんでした形": `${stem}ませんでした`,
    "てください": `${teForm}ください`,
    "てもいいです": `${teForm}もいいです`,
    "てはいけません": `${teForm}はいけません`,
    "ています": `${teForm}います`,
    "ないでください": `${naiForm}でください`,
  };
}

function buildIrregularForms(entry: N5VerbEntry): N5VerbForms {
  if (entry.dictionary === "くる") {
    return {
      "て形": "きて",
      "た形": "きた",
      "ない形": "こない",
      "辞書形": "くる",
      "ます形": "きます",
      "ません形": "きません",
      "ました形": "きました",
      "ませんでした形": "きませんでした",
      "てください": "きてください",
      "てもいいです": "きてもいいです",
      "てはいけません": "きてはいけません",
      "ています": "きています",
      "ないでください": "こないでください",
    };
  }

  const root = entry.dictionary.endsWith("する") ? entry.dictionary.slice(0, -2) : "";
  const teForm = `${root}して`;
  const naiForm = `${root}しない`;
  return {
    "て形": teForm,
    "た形": `${root}した`,
    "ない形": naiForm,
    "辞書形": entry.dictionary,
    "ます形": entry.masu,
    "ません形": `${root}しません`,
    "ました形": `${root}しました`,
    "ませんでした形": `${root}しませんでした`,
    "てください": `${teForm}ください`,
    "てもいいです": `${teForm}もいいです`,
    "てはいけません": `${teForm}はいけません`,
    "ています": `${teForm}います`,
    "ないでください": `${naiForm}でください`,
  };
}

function buildVerbForms(entry: N5VerbEntry): N5VerbForms {
  if (entry.group === "Nhóm 2") return buildIchidanForms(entry);
  if (entry.group === "Nhóm 3") return buildIrregularForms(entry);
  return buildGodanForms(entry);
}

function buildVerbMistakes(entry: N5VerbEntry, forms: N5VerbForms, key: N5VerbFormKey) {
  const stem = entry.masu.replace(/ます$/, "");
  const dictionary = entry.dictionary;
  const base = dictionary.slice(0, -1);
  const wrongPlain = [`${stem}る`, `${base}る`, entry.masu, forms["ない形"], forms["て形"], forms["た形"]];
  const wrongTe = [`${stem}て`, `${stem}って`, `${stem}んで`, `${dictionary}て`, forms["た形"] !== forms[key] ? forms["た形"] : ""];
  const wrongTa = [`${stem}た`, `${stem}った`, `${stem}んだ`, `${dictionary}た`, forms["て形"] !== forms[key] ? forms["て形"] : ""];
  const wrongNai = [`${stem}ない`, `${dictionary}ない`, `${base}ない`, `${stem}ません`, forms["辞書形"]];
  const wrongMasu = [`${dictionary}ます`, `${stem}ります`, `${stem}します`, forms["辞書形"], forms["ません形"]];
  const wrongPoliteNeg = [`${stem}ないです`, `${stem}ませんでした`, `${dictionary}ません`, forms["ない形"], forms["ます形"]];
  const wrongPolitePast = [`${stem}たです`, `${stem}ましたでした`, `${dictionary}ました`, forms["た形"], forms["ます形"]];
  const wrongPolitePastNeg = [`${stem}ません`, `${stem}ました`, `${dictionary}ませんでした`, forms["ない形"], forms["ません形"]];
  const wrongTeKudasai = [`${dictionary}ください`, `${forms["て形"]}います`, `${forms["て形"]}もいいです`, `${forms["ない形"]}でください`, forms["てはいけません"]];
  const wrongPermission = [`${forms["て形"]}ください`, `${forms["て形"]}はいけません`, `${dictionary}もいいです`, `${forms["ない形"]}でいいです`, forms["ています"]];
  const wrongProhibition = [`${forms["て形"]}もいいです`, `${forms["て形"]}ください`, `${dictionary}はいけません`, `${forms["ない形"]}でください`, forms["ています"]];
  const wrongProgressive = [`${forms["て形"]}ください`, `${forms["て形"]}もいいです`, `${forms["て形"]}はいけません`, `${dictionary}います`, forms["ます形"]];
  const wrongNaiRequest = [`${forms["て形"]}ください`, `${forms["ない形"]}ください`, `${forms["ない形"]}でいます`, `${dictionary}でください`, forms["てはいけません"]];

  if (key === "て形") return wrongTe;
  if (key === "た形") return wrongTa;
  if (key === "ない形") return wrongNai;
  if (key === "辞書形") return wrongPlain;
  if (key === "ます形") return wrongMasu;
  if (key === "ません形") return wrongPoliteNeg;
  if (key === "ませんでした形") return wrongPolitePastNeg;
  if (key === "てください") return wrongTeKudasai;
  if (key === "てもいいです") return wrongPermission;
  if (key === "てはいけません") return wrongProhibition;
  if (key === "ています") return wrongProgressive;
  if (key === "ないでください") return wrongNaiRequest;
  return wrongPolitePast;
}

function buildN5CoreVerbConjugationItems(): N5ConjugationItem[] {
  const entriesWithForms = n5CoreVerbEntries.map((entry) => ({
    entry,
    forms: buildVerbForms(entry),
  }));

  return entriesWithForms.flatMap(({ entry, forms }) =>
    n5VerbTargets.map(({ key, instruction }) => {
      const fallbackPool = entriesWithForms
        .filter((candidate) => candidate.entry.dictionary !== entry.dictionary || candidate.entry.masu !== entry.masu)
        .map((candidate) => candidate.forms[key]);
      const answer = forms[key];

      return {
        verb: entry.masu,
        meaning: entry.meaning,
        group: entry.group,
        targetForm: key,
        instruction,
        answer,
        choices: makeConjugationChoices(answer, buildVerbMistakes(entry, forms, key), fallbackPool),
        note: entry.note ?? `${entry.group}: ${entry.masu} → ${answer}.`,
      };
    }),
  );
}

function buildAdjectiveForms(entry: N5AdjectiveEntry): N5AdjectiveForms {
  if (entry.kind === "Tính từ な") {
    return {
      "丁寧形": `${entry.word}です`,
      "否定形": `${entry.word}じゃありません`,
      "過去形": `${entry.word}でした`,
      "て形": `${entry.word}で`,
      "名詞修飾": `${entry.word}な`,
    };
  }

  const base = entry.word === "いい" ? "よ" : entry.word.slice(0, -1);
  return {
    "丁寧形": `${entry.word}です`,
    "否定形": `${base}くない`,
    "過去形": `${base}かった`,
    "て形": `${base}くて`,
  };
}

function buildAdjectiveMistakes(entry: N5AdjectiveEntry, forms: N5AdjectiveForms, key: N5AdjectiveFormKey) {
  const base = entry.kind === "Tính từ い" ? (entry.word === "いい" ? "い" : entry.word.slice(0, -1)) : entry.word;
  if (entry.kind === "Tính từ な") {
    return [`${entry.word}くない`, `${entry.word}かった`, `${entry.word}くて`, `${entry.word}い`, `${entry.word}の`, forms["丁寧形"] ?? ""];
  }
  if (key === "丁寧形") return [`${base}です`, `${entry.word}なです`, `${entry.word}だ`, forms["否定形"] ?? ""];
  if (key === "否定形") return [`${entry.word}ない`, `${base}じゃありません`, `${base}かった`, `${base}くて`];
  if (key === "過去形") return [`${entry.word}でした`, `${base}いかった`, `${base}くた`, forms["否定形"] ?? ""];
  return [`${entry.word}で`, `${base}いで`, `${base}かった`, `${entry.word}な`];
}

function buildN5AdjectiveConjugationItems(): N5ConjugationItem[] {
  const entriesWithForms = n5CoreAdjectiveEntries.map((entry) => ({
    entry,
    forms: buildAdjectiveForms(entry),
  }));

  return entriesWithForms.flatMap(({ entry, forms }) =>
    n5AdjectiveTargets.flatMap(({ key, instruction }) => {
      const answer = forms[key];
      if (!answer) return [];
      const fallbackPool = entriesWithForms
        .filter((candidate) => candidate.entry.word !== entry.word)
        .map((candidate) => candidate.forms[key])
        .filter((value): value is string => Boolean(value));

      return [{
        verb: entry.word,
        meaning: entry.meaning,
        group: entry.kind,
        targetForm: key,
        instruction,
        answer,
        choices: makeConjugationChoices(answer, buildAdjectiveMistakes(entry, forms, key), fallbackPool),
        note: entry.note ?? `${entry.kind}: ${entry.word} → ${answer}.`,
      }];
    }),
  );
}

function dedupeN5ConjugationItems(items: N5ConjugationItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.verb}|${item.group}|${item.targetForm}|${item.answer}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const n5ConjugationSeedItems: N5ConjugationItem[] = [
  { verb: "いきます", meaning: "đi", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "いって", choices: ["いって", "いいて", "いきて", "いんで"], note: "行きます là ngoại lệ quan trọng: いきます → いって." },
  { verb: "かきます", meaning: "viết", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "かいて", choices: ["かいて", "かって", "かきて", "かいで"], note: "Đuôi き chuyển thành いて: かきます → かいて." },
  { verb: "およぎます", meaning: "bơi", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "およいで", choices: ["およいで", "およいて", "およぎて", "およんで"], note: "Đuôi ぎ chuyển thành いで: およぎます → およいで." },
  { verb: "よみます", meaning: "đọc", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "よんで", choices: ["よんで", "よみて", "よって", "よいて"], note: "Đuôi み chuyển thành んで: よみます → よんで." },
  { verb: "のみます", meaning: "uống", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "のんで", choices: ["のんで", "のみて", "のって", "のいて"], note: "Đuôi み chuyển thành んで: のみます → のんで." },
  { verb: "かいます", meaning: "mua", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "かって", choices: ["かって", "かいて", "かうて", "かんで"], note: "Đuôi い chuyển thành って: かいます → かって." },
  { verb: "まちます", meaning: "đợi", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "まって", choices: ["まって", "まちて", "まいて", "まんで"], note: "Đuôi ち chuyển thành って: まちます → まって." },
  { verb: "かえります", meaning: "về", group: "Nhóm 1", targetForm: "て形", instruction: "Chia sang thể て", answer: "かえって", choices: ["かえって", "かえりて", "かえて", "かえんで"], note: "Đuôi り chuyển thành って: かえります → かえって." },
  { verb: "たべます", meaning: "ăn", group: "Nhóm 2", targetForm: "て形", instruction: "Chia sang thể て", answer: "たべて", choices: ["たべて", "たべって", "たんで", "たべいて"], note: "Nhóm 2 bỏ ます rồi thêm て: たべます → たべて." },
  { verb: "みます", meaning: "xem/nhìn", group: "Nhóm 2", targetForm: "て形", instruction: "Chia sang thể て", answer: "みて", choices: ["みて", "みって", "みんで", "みいて"], note: "Nhóm 2 bỏ ます rồi thêm て: みます → みて." },
  { verb: "します", meaning: "làm", group: "Nhóm 3", targetForm: "て形", instruction: "Chia sang thể て", answer: "して", choices: ["して", "すて", "しって", "しんで"], note: "します là bất quy tắc: します → して." },
  { verb: "きます", meaning: "đến", group: "Nhóm 3", targetForm: "て形", instruction: "Chia sang thể て", answer: "きて", choices: ["きて", "くて", "こて", "きって"], note: "来ます là bất quy tắc: きます → きて." },
  { verb: "はなします", meaning: "nói", group: "Nhóm 1", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "はなさない", choices: ["はなさない", "はなしない", "はなない", "はなせない"], note: "Đuôi します của nhóm 1 đổi thành さない: はなします → はなさない." },
  { verb: "いきます", meaning: "đi", group: "Nhóm 1", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "いかない", choices: ["いかない", "いきない", "いない", "いけない"], note: "Đuôi き đổi về hàng あ: いきます → いかない." },
  { verb: "かきます", meaning: "viết", group: "Nhóm 1", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "かかない", choices: ["かかない", "かきない", "かけない", "かない"], note: "Đuôi き đổi về hàng あ: かきます → かかない." },
  { verb: "よみます", meaning: "đọc", group: "Nhóm 1", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "よまない", choices: ["よまない", "よみない", "よめない", "よない"], note: "Đuôi み đổi về hàng あ: よみます → よまない." },
  { verb: "かいます", meaning: "mua", group: "Nhóm 1", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "かわない", choices: ["かわない", "かいない", "かあない", "かえない"], note: "Đuôi います đổi thành わない: かいます → かわない." },
  { verb: "まちます", meaning: "đợi", group: "Nhóm 1", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "またない", choices: ["またない", "まちない", "まてない", "まない"], note: "Đuôi ち đổi về hàng あ: まちます → またない." },
  { verb: "たべます", meaning: "ăn", group: "Nhóm 2", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "たべない", choices: ["たべない", "たばない", "たびない", "たべらない"], note: "Nhóm 2 bỏ ます rồi thêm ない: たべます → たべない." },
  { verb: "みます", meaning: "xem/nhìn", group: "Nhóm 2", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "みない", choices: ["みない", "まない", "みらない", "みにない"], note: "Nhóm 2 bỏ ます rồi thêm ない: みます → みない." },
  { verb: "します", meaning: "làm", group: "Nhóm 3", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "しない", choices: ["しない", "すない", "せない", "しらない"], note: "します là bất quy tắc: します → しない." },
  { verb: "きます", meaning: "đến", group: "Nhóm 3", targetForm: "ない形", instruction: "Chia sang thể ない", answer: "こない", choices: ["こない", "きない", "くない", "けない"], note: "来ます là bất quy tắc: きます → こない." },
  { verb: "いきます", meaning: "đi", group: "Nhóm 1", targetForm: "た形", instruction: "Chia sang thể た", answer: "いった", choices: ["いった", "いいた", "いきた", "いんだ"], note: "行きます là ngoại lệ giống て形: いきます → いった." },
  { verb: "かきます", meaning: "viết", group: "Nhóm 1", targetForm: "た形", instruction: "Chia sang thể た", answer: "かいた", choices: ["かいた", "かった", "かきた", "かいだ"], note: "Đuôi き chuyển thành いた: かきます → かいた." },
  { verb: "およぎます", meaning: "bơi", group: "Nhóm 1", targetForm: "た形", instruction: "Chia sang thể た", answer: "およいだ", choices: ["およいだ", "およいた", "およぎた", "およんだ"], note: "Đuôi ぎ chuyển thành いだ: およぎます → およいだ." },
  { verb: "よみます", meaning: "đọc", group: "Nhóm 1", targetForm: "た形", instruction: "Chia sang thể た", answer: "よんだ", choices: ["よんだ", "よみた", "よった", "よいた"], note: "Đuôi み chuyển thành んだ: よみます → よんだ." },
  { verb: "かいます", meaning: "mua", group: "Nhóm 1", targetForm: "た形", instruction: "Chia sang thể た", answer: "かった", choices: ["かった", "かいた", "かうた", "かんだ"], note: "Đuôi い chuyển thành った: かいます → かった." },
  { verb: "まちます", meaning: "đợi", group: "Nhóm 1", targetForm: "た形", instruction: "Chia sang thể た", answer: "まった", choices: ["まった", "まちた", "まいた", "まんだ"], note: "Đuôi ち chuyển thành った: まちます → まった." },
  { verb: "たべます", meaning: "ăn", group: "Nhóm 2", targetForm: "た形", instruction: "Chia sang thể た", answer: "たべた", choices: ["たべた", "たべった", "たんだ", "たべいた"], note: "Nhóm 2 bỏ ます rồi thêm た: たべます → たべた." },
  { verb: "みます", meaning: "xem/nhìn", group: "Nhóm 2", targetForm: "た形", instruction: "Chia sang thể た", answer: "みた", choices: ["みた", "みった", "みんだ", "みいた"], note: "Nhóm 2 bỏ ます rồi thêm た: みます → みた." },
  { verb: "します", meaning: "làm", group: "Nhóm 3", targetForm: "た形", instruction: "Chia sang thể た", answer: "した", choices: ["した", "すた", "しった", "しんだ"], note: "します là bất quy tắc: します → した." },
  { verb: "きます", meaning: "đến", group: "Nhóm 3", targetForm: "た形", instruction: "Chia sang thể た", answer: "きた", choices: ["きた", "くた", "こた", "きった"], note: "来ます là bất quy tắc: きます → きた." },
  { verb: "たべます", meaning: "ăn", group: "Nhóm 2", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "たべる", choices: ["たべる", "たべす", "たべく", "たべむ"], note: "Nhóm 2: bỏ ます rồi thêm る." },
  { verb: "みます", meaning: "xem/nhìn", group: "Nhóm 2", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "みる", choices: ["みる", "みす", "みく", "みむ"], note: "みます là nhóm 2: みます → みる." },
  { verb: "いきます", meaning: "đi", group: "Nhóm 1", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "いく", choices: ["いく", "いきる", "いける", "いす"], note: "Nhóm 1 đổi âm trước ます về hàng う: き → く." },
  { verb: "かきます", meaning: "viết", group: "Nhóm 1", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "かく", choices: ["かく", "かきる", "かける", "かす"], note: "Nhóm 1 đổi き thành く: かきます → かく." },
  { verb: "よみます", meaning: "đọc", group: "Nhóm 1", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "よむ", choices: ["よむ", "よみる", "よめる", "よす"], note: "Nhóm 1 đổi み thành む: よみます → よむ." },
  { verb: "かいます", meaning: "mua", group: "Nhóm 1", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "かう", choices: ["かう", "かいる", "かえる", "かす"], note: "Nhóm 1 đổi い thành う: かいます → かう." },
  { verb: "します", meaning: "làm", group: "Nhóm 3", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "する", choices: ["する", "しる", "す", "します"], note: "します là bất quy tắc: します → する." },
  { verb: "きます", meaning: "đến", group: "Nhóm 3", targetForm: "辞書形", instruction: "Chia sang thể từ điển", answer: "くる", choices: ["くる", "きる", "こる", "きます"], note: "来ます là bất quy tắc: きます → くる." },
  { verb: "はなす", meaning: "nói", group: "Nhóm 1", targetForm: "ます形", instruction: "Chia sang thể ます", answer: "はなします", choices: ["はなします", "はなすます", "はなります", "はなせます"], note: "辞書形 はなす đổi す thành し + ます." },
  { verb: "たべる", meaning: "ăn", group: "Nhóm 2", targetForm: "ます形", instruction: "Chia sang thể ます", answer: "たべます", choices: ["たべます", "たべります", "たべします", "たべす"], note: "Nhóm 2 bỏ る rồi thêm ます." },
  { verb: "みる", meaning: "xem/nhìn", group: "Nhóm 2", targetForm: "ます形", instruction: "Chia sang thể ます", answer: "みます", choices: ["みます", "みります", "みします", "みるます"], note: "Nhóm 2 bỏ る rồi thêm ます." },
  { verb: "いく", meaning: "đi", group: "Nhóm 1", targetForm: "ます形", instruction: "Chia sang thể ます", answer: "いきます", choices: ["いきます", "います", "いけます", "いくます"], note: "辞書形 いく đổi く thành き + ます." },
  { verb: "する", meaning: "làm", group: "Nhóm 3", targetForm: "ます形", instruction: "Chia sang thể ます", answer: "します", choices: ["します", "すます", "せます", "しります"], note: "する là bất quy tắc: する → します." },
  { verb: "くる", meaning: "đến", group: "Nhóm 3", targetForm: "ます形", instruction: "Chia sang thể ます", answer: "きます", choices: ["きます", "くます", "こます", "けます"], note: "くる là bất quy tắc: くる → きます." },
];

const n5ConjugationItems = dedupeN5ConjugationItems([
  ...n5ConjugationSeedItems,
  ...buildN5CoreVerbConjugationItems(),
  ...buildN5AdjectiveConjugationItems(),
]);

const grammarPoints: Record<number, GrammarPoint[]> = {
  1: [
    { title: "Khẳng định với です", pattern: "N1 は N2 です", explanation: "Dùng は để nêu chủ đề và です để kết thúc câu danh từ theo lối lịch sự.", example: "わたしは マイです。", translation: "Tôi là Mai.", question: "わたし ＿＿＿ マイです。", answer: "は", choices: ["は", "も", "の", "か"] },
    { title: "Phủ định danh từ", pattern: "N1 は N2 じゃありません", explanation: "じゃありません là dạng phủ định lịch sự thường dùng trong hội thoại.", example: "ミラーさんは いしゃじゃありません。", translation: "Anh Miller không phải là bác sĩ.", question: "サントスさんは せんせい ＿＿＿。", answer: "じゃありません", choices: ["じゃありません", "です", "でした", "ですか"] },
    { title: "Câu hỏi với か", pattern: "～ですか", explanation: "Thêm か cuối câu lịch sự để tạo câu hỏi; không cần đảo trật tự câu.", example: "あなたは がくせいですか。", translation: "Bạn có phải là sinh viên không?", question: "ミラーさんは かいしゃいんです ＿＿＿。", answer: "か", choices: ["か", "の", "も", "は"] },
    { title: "Cũng là với も", pattern: "N1 も N2 です", explanation: "も thay cho は khi muốn nói chủ thể này cũng giống thông tin đã nêu trước đó.", example: "マイさんも ベトナムじんです。", translation: "Chị Mai cũng là người Việt Nam.", question: "ランさん ＿＿＿ ベトナムじんです。", answer: "も", choices: ["も", "は", "の", "か"] },
    { title: "Quan hệ thuộc về với の", pattern: "N1 の N2", explanation: "の nối hai danh từ để chỉ sở hữu, tổ chức, quốc gia hoặc lĩnh vực liên quan.", example: "IMCの かいしゃいんです。", translation: "Là nhân viên của công ty IMC.", question: "さくらだいがく ＿＿＿ がくせいです。", answer: "の", choices: ["の", "も", "は", "か"] },
  ],
  2: [
    { title: "これ・それ・あれ", pattern: "これ / それ / あれ は N です", explanation: "これ chỉ vật gần người nói, それ gần người nghe và あれ xa cả hai người.", example: "これは じしょです。", translation: "Đây là từ điển.", question: "＿＿＿は わたしの ほんです。", answer: "これ", choices: ["これ", "この", "ここ", "どこ"] },
    { title: "この・その・あの", pattern: "この / その / あの + N", explanation: "Các từ này phải đứng ngay trước một danh từ.", example: "このかさは わたしのです。", translation: "Chiếc ô này là của tôi.", question: "＿＿＿カメラは にほんのです。", answer: "その", choices: ["その", "それ", "そこ", "そう"] },
    { title: "Sở hữu với の", pattern: "N1 の N2 / N1 の", explanation: "の biểu thị người sở hữu; có thể lược danh từ sau の khi đã rõ trong ngữ cảnh.", example: "これは だれの めいしですか。", translation: "Đây là danh thiếp của ai?", question: "これは ミラーさん ＿＿＿ です。", answer: "の", choices: ["の", "は", "も", "か"] },
    { title: "Xác nhận そうです", pattern: "はい、そうです / いいえ、ちがいます", explanation: "Dùng そうです để xác nhận và ちがいます để phủ định nội dung câu hỏi.", example: "はい、そうです。", translation: "Vâng, đúng vậy.", question: "これは カメラですか。はい、＿＿＿。", answer: "そうです", choices: ["そうです", "ちがいます", "なんです", "どれです"] },
    { title: "Lựa chọn A hay B", pattern: "A ですか、B ですか", explanation: "Đặt か sau mỗi phương án để hỏi người nghe chọn A hay B.", example: "これは ペンですか、えんぴつですか。", translation: "Đây là bút máy hay bút chì?", question: "これは ノートですか、てちょうです ＿＿＿。", answer: "か", choices: ["か", "の", "ね", "も"] },
  ],
  3: [
    { title: "ここ・そこ・あそこ", pattern: "ここ / そこ / あそこ は N です", explanation: "Dùng để chỉ nơi gần người nói, gần người nghe hoặc xa cả hai.", example: "ここは きょうしつです。", translation: "Đây là phòng học.", question: "＿＿＿は うけつけです。", answer: "ここ", choices: ["ここ", "これ", "この", "どこ"] },
    { title: "Nơi chốn của sự vật", pattern: "N は địa điểm です", explanation: "Đặt địa điểm trước です để nói một người, vật hoặc cơ sở ở đâu.", example: "しょくどうは にかいです。", translation: "Nhà ăn ở tầng hai.", question: "かいぎしつは さんがい ＿＿＿。", answer: "です", choices: ["です", "ます", "あります", "います"] },
    { title: "Hỏi địa điểm với どこ", pattern: "N は どこですか", explanation: "どこ dùng để hỏi vị trí của người, vật hoặc cơ sở.", example: "トイレは どこですか。", translation: "Nhà vệ sinh ở đâu?", question: "かいぎしつは ＿＿＿ですか。", answer: "どこ", choices: ["どこ", "だれ", "なに", "いつ"] },
    { title: "Cách hỏi lịch sự どちら", pattern: "N は どちらですか", explanation: "どちら là cách lịch sự của どこ và cũng có nghĩa là phía nào.", example: "エレベーターは どちらですか。", translation: "Thang máy ở phía nào?", question: "おくには ＿＿＿ですか。", answer: "どちら", choices: ["どちら", "どれ", "どの", "どんな"] },
    { title: "Hỏi giá với いくら", pattern: "N は いくらですか", explanation: "いくら dùng để hỏi giá tiền của một món đồ.", example: "このくつは いくらですか。", translation: "Đôi giày này giá bao nhiêu?", question: "そのネクタイは ＿＿＿ですか。", answer: "いくら", choices: ["いくら", "いくつ", "いつ", "なんがい"] },
  ],
  4: [
    { title: "Thời điểm với に", pattern: "Thời gian に Vます", explanation: "に đánh dấu thời điểm cụ thể mà hành động xảy ra; thường không dùng với きょう, あした, まいにち.", example: "ろくじはんに おきます。", translation: "Tôi thức dậy lúc 6 giờ 30.", question: "じゅういちじ ＿＿＿ ねます。", answer: "に", choices: ["に", "で", "へ", "を"] },
    { title: "Khoảng thời gian から・まで", pattern: "A から B まで", explanation: "から chỉ điểm bắt đầu và まで chỉ điểm kết thúc của thời gian hoặc địa điểm.", example: "くじから ごじまで はたらきます。", translation: "Tôi làm việc từ 9 giờ đến 5 giờ.", question: "ぎんこうは くじから さんじ ＿＿＿です。", answer: "まで", choices: ["まで", "から", "に", "へ"] },
    { title: "Hiện tại phủ định", pattern: "Vません", explanation: "Đổi đuôi ます thành ません để nói không làm một hành động ở hiện tại hoặc tương lai.", example: "にちようびは はたらきません。", translation: "Chủ nhật tôi không làm việc.", question: "どようびは べんきょうし ＿＿＿。", answer: "ません", choices: ["ません", "ます", "ました", "ませんでした"] },
    { title: "Quá khứ khẳng định", pattern: "Vました", explanation: "Đổi ます thành ました để nói một hành động đã xảy ra.", example: "きのう べんきょうしました。", translation: "Hôm qua tôi đã học.", question: "おととい やすみ ＿＿＿。", answer: "ました", choices: ["ました", "ます", "ません", "です"] },
    { title: "Quá khứ phủ định", pattern: "Vませんでした", explanation: "ませんでした diễn tả một hành động đã không xảy ra trong quá khứ.", example: "きのう はたらきませんでした。", translation: "Hôm qua tôi đã không làm việc.", question: "せんしゅう べんきょうし ＿＿＿。", answer: "ませんでした", choices: ["ませんでした", "ません", "ました", "です"] },
  ],
  5: [
    { title: "Đích đến với へ", pattern: "Địa điểm へ 行きます / 来ます / 帰ります", explanation: "へ đọc là え, dùng để chỉ hướng hoặc đích của hành động di chuyển.", example: "きょうとへ いきます。", translation: "Tôi đi Kyoto.", question: "らいげつ にほん ＿＿＿ いきます。", answer: "へ", choices: ["へ", "で", "と", "を"] },
    { title: "Phương tiện với で", pattern: "Phương tiện で 行きます", explanation: "で chỉ phương tiện hoặc cách thức được dùng để di chuyển.", example: "でんしゃで おおさかへ いきます。", translation: "Tôi đi Osaka bằng tàu điện.", question: "がっこうへ バス ＿＿＿ いきます。", answer: "で", choices: ["で", "へ", "に", "と"] },
    { title: "Người đồng hành với と", pattern: "Người と Vます", explanation: "と đặt sau người cùng thực hiện hành động, mang nghĩa cùng với.", example: "ともだちと きょうとへ いきます。", translation: "Tôi đi Kyoto cùng bạn.", question: "かぞく ＿＿＿ にほんへ きました。", answer: "と", choices: ["と", "で", "へ", "から"] },
    { title: "Điểm đầu và cuối", pattern: "A から B まで", explanation: "から và まで cũng dùng cho điểm xuất phát và điểm kết thúc của hành trình.", example: "とうきょうから おおさかまで いきます。", translation: "Tôi đi từ Tokyo đến Osaka.", question: "えきから うち ＿＿＿ タクシーで かえります。", answer: "まで", choices: ["まで", "へ", "と", "に"] },
    { title: "Phủ định toàn bộ với も", pattern: "どこへも Vません", explanation: "Từ hỏi + も đi với động từ phủ định mang nghĩa không… đâu/cái gì/ai cả.", example: "にちようびは どこへも いきません。", translation: "Chủ nhật tôi không đi đâu cả.", question: "きょうは どこへ ＿＿＿ いきません。", answer: "も", choices: ["も", "は", "の", "か"] },
  ],
  6: [
    { title: "Tân ngữ với を", pattern: "N を Vます", explanation: "を đánh dấu đồ vật hoặc nội dung chịu tác động trực tiếp của hành động.", example: "パンを たべます。", translation: "Tôi ăn bánh mì.", question: "まいあさ コーヒー ＿＿＿ のみます。", answer: "を", choices: ["を", "で", "に", "へ"] },
    { title: "Nơi diễn ra hành động", pattern: "Địa điểm で Vます", explanation: "で đặt sau nơi một hành động được thực hiện.", example: "レストランで ひるごはんを たべます。", translation: "Tôi ăn trưa tại nhà hàng.", question: "としょかん ＿＿＿ ほんを よみます。", answer: "で", choices: ["で", "に", "を", "と"] },
    { title: "Lời mời với ませんか", pattern: "Vませんか", explanation: "Dạng phủ định nghi vấn được dùng nhẹ nhàng để mời người nghe cùng làm việc gì.", example: "いっしょに えいがを みませんか。", translation: "Bạn cùng xem phim không?", question: "いっしょに コーヒーを のみ ＿＿＿。", answer: "ませんか", choices: ["ませんか", "ません", "ましたか", "ます"] },
    { title: "Đề nghị cùng làm", pattern: "Vましょう", explanation: "ましょう dùng khi người nói chủ động đề nghị cả hai hoặc cả nhóm cùng hành động.", example: "ちょっと やすみましょう。", translation: "Chúng ta nghỉ một chút nhé.", question: "いっしょに ひるごはんを たべ ＿＿＿。", answer: "ましょう", choices: ["ましょう", "ません", "ました", "ますか"] },
    { title: "Gặp một người", pattern: "Người に 会います", explanation: "Với 会います, trợ từ に đánh dấu người mà chủ thể gặp.", example: "えきで ともだちに あいます。", translation: "Tôi gặp bạn ở nhà ga.", question: "あした せんせい ＿＿＿ あいます。", answer: "に", choices: ["に", "で", "を", "へ"] },
  ],
  7: [
    { title: "Phương tiện và ngôn ngữ với で", pattern: "Công cụ / ngôn ngữ で Vます", explanation: "で chỉ công cụ, phương tiện hoặc ngôn ngữ dùng để thực hiện hành động.", example: "はしで ごはんを たべます。", translation: "Tôi ăn cơm bằng đũa.", question: "にほんご ＿＿＿ メールを かきます。", answer: "で", choices: ["で", "に", "を", "から"] },
    { title: "Tặng cho ai", pattern: "Người に Vật を あげます", explanation: "に đánh dấu người nhận khi chủ thể tặng một vật cho người khác.", example: "ははに はなを あげます。", translation: "Tôi tặng hoa cho mẹ.", question: "ともだち ＿＿＿ プレゼントを あげます。", answer: "に", choices: ["に", "から", "で", "を"] },
    { title: "Nhận từ ai", pattern: "Người に / から Vật を もらいます", explanation: "に hoặc から đánh dấu nguồn mà chủ thể nhận được một vật.", example: "ともだちから おみやげを もらいました。", translation: "Tôi đã nhận quà từ bạn.", question: "せんせい ＿＿＿ じしょを もらいました。", answer: "に", choices: ["に", "を", "へ", "で"] },
    { title: "Cho mượn và mượn", pattern: "Người に Vật を 貸します / 借ります", explanation: "Người đi với に có thể là người được cho mượn hoặc người cho mình mượn; động từ cho biết hướng trao đổi.", example: "ともだちに じしょを かします。", translation: "Tôi cho bạn mượn từ điển.", question: "ちちに おかねを ＿＿＿。", answer: "かります", choices: ["かります", "かします", "あげます", "おくります"] },
    { title: "Đã làm rồi hay chưa", pattern: "もう Vました / まだです", explanation: "もう〜ました xác nhận việc đã xong; khi chưa xong, trả lời いいえ、まだです.", example: "もう にもつを おくりました。", translation: "Tôi đã gửi hành lý rồi.", question: "もう きっぷを かいましたか。いいえ、＿＿＿。", answer: "まだです", choices: ["まだです", "もうです", "そうです", "ちがいます"] },
  ],
  8: [
    { title: "Khẳng định tính từ な", pattern: "N は Aな です", explanation: "Tính từ な giữ nguyên trước です khi đứng ở vị ngữ.", example: "ならは しずかです。", translation: "Nara yên tĩnh.", question: "やまだせんせいは しんせつ ＿＿＿。", answer: "です", choices: ["です", "なです", "いです", "ます"] },
    { title: "Phủ định tính từ な", pattern: "N は Aな じゃありません", explanation: "Thêm じゃありません sau gốc tính từ な để tạo dạng phủ định lịch sự.", example: "きょうは ひまじゃありません。", translation: "Hôm nay tôi không rảnh.", question: "このまちは にぎやか ＿＿＿。", answer: "じゃありません", choices: ["じゃありません", "くないです", "ません", "ではいます"] },
    { title: "Khẳng định và phủ định tính từ い", pattern: "Aい です / Aくないです", explanation: "Dạng phủ định của tính từ い đổi い thành くないです; riêng いい thành よくないです.", example: "このカメラは よくないです。", translation: "Máy ảnh này không tốt.", question: "このほんは おもしろ ＿＿＿。", answer: "くないです", choices: ["くないです", "じゃありません", "ません", "なです"] },
    { title: "Tính từ bổ nghĩa danh từ", pattern: "Aい + N / Aな + な + N", explanation: "Tính từ い đứng trực tiếp trước danh từ; tính từ な cần thêm な.", example: "ならは しずかな まちです。", translation: "Nara là thành phố yên tĩnh.", question: "ふじさんは たか ＿＿＿ やまです。", answer: "い", choices: ["い", "な", "く", "の"] },
    { title: "Hỏi đặc điểm với どんな", pattern: "N は どんな N ですか", explanation: "どんな đứng trước danh từ để hỏi loại hoặc đặc điểm của người, vật, nơi chốn.", example: "ならは どんな ところですか。", translation: "Nara là nơi như thế nào?", question: "やまだせんせいは ＿＿＿ ひとですか。", answer: "どんな", choices: ["どんな", "どう", "どれ", "どこ"] },
  ],
  9: [
    { title: "Đối tượng của 分かります", pattern: "N が 分かります", explanation: "が đánh dấu ngôn ngữ hoặc nội dung mà chủ thể hiểu.", example: "にほんごが わかります。", translation: "Tôi hiểu tiếng Nhật.", question: "かんじ ＿＿＿ すこし わかります。", answer: "が", choices: ["が", "を", "に", "で"] },
    { title: "Sở thích và năng lực", pattern: "N が 好き / 嫌い / 上手 / 下手 です", explanation: "Các tính từ chỉ thích, ghét, giỏi và không giỏi dùng が với đối tượng.", example: "ははは りょうりが じょうずです。", translation: "Mẹ tôi nấu ăn giỏi.", question: "わたしは おんがく ＿＿＿ すきです。", answer: "が", choices: ["が", "を", "は", "へ"] },
    { title: "Phó từ chỉ mức độ", pattern: "よく / だいたい / 少し / あまり / 全然 + V", explanation: "よく, だいたい, 少し dùng với khẳng định; あまり và 全然 thường đi cùng phủ định.", example: "フランスごは ぜんぜん わかりません。", translation: "Tôi hoàn toàn không hiểu tiếng Pháp.", question: "えいごが ＿＿＿ わかります。", answer: "よく", choices: ["よく", "ぜんぜん", "あまり", "から"] },
    { title: "Nêu nguyên nhân với から", pattern: "Mệnh đề から、mệnh đề", explanation: "から đặt sau nguyên nhân và mang nghĩa vì; kết quả có thể đứng trước trong hội thoại.", example: "ようじが ありますから、はやく かえります。", translation: "Vì có việc nên tôi về sớm.", question: "じかんが ありません ＿＿＿、テレビを みません。", answer: "から", choices: ["から", "まで", "でも", "と"] },
    { title: "Hỏi lý do với どうして", pattern: "どうして S か", explanation: "どうして hỏi nguyên nhân; câu trả lời thường kết thúc bằng から hoặc からです.", example: "どうして はやく かえりますか。", translation: "Tại sao bạn về sớm?", question: "＿＿＿ にほんごを べんきょうしますか。", answer: "どうして", choices: ["どうして", "どんな", "どちら", "だれ"] },
  ],
  10: [
    { title: "Có người hoặc vật tại một nơi", pattern: "Địa điểm に N が います / あります", explanation: "に đánh dấu nơi tồn tại, が đánh dấu người, động vật hoặc đồ vật hiện diện.", example: "きょうしつに せんせいが います。", translation: "Có giáo viên trong lớp.", question: "つくえのうえ ＿＿＿ ほんが あります。", answer: "に", choices: ["に", "で", "を", "へ"] },
    { title: "Nói vị trí của chủ thể", pattern: "N は Địa điểm に います / あります", explanation: "Đưa người hoặc vật lên làm chủ đề với は rồi nêu vị trí trước に.", example: "ほんやは えきのまえに あります。", translation: "Hiệu sách ở trước ga.", question: "ミラーさんは かいぎしつ ＿＿＿ います。", answer: "に", choices: ["に", "で", "を", "と"] },
    { title: "Phân biệt います và あります", pattern: "Người / động vật が います; vật が あります", explanation: "います dùng cho người và động vật; あります dùng cho vật, cây cối, địa điểm và sự kiện.", example: "うちに ねこが います。", translation: "Nhà tôi có mèo.", question: "こうえんに おおきい きが ＿＿＿。", answer: "あります", choices: ["あります", "います", "ですか", "します"] },
    { title: "Từ chỉ vị trí", pattern: "N の 上 / 下 / 前 / 後ろ / 隣 / 中 / 外", explanation: "Dùng の để nối vật mốc với vị trí tương đối của người hoặc đồ vật.", example: "はこのなかに てがみが あります。", translation: "Có thư trong hộp.", question: "いすの ＿＿＿に かばんが あります。", answer: "となり", choices: ["となり", "どこ", "だれ", "なに"] },
    { title: "Liệt kê không đầy đủ", pattern: "N1 や N2 など", explanation: "や liệt kê một vài ví dụ; など cho biết còn có những thứ tương tự khác.", example: "こうえんに きや はななどが あります。", translation: "Trong công viên có cây, hoa, v.v.", question: "つくえのうえに ほん ＿＿＿ じしょなどが あります。", answer: "や", choices: ["や", "と", "を", "へ"] },
  ],
  11: [
    { title: "Số lượng với từ đếm", pattern: "N を / が + số lượng + V", explanation: "Cụm số lượng thường đứng ngay trước động từ; chọn lượng từ phù hợp với loại người hoặc vật.", example: "りんごを よっつ かいました。", translation: "Tôi đã mua bốn quả táo.", question: "きってを じゅう ＿＿＿ かいます。", answer: "まい", choices: ["まい", "にん", "だい", "さつ"] },
    { title: "Hỏi số lượng", pattern: "いくつ / 何人 / 何枚 ...", explanation: "いくつ hỏi số đồ vật chung; với lượng từ riêng, thay số bằng 何.", example: "がくせいが なんにん いますか。", translation: "Có bao nhiêu học sinh?", question: "りんごは ＿＿＿ ありますか。", answer: "いくつ", choices: ["いくつ", "いくら", "いつ", "どこ"] },
    { title: "Tần suất trong khoảng", pattern: "Khoảng thời gian に số回 V", explanation: "に đặt sau khoảng làm mốc để nói hành động xảy ra bao nhiêu lần.", example: "いっしゅうかんに にかい テニスをします。", translation: "Tôi chơi tennis hai lần một tuần.", question: "ひとつき ＿＿＿ さんかい えいがをみます。", answer: "に", choices: ["に", "で", "を", "へ"] },
    { title: "Khoảng thời gian thực hiện", pattern: "Khoảng thời gian + V", explanation: "Khi chỉ độ dài hành động, khoảng thời gian đứng trước động từ và không cần に.", example: "まいにち にじかん べんきょうします。", translation: "Mỗi ngày tôi học hai tiếng.", question: "にほんに さんねん ＿＿＿。", answer: "います", choices: ["います", "あります", "です", "します"] },
    { title: "Thời gian hoặc tiền cần thiết", pattern: "N が かかります / どのくらい かかりますか", explanation: "かかります diễn tả một hành trình hay công việc cần bao nhiêu thời gian hoặc tiền.", example: "きょうとまで さんじかん かかります。", translation: "Đến Kyoto mất ba tiếng.", question: "おおさかまで ＿＿＿ かかりますか。", answer: "どのくらい", choices: ["どのくらい", "いくつ", "だれ", "どんな"] },
  ],
  12: [
    { title: "Quá khứ danh từ và tính từ な", pattern: "N / Aな でした・じゃありませんでした", explanation: "Dùng でした cho quá khứ khẳng định và じゃありませんでした cho quá khứ phủ định.", example: "きのうは あめでした。", translation: "Hôm qua trời mưa.", question: "パーティーは しずか ＿＿＿。", answer: "じゃありませんでした", choices: ["じゃありませんでした", "くなかったです", "ませんでした", "でしたか"] },
    { title: "Quá khứ tính từ い", pattern: "Aかったです・Aくなかったです", explanation: "Đổi い thành かったです; dạng phủ định đổi い thành くなかったです.", example: "りょこうは たのしかったです。", translation: "Chuyến đi đã rất vui.", question: "きのうは さむ ＿＿＿。", answer: "かったです", choices: ["かったです", "いでした", "くないです", "でした"] },
    { title: "So sánh hơn với より", pattern: "A は B より tính từ です", explanation: "Bより nêu tiêu chuẩn so sánh; câu có nghĩa A mang đặc điểm đó hơn B.", example: "とうきょうは おおさかより おおきいです。", translation: "Tokyo lớn hơn Osaka.", question: "ひこうきは しんかんせん ＿＿＿ はやいです。", answer: "より", choices: ["より", "まで", "から", "ほど"] },
    { title: "Chọn một trong hai", pattern: "A と B と どちらが ... / Aのほうが ...", explanation: "どちら hỏi lựa chọn giữa hai đối tượng; のほうが chỉ phía được chọn.", example: "うみと やまと どちらが すきですか。", translation: "Bạn thích biển hay núi hơn?", question: "でんしゃと バスと ＿＿＿が はやいですか。", answer: "どちら", choices: ["どちら", "どれ", "どんな", "どうして"] },
    { title: "So sánh nhất", pattern: "Nhóm で N が いちばん ...", explanation: "で giới hạn phạm vi, いちばん diễn tả mức cao nhất trong nhóm đó.", example: "スポーツで サッカーが いちばん すきです。", translation: "Trong thể thao, tôi thích bóng đá nhất.", question: "きせつ ＿＿＿ はるが いちばん すきです。", answer: "で", choices: ["で", "に", "を", "より"] },
  ],
  13: [
    { title: "Muốn có một vật", pattern: "N が 欲しいです", explanation: "欲しい là tính từ い, dùng が với đồ vật người nói muốn sở hữu.", example: "あたらしい カメラが ほしいです。", translation: "Tôi muốn một máy ảnh mới.", question: "いま じかん ＿＿＿ ほしいです。", answer: "が", choices: ["が", "を", "で", "へ"] },
    { title: "Muốn làm một việc", pattern: "Gốc Vます + たいです", explanation: "Bỏ ます rồi thêm たいです để diễn tả mong muốn thực hiện hành động.", example: "おきなわへ いきたいです。", translation: "Tôi muốn đi Okinawa.", question: "うみで およぎ ＿＿＿。", answer: "たいです", choices: ["たいです", "ほしいです", "ますか", "ましょう"] },
    { title: "Không muốn làm", pattern: "Vたくないです / 何も Vたくないです", explanation: "たい biến đổi như tính từ い; dạng phủ định là たくないです.", example: "なにも たべたくないです。", translation: "Tôi không muốn ăn gì cả.", question: "きょうは なにも し ＿＿＿。", answer: "たくないです", choices: ["たくないです", "ほしくないです", "ませんか", "ないでした"] },
    { title: "Đi đâu để làm gì", pattern: "Địa điểm へ gốc Vます に 行きます", explanation: "Gốc ます + に biểu thị mục đích của 行きます, 来ます hoặc 帰ります.", example: "デパートへ かいものに いきます。", translation: "Tôi đi trung tâm thương mại để mua sắm.", question: "えきへ ともだちを むかえ ＿＿＿ いきます。", answer: "に", choices: ["に", "で", "を", "が"] },
    { title: "Đại từ bất định", pattern: "Từ hỏi + か / Từ hỏi + も + phủ định", explanation: "何か nghĩa là thứ gì đó; 何も đi cùng phủ định mang nghĩa không gì cả.", example: "なにか たべたいです。", translation: "Tôi muốn ăn gì đó.", question: "おなかが いっぱいですから、なに ＿＿＿ たべたくないです。", answer: "も", choices: ["も", "か", "を", "が"] },
  ],
  14: [
    { title: "Thể て của động từ", pattern: "Vます → Vて", explanation: "Thể て là dạng nối quan trọng: 書きます→書いて, 読みます→読んで, 食べます→食べて, します→して.", example: "かきます → かいて", translation: "viết → dạng て", question: "よみます → よ ＿＿＿", answer: "んで", choices: ["んで", "いて", "って", "して"] },
    { title: "Yêu cầu lịch sự", pattern: "Vて ください", explanation: "Thể て + ください dùng để yêu cầu hoặc hướng dẫn người nghe làm một việc.", example: "ちょっと まってください。", translation: "Xin hãy đợi một chút.", question: "ここに なまえを かい ＿＿＿。", answer: "てください", choices: ["てください", "てもいいです", "ています", "てはいけません"] },
    { title: "Hành động đang diễn ra", pattern: "Vて います", explanation: "Vています ở bài này diễn tả hành động đang xảy ra ngay lúc nói.", example: "ミラーさんは でんわを かけています。", translation: "Anh Miller đang gọi điện.", question: "こどもが こうえんで あそん ＿＿＿。", answer: "でいます", choices: ["でいます", "でください", "でもいいです", "ではいけません"] },
    { title: "Đề nghị giúp đỡ", pattern: "Gốc Vます + ましょうか", explanation: "ましょうか dùng khi người nói chủ động đề nghị làm một việc giúp người nghe.", example: "にもつを もちましょうか。", translation: "Tôi cầm hành lý giúp nhé?", question: "タクシーを よび ＿＿＿。", answer: "ましょうか", choices: ["ましょうか", "ませんか", "たいですか", "ていますか"] },
    { title: "Chỉ đường bằng てください", pattern: "まっすぐ行って / 右へ曲がって ください", explanation: "Kết hợp vị trí, hướng đi và thể て để đưa chỉ dẫn đường đi lịch sự.", example: "つぎの こうさてんを みぎへ まがってください。", translation: "Xin hãy rẽ phải ở ngã tư tiếp theo.", question: "しんごうを ＿＿＿ ください。", answer: "わたって", choices: ["わたって", "わたり", "わたります", "わたった"] },
  ],
  15: [
    { title: "Xin phép", pattern: "Vて もいいですか", explanation: "Dùng để hỏi liệu mình thực hiện một hành động có được phép hay không.", example: "ここで しゃしんを とってもいいですか。", translation: "Tôi chụp ảnh ở đây được không?", question: "このパソコンを つかっ ＿＿＿。", answer: "てもいいですか", choices: ["てもいいですか", "てはいけません", "てください", "ています"] },
    { title: "Cho phép", pattern: "Vて もいいです", explanation: "Dạng khẳng định cho biết một hành động được phép thực hiện.", example: "ここに すわってもいいです。", translation: "Bạn có thể ngồi ở đây.", question: "このほんを よん ＿＿＿。", answer: "でもいいです", choices: ["でもいいです", "ではいけません", "でください", "でいます"] },
    { title: "Cấm đoán", pattern: "Vて はいけません", explanation: "Dùng khi quy tắc hoặc hoàn cảnh không cho phép thực hiện hành động.", example: "ここで たばこを すってはいけません。", translation: "Không được hút thuốc ở đây.", question: "ここに くるまを とめ ＿＿＿。", answer: "てはいけません", choices: ["てはいけません", "てもいいです", "てください", "ています"] },
    { title: "Trạng thái tiếp diễn", pattern: "住んで / 結婚して / 持って / 知って います", explanation: "Vています cũng diễn tả trạng thái hiện tại hình thành sau một thay đổi, như cư trú, kết hôn, sở hữu hay biết.", example: "おおさかに すんでいます。", translation: "Tôi sống ở Osaka.", question: "たなかさんは くるまを もっ ＿＿＿。", answer: "ています", choices: ["ています", "てください", "てもいいです", "てはいけません"] },
    { title: "Nghề nghiệp và hoạt động thường xuyên", pattern: "Nơi で Vて います", explanation: "Vています có thể nói công việc hoặc hoạt động được duy trì thường xuyên.", example: "だいがくで えいごを おしえています。", translation: "Tôi dạy tiếng Anh tại đại học.", question: "ちちは ぎんこうで はたらい ＿＿＿。", answer: "ています", choices: ["ています", "てください", "たいです", "ましたか"] },
  ],
  ...grammarPoints16to25,
};

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function requestAiChat(payload: {
  messages: Array<{ role: AiChatRole; content: string }>;
  lesson_title?: string | null;
  lesson_description?: string | null;
}): Promise<AiChatResponse> {
  const response = await fetch(`${API_BASE}/ai-chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`AI chat error ${response.status}`);
  }
  return response.json() as Promise<AiChatResponse>;
}

async function streamAiChat(
  payload: {
    messages: Array<{ role: AiChatRole; content: string }>;
    lesson_title?: string | null;
    lesson_description?: string | null;
  },
  onChunk: (chunk: string, fullText: string) => void,
): Promise<AiChatResponse> {
  const response = await fetch(`${API_BASE}/ai-chat/stream`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI chat stream error ${response.status}`);
  }

  if (!response.body) {
    const fallback = await requestAiChat(payload);
    onChunk(fallback.reply, fallback.reply);
    return fallback;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (!chunk) continue;
    fullText += chunk;
    onChunk(chunk, fullText);
  }

  const tail = decoder.decode();
  if (tail) {
    fullText += tail;
    onChunk(tail, fullText);
  }

  return {
    reply: fullText.trim(),
    source: response.headers.get("x-ai-source") ?? "gemini-stream",
  };
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

function AppHeader({
  onHome,
  theme,
  onToggleTheme,
  showFurigana,
  onToggleFurigana,
}: {
  onHome: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  showFurigana: boolean;
  onToggleFurigana: () => void;
}) {
  const isDark = theme === "dark";
  const importInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="siteHeader">
      <button className="brandButton" onClick={onHome} aria-label="Về trang chủ">
        <Brand />
      </button>
      <div className="headerActions">
        <nav aria-label="Điều hướng chính">
          <a href="#lessons">50 bài học</a>
          <span className="navDot" />
          <span>Chunking method</span>
        </nav>
        <button
          className="themeToggle"
          type="button"
          onClick={onToggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? "Chuyen sang giao dien sang" : "Chuyen sang giao dien toi"}
        >
          <span className="themeToggleTrack" aria-hidden="true">
            <span className="themeToggleThumb">{isDark ? "\u263e" : "\u2600"}</span>
          </span>
          <span className="themeToggleText">{isDark ? "Dark" : "Light"}</span>
        </button>
        <button
          className="themeToggle furiganaToggle"
          type="button"
          onClick={onToggleFurigana}
          aria-pressed={showFurigana}
          aria-label={showFurigana ? "An Furigana" : "Hien Furigana"}
        >
          <span className="themeToggleTrack" aria-hidden="true">
            <span className="themeToggleThumb">{showFurigana ? "あ" : "A"}</span>
          </span>
          <span className="themeToggleText">Furigana</span>
        </button>
        <button
          className="themeToggle"
          type="button"
          onClick={exportUserData}
          aria-label="Tải bản sao lưu dữ liệu học"
          title="Tải bản sao lưu (Export)"
        >
          <span aria-hidden="true">⇩</span>
          <span className="themeToggleText">Tải bản sao lưu</span>
        </button>
        <button
          className="themeToggle"
          type="button"
          onClick={() => importInputRef.current?.click()}
          aria-label="Nhập dữ liệu học từ file sao lưu"
          title="Nhập dữ liệu (Import)"
        >
          <span aria-hidden="true">⇧</span>
          <span className="themeToggleText">Nhập dữ liệu</span>
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept=".json,application/json"
          onChange={importUserData}
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </header>
  );
}

function Dashboard({
  onSelect,
  onQuestionWords,
  onJlptPractice,
  onN5Conjugation,
}: {
  onSelect: (lesson: Lesson) => void;
  onQuestionWords: () => void;
  onJlptPractice: () => void;
  onN5Conjugation: () => void;
}) {
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
            <span>50 BÀI · 9 CÁCH HỌC</span>
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
            const available = lesson.id in authoredSentenceCounts;
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
        <section className="specialLesson" aria-labelledby="special-lesson-title">
          <div className="specialLessonCopy">
            <span className="sectionKicker">BÀI ĐẶC BIỆT · NGOÀI 50 BÀI</span>
            <h3 id="special-lesson-title">Từ để hỏi</h3>
            <p>
              Luyện 22 từ nghi vấn qua {questionWordItems.length} câu hỏi về
              người, nơi chốn, thời gian, giá tiền, phương tiện và lý do.
            </p>
          </div>
          <div className="specialQuestionMark" aria-hidden="true">何</div>
          <button className="specialLessonButton" onClick={onQuestionWords}>
            HỌC {questionWordItems.length} CÂU HỎI <ArrowIcon />
          </button>
        </section>
        <section className="specialLesson jlptSpecialLesson" aria-labelledby="jlpt-practice-title">
          <div className="specialLessonCopy">
            <span className="sectionKicker">LUYỆN ĐỀ N5 · NGOÀI 50 BÀI</span>
            <h3 id="jlpt-practice-title">Luyện kỹ năng JLPT và đề thi thử</h3>
            <p>
              Clone cấu trúc gồm {jlptPracticeStats.skillGroups} nhóm kỹ năng,
              {jlptPracticeStats.skillTests} đề nhỏ và {jlptPracticeStats.mockTests} đề thi thử.
              Dữ liệu mẫu là bộ câu hỏi gốc để bạn thay bằng nội dung hợp lệ khi có file.
            </p>
          </div>
          <div className="specialQuestionMark jlptMark" aria-hidden="true">試</div>
          <button className="specialLessonButton" onClick={onJlptPractice}>
            MỞ {jlptPracticeStats.totalTests} ĐỀ <ArrowIcon />
          </button>
        </section>
        <section className="specialLesson conjugationSpecialLesson" aria-labelledby="n5-conjugation-home-title">
          <div className="specialLessonCopy">
            <span className="sectionKicker">CHIA THỂ N5 · NGOÀI 50 BÀI</span>
            <h3 id="n5-conjugation-home-title">Chia thể từ vựng N5</h3>
            <p>
              Luyện {n5ConjugationItems.length} câu chia thể cho động từ, tính từ い và tính từ な:
              ます/ません/ました/ませんでした, 辞書形, てください, てもいいです,
              てはいけません, ています và ないでください.
            </p>
          </div>
          <div className="specialQuestionMark conjugationMark" aria-hidden="true">活</div>
          <button className="specialLessonButton" onClick={onN5Conjugation}>
            LUYỆN {n5ConjugationItems.length} CÂU <ArrowIcon />
          </button>
        </section>
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
  const coreModes = modes.filter((mode) =>
    mode.id === "vocabulary" || mode.id === "grammar",
  );
  const practiceModes = modes.filter((mode) =>
    mode.id !== "vocabulary" && mode.id !== "grammar",
  );

  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [passageCount, setPassageCount] = useState(0);

  useEffect(() => {
    requestJson<Lesson>(`/lessons/${lesson.id}`)
      .then(setDetail)
      .catch(() => setDetail(lesson));
    requestJson<Sentence[]>(`/lessons/${lesson.id}/sentences`)
      .then(setSentences)
      .catch(() => {});
    requestJson<Passage[]>(`/lessons/${lesson.id}/passages`)
      .then((data) => setPassageCount(data.length))
      .catch(() => setPassageCount(lesson.passage_count ?? 0));
  }, [lesson]);

  const vocabularyItems = useMemo(() => buildVocabularyItems(sentences), [sentences]);
  const dueSentences = sentences.filter(s => isDueForReview("sentence_" + s.id));
  const dueVocab = vocabularyItems.filter(v => isDueForReview("vocab_" + v.id));
  const dueCount = dueSentences.length + dueVocab.length;
  const kanjiSentenceCount = sentences.filter((sentence) =>
    containsKanji(sentence.full_japanese),
  ).length;
  const audioMatchCount = buildAudioMatchChunks(sentences).length;
  const grammarCount = (grammarPoints[lesson.id] ?? []).length;
  const kanjiWordCount = (kanjiVocabulary[lesson.id] ?? []).length;
  const sentenceCount = detail.sentence_count ?? authoredSentenceCounts[lesson.id] ?? sentences.length;
  const modeCounts: Partial<Record<ModeId, number>> = {
    vocabulary: vocabularyItems.length,
    grammar: grammarCount,
    cloze: sentenceCount,
    scramble: sentenceCount,
    dictation: sentenceCount,
    "audio-match": audioMatchCount,
    reading: passageCount,
    kanji: kanjiSentenceCount,
    "kanji-words": kanjiWordCount,
    "kanji-writing": kanjiWordCount,
    review: dueCount,
  };
  const renderModeTitle = (mode: (typeof modes)[number]) => (
    <>
      {mode.title}
      <span
        aria-label={`${modeCounts[mode.id] ?? 0} mục`}
        style={{
          marginLeft: 8,
          color: "var(--muted)",
          fontFamily: '"Aptos", "Segoe UI", Arial, sans-serif',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: "0.02em",
          verticalAlign: "middle",
        }}
      >
        ({modeCounts[mode.id] ?? 0})
      </span>
    </>
  );

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
        <div className="lessonStats" style={{ display: 'flex', alignItems: 'center' }}>
          <div><strong>{detail.sentence_count ?? authoredSentenceCounts[lesson.id] ?? 0}</strong><span>CÂU MẪU</span></div>
          <div><strong>9</strong><span>CHẾ ĐỘ</span></div>
          {dueCount > 0 && (
            <button className="primaryButton" style={{ marginLeft: "auto", padding: "0 20px" }} onClick={() => onMode("review")}>
              Ôn tập ngay ({dueCount})
            </button>
          )}
        </div>
      </section>

      <section className="modeSection" aria-labelledby="mode-title">
        <div className="modeHeading">
          <span className="sectionKicker">NỘI DUNG CỐT LÕI</span>
          <h2 id="mode-title">Bạn muốn học phần nào?</h2>
        </div>
        <div className="studyPathGrid">
          {coreModes.map((mode) => (
            <button
              key={mode.id}
              className={`studyPathCard ${mode.accent}`}
              onClick={() => onMode(mode.id)}
            >
              <span className="studyPathGlyph">{mode.glyph}</span>
              <div>
                <span>{mode.japanese}</span>
                <h3>{renderModeTitle(mode)}</h3>
                <p>{mode.description}</p>
              </div>
              <span className="studyPathArrow"><ArrowIcon /></span>
            </button>
          ))}
        </div>
        <div className="modeHeading activityHeading">
          <span className="sectionKicker">LUYỆN TẬP BỔ TRỢ</span>
          <h2>Chọn cách luyện tiếp theo</h2>
        </div>
        <div className="modeGrid">
          {practiceModes.map((mode) => (
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
                <h3>{renderModeTitle(mode)}</h3>
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

function EmptyPractice({
  onBack,
  modeId,
}: {
  onBack: () => void;
  modeId: ModeId;
}) {
  const isKanji =
    modeId === "kanji" ||
    modeId === "kanji-words" ||
    modeId === "kanji-writing";
  return (
    <div className="emptyPractice">
      <span className="emptyGlyph">{isKanji ? "漢" : "準"}</span>
      <h2>{isKanji ? "Bài này chưa có Kanji" : "Nội dung đang được chuẩn bị"}</h2>
      <p>
        {isKanji
          ? "Bài này chưa có dữ liệu Kanji phù hợp. Hãy chọn một bài đã có nội dung để luyện."
          : "Hiện có bài luyện đầy đủ cho Bài 1–25. API đã sẵn sàng để bạn thêm dữ liệu cho bài này."}
      </p>
      <button className="secondaryButton" onClick={onBack}>Chọn chế độ khác</button>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent =
    total > 0
      ? Math.min(100, Math.max(0, ((current + 1) / total) * 100))
      : 0;

  return (
    <div
      className="progressBar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
    >
      <span style={{ width: `${percent}%` }} />
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
        <ProgressBar current={current} total={total} />
      </div>
    </div>
  );
}

function ExerciseNav({
  index,
  total,
  onPrevious,
  onNext,
  onShuffle,
}: {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
}) {
  return (
    <div className="exerciseNav">
      <button
        className="navStepButton previousStep"
        type="button"
        onClick={onPrevious}
        disabled={index === 0}
      >
        ← Câu trước
      </button>
      <div className="progressDots" aria-label={`Câu ${index + 1} trên ${total}`}>
        {total > 30 ? (
          <span
            className="longProgress"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        ) : (
          Array.from({ length: total }, (_, dot) => (
            <span key={dot} className={dot === index ? "active" : dot < index ? "done" : ""} />
          ))
        )}
      </div>
      <button className="shuffleOrderButton" onClick={onShuffle} type="button" aria-label="Trộn ngẫu nhiên thứ tự bài luyện">
        ↻ Ngẫu nhiên
      </button>
      <button
        className="navStepButton nextStep"
        type="button"
        onClick={onNext}
        disabled={index >= total - 1}
      >
        Câu tiếp →
      </button>
    </div>
  );
}

function shuffledOrder(total: number, current: number[] = []) {
  const next = Array.from({ length: total }, (_, itemIndex) => itemIndex);
  for (let cursor = next.length - 1; cursor > 0; cursor -= 1) {
    const randomIndex = Math.floor(Math.random() * (cursor + 1));
    [next[cursor], next[randomIndex]] = [next[randomIndex], next[cursor]];
  }
  const unchanged =
    total > 1 &&
    current.length === total &&
    next.every((value, itemIndex) => value === current[itemIndex]);
  if (unchanged) next.push(next.shift() as number);
  return next;
}

function shuffleArray<T>(items: T[]) {
  const next = [...items];
  for (let cursor = next.length - 1; cursor > 0; cursor -= 1) {
    const randomIndex = Math.floor(Math.random() * (cursor + 1));
    [next[cursor], next[randomIndex]] = [next[randomIndex], next[cursor]];
  }
  return next;
}

function buildAudioMatchChunks(sentences: Sentence[]) {
  return sentences
    .flatMap((sentence) =>
      [...sentence.chunks]
        .sort((a, b) => a.order_index - b.order_index)
        .map((chunk) => ({ ...chunk })),
    )
    .filter((chunk) => chunk.japanese.trim().length > 0);
}

function isTextEntryTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(
    element?.isContentEditable ||
      element?.closest("input, textarea, select, [contenteditable='true']"),
  );
}

function speakJapaneseText(text: string, rate = 0.82) {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    !("SpeechSynthesisUtterance" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function speakAiText(text: string) {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    !("SpeechSynthesisUtterance" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();
  const japaneseCharacters = text.match(/[\u3040-\u30ff\u3400-\u9fff]/gu)?.length ?? 0;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = japaneseCharacters > text.length * 0.35 ? "ja-JP" : "vi-VN";
  utterance.rate = 0.96;
  window.speechSynthesis.speak(utterance);
}

function shouldUseEnterShortcut(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;
  const interactiveParent = target?.closest("button, a, select, [role='button']");

  return (
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.isComposing &&
    event.keyCode !== 229 &&
    !target?.isContentEditable &&
    (!interactiveParent || interactiveParent.classList.contains("checkButton"))
  );
}

function useEnterShortcut(onEnter: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!shouldUseEnterShortcut(event)) return;
      event.preventDefault();
      onEnter();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onEnter]);
}

function useAutoAdvanceOnCorrect(isCorrect: boolean, onAdvance: () => void) {
  useEffect(() => {
    if (!isCorrect) return;

    const timer = window.setTimeout(onAdvance, AUTO_ADVANCE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isCorrect, onAdvance]);
}

function useResetShortcut(onReset: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.shiftKey ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing ||
        event.keyCode === 229
      ) {
        return;
      }

      const resetByEscape = event.key === "Escape";
      const resetByR = event.key.toLocaleLowerCase() === "r" && !isTextEntryTarget(event.target);
      if (!resetByEscape && !resetByR) return;

      event.preventDefault();
      onReset();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onReset]);
}

function ClozeMode({
  sentence,
  onAdvance,
}: {
  sentence: Sentence;
  onAdvance: () => void;
}) {
  const shortcutAreaRef = useRef<HTMLDivElement>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [autoAdvanceReady, setAutoAdvanceReady] = useState(false);
  const keyChunks = sentence.chunks.filter((chunk) => chunk.is_grammar_key);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, [sentence.id]);

  const reset = useCallback(() => {
    setAnswers({});
    setFeedback(null);
    setShowAnswer(false);
    setAutoAdvanceReady(false);
    window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
  }, []);

  const check = () => {
    const correct = keyChunks.every((chunk) =>
      matchesJapaneseAnswer(answers[chunk.id] ?? "", chunk.japanese, chunk.kanji_variants),
    );
    setFeedback(
      correct
        ? { kind: "success", message: "Bạn đã đặt đúng mảnh ngữ pháp vào câu." }
        : { kind: "error", message: "Hãy nhìn nghĩa tiếng Việt và thử lại từng ký tự." },
    );
    setAutoAdvanceReady(correct);
    if (correct) {
      window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
    }
  };

  const handleEnter = useCallback(() => {
    if (feedback?.kind === "success") {
      onAdvance();
      return;
    }
    check();
  }, [feedback?.kind, onAdvance, check]);

  useEnterShortcut(handleEnter);
  useResetShortcut(reset);
  useAutoAdvanceOnCorrect(autoAdvanceReady, onAdvance);

  const toggleAnswer = () => {
    const nextShowAnswer = !showAnswer;
    setShowAnswer(nextShowAnswer);

    if (nextShowAnswer) {
      setAutoAdvanceReady(false);
      const revealedAnswers = keyChunks.reduce<Record<number, string>>((result, chunk) => {
        result[chunk.id] = chunk.japanese;
        return result;
      }, {});
      setAnswers(revealedAnswers);
      setFeedback({
        kind: "success",
        message: `Đáp án: ${keyChunks.map((chunk) => chunk.japanese).join(" · ")}. Bấm “Ẩn đáp án” để tự làm lại.`,
      });
      window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
      return;
    }

    setAnswers({});
    setFeedback(null);
    setAutoAdvanceReady(false);
  };

  return (
    <div className="exerciseContent" ref={shortcutAreaRef} tabIndex={-1}>
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
                setAutoAdvanceReady(false);
              }}
              style={{ width: `${Math.max(4, chunk.japanese.length + 1)}em` }}
              aria-label={`Điền cụm còn thiếu: ${chunk.vietnamese}`}
              autoComplete="off"
              placeholder="Nhập Hiragana/Katakana..."
              readOnly={showAnswer}
              className={showAnswer ? "revealedAnswer" : undefined}
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
      {feedback && (
        <div className="hintLine clozeResultMeaning">
          <span>NGHĨA CẢ CÂU</span>
          {sentence.full_vietnamese}
        </div>
      )}
      <div className="clozeActions">
        <button
          className="answerButton listenSentenceButton"
          type="button"
          onClick={() => speakJapaneseText(sentence.full_japanese)}
          aria-label="Đọc toàn bộ câu tiếng Nhật, bao gồm phần đang bị ẩn"
        >
          Đọc cả câu
          <span aria-hidden="true">🔊</span>
        </button>
        <button
          className="answerButton"
          type="button"
          onClick={toggleAnswer}
          aria-pressed={showAnswer}
        >
          {showAnswer ? "Ẩn đáp án" : "Xem đáp án"}
          <span aria-hidden="true">{showAnswer ? "×" : "目"}</span>
        </button>
        <button className="answerButton" type="button" onClick={reset}>
          Làm lại
          <span aria-hidden="true">Esc</span>
        </button>
        <button className="checkButton" type="button" onClick={check}>
          Kiểm tra đáp án <span>↵</span>
        </button>
      </div>
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

function ScrambleMode({
  sentence,
  onAdvance,
}: {
  sentence: Sentence;
  onAdvance: () => void;
}) {
  const shortcutAreaRef = useRef<HTMLDivElement>(null);
  const [bank, setBank] = useState<Chunk[]>(() => shuffleChunks(sentence.chunks));
  const [answer, setAnswer] = useState<Chunk[]>([]);
  const [dragged, setDragged] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [autoAdvanceReady, setAutoAdvanceReady] = useState(false);
  // Only reveal Vietnamese translations after a correct answer
  const [showVietnamese, setShowVietnamese] = useState(false);

  const reset = useCallback(() => {
    setBank(shuffleChunks(sentence.chunks));
    setAnswer([]);
    setFeedback(null);
    setAutoAdvanceReady(false);
    setShowVietnamese(false);
  }, [sentence]);

  const resetAnswer = useCallback(() => {
    setBank((currentBank) => [...currentBank, ...answer]);
    setAnswer([]);
    setFeedback(null);
    setAutoAdvanceReady(false);
    setShowVietnamese(false);
    window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
  }, [answer]);

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
    setAutoAdvanceReady(false);
    window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
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
    if (correct) {
      setShowVietnamese(true);
      window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
    }
    setFeedback(
      correct
        ? { kind: "success", message: "Nhịp câu đã đúng. Hãy đọc thành tiếng một lần nữa." }
        : { kind: "error", message: "Thứ tự chưa khớp. Chú ý trợ từ và phần kết câu." },
    );
    setAutoAdvanceReady(correct);
  };

  const handleEnter = useCallback(() => {
    if (feedback?.kind === "success") {
      onAdvance();
      return;
    }
    check();
  }, [feedback?.kind, onAdvance, check]);

  useEnterShortcut(handleEnter);
  useResetShortcut(resetAnswer);
  useAutoAdvanceOnCorrect(autoAdvanceReady, onAdvance);

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
      {/* Only show Vietnamese translation after a correct answer */}
      {showVietnamese && <small>{chunk.vietnamese}</small>}
    </button>
  );

  return (
    <div className="exerciseContent scrambleContent" ref={shortcutAreaRef} tabIndex={-1}>
      <div className="promptBlock compact">
        <span className="promptLabel">SẮP XẾP THÀNH CÂU</span>
        <p>{sentence.full_vietnamese}</p>
      </div>
      <div className="dropGroup">
        <div className="zoneLabel">
          <span>CÂU CỦA BẠN</span>
          <small>Kéo hoặc chạm để sắp xếp</small>
          <button type="button" onClick={resetAnswer}>Làm lại Esc</button>
        </div>
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
    .trim()
    .toLocaleLowerCase("ja");
}

function getJapaneseAnswerVariants(primary: string, variants?: string | null) {
  const candidates = [
    primary,
    ...(variants
      ?.split(/[,，]/)
      .map((variant) => variant.trim())
      .filter(Boolean) ?? []),
  ];

  return Array.from(
    new Set(candidates.map((candidate) => normalizeJapanese(candidate)).filter(Boolean)),
  );
}

function matchesJapaneseAnswer(input: string, primary: string, variants?: string | null) {
  const normalizedInput = normalizeJapanese(input);
  return getJapaneseAnswerVariants(primary, variants).includes(normalizedInput);
}

function findBestInputMatches(inputTokens: string[], targetTokens: string[]) {
  const inputLength = inputTokens.length;
  const targetLength = targetTokens.length;
  const scores = Array.from({ length: inputLength + 1 }, () =>
    Array.from({ length: targetLength + 1 }, () => 0),
  );

  for (let inputIndex = inputLength - 1; inputIndex >= 0; inputIndex -= 1) {
    for (let targetIndex = targetLength - 1; targetIndex >= 0; targetIndex -= 1) {
      scores[inputIndex][targetIndex] =
        inputTokens[inputIndex] === targetTokens[targetIndex]
          ? scores[inputIndex + 1][targetIndex + 1] + 1
          : Math.max(
              scores[inputIndex + 1][targetIndex],
              scores[inputIndex][targetIndex + 1],
            );
    }
  }

  const matches = new Set<number>();
  let inputIndex = 0;
  let targetIndex = 0;
  while (inputIndex < inputLength && targetIndex < targetLength) {
    if (
      inputTokens[inputIndex] === targetTokens[targetIndex] &&
      scores[inputIndex][targetIndex] ===
        scores[inputIndex + 1][targetIndex + 1] + 1
    ) {
      matches.add(inputIndex);
      inputIndex += 1;
      targetIndex += 1;
      continue;
    }

    if (
      scores[inputIndex + 1][targetIndex] >=
      scores[inputIndex][targetIndex + 1]
    ) {
      inputIndex += 1;
    } else {
      targetIndex += 1;
    }
  }

  return matches;
}

function buildDictationReviewMarks(input: string, sentence: Sentence) {
  const inputCharacters = Array.from(input);
  const meaningfulInput = inputCharacters.reduce<string[]>((result, character) => {
    const normalizedCharacter = normalizeJapanese(character);
    if (normalizedCharacter) result.push(normalizedCharacter);
    return result;
  }, []);
  const targets = getJapaneseAnswerVariants(
    sentence.full_japanese,
    sentence.kanji_variants,
  );
  const bestMatches = targets.reduce(
    (best, target) => {
      const matches = findBestInputMatches(meaningfulInput, Array.from(target));
      return matches.size > best.size ? matches : best;
    },
    new Set<number>(),
  );
  let meaningfulIndex = 0;

  return inputCharacters.map((character) => {
    const normalizedCharacter = normalizeJapanese(character);
    if (!normalizedCharacter) {
      return { character, state: "neutral" as const };
    }

    const state = bestMatches.has(meaningfulIndex) ? "correct" : "wrong";
    meaningfulIndex += 1;
    return { character, state };
  });
}

function DictationMode({
  sentence,
  onAdvance,
}: {
  sentence: Sentence;
  onAdvance: () => void;
}) {
  const shortcutAreaRef = useRef<HTMLDivElement>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [autoAdvanceReady, setAutoAdvanceReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reviewMarks = useMemo(
    () => buildDictationReviewMarks(answer, sentence),
    [answer, sentence],
  );

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
    setShowCorrectAnswer(false);
    const correct = matchesJapaneseAnswer(
      answer,
      sentence.full_japanese,
      sentence.kanji_variants,
    );
    setFeedback(
      correct
        ? { kind: "success", message: "Bạn đã nghe đúng toàn bộ câu." }
        : { kind: "error", message: "Nghe lại ở tốc độ chậm và kiểm tra các trợ từ." },
    );
    setAutoAdvanceReady(correct);
    if (correct) {
      window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
    }
  };

  const handleEnter = useCallback(() => {
    if (feedback?.kind === "success") {
      onAdvance();
      return;
    }
    check();
  }, [feedback?.kind, onAdvance, check]);

  useEnterShortcut(handleEnter);
  useAutoAdvanceOnCorrect(autoAdvanceReady, onAdvance);

  return (
    <div className="exerciseContent dictationContent" ref={shortcutAreaRef} tabIndex={-1}>
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
          onChange={(event) => {
            setAnswer(event.target.value);
            setFeedback(null);
            setShowCorrectAnswer(false);
            setAutoAdvanceReady(false);
          }}
          placeholder="Nhập bằng Hiragana/Katakana..."
          lang="ja"
          rows={3}
        />
      </label>
      <div className="hintLine"><span>NGHĨA</span>{sentence.full_vietnamese}</div>
      <FeedbackBanner feedback={feedback} />
      {feedback && answer.trim() && (
        <div className="dictationReview" aria-label="Phần bạn nhập được tô màu theo độ chính xác">
          <span>PHẦN BẠN NHẬP</span>
          <div className="dictationReviewText" lang="ja">
            {reviewMarks.map((mark, index) => (
              <span
                key={`${mark.character}-${index}`}
                className={`dictationReviewChar ${mark.state}`}
              >
                {mark.character}
              </span>
            ))}
          </div>
          <small>Phần khớp với câu đúng được tô xanh; phần chưa khớp được tô đỏ.</small>
        </div>
      )}
      {feedback?.kind === "error" && showCorrectAnswer && (
        <div className="hintLine dictationCorrectAnswer">
          <span>ĐÁP ÁN ĐÚNG</span>
          <strong>
            <span lang="ja">{sentence.full_japanese}</span>
            <small>{sentence.full_romaji}</small>
          </strong>
        </div>
      )}
      <div className="clozeActions">
        {feedback?.kind === "error" && (
          <button
            className="answerButton"
            type="button"
            onClick={() => setShowCorrectAnswer((current) => !current)}
            aria-pressed={showCorrectAnswer}
          >
            {showCorrectAnswer ? "Ẩn đáp án đúng" : "Hiển thị đáp án đúng"}
            <span aria-hidden="true">{showCorrectAnswer ? "×" : "目"}</span>
          </button>
        )}
        <button className="checkButton" type="button" onClick={check}>Kiểm tra chính tả <span>↵</span></button>
      </div>
    </div>
  );
}

function AudioMatchMode({
  chunk,
  chunks,
  onAdvance,
}: {
  chunk: Chunk;
  chunks: Chunk[];
  onAdvance: () => void;
}) {
  const shortcutAreaRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const targetKey = normalizeJapanese(chunk.japanese);
  const done = selectedOption !== null;
  const selectedCorrect =
    selectedOption !== null && normalizeJapanese(selectedOption) === targetKey;
  const options = useMemo(() => {
    const seen = new Set<string>([targetKey]);
    const distractors = shuffleArray(chunks)
      .filter((candidate) => {
        const candidateKey = normalizeJapanese(candidate.japanese);
        if (!candidateKey || seen.has(candidateKey)) return false;
        seen.add(candidateKey);
        return true;
      })
      .slice(0, 3)
      .map((candidate) => candidate.japanese);

    return shuffleArray([chunk.japanese, ...distractors]);
  }, [chunk.japanese, chunks, targetKey]);

  const play = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(chunk.japanese);
    utterance.lang = "ja-JP";
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  }, [chunk.japanese]);

  const choose = useCallback(
    (option: string) => {
      if (done) return;
      setSelectedOption(option);
      window.requestAnimationFrame(() => shortcutAreaRef.current?.focus());
    },
    [done],
  );

  useEffect(() => {
    setSelectedOption(null);
    const playTimer = window.setTimeout(play, 220);
    return () => {
      window.clearTimeout(playTimer);
      window.speechSynthesis?.cancel();
    };
  }, [chunk.id, play]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        isTextEntryTarget(event.target) ||
        event.shiftKey ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing ||
        event.keyCode === 229
      ) {
        return;
      }

      if (/^[1-4]$/.test(event.key)) {
        const option = options[Number(event.key) - 1];
        if (option && !done) {
          event.preventDefault();
          choose(option);
        }
        return;
      }

      if (event.key === "Enter" && done) {
        event.preventDefault();
        onAdvance();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [choose, done, onAdvance, options]);

  useAutoAdvanceOnCorrect(selectedCorrect, onAdvance);

  const feedback: Feedback =
    selectedOption === null
      ? null
      : selectedCorrect
        ? {
            kind: "success",
            message: `Đúng rồi. ${chunk.japanese} = ${chunk.vietnamese}`,
          }
        : {
            kind: "error",
            message: `Chưa đúng. Đáp án là ${chunk.japanese} = ${chunk.vietnamese}`,
          };

  return (
    <div className="exerciseContent dictationContent" ref={shortcutAreaRef} tabIndex={-1}>
      <div className="audioStage">
        <div className="soundRings" aria-hidden="true"><i /><i /><i /></div>
        <button className="playButton" onClick={play} type="button" aria-label="Nghe lại mảnh câu tiếng Nhật">🔊</button>
        <div>
          <span className="promptLabel">NGHE VÀ CHỌN MẢNH GHÉP</span>
          <p>Nghe âm thanh, chọn đúng chữ Nhật. Phím tắt: 1–4 để chọn, Enter để sang câu tiếp.</p>
        </div>
      </div>

      <div className="questionWordOptions" role="group" aria-label="Các lựa chọn mảnh ghép tiếng Nhật">
        {options.map((option, optionIndex) => {
          const isCorrectOption = normalizeJapanese(option) === targetKey;
          const isSelected = selectedOption === option;
          const stateClass = done
            ? isCorrectOption
              ? "correct"
              : isSelected
                ? "wrong"
                : ""
            : "";

          return (
            <button
              key={option}
              className={`questionWordOption ${stateClass}`}
              type="button"
              onClick={() => choose(option)}
              aria-pressed={isSelected}
              aria-label={`Lựa chọn ${optionIndex + 1}: ${option}`}
            >
              <span>{optionIndex + 1}</span>
              <strong lang="ja">{option}</strong>
            </button>
          );
        })}
      </div>

      <FeedbackBanner feedback={feedback} />
      {done && (
        <>
          <div className="hintLine">
            <span>NGHĨA</span>
            {chunk.vietnamese}
          </div>
          <button className="checkButton" type="button" onClick={onAdvance}>
            Câu tiếp <span>↵</span>
          </button>
        </>
      )}
    </div>
  );
}

function ReadingMode({
  passage,
  showFurigana,
}: {
  passage: Passage;
  showFurigana: boolean;
}) {
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
                {part.furigana ? (
                  <ruby>
                    {part.text}
                    {showFurigana && <rt>{part.furigana}</rt>}
                  </ruby>
                ) : (
                  part.text
                )}
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

function containsKanji(value: string) {
  return /[\u3400-\u9fff]/u.test(value);
}

const KATAKANA_ROMAJI_WORDS = new Set([
  "basu",
  "betonamu",
  "boorupen",
  "chokoreeto",
  "depaato",
  "doitsu",
  "erebeetaa",
  "esukareetaa",
  "kaado",
  "kaban",
  "kamera",
  "konpyuutaa",
  "koohii",
  "miraa",
  "nekutai",
  "nooto",
  "penshiru",
  "rajio",
  "rekoodaa",
  "robii",
  "shaapu",
  "suupaa",
  "tabako",
  "takushii",
  "teepu",
  "terebi",
  "terehon",
  "toire",
  "wain",
]);

const ROMAJI_KANA: Record<string, string> = {
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ",
  sya: "しゃ", syu: "しゅ", syo: "しょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ",
  cya: "ちゃ", cyu: "ちゅ", cyo: "ちょ",
  jya: "じゃ", jyu: "じゅ", jyo: "じょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ",
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
  shi: "し", chi: "ち", tsu: "つ", fu: "ふ", ji: "じ",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  sa: "さ", su: "す", se: "せ", so: "そ",
  za: "ざ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ta: "た", te: "て", to: "と",
  da: "だ", de: "で", do: "ど",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", he: "へ", ho: "ほ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を",
  a: "あ", i: "い", u: "う", e: "え", o: "お",
};

function toKatakana(value: string) {
  return value.replace(/[ぁ-ゖ]/gu, (character) =>
    String.fromCharCode(character.charCodeAt(0) + 0x60),
  );
}

function romajiWordToKana(value: string, katakana: boolean) {
  const source = value
    .toLocaleLowerCase("en")
    .replaceAll("ā", "aa")
    .replaceAll("ī", "ii")
    .replaceAll("ū", "uu")
    .replaceAll("ē", "ee")
    .replaceAll("ō", "ou");
  let result = "";
  let cursor = 0;

  while (cursor < source.length) {
    const current = source[cursor];
    const next = source[cursor + 1];

    if (katakana && /[aeiou]/u.test(current) && current === source[cursor - 1]) {
      result += "ー";
      cursor += 1;
      continue;
    }
    if (current === next && /[bcdfghjklmpqrstvwxyz]/u.test(current) && current !== "n") {
      result += "っ";
      cursor += 1;
      continue;
    }
    if (
      current === "n" &&
      (cursor === source.length - 1 || next === "n" || !/[aeiouy]/u.test(next))
    ) {
      result += "ん";
      cursor += 1;
      continue;
    }

    const match = [3, 2, 1]
      .map((length) => source.slice(cursor, cursor + length))
      .find((part) => ROMAJI_KANA[part]);
    if (match) {
      result += ROMAJI_KANA[match];
      cursor += match.length;
    } else {
      result += current;
      cursor += 1;
    }
  }

  return katakana ? toKatakana(result) : result;
}

function romajiToMixedKana(value: string) {
  return value.replace(/[A-Za-zĀĪŪĒŌāīūēō]+/gu, (word) => {
    if (/^[A-Z]{2,}$/u.test(word)) return word;
    const normalized = word.toLocaleLowerCase("en");
    return romajiWordToKana(word, KATAKANA_ROMAJI_WORDS.has(normalized));
  });
}

type HanziCharacterData = {
  strokes: string[];
  medians: number[][][];
  radStrokes?: number[];
};

const HANZI_WRITER_DATA_BASE_PATH = "/hanzi-writer-data";
const hanziCharacterDataCache = new Map<string, Promise<HanziCharacterData>>();

const JAPANESE_KANJI_DATA_ALIASES: Record<string, string[]> = {
  会: ["會"],
  体: ["體"],
  写: ["寫"],
  国: ["國"],
  図: ["圖"],
  学: ["學"],
  広: ["廣"],
  気: ["氣"],
  点: ["點"],
  発: ["發"],
  売: ["賣"],
  楽: ["樂"],
  駅: ["驛"],
  読: ["讀"],
  雑: ["雜", "杂"],
};

function extractKanjiCharacters(value: string) {
  return Array.from(new Set(value.match(/[\u3400-\u9fff]/gu) ?? []));
}

function buildKanjiWritingCandidates(value: string) {
  const kanjiCharacters = extractKanjiCharacters(value);
  const candidates: string[] = [];

  for (const kanji of kanjiCharacters) {
    candidates.push(kanji);
    candidates.push(...(JAPANESE_KANJI_DATA_ALIASES[kanji] ?? []));
  }

  return Array.from(new Set(candidates));
}

function loadHanziCharacterData(char: string) {
  const cached = hanziCharacterDataCache.get(char);
  if (cached) return cached;

  const request = fetch(
    `${HANZI_WRITER_DATA_BASE_PATH}/${encodeURIComponent(char)}.json`,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`No Hanzi Writer data for ${char}`);
      }
      return response.json() as Promise<HanziCharacterData>;
    })
    .catch((error) => {
      hanziCharacterDataCache.delete(char);
      throw error;
    });

  hanziCharacterDataCache.set(char, request);
  return request;
}

function hanziWriterCharDataLoader(char: string) {
  return loadHanziCharacterData(char);
}

function getKanjiAliasSet(kanji: string) {
  const aliases = new Set([kanji, ...(JAPANESE_KANJI_DATA_ALIASES[kanji] ?? [])]);

  for (const [original, variants] of Object.entries(JAPANESE_KANJI_DATA_ALIASES)) {
    if (variants.includes(kanji)) {
      aliases.add(original);
      variants.forEach((variant) => aliases.add(variant));
    }
  }

  return aliases;
}

function getKanjiStudyGuide(kanji: string, item: KanjiVocabularyItem): KanjiStudyGuide {
  const guide = KANJI_STUDY_GUIDES[kanji];
  if (guide) return guide;

  return {
    components: [
      {
        part: kanji || item.kanji,
        meaning: "quan sát theo khối lớn, bộ bên trái/phải hoặc trên/dưới",
      },
    ],
    mnemonic: `Hãy tự tách chữ ${kanji || item.kanji} thành 2–3 mảnh dễ nhớ, rồi bịa một câu chuyện thật ngốc nghếch gắn với nghĩa “${item.vietnamese}”. Câu càng buồn cười càng dễ nhớ.`,
    on: [],
    kun: item.kanji === kanji ? [item.reading] : [],
  };
}

function getKanjiWordExamples(
  kanji: string,
  currentItem: KanjiVocabularyItem,
  extraExamples: KanjiWordExample[] = [],
) {
  if (!kanji) return [];

  const aliases = getKanjiAliasSet(kanji);
  const seen = new Set<string>();
  const allItems: KanjiWordExample[] = [
    currentItem,
    ...extraExamples,
    ...Object.values(kanjiVocabulary).flat(),
  ];

  return allItems
    .filter((word) => {
      const characters = extractKanjiCharacters(word.kanji);
      return characters.some((character) => aliases.has(character));
    })
    .sort((first, second) => {
      const score = (word: KanjiWordExample) => {
        if (word.kanji === currentItem.kanji) return 4;
        if (word.kanji === kanji) return 3;
        if (word.kanji.startsWith(kanji)) return 2;
        return 1;
      };
      return score(second) - score(first);
    })
    .filter((word) => {
      const key = `${word.kanji}-${word.reading}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

type HanziWriterInstance = ReturnType<typeof HanziWriter.create>;

function cleanupHanziWriter(
  writer: HanziWriterInstance | null,
  container?: HTMLElement | null,
) {
  try {
    writer?.cancelQuiz();
    void writer?.pauseAnimation();
  } catch {
    // Hanzi Writer cleanup is best-effort; the container reset below removes SVG nodes.
  }

  if (container) container.innerHTML = "";
}

function KanjiMode({
  sentence,
  sentences,
  onAdvance,
}: {
  sentence: Sentence;
  sentences: Sentence[];
  onAdvance: () => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const options = useMemo(() => {
    const distractors = sentences
      .filter((item) => item.id !== sentence.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [sentence, ...distractors].sort(() => Math.random() - 0.5);
  }, [sentence, sentences]);
  const correct = selectedId === sentence.id;
  const feedback: Feedback =
    selectedId === null
      ? null
      : correct
        ? {
            kind: "success",
            message: `Nghĩa: ${sentence.full_vietnamese}`,
          }
        : {
            kind: "error",
            message: "Chưa khớp với cách đọc Kana. Hãy đọc chậm từng từ và chọn lại.",
          };

  useAutoAdvanceOnCorrect(correct, onAdvance);

  return (
    <div className="exerciseContent kanjiContent">
      <div className="kanjiPrompt">
        <span className="promptLabel">ĐỌC KANA · CHỌN CÂU KANJI</span>
        <strong className="kanaReading" lang="ja">
          {romajiToMixedKana(sentence.full_romaji)}
        </strong>
        <p>Chọn một trong bốn cách viết tiếng Nhật bên dưới.</p>
      </div>
      <div className="kanjiOptions" role="group" aria-label="Các đáp án Kanji">
        {options.map((option, optionIndex) => {
          const isSelected = selectedId === option.id;
          const stateClass = isSelected
            ? option.id === sentence.id
              ? "correct"
              : "wrong"
            : "";
          return (
            <button
              key={option.id}
              className={`kanjiOption ${stateClass}`}
              onClick={() => setSelectedId(option.id)}
              aria-pressed={isSelected}
            >
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              <strong lang="ja">{option.full_japanese}</strong>
            </button>
          );
        })}
      </div>
      <FeedbackBanner feedback={feedback} />
    </div>
  );
}

function KanjiWordMode({
  item,
  items,
  onAdvance,
}: {
  item: KanjiVocabularyItem;
  items: KanjiVocabularyItem[];
  onAdvance: () => void;
}) {
  const [selectedReading, setSelectedReading] = useState<string | null>(null);
  const options = useMemo(() => {
    const distractors = items
      .filter((candidate) => candidate.reading !== item.reading)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [item, ...distractors].sort(() => Math.random() - 0.5);
  }, [item, items]);
  const correct = selectedReading === item.reading;
  const feedback: Feedback =
    selectedReading === null
      ? null
      : correct
        ? {
            kind: "success",
            message: `${item.kanji} → ${item.reading} · ${item.vietnamese}`,
          }
        : {
            kind: "error",
            message: "Cách đọc này chưa đúng. Hãy chú ý âm ghép và âm ngắt nhỏ っ.",
          };

  useAutoAdvanceOnCorrect(correct, onAdvance);

  return (
    <div className="exerciseContent kanjiWordContent">
      <div className="kanjiWordPrompt">
        <span className="promptLabel">CHỌN CÁCH ĐỌC HIRAGANA</span>
        <strong lang="ja">{item.kanji}</strong>
        <p>Từ Kanji này được đọc như thế nào?</p>
      </div>
      <div className="kanjiReadingOptions" role="group" aria-label="Các cách đọc Hiragana">
        {options.map((option, optionIndex) => {
          const isSelected = selectedReading === option.reading;
          const stateClass = isSelected
            ? option.reading === item.reading
              ? "correct"
              : "wrong"
            : "";
          return (
            <button
              key={option.reading}
              className={`kanjiReadingOption ${stateClass}`}
              onClick={() => setSelectedReading(option.reading)}
              aria-pressed={isSelected}
            >
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              <strong lang="ja">{option.reading}</strong>
            </button>
          );
        })}
      </div>
      <FeedbackBanner feedback={feedback} />
    </div>
  );
}

function KanjiStudyPanel({
  kanji,
  guide,
  wordExamples,
}: {
  kanji: string;
  guide: KanjiStudyGuide;
  wordExamples: KanjiWordExample[];
}) {
  return (
    <section className="kanjiStudyPanel" aria-label={`Hồ sơ ghi nhớ Kanji ${kanji}`}>
      <div className="kanjiStudyIntro">
        <span className="promptLabel">HỒ SƠ GHI NHỚ</span>
        <h3 lang="ja">{kanji}</h3>
        <p>Tách nhỏ chữ, gắn hình ảnh, rồi đọc lại âm On/Kun cùng các từ thường gặp.</p>
      </div>

      <div className="kanjiStudyGrid">
        <article className="kanjiStudyCard">
          <span className="kanjiStudyLabel">Tách bộ thủ</span>
          <h4>Chia thành mảnh nhỏ</h4>
          <div className="kanjiComponentList">
            {guide.components.map((component, index) => (
              <span className="kanjiComponentPill" key={`${component.part}-${index}`}>
                <strong lang="ja">{component.part}</strong>
                <small>{component.meaning}</small>
              </span>
            ))}
          </div>
        </article>

        <article className="kanjiStudyCard">
          <span className="kanjiStudyLabel">Liên tưởng hình ảnh</span>
          <h4>Câu chuyện nhớ nhanh</h4>
          <p className="kanjiMnemonic">{guide.mnemonic}</p>
        </article>

        <article className="kanjiStudyCard">
          <span className="kanjiStudyLabel">Âm đọc</span>
          <h4>On/Kun</h4>
          <div className="kanjiReadingGrid">
            <div>
              <strong>音読み · On</strong>
              <p lang="ja">{guide.on.length ? guide.on.join("、") : "Đang bổ sung"}</p>
            </div>
            <div>
              <strong>訓読み · Kun</strong>
              <p lang="ja">{guide.kun.length ? guide.kun.join("、") : "Đang bổ sung"}</p>
            </div>
          </div>
        </article>

        <article className="kanjiStudyCard kanjiStudyWordsCard">
          <span className="kanjiStudyLabel">Từ có Kanji này</span>
          <h4>Nhiều ví dụ để gặp lại chữ</h4>
          <div className="kanjiWordExampleList">
            {wordExamples.map((word) => (
              <span className="kanjiWordExample" key={`${word.kanji}-${word.reading}`}>
                <strong lang="ja">{word.kanji}</strong>
                <small lang="ja">{word.reading}</small>
                <em>{word.vietnamese}</em>
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function KanjiWritingMode({
  item,
  onAdvance,
}: {
  item: KanjiVocabularyItem;
  items: KanjiVocabularyItem[];
  onAdvance: () => void;
}) {
  const originalKanjiCharacters = useMemo(
    () => extractKanjiCharacters(item.kanji),
    [item.kanji],
  );
  const writingCandidates = useMemo(
    () => buildKanjiWritingCandidates(item.kanji),
    [item.kanji],
  );
  const primaryKanji = originalKanjiCharacters[0] ?? "";
  const [writingMode, setWritingMode] = useState<"guided" | "free">("guided");
  const [targetKanji, setTargetKanji] = useState("");
  const [isWriterDataLoading, setIsWriterDataLoading] = useState(false);
  const [guidedSuccess, setGuidedSuccess] = useState(false);
  const [writerError, setWriterError] = useState<string | null>(null);
  const [comparisonVisible, setComparisonVisible] = useState(false);
  const guidedContainerRef = useRef<HTMLDivElement>(null);
  const comparisonContainerRef = useRef<HTMLDivElement>(null);
  const guidedWriterRef = useRef<HanziWriterInstance | null>(null);
  const comparisonWriterRef = useRef<HanziWriterInstance | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 300;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size, size);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 9;
    context.strokeStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() ||
      "#17211f";
  }, []);

  const clearCanvas = useCallback(() => {
    prepareCanvas();
    setComparisonVisible(false);
    cleanupHanziWriter(comparisonWriterRef.current, comparisonContainerRef.current);
    comparisonWriterRef.current = null;
  }, [prepareCanvas]);

  useEffect(() => {
    let canceled = false;

    setTargetKanji("");
    setIsWriterDataLoading(writingCandidates.length > 0);
    setGuidedSuccess(false);
    setWriterError(null);
    setComparisonVisible(false);
    drawingRef.current = false;
    lastPointRef.current = null;
    cleanupHanziWriter(guidedWriterRef.current, guidedContainerRef.current);
    cleanupHanziWriter(comparisonWriterRef.current, comparisonContainerRef.current);
    guidedWriterRef.current = null;
    comparisonWriterRef.current = null;
    prepareCanvas();

    if (writingCandidates.length === 0) {
      setIsWriterDataLoading(false);
      return () => {
        canceled = true;
      };
    }

    void (async () => {
      for (const candidate of writingCandidates) {
        try {
          await loadHanziCharacterData(candidate);
          if (canceled) return;
          setTargetKanji(candidate);
          setWriterError(null);
          setIsWriterDataLoading(false);
          return;
        } catch {
          // Try the next Kanji in the word, then known Japanese variant fallbacks.
        }
      }

      if (!canceled) {
        setIsWriterDataLoading(false);
        setWriterError(
          "Chưa có dữ liệu nét cho các chữ Kanji trong từ này. Bạn có thể bấm Câu tiếp để bỏ qua.",
        );
      }
    })();

    return () => {
      canceled = true;
    };
  }, [prepareCanvas, writingCandidates]);

  useEffect(() => {
    if (writingMode !== "guided" || !targetKanji || !guidedContainerRef.current) {
      return undefined;
    }

    let canceled = false;
    setGuidedSuccess(false);
    setWriterError(null);
    cleanupHanziWriter(guidedWriterRef.current, guidedContainerRef.current);
    const styles = getComputedStyle(document.documentElement);
    const strokeColor = styles.getPropertyValue("--ink").trim() || "#17211f";
    const outlineColor = styles.getPropertyValue("--muted").trim() || "#d4c8b6";
    const highlightColor = styles.getPropertyValue("--coral").trim() || "#ef715e";

    const writer = HanziWriter.create(guidedContainerRef.current, targetKanji, {
      width: 300,
      height: 300,
      padding: 12,
      showOutline: true,
      showCharacter: false,
      strokeColor,
      outlineColor,
      highlightColor,
      drawingColor: strokeColor,
      charDataLoader: hanziWriterCharDataLoader,
      onLoadCharDataError: () => {
        if (!canceled) {
          setWriterError("Chưa có dữ liệu nét local cho Kanji này. Hãy thử Câu tiếp.");
        }
      },
    });

    guidedWriterRef.current = writer;
    void writer.quiz({
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      onComplete: () => {
        if (!canceled) setGuidedSuccess(true);
      },
    });

    return () => {
      canceled = true;
      cleanupHanziWriter(writer, guidedContainerRef.current);
      if (guidedWriterRef.current === writer) guidedWriterRef.current = null;
    };
  }, [targetKanji, writingMode]);

  useEffect(() => {
    if (writingMode === "free") {
      window.requestAnimationFrame(prepareCanvas);
      cleanupHanziWriter(guidedWriterRef.current, guidedContainerRef.current);
      guidedWriterRef.current = null;
    } else {
      cleanupHanziWriter(comparisonWriterRef.current, comparisonContainerRef.current);
      comparisonWriterRef.current = null;
      setComparisonVisible(false);
    }
  }, [prepareCanvas, writingMode]);

  useAutoAdvanceOnCorrect(guidedSuccess && writingMode === "guided", onAdvance);

  const getCanvasPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const drawToPoint = (point: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const previous = lastPointRef.current;
    const context = canvas?.getContext("2d");
    if (!context || !previous) return;

    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  };

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event);
    if (!point) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = point;
    setComparisonVisible(false);
  };

  const continueDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const point = getCanvasPoint(event);
    if (point) drawToPoint(point);
  };

  const stopDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const checkFreeWriting = () => {
    if (!targetKanji || !comparisonContainerRef.current) return;

    setComparisonVisible(true);
    setWriterError(null);
    cleanupHanziWriter(comparisonWriterRef.current, comparisonContainerRef.current);
    const styles = getComputedStyle(document.documentElement);
    const strokeColor = styles.getPropertyValue("--ink").trim() || "#17211f";
    const outlineColor = styles.getPropertyValue("--muted").trim() || "#d4c8b6";
    const highlightColor = styles.getPropertyValue("--coral").trim() || "#ef715e";

    const writer = HanziWriter.create(comparisonContainerRef.current, targetKanji, {
      width: 300,
      height: 300,
      padding: 12,
      showOutline: true,
      showCharacter: false,
      strokeColor,
      outlineColor,
      highlightColor,
      strokeAnimationSpeed: 1.15,
      delayBetweenStrokes: 240,
      charDataLoader: hanziWriterCharDataLoader,
      onLoadCharDataError: () =>
        setWriterError("Chưa có dữ liệu nét local cho Kanji này. Hãy thử Câu tiếp."),
    });

    comparisonWriterRef.current = writer;
    void writer.animateCharacter();
  };

  const targetIsOriginalKanji = originalKanjiCharacters.includes(targetKanji);
  const fallbackNotice =
    targetKanji && primaryKanji && targetKanji !== primaryKanji
      ? targetIsOriginalKanji
        ? `Chữ ${primaryKanji} chưa có dữ liệu nét, app đang chuyển sang luyện chữ ${targetKanji} trong cùng từ ${item.kanji}.`
        : `Chữ ${primaryKanji} chưa có dữ liệu nét, app đang dùng biến thể ${targetKanji} để tham khảo thứ tự nét.`
      : null;
  const studyKanji =
    targetKanji && targetIsOriginalKanji ? targetKanji : primaryKanji || targetKanji;
  const studyGuide = useMemo(
    () => getKanjiStudyGuide(studyKanji, item),
    [item.kanji, item.reading, item.vietnamese, studyKanji],
  );
  const relatedKanjiWords = useMemo(
    () => getKanjiWordExamples(studyKanji, item, studyGuide.examples),
    [item.kanji, item.reading, item.vietnamese, studyGuide.examples, studyKanji],
  );

  if (!primaryKanji) {
    return (
      <div className="exerciseContent kanjiWritingContent">
        <div className="emptyPractice">
          <span className="emptyGlyph">筆</span>
          <h2>Không có Kanji để luyện viết</h2>
          <p>Từ này không chứa ký tự Kanji. Hãy chọn mục khác trong bài.</p>
          <button className="secondaryButton" type="button" onClick={onAdvance}>
            Câu tiếp <ArrowIcon />
          </button>
        </div>
      </div>
    );
  }

  if (!targetKanji) {
    return (
      <div className="exerciseContent kanjiWritingContent">
        <div className="emptyPractice">
          <span className="emptyGlyph">筆</span>
          <h2>{isWriterDataLoading ? "Đang chuẩn bị nét chữ" : "Chưa có dữ liệu nét"}</h2>
          <p>
            {isWriterDataLoading
              ? `Đang tải dữ liệu nét cho ${item.kanji}.`
              : writerError ?? "Thư viện chưa có dữ liệu nét cho từ này."}
          </p>
          <button className="secondaryButton" type="button" onClick={onAdvance}>
            Câu tiếp <ArrowIcon />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exerciseContent kanjiWritingContent">
      <div className="kanjiWritingHeader">
        <div>
          <span className="promptLabel">LUYỆN VIẾT KANJI</span>
          <h2>{writingMode === "guided" ? "Luyện viết theo nét" : "Tự do chắp bút"}</h2>
          <p>
            {writingMode === "guided"
              ? `Tô theo outline của chữ ${targetKanji} đúng thứ tự nét.`
              : "Nhìn cách đọc và nghĩa, tự nhớ Kanji rồi viết vào ô bên dưới."}
          </p>
        </div>
        <div className="kanjiWritingTabs" role="group" aria-label="Chọn kiểu luyện viết Kanji">
          <button
            type="button"
            className={writingMode === "guided" ? "active" : ""}
            onClick={() => setWritingMode("guided")}
          >
            Theo nét
          </button>
          <button
            type="button"
            className={writingMode === "free" ? "active" : ""}
            onClick={() => setWritingMode("free")}
          >
            Tự viết mù
          </button>
        </div>
      </div>

      <div className="kanjiWritingMeta">
        {writingMode === "guided" && <strong lang="ja">{targetKanji}</strong>}
        {writingMode === "guided" && item.kanji !== targetKanji && <span lang="ja">{item.kanji}</span>}
        <span lang="ja">{item.reading}</span>
        <small>{item.vietnamese}</small>
      </div>
      {writingMode === "guided" && fallbackNotice && (
        <p className="kanjiWritingNotice">{fallbackNotice}</p>
      )}

      {writingMode === "guided" ? (
        <div className="kanjiWritingStage">
          <div className="kanjiNotebookCell">
            <div ref={guidedContainerRef} className="hanziWriterMount" />
          </div>
          <div className="kanjiWritingHelp">
            <span>MODE A</span>
            <h3>Luyện theo nét</h3>
            <p>Viết theo thứ tự nét. Nếu sai, app sẽ gợi ý nét đúng sau vài lần thử.</p>
            {guidedSuccess && (
              <div className="feedback success">
                <strong>Hoàn thành!</strong>
                <span>Tự chuyển sang Kanji tiếp theo sau 800ms.</span>
              </div>
            )}
            {writerError && (
              <div className="feedback error">
                <strong>Lỗi dữ liệu nét.</strong>
                <span>{writerError}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="kanjiWritingStage freeWritingStage">
          <div className="kanjiNotebookCell">
            <canvas
              ref={canvasRef}
              className="kanjiFreeCanvas"
              width={300}
              height={300}
              onPointerDown={startDrawing}
              onPointerMove={continueDrawing}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              aria-label="Bảng viết Kanji tự do"
            />
          </div>
          <div className={`kanjiNotebookCell answerCell ${comparisonVisible ? "visible" : ""}`}>
            <div ref={comparisonContainerRef} className="hanziWriterMount" />
            {!comparisonVisible && <span className="comparisonPlaceholder">Đáp án đúng sẽ hiện ở đây</span>}
          </div>
          <div className="kanjiWritingActions">
            <button className="checkButton" type="button" onClick={checkFreeWriting}>
              Kiểm tra đáp án <span>↵</span>
            </button>
            <button className="answerButton" type="button" onClick={clearCanvas}>
              Xóa bảng <span aria-hidden="true">×</span>
            </button>
          </div>
          {writerError && (
            <div className="feedback error">
              <strong>Lỗi dữ liệu nét.</strong>
              <span>{writerError}</span>
            </div>
          )}
        </div>
      )}
      <KanjiStudyPanel
        kanji={studyKanji}
        guide={studyGuide}
        wordExamples={relatedKanjiWords}
      />
    </div>
  );
}

function buildVocabularyItems(sentences: Sentence[]) {
  const seen = new Set<string>();
  const items: VocabularyQuizItem[] = [];

  for (const sentence of sentences) {
    for (const chunk of sentence.chunks) {
      const japanese = chunk.japanese.trim();
      const key = normalizeJapanese(japanese);
      if (!key || seen.has(key) || !chunk.vietnamese.trim()) continue;
      seen.add(key);
      items.push({
        id: chunk.id,
        japanese,
        vietnamese: chunk.vietnamese.trim(),
      });
    }
  }

  return items;
}

function VocabularyMode({
  item,
  items,
  onAdvance,
}: {
  item: VocabularyQuizItem;
  items: VocabularyQuizItem[];
  onAdvance: () => void;
}) {
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const options = useMemo(() => {
    const distractors = items
      .filter(
        (candidate) =>
          candidate.id !== item.id && candidate.vietnamese !== item.vietnamese,
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((candidate) => candidate.vietnamese);
    return [item.vietnamese, ...distractors].sort(() => Math.random() - 0.5);
  }, [item, items]);
  const feedback: Feedback =
    selectedMeaning === null
      ? null
      : selectedMeaning === item.vietnamese
        ? {
            kind: "success",
            message: `${item.japanese} = ${item.vietnamese}`,
          }
        : {
            kind: "error",
            message: "Nghĩa này chưa đúng. Hãy nhớ lại ngữ cảnh của cụm từ trong bài.",
          };

  useAutoAdvanceOnCorrect(selectedMeaning === item.vietnamese, onAdvance);

  return (
    <div className="exerciseContent vocabularyContent">
      <div className="vocabularyPrompt">
        <span className="promptLabel">CHỌN NGHĨA TIẾNG VIỆT</span>
        <strong lang="ja">{item.japanese}</strong>
        <p>Từ hoặc cụm từ này có nghĩa là gì?</p>
      </div>
      <div className="vocabularyOptions" role="group" aria-label="Các nghĩa tiếng Việt">
        {options.map((option, optionIndex) => {
          const isSelected = selectedMeaning === option;
          const stateClass = isSelected
            ? option === item.vietnamese
              ? "correct"
              : "wrong"
            : "";
          return (
            <button
              key={option}
              className={`vocabularyOption ${stateClass}`}
              onClick={() => setSelectedMeaning(option)}
              aria-pressed={isSelected}
            >
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              <strong>{option}</strong>
            </button>
          );
        })}
      </div>
      <FeedbackBanner feedback={feedback} />
    </div>
  );
}

function GrammarMode({
  point,
  onAdvance,
}: {
  point: GrammarPoint;
  onAdvance: () => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const feedback: Feedback =
    selectedAnswer === null
      ? null
      : selectedAnswer === point.answer
        ? {
            kind: "success",
            message: `Đáp án ${point.answer}. ${point.explanation}`,
          }
        : {
            kind: "error",
            message: `Hãy xem lại công thức ${point.pattern} rồi chọn lại.`,
          };

  useAutoAdvanceOnCorrect(selectedAnswer === point.answer, onAdvance);

  return (
    <div className="exerciseContent grammarContent">
      <div className="grammarLesson">
        <span className="promptLabel">ĐIỂM NGỮ PHÁP</span>
        <h2>{point.title}</h2>
        <div className="grammarPattern" lang="ja">{point.pattern}</div>
        <p>{point.explanation}</p>
        <div className="grammarExample">
          <span>VÍ DỤ</span>
          <strong lang="ja">{point.example}</strong>
          <small>{point.translation}</small>
        </div>
      </div>
      <div className="grammarQuiz">
        <span>CHỌN PHẦN CÒN THIẾU</span>
        <strong lang="ja">{point.question}</strong>
        <div className="grammarChoices" role="group" aria-label="Các đáp án ngữ pháp">
          {point.choices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const stateClass = isSelected
              ? choice === point.answer
                ? "correct"
                : "wrong"
              : "";
            return (
              <button
                key={choice}
                className={stateClass}
                onClick={() => setSelectedAnswer(choice)}
                aria-pressed={isSelected}
                lang="ja"
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>
      <FeedbackBanner feedback={feedback} />
    </div>
  );
}

function JlptPracticeScreen({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<JlptPracticeSection>("skill");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const visibleGroups = useMemo(
    () => jlptPracticeGroups.filter((group) => group.section === section),
    [section],
  );
  const selectedGroup =
    jlptPracticeGroups.find((group) => group.id === selectedGroupId) ?? null;
  const selectedTest =
    selectedGroup?.tests.find((test) => test.id === selectedTestId) ?? null;

  const switchSection = (nextSection: JlptPracticeSection) => {
    setSection(nextSection);
    setSelectedGroupId(null);
    setSelectedTestId(null);
  };

  const openRandomTest = (group: JlptPracticeGroup) => {
    const randomTest = group.tests[Math.floor(Math.random() * group.tests.length)];
    setSelectedGroupId(group.id);
    setSelectedTestId(randomTest.id);
    window.scrollTo(0, 0);
  };

  if (selectedGroup && selectedTest) {
    return (
      <JlptTestRunner
        group={selectedGroup}
        test={selectedTest}
        onBack={() => setSelectedTestId(null)}
      />
    );
  }

  return (
    <main className="jlptPage">
      <button
        className="textBack"
        onClick={selectedGroup ? () => setSelectedGroupId(null) : onBack}
      >
        <span aria-hidden="true">←</span> {selectedGroup ? "Tất cả nhóm luyện đề" : "Trang chủ"}
      </button>

      <section className="jlptHero" aria-labelledby="jlpt-title">
        <div>
          <span className="sectionKicker">JLPT N5 PRACTICE</span>
          <h1 id="jlpt-title">Luyện kỹ năng thi JLPT và đề thi thử</h1>
          <p>
            Cấu trúc đã gồm đủ 7 nhóm Mondai, 140 đề luyện kỹ năng và 5 đề thi thử.
            Bộ câu hỏi hiện tại là dữ liệu mẫu gốc để bạn luyện và thay thế khi có nguồn hợp lệ.
          </p>
        </div>
        <div className="jlptStats" aria-label="Thống kê luyện đề">
          <div><strong>{jlptPracticeStats.skillGroups}</strong><span>MONDAI</span></div>
          <div><strong>{jlptPracticeStats.totalTests}</strong><span>ĐỀ</span></div>
          <div><strong>2</strong><span>KHỐI HỌC</span></div>
        </div>
      </section>

      {!selectedGroup && (
        <div className="jlptTabs" role="group" aria-label="Chọn khối luyện đề">
          <button
            className={section === "skill" ? "active" : ""}
            onClick={() => switchSection("skill")}
          >
            Luyện kỹ năng thi JLPT
          </button>
          <button
            className={section === "mock" ? "active" : ""}
            onClick={() => switchSection("mock")}
          >
            Luyện đề thi thử
          </button>
        </div>
      )}

      {selectedGroup ? (
        <section className="jlptTestsPanel" aria-labelledby="jlpt-group-title">
          <div className="jlptPanelHeading">
            <div>
              <span className="sectionKicker">{selectedGroup.badge}</span>
              <h2 id="jlpt-group-title">{selectedGroup.title}</h2>
              <p>{selectedGroup.subtitle}</p>
            </div>
            <button className="secondaryButton" onClick={() => openRandomTest(selectedGroup)}>
              Ngẫu nhiên đề <ArrowIcon />
            </button>
          </div>
          <div className="jlptTestGrid">
            {selectedGroup.tests.map((test) => (
              <button
                key={test.id}
                className="jlptTestCard"
                onClick={() => {
                  setSelectedTestId(test.id);
                  window.scrollTo(0, 0);
                }}
              >
                <span>{selectedGroup.badge}</span>
                <strong>{test.title}</strong>
                <small>{test.questions.length} câu mẫu · {test.durationMinutes} phút</small>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="jlptGroupGrid" aria-label="Các nhóm luyện đề N5">
            {visibleGroups.map((group) => (
              <article className={`jlptGroupCard ${group.section}`} key={group.id}>
                <span className="jlptGroupBadge">{group.badge}</span>
                <h2>{group.title}</h2>
                <p>{group.subtitle}</p>
                <div className="jlptGroupMeta">
                  <span>{group.totalTests} bài test</span>
                  <span>{group.totalMinutes} phút</span>
                </div>
                <div className="jlptGroupActions">
                  <button onClick={() => { setSelectedGroupId(group.id); window.scrollTo(0, 0); }}>
                    Xem tất cả đề <ArrowIcon />
                  </button>
                  <button onClick={() => openRandomTest(group)}>Ngẫu nhiên</button>
                </div>
              </article>
            ))}
          </section>

        </>
      )}
    </main>
  );
}

function N5ConjugationScreen({ onBack }: { onBack: () => void }) {
  const total = n5ConjugationItems.length;
  const [index, setIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState(() =>
    Array.from({ length: total }, (_, itemIndex) => itemIndex),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const displayedIndex = questionOrder[index] ?? index;
  const item = n5ConjugationItems[displayedIndex];
  const choices = useMemo(() => shuffleArray(item.choices), [item]);

  const resetAnswerState = () => {
    setSelected(null);
    setFeedback(null);
    setShowAnswer(false);
  };

  const goTo = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
    resetAnswerState();
  }, []);

  const chooseAnswer = useCallback((choice: string) => {
    const correct = normalizeJapanese(choice) === normalizeJapanese(item.answer);
    setSelected(choice);
    setFeedback({
      kind: correct ? "success" : "error",
      message: correct
        ? "Đúng rồi. Nhớ đọc lại thành tiếng để quen phản xạ chia thể."
        : "Chưa đúng. Bấm “Hiện đáp án” để xem quy tắc chia thể.",
    });
    if (correct) setShowAnswer(true);
  }, [item.answer]);

  const shuffleQuestions = () => {
    setQuestionOrder((current) => shuffledOrder(total, current));
    setIndex(0);
    resetAnswerState();
  };

  const previous = () => goTo(Math.max(0, index - 1));
  const next = () => goTo(Math.min(total - 1, index + 1));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (rulesOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          setRulesOpen(false);
        }
        return;
      }
      if (isTextEntryTarget(event.target)) return;
      if (["1", "2", "3", "4"].includes(event.key)) {
        const choice = choices[Number(event.key) - 1];
        if (!choice) return;
        event.preventDefault();
        chooseAnswer(choice);
        return;
      }
      if (event.key === "Enter" && feedback && index < total - 1) {
        event.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [choices, chooseAnswer, feedback, index, rulesOpen, total]);

  useAutoAdvanceOnCorrect(feedback?.kind === "success" && index < total - 1, next);

  return (
    <main className="practicePage jlptRunnerPage">
      <div className="practiceHeader">
        <button className="roundBack" onClick={onBack} aria-label="Quay lại luyện đề thi thử">←</button>
        <div className="practiceIdentity">
          <span>CHIA THỂ N5</span>
          <strong>Từ vựng N5</strong>
        </div>
        <div className="conjugationHeaderTools">
          <button
            className="rulesButton"
            type="button"
            onClick={() => setRulesOpen(true)}
            aria-haspopup="dialog"
          >
            Quy tắc chia
          </button>
          <div className="practiceProgress">
            <span>Luyện tập</span>
            <strong>{index + 1} / {total}</strong>
            <ProgressBar current={index} total={total} />
          </div>
        </div>
      </div>

      <section className="practiceCard conjugationQuestionCard">
        <div className="exerciseContent conjugationContent">
          <div className="conjugationPrompt">
            <span className="promptLabel">{item.instruction}</span>
            <strong className="conjugationVerb" lang="ja">{item.verb}</strong>
            <div className="conjugationTags">
              <span>{item.group}</span>
              <span>{item.targetForm}</span>
              <span>Nghĩa: {item.meaning}</span>
            </div>
          </div>

          <div className="conjugationChoices" role="group" aria-label="Đáp án chia thể N5">
            {choices.map((choice, choiceIndex) => {
              const isSelected = selected === choice;
              const isCorrect = normalizeJapanese(choice) === normalizeJapanese(item.answer);
              const stateClass = feedback
                ? isCorrect
                  ? "correct"
                  : isSelected
                    ? "wrong"
                    : ""
                : isSelected
                  ? "selected"
                  : "";

              return (
                <button
                  key={`${item.verb}-${item.targetForm}-${choice}`}
                  type="button"
                  className={stateClass}
                  onClick={() => chooseAnswer(choice)}
                >
                  <span>{choiceIndex + 1}</span>
                  <strong lang="ja">{choice}</strong>
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`feedback ${feedback.kind}`}>
              <strong>{feedback.kind === "success" ? "Chính xác." : "Chưa đúng."}</strong>
              <span>{feedback.message}</span>
            </div>
          )}

          {showAnswer && (
            <div className="conjugationAnswerPanel">
              <span>Đáp án đúng</span>
              <strong lang="ja">{item.verb} → {item.answer}</strong>
              <p>{item.note}</p>
            </div>
          )}

          <div className="conjugationActions">
            <button type="button" className="answerRevealButton" onClick={() => setShowAnswer((current) => !current)}>
              {showAnswer ? "Ẩn đáp án" : "Hiện đáp án"}
              <span aria-hidden="true">{showAnswer ? "×" : "目"}</span>
            </button>
            <button type="button" className="secondaryButton" onClick={() => speakJapaneseText(`${item.verb}、${item.answer}`)}>
              Đọc từ vựng <ArrowIcon />
            </button>
          </div>
        </div>

        <ExerciseNav
          index={index}
          total={total}
          onPrevious={previous}
          onNext={next}
          onShuffle={shuffleQuestions}
        />
      </section>
      <p className="practiceTip">Mẹo: bấm phím 1–4 để chọn nhanh, Enter để sang câu tiếp sau khi đã trả lời.</p>
      {rulesOpen && <N5ConjugationRulesModal onClose={() => setRulesOpen(false)} />}
    </main>
  );
}

function N5ConjugationRulesModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="rulesModalBackdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="rulesModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="n5-rules-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="rulesModalHeader">
          <div>
            <span className="sectionKicker">N5 CONJUGATION RULES</span>
            <h2 id="n5-rules-title">Quy tắc chia thể N5</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng bảng quy tắc">×</button>
        </header>

        <div className="rulesModalBody">
          <article className="ruleBlock">
            <h3>1. Nhận diện nhóm động từ</h3>
            <div className="ruleGrid">
              <div><strong>Nhóm 1</strong><p>Động từ đổi âm trước ます: いきます, よみます, かいます, はなします.</p></div>
              <div><strong>Nhóm 2</strong><p>Bỏ ます rồi thêm る ở thể từ điển: たべます→たべる, みます→みる.</p></div>
              <div><strong>Nhóm 3</strong><p>Bất quy tắc: します→する, きます→くる.</p></div>
            </div>
          </article>

          <article className="ruleBlock">
            <h3>2. Thể lịch sự</h3>
            <div className="ruleTable">
              <div><span>Khẳng định hiện tại</span><strong>～ます</strong><em>いきます</em></div>
              <div><span>Phủ định hiện tại</span><strong>～ません</strong><em>いきません</em></div>
              <div><span>Khẳng định quá khứ</span><strong>～ました</strong><em>いきました</em></div>
              <div><span>Phủ định quá khứ</span><strong>～ませんでした</strong><em>いきませんでした</em></div>
            </div>
          </article>

          <article className="ruleBlock">
            <h3>3. 辞書形・ない形</h3>
            <div className="ruleTable twoColumn">
              <div><span>Nhóm 1 辞書形</span><strong>い段 → う段</strong><em>かきます→かく / よみます→よむ</em></div>
              <div><span>Nhóm 1 ない形</span><strong>い段 → あ段 + ない</strong><em>かきます→かかない / かいます→かわない</em></div>
              <div><span>Nhóm 2</span><strong>Gốc + る / ない</strong><em>たべます→たべる / たべない</em></div>
              <div><span>Nhóm 3</span><strong>する・くる</strong><em>します→する/しない, きます→くる/こない</em></div>
            </div>
          </article>

          <article className="ruleBlock">
            <h3>4. て形・た形 nhóm 1</h3>
            <div className="ruleTable threeColumn">
              <div><span>い・ち・り</span><strong>って / った</strong><em>かいます→かって / かった</em></div>
              <div><span>み・び・に</span><strong>んで / んだ</strong><em>よみます→よんで / よんだ</em></div>
              <div><span>き</span><strong>いて / いた</strong><em>かきます→かいて / かいた</em></div>
              <div><span>ぎ</span><strong>いで / いだ</strong><em>およぎます→およいで / およいだ</em></div>
              <div><span>し</span><strong>して / した</strong><em>はなします→はなして / はなした</em></div>
              <div><span>ngoại lệ</span><strong>行きます</strong><em>いって / いった</em></div>
            </div>
          </article>

          <article className="ruleBlock">
            <h3>5. Các mẫu dùng với て形・ない形</h3>
            <div className="ruleTable twoColumn">
              <div><span>Yêu cầu lịch sự</span><strong>Vてください</strong><em>よんでください</em></div>
              <div><span>Xin phép/cho phép</span><strong>Vてもいいです</strong><em>たべてもいいです</em></div>
              <div><span>Cấm đoán</span><strong>Vてはいけません</strong><em>ここで すってはいけません</em></div>
              <div><span>Đang diễn ra/trạng thái</span><strong>Vています</strong><em>べんきょうしています</em></div>
              <div><span>Yêu cầu không làm</span><strong>Vないでください</strong><em>いかないでください</em></div>
              <div><span>Nối hành động</span><strong>Vて、Vて、...</strong><em>たべて、ねます</em></div>
            </div>
          </article>

          <article className="ruleBlock">
            <h3>6. Tính từ N5</h3>
            <div className="ruleTable twoColumn">
              <div><span>Tính từ い hiện tại</span><strong>Aいです</strong><em>あたらしいです</em></div>
              <div><span>Tính từ い phủ định</span><strong>Aくないです</strong><em>あたらしくないです</em></div>
              <div><span>Tính từ い quá khứ</span><strong>Aかったです</strong><em>あたらしかったです</em></div>
              <div><span>Tính từ い nối</span><strong>Aくて</strong><em>あたらしくて</em></div>
              <div><span>Tính từ な</span><strong>Aです / Aじゃありません</strong><em>しずかです / しずかじゃありません</em></div>
              <div><span>Bổ nghĩa danh từ</span><strong>Aい + N / Aな + N</strong><em>あたらしいほん / しずかなまち</em></div>
            </div>
            <p className="ruleNote">Lưu ý: いい là ngoại lệ: よくないです・よかったです・よくて.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

function JlptTestRunner({
  group,
  test,
  onBack,
}: {
  group: JlptPracticeGroup;
  test: JlptPracticeTest;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState(() =>
    Array.from({ length: test.questions.length }, (_, itemIndex) => itemIndex),
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [orderAnswers, setOrderAnswers] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = test.questions[questionOrder[index] ?? index];

  useEffect(() => {
    setIndex(0);
    setQuestionOrder(Array.from({ length: test.questions.length }, (_, itemIndex) => itemIndex));
    setAnswers({});
    setOrderAnswers({});
    setFeedback(null);
    setShowAnswer(false);
  }, [test.id, test.questions.length]);

  useEffect(() => {
    setFeedback(null);
    setShowAnswer(false);
  }, [question?.id]);

  const selectedText =
    question.kind === "order"
      ? (orderAnswers[question.id] ?? []).join(" ")
      : answers[question.id] ?? "";

  const check = () => {
    if (!selectedText.trim()) {
      setFeedback({ kind: "error", message: "Bạn cần chọn đáp án trước khi kiểm tra." });
      return;
    }
    const correct = normalizeJapanese(selectedText) === normalizeJapanese(question.answer);
    setFeedback(
      correct
        ? { kind: "success", message: question.explanation }
        : { kind: "error", message: "Đáp án này chưa đúng. Bấm xem đáp án nếu bạn muốn đối chiếu ngay." },
    );
  };

  const reveal = () => {
    setShowAnswer((current) => !current);
    if (!showAnswer) {
      if (question.kind === "order") {
        setOrderAnswers((current) => ({
          ...current,
          [question.id]: question.answer.split(" "),
        }));
      } else {
        setAnswers((current) => ({ ...current, [question.id]: question.answer }));
      }
      setFeedback({ kind: "success", message: `Đáp án: ${question.answer}. ${question.explanation}` });
    }
  };

  const chooseAnswer = (choice: string) => {
    setAnswers((current) => ({ ...current, [question.id]: choice }));
    setFeedback(null);
  };

  const toggleOrderPiece = (choice: string) => {
    setOrderAnswers((current) => {
      const answer = current[question.id] ?? [];
      const next = answer.includes(choice)
        ? answer.filter((item) => item !== choice)
        : [...answer, choice];
      return { ...current, [question.id]: next };
    });
    setFeedback(null);
  };

  const shuffleQuestions = () => {
    setQuestionOrder((current) => shuffledOrder(test.questions.length, current));
    setIndex(0);
    setFeedback(null);
    setShowAnswer(false);
  };

  const goTo = (nextIndex: number) => {
    setIndex(nextIndex);
    setFeedback(null);
    setShowAnswer(false);
  };

  return (
    <main className="practicePage jlptRunnerPage">
      <div className="practiceHeader">
        <button className="roundBack" onClick={onBack} aria-label="Quay lại danh sách đề">←</button>
        <div className="practiceIdentity">
          <span>{group.title}</span>
          <strong>{test.title}</strong>
        </div>
        <div className="practiceProgress">
          <span>{test.durationMinutes} PHÚT</span>
          <strong>{index + 1} / {test.questions.length}</strong>
          <ProgressBar current={index} total={test.questions.length} />
        </div>
      </div>
      <section className="practiceCard jlptQuestionCard">
        <JlptQuestionCard
          question={question}
          selectedText={selectedText}
          orderAnswer={orderAnswers[question.id] ?? []}
          showAnswer={showAnswer}
          onChoose={chooseAnswer}
          onToggleOrder={toggleOrderPiece}
        />
        <FeedbackBanner feedback={feedback} />
        <div className="clozeActions jlptAnswerActions">
          <button
            className="answerButton"
            type="button"
            onClick={reveal}
            aria-pressed={showAnswer}
          >
            {showAnswer ? "Ẩn đáp án" : "Xem đáp án"}
            <span aria-hidden="true">{showAnswer ? "×" : "目"}</span>
          </button>
          <button className="checkButton" type="button" onClick={check}>
            Kiểm tra đáp án <span>↵</span>
          </button>
        </div>
        <ExerciseNav
          index={index}
          total={test.questions.length}
          onPrevious={() => goTo(Math.max(0, index - 1))}
          onNext={() => goTo(Math.min(test.questions.length - 1, index + 1))}
          onShuffle={shuffleQuestions}
        />
      </section>
      <p className="practiceTip">Mẹo: làm lại cùng một đề sau khi bấm ngẫu nhiên để đổi thứ tự câu hỏi.</p>
    </main>
  );
}

function renderJlptPrompt(question: JlptPracticeQuestion) {
  if (!question.underline || !question.prompt.includes(question.underline)) {
    return question.prompt;
  }

  const pieces = question.prompt.split(question.underline);
  return (
    <>
      {pieces.map((piece, pieceIndex) => (
        <Fragment key={`${question.id}-${pieceIndex}`}>
          {piece}
          {pieceIndex < pieces.length - 1 && (
            <span className="jlptUnderline">{question.underline}</span>
          )}
        </Fragment>
      ))}
    </>
  );
}

function JlptQuestionCard({
  question,
  selectedText,
  orderAnswer,
  showAnswer,
  onChoose,
  onToggleOrder,
}: {
  question: JlptPracticeQuestion;
  selectedText: string;
  orderAnswer: string[];
  showAnswer: boolean;
  onChoose: (choice: string) => void;
  onToggleOrder: (choice: string) => void;
}) {
  const isOrder = question.kind === "order";

  return (
    <div className="exerciseContent jlptQuestionContent">
      <div className="jlptQuestionTop">
        <span className="promptLabel">{question.instruction}</span>
        {question.passage && <p className="jlptPassage" lang="ja">{question.passage}</p>}
        <h2 lang="ja">{renderJlptPrompt(question)}</h2>
      </div>

      {isOrder && (
        <div className="jlptOrderAnswer">
          <span>CÂU CỦA BẠN</span>
          <strong lang="ja">{orderAnswer.length ? orderAnswer.join(" ") : "Chọn các mảnh bên dưới"}</strong>
        </div>
      )}

      <div className={isOrder ? "jlptOrderChoices" : "jlptChoices"} role="group" aria-label="Đáp án luyện đề">
        {question.choices.map((choice, choiceIndex) => {
          const selected = isOrder
            ? orderAnswer.includes(choice)
            : selectedText === choice;
          const isAnswer = showAnswer && choice === question.answer;
          return (
            <button
              key={choice}
              className={`${selected ? "selected" : ""} ${isAnswer ? "correct" : ""}`}
              onClick={() => isOrder ? onToggleOrder(choice) : onChoose(choice)}
              aria-pressed={selected}
            >
              <span>{isOrder ? orderAnswer.indexOf(choice) + 1 || "＋" : String.fromCharCode(65 + choiceIndex)}</span>
              <strong lang="ja">{choice}</strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestionWordsScreen({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState(() =>
    Array.from({ length: questionWordItems.length }, (_, itemIndex) => itemIndex),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const item = questionWordItems[questionOrder[index] ?? index];
  const options = useMemo(() => {
    const distractors = questionWordItems
      .filter((candidate) => candidate.answer !== item.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((candidate) => candidate.answer);
    return [item.answer, ...distractors].sort(() => Math.random() - 0.5);
  }, [item]);
  const feedback: Feedback =
    selected === null
      ? null
      : selected === item.answer
        ? {
            kind: "success",
            message: `${item.answer} = ${item.meaning}. ${item.note}`,
          }
        : {
            kind: "error",
            message: "Từ này chưa phù hợp với ý nghĩa của câu. Hãy xem bản dịch và chọn lại.",
          };
  const goTo = (nextIndex: number) => {
    setIndex(nextIndex);
    setSelected(null);
  };
  const shuffleQuestions = () => {
    setQuestionOrder((current) => shuffledOrder(questionWordItems.length, current));
    setIndex(0);
    setSelected(null);
  };

  return (
    <main className="practicePage questionWordsPage">
      <div className="practiceHeader">
        <button className="roundBack" onClick={onBack} aria-label="Quay lại danh sách bài học">←</button>
        <div className="practiceIdentity">
          <span>疑問詞</span>
          <strong>Từ để hỏi</strong>
        </div>
        <div className="practiceProgress">
          <span>BÀI ĐẶC BIỆT</span>
          <strong>{index + 1} / {questionWordItems.length}</strong>
          <ProgressBar current={index} total={questionWordItems.length} />
        </div>
      </div>
      <section className="practiceCard question">
        <div className="exerciseContent questionWordContent">
          <div className="questionWordPrompt">
            <span className="promptLabel">CHỌN TỪ ĐỂ HỎI PHÙ HỢP</span>
            <strong lang="ja">{item.sentence}</strong>
            <p>{item.vietnamese}</p>
          </div>
          <div className="questionWordOptions" role="group" aria-label="Các từ để hỏi">
            {options.map((option, optionIndex) => {
              const isSelected = selected === option;
              const stateClass = isSelected
                ? option === item.answer
                  ? "correct"
                  : "wrong"
                : "";
              return (
                <button
                  key={option}
                  className={`questionWordOption ${stateClass}`}
                  onClick={() => setSelected(option)}
                  aria-pressed={isSelected}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  <strong lang="ja">{option}</strong>
                </button>
              );
            })}
          </div>
          <FeedbackBanner feedback={feedback} />
        </div>
        <ExerciseNav
          index={index}
          total={questionWordItems.length}
          onPrevious={() => goTo(Math.max(0, index - 1))}
          onNext={() => goTo(Math.min(questionWordItems.length - 1, index + 1))}
          onShuffle={shuffleQuestions}
        />
      </section>
      <p className="practiceTip">Mẹo: nhìn danh từ hoặc đơn vị ngay sau chỗ trống để chọn đúng từ hỏi.</p>
    </main>
  );
}

function PracticeScreen({
  lesson,
  modeId,
  onBack,
  showFurigana,
}: {
  lesson: Lesson;
  modeId: ModeId;
  onBack: () => void;
  showFurigana: boolean;
}) {
  const mode = modes.find((item) => item.id === modeId) ?? modes[0];
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [index, setIndex] = useState(0);
  const [practiceOrder, setPracticeOrder] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (modeId === "kanji-words" || modeId === "grammar") {
      setLoading(false);
      return;
    }
    const path = modeId === "reading" ? "passages" : "sentences";
    requestJson<Sentence[] | Passage[]>(`/lessons/${lesson.id}/${path}`)
      .then((data) => {
        if (modeId === "reading") setPassages(data as Passage[]);
        else setSentences(data as Sentence[]);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [lesson.id, modeId]);

  const kanjiSentences = useMemo(() => {
    return sentences.filter((sentence) =>
      containsKanji(sentence.full_japanese),
    );
  }, [sentences]);
  const activeSentences = modeId === "kanji" ? kanjiSentences : sentences;
  const audioMatchChunks = useMemo(
    () => buildAudioMatchChunks(sentences),
    [sentences],
  );
  const kanjiWords = kanjiVocabulary[lesson.id] ?? [];
  const vocabularyItems = useMemo(
    () => buildVocabularyItems(sentences),
    [sentences],
  );
  const lessonGrammarPoints = grammarPoints[lesson.id] ?? [];
  const total =
    modeId === "reading"
      ? passages.length
      : modeId === "audio-match"
        ? audioMatchChunks.length
      : modeId === "kanji-words"
        ? kanjiWords.length
      : modeId === "kanji-writing"
        ? kanjiWords.length
        : modeId === "vocabulary"
          ? vocabularyItems.length
          : modeId === "grammar"
            ? lessonGrammarPoints.length
            : activeSentences.length;
  useEffect(() => {
    if (total > 0) {
      setPracticeOrder(Array.from({ length: total }, (_, itemIndex) => itemIndex));
      setIndex(0);
    }
  }, [lesson.id, modeId, total]);
  const displayedIndex = practiceOrder[index] ?? index;
  const next = () => {
    if (modeId === "vocabulary" && vocabularyItems[displayedIndex]) {
      updateSRSItem("vocab_" + vocabularyItems[displayedIndex].id, 4);
    } else if ((modeId === "cloze" || modeId === "scramble" || modeId === "dictation" || modeId === "kanji") && activeSentences[displayedIndex]) {
      updateSRSItem("sentence_" + activeSentences[displayedIndex].id, 4);
    }
    setIndex((current) => Math.min(current + 1, total - 1));
  };
  const previous = () => setIndex((current) => Math.max(current - 1, 0));
  const shufflePractice = () => {
    setPracticeOrder((current) => shuffledOrder(total, current));
    setIndex(0);
  };

  return (
    <main className="practicePage">
      <PracticeHeader
        lesson={lesson}
        mode={mode}
        current={index}
        total={total}
        onBack={onBack}
      />
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
          <EmptyPractice onBack={onBack} modeId={modeId} />
        ) : (
          <>
            {modeId === "cloze" && (
              <ClozeMode
                key={activeSentences[displayedIndex].id}
                sentence={activeSentences[displayedIndex]}
                onAdvance={next}
              />
            )}
            {modeId === "scramble" && (
              <ScrambleMode
                key={activeSentences[displayedIndex].id}
                sentence={activeSentences[displayedIndex]}
                onAdvance={next}
              />
            )}
            {modeId === "dictation" && (
              <DictationMode
                key={activeSentences[displayedIndex].id}
                sentence={activeSentences[displayedIndex]}
                onAdvance={next}
              />
            )}
            {modeId === "audio-match" && (
              <AudioMatchMode
                key={audioMatchChunks[displayedIndex].id}
                chunk={audioMatchChunks[displayedIndex]}
                chunks={audioMatchChunks}
                onAdvance={next}
              />
            )}
            {modeId === "reading" && (
              <ReadingMode
                key={passages[displayedIndex].id}
                passage={passages[displayedIndex]}
                showFurigana={showFurigana}
              />
            )}
            {modeId === "kanji" && (
              <KanjiMode
                key={activeSentences[displayedIndex].id}
                sentence={activeSentences[displayedIndex]}
                sentences={activeSentences}
                onAdvance={next}
              />
            )}
            {modeId === "kanji-words" && (
              <KanjiWordMode
                key={`${lesson.id}-${kanjiWords[displayedIndex].kanji}`}
                item={kanjiWords[displayedIndex]}
                items={kanjiWords}
                onAdvance={next}
              />
            )}
            {modeId === "kanji-writing" && (
              <KanjiWritingMode
                key={`${lesson.id}-${kanjiWords[displayedIndex].kanji}-writing`}
                item={kanjiWords[displayedIndex]}
                items={kanjiWords}
                onAdvance={next}
              />
            )}
            {modeId === "vocabulary" && (
              <VocabularyMode
                key={`${lesson.id}-${vocabularyItems[displayedIndex].id}`}
                item={vocabularyItems[displayedIndex]}
                items={vocabularyItems}
                onAdvance={next}
              />
            )}
            {modeId === "grammar" && (
              <GrammarMode
                key={`${lesson.id}-${displayedIndex}`}
                point={lessonGrammarPoints[displayedIndex]}
                onAdvance={next}
              />
            )}
            <ExerciseNav index={index} total={total} onPrevious={previous} onNext={next} onShuffle={shufflePractice} />
          </>
        )}
      </section>
      <p className="practiceTip">Mẹo: Đọc thành tiếng mỗi chunk trước khi kiểm tra đáp án.</p>
    </main>
  );
}

type ReviewItem = {
  id: string;
  type: "sentence" | "vocab";
  front: string;
  back: string;
};

function AiChatBox({ lesson }: { lesson: Lesson | null }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn, mình là Manabu AI. Bạn có thể hỏi ngữ pháp, nhờ tách chunk, dịch câu, hoặc bấm mic để nói với mình.",
    },
  ]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || loading) return;

    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage].slice(-16);
    const assistantMessageId = `assistant-stream-${Date.now()}`;
    setMessages([
      ...nextMessages,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "Đang suy nghĩ một chút…",
        source: "gemini-stream",
      },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await streamAiChat({
        messages: nextMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        lesson_title: lesson?.title ?? null,
        lesson_description: lesson?.description ?? null,
      }, (_chunk, fullText) => {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: fullText || "Đang suy nghĩ một chút…",
                  source: "gemini-stream",
                }
              : message,
          ),
        );
      });
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: response.reply || "Mình chưa nhận được nội dung trả lời từ Gemini.",
                source: response.source,
              }
            : message,
        ),
      );
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content:
                  "Mình chưa kết nối được AI lúc này. Bạn kiểm tra backend đang chạy và GEMINI_API_KEY nếu muốn dùng Gemini AI thật nhé.",
                source: "error",
              }
            : message,
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [input, lesson?.description, lesson?.title, loading, messages]);

  const startVoiceInput = () => {
    if (typeof window === "undefined") return;
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-mic-${Date.now()}`,
          role: "assistant",
          content:
            "Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Bạn vẫn có thể nhập câu hỏi bằng bàn phím.",
          source: "browser",
        },
      ]);
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
      setInput((current) => `${current}${current ? " " : ""}${transcript}`.trim());
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className={`aiChatBox ${open ? "open" : ""}`} aria-live="polite">
      {open && (
        <section className="aiChatPanel" aria-label="Chat với Manabu AI">
          <div className="aiChatHeader">
            <div>
              <span>AI TUTOR</span>
              <strong>Manabu AI</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng chat AI">
              ×
            </button>
          </div>
          <div className="aiChatMessages">
            {messages.map((message) => (
              <div key={message.id} className={`aiChatMessage ${message.role}`}>
                <p>{message.content}</p>
                {message.role === "assistant" && (
                  <button
                    type="button"
                    onClick={() => speakAiText(message.content)}
                    aria-label="Đọc câu trả lời AI"
                  >
                    🔊
                  </button>
                )}
              </div>
            ))}
            {loading && !messages.some((message) => message.id.startsWith("assistant-stream-")) && (
              <div className="aiChatMessage assistant">
                <p>Đang suy nghĩ một chút…</p>
              </div>
            )}
          </div>
          <div className="aiChatLessonContext">
            {lesson ? `${lesson.title}: ${lesson.description}` : "Hỏi tự do về tiếng Nhật"}
          </div>
          <div className="aiChatInputRow">
            <button
              className={listening ? "listening" : ""}
              type="button"
              onClick={startVoiceInput}
              aria-label={listening ? "Dừng nghe" : "Nói với AI"}
            >
              🎙
            </button>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Hỏi AI: câu này nghĩa là gì, tách chunk giúp tôi..."
              rows={2}
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Gửi tin nhắn"
            >
              ➤
            </button>
          </div>
        </section>
      )}
      <button
        className="aiChatToggle"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Ẩn chat AI" : "Mở chat AI"}
      >
        <span aria-hidden="true">🤖</span>
      </button>
    </div>
  );
}

function ReviewScreen({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestJson<Sentence[]>(`/lessons/${lesson.id}/sentences`).then(sentences => {
      const dueSentences = sentences.filter(s => isDueForReview("sentence_" + s.id)).map(s => ({
        id: "sentence_" + s.id,
        type: "sentence" as const,
        front: s.full_japanese,
        back: s.full_vietnamese
      }));
      const vocabItems = buildVocabularyItems(sentences);
      const dueVocab = vocabItems.filter(v => isDueForReview("vocab_" + v.id)).map(v => ({
        id: "vocab_" + v.id,
        type: "vocab" as const,
        front: v.japanese,
        back: v.vietnamese
      }));
      setItems([...dueSentences, ...dueVocab].sort(() => Math.random() - 0.5));
      setLoading(false);
    });
  }, [lesson.id]);

  const currentItem = items[currentIndex] ?? null;

  const handleRate = useCallback((quality: number) => {
    if (!currentItem) return;

    updateSRSItem(currentItem.id, quality);
    setShowAnswer(false);
    setCurrentIndex((current) => current + 1);
  }, [currentItem]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !currentItem ||
        isTextEntryTarget(event.target) ||
        event.shiftKey ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.isComposing ||
        event.keyCode === 229
      ) {
        return;
      }

      if (!showAnswer && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        setShowAnswer(true);
        return;
      }

      if (!showAnswer) return;

      if (event.key === "1") {
        event.preventDefault();
        handleRate(1);
      } else if (event.key === "2") {
        event.preventDefault();
        handleRate(3);
      } else if (event.key === "3") {
        event.preventDefault();
        handleRate(5);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [currentItem, handleRate, showAnswer]);

  if (loading) return <main className="practicePage"><div className="loadingState"><span /><p>Đang chuẩn bị bài luyện…</p></div></main>;

  if (items.length === 0 || currentIndex >= items.length) {
    return (
      <main className="practicePage">
        <section className="practiceCard mint" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
          <h2>Hoàn thành!</h2>
          <p style={{marginBottom: 20}}>Bạn đã ôn tập xong tất cả các mục của bài này.</p>
          <button className="primaryButton" onClick={onBack}>Quay lại</button>
        </section>
      </main>
    );
  }

  if (!currentItem) return null;

  return (
    <main className="practicePage">
      <div className="practiceHeader">
        <button className="textBack" onClick={onBack} aria-label="Quay lại">
          <span aria-hidden="true">←</span> BÀI HỌC
        </button>
        <div className="practiceProgress">
          <span>Ôn tập</span>
          <strong>{currentIndex + 1} / {items.length}</strong>
          <ProgressBar current={currentIndex} total={items.length} />
        </div>
      </div>
      <section className="practiceCard mint reviewPracticeCard">
        <div className={`reviewFlipCard ${showAnswer ? "isFlipped" : ""}`}>
          <div className="reviewFlipInner">
            <div className="reviewFlipFace reviewFlipFront">
              <div className="vocabularyPrompt">
                <span className="promptLabel">ÔN TẬP {currentItem.type === "vocab" ? "TỪ VỰNG" : "CÂU"}</span>
                <strong lang="ja">{currentItem.front}</strong>
              </div>
              <button
                className="primaryButton reviewRevealButton"
                type="button"
                onClick={() => setShowAnswer(true)}
                tabIndex={showAnswer ? -1 : 0}
              >
                Hiện đáp án
              </button>
            </div>
            <div className="reviewFlipFace reviewFlipBack">
              <div className="vocabularyPrompt reviewBackPrompt">
                <span className="promptLabel">ĐÁP ÁN</span>
                <strong lang="ja">{currentItem.front}</strong>
                <p className="reviewAnswerText">{currentItem.back}</p>
              </div>
              <div className="reviewRatingActions">
                <button
                  className="reviewRatingButton forgot"
                  type="button"
                  onClick={() => handleRate(1)}
                  tabIndex={showAnswer ? 0 : -1}
                >
                  Quên <small>Lặp lại ngay</small>
                </button>
                <button
                  className="reviewRatingButton hard"
                  type="button"
                  onClick={() => handleRate(3)}
                  tabIndex={showAnswer ? 0 : -1}
                >
                  Khó
                </button>
                <button
                  className="reviewRatingButton easy"
                  type="button"
                  onClick={() => handleRate(5)}
                  tabIndex={showAnswer ? 0 : -1}
                >
                  Dễ <small>Nhớ lâu</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function LearningApp() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [mode, setMode] = useState<ModeId | null>(null);
  const [questionWordsOpen, setQuestionWordsOpen] = useState(false);
  const [jlptPracticeOpen, setJlptPracticeOpen] = useState(false);
  const [n5ConjugationOpen, setN5ConjugationOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themePreferenceReady, setThemePreferenceReady] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [furiganaPreferenceReady, setFuriganaPreferenceReady] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem("manabu-theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch {
      setTheme("light");
    }

    setThemePreferenceReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    if (!themePreferenceReady) return;

    try {
      window.localStorage.setItem("manabu-theme", theme);
    } catch {
      // Theme is a visual preference; the app works normally without storage.
    }
  }, [theme, themePreferenceReady]);

  useEffect(() => {
    try {
      setShowFurigana(
        window.localStorage.getItem("manabu-show-furigana") !== "false",
      );
    } catch {
      setShowFurigana(true);
    }

    setFuriganaPreferenceReady(true);
  }, []);

  useEffect(() => {
    if (!furiganaPreferenceReady) return;

    try {
      window.localStorage.setItem(
        "manabu-show-furigana",
        showFurigana ? "true" : "false",
      );
    } catch {
      // Local storage can be unavailable in private or locked-down browsers.
    }
  }, [furiganaPreferenceReady, showFurigana]);

  const goHome = () => {
    setMode(null);
    setLesson(null);
    setQuestionWordsOpen(false);
    setJlptPracticeOpen(false);
    setN5ConjugationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="appShell" data-theme={theme}>
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <AppHeader
        onHome={goHome}
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        showFurigana={showFurigana}
        onToggleFurigana={() => setShowFurigana((current) => !current)}
      />
      <AiChatBox lesson={lesson} />
      {!lesson && !questionWordsOpen && !jlptPracticeOpen && !n5ConjugationOpen && (
        <Dashboard
          onSelect={(selected) => { setLesson(selected); window.scrollTo(0, 0); }}
          onQuestionWords={() => { setQuestionWordsOpen(true); window.scrollTo(0, 0); }}
          onJlptPractice={() => { setJlptPracticeOpen(true); window.scrollTo(0, 0); }}
          onN5Conjugation={() => { setN5ConjugationOpen(true); window.scrollTo(0, 0); }}
        />
      )}
      {questionWordsOpen && <QuestionWordsScreen onBack={goHome} />}
      {jlptPracticeOpen && <JlptPracticeScreen onBack={goHome} />}
      {n5ConjugationOpen && <N5ConjugationScreen onBack={goHome} />}
      {lesson && !mode && (
        <LessonMenu
          lesson={lesson}
          onBack={goHome}
          onMode={(selected) => { setMode(selected); window.scrollTo(0, 0); }}
        />
      )}
      {lesson && mode === "review" && (
        <ReviewScreen lesson={lesson} onBack={() => setMode(null)} />
      )}
      {lesson && mode && mode !== "review" && (
        <PracticeScreen
          lesson={lesson}
          modeId={mode}
          onBack={() => setMode(null)}
          showFurigana={showFurigana}
        />
      )}
      <footer>
        <Brand />
        <p>Học ít hơn từng lần. Nhớ lâu hơn từng cụm.</p>
        <span>© 2026 MANABU</span>
      </footer>
    </div>
  );
}
