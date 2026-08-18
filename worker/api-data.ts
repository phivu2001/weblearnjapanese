import {
  generatedPassages,
  generatedSentences,
} from "./lesson-data.generated";

type EdgeChunk = {
  id: number;
  order_index: number;
  japanese: string;
  vietnamese: string;
  is_grammar_key: boolean;
  kanji_variants?: string | null;
};

type EdgeSentence = {
  id: number;
  lesson_id: number;
  passage_id: null;
  full_japanese: string;
  full_romaji: string;
  full_vietnamese: string;
  audio_url: null;
  kanji_variants?: string | null;
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
  sentence_count: generatedSentences[index + 1]?.length ?? 0,
  passage_count: generatedPassages[index + 1]?.length ?? 0,
}));

export const edgeSentences = generatedSentences as unknown as Record<
  number,
  EdgeSentence[]
>;

export const edgePassages = generatedPassages as unknown as Record<
  number,
  unknown[]
>;

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
