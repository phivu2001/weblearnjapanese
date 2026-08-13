"""Idempotent seed data for all 50 lessons and learning content for lessons 1-25."""

from __future__ import annotations

import json

from sqlalchemy import select

from database import DATABASE_URL, SessionLocal, create_db_and_tables, engine
from lesson_data_02_05 import (
    LESSON_PASSAGES as LESSON_PASSAGES_02_05,
    LESSON_SENTENCES as LESSON_SENTENCES_02_05,
)
from lesson_data_06_10 import (
    LESSON_PASSAGES as LESSON_PASSAGES_06_10,
    LESSON_SENTENCES as LESSON_SENTENCES_06_10,
)
from lesson_data_11_15 import (
    LESSON_PASSAGES as LESSON_PASSAGES_11_15,
    LESSON_SENTENCES as LESSON_SENTENCES_11_15,
)
from lesson_data_16_20 import (
    LESSON_PASSAGES as LESSON_PASSAGES_16_20,
    LESSON_SENTENCES as LESSON_SENTENCES_16_20,
)
from lesson_data_21_25 import (
    LESSON_PASSAGES as LESSON_PASSAGES_21_25,
    LESSON_SENTENCES as LESSON_SENTENCES_21_25,
)
from models import Chunk, Lesson, Passage, Sentence


LESSON_DESCRIPTIONS = [
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
    "Yêu cầu và hướng dẫn",
    "Hành động đang diễn ra",
    "Nối câu và trình tự hành động",
    "Cấm đoán và nghĩa vụ",
    "Khả năng và sở thích",
    "Kinh nghiệm và thay đổi",
    "Mệnh đề bổ nghĩa",
    "Thể thông thường",
    "Mệnh đề danh từ và trích dẫn",
    "Thời điểm và tình huống",
    "Cho và nhận hành động",
    "Điều kiện và giả định",
    "Giải thích nguyên nhân",
    "Khả năng và giác quan",
    "Hành động đồng thời",
    "Tự động từ và trạng thái",
    "Chuẩn bị và hoàn tất",
    "Ý định và kế hoạch",
    "Lời khuyên và suy đoán",
    "Mệnh lệnh và truyền đạt",
    "Bị động",
    "Danh từ hóa hành động",
    "Mục đích và công dụng",
    "Trạng thái kết quả",
    "Điều kiện cần thiết",
    "Nguyên nhân và hệ quả",
    "Hỏi gián tiếp và thử làm",
    "Cho và nhận lịch sự",
    "Mục đích và nỗ lực",
    "Vẻ ngoài và xu hướng",
    "Giả định và nhượng bộ",
    "Trường hợp và hoàn cảnh",
    "Cấu trúc ところ và vừa mới",
    "Truyền đạt thông tin",
    "Thể sai khiến",
    "Kính ngữ",
    "Khiêm nhường ngữ",
]


DEMO_SENTENCES = {
    1: [
        # --- Đại từ nhân xưng ---
        {
            "full_japanese": "わたしは グエンです。",
            "kanji_variants": "私は グエンです。,私は阮です。",
            "full_romaji": "Watashi wa Guyen desu.",
            "full_vietnamese": "Tôi là Nguyễn.",
            "chunks": [
                (1, "わたしは", "tôi (chủ đề)", True, "私は"),
                (2, "グエン", "Nguyễn", False, "阮"),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "わたしたちは がくせいです。",
            "kanji_variants": "私たちは 学生です。",
            "full_romaji": "Watashitachi wa gakusei desu.",
            "full_vietnamese": "Chúng tôi là học sinh.",
            "chunks": [
                (1, "わたしたちは", "chúng tôi (chủ đề)", True, "私たちは"),
                (2, "がくせい", "học sinh", False, "学生"),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "あなたは がくせいですか。",
            "full_romaji": "Anata wa gakusei desu ka.",
            "full_vietnamese": "Bạn có phải là học sinh không?",
            "chunks": [
                (1, "あなたは", "bạn (chủ đề)", True),
                (2, "がくせい", "học sinh", False),
                (3, "ですか。", "có phải... không?", False),
            ],
        },
        {
            "full_japanese": "あのひとは だれですか。",
            "full_romaji": "Ano hito wa dare desu ka.",
            "full_vietnamese": "Người kia là ai?",
            "chunks": [
                (1, "あのひとは", "người kia (chủ đề)", False),
                (2, "だれ", "ai", True),
                (3, "ですか。", "là... phải không?", False),
            ],
        },
        {
            "full_japanese": "みなさん、はじめまして。",
            "full_romaji": "Minasan, hajimemashite.",
            "full_vietnamese": "Thưa mọi người, rất hân hạnh được gặp.",
            "chunks": [
                (1, "みなさん、", "thưa mọi người", True),
                (2, "はじめまして。", "rất hân hạnh được gặp", False),
            ],
        },
        # --- Nghề nghiệp ---
        {
            "full_japanese": "やまださんは せんせいです。",
            "full_romaji": "Yamada-san wa sensei desu.",
            "full_vietnamese": "Anh Yamada là thầy giáo.",
            "chunks": [
                (1, "やまださんは", "anh Yamada (chủ đề)", False),
                (2, "せんせい", "thầy/cô giáo", False),
                (3, "です。", "là", True),
            ],
        },
        {
            "full_japanese": "わたしは きょうしでは ありません。",
            "full_romaji": "Watashi wa kyoushi dewa arimasen.",
            "full_vietnamese": "Tôi không phải là giáo viên.",
            "chunks": [
                (1, "わたしは", "tôi (chủ đề)", False),
                (2, "きょうし", "giáo viên", False),
                (3, "では ありません。", "không phải là", True),
            ],
        },
        {
            "full_japanese": "サントスさんは かいしゃいんです。",
            "full_romaji": "Santosu-san wa kaishain desu.",
            "full_vietnamese": "Anh Santos là nhân viên công ty.",
            "chunks": [
                (1, "サントスさんは", "anh Santos (chủ đề)", False),
                (2, "かいしゃいん", "nhân viên công ty", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "かれは ぎんこういんです。",
            "full_romaji": "Kare wa ginkouin desu.",
            "full_vietnamese": "Anh ấy là nhân viên ngân hàng.",
            "chunks": [
                (1, "かれは", "anh ấy (chủ đề)", False),
                (2, "ぎんこういん", "nhân viên ngân hàng", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "たなかさんは いしゃです。",
            "full_romaji": "Tanaka-san wa isha desu.",
            "full_vietnamese": "Anh Tanaka là bác sĩ.",
            "chunks": [
                (1, "たなかさんは", "anh Tanaka (chủ đề)", False),
                (2, "いしゃ", "bác sĩ", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "ミラーさんは けんきゅうしゃです。",
            "full_romaji": "Miraa-san wa kenkyuusha desu.",
            "full_vietnamese": "Anh Miller là nhà nghiên cứu.",
            "chunks": [
                (1, "ミラーさんは", "anh Miller (chủ đề)", False),
                (2, "けんきゅうしゃ", "nhà nghiên cứu", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "わたしは エンジニアです。",
            "full_romaji": "Watashi wa enjinia desu.",
            "full_vietnamese": "Tôi là kỹ sư.",
            "chunks": [
                (1, "わたしは", "tôi (chủ đề)", False),
                (2, "エンジニア", "kỹ sư", True),
                (3, "です。", "là", False),
            ],
        },
        # --- Địa điểm ---
        {
            "full_japanese": "わたしは さくらだいがくの がくせいです。",
            "full_romaji": "Watashi wa Sakura-daigaku no gakusei desu.",
            "full_vietnamese": "Tôi là sinh viên trường đại học Sakura.",
            "chunks": [
                (1, "わたしは", "tôi (chủ đề)", False),
                (2, "さくらだいがくの", "của đại học Sakura", True),
                (3, "がくせいです。", "là sinh viên", False),
            ],
        },
        {
            "full_japanese": "たなかさんは びょういんで はたらいています。",
            "full_romaji": "Tanaka-san wa byouin de hataraite imasu.",
            "full_vietnamese": "Anh Tanaka làm việc ở bệnh viện.",
            "chunks": [
                (1, "たなかさんは", "anh Tanaka (chủ đề)", False),
                (2, "びょういんで", "ở bệnh viện", True),
                (3, "はたらいています。", "đang làm việc", False),
            ],
        },
        # --- Hỏi tuổi ---
        {
            "full_japanese": "なんさいですか。",
            "full_romaji": "Nansai desu ka.",
            "full_vietnamese": "Bao nhiêu tuổi?",
            "chunks": [
                (1, "なんさい", "bao nhiêu tuổi", True),
                (2, "ですか。", "câu hỏi lịch sự", False),
            ],
        },
        {
            "full_japanese": "わたしは にじゅうさんさいです。",
            "full_romaji": "Watashi wa nijuusan-sai desu.",
            "full_vietnamese": "Tôi 23 tuổi.",
            "chunks": [
                (1, "わたしは", "tôi (chủ đề)", False),
                (2, "にじゅうさん", "23", False),
                (3, "さいです。", "tuổi", True),
            ],
        },
        # --- Hỏi & trả lời ---
        {
            "full_japanese": "はい、そうです。",
            "full_romaji": "Hai, sou desu.",
            "full_vietnamese": "Vâng, đúng vậy.",
            "chunks": [
                (1, "はい、", "vâng", True),
                (2, "そうです。", "đúng vậy", False),
            ],
        },
        {
            "full_japanese": "いいえ、ちがいます。",
            "full_romaji": "Iie, chigaimasu.",
            "full_vietnamese": "Không, không phải vậy.",
            "chunks": [
                (1, "いいえ、", "không", True),
                (2, "ちがいます。", "không phải (vậy)", False),
            ],
        },
        # --- Mẫu câu giao tiếp ---
        {
            "full_japanese": "しつれいですが、おなまえは？",
            "full_romaji": "Shitsurei desu ga, onamae wa?",
            "full_vietnamese": "Xin lỗi, tên anh/chị là gì?",
            "chunks": [
                (1, "しつれいですが、", "xin lỗi", True),
                (2, "おなまえは？", "tên của bạn là...?", False),
            ],
        },
        {
            "full_japanese": "はじめまして。どうぞよろしく おねがいします。",
            "full_romaji": "Hajimemashite. Douzo yoroshiku onegaishimasu.",
            "full_vietnamese": "Rất hân hạnh được gặp. Rất mong được sự giúp đỡ.",
            "chunks": [
                (1, "はじめまして。", "rất hân hạnh được gặp", True),
                (2, "どうぞ よろしく", "rất mong được làm quen", False),
                (3, "おねがいします。", "xin nhờ anh/chị", False),
            ],
        },
        {
            "full_japanese": "こちらは ミラーさんです。",
            "full_romaji": "Kochira wa Miraa-san desu.",
            "full_vietnamese": "Đây là anh Miller.",
            "chunks": [
                (1, "こちらは", "đây (người này)", True),
                (2, "ミラーさん", "anh Miller", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "わたしは ベトナムから きました。",
            "full_romaji": "Watashi wa Betonamu kara kimashita.",
            "full_vietnamese": "Tôi đến từ Việt Nam.",
            "chunks": [
                (1, "わたしは", "tôi (chủ đề)", False),
                (2, "ベトナムから", "từ Việt Nam", True),
                (3, "きました。", "đã đến", False),
            ],
        },
        # --- Quốc tịch ---
        {
            "full_japanese": "マイさんは ベトナムじんです。",
            "full_romaji": "Mai-san wa Betonamu-jin desu.",
            "full_vietnamese": "Chị Mai là người Việt Nam.",
            "chunks": [
                (1, "マイさんは", "chị Mai (chủ đề)", False),
                (2, "ベトナム", "Việt Nam", False),
                (3, "じんです。", "là người... (quốc tịch)", True),
            ],
        },
        {
            "full_japanese": "サントスさんは ブラジルじんです。",
            "full_romaji": "Santosu-san wa Burajiru-jin desu.",
            "full_vietnamese": "Anh Santos là người Brazil.",
            "chunks": [
                (1, "サントスさんは", "anh Santos (chủ đề)", False),
                (2, "ブラジル", "Brazil", False),
                (3, "じんです。", "là người... (quốc tịch)", True),
            ],
        },
        {
            "full_japanese": "ミラーさんは アメリカじんですか。",
            "full_romaji": "Miraa-san wa Amerika-jin desu ka.",
            "full_vietnamese": "Anh Miller có phải người Mỹ không?",
            "chunks": [
                (1, "ミラーさんは", "anh Miller (chủ đề)", False),
                (2, "アメリカじん", "người Mỹ", True),
                (3, "ですか。", "có phải... không?", False),
            ],
        },
    ],
    2: [
        {
            "full_japanese": "これは日本語の辞書です。",
            "full_romaji": "Kore wa Nihongo no jisho desu.",
            "full_vietnamese": "Đây là từ điển tiếng Nhật.",
            "chunks": [
                (1, "これは", "đây thì", True),
                (2, "日本語の", "của tiếng Nhật", False),
                (3, "辞書です。", "là từ điển", False),
            ],
        },
        {
            "full_japanese": "その傘はわたしのです。",
            "full_romaji": "Sono kasa wa watashi no desu.",
            "full_vietnamese": "Chiếc ô đó là của tôi.",
            "chunks": [
                (1, "その傘は", "chiếc ô đó", False),
                (2, "わたしの", "của tôi", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "これはだれの名刺ですか。",
            "full_romaji": "Kore wa dare no meishi desu ka.",
            "full_vietnamese": "Đây là danh thiếp của ai?",
            "chunks": [
                (1, "これは", "đây thì", False),
                (2, "だれの", "của ai", True),
                (3, "名刺ですか。", "là danh thiếp phải không", False),
            ],
        },
    ],
}


DEMO_PASSAGES = {
    1: {
        "title": "はじめまして — Lần đầu gặp mặt",
        "content": [
            {"text": "はじめまして。", "meaning": "Rất hân hạnh được gặp bạn.", "note": "Lời chào khi gặp lần đầu tiên. Luôn nói câu này trước khi giới thiệu bản thân."},
            {"text": "わたし", "meaning": "tôi", "note": "Đại từ nhân xưng ngôi thứ nhất, lịch sự và trung tính. Dùng được trong mọi tình huống."},
            {"text": "は", "meaning": "trợ từ chủ đề (wa)", "note": "Viết là は nhưng đọc là 'wa' khi làm trợ từ. Đánh dấu chủ đề của câu."},
            {"text": "グエンです。", "meaning": "là Nguyễn.", "note": "です kết thúc câu danh từ theo lối lịch sự. Tương đương 'là' trong tiếng Việt."},
            {"text": "ベトナムじんです。", "meaning": "Tôi là người Việt Nam.", "note": "Tên nước + じん(人) = người nước đó. Ví dụ: にほんじん = người Nhật."},
            {"text": "さくらだいがくの がくせいです。", "furigana": "さくらだいがくの がくせいです", "meaning": "Là sinh viên đại học Sakura.", "note": "の nối 2 danh từ, thể hiện quan hệ sở hữu hoặc thuộc về."},
            {"text": "どうぞよろしくおねがいします。", "meaning": "Rất mong được sự giúp đỡ.", "note": "Câu kết thúc bắt buộc sau khi tự giới thiệu. Thể hiện sự khiêm tốn lịch sự."},
        ],
    },
    "1b": {
        "title": "しごとは なんですか — Nghề nghiệp của bạn là gì?",
        "content": [
            {"text": "しつれいですが、", "meaning": "Xin lỗi, (tôi hỏi khí không phải)...", "note": "Câu mở đầu lịch sự khi muốn hỏi thông tin cá nhân của người khác."},
            {"text": "おしごとは", "furigana": "おしごとは", "meaning": "công việc của anh/chị (chủ đề)", "note": "お～ thêm vào trước danh từ để nói lịch sự hơn. しごと = công việc."},
            {"text": "なんですか。", "meaning": "là gì vậy?", "note": "なん/なに = cái gì. Dùng なん trước です và だ."},
            {"text": "わたしは エンジニアです。", "meaning": "Tôi là kỹ sư.", "note": "エンジニア là từ ngoại lai (từ tiếng Anh: engineer), viết bằng Katakana."},
            {"text": "かいしゃいん", "furigana": "かいしゃいん", "meaning": "nhân viên công ty", "note": "会社(かいしゃ) = công ty + 員(いん) = thành viên/nhân viên."},
            {"text": "ぎんこういん", "furigana": "ぎんこういん", "meaning": "nhân viên ngân hàng", "note": "銀行(ぎんこう) = ngân hàng + 員(いん). Cấu trúc tương tự かいしゃいん."},
            {"text": "いしゃです。", "furigana": "いしゃです", "meaning": "là bác sĩ.", "note": "医者(いしゃ). Chú ý: せんせい dùng để gọi người đó, không dùng để giới thiệu nghề nghiệp của bản thân."},
        ],
    },
    "1c": {
        "title": "くにはどこですか — Bạn đến từ đâu?",
        "content": [
            {"text": "おくには", "meaning": "quê hương/đất nước của anh/chị (chủ đề)", "note": "お～ thể hiện sự lịch sự. くに = đất nước, quê hương."},
            {"text": "どちらですか。", "meaning": "là đâu vậy? (lịch sự)", "note": "どちら là cách hỏi lịch sự của どこ (ở đâu). Dùng khi hỏi người lớn tuổi hơn."},
            {"text": "ベトナムから きました。", "meaning": "Tôi đến từ Việt Nam.", "note": "から = từ (nơi chốn xuất phát). きました = đã đến (quá khứ lịch sự của きます)."},
            {"text": "アメリカ", "meaning": "Mỹ (Hoa Kỳ)", "note": "Tên nước viết bằng Katakana: ア・メ・リ・カ."},
            {"text": "イギリス", "meaning": "Anh (Vương quốc Anh)", "note": "Tên gốc từ tiếng Bồ Đào Nha 'Inglês'. Không phải từ 'England'."},
            {"text": "ブラジル", "meaning": "Brazil", "note": "ブ・ラ・ジ・ル — chú ý chữ ジ (ji) và ル (ru) ở cuối."},
            {"text": "どうぞよろしくおねがいします。", "meaning": "Rất mong được làm quen.", "note": "Câu kết thúc tự nhiên sau khi chia sẻ thông tin về bản thân."},
        ],
    },
    2: {
        "title": "これは何ですか — Đây là gì?",
        "content": [
            {"text": "これは", "meaning": "cái này", "note": "これ dùng cho vật ở gần người nói."},
            {"text": "日本語", "furigana": "にほんご", "meaning": "tiếng Nhật", "note": "日本 + 語（ngôn ngữ)."},
            {"text": "の辞書です。", "furigana": "のじしょです", "meaning": "là từ điển của…", "note": "の nối hai danh từ."},
            {"text": "あれは", "meaning": "cái kia", "note": "あれ dùng cho vật xa cả người nói lẫn người nghe."},
            {"text": "だれの傘ですか。", "furigana": "だれのかさですか", "meaning": "là ô của ai?", "note": "だれの dùng để hỏi sở hữu."},
        ],
    },
}


# The expanded lesson files override any older demo entry with the same lesson id.
AUTHORED_SENTENCES = {
    **LESSON_SENTENCES_02_05,
    **LESSON_SENTENCES_06_10,
    **LESSON_SENTENCES_11_15,
    **LESSON_SENTENCES_16_20,
    **LESSON_SENTENCES_21_25,
}
AUTHORED_PASSAGES = {
    **LESSON_PASSAGES_02_05,
    **LESSON_PASSAGES_06_10,
    **LESSON_PASSAGES_11_15,
    **LESSON_PASSAGES_16_20,
    **LESSON_PASSAGES_21_25,
}

SEED_SENTENCES = {**DEMO_SENTENCES, **AUTHORED_SENTENCES}
SEED_PASSAGES = {
    1: [DEMO_PASSAGES[1], DEMO_PASSAGES["1b"], DEMO_PASSAGES["1c"]],
    **{
        lesson_id: [passage]
        for lesson_id, passage in AUTHORED_PASSAGES.items()
    },
}

SPELLING_VARIANT_PAIRS = [
    ("わたしたち", "私たち"),
    ("わたし", "私"),
    ("がくせい", "学生"),
    ("せんせい", "先生"),
    ("きょうし", "教師"),
    ("かいしゃいん", "会社員"),
    ("ぎんこういん", "銀行員"),
    ("いしゃ", "医者"),
    ("けんきゅうしゃ", "研究者"),
    ("だいがく", "大学"),
    ("びょういん", "病院"),
    ("にほんご", "日本語"),
    ("えいご", "英語"),
    ("じしょ", "辞書"),
    ("ほん", "本"),
    ("ざっし", "雑誌"),
    ("しんぶん", "新聞"),
    ("てちょう", "手帳"),
    ("めいし", "名刺"),
    ("えんぴつ", "鉛筆"),
    ("かぎ", "鍵"),
    ("とけい", "時計"),
    ("かさ", "傘"),
    ("じどうしゃ", "自動車"),
    ("つくえ", "机"),
    ("いす", "椅子"),
    ("おみやげ", "お土産"),
    ("きもち", "気持ち"),
    ("おせわ", "お世話"),
    ("きょうしつ", "教室"),
    ("かいしゃ", "会社"),
    ("しょくどう", "食堂"),
    ("じむしょ", "事務所"),
    ("かいぎしつ", "会議室"),
    ("うけつけ", "受付"),
    ("おてあらい", "お手洗い"),
    ("へや", "部屋"),
    ("かいだん", "階段"),
    ("でんわ", "電話"),
    ("くに", "国"),
    ("くつ", "靴"),
    ("うりば", "売り場"),
    ("ちか", "地下"),
    ("なんがい", "何階"),
    ("えん", "円"),
    ("みせ", "店"),
    ("えき", "駅"),
    ("ゆうびんきょく", "郵便局"),
    ("としょかん", "図書館"),
    ("びじゅつかん", "美術館"),
    ("いりぐち", "入口"),
    ("でぐち", "出口"),
    ("ばいてん", "売店"),
    ("まいあさ", "毎朝"),
    ("おきます", "起きます"),
    ("まいばん", "毎晩"),
    ("ねます", "寝ます"),
    ("げつようび", "月曜日"),
    ("かようび", "火曜日"),
    ("すいようび", "水曜日"),
    ("もくようび", "木曜日"),
    ("きんようび", "金曜日"),
    ("どようび", "土曜日"),
    ("にちようび", "日曜日"),
    ("はたらきます", "働きます"),
    ("やすみます", "休みます"),
    ("べんきょうします", "勉強します"),
    ("ごぜん", "午前"),
    ("ごご", "午後"),
    ("きょう", "今日"),
    ("あした", "明日"),
    ("あす", "明日"),
    ("きのう", "昨日"),
    ("けさ", "今朝"),
    ("こんばん", "今晩"),
    ("がっこう", "学校"),
    ("らいしゅう", "来週"),
    ("せんしゅう", "先週"),
    ("こんしゅう", "今週"),
    ("ともだち", "友達"),
    ("かぞく", "家族"),
    ("いきます", "行きます"),
    ("きます", "来ます"),
    ("かえります", "帰ります"),
    ("じてんしゃ", "自転車"),
    ("あるいて", "歩いて"),
    ("ふつうでんしゃ", "普通電車"),
    ("きゅうこう", "急行"),
    ("とっきゅう", "特急"),
    ("しんかんせん", "新幹線"),
    ("ひこうき", "飛行機"),
    ("ふね", "船"),
    ("ちかてつ", "地下鉄"),
    ("ひとり", "一人"),
    ("せんげつ", "先月"),
    ("こんげつ", "今月"),
    ("らいげつ", "来月"),
    ("きょねん", "去年"),
    ("ことし", "今年"),
    ("らいねん", "来年"),
    ("たんじょうび", "誕生日"),
    ("あさごはん", "朝ご飯"),
    ("ひるごはん", "昼ご飯"),
    ("ばんごはん", "晩ご飯"),
    ("ごはん", "ご飯"),
    ("たべます", "食べます"),
    ("のみます", "飲みます"),
    ("すいます", "吸います"),
    ("みます", "見ます"),
    ("ききます", "聞きます"),
    ("よみます", "読みます"),
    ("かきます", "書きます"),
    ("かいます", "買います"),
    ("とります", "撮ります"),
    ("あいます", "会います"),
    ("しゅくだい", "宿題"),
    ("きります", "切ります"),
    ("おくります", "送ります"),
    ("かします", "貸します"),
    ("かります", "借ります"),
    ("おしえます", "教えます"),
    ("ならいます", "習います"),
    ("かみ", "紙"),
    ("はな", "花"),
    ("にもつ", "荷物"),
    ("おかね", "お金"),
    ("きっぷ", "切符"),
    ("ねんがじょう", "年賀状"),
    ("しんせつ", "親切"),
    ("げんき", "元気"),
    ("べんり", "便利"),
    ("かんたん", "簡単"),
    ("しずか", "静か"),
    ("にぎやか", "賑やか"),
    ("ゆうめい", "有名"),
    ("ひま", "暇"),
    ("おおきい", "大きい"),
    ("ちいさい", "小さい"),
    ("あたらしい", "新しい"),
    ("ふるい", "古い"),
    ("よい", "良い"),
    ("わるい", "悪い"),
    ("あつい", "暑い"),
    ("さむい", "寒い"),
    ("つめたい", "冷たい"),
    ("むずかしい", "難しい"),
    ("やさしい", "易しい"),
    ("たかい", "高い"),
    ("やすい", "安い"),
    ("ひくい", "低い"),
    ("おもしろい", "面白い"),
    ("おいしい", "美味しい"),
    ("いそがしい", "忙しい"),
    ("たのしい", "楽しい"),
    ("しろい", "白い"),
    ("くろい", "黒い"),
    ("あかい", "赤い"),
    ("あおい", "青い"),
    ("さくら", "桜"),
    ("やま", "山"),
    ("まち", "町"),
    ("たべもの", "食べ物"),
    ("ところ", "所"),
    ("せいかつ", "生活"),
    ("しごと", "仕事"),
    ("わかります", "分かります"),
    ("すき", "好き"),
    ("きらい", "嫌い"),
    ("じょうず", "上手"),
    ("へた", "下手"),
    ("りょうり", "料理"),
    ("のみもの", "飲み物"),
    ("やきゅう", "野球"),
    ("おんがく", "音楽"),
    ("うた", "歌"),
    ("かぶき", "歌舞伎"),
    ("え", "絵"),
    ("じ", "字"),
    ("こまかい", "細かい"),
    ("じかん", "時間"),
    ("ようじ", "用事"),
    ("やくそく", "約束"),
    ("おっと", "夫"),
    ("つま", "妻"),
    ("しゅじん", "主人"),
    ("かない", "家内"),
    ("うえ", "上"),
    ("した", "下"),
    ("まえ", "前"),
    ("うしろ", "後ろ"),
    ("みぎ", "右"),
    ("ひだり", "左"),
    ("なか", "中"),
    ("そと", "外"),
    ("となり", "隣"),
    ("ちかく", "近く"),
    ("あいだ", "間"),
    ("おとこのひと", "男の人"),
    ("おんなのひと", "女の人"),
    ("いぬ", "犬"),
    ("ねこ", "猫"),
    ("き", "木"),
    ("もの", "物"),
    ("でんち", "電池"),
    ("はこ", "箱"),
    ("れいぞうこ", "冷蔵庫"),
    ("たな", "棚"),
    ("まど", "窓"),
    ("こうえん", "公園"),
    ("きっさてん", "喫茶店"),
    ("こども", "子ども"),
    ("きょうだい", "兄弟"),
    ("ふたり", "二人"),
    ("さんにん", "三人"),
    ("よっつ", "四つ"),
    ("いつつ", "五つ"),
    ("ふたつ", "二つ"),
    ("みっつ", "三つ"),
    ("やっつ", "八つ"),
    ("じゅうまい", "十枚"),
    ("さんさつ", "三冊"),
    ("にかい", "二回"),
    ("いちねん", "一年"),
    ("いっしゅうかん", "一週間"),
    ("きょうと", "京都"),
    ("おおさか", "大阪"),
    ("とうきょう", "東京"),
    ("こうくうびん", "航空便"),
    ("がいこく", "外国"),
    ("ふなびん", "船便"),
    ("てがみ", "手紙"),
    ("そくたつ", "速達"),
    ("ふうとう", "封筒"),
    ("ぜんぶ", "全部"),
    ("あに", "兄"),
    ("あね", "姉"),
    ("てんき", "天気"),
    ("あめ", "雨"),
    ("ゆき", "雪"),
    ("りょこう", "旅行"),
    ("しょくじ", "食事"),
    ("しけん", "試験"),
    ("はる", "春"),
    ("なつ", "夏"),
    ("あき", "秋"),
    ("ふゆ", "冬"),
    ("きせつ", "季節"),
    ("うみ", "海"),
    ("なら", "奈良"),
    ("おおい", "多い"),
    ("おもい", "重い"),
    ("かるい", "軽い"),
    ("ほしい", "欲しい"),
    ("あそびます", "遊びます"),
    ("およぎます", "泳ぎます"),
    ("むかえます", "迎えます"),
    ("つかれます", "疲れます"),
    ("けっこんします", "結婚します"),
    ("かいもの", "買い物"),
    ("さんぽします", "散歩します"),
    ("たいへん", "大変"),
    ("さびしい", "寂しい"),
    ("ひろい", "広い"),
    ("せまい", "狭い"),
    ("しやくしょ", "市役所"),
    ("なにか", "何か"),
    ("どこか", "何処か"),
    ("のど", "喉"),
    ("おなか", "お腹"),
    ("あけます", "開けます"),
    ("しめます", "閉めます"),
    ("けします", "消します"),
    ("いそぎます", "急ぎます"),
    ("まちます", "待ちます"),
    ("もちます", "持ちます"),
    ("てつだいます", "手伝います"),
    ("よびます", "呼びます"),
    ("はなします", "話します"),
    ("つかいます", "使います"),
    ("とめます", "止めます"),
    ("みせます", "見せます"),
    ("すわります", "座ります"),
    ("たちます", "立ちます"),
    ("はいります", "入ります"),
    ("でます", "出ます"),
    ("おります", "降ります"),
    ("ふります", "降ります"),
    ("じゅうしょ", "住所"),
    ("なまえ", "名前"),
    ("しお", "塩"),
    ("さとう", "砂糖"),
    ("もんだい", "問題"),
    ("こたえ", "答え"),
    ("よみかた", "読み方"),
    ("おきます", "置きます"),
    ("つくります", "作ります"),
    ("うります", "売ります"),
    ("しります", "知ります"),
    ("すみます", "住みます"),
    ("けんきゅうします", "研究します"),
    ("しりょう", "資料"),
    ("じこくひょう", "時刻表"),
    ("ふく", "服"),
    ("せいひん", "製品"),
    ("どくしん", "独身"),
    ("のります", "乗ります"),
    ("あびます", "浴びます"),
    ("いれます", "入れます"),
    ("だします", "出します"),
    ("おします", "押します"),
    ("わかい", "若い"),
    ("ながい", "長い"),
    ("みじかい", "短い"),
    ("あかるい", "明るい"),
    ("くらい", "暗い"),
    ("せ", "背"),
    ("あたま", "頭"),
    ("かみ", "髪"),
    ("かお", "顔"),
    ("め", "目"),
    ("みみ", "耳"),
    ("くち", "口"),
    ("は", "歯"),
    ("おてら", "お寺"),
    ("じんじゃ", "神社"),
    ("おぼえます", "覚えます"),
    ("わすれます", "忘れます"),
    ("はらいます", "払います"),
    ("かえします", "返します"),
    ("でかけます", "出かけます"),
    ("ぬぎます", "脱ぎます"),
    ("しんぱいします", "心配します"),
    ("ざんぎょうします", "残業します"),
    ("しゅっちょうします", "出張します"),
    ("くすり", "薬"),
    ("おふろ", "お風呂"),
    ("たいせつ", "大切"),
    ("だいじょうぶ", "大丈夫"),
    ("あぶない", "危ない"),
    ("きんえん", "禁煙"),
    ("けんこうほけんしょう", "健康保険証"),
    ("あらいます", "洗います"),
    ("ひきます", "弾きます"),
    ("うたいます", "歌います"),
    ("あつめます", "集めます"),
    ("すてます", "捨てます"),
    ("かえます", "換えます"),
    ("うんてん", "運転"),
    ("よやく", "予約"),
    ("けんがく", "見学"),
    ("しゅみ", "趣味"),
    ("にっき", "日記"),
    ("おいのり", "お祈り"),
    ("かちょう", "課長"),
    ("ぶちょう", "部長"),
    ("しゃちょう", "社長"),
    ("どうぶつ", "動物"),
    ("うま", "馬"),
    ("ぼくじょう", "牧場"),
    ("のぼります", "登ります"),
    ("とまります", "泊まります"),
    ("そうじします", "掃除します"),
    ("せんたくします", "洗濯します"),
    ("れんしゅうします", "練習します"),
    ("なります", "成ります"),
    ("ねむい", "眠い"),
    ("つよい", "強い"),
    ("よわい", "弱い"),
    ("ちょうし", "調子"),
    ("すもう", "相撲"),
    ("さどう", "茶道"),
    ("いちど", "一度"),
    ("いっかい", "一回"),
    ("かんぱい", "乾杯"),
    ("むり", "無理"),
    ("いります", "要ります"),
    ("しらべます", "調べます"),
    ("しゅうりします", "修理します"),
    ("ぼく", "僕"),
    ("きみ", "君"),
    ("ことば", "言葉"),
    ("きもの", "着物"),
    ("はじめ", "始め"),
    ("おわり", "終わり"),
    ("おもいます", "思います"),
    ("いいます", "言います"),
    ("かちます", "勝ちます"),
    ("まけます", "負けます"),
    ("うごきます", "動きます"),
    ("やめます", "辞めます"),
    ("りゅうがくします", "留学します"),
    ("むだ", "無駄"),
    ("ふべん", "不便"),
    ("おなじ", "同じ"),
    ("しゅしょう", "首相"),
    ("だいとうりょう", "大統領"),
    ("せいじ", "政治"),
    ("しあい", "試合"),
    ("いけん", "意見"),
    ("きます", "着ます"),
    ("はきます", "履きます"),
    ("うまれます", "生まれます"),
    ("ちゅうしゃじょう", "駐車場"),
    ("ぼうし", "帽子"),
    ("めがね", "眼鏡"),
    ("やちん", "家賃"),
    ("わしつ", "和室"),
    ("まわします", "回します"),
    ("さわります", "触ります"),
    ("わたります", "渡ります"),
    ("まがります", "曲がります"),
    ("おゆ", "お湯"),
    ("おと", "音"),
    ("こしょう", "故障"),
    ("みち", "道"),
    ("こうさてん", "交差点"),
    ("しんごう", "信号"),
    ("かど", "角"),
    ("はし", "橋"),
    ("なおします", "直します"),
    ("しょうかいします", "紹介します"),
    ("あんないします", "案内します"),
    ("せつめいします", "説明します"),
    ("おかし", "お菓子"),
    ("じぶん", "自分"),
    ("かんがえます", "考えます"),
    ("つきます", "着きます"),
    ("いなか", "田舎"),
    ("たいしかん", "大使館"),
    ("いみ", "意味"),
    ("なんさい", "何歳"),
    ("おなまえ", "お名前"),
    ("ベトナムじん", "ベトナム人"),
    ("ブラジルじん", "ブラジル人"),
    ("アメリカじん", "アメリカ人"),
]

SPELLING_VARIANT_PAIRS = sorted(
    {pair for pair in SPELLING_VARIANT_PAIRS if len(pair[0]) >= 2},
    key=lambda pair: max(len(pair[0]), len(pair[1])),
    reverse=True,
)


def merge_variant_values(*values: str | None) -> str | None:
    variants: list[str] = []
    seen: set[str] = set()
    for value in values:
        if not value:
            continue
        for candidate in value.split(","):
            candidate = candidate.strip()
            if candidate and candidate not in seen:
                seen.add(candidate)
                variants.append(candidate)
    return ",".join(variants) if variants else None


def generate_spelling_variants(text: str, max_variants: int = 64) -> str | None:
    variants = {text}
    for kana, kanji in SPELLING_VARIANT_PAIRS:
        additions = set()
        for candidate in variants:
            if kana in candidate:
                additions.add(candidate.replace(kana, kanji))
            if kanji in candidate:
                additions.add(candidate.replace(kanji, kana))
        variants.update(additions)
        if len(variants) > max_variants + 1:
            variants = {text, *sorted(variant for variant in variants if variant != text)[:max_variants]}

    variants.discard(text)
    return ",".join(sorted(variants)) if variants else None


def build_kanji_variants(text: str, explicit: str | None = None) -> str | None:
    return merge_variant_values(explicit, generate_spelling_variants(text))


def ensure_kanji_variant_columns() -> None:
    if not DATABASE_URL.startswith("sqlite"):
        return

    with engine.begin() as connection:
        for table_name in ("sentences", "chunks"):
            columns = {
                row[1]
                for row in connection.exec_driver_sql(f"PRAGMA table_info({table_name})")
            }
            if "kanji_variants" not in columns:
                connection.exec_driver_sql(
                    f"ALTER TABLE {table_name} ADD COLUMN kanji_variants VARCHAR"
                )


def seed_database() -> None:
    create_db_and_tables()
    ensure_kanji_variant_columns()
    with SessionLocal() as db:
        for lesson_id, description in enumerate(LESSON_DESCRIPTIONS, start=1):
            lesson = db.get(Lesson, lesson_id)
            if lesson is None:
                db.add(
                    Lesson(
                        id=lesson_id,
                        title=f"Bài {lesson_id}",
                        description=description,
                    )
                )
            else:
                lesson.title = f"Bài {lesson_id}"
                lesson.description = description
        db.commit()

        for lesson_id, sentence_items in SEED_SENTENCES.items():
            # Seed content is the source of truth for lessons that have been authored.
            existing_sentences = db.scalars(
                select(Sentence).where(Sentence.lesson_id == lesson_id)
            ).all()
            for s in existing_sentences:
                db.delete(s)
            db.flush()

            for item in sentence_items:
                sentence = Sentence(
                    lesson_id=lesson_id,
                    full_japanese=item["full_japanese"],
                    full_romaji=item["full_romaji"],
                    full_vietnamese=item["full_vietnamese"],
                    audio_url=None,
                    kanji_variants=build_kanji_variants(
                        item["full_japanese"],
                        item.get("kanji_variants"),
                    ),
                )
                chunks = []
                for chunk_tuple in item["chunks"]:
                    order, japanese, vietnamese, is_key = chunk_tuple[:4]
                    variants = chunk_tuple[4] if len(chunk_tuple) > 4 else None
                    chunks.append(
                        Chunk(
                            order_index=order,
                            japanese=japanese,
                            vietnamese=vietnamese,
                            is_grammar_key=is_key,
                            kanji_variants=build_kanji_variants(japanese, variants),
                        )
                    )
                sentence.chunks = chunks
                db.add(sentence)

        for lesson_id, passage_items in SEED_PASSAGES.items():
            existing_passages = db.scalars(
                select(Passage)
                .where(Passage.lesson_id == lesson_id)
                .order_by(Passage.id)
            ).all()
            for position, passage_item in enumerate(passage_items):
                if position < len(existing_passages):
                    passage = existing_passages[position]
                else:
                    passage = Passage(lesson_id=lesson_id)
                    db.add(passage)

                passage.title = passage_item["title"]
                passage.content = json.dumps(
                    passage_item["content"], ensure_ascii=False
                )

            for extra_passage in existing_passages[len(passage_items):]:
                db.delete(extra_passage)

        db.commit()


if __name__ == "__main__":
    seed_database()
    print("Seed complete: 50 lessons and learning data for lessons 1-25.")
