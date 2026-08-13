"""
Lesson 1 vocabulary data extracted from Minna no Nihongo images.
Each vocabulary item is represented as a sentence with chunks (Chunking method).
"""

LESSON1_SENTENCES = [
    # --- Đại từ nhân xưng ---
    {
        "full_japanese": "わたしは グエンです。",
        "full_romaji": "Watashi wa Guyen desu.",
        "full_vietnamese": "Tôi là Nguyễn.",
        "chunks": [
            (1, "わたしは", "tôi (chủ đề)", True),
            (2, "グエン", "Nguyễn", False),
            (3, "です。", "là", False),
        ],
    },
    {
        "full_japanese": "わたしたちは がくせいです。",
        "full_romaji": "Watashitachi wa gakusei desu.",
        "full_vietnamese": "Chúng tôi là học sinh.",
        "chunks": [
            (1, "わたしたちは", "chúng tôi (chủ đề)", True),
            (2, "がくせい", "học sinh", False),
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
    # --- Nơi chốn ---
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
        "full_japanese": "はじめまして。 どうぞ よろしく おねがいします。",
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
]

LESSON1_PASSAGE = {
    "title": "はじめまして — Lần đầu gặp mặt",
    "content": [
        {"text": "はじめまして。", "meaning": "Rất hân hạnh được gặp bạn.", "note": "Lời chào khi gặp lần đầu tiên."},
        {"text": "わたし", "meaning": "tôi", "note": "Đại từ nhân xưng ngôi thứ nhất, lịch sự và trung tính."},
        {"text": "は", "meaning": "trợ từ chủ đề (wa)", "note": "Viết là は nhưng đọc là 'wa' khi làm trợ từ. Đánh dấu chủ đề câu."},
        {"text": "グエン", "meaning": "Nguyễn", "note": "Tên người."},
        {"text": "です。", "meaning": "là (kết thúc câu lịch sự)", "note": "Copula lịch sự, tương đương 'là' trong tiếng Việt."},
        {"text": "ベトナム", "meaning": "Việt Nam", "note": "Tên quốc gia, viết bằng Katakana."},
        {"text": "じん", "furigana": "じん", "meaning": "người (quốc tịch)", "note": "Hậu tố ～じん(人) ghép sau tên nước để chỉ quốc tịch."},
        {"text": "どうぞよろしくおねがいします。", "meaning": "Rất mong được sự giúp đỡ của anh/chị.", "note": "Câu kết thúc khi tự giới thiệu bản thân."},
    ],
}
