export type KanjiWordExample = {
  kanji: string;
  reading: string;
  vietnamese: string;
};

export type KanjiStudyGuide = {
  components: Array<{
    part: string;
    meaning: string;
  }>;
  composition?: string;
  mnemonic: string;
  on: string[];
  kun: string[];
  examples?: KanjiWordExample[];
};

export const KANJI_STUDY_GUIDES: Record<string, KanjiStudyGuide> = {
  私: {
    components: [
      { part: "禾", meaning: "lúa, cây lúa" },
      { part: "ム", meaning: "riêng tư, của mình" },
    ],
    mnemonic: "Một bó lúa mình giữ riêng cho bản thân: đó là “tôi”.",
    on: ["シ"],
    kun: ["わたし", "わたくし"],
    examples: [
      { kanji: "私", reading: "わたし", vietnamese: "tôi" },
      { kanji: "私立", reading: "しりつ", vietnamese: "tư lập" },
      { kanji: "私用", reading: "しよう", vietnamese: "việc riêng" },
    ],
  },
  学: {
    components: [
      { part: "⺍/冖", meaning: "mái nhà, che phủ" },
      { part: "子", meaning: "đứa trẻ" },
    ],
    mnemonic: "Đứa trẻ ngồi dưới mái nhà chăm chú học bài.",
    on: ["ガク"],
    kun: ["まな(ぶ)"],
    examples: [
      { kanji: "学校", reading: "がっこう", vietnamese: "trường học" },
      { kanji: "学生", reading: "がくせい", vietnamese: "học sinh, sinh viên" },
      { kanji: "大学", reading: "だいがく", vietnamese: "đại học" },
      { kanji: "文学", reading: "ぶんがく", vietnamese: "văn học" },
    ],
  },
  生: {
    components: [
      { part: "生", meaning: "mầm cây mọc lên từ đất" },
    ],
    mnemonic: "Một mầm cây vươn lên khỏi mặt đất: sự sống được sinh ra.",
    on: ["セイ", "ショウ"],
    kun: ["い(きる)", "う(まれる)", "なま"],
    examples: [
      { kanji: "学生", reading: "がくせい", vietnamese: "học sinh, sinh viên" },
      { kanji: "先生", reading: "せんせい", vietnamese: "thầy/cô giáo" },
      { kanji: "誕生日", reading: "たんじょうび", vietnamese: "sinh nhật" },
      { kanji: "生まれる", reading: "うまれる", vietnamese: "được sinh ra" },
    ],
  },
  先: {
    components: [
      { part: "土/ノ", meaning: "dấu chân phía trước" },
      { part: "儿", meaning: "người, đôi chân" },
    ],
    mnemonic: "Người có đôi chân bước lên phía trước nên là “trước/tiên”.",
    on: ["セン"],
    kun: ["さき"],
    examples: [
      { kanji: "先生", reading: "せんせい", vietnamese: "thầy/cô giáo" },
      { kanji: "先週", reading: "せんしゅう", vietnamese: "tuần trước" },
      { kanji: "先月", reading: "せんげつ", vietnamese: "tháng trước" },
      { kanji: "先に", reading: "さきに", vietnamese: "trước, trước tiên" },
    ],
  },
  休: {
    components: [
      { part: "亻", meaning: "người" },
      { part: "木", meaning: "cây" },
    ],
    composition: "Chữ Hưu (nghỉ ngơi - 休) gồm người (亻) dựa vào cây (木).",
    mnemonic: "Một người đi đường mệt quá bèn tựa lưng vào gốc cây: đó là nghỉ ngơi.",
    on: ["キュウ"],
    kun: ["やす(む)", "やす(み)", "やす(まる)"],
    examples: [
      { kanji: "休みます", reading: "やすみます", vietnamese: "nghỉ" },
      { kanji: "休み", reading: "やすみ", vietnamese: "ngày nghỉ, giờ nghỉ" },
      { kanji: "休日", reading: "きゅうじつ", vietnamese: "ngày nghỉ" },
      { kanji: "休憩", reading: "きゅうけい", vietnamese: "nghỉ giải lao" },
    ],
  },
  会: {
    components: [
      { part: "人", meaning: "người" },
      { part: "云", meaning: "nói, mây lời nói" },
    ],
    mnemonic: "Nhiều người tụ lại và nói chuyện: một cuộc gặp, một hội.",
    on: ["カイ", "エ"],
    kun: ["あ(う)"],
    examples: [
      { kanji: "会社", reading: "かいしゃ", vietnamese: "công ty" },
      { kanji: "会います", reading: "あいます", vietnamese: "gặp" },
      { kanji: "会議", reading: "かいぎ", vietnamese: "cuộc họp" },
      { kanji: "大会", reading: "たいかい", vietnamese: "đại hội, giải đấu" },
    ],
  },
  社: {
    components: [
      { part: "礻", meaning: "bàn thờ, thần linh" },
      { part: "土", meaning: "đất" },
    ],
    mnemonic: "Nơi có bàn thờ trên mảnh đất chung trở thành cộng đồng/xã hội.",
    on: ["シャ"],
    kun: ["やしろ"],
    examples: [
      { kanji: "会社", reading: "かいしゃ", vietnamese: "công ty" },
      { kanji: "社員", reading: "しゃいん", vietnamese: "nhân viên công ty" },
      { kanji: "社会", reading: "しゃかい", vietnamese: "xã hội" },
    ],
  },
  本: {
    components: [
      { part: "木", meaning: "cây" },
      { part: "一", meaning: "vạch gốc" },
    ],
    mnemonic: "Đánh dấu vào gốc cây: phần gốc, nguồn gốc; sách là “gốc” tri thức.",
    on: ["ホン"],
    kun: ["もと"],
    examples: [
      { kanji: "本", reading: "ほん", vietnamese: "sách" },
      { kanji: "日本", reading: "にほん", vietnamese: "Nhật Bản" },
      { kanji: "本屋", reading: "ほんや", vietnamese: "hiệu sách" },
      { kanji: "一本", reading: "いっぽん", vietnamese: "một cây/một chiếc dài" },
    ],
  },
  日: {
    components: [
      { part: "日", meaning: "mặt trời" },
    ],
    mnemonic: "Hình mặt trời vuông lại trên giấy: ngày, mặt trời, Nhật Bản.",
    on: ["ニチ", "ジツ"],
    kun: ["ひ", "か"],
    examples: [
      { kanji: "日本", reading: "にほん", vietnamese: "Nhật Bản" },
      { kanji: "日曜日", reading: "にちようび", vietnamese: "Chủ nhật" },
      { kanji: "毎日", reading: "まいにち", vietnamese: "mỗi ngày" },
      { kanji: "誕生日", reading: "たんじょうび", vietnamese: "sinh nhật" },
    ],
  },
  語: {
    components: [
      { part: "言", meaning: "lời nói" },
      { part: "五/口", meaning: "năm + miệng" },
    ],
    mnemonic: "Nhiều cái miệng cùng nói thành một ngôn ngữ.",
    on: ["ゴ"],
    kun: ["かた(る)", "かた(らう)"],
    examples: [
      { kanji: "日本語", reading: "にほんご", vietnamese: "tiếng Nhật" },
      { kanji: "英語", reading: "えいご", vietnamese: "tiếng Anh" },
      { kanji: "単語", reading: "たんご", vietnamese: "từ vựng" },
      { kanji: "物語", reading: "ものがたり", vietnamese: "câu chuyện" },
    ],
  },
  書: {
    components: [
      { part: "聿", meaning: "bút lông" },
      { part: "日", meaning: "tờ ghi, ngày" },
    ],
    mnemonic: "Cầm bút ghi lên trang giấy: viết thành sách/văn bản.",
    on: ["ショ"],
    kun: ["か(く)"],
    examples: [
      { kanji: "辞書", reading: "じしょ", vietnamese: "từ điển" },
      { kanji: "図書館", reading: "としょかん", vietnamese: "thư viện" },
      { kanji: "書きます", reading: "かきます", vietnamese: "viết" },
      { kanji: "葉書", reading: "はがき", vietnamese: "bưu thiếp" },
    ],
  },
  雑: {
    components: [
      { part: "九/木", meaning: "nhiều thứ lẫn vào nhau" },
      { part: "隹", meaning: "chim đuôi ngắn" },
    ],
    mnemonic: "Một con chim bay vào đống đồ lộn xộn: mọi thứ trở nên tạp, hỗn hợp.",
    on: ["ザツ", "ゾウ"],
    kun: ["ま(じる)"],
    examples: [
      { kanji: "雑誌", reading: "ざっし", vietnamese: "tạp chí" },
      { kanji: "雑音", reading: "ざつおん", vietnamese: "tạp âm" },
      { kanji: "複雑", reading: "ふくざつ", vietnamese: "phức tạp" },
      { kanji: "雑談", reading: "ざつだん", vietnamese: "nói chuyện phiếm" },
      { kanji: "雑用", reading: "ざつよう", vietnamese: "việc lặt vặt" },
    ],
  },
  誌: {
    components: [
      { part: "言", meaning: "lời nói, chữ viết" },
      { part: "志", meaning: "ý chí, ghi nhớ trong lòng" },
    ],
    mnemonic: "Dùng lời viết để ghi lại điều trong lòng: tạp chí, nhật ký, ghi chép.",
    on: ["シ"],
    kun: [],
    examples: [
      { kanji: "雑誌", reading: "ざっし", vietnamese: "tạp chí" },
      { kanji: "日誌", reading: "にっし", vietnamese: "nhật ký công việc" },
      { kanji: "会誌", reading: "かいし", vietnamese: "tạp chí/hội san" },
    ],
  },
  新: {
    components: [
      { part: "立/木", meaning: "cây đứng lên" },
      { part: "斤", meaning: "rìu" },
    ],
    mnemonic: "Dùng rìu chặt cây để làm thứ mới.",
    on: ["シン"],
    kun: ["あたら(しい)", "あら(た)", "にい"],
    examples: [
      { kanji: "新聞", reading: "しんぶん", vietnamese: "báo" },
      { kanji: "新しい", reading: "あたらしい", vietnamese: "mới" },
      { kanji: "新幹線", reading: "しんかんせん", vietnamese: "tàu Shinkansen" },
    ],
  },
  聞: {
    components: [
      { part: "門", meaning: "cánh cửa" },
      { part: "耳", meaning: "tai" },
    ],
    mnemonic: "Áp tai vào cánh cửa để nghe tin tức.",
    on: ["ブン", "モン"],
    kun: ["き(く)", "き(こえる)"],
    examples: [
      { kanji: "新聞", reading: "しんぶん", vietnamese: "báo" },
      { kanji: "聞きます", reading: "ききます", vietnamese: "nghe, hỏi" },
      { kanji: "聞こえます", reading: "きこえます", vietnamese: "nghe thấy" },
    ],
  },
  時: {
    components: [
      { part: "日", meaning: "mặt trời, ngày" },
      { part: "寺", meaning: "chùa, nơi có chuông" },
    ],
    mnemonic: "Mặt trời và tiếng chuông chùa giúp biết thời gian.",
    on: ["ジ"],
    kun: ["とき"],
    examples: [
      { kanji: "時計", reading: "とけい", vietnamese: "đồng hồ" },
      { kanji: "時間", reading: "じかん", vietnamese: "thời gian" },
      { kanji: "何時", reading: "なんじ", vietnamese: "mấy giờ" },
    ],
  },
  手: {
    components: [
      { part: "手", meaning: "bàn tay" },
    ],
    mnemonic: "Hình bàn tay xoè ra: tay, kỹ năng, người làm.",
    on: ["シュ"],
    kun: ["て", "た"],
    examples: [
      { kanji: "手帳", reading: "てちょう", vietnamese: "sổ tay" },
      { kanji: "上手", reading: "じょうず", vietnamese: "giỏi" },
      { kanji: "切手", reading: "きって", vietnamese: "tem" },
      { kanji: "手伝います", reading: "てつだいます", vietnamese: "giúp đỡ" },
    ],
  },
  自: {
    components: [
      { part: "自", meaning: "mũi, bản thân" },
    ],
    mnemonic: "Người xưa chỉ vào mũi mình khi nói “tôi/bản thân”.",
    on: ["ジ", "シ"],
    kun: ["みずか(ら)"],
    examples: [
      { kanji: "自動車", reading: "じどうしゃ", vietnamese: "ô tô" },
      { kanji: "自転車", reading: "じてんしゃ", vietnamese: "xe đạp" },
      { kanji: "自分", reading: "じぶん", vietnamese: "bản thân" },
    ],
  },
  動: {
    components: [
      { part: "重", meaning: "nặng" },
      { part: "力", meaning: "sức lực" },
    ],
    mnemonic: "Dùng sức để đẩy vật nặng: nó chuyển động.",
    on: ["ドウ"],
    kun: ["うご(く)", "うご(かす)"],
    examples: [
      { kanji: "自動車", reading: "じどうしゃ", vietnamese: "ô tô" },
      { kanji: "動きます", reading: "うごきます", vietnamese: "chuyển động" },
      { kanji: "動物", reading: "どうぶつ", vietnamese: "động vật" },
    ],
  },
  車: {
    components: [
      { part: "車", meaning: "bánh xe, xe" },
    ],
    mnemonic: "Nhìn như chiếc xe từ trên xuống với trục và bánh.",
    on: ["シャ"],
    kun: ["くるま"],
    examples: [
      { kanji: "自動車", reading: "じどうしゃ", vietnamese: "ô tô" },
      { kanji: "電車", reading: "でんしゃ", vietnamese: "tàu điện" },
      { kanji: "自転車", reading: "じてんしゃ", vietnamese: "xe đạp" },
      { kanji: "車", reading: "くるま", vietnamese: "xe hơi" },
    ],
  },
  電: {
    components: [
      { part: "雨", meaning: "mưa, sấm chớp" },
      { part: "申", meaning: "tia kéo dài" },
    ],
    mnemonic: "Tia chớp trong mưa tạo ra điện.",
    on: ["デン"],
    kun: [],
    examples: [
      { kanji: "電話", reading: "でんわ", vietnamese: "điện thoại" },
      { kanji: "電車", reading: "でんしゃ", vietnamese: "tàu điện" },
      { kanji: "電気", reading: "でんき", vietnamese: "điện, đèn" },
    ],
  },
  国: {
    components: [
      { part: "囗", meaning: "ranh giới bao quanh" },
      { part: "玉", meaning: "viên ngọc, báu vật" },
    ],
    mnemonic: "Vùng đất bao quanh báu vật chung là một quốc gia.",
    on: ["コク"],
    kun: ["くに"],
    examples: [
      { kanji: "国", reading: "くに", vietnamese: "đất nước" },
      { kanji: "外国", reading: "がいこく", vietnamese: "nước ngoài" },
      { kanji: "中国", reading: "ちゅうごく", vietnamese: "Trung Quốc" },
    ],
  },
  食: {
    components: [
      { part: "人", meaning: "người" },
      { part: "良", meaning: "tốt, đầy đủ" },
    ],
    mnemonic: "Con người cần đồ tốt vào bụng: ăn.",
    on: ["ショク", "ジキ"],
    kun: ["た(べる)", "く(う)"],
    examples: [
      { kanji: "食べます", reading: "たべます", vietnamese: "ăn" },
      { kanji: "食堂", reading: "しょくどう", vietnamese: "nhà ăn" },
      { kanji: "食事", reading: "しょくじ", vietnamese: "bữa ăn" },
    ],
  },
  飲: {
    components: [
      { part: "食", meaning: "ăn uống" },
      { part: "欠", meaning: "há miệng, thiếu" },
    ],
    mnemonic: "Miệng đang thiếu nước nên cần uống.",
    on: ["イン"],
    kun: ["の(む)"],
    examples: [
      { kanji: "飲みます", reading: "のみます", vietnamese: "uống" },
      { kanji: "飲み物", reading: "のみもの", vietnamese: "đồ uống" },
      { kanji: "飲食", reading: "いんしょく", vietnamese: "ăn uống" },
    ],
  },
  見: {
    components: [
      { part: "目", meaning: "mắt" },
      { part: "儿", meaning: "chân người" },
    ],
    mnemonic: "Con mắt đặt trên đôi chân: đi tới để nhìn cho rõ.",
    on: ["ケン"],
    kun: ["み(る)", "み(える)", "み(せる)"],
    examples: [
      { kanji: "見ます", reading: "みます", vietnamese: "xem, nhìn" },
      { kanji: "見せます", reading: "みせます", vietnamese: "cho xem" },
      { kanji: "意見", reading: "いけん", vietnamese: "ý kiến" },
    ],
  },
  読: {
    components: [
      { part: "言", meaning: "chữ, lời" },
      { part: "売", meaning: "bán/đổi ra" },
    ],
    mnemonic: "Biến chữ trên giấy thành lời trong đầu: đọc.",
    on: ["ドク", "トク", "トウ"],
    kun: ["よ(む)"],
    examples: [
      { kanji: "読みます", reading: "よみます", vietnamese: "đọc" },
      { kanji: "読書", reading: "どくしょ", vietnamese: "đọc sách" },
      { kanji: "音読み", reading: "おんよみ", vietnamese: "âm On" },
    ],
  },
  買: {
    components: [
      { part: "罒", meaning: "lưới, đồ đặt lên" },
      { part: "貝", meaning: "vỏ sò, tiền xưa" },
    ],
    mnemonic: "Đặt tiền vỏ sò lên quầy để mua đồ.",
    on: ["バイ"],
    kun: ["か(う)"],
    examples: [
      { kanji: "買います", reading: "かいます", vietnamese: "mua" },
      { kanji: "買い物", reading: "かいもの", vietnamese: "mua sắm" },
      { kanji: "売買", reading: "ばいばい", vietnamese: "mua bán" },
    ],
  },
  月: {
    components: [
      { part: "月", meaning: "mặt trăng, tháng" },
    ],
    mnemonic: "Mặt trăng khuyết đánh dấu từng tháng.",
    on: ["ゲツ", "ガツ"],
    kun: ["つき"],
    examples: [
      { kanji: "月曜日", reading: "げつようび", vietnamese: "thứ Hai" },
      { kanji: "今月", reading: "こんげつ", vietnamese: "tháng này" },
      { kanji: "来月", reading: "らいげつ", vietnamese: "tháng sau" },
    ],
  },
  火: {
    components: [
      { part: "火", meaning: "ngọn lửa" },
    ],
    mnemonic: "Hai tia lửa bùng ra từ đốm lửa chính.",
    on: ["カ"],
    kun: ["ひ", "ほ"],
    examples: [
      { kanji: "火曜日", reading: "かようび", vietnamese: "thứ Ba" },
      { kanji: "火", reading: "ひ", vietnamese: "lửa" },
      { kanji: "花火", reading: "はなび", vietnamese: "pháo hoa" },
    ],
  },
  水: {
    components: [
      { part: "水", meaning: "dòng nước" },
    ],
    mnemonic: "Dòng nước chính chảy xuống, hai giọt bắn sang hai bên.",
    on: ["スイ"],
    kun: ["みず"],
    examples: [
      { kanji: "水曜日", reading: "すいようび", vietnamese: "thứ Tư" },
      { kanji: "水", reading: "みず", vietnamese: "nước" },
      { kanji: "水泳", reading: "すいえい", vietnamese: "bơi lội" },
    ],
  },
  木: {
    components: [
      { part: "木", meaning: "cây" },
    ],
    mnemonic: "Thân cây đứng giữa, cành và rễ xoè ra hai bên.",
    on: ["モク", "ボク"],
    kun: ["き", "こ"],
    examples: [
      { kanji: "木曜日", reading: "もくようび", vietnamese: "thứ Năm" },
      { kanji: "木", reading: "き", vietnamese: "cây" },
      { kanji: "本", reading: "ほん", vietnamese: "sách/gốc" },
    ],
  },
  金: {
    components: [
      { part: "金", meaning: "kim loại, vàng, tiền" },
    ],
    mnemonic: "Khoáng vật quý nằm sâu dưới mái đất: vàng/tiền.",
    on: ["キン", "コン"],
    kun: ["かね", "かな"],
    examples: [
      { kanji: "金曜日", reading: "きんようび", vietnamese: "thứ Sáu" },
      { kanji: "お金", reading: "おかね", vietnamese: "tiền" },
      { kanji: "銀行", reading: "ぎんこう", vietnamese: "ngân hàng" },
    ],
  },
  土: {
    components: [
      { part: "土", meaning: "đất" },
    ],
    mnemonic: "Mầm cây nhú lên khỏi mặt đất.",
    on: ["ド", "ト"],
    kun: ["つち"],
    examples: [
      { kanji: "土曜日", reading: "どようび", vietnamese: "thứ Bảy" },
      { kanji: "お土産", reading: "おみやげ", vietnamese: "quà lưu niệm" },
      { kanji: "土地", reading: "とち", vietnamese: "đất đai" },
    ],
  },
  大: {
    components: [
      { part: "人", meaning: "người dang tay" },
    ],
    mnemonic: "Người dang rộng tay để diễn tả thứ gì đó rất to.",
    on: ["ダイ", "タイ"],
    kun: ["おお(きい)"],
    examples: [
      { kanji: "大学", reading: "だいがく", vietnamese: "đại học" },
      { kanji: "大きい", reading: "おおきい", vietnamese: "to, lớn" },
      { kanji: "大変", reading: "たいへん", vietnamese: "vất vả, nghiêm trọng" },
    ],
  },
  小: {
    components: [
      { part: "小", meaning: "ba hạt nhỏ" },
    ],
    mnemonic: "Một vật nhỏ ở giữa, hai chấm nhỏ rơi hai bên.",
    on: ["ショウ"],
    kun: ["ちい(さい)", "こ", "お"],
    examples: [
      { kanji: "小さい", reading: "ちいさい", vietnamese: "nhỏ" },
      { kanji: "小学校", reading: "しょうがっこう", vietnamese: "trường tiểu học" },
      { kanji: "小学生", reading: "しょうがくせい", vietnamese: "học sinh tiểu học" },
    ],
  },
  中: {
    components: [
      { part: "口", meaning: "hộp, vùng bao quanh" },
      { part: "丨", meaning: "đường xuyên giữa" },
    ],
    mnemonic: "Một đường chọc đúng giữa chiếc hộp: ở trong/trung tâm.",
    on: ["チュウ"],
    kun: ["なか"],
    examples: [
      { kanji: "中国", reading: "ちゅうごく", vietnamese: "Trung Quốc" },
      { kanji: "中", reading: "なか", vietnamese: "bên trong" },
      { kanji: "一日中", reading: "いちにちじゅう", vietnamese: "suốt cả ngày" },
    ],
  },
  上: {
    components: [
      { part: "一", meaning: "mặt phẳng" },
      { part: "卜", meaning: "dấu chỉ phía trên" },
    ],
    mnemonic: "Dấu nằm phía trên mặt phẳng: trên.",
    on: ["ジョウ", "ショウ"],
    kun: ["うえ", "あ(がる)", "のぼ(る)"],
    examples: [
      { kanji: "上手", reading: "じょうず", vietnamese: "giỏi" },
      { kanji: "上", reading: "うえ", vietnamese: "trên" },
      { kanji: "上げます", reading: "あげます", vietnamese: "nâng lên" },
    ],
  },
  下: {
    components: [
      { part: "一", meaning: "mặt phẳng" },
      { part: "卜", meaning: "dấu chỉ phía dưới" },
    ],
    mnemonic: "Dấu rơi xuống dưới mặt phẳng: dưới.",
    on: ["カ", "ゲ"],
    kun: ["した", "さ(がる)", "くだ(る)"],
    examples: [
      { kanji: "下手", reading: "へた", vietnamese: "không giỏi" },
      { kanji: "地下", reading: "ちか", vietnamese: "tầng hầm, dưới đất" },
      { kanji: "下", reading: "した", vietnamese: "dưới" },
    ],
  },
  男: {
    components: [
      { part: "田", meaning: "ruộng" },
      { part: "力", meaning: "sức lực" },
    ],
    mnemonic: "Người dùng sức làm ruộng: nam giới trong hình ảnh cổ.",
    on: ["ダン", "ナン"],
    kun: ["おとこ"],
    examples: [
      { kanji: "男の人", reading: "おとこのひと", vietnamese: "người đàn ông" },
      { kanji: "男の子", reading: "おとこのこ", vietnamese: "bé trai" },
      { kanji: "男性", reading: "だんせい", vietnamese: "nam giới" },
    ],
  },
  女: {
    components: [
      { part: "女", meaning: "người phụ nữ" },
    ],
    mnemonic: "Hình người phụ nữ đang ngồi/khoanh tay theo lối chữ tượng hình.",
    on: ["ジョ", "ニョ"],
    kun: ["おんな", "め"],
    examples: [
      { kanji: "女の人", reading: "おんなのひと", vietnamese: "người phụ nữ" },
      { kanji: "女の子", reading: "おんなのこ", vietnamese: "bé gái" },
      { kanji: "女性", reading: "じょせい", vietnamese: "nữ giới" },
    ],
  },
  子: {
    components: [
      { part: "子", meaning: "đứa trẻ" },
    ],
    mnemonic: "Hình em bé với đầu, thân và hai tay dang ra.",
    on: ["シ", "ス"],
    kun: ["こ"],
    examples: [
      { kanji: "子ども", reading: "こども", vietnamese: "trẻ em, con" },
      { kanji: "男の子", reading: "おとこのこ", vietnamese: "bé trai" },
      { kanji: "女の子", reading: "おんなのこ", vietnamese: "bé gái" },
      { kanji: "椅子", reading: "いす", vietnamese: "ghế" },
    ],
  },
};
