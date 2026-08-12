type EdgeChunk = {
  id: number;
  order_index: number;
  japanese: string;
  vietnamese: string;
  is_grammar_key: boolean;
};

type EdgeSentence = {
  id: number;
  lesson_id: number;
  passage_id: null;
  full_japanese: string;
  full_romaji: string;
  full_vietnamese: string;
  audio_url: null;
  chunks: EdgeChunk[];
};

const descriptions = [
  "Giới thiệu bản thân", "Đồ vật và đại từ chỉ định", "Địa điểm và phương hướng",
  "Thời gian và lịch sinh hoạt", "Di chuyển và phương tiện", "Hành động hằng ngày",
  "Cho, nhận và công cụ", "Tính từ và miêu tả", "Sở thích và năng lực",
  "Sự tồn tại của người và vật", "Số lượng và khoảng thời gian", "So sánh và lựa chọn",
  "Mong muốn và mục đích", "Yêu cầu và hướng dẫn", "Hành động đang diễn ra",
  "Nối câu và trình tự hành động", "Cấm đoán và nghĩa vụ", "Khả năng và sở thích",
  "Kinh nghiệm và thay đổi", "Mệnh đề bổ nghĩa", "Thể thông thường",
  "Mệnh đề danh từ và trích dẫn", "Thời điểm và tình huống", "Cho và nhận hành động",
  "Điều kiện và giả định", "Giải thích nguyên nhân", "Khả năng và giác quan",
  "Hành động đồng thời", "Tự động từ và trạng thái", "Chuẩn bị và hoàn tất",
  "Ý định và kế hoạch", "Lời khuyên và suy đoán", "Mệnh lệnh và truyền đạt",
  "Bị động", "Danh từ hóa hành động", "Mục đích và công dụng", "Trạng thái kết quả",
  "Điều kiện cần thiết", "Nguyên nhân và hệ quả", "Hỏi gián tiếp và thử làm",
  "Cho và nhận lịch sự", "Mục đích và nỗ lực", "Vẻ ngoài và xu hướng",
  "Giả định và nhượng bộ", "Trường hợp và hoàn cảnh", "Cấu trúc ところ và vừa mới",
  "Truyền đạt thông tin", "Thể sai khiến", "Kính ngữ", "Khiêm nhường ngữ",
];

export const edgeLessons = descriptions.map((description, index) => ({
  id: index + 1,
  title: `Bài ${index + 1}`,
  description,
}));

function sentence(
  id: number,
  lessonId: number,
  japanese: string,
  romaji: string,
  vietnamese: string,
  parts: Array<[string, string, boolean]>,
): EdgeSentence {
  return {
    id,
    lesson_id: lessonId,
    passage_id: null,
    full_japanese: japanese,
    full_romaji: romaji,
    full_vietnamese: vietnamese,
    audio_url: null,
    chunks: parts.map(([jp, vi, key], index) => ({
      id: id * 10 + index + 1,
      order_index: index + 1,
      japanese: jp,
      vietnamese: vi,
      is_grammar_key: key,
    })),
  };
}

export const edgeSentences: Record<number, EdgeSentence[]> = {
  1: [
    sentence(1, 1, "わたしはマイです。", "Watashi wa Mai desu.", "Tôi là Mai.", [["わたし", "tôi", false], ["は", "trợ từ chủ đề", true], ["マイです。", "là Mai", false]]),
    sentence(2, 1, "サントスさんはブラジル人です。", "Santosu-san wa Burajiru-jin desu.", "Anh Santos là người Brazil.", [["サントスさん", "anh Santos", false], ["は", "trợ từ chủ đề", true], ["ブラジル人です。", "là người Brazil", false]]),
    sentence(3, 1, "ミラーさんは会社員じゃありません。", "Miraa-san wa kaishain ja arimasen.", "Anh Miller không phải là nhân viên công ty.", [["ミラーさんは", "anh Miller", false], ["会社員", "nhân viên công ty", false], ["じゃありません。", "không phải là", true]]),
  ],
  2: [
    sentence(4, 2, "これは日本語の辞書です。", "Kore wa Nihongo no jisho desu.", "Đây là từ điển tiếng Nhật.", [["これは", "đây thì", true], ["日本語の", "của tiếng Nhật", false], ["辞書です。", "là từ điển", false]]),
    sentence(5, 2, "その傘はわたしのです。", "Sono kasa wa watashi no desu.", "Chiếc ô đó là của tôi.", [["その傘は", "chiếc ô đó", false], ["わたしの", "của tôi", true], ["です。", "là", false]]),
    sentence(6, 2, "これはだれの名刺ですか。", "Kore wa dare no meishi desu ka.", "Đây là danh thiếp của ai?", [["これは", "đây thì", false], ["だれの", "của ai", true], ["名刺ですか。", "là danh thiếp phải không", false]]),
  ],
};

export const edgePassages: Record<number, unknown[]> = {
  1: [{ id: 1, lesson_id: 1, title: "はじめまして — Lần đầu gặp mặt", content: [
    { text: "はじめまして。", meaning: "Rất hân hạnh được gặp bạn.", note: "Lời chào khi gặp lần đầu." },
    { text: "わたし", meaning: "tôi", note: "Đại từ nhân xưng lịch sự, trung tính." },
    { text: "は", meaning: "trợ từ chủ đề", note: "Viết là は nhưng đọc là わ khi làm trợ từ." },
    { text: "グエンです。", meaning: "là Nguyễn.", note: "です kết thúc câu danh từ theo lối lịch sự." },
    { text: "ベトナム人です。", meaning: "Tôi là người Việt Nam.", note: "Tên quốc gia + 人 chỉ quốc tịch." },
    { text: "どうぞよろしくお願いします。", meaning: "Rất mong được bạn giúp đỡ.", note: "Câu chào kết thúc phần tự giới thiệu." },
  ] }],
  2: [{ id: 2, lesson_id: 2, title: "これは何ですか — Đây là gì?", content: [
    { text: "これは", meaning: "cái này", note: "これ dùng cho vật ở gần người nói." },
    { text: "日本語", furigana: "にほんご", meaning: "tiếng Nhật", note: "日本 + 語 (ngôn ngữ)." },
    { text: "の辞書です。", furigana: "のじしょです", meaning: "là từ điển của…", note: "の nối hai danh từ." },
    { text: "あれは", meaning: "cái kia", note: "あれ dùng cho vật xa cả người nói lẫn người nghe." },
    { text: "だれの傘ですか。", furigana: "だれのかさですか", meaning: "là ô của ai?", note: "だれの dùng để hỏi sở hữu." },
  ] }],
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function handleLearningApi(request: Request): Response | null {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/")) return null;
  if (request.method !== "GET") return json({ detail: "Method not allowed" }, 405);
  if (url.pathname === "/api/health") return json({ status: "ok" });
  if (url.pathname === "/api/lessons") return json(edgeLessons);

  const match = url.pathname.match(/^\/api\/lessons\/(\d+)(?:\/(sentences|passages))?$/);
  if (!match) return json({ detail: "Không tìm thấy endpoint." }, 404);
  const lessonId = Number(match[1]);
  const lesson = edgeLessons.find((item) => item.id === lessonId);
  if (!lesson) return json({ detail: "Không tìm thấy bài học." }, 404);
  if (match[2] === "sentences") return json(edgeSentences[lessonId] ?? []);
  if (match[2] === "passages") return json(edgePassages[lessonId] ?? []);
  return json({
    ...lesson,
    sentence_count: edgeSentences[lessonId]?.length ?? 0,
    passage_count: edgePassages[lessonId]?.length ?? 0,
  });
}

