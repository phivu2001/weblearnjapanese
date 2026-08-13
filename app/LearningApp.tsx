"use client";

/* eslint-disable react/prop-types */

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { grammarPoints16to25, kanjiVocabulary16to25 } from "./lessonContent16to25";
import {
  jlptPracticeGroups,
  jlptPracticeStats,
  type JlptPracticeGroup,
  type JlptPracticeQuestion,
  type JlptPracticeSection,
  type JlptPracticeTest,
} from "./jlptPracticeData";

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
  | "vocabulary"
  | "grammar";
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

function Dashboard({
  onSelect,
  onQuestionWords,
  onJlptPractice,
}: {
  onSelect: (lesson: Lesson) => void;
  onQuestionWords: () => void;
  onJlptPractice: () => void;
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
          <div><strong>{detail.sentence_count ?? authoredSentenceCounts[lesson.id] ?? 0}</strong><span>CÂU MẪU</span></div>
          <div><strong>9</strong><span>CHẾ ĐỘ</span></div>
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
                <h3>{mode.title}</h3>
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

function EmptyPractice({
  onBack,
  modeId,
}: {
  onBack: () => void;
  modeId: ModeId;
}) {
  const isKanji = modeId === "kanji" || modeId === "kanji-words";
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

function PracticeHeader({
  lesson,
  mode,
  current,
  total,
  onBack,
  showFurigana,
  onToggleFurigana,
}: {
  lesson: Lesson;
  mode: (typeof modes)[number];
  current: number;
  total: number;
  onBack: () => void;
  showFurigana: boolean;
  onToggleFurigana: () => void;
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
        <button
          type="button"
          onClick={onToggleFurigana}
          aria-pressed={showFurigana}
          aria-label={showFurigana ? "Ẩn Furigana" : "Hiện Furigana"}
          style={{
            marginTop: 8,
            border: "1px solid rgba(23, 33, 31, 0.14)",
            borderRadius: 999,
            background: showFurigana
              ? "rgba(116, 189, 162, 0.18)"
              : "rgba(255, 255, 255, 0.72)",
            color: "var(--ink)",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.04em",
            padding: "7px 11px",
          }}
        >
          Hiện Furigana {showFurigana ? "✓" : "—"}
        </button>
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
      <button onClick={onPrevious} disabled={index === 0}>← Câu trước</button>
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
      <button onClick={onNext} disabled={index >= total - 1}>Câu tiếp →</button>
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
  const keyChunks = sentence.chunks.filter((chunk) => chunk.is_grammar_key);

  const check = () => {
    const correct = keyChunks.every((chunk) =>
      matchesJapaneseAnswer(answers[chunk.id] ?? "", chunk.japanese, chunk.kanji_variants),
    );
    setFeedback(
      correct
        ? { kind: "success", message: "Bạn đã đặt đúng mảnh ngữ pháp vào câu." }
        : { kind: "error", message: "Hãy nhìn nghĩa tiếng Việt và thử lại từng ký tự." },
    );
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

  const toggleAnswer = () => {
    const nextShowAnswer = !showAnswer;
    setShowAnswer(nextShowAnswer);

    if (nextShowAnswer) {
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
      <div className="clozeActions">
        <button
          className="answerButton"
          type="button"
          onClick={toggleAnswer}
          aria-pressed={showAnswer}
        >
          {showAnswer ? "Ẩn đáp án" : "Xem đáp án"}
          <span aria-hidden="true">{showAnswer ? "×" : "目"}</span>
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
  // Only reveal Vietnamese translations after a correct answer
  const [showVietnamese, setShowVietnamese] = useState(false);

  const reset = useCallback(() => {
    setBank(shuffleChunks(sentence.chunks));
    setAnswer([]);
    setFeedback(null);
    setShowVietnamese(false);
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
  };

  const handleEnter = useCallback(() => {
    if (feedback?.kind === "success") {
      onAdvance();
      return;
    }
    check();
  }, [feedback?.kind, onAdvance, check]);

  useEnterShortcut(handleEnter);

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

function KanjiMode({
  sentence,
  sentences,
}: {
  sentence: Sentence;
  sentences: Sentence[];
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
}: {
  item: KanjiVocabularyItem;
  items: KanjiVocabularyItem[];
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
}: {
  item: VocabularyQuizItem;
  items: VocabularyQuizItem[];
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

function GrammarMode({ point }: { point: GrammarPoint }) {
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
      )}
    </main>
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
  onToggleFurigana,
}: {
  lesson: Lesson;
  modeId: ModeId;
  onBack: () => void;
  showFurigana: boolean;
  onToggleFurigana: () => void;
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
  const next = () => setIndex((current) => Math.min(current + 1, total - 1));
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
        showFurigana={showFurigana}
        onToggleFurigana={onToggleFurigana}
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
              />
            )}
            {modeId === "kanji-words" && (
              <KanjiWordMode
                key={`${lesson.id}-${kanjiWords[displayedIndex].kanji}`}
                item={kanjiWords[displayedIndex]}
                items={kanjiWords}
              />
            )}
            {modeId === "vocabulary" && (
              <VocabularyMode
                key={`${lesson.id}-${vocabularyItems[displayedIndex].id}`}
                item={vocabularyItems[displayedIndex]}
                items={vocabularyItems}
              />
            )}
            {modeId === "grammar" && (
              <GrammarMode
                key={`${lesson.id}-${displayedIndex}`}
                point={lessonGrammarPoints[displayedIndex]}
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

export function LearningApp() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [mode, setMode] = useState<ModeId | null>(null);
  const [questionWordsOpen, setQuestionWordsOpen] = useState(false);
  const [jlptPracticeOpen, setJlptPracticeOpen] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [furiganaPreferenceReady, setFuriganaPreferenceReady] = useState(false);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="appShell">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <AppHeader onHome={goHome} />
      {!lesson && !questionWordsOpen && !jlptPracticeOpen && (
        <Dashboard
          onSelect={(selected) => { setLesson(selected); window.scrollTo(0, 0); }}
          onQuestionWords={() => { setQuestionWordsOpen(true); window.scrollTo(0, 0); }}
          onJlptPractice={() => { setJlptPracticeOpen(true); window.scrollTo(0, 0); }}
        />
      )}
      {questionWordsOpen && <QuestionWordsScreen onBack={goHome} />}
      {jlptPracticeOpen && <JlptPracticeScreen onBack={goHome} />}
      {lesson && !mode && (
        <LessonMenu
          lesson={lesson}
          onBack={goHome}
          onMode={(selected) => { setMode(selected); window.scrollTo(0, 0); }}
        />
      )}
      {lesson && mode && (
        <PracticeScreen
          lesson={lesson}
          modeId={mode}
          onBack={() => setMode(null)}
          showFurigana={showFurigana}
          onToggleFurigana={() => setShowFurigana((current) => !current)}
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
