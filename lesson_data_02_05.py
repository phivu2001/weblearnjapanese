"""Comprehensive chunk-based seed content for Minna no Nihongo lessons 2-5."""

LESSON_SENTENCES = {
    2: [
        {
            "full_japanese": "これは日本語の辞書です。",
            "full_romaji": "Kore wa Nihongo no jisho desu.",
            "full_vietnamese": "Đây là từ điển tiếng Nhật.",
            "chunks": [
                (1, "これは", "cái này thì", True),
                (2, "日本語の", "tiếng Nhật", False),
                (3, "辞書です。", "là từ điển", False),
            ],
        },
        {
            "full_japanese": "それは英語の本ですか。",
            "full_romaji": "Sore wa Eigo no hon desu ka.",
            "full_vietnamese": "Đó có phải là sách tiếng Anh không?",
            "chunks": [
                (1, "それは", "cái đó thì", False),
                (2, "英語の本", "sách tiếng Anh", False),
                (3, "ですか。", "có phải không", True),
            ],
        },
        {
            "full_japanese": "あれは何の雑誌ですか。",
            "full_romaji": "Are wa nan no zasshi desu ka.",
            "full_vietnamese": "Kia là tạp chí gì?",
            "chunks": [
                (1, "あれは", "cái kia thì", False),
                (2, "何の", "về cái gì", True),
                (3, "雑誌ですか。", "là tạp chí vậy", False),
            ],
        },
        {
            "full_japanese": "この新聞は日本のです。",
            "full_romaji": "Kono shinbun wa Nihon no desu.",
            "full_vietnamese": "Tờ báo này là của Nhật.",
            "chunks": [
                (1, "この新聞は", "tờ báo này thì", True),
                (2, "日本の", "của Nhật", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "そのノートと手帳はわたしのです。",
            "full_romaji": "Sono nooto to techou wa watashi no desu.",
            "full_vietnamese": "Quyển vở và sổ tay đó là của tôi.",
            "chunks": [
                (1, "そのノートと手帳は", "quyển vở và sổ tay đó", False),
                (2, "わたしの", "của tôi", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "あの名刺はミラーさんのです。",
            "full_romaji": "Ano meishi wa Miraa-san no desu.",
            "full_vietnamese": "Tấm danh thiếp kia là của anh Miller.",
            "chunks": [
                (1, "あの名刺は", "tấm danh thiếp kia", True),
                (2, "ミラーさんの", "của anh Miller", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "これはカードですか、テレホンカードですか。",
            "full_romaji": "Kore wa kaado desu ka, terehon kaado desu ka.",
            "full_vietnamese": "Đây là thẻ thường hay thẻ điện thoại?",
            "chunks": [
                (1, "これは", "cái này thì", False),
                (2, "カードですか、", "là thẻ thường", False),
                (3, "テレホンカードですか。", "hay là thẻ điện thoại", True),
            ],
        },
        {
            "full_japanese": "鉛筆ですか、ボールペンですか。",
            "full_romaji": "Enpitsu desu ka, boorupen desu ka.",
            "full_vietnamese": "Đó là bút chì hay bút bi?",
            "chunks": [
                (1, "鉛筆ですか、", "là bút chì", False),
                (2, "ボールペン", "bút bi", False),
                (3, "ですか。", "hay là", True),
            ],
        },
        {
            "full_japanese": "これはシャープペンシルです。",
            "full_romaji": "Kore wa shaapu penshiru desu.",
            "full_vietnamese": "Đây là bút chì kim.",
            "chunks": [
                (1, "これは", "cái này thì", True),
                (2, "シャープペンシル", "bút chì kim", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "この鍵と時計は田中さんのです。",
            "full_romaji": "Kono kagi to tokei wa Tanaka-san no desu.",
            "full_vietnamese": "Chìa khóa và đồng hồ này là của anh Tanaka.",
            "chunks": [
                (1, "この鍵と時計は", "chìa khóa và đồng hồ này", False),
                (2, "田中さんの", "của anh Tanaka", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "その傘とカバンはだれのですか。",
            "full_romaji": "Sono kasa to kaban wa dare no desu ka.",
            "full_vietnamese": "Chiếc ô và cái cặp đó là của ai?",
            "chunks": [
                (1, "その傘とカバンは", "chiếc ô và cái cặp đó", False),
                (2, "だれの", "của ai", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "これは日本語のテープです。",
            "full_romaji": "Kore wa Nihongo no teepu desu.",
            "full_vietnamese": "Đây là băng tiếng Nhật.",
            "chunks": [
                (1, "これは", "cái này thì", True),
                (2, "日本語のテープ", "băng tiếng Nhật", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "あれはテープレコーダーです。",
            "full_romaji": "Are wa teepu rekoodaa desu.",
            "full_vietnamese": "Kia là máy ghi âm.",
            "chunks": [
                (1, "あれは", "cái kia thì", True),
                (2, "テープレコーダー", "máy ghi âm", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "このテレビとラジオは日本のです。",
            "full_romaji": "Kono terebi to rajio wa Nihon no desu.",
            "full_vietnamese": "Chiếc tivi và radio này là của Nhật.",
            "chunks": [
                (1, "このテレビとラジオは", "chiếc tivi và radio này", False),
                (2, "日本の", "của Nhật", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "そのカメラはドイツのです。",
            "full_romaji": "Sono kamera wa Doitsu no desu.",
            "full_vietnamese": "Máy ảnh đó là của Đức.",
            "chunks": [
                (1, "そのカメラは", "máy ảnh đó", True),
                (2, "ドイツの", "của Đức", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "あのコンピューターはIMCのです。",
            "full_romaji": "Ano konpyuutaa wa IMC no desu.",
            "full_vietnamese": "Máy tính kia là của công ty IMC.",
            "chunks": [
                (1, "あのコンピューターは", "máy tính kia", False),
                (2, "IMCの", "của IMC", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "これは日本の自動車です。",
            "full_romaji": "Kore wa Nihon no jidousha desu.",
            "full_vietnamese": "Đây là ô tô Nhật Bản.",
            "chunks": [
                (1, "これは", "cái này thì", False),
                (2, "日本の", "của Nhật", True),
                (3, "自動車です。", "là ô tô", False),
            ],
        },
        {
            "full_japanese": "この机と椅子はIMCのです。",
            "full_romaji": "Kono tsukue to isu wa IMC no desu.",
            "full_vietnamese": "Cái bàn và ghế này là của công ty IMC.",
            "chunks": [
                (1, "この机と椅子は", "cái bàn và ghế này", False),
                (2, "IMCの", "của công ty IMC", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "このチョコレートとコーヒーはお土産です。",
            "full_romaji": "Kono chokoreeto to koohii wa omiyage desu.",
            "full_vietnamese": "Sô-cô-la và cà phê này là quà.",
            "chunks": [
                (1, "このチョコレートとコーヒーは", "sô-cô-la và cà phê này", False),
                (2, "お土産", "quà lưu niệm", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "これはカメラですか。はい、そうです。そうですか。",
            "full_romaji": "Kore wa kamera desu ka. Hai, sou desu. Sou desu ka.",
            "full_vietnamese": "Đây có phải là máy ảnh không? Vâng, đúng vậy. Ra là vậy.",
            "chunks": [
                (1, "これはカメラ", "đây là máy ảnh", False),
                (2, "ですか。", "có phải không", True),
                (3, "はい、そうです。", "vâng, đúng vậy", False),
                (4, "そうですか。", "ra là vậy", False),
            ],
        },
        {
            "full_japanese": "これは英語の辞書ですか。いいえ、違います。",
            "full_romaji": "Kore wa Eigo no jisho desu ka. Iie, chigaimasu.",
            "full_vietnamese": "Đây là từ điển tiếng Anh phải không? Không, không phải.",
            "chunks": [
                (1, "これは英語の辞書", "đây là từ điển tiếng Anh", False),
                (2, "ですか。", "có phải không", False),
                (3, "いいえ、違います。", "không, không phải", True),
            ],
        },
        {
            "full_japanese": "あのう、これはほんの気持ちです。どうぞ。",
            "full_romaji": "Anou, kore wa honno kimochi desu. Douzo.",
            "full_vietnamese": "À, đây chỉ là chút lòng thành. Xin mời nhận.",
            "chunks": [
                (1, "あのう、", "à, xin phép", False),
                (2, "これはほんの気持ちです。", "đây chỉ là chút lòng thành", True),
                (3, "どうぞ。", "xin mời nhận", False),
            ],
        },
        {
            "full_japanese": "どうもありがとうございます。これからお世話になります。",
            "full_romaji": "Doumo arigatou gozaimasu. Kore kara osewa ni narimasu.",
            "full_vietnamese": "Xin cảm ơn rất nhiều. Từ nay mong anh/chị giúp đỡ.",
            "chunks": [
                (1, "どうもありがとうございます。", "xin cảm ơn rất nhiều", False),
                (2, "これから", "từ nay", False),
                (3, "お世話になります。", "mong được giúp đỡ", True),
            ],
        },
        {
            "full_japanese": "こちらこそよろしくお願いします。",
            "full_romaji": "Kochira koso yoroshiku onegaishimasu.",
            "full_vietnamese": "Chính tôi cũng mong được anh/chị giúp đỡ.",
            "chunks": [
                (1, "こちらこそ", "chính tôi cũng vậy", True),
                (2, "よろしく", "mong được đối xử tốt", False),
                (3, "お願いします。", "xin nhờ anh/chị", False),
            ],
        },
    ],
    3: [
        {
            "full_japanese": "ここは日本語の教室です。",
            "full_romaji": "Koko wa Nihongo no kyoushitsu desu.",
            "full_vietnamese": "Đây là phòng học tiếng Nhật.",
            "chunks": [
                (1, "ここは", "nơi đây thì", True),
                (2, "日本語の教室", "phòng học tiếng Nhật", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "そこは会社の食堂です。",
            "full_romaji": "Soko wa kaisha no shokudou desu.",
            "full_vietnamese": "Chỗ đó là nhà ăn của công ty.",
            "chunks": [
                (1, "そこは", "chỗ đó thì", True),
                (2, "会社の食堂", "nhà ăn của công ty", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "あそこはIMCの事務所です。",
            "full_romaji": "Asoko wa IMC no jimusho desu.",
            "full_vietnamese": "Đằng kia là văn phòng của IMC.",
            "chunks": [
                (1, "あそこは", "đằng kia thì", True),
                (2, "IMCの事務所", "văn phòng của IMC", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "会議室はどこですか。",
            "full_romaji": "Kaigishitsu wa doko desu ka.",
            "full_vietnamese": "Phòng họp ở đâu?",
            "chunks": [
                (1, "会議室は", "phòng họp thì", False),
                (2, "どこ", "ở đâu", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "受付はこちらです。",
            "full_romaji": "Uketsuke wa kochira desu.",
            "full_vietnamese": "Quầy tiếp tân ở phía này.",
            "chunks": [
                (1, "受付は", "quầy tiếp tân thì", False),
                (2, "こちら", "phía này", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "ロビーはそちらです。",
            "full_romaji": "Robii wa sochira desu.",
            "full_vietnamese": "Sảnh ở phía đó.",
            "chunks": [
                (1, "ロビーは", "sảnh thì", False),
                (2, "そちら", "phía đó", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "お手洗いはあちらです。",
            "full_romaji": "Otearai wa achira desu.",
            "full_vietnamese": "Nhà vệ sinh ở phía đằng kia.",
            "chunks": [
                (1, "お手洗いは", "nhà vệ sinh thì", False),
                (2, "あちら", "phía đằng kia", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "エレベーターはどちらですか。",
            "full_romaji": "Erebeetaa wa dochira desu ka.",
            "full_vietnamese": "Thang máy ở hướng nào ạ?",
            "chunks": [
                (1, "エレベーターは", "thang máy thì", False),
                (2, "どちら", "hướng nào", True),
                (3, "ですか。", "ạ", False),
            ],
        },
        {
            "full_japanese": "わたしの部屋は三階です。",
            "full_romaji": "Watashi no heya wa sankai desu.",
            "full_vietnamese": "Phòng của tôi ở tầng ba.",
            "chunks": [
                (1, "わたしの部屋は", "phòng của tôi thì", False),
                (2, "三階", "tầng ba", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "トイレは二階です。階段はあそこです。",
            "full_romaji": "Toire wa nikai desu. Kaidan wa asoko desu.",
            "full_vietnamese": "Nhà vệ sinh ở tầng hai. Cầu thang ở đằng kia.",
            "chunks": [
                (1, "トイレは二階です。", "nhà vệ sinh ở tầng hai", False),
                (2, "階段は", "cầu thang thì", False),
                (3, "あそこです。", "ở đằng kia", True),
            ],
        },
        {
            "full_japanese": "エスカレーターは一階です。",
            "full_romaji": "Esukareetaa wa ikkai desu.",
            "full_vietnamese": "Thang cuốn ở tầng một.",
            "chunks": [
                (1, "エスカレーターは", "thang cuốn thì", False),
                (2, "一階", "tầng một", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "電話はこちらです。",
            "full_romaji": "Denwa wa kochira desu.",
            "full_vietnamese": "Điện thoại ở phía này.",
            "chunks": [
                (1, "電話は", "điện thoại thì", False),
                (2, "こちら", "phía này", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "お国はどちらですか。",
            "full_romaji": "Okuni wa dochira desu ka.",
            "full_vietnamese": "Anh/chị đến từ nước nào?",
            "chunks": [
                (1, "お国は", "đất nước của anh/chị thì", False),
                (2, "どちら", "nước nào", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "わたしの会社は東京です。",
            "full_romaji": "Watashi no kaisha wa Toukyou desu.",
            "full_vietnamese": "Công ty của tôi ở Tokyo.",
            "chunks": [
                (1, "わたしの会社は", "công ty của tôi thì", True),
                (2, "東京", "Tokyo", False),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "うちは大阪です。",
            "full_romaji": "Uchi wa Oosaka desu.",
            "full_vietnamese": "Nhà tôi ở Osaka.",
            "chunks": [
                (1, "うちは", "nhà tôi thì", True),
                (2, "大阪", "Osaka", False),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "靴売り場は地下です。",
            "full_romaji": "Kutsu uriba wa chika desu.",
            "full_vietnamese": "Quầy bán giày ở tầng hầm.",
            "chunks": [
                (1, "靴売り場は", "quầy bán giày thì", False),
                (2, "地下", "tầng hầm", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "ネクタイ売り場は五階です。",
            "full_romaji": "Nekutai uriba wa gokai desu.",
            "full_vietnamese": "Quầy bán cà vạt ở tầng năm.",
            "chunks": [
                (1, "ネクタイ売り場は", "quầy bán cà vạt thì", False),
                (2, "五階", "tầng năm", True),
                (3, "です。", "ở", False),
            ],
        },
        {
            "full_japanese": "ワインとタバコの売り場は何階ですか。",
            "full_romaji": "Wain to tabako no uriba wa nankai desu ka.",
            "full_vietnamese": "Quầy rượu vang và thuốc lá ở tầng mấy?",
            "chunks": [
                (1, "ワインとタバコの売り場は", "quầy rượu vang và thuốc lá", False),
                (2, "何階", "tầng mấy", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "この靴はいくらですか。三千円です。",
            "full_romaji": "Kono kutsu wa ikura desu ka. Sanzen-en desu.",
            "full_vietnamese": "Đôi giày này bao nhiêu tiền? Ba nghìn yên.",
            "chunks": [
                (1, "この靴は", "đôi giày này thì", False),
                (2, "いくらですか。", "bao nhiêu tiền", True),
                (3, "三千円です。", "ba nghìn yên", False),
            ],
        },
        {
            "full_japanese": "そのネクタイは八百円です。",
            "full_romaji": "Sono nekutai wa happyaku-en desu.",
            "full_vietnamese": "Chiếc cà vạt đó giá tám trăm yên.",
            "chunks": [
                (1, "そのネクタイは", "chiếc cà vạt đó thì", False),
                (2, "八百円", "tám trăm yên", True),
                (3, "です。", "giá là", False),
            ],
        },
        {
            "full_japanese": "このワインは一万円です。",
            "full_romaji": "Kono wain wa ichiman-en desu.",
            "full_vietnamese": "Chai rượu vang này giá mười nghìn yên.",
            "chunks": [
                (1, "このワインは", "chai rượu vang này thì", False),
                (2, "一万円", "mười nghìn yên", True),
                (3, "です。", "giá là", False),
            ],
        },
        {
            "full_japanese": "すみません、このカメラを見せてください。",
            "full_romaji": "Sumimasen, kono kamera o misete kudasai.",
            "full_vietnamese": "Xin lỗi, cho tôi xem chiếc máy ảnh này.",
            "chunks": [
                (1, "すみません、", "xin lỗi", False),
                (2, "このカメラを", "chiếc máy ảnh này", False),
                (3, "見せてください。", "xin hãy cho xem", True),
            ],
        },
        {
            "full_japanese": "こちらは受付でございます。",
            "full_romaji": "Kochira wa uketsuke de gozaimasu.",
            "full_vietnamese": "Đây là quầy tiếp tân ạ.",
            "chunks": [
                (1, "こちらは", "phía này thì", False),
                (2, "受付", "quầy tiếp tân", False),
                (3, "でございます。", "là (cách nói lịch sự)", True),
            ],
        },
        {
            "full_japanese": "じゃ、この靴をください。",
            "full_romaji": "Ja, kono kutsu o kudasai.",
            "full_vietnamese": "Vậy thì cho tôi đôi giày này.",
            "chunks": [
                (1, "じゃ、", "vậy thì", False),
                (2, "この靴を", "đôi giày này", False),
                (3, "ください。", "xin cho tôi", True),
            ],
        },
    ],
    4: [
        {
            "full_japanese": "毎朝六時半に起きます。",
            "full_romaji": "Maiasa rokuji han ni okimasu.",
            "full_vietnamese": "Mỗi sáng tôi thức dậy lúc sáu giờ rưỡi.",
            "chunks": [
                (1, "毎朝", "mỗi sáng", False),
                (2, "六時半に", "lúc sáu giờ rưỡi", True),
                (3, "起きます。", "thức dậy", False),
            ],
        },
        {
            "full_japanese": "毎晩十一時に寝ます。",
            "full_romaji": "Maiban juuichiji ni nemasu.",
            "full_vietnamese": "Mỗi tối tôi đi ngủ lúc mười một giờ.",
            "chunks": [
                (1, "毎晩", "mỗi tối", False),
                (2, "十一時に", "lúc mười một giờ", True),
                (3, "寝ます。", "đi ngủ", False),
            ],
        },
        {
            "full_japanese": "月曜日から金曜日まで働きます。",
            "full_romaji": "Getsuyoubi kara kinyoubi made hatarakimasu.",
            "full_vietnamese": "Tôi làm việc từ thứ Hai đến thứ Sáu.",
            "chunks": [
                (1, "月曜日から", "từ thứ Hai", True),
                (2, "金曜日まで", "đến thứ Sáu", False),
                (3, "働きます。", "làm việc", False),
            ],
        },
        {
            "full_japanese": "土曜日と日曜日は休みます。",
            "full_romaji": "Doyoubi to nichiyoubi wa yasumimasu.",
            "full_vietnamese": "Tôi nghỉ vào thứ Bảy và Chủ nhật.",
            "chunks": [
                (1, "土曜日と日曜日は", "thứ Bảy và Chủ nhật thì", True),
                (2, "休みます。", "nghỉ", False),
            ],
        },
        {
            "full_japanese": "毎日九時から日本語を勉強します。",
            "full_romaji": "Mainichi kuji kara Nihongo o benkyou shimasu.",
            "full_vietnamese": "Mỗi ngày tôi học tiếng Nhật từ chín giờ.",
            "chunks": [
                (1, "毎日", "mỗi ngày", False),
                (2, "九時から", "từ chín giờ", True),
                (3, "日本語を勉強します。", "học tiếng Nhật", False),
            ],
        },
        {
            "full_japanese": "会社は午後五時に終わります。",
            "full_romaji": "Kaisha wa gogo goji ni owarimasu.",
            "full_vietnamese": "Công ty kết thúc công việc lúc năm giờ chiều.",
            "chunks": [
                (1, "会社は", "công ty thì", False),
                (2, "午後五時に", "lúc năm giờ chiều", True),
                (3, "終わります。", "kết thúc", False),
            ],
        },
        {
            "full_japanese": "デパートは午前十時から午後八時までです。",
            "full_romaji": "Depaato wa gozen juuji kara gogo hachiji made desu.",
            "full_vietnamese": "Cửa hàng bách hóa mở từ mười giờ sáng đến tám giờ tối.",
            "chunks": [
                (1, "デパートは", "cửa hàng bách hóa thì", False),
                (2, "午前十時から", "từ mười giờ sáng", True),
                (3, "午後八時まで", "đến tám giờ tối", False),
                (4, "です。", "mở cửa", False),
            ],
        },
        {
            "full_japanese": "銀行は九時から三時までです。",
            "full_romaji": "Ginkou wa kuji kara sanji made desu.",
            "full_vietnamese": "Ngân hàng mở từ chín giờ đến ba giờ.",
            "chunks": [
                (1, "銀行は", "ngân hàng thì", False),
                (2, "九時から三時まで", "từ chín giờ đến ba giờ", True),
                (3, "です。", "mở cửa", False),
            ],
        },
        {
            "full_japanese": "郵便局は九時半から五時半までです。",
            "full_romaji": "Yuubinkyoku wa kuji han kara goji han made desu.",
            "full_vietnamese": "Bưu điện mở từ chín giờ rưỡi đến năm giờ rưỡi.",
            "chunks": [
                (1, "郵便局は", "bưu điện thì", False),
                (2, "九時半から五時半まで", "từ chín giờ rưỡi đến năm giờ rưỡi", True),
                (3, "です。", "mở cửa", False),
            ],
        },
        {
            "full_japanese": "図書館は火曜日が休みです。",
            "full_romaji": "Toshokan wa kayoubi ga yasumi desu.",
            "full_vietnamese": "Thư viện nghỉ vào thứ Ba.",
            "chunks": [
                (1, "図書館は", "thư viện thì", False),
                (2, "火曜日が", "thứ Ba là", True),
                (3, "休みです。", "ngày nghỉ", False),
            ],
        },
        {
            "full_japanese": "美術館は何時から何時までですか。",
            "full_romaji": "Bijutsukan wa nanji kara nanji made desu ka.",
            "full_vietnamese": "Bảo tàng mỹ thuật mở từ mấy giờ đến mấy giờ?",
            "chunks": [
                (1, "美術館は", "bảo tàng mỹ thuật thì", False),
                (2, "何時から何時まで", "từ mấy giờ đến mấy giờ", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "今何時何分ですか。",
            "full_romaji": "Ima nanji nanpun desu ka.",
            "full_vietnamese": "Bây giờ là mấy giờ mấy phút?",
            "chunks": [
                (1, "今", "bây giờ", False),
                (2, "何時何分", "mấy giờ mấy phút", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "午前七時十分です。",
            "full_romaji": "Gozen shichiji juppun desu.",
            "full_vietnamese": "Bây giờ là bảy giờ mười phút sáng.",
            "chunks": [
                (1, "午前", "buổi sáng", False),
                (2, "七時十分", "bảy giờ mười phút", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "朝から晩まで働きます。夜は休みます。",
            "full_romaji": "Asa kara ban made hatarakimasu. Yoru wa yasumimasu.",
            "full_vietnamese": "Tôi làm việc từ sáng đến tối. Ban đêm tôi nghỉ.",
            "chunks": [
                (1, "朝から晩まで", "từ sáng đến tối", True),
                (2, "働きます。", "làm việc", False),
                (3, "夜は休みます。", "ban đêm thì nghỉ", False),
            ],
        },
        {
            "full_japanese": "昼休みは十二時から一時までです。",
            "full_romaji": "Hiruyasumi wa juuniji kara ichiji made desu.",
            "full_vietnamese": "Giờ nghỉ trưa từ mười hai giờ đến một giờ.",
            "chunks": [
                (1, "昼休みは", "giờ nghỉ trưa thì", False),
                (2, "十二時から一時まで", "từ mười hai giờ đến một giờ", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "おとといときのうは休みでした。",
            "full_romaji": "Ototoi to kinou wa yasumi deshita.",
            "full_vietnamese": "Hôm kia và hôm qua là ngày nghỉ.",
            "chunks": [
                (1, "おとといときのうは", "hôm kia và hôm qua thì", True),
                (2, "休みでした。", "đã là ngày nghỉ", False),
            ],
        },
        {
            "full_japanese": "きょうは水曜日です。あしたは木曜日です。",
            "full_romaji": "Kyou wa suiyoubi desu. Ashita wa mokuyoubi desu.",
            "full_vietnamese": "Hôm nay là thứ Tư. Ngày mai là thứ Năm.",
            "chunks": [
                (1, "きょうは水曜日です。", "hôm nay là thứ Tư", False),
                (2, "あしたは", "ngày mai thì", True),
                (3, "木曜日です。", "là thứ Năm", False),
            ],
        },
        {
            "full_japanese": "あさっては金曜日です。",
            "full_romaji": "Asatte wa kinyoubi desu.",
            "full_vietnamese": "Ngày kia là thứ Sáu.",
            "chunks": [
                (1, "あさっては", "ngày kia thì", True),
                (2, "金曜日", "thứ Sáu", False),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "今朝は六時に起きました。今晩は十時に寝ます。",
            "full_romaji": "Kesa wa rokuji ni okimashita. Konban wa juuji ni nemasu.",
            "full_vietnamese": "Sáng nay tôi dậy lúc sáu giờ. Tối nay tôi sẽ ngủ lúc mười giờ.",
            "chunks": [
                (1, "今朝は六時に起きました。", "sáng nay đã dậy lúc sáu giờ", False),
                (2, "今晩は", "tối nay thì", False),
                (3, "十時に", "lúc mười giờ", True),
                (4, "寝ます。", "đi ngủ", False),
            ],
        },
        {
            "full_japanese": "そちらは何曜日が休みですか。",
            "full_romaji": "Sochira wa nanyoubi ga yasumi desu ka.",
            "full_vietnamese": "Chỗ anh/chị nghỉ vào thứ mấy?",
            "chunks": [
                (1, "そちらは", "chỗ anh/chị thì", False),
                (2, "何曜日が", "thứ mấy là", True),
                (3, "休みですか。", "ngày nghỉ vậy", False),
            ],
        },
        {
            "full_japanese": "電話番号は何番ですか。",
            "full_romaji": "Denwa bangou wa nanban desu ka.",
            "full_vietnamese": "Số điện thoại là số mấy?",
            "chunks": [
                (1, "電話番号は", "số điện thoại thì", False),
                (2, "何番", "số mấy", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "えーと、番号案内をお願いします。",
            "full_romaji": "Eeto, bangou annai o onegaishimasu.",
            "full_vietnamese": "Để tôi xem, xin nối dịch vụ tra số điện thoại.",
            "chunks": [
                (1, "えーと、", "để tôi xem", False),
                (2, "番号案内を", "dịch vụ tra số", False),
                (3, "お願いします。", "xin nhờ", True),
            ],
        },
        {
            "full_japanese": "はい、かしこまりました。お問い合わせの番号は1234です。",
            "full_romaji": "Hai, kashikomarimashita. Otoiawase no bangou wa ichi ni san yon desu.",
            "full_vietnamese": "Vâng, tôi hiểu rồi. Số anh/chị hỏi là 1234.",
            "chunks": [
                (1, "はい、かしこまりました。", "vâng, tôi hiểu rồi", True),
                (2, "お問い合わせの番号は", "số được hỏi thì", False),
                (3, "1234です。", "là 1234", False),
            ],
        },
        {
            "full_japanese": "毎日大変ですね。どうもありがとうございました。",
            "full_romaji": "Mainichi taihen desu ne. Doumo arigatou gozaimashita.",
            "full_vietnamese": "Ngày nào cũng vất vả nhỉ. Xin cảm ơn rất nhiều.",
            "chunks": [
                (1, "毎日", "mỗi ngày", False),
                (2, "大変ですね。", "vất vả nhỉ", True),
                (3, "どうもありがとうございました。", "xin cảm ơn rất nhiều", False),
            ],
        },
    ],
    5: [
        {
            "full_japanese": "来週、友達と京都へ行きます。",
            "full_romaji": "Raishuu, tomodachi to Kyouto e ikimasu.",
            "full_vietnamese": "Tuần sau tôi sẽ đi Kyoto cùng bạn.",
            "chunks": [
                (1, "来週、", "tuần sau", False),
                (2, "友達と", "cùng bạn", True),
                (3, "京都へ行きます。", "đi Kyoto", False),
            ],
        },
        {
            "full_japanese": "先週、家族が東京へ来ました。",
            "full_romaji": "Senshuu, kazoku ga Toukyou e kimashita.",
            "full_vietnamese": "Tuần trước gia đình tôi đã đến Tokyo.",
            "chunks": [
                (1, "先週、", "tuần trước", False),
                (2, "家族が", "gia đình tôi", False),
                (3, "東京へ", "đến Tokyo", True),
                (4, "来ました。", "đã đến", False),
            ],
        },
        {
            "full_japanese": "毎晩七時にうちへ帰ります。",
            "full_romaji": "Maiban shichiji ni uchi e kaerimasu.",
            "full_vietnamese": "Mỗi tối tôi về nhà lúc bảy giờ.",
            "chunks": [
                (1, "毎晩七時に", "mỗi tối lúc bảy giờ", False),
                (2, "うちへ", "về nhà", True),
                (3, "帰ります。", "trở về", False),
            ],
        },
        {
            "full_japanese": "学校へ自転車で行きます。",
            "full_romaji": "Gakkou e jitensha de ikimasu.",
            "full_vietnamese": "Tôi đi đến trường bằng xe đạp.",
            "chunks": [
                (1, "学校へ", "đến trường", False),
                (2, "自転車で", "bằng xe đạp", True),
                (3, "行きます。", "đi", False),
            ],
        },
        {
            "full_japanese": "スーパーへ歩いて行きます。",
            "full_romaji": "Suupaa e aruite ikimasu.",
            "full_vietnamese": "Tôi đi bộ đến siêu thị.",
            "chunks": [
                (1, "スーパーへ", "đến siêu thị", False),
                (2, "歩いて", "bằng cách đi bộ", True),
                (3, "行きます。", "đi", False),
            ],
        },
        {
            "full_japanese": "駅までバスで行きます。",
            "full_romaji": "Eki made basu de ikimasu.",
            "full_vietnamese": "Tôi đi xe buýt đến ga.",
            "chunks": [
                (1, "駅まで", "đến ga", False),
                (2, "バスで", "bằng xe buýt", True),
                (3, "行きます。", "đi", False),
            ],
        },
        {
            "full_japanese": "普通電車で大阪へ行きます。",
            "full_romaji": "Futsuu densha de Oosaka e ikimasu.",
            "full_vietnamese": "Tôi đi Osaka bằng tàu thường.",
            "chunks": [
                (1, "普通電車で", "bằng tàu thường", True),
                (2, "大阪へ", "đến Osaka", False),
                (3, "行きます。", "đi", False),
            ],
        },
        {
            "full_japanese": "急行は三番線、特急は五番線です。",
            "full_romaji": "Kyuukou wa sanbansen, tokkyuu wa gobansen desu.",
            "full_vietnamese": "Tàu tốc hành ở đường ray số ba, tàu tốc hành đặc biệt ở đường ray số năm.",
            "chunks": [
                (1, "急行は三番線、", "tàu tốc hành ở đường ray số ba", False),
                (2, "特急は", "tàu tốc hành đặc biệt thì", False),
                (3, "五番線です。", "ở đường ray số năm", True),
            ],
        },
        {
            "full_japanese": "次の新幹線は何番線ですか。",
            "full_romaji": "Tsugi no shinkansen wa nanbansen desu ka.",
            "full_vietnamese": "Chuyến tàu Shinkansen tiếp theo ở đường ray số mấy?",
            "chunks": [
                (1, "次の新幹線は", "tàu Shinkansen tiếp theo thì", False),
                (2, "何番線", "đường ray số mấy", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "北海道へ飛行機で行きます。",
            "full_romaji": "Hokkaidou e hikouki de ikimasu.",
            "full_vietnamese": "Tôi đi Hokkaido bằng máy bay.",
            "chunks": [
                (1, "北海道へ", "đến Hokkaido", False),
                (2, "飛行機で", "bằng máy bay", True),
                (3, "行きます。", "đi", False),
            ],
        },
        {
            "full_japanese": "大阪へ船で行きます。",
            "full_romaji": "Oosaka e fune de ikimasu.",
            "full_vietnamese": "Tôi đi Osaka bằng tàu thủy.",
            "chunks": [
                (1, "大阪へ", "đến Osaka", False),
                (2, "船で", "bằng tàu thủy", True),
                (3, "行きます。", "đi", False),
            ],
        },
        {
            "full_japanese": "会社へ地下鉄で行きます。",
            "full_romaji": "Kaisha e chikatetsu de ikimasu.",
            "full_vietnamese": "Tôi đi đến công ty bằng tàu điện ngầm.",
            "chunks": [
                (1, "会社へ", "đến công ty", False),
                (2, "地下鉄で", "bằng tàu điện ngầm", True),
                (3, "行きます。", "đi", False),
            ],
        },
        {
            "full_japanese": "駅からうちまでタクシーで帰ります。",
            "full_romaji": "Eki kara uchi made takushii de kaerimasu.",
            "full_vietnamese": "Tôi về nhà từ ga bằng taxi.",
            "chunks": [
                (1, "駅からうちまで", "từ ga đến nhà", False),
                (2, "タクシーで", "bằng taxi", True),
                (3, "帰ります。", "trở về", False),
            ],
        },
        {
            "full_japanese": "彼はベトナムの人です。一人で日本へ来ました。",
            "full_romaji": "Kare wa Betonamu no hito desu. Hitori de Nihon e kimashita.",
            "full_vietnamese": "Anh ấy là người Việt Nam. Anh ấy đã đến Nhật một mình.",
            "chunks": [
                (1, "彼はベトナムの人です。", "anh ấy là người Việt Nam", False),
                (2, "一人で", "một mình", True),
                (3, "日本へ来ました。", "đã đến Nhật", False),
            ],
        },
        {
            "full_japanese": "彼女は友達と韓国へ行きます。",
            "full_romaji": "Kanojo wa tomodachi to Kankoku e ikimasu.",
            "full_vietnamese": "Cô ấy đi Hàn Quốc cùng bạn.",
            "chunks": [
                (1, "彼女は", "cô ấy thì", False),
                (2, "友達と", "cùng bạn", True),
                (3, "韓国へ行きます。", "đi Hàn Quốc", False),
            ],
        },
        {
            "full_japanese": "今週はどこへも行きません。",
            "full_romaji": "Konshuu wa doko e mo ikimasen.",
            "full_vietnamese": "Tuần này tôi không đi đâu cả.",
            "chunks": [
                (1, "今週は", "tuần này thì", False),
                (2, "どこへも", "không đâu cả", True),
                (3, "行きません。", "không đi", False),
            ],
        },
        {
            "full_japanese": "先月は大阪へ行きました。今月は東京へ行きます。",
            "full_romaji": "Sengetsu wa Oosaka e ikimashita. Kongetsu wa Toukyou e ikimasu.",
            "full_vietnamese": "Tháng trước tôi đã đi Osaka. Tháng này tôi đi Tokyo.",
            "chunks": [
                (1, "先月は大阪へ行きました。", "tháng trước đã đi Osaka", False),
                (2, "今月は", "tháng này thì", True),
                (3, "東京へ行きます。", "đi Tokyo", False),
            ],
        },
        {
            "full_japanese": "来月、家族は国へ帰ります。",
            "full_romaji": "Raigetsu, kazoku wa kuni e kaerimasu.",
            "full_vietnamese": "Tháng sau gia đình tôi sẽ về nước.",
            "chunks": [
                (1, "来月、", "tháng sau", False),
                (2, "家族は", "gia đình tôi thì", False),
                (3, "国へ", "về nước", True),
                (4, "帰ります。", "trở về", False),
            ],
        },
        {
            "full_japanese": "去年は日本へ行きました。今年は行きません。",
            "full_romaji": "Kyonen wa Nihon e ikimashita. Kotoshi wa ikimasen.",
            "full_vietnamese": "Năm ngoái tôi đã đi Nhật. Năm nay tôi không đi.",
            "chunks": [
                (1, "去年は日本へ行きました。", "năm ngoái đã đi Nhật", False),
                (2, "今年は", "năm nay thì", True),
                (3, "行きません。", "không đi", False),
            ],
        },
        {
            "full_japanese": "来年は家族と日本へ行きます。",
            "full_romaji": "Rainen wa kazoku to Nihon e ikimasu.",
            "full_vietnamese": "Năm sau tôi sẽ đi Nhật cùng gia đình.",
            "chunks": [
                (1, "来年は", "năm sau thì", True),
                (2, "家族と", "cùng gia đình", False),
                (3, "日本へ行きます。", "sẽ đi Nhật", False),
            ],
        },
        {
            "full_japanese": "誕生日はいつですか。何月何日ですか。",
            "full_romaji": "Tanjoubi wa itsu desu ka. Nangatsu nannichi desu ka.",
            "full_vietnamese": "Sinh nhật của bạn khi nào? Là ngày mấy tháng mấy?",
            "chunks": [
                (1, "誕生日はいつですか。", "sinh nhật là khi nào", False),
                (2, "何月何日", "ngày mấy tháng mấy", True),
                (3, "ですか。", "vậy", False),
            ],
        },
        {
            "full_japanese": "一月一日です。",
            "full_romaji": "Ichigatsu tsuitachi desu.",
            "full_vietnamese": "Là ngày mùng một tháng Một.",
            "chunks": [
                (1, "一月", "tháng Một", False),
                (2, "一日", "ngày mùng một", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "会議は二日、三日、四日、十四日です。",
            "full_romaji": "Kaigi wa futsuka, mikka, yokka, juuyokka desu.",
            "full_vietnamese": "Các ngày họp là mùng 2, mùng 3, mùng 4 và ngày 14.",
            "chunks": [
                (1, "会議は", "các buổi họp thì", False),
                (2, "二日、三日、四日、十四日", "mùng 2, mùng 3, mùng 4 và ngày 14", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "休みは五日、六日、七日、八日、九日、十日、二十日、二十四日です。",
            "full_romaji": "Yasumi wa itsuka, muika, nanoka, youka, kokonoka, tooka, hatsuka, nijuuyokka desu.",
            "full_vietnamese": "Các ngày nghỉ là mùng 5, 6, 7, 8, 9, 10, ngày 20 và ngày 24.",
            "chunks": [
                (1, "休みは", "các ngày nghỉ thì", False),
                (2, "五日、六日、七日、八日、九日、十日、二十日、二十四日", "mùng 5 đến 10, ngày 20 và 24", True),
                (3, "です。", "là", False),
            ],
        },
        {
            "full_japanese": "ありがとうございます。どういたしまして。",
            "full_romaji": "Arigatou gozaimasu. Dou itashimashite.",
            "full_vietnamese": "Xin cảm ơn. Không có gì.",
            "chunks": [
                (1, "ありがとうございます。", "xin cảm ơn", False),
                (2, "どういたしまして。", "không có gì", True),
            ],
        },
    ],
}


LESSON_PASSAGES = {
    2: {
        "title": "ごあいさつとお土産 — Lời chào và món quà",
        "content": [
            {
                "text": "はじめまして。",
                "furigana": None,
                "meaning": "Rất hân hạnh được gặp anh/chị.",
                "note": "Lời chào dùng trong lần gặp đầu tiên.",
            },
            {
                "text": "これはベトナムのお土産です。",
                "furigana": "これはベトナムのおみやげです",
                "meaning": "Đây là quà từ Việt Nam.",
                "note": "N1 の N2 biểu thị nguồn gốc hoặc quan hệ sở hữu.",
            },
            {
                "text": "チョコレートとコーヒーです。",
                "furigana": None,
                "meaning": "Là sô-cô-la và cà phê.",
                "note": "と nối hai danh từ trong một danh sách đầy đủ.",
            },
            {
                "text": "ほんの気持ちです。",
                "furigana": "ほんのきもちです",
                "meaning": "Chỉ là chút lòng thành.",
                "note": "Cách nói khiêm nhường khi tặng một món quà nhỏ.",
            },
            {
                "text": "どうぞ。",
                "furigana": None,
                "meaning": "Xin mời nhận.",
                "note": "Dùng khi đưa vật cho người khác.",
            },
            {
                "text": "どうもありがとうございます。",
                "furigana": None,
                "meaning": "Xin cảm ơn rất nhiều.",
                "note": "Lời cảm ơn lịch sự và trang trọng.",
            },
            {
                "text": "これからお世話になります。こちらこそよろしくお願いします。",
                "furigana": "これからおせわになります。こちらこそよろしくおねがいします",
                "meaning": "Từ nay mong được giúp đỡ. Chính tôi cũng mong được anh/chị giúp đỡ.",
                "note": "Cặp câu đáp tự nhiên khi bắt đầu một mối quan hệ mới.",
            },
        ],
    },
    3: {
        "title": "デパートで — Ở cửa hàng bách hóa",
        "content": [
            {
                "text": "すみません。",
                "furigana": None,
                "meaning": "Xin lỗi cho tôi hỏi.",
                "note": "Dùng để bắt chuyện lịch sự với nhân viên.",
            },
            {
                "text": "靴売り場はどこですか。",
                "furigana": "くつうりばはどこですか",
                "meaning": "Quầy bán giày ở đâu?",
                "note": "N は どこですか dùng để hỏi vị trí.",
            },
            {
                "text": "地下一階でございます。",
                "furigana": "ちかいっかいでございます",
                "meaning": "Ở tầng hầm thứ nhất ạ.",
                "note": "でございます là cách nói lịch sự của です.",
            },
            {
                "text": "エスカレーターはあちらです。",
                "furigana": None,
                "meaning": "Thang cuốn ở phía đằng kia.",
                "note": "あちら là cách chỉ hướng lịch sự.",
            },
            {
                "text": "この靴はいくらですか。",
                "furigana": "このくつはいくらですか",
                "meaning": "Đôi giày này bao nhiêu tiền?",
                "note": "いくら dùng để hỏi giá tiền.",
            },
            {
                "text": "三千円です。",
                "furigana": "さんぜんえんです",
                "meaning": "Ba nghìn yên.",
                "note": "Chú ý cách đọc biến âm của 三千 là さんぜん.",
            },
            {
                "text": "じゃ、この靴をください。",
                "furigana": "じゃ、このくつをください",
                "meaning": "Vậy thì cho tôi đôi giày này.",
                "note": "N をください dùng khi yêu cầu mua hoặc nhận một vật.",
            },
        ],
    },
    4: {
        "title": "わたしの一日 — Một ngày của tôi",
        "content": [
            {
                "text": "毎朝六時半に起きます。",
                "furigana": "まいあさろくじはんにおきます",
                "meaning": "Mỗi sáng tôi thức dậy lúc sáu giờ rưỡi.",
                "note": "Trợ từ に đánh dấu thời điểm cụ thể.",
            },
            {
                "text": "会社は九時からです。",
                "furigana": "かいしゃはくじからです",
                "meaning": "Công ty bắt đầu làm việc từ chín giờ.",
                "note": "から biểu thị thời điểm bắt đầu.",
            },
            {
                "text": "昼休みは十二時から一時までです。",
                "furigana": "ひるやすみはじゅうにじからいちじまでです",
                "meaning": "Giờ nghỉ trưa từ mười hai giờ đến một giờ.",
                "note": "から〜まで biểu thị khoảng thời gian.",
            },
            {
                "text": "午後五時に仕事が終わります。",
                "furigana": "ごごごじにしごとがおわります",
                "meaning": "Công việc kết thúc lúc năm giờ chiều.",
                "note": "午後 đứng trước giờ để chỉ buổi chiều.",
            },
            {
                "text": "夜は日本語を勉強します。",
                "furigana": "よるはにほんごをべんきょうします",
                "meaning": "Buổi tối tôi học tiếng Nhật.",
                "note": "は đưa 夜 lên làm chủ đề thời gian.",
            },
            {
                "text": "毎晩十一時に寝ます。",
                "furigana": "まいばんじゅういちじにねます",
                "meaning": "Mỗi tối tôi đi ngủ lúc mười một giờ.",
                "note": "毎晩 diễn tả thói quen lặp lại hằng tối.",
            },
            {
                "text": "土曜日と日曜日は休みです。",
                "furigana": "どようびとにちようびはやすみです",
                "meaning": "Thứ Bảy và Chủ nhật là ngày nghỉ.",
                "note": "と nối hai ngày trong tuần.",
            },
        ],
    },
    5: {
        "title": "京都への旅行 — Chuyến đi Kyoto",
        "content": [
            {
                "text": "来週、友達と京都へ行きます。",
                "furigana": "らいしゅう、ともだちときょうとへいきます",
                "meaning": "Tuần sau tôi sẽ đi Kyoto cùng bạn.",
                "note": "と chỉ người cùng thực hiện hành động.",
            },
            {
                "text": "駅までバスで行きます。",
                "furigana": "えきまでバスでいきます",
                "meaning": "Tôi đi xe buýt đến ga.",
                "note": "で chỉ phương tiện di chuyển.",
            },
            {
                "text": "駅から新幹線で行きます。",
                "furigana": "えきからしんかんせんでいきます",
                "meaning": "Từ ga tôi đi bằng tàu Shinkansen.",
                "note": "から chỉ điểm xuất phát; で chỉ phương tiện.",
            },
            {
                "text": "京都へは一人で行きません。",
                "furigana": "きょうとへはひとりでいきません",
                "meaning": "Tôi không đi Kyoto một mình.",
                "note": "一人で nghĩa là một mình, không có người đi cùng.",
            },
            {
                "text": "友達と行きます。",
                "furigana": "ともだちといきます",
                "meaning": "Tôi đi cùng bạn.",
                "note": "と nêu người đồng hành.",
            },
            {
                "text": "京都から普通電車で帰ります。",
                "furigana": "きょうとからふつうでんしゃでかえります",
                "meaning": "Tôi về từ Kyoto bằng tàu thường.",
                "note": "帰ります là về; 普通電車 là tàu thường.",
            },
            {
                "text": "日曜日の夜、うちへ帰ります。",
                "furigana": "にちようびのよる、うちへかえります",
                "meaning": "Tối Chủ nhật tôi sẽ về nhà.",
                "note": "へ chỉ đích đến của hành động 帰ります.",
            },
        ],
    },
}
