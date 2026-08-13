export type JlptQuestionKind = "choice" | "order" | "reading";

export type JlptPracticeQuestion = {
  id: string;
  kind: JlptQuestionKind;
  instruction: string;
  prompt: string;
  underline?: string;
  passage?: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export type JlptPracticeTest = {
  id: string;
  title: string;
  durationMinutes: number;
  questions: JlptPracticeQuestion[];
};

export type JlptPracticeSection = "skill" | "mock";

export type JlptPracticeGroup = {
  id: string;
  section: JlptPracticeSection;
  title: string;
  subtitle: string;
  badge: string;
  totalTests: number;
  totalMinutes: number;
  tests: JlptPracticeTest[];
};

type QuestionSeed = Omit<JlptPracticeQuestion, "id">;
const QUESTIONS_PER_TEST = 10;

const mondai1: QuestionSeed[] = [
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "あした 学校へ 行きます。",
    underline: "学校",
    choices: ["がっこう", "かっこう", "がくせい", "こうこう"],
    answer: "がっこう",
    explanation: "学校 đọc là がっこう, nghĩa là trường học.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "毎朝 六時に 起きます。",
    underline: "毎朝",
    choices: ["まいあさ", "まいばん", "まいつき", "まいにち"],
    answer: "まいあさ",
    explanation: "毎朝 đọc là まいあさ, nghĩa là mỗi sáng.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "駅で 友だちに 会いました。",
    underline: "駅",
    choices: ["えき", "みせ", "うち", "へや"],
    answer: "えき",
    explanation: "駅 đọc là えき, nghĩa là nhà ga.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "日本語を 勉強しています。",
    underline: "日本語",
    choices: ["にほんご", "にちほんご", "にっぽんご", "ほんご"],
    answer: "にほんご",
    explanation: "日本語 đọc là にほんご, nghĩa là tiếng Nhật.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "食堂で 昼ご飯を 食べます。",
    underline: "食堂",
    choices: ["しょくどう", "しょくたん", "たべどう", "しょどう"],
    answer: "しょくどう",
    explanation: "食堂 đọc là しょくどう, nghĩa là nhà ăn.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "電話を かけても いいですか。",
    underline: "電話",
    choices: ["でんわ", "でんしゃ", "てがみ", "ばんごう"],
    answer: "でんわ",
    explanation: "電話 đọc là でんわ, nghĩa là điện thoại.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "先生は 教室に います。",
    underline: "先生",
    choices: ["せんせい", "がくせい", "せんしゅう", "せいかつ"],
    answer: "せんせい",
    explanation: "先生 đọc là せんせい, nghĩa là giáo viên.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "大学は 駅の 近くです。",
    underline: "大学",
    choices: ["だいがく", "たいがく", "だいかく", "がっこう"],
    answer: "だいがく",
    explanation: "大学 đọc là だいがく, nghĩa là đại học.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "父は 毎日 新聞を 読みます。",
    underline: "新聞",
    choices: ["しんぶん", "ざっし", "じしょ", "てちょう"],
    answer: "しんぶん",
    explanation: "新聞 đọc là しんぶん, nghĩa là báo.",
  },
  {
    kind: "choice",
    instruction: "Chọn cách đọc đúng của chữ Hán được gạch chân.",
    prompt: "銀行は 九時からです。",
    underline: "銀行",
    choices: ["ぎんこう", "ぎんこ", "きんこう", "ゆうびんきょく"],
    answer: "ぎんこう",
    explanation: "銀行 đọc là ぎんこう, nghĩa là ngân hàng.",
  },
];

const mondai2: QuestionSeed[] = [
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "きょうは いい てんきです。",
    underline: "てんき",
    choices: ["天気", "電気", "元気", "人気"],
    answer: "天気",
    explanation: "てんき viết là 天気, nghĩa là thời tiết.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "きのう としょかんへ 行きました。",
    underline: "としょかん",
    choices: ["図書館", "映画館", "美術館", "体育館"],
    answer: "図書館",
    explanation: "としょかん viết là 図書館, nghĩa là thư viện.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "まいにち しんぶんを 読みます。",
    underline: "しんぶん",
    choices: ["新聞", "雑誌", "辞書", "手紙"],
    answer: "新聞",
    explanation: "しんぶん viết là 新聞, nghĩa là báo.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "ここは かいしゃです。",
    underline: "かいしゃ",
    choices: ["会社", "学校", "銀行", "病院"],
    answer: "会社",
    explanation: "かいしゃ viết là 会社, nghĩa là công ty.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "あした がっこうへ 行きます。",
    underline: "がっこう",
    choices: ["学校", "大学", "会社", "教室"],
    answer: "学校",
    explanation: "がっこう viết là 学校, nghĩa là trường học.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "あの人は にほんごの せんせいです。",
    underline: "せんせい",
    choices: ["先生", "学生", "医者", "会社員"],
    answer: "先生",
    explanation: "せんせい viết là 先生, nghĩa là giáo viên.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "あとで でんわを します。",
    underline: "でんわ",
    choices: ["電話", "電車", "写真", "手紙"],
    answer: "電話",
    explanation: "でんわ viết là 電話, nghĩa là điện thoại.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "えきで 友だちを 待ちます。",
    underline: "えき",
    choices: ["駅", "店", "家", "国"],
    answer: "駅",
    explanation: "えき viết là 駅, nghĩa là nhà ga.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "ぎんこうは 何時までですか。",
    underline: "ぎんこう",
    choices: ["銀行", "郵便局", "会社", "受付"],
    answer: "銀行",
    explanation: "ぎんこう viết là 銀行, nghĩa là ngân hàng.",
  },
  {
    kind: "choice",
    instruction: "Chọn chữ Hán đúng với phần Hiragana.",
    prompt: "兄は だいがくで 勉強しています。",
    underline: "だいがく",
    choices: ["大学", "学校", "教室", "会議室"],
    answer: "大学",
    explanation: "だいがく viết là 大学, nghĩa là đại học.",
  },
];

const mondai3: QuestionSeed[] = [
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "わたしは 毎朝 コーヒーを ___。",
    choices: ["飲みます", "見ます", "聞きます", "書きます"],
    answer: "飲みます",
    explanation: "コーヒー đi với động từ 飲みます: uống cà phê.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "日曜日に 友だちと 映画を ___。",
    choices: ["見ました", "買いました", "寝ました", "帰りました"],
    answer: "見ました",
    explanation: "映画を見る là xem phim.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "これは 日本語の ___です。",
    choices: ["辞書", "机", "駅", "切符"],
    answer: "辞書",
    explanation: "日本語の辞書 nghĩa là từ điển tiếng Nhật.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "スーパーで パンを ___。",
    choices: ["買いました", "起きました", "泳ぎました", "住みました"],
    answer: "買いました",
    explanation: "スーパーで買います: mua ở siêu thị.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "駅で 電車の ___を 買います。",
    choices: ["切符", "辞書", "時計", "料理"],
    answer: "切符",
    explanation: "電車の切符 nghĩa là vé tàu điện.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "喫茶店で お茶を ___。",
    choices: ["飲みます", "書きます", "撮ります", "送ります"],
    answer: "飲みます",
    explanation: "お茶を飲みます nghĩa là uống trà.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "毎晩 日本語を ___。",
    choices: ["勉強します", "運転します", "料理します", "散歩します"],
    answer: "勉強します",
    explanation: "日本語を勉強します nghĩa là học tiếng Nhật.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "友だちに 写真を ___。",
    choices: ["見せました", "寝ました", "降りました", "曲がりました"],
    answer: "見せました",
    explanation: "写真を見せます nghĩa là cho xem ảnh.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "あした 京都へ ___。",
    choices: ["行きます", "あります", "います", "できます"],
    answer: "行きます",
    explanation: "京都へ行きます nghĩa là đi Kyoto.",
  },
  {
    kind: "choice",
    instruction: "Chọn từ phù hợp để điền vào ô trống.",
    prompt: "部屋を きれいに ___ください。",
    choices: ["して", "見て", "来て", "買って"],
    answer: "して",
    explanation: "きれいにしてください nghĩa là hãy làm cho sạch/đẹp.",
  },
];

const mondai4: QuestionSeed[] = [
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "山田さんは 会社員です。",
    choices: [
      "山田さんは 会社で 働いています。",
      "山田さんは 学校で 勉強しています。",
      "山田さんは 病院で 休んでいます。",
      "山田さんは 駅で 待っています。",
    ],
    answer: "山田さんは 会社で 働いています。",
    explanation: "会社員 là nhân viên công ty, nên nghĩa gần nhất là làm việc ở công ty.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "きのうは とても 暑かったです。",
    choices: [
      "きのうは 気温が 高かったです。",
      "きのうは 雨が 多かったです。",
      "きのうは 風が 強かったです。",
      "きのうは 人が 少なかったです。",
    ],
    answer: "きのうは 気温が 高かったです。",
    explanation: "暑い diễn tả thời tiết nóng, gần với 気温が高い.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "ここで 写真を 撮ってもいいです。",
    choices: [
      "ここで 写真を 撮ることが できます。",
      "ここで 写真を 撮ってはいけません。",
      "ここで 写真を 撮りたいですか。",
      "ここで 写真を 撮りませんでした。",
    ],
    answer: "ここで 写真を 撮ることが できます。",
    explanation: "Vてもいいです diễn tả được phép làm gì.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "もう 昼ご飯を 食べました。",
    choices: [
      "昼ご飯は もう 終わりました。",
      "これから 昼ご飯を 食べます。",
      "昼ご飯を 食べたくないです。",
      "昼ご飯を 食べません。",
    ],
    answer: "昼ご飯は もう 終わりました。",
    explanation: "もう...ました nghĩa là đã làm xong rồi.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "わたしは 日本語が 少し わかります。",
    choices: [
      "日本語を 少し 理解できます。",
      "日本語を 全然 勉強しません。",
      "日本語を 話してはいけません。",
      "日本語の 本を 買いました。",
    ],
    answer: "日本語を 少し 理解できます。",
    explanation: "わかります gần nghĩa với 理解できます: có thể hiểu.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "ここは 静かではありません。",
    choices: [
      "ここは にぎやかです。",
      "ここは 便利です。",
      "ここは 新しいです。",
      "ここは 広いです。",
    ],
    answer: "ここは にぎやかです。",
    explanation: "静かではありません nghĩa là không yên tĩnh, gần với にぎやかです.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "あした 会社へ 行かなくてもいいです。",
    choices: [
      "あした 会社へ 行く必要が ありません。",
      "あした 会社へ 行ってください。",
      "あした 会社へ 行ってはいけません。",
      "あした 会社へ 行きたいです。",
    ],
    answer: "あした 会社へ 行く必要が ありません。",
    explanation: "Vなくてもいいです nghĩa là không cần làm cũng được.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "このかばんは とても 高いです。",
    choices: [
      "このかばんは 値段が 高いです。",
      "このかばんは 背が 高いです。",
      "このかばんは 古いです。",
      "このかばんは 軽いです。",
    ],
    answer: "このかばんは 値段が 高いです。",
    explanation: "Với đồ vật, 高い thường nói về giá cao.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "日曜日だけ 休みです。",
    choices: [
      "休みは 日曜日だけです。",
      "日曜日は 仕事です。",
      "毎日 休みです。",
      "日曜日も 休みではありません。",
    ],
    answer: "休みは 日曜日だけです。",
    explanation: "だけ nghĩa là chỉ, chỉ có Chủ nhật là ngày nghỉ.",
  },
  {
    kind: "choice",
    instruction: "Chọn câu có nghĩa tương đồng.",
    prompt: "駅まで 歩いて 行きます。",
    choices: [
      "駅へ 徒歩で 行きます。",
      "駅へ 電車で 行きます。",
      "駅で 歩きます。",
      "駅から 帰ります。",
    ],
    answer: "駅へ 徒歩で 行きます。",
    explanation: "歩いて行きます gần nghĩa với 徒歩で行きます: đi bộ.",
  },
];

const mondai5: QuestionSeed[] = [
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "わたしは ベトナム ___ 来ました。",
    choices: ["から", "まで", "で", "を"],
    answer: "から",
    explanation: "Nから来ました diễn tả đến từ đâu.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "駅 ___ 友だちに 会いました。",
    choices: ["で", "を", "へ", "から"],
    answer: "で",
    explanation: "で chỉ địa điểm xảy ra hành động.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "この 本は あまり ___。",
    choices: ["おもしろくないです", "おもしろいです", "おもしろかったです", "おもしろくてです"],
    answer: "おもしろくないです",
    explanation: "あまり đi với phủ định: không... lắm.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "あした 雨が ___、行きません。",
    choices: ["降ったら", "降って", "降るから", "降りますと"],
    answer: "降ったら",
    explanation: "Vたら dùng cho điều kiện: nếu trời mưa.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "わたしは 友だち ___ プレゼントを もらいました。",
    choices: ["に", "を", "で", "へ"],
    answer: "に",
    explanation: "Nに もらいます diễn tả nhận từ ai.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "この 部屋は ___ きれいです。",
    choices: ["広くて", "広いで", "広く", "広かった"],
    answer: "広くて",
    explanation: "Tính từ い nối câu đổi い thành くて.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "毎日 一時間ぐらい 日本語を ___。",
    choices: ["勉強します", "勉強です", "勉強にします", "勉強があります"],
    answer: "勉強します",
    explanation: "Danh từ Hán + します tạo động từ: 勉強します.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "ここで たばこを ___。",
    choices: ["吸ってはいけません", "吸ってもいいです", "吸いたいです", "吸いましたか"],
    answer: "吸ってはいけません",
    explanation: "Vてはいけません diễn tả cấm/không được làm.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "わたしは 新しい パソコン ___ ほしいです。",
    choices: ["が", "を", "に", "で"],
    answer: "が",
    explanation: "Nがほしいです diễn tả muốn có một vật gì.",
  },
  {
    kind: "choice",
    instruction: "Chọn đáp án ngữ pháp đúng.",
    prompt: "宿題を ___から、テレビを 見ます。",
    choices: ["して", "した", "します", "しない"],
    answer: "して",
    explanation: "Vてから diễn tả sau khi làm việc gì.",
  },
];

const mondai6: QuestionSeed[] = [
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Tôi đã xem phim với bạn hôm qua.",
    choices: ["わたしは", "きのう", "友だちと", "映画を", "見ました"],
    answer: "わたしは きのう 友だちと 映画を 見ました",
    explanation: "Trật tự tự nhiên: chủ đề + thời gian + người đi cùng + tân ngữ + động từ.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Xin hãy viết tên ở đây.",
    choices: ["ここに", "名前を", "書いて", "ください"],
    answer: "ここに 名前を 書いて ください",
    explanation: "Vてください dùng để yêu cầu lịch sự.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Tôi muốn đi Nhật Bản để học tiếng Nhật.",
    choices: ["日本語を", "勉強しに", "日本へ", "行きたいです"],
    answer: "日本語を 勉強しに 日本へ 行きたいです",
    explanation: "Vます bỏ ます + に 行きます diễn tả mục đích đi.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Sau khi ăn sáng, tôi đi làm.",
    choices: ["朝ご飯を", "食べてから", "会社へ", "行きます"],
    answer: "朝ご飯を 食べてから 会社へ 行きます",
    explanation: "Vてから diễn tả sau khi làm việc gì.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Bạn có thể nói tiếng Nhật không?",
    choices: ["日本語を", "話す", "ことが", "できますか"],
    answer: "日本語を 話す ことが できますか",
    explanation: "Vることができます diễn tả khả năng làm gì.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Tôi đã nhận sách từ thầy giáo.",
    choices: ["先生に", "本を", "もらいました"],
    answer: "先生に 本を もらいました",
    explanation: "Người cho/nguồn nhận dùng に với もらいます.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Vì hôm nay bận nên tôi không đi.",
    choices: ["きょうは", "忙しいですから", "行きません"],
    answer: "きょうは 忙しいですから 行きません",
    explanation: "から nối lý do với kết quả.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Tôi muốn ăn sushi ở Nhật.",
    choices: ["日本で", "すしを", "食べたいです"],
    answer: "日本で すしを 食べたいです",
    explanation: "Vたいです diễn tả mong muốn làm gì.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Trước khi ngủ, tôi đọc sách.",
    choices: ["寝る", "前に", "本を", "読みます"],
    answer: "寝る 前に 本を 読みます",
    explanation: "Vる前に diễn tả trước khi làm gì.",
  },
  {
    kind: "order",
    instruction: "Sắp xếp các mảnh để tạo thành câu đúng.",
    prompt: "Tôi nghĩ ngày mai trời sẽ lạnh.",
    choices: ["あしたは", "寒いと", "思います"],
    answer: "あしたは 寒いと 思います",
    explanation: "普通形 + と思います diễn tả suy nghĩ/ý kiến.",
  },
];

const mondai7: QuestionSeed[] = [
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "きのう、ミンさんは 友だちと 図書館へ 行きました。そこで 日本語の 本を 読みました。午後三時に うちへ 帰りました。",
    prompt: "ミンさんは どこで 日本語の 本を 読みましたか。",
    choices: ["図書館", "学校", "会社", "駅"],
    answer: "図書館",
    explanation: "Trong đoạn có câu: 図書館へ行きました。そこで日本語の本を読みました。",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "田中さんは 毎朝 七時に 起きます。朝ご飯を 食べて、八時に 電車で 会社へ 行きます。",
    prompt: "田中さんは 何で 会社へ 行きますか。",
    choices: ["電車", "自転車", "車", "バス"],
    answer: "電車",
    explanation: "電車で会社へ行きます nghĩa là đi làm bằng tàu điện.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "日曜日は 雨でした。わたしは どこへも 行きませんでした。うちで 音楽を 聞いて、手紙を 書きました。",
    prompt: "日曜日、わたしは 何を しましたか。",
    choices: ["音楽を聞いて、手紙を書きました", "映画を見に行きました", "友だちに会いました", "買い物しました"],
    answer: "音楽を聞いて、手紙を書きました",
    explanation: "Đoạn văn nói người viết ở nhà, nghe nhạc và viết thư.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "この店は 午前十時から 午後八時までです。火曜日は 休みです。",
    prompt: "この店は いつ 休みですか。",
    choices: ["火曜日", "月曜日", "土曜日", "日曜日"],
    answer: "火曜日",
    explanation: "火曜日は休みです nghĩa là thứ Ba nghỉ.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "リーさんは 先週 京都へ 行きました。新幹線で 行きました。京都で 古い お寺を 見ました。",
    prompt: "リーさんは 何で 京都へ 行きましたか。",
    choices: ["新幹線", "バス", "飛行機", "自転車"],
    answer: "新幹線",
    explanation: "Đoạn văn nói 新幹線で行きました: đã đi bằng Shinkansen.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "マリアさんは 土曜日に デパートで 靴を 買いました。靴は 六千円でした。",
    prompt: "靴は いくらでしたか。",
    choices: ["六千円", "三千円", "八千円", "一万円"],
    answer: "六千円",
    explanation: "靴は六千円でした nghĩa là đôi giày giá 6.000 yên.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "朝、雨が 降っていましたから、山田さんは タクシーで 会社へ 行きました。",
    prompt: "どうして 山田さんは タクシーで 行きましたか。",
    choices: ["雨が降っていましたから", "電車が好きですから", "会社が近いですから", "休みでしたから"],
    answer: "雨が降っていましたから",
    explanation: "Lý do được nêu bằng から: vì trời đang mưa.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "わたしの うちの 近くに 小さい 公園が あります。日曜日に よく そこで 散歩します。",
    prompt: "わたしは 日曜日に よく 何を しますか。",
    choices: ["散歩します", "勉強します", "買い物します", "料理します"],
    answer: "散歩します",
    explanation: "そこで散歩します nghĩa là đi dạo ở đó.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "佐藤さんは 来月 ベトナムへ 行きます。ベトナム料理を 食べたいです。",
    prompt: "佐藤さんは 何を 食べたいですか。",
    choices: ["ベトナム料理", "日本料理", "中華料理", "韓国料理"],
    answer: "ベトナム料理",
    explanation: "ベトナム料理を食べたいです nghĩa là muốn ăn món Việt Nam.",
  },
  {
    kind: "reading",
    instruction: "Đọc đoạn văn và chọn đáp án đúng.",
    passage: "きのうは 母の 誕生日でした。わたしは 花を 買って、母に あげました。",
    prompt: "わたしは 母に 何を あげましたか。",
    choices: ["花", "本", "時計", "写真"],
    answer: "花",
    explanation: "花を買って、母にあげました nghĩa là đã mua hoa và tặng mẹ.",
  },
];

const skillDefinitions = [
  {
    id: "mondai-1",
    title: "Mondai 1 - Đọc chữ Hán",
    subtitle: "Nhìn chữ Hán trong câu và chọn cách đọc Hiragana đúng.",
    durationMinutes: 5,
    bank: mondai1,
  },
  {
    id: "mondai-2",
    title: "Mondai 2 - Tìm chữ Hán đúng",
    subtitle: "Nhìn Hiragana trong câu và chọn chữ Hán phù hợp.",
    durationMinutes: 5,
    bank: mondai2,
  },
  {
    id: "mondai-3",
    title: "Mondai 3 - Điền từ phù hợp",
    subtitle: "Chọn từ đúng để hoàn thành câu theo ngữ cảnh.",
    durationMinutes: 5,
    bank: mondai3,
  },
  {
    id: "mondai-4",
    title: "Mondai 4 - Câu nghĩa tương đồng",
    subtitle: "Chọn câu diễn đạt cùng ý với câu đề bài.",
    durationMinutes: 3,
    bank: mondai4,
  },
  {
    id: "mondai-5",
    title: "Mondai 5 - Ngữ pháp 1",
    subtitle: "Chọn trợ từ, mẫu câu hoặc biến đổi đúng.",
    durationMinutes: 9,
    bank: mondai5,
  },
  {
    id: "mondai-6",
    title: "Mondai 6 - Sắp xếp câu",
    subtitle: "Ghép các mảnh đáp án thành câu có nghĩa.",
    durationMinutes: 8,
    bank: mondai6,
  },
  {
    id: "mondai-7",
    title: "Mondai 7 - Hoàn thành đoạn văn",
    subtitle: "Đọc đoạn ngắn và chọn đáp án phù hợp.",
    durationMinutes: 8,
    bank: mondai7,
  },
] as const;

function buildQuestions(groupId: string, testNumber: number, bank: readonly QuestionSeed[]) {
  return Array.from({ length: Math.min(QUESTIONS_PER_TEST, bank.length) }, (_, questionIndex) => {
    const seed = bank[(testNumber - 1 + questionIndex) % bank.length];
    return {
      ...seed,
      id: `${groupId}-${testNumber}-${questionIndex + 1}`,
    };
  });
}

function buildTests(
  groupId: string,
  count: number,
  durationMinutes: number,
  bank: readonly QuestionSeed[],
  titlePrefix = "Đề số",
) {
  return Array.from({ length: count }, (_, index) => {
    const testNumber = index + 1;
    return {
      id: `${groupId}-${testNumber}`,
      title: `${titlePrefix} ${testNumber}`,
      durationMinutes,
      questions: buildQuestions(groupId, testNumber, bank),
    };
  });
}

const skillGroups: JlptPracticeGroup[] = skillDefinitions.map((definition) => ({
  id: definition.id,
  section: "skill",
  title: definition.title,
  subtitle: definition.subtitle,
  badge: "Luyện kỹ năng thi JLPT",
  totalTests: 20,
  totalMinutes: definition.durationMinutes * 20,
  tests: buildTests(definition.id, 20, definition.durationMinutes, definition.bank),
}));

const mockBank = [
  mondai1[0],
  mondai2[1],
  mondai3[2],
  mondai4[0],
  mondai5[1],
  mondai6[2],
  mondai7[3],
  mondai1[6],
  mondai5[4],
  mondai7[8],
];

const mockGroup: JlptPracticeGroup = {
  id: "mock-test",
  section: "mock",
  title: "Luyện đề thi thử",
  subtitle: "Làm bài theo nhịp đề tổng hợp N5, gồm chữ Hán, từ vựng, ngữ pháp, sắp xếp và đọc hiểu.",
  badge: "Luyện đề thi thử",
  totalTests: 5,
  totalMinutes: 450,
  tests: buildTests("mock-test", 5, 90, mockBank, "Đề thi thử số"),
};

export const jlptPracticeGroups: JlptPracticeGroup[] = [...skillGroups, mockGroup];

export const jlptPracticeStats = {
  skillGroups: skillGroups.length,
  skillTests: skillGroups.reduce((sum, group) => sum + group.totalTests, 0),
  mockTests: mockGroup.totalTests,
  totalTests: skillGroups.reduce((sum, group) => sum + group.totalTests, 0) + mockGroup.totalTests,
};
