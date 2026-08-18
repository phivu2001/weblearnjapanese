"""Comprehensive chunk-based seed content for Minna no Nihongo lessons 46-50."""

LESSON_SENTENCES = {
    46: [
        {
            "full_japanese": "今から昼ごはんを食べるところです。",
            "full_romaji": "Ima kara hirugohan o taberu tokoro desu.",
            "full_vietnamese": "Tôi đang chuẩn bị ăn trưa ngay bây giờ.",
            "chunks": [
                (1, "今から", "ngay bây giờ,", False),
                (2, "昼ごはんを食べる", "ăn bữa trưa", False),
                (3, "ところです。", "đang chuẩn bị (sắp sửa).", True),
            ],
        },
        {
            "full_japanese": "今、部屋を掃除しているところです。",
            "full_romaji": "Ima, heya o souji shite iru tokoro desu.",
            "full_vietnamese": "Bây giờ tôi đang trong lúc dọn phòng.",
            "chunks": [
                (1, "今、", "bây giờ,", False),
                (2, "部屋を掃除している", "đang dọn phòng", False),
                (3, "ところです。", "đúng trong lúc.", True),
            ],
        },
        {
            "full_japanese": "たった今、バスが出たところです。",
            "full_romaji": "Tatta ima, basu ga deta tokoro desu.",
            "full_vietnamese": "Xe buýt vừa mới khởi hành đúng lúc nãy xong.",
            "chunks": [
                (1, "たった今、", "đúng lúc nãy,", False),
                (2, "バスが出た", "xe buýt đã khởi hành", False),
                (3, "ところです。", "vừa mới xong.", True),
            ],
        },
        {
            "full_japanese": "会議は終わりましたか。いいえ、今終わったところです。",
            "full_romaji": "Kaigi wa owarimashita ka. Iie, ima owatta tokoro desu.",
            "full_vietnamese": "Cuộc họp đã kết thúc chưa? Không, nó vừa mới kết thúc xong.",
            "chunks": [
                (1, "会議は終わりましたか。", "cuộc họp đã xong chưa?", False),
                (2, "いいえ、", "chưa,", False),
                (3, "今終わったところです。", "vừa mới kết thúc tức thì.", True),
            ],
        },
        {
            "full_japanese": "今、資料を作っているところですから、もう少し待ってください。",
            "full_romaji": "Ima, shiryou o tsukutte iru tokoro desu kara, mou sukoshi matte kudasai.",
            "full_vietnamese": "Tôi đang trong lúc làm tài liệu, nên xin hãy đợi thêm một chút.",
            "chunks": [
                (1, "今、", "bây giờ,", False),
                (2, "資料を作っているところですから、", "vì đúng trong lúc đang làm tài liệu,", True),
                (3, "もう少し", "thêm một chút nữa", False),
                (4, "待ってください。", "hãy đợi.", False),
            ],
        },
        {
            "full_japanese": "荷物はもう届いたはずです。",
            "full_romaji": "Nimotsu wa mou todoita hazu desu.",
            "full_vietnamese": "Hành lý chắc là đã đến rồi.",
            "chunks": [
                (1, "荷物は", "hành lý thì", False),
                (2, "もう", "đã... rồi", False),
                (3, "届いたはずです。", "chắc là đã đến.", True),
            ],
        },
        {
            "full_japanese": "田中さんはきょう留守のはずです。",
            "full_romaji": "Tanaka-san wa kyou rusu no hazu desu.",
            "full_vietnamese": "Hôm nay anh Tanaka chắc là đi vắng.",
            "chunks": [
                (1, "田中さんは", "anh Tanaka thì", False),
                (2, "きょう", "hôm nay", False),
                (3, "留守のはずです。", "chắc là vắng nhà.", True),
            ],
        },
        {
            "full_japanese": "このパンは焼いたばかりですから、まだ温かいです。",
            "full_romaji": "Kono pan wa yaita bakari desu kara, mada atatakai desu.",
            "full_vietnamese": "Bánh mì này vừa mới nướng nên vẫn còn ấm.",
            "chunks": [
                (1, "このパンは", "bánh mì này thì", False),
                (2, "焼いたばかりですから、", "vì vừa mới nướng,", True),
                (3, "まだ", "vẫn còn", False),
                (4, "温かいです。", "ấm.", False),
            ],
        },
        {
            "full_japanese": "先生はもうすぐ帰ってくるはずです。",
            "full_romaji": "Sensei wa mou sugu kaette kuru hazu desu.",
            "full_vietnamese": "Thầy chắc là sắp quay lại.",
            "chunks": [
                (1, "先生は", "thầy/cô thì", False),
                (2, "もうすぐ", "sắp sửa", False),
                (3, "帰ってくるはずです。", "chắc là sẽ quay lại.", True),
            ],
        },
        {
            "full_japanese": "薬を飲んだばかりですから、少し休んでください。",
            "full_romaji": "Kusuri o nonda bakari desu kara, sukoshi yasunde kudasai.",
            "full_vietnamese": "Anh vừa uống thuốc xong nên hãy nghỉ một chút.",
            "chunks": [
                (1, "薬を", "thuốc", False),
                (2, "飲んだばかりですから、", "vì vừa mới uống,", True),
                (3, "少し", "một chút", False),
                (4, "休んでください。", "hãy nghỉ.", False),
            ],
        },
    ],
    47: [
        {
            "full_japanese": "天気予報によると、明日は寒くなるそうです。",
            "full_romaji": "Tenki yohou ni yoru to, ashita wa samuku naru sou desu.",
            "full_vietnamese": "Theo dự báo thời tiết, nghe nói ngày mai sẽ trở lạnh.",
            "chunks": [
                (1, "天気予報によると、", "theo dự báo thời tiết,", True),
                (2, "明日は", "ngày mai", False),
                (3, "寒くなるそうです。", "nghe nói sẽ trở lạnh.", True),
            ],
        },
        {
            "full_japanese": "クララさんは子どもの時、フランスに住んでいたそうです。",
            "full_romaji": "Kurara-san wa kodomo no toki, Furansu ni sunde ita sou desu.",
            "full_vietnamese": "Nghe nói hồi còn nhỏ chị Klara đã từng sống ở Pháp.",
            "chunks": [
                (1, "クララさんは", "chị Klara thì", False),
                (2, "子どもの時、", "hồi còn nhỏ,", False),
                (3, "フランスに", "ở Pháp", False),
                (4, "住んでいたそうです。", "nghe nói đã từng sống.", True),
            ],
        },
        {
            "full_japanese": "人が大勢集まっていますね。事故のようです。",
            "full_romaji": "Hito ga oozei atsumatte imasu ne. Jiko no you desu.",
            "full_vietnamese": "Mọi người đang tập trung đông quá nhỉ. Hình như có tai nạn.",
            "chunks": [
                (1, "人が大勢集まっていますね。", "người đông quá nhỉ.", False),
                (2, "事故のようです。", "hình như là một vụ tai nạn.", True),
            ],
        },
        {
            "full_japanese": "咳も出るし、頭も痛いし、どうも風邪を引いたようです。",
            "full_romaji": "Seki mo deru shi, atama mo itai shi, doumo kaze o hiita you desu.",
            "full_vietnamese": "Vừa ho, vừa đau đầu, hình như tôi đã bị cảm rồi.",
            "chunks": [
                (1, "咳も出るし、", "vừa bị ho,", False),
                (2, "頭も痛いし、", "vừa đau đầu,", False),
                (3, "どうも", "rất có thể là", False),
                (4, "風邪を引いたようです。", "hình như đã bị cảm.", True),
            ],
        },
        {
            "full_japanese": "隣の部屋に誰かいるようです。",
            "full_romaji": "Tonari no heya ni dareka iru you desu.",
            "full_vietnamese": "Hình như có ai đó ở phòng bên cạnh.",
            "chunks": [
                (1, "隣の部屋に", "ở phòng bên cạnh", False),
                (2, "誰かいるようです。", "hình như có ai đó đang ở.", True),
            ],
        },
        {
            "full_japanese": "この料理は変なにおいがします。",
            "full_romaji": "Kono ryouri wa hen na nioi ga shimasu.",
            "full_vietnamese": "Món ăn này có mùi lạ.",
            "chunks": [
                (1, "この料理は", "món ăn này thì", False),
                (2, "変な", "lạ", False),
                (3, "においがします。", "có mùi.", True),
            ],
        },
        {
            "full_japanese": "ニュースによると、人口が少し減ったそうです。",
            "full_romaji": "Nyuusu ni yoru to, jinkou ga sukoshi hetta sou desu.",
            "full_vietnamese": "Theo tin tức, nghe nói dân số đã giảm một chút.",
            "chunks": [
                (1, "ニュースによると、", "theo tin tức,", True),
                (2, "人口が", "dân số", False),
                (3, "少し", "một chút", False),
                (4, "減ったそうです。", "nghe nói đã giảm.", True),
            ],
        },
        {
            "full_japanese": "駅の前に救急車が止まっています。けが人がいるようです。",
            "full_romaji": "Eki no mae ni kyuukyuusha ga tomatte imasu. Keganin ga iru you desu.",
            "full_vietnamese": "Có xe cấp cứu đang đỗ trước ga. Hình như có người bị thương.",
            "chunks": [
                (1, "駅の前に", "trước nhà ga", False),
                (2, "救急車が止まっています。", "xe cấp cứu đang đỗ.", False),
                (3, "けが人がいるようです。", "hình như có người bị thương.", True),
            ],
        },
        {
            "full_japanese": "あの人は田中さんの知り合いのようです。",
            "full_romaji": "Ano hito wa Tanaka-san no shiriai no you desu.",
            "full_vietnamese": "Người kia hình như là người quen của anh Tanaka.",
            "chunks": [
                (1, "あの人は", "người kia thì", False),
                (2, "田中さんの", "của anh Tanaka", False),
                (3, "知り合いのようです。", "hình như là người quen.", True),
            ],
        },
        {
            "full_japanese": "友達の話では、二人は婚約したそうです。",
            "full_romaji": "Tomodachi no hanashi dewa, futari wa konyaku shita sou desu.",
            "full_vietnamese": "Theo lời bạn tôi, nghe nói hai người đã đính hôn.",
            "chunks": [
                (1, "友達の話では、", "theo câu chuyện của bạn,", True),
                (2, "二人は", "hai người thì", False),
                (3, "婚約したそうです。", "nghe nói đã đính hôn.", True),
            ],
        },
    ],
    48: [
        {
            "full_japanese": "部長は私を大阪へ出張させました。",
            "full_romaji": "Buchou wa watashi o Oosaka e shucchou sasemashita.",
            "full_vietnamese": "Trưởng phòng đã bắt tôi đi công tác ở Osaka.",
            "chunks": [
                (1, "部長は", "trưởng phòng thì", False),
                (2, "私を", "tôi", False),
                (3, "大阪へ", "đến Osaka", False),
                (4, "出張させました。", "đã bắt đi công tác. (sai khiến)", True),
            ],
        },
        {
            "full_japanese": "お母さんは子どもに野菜を食べさせます。",
            "full_romaji": "Okaa-san wa kodomo ni yasai o tabesasemasu.",
            "full_vietnamese": "Mẹ bắt con ăn rau.",
            "chunks": [
                (1, "お母さんは", "người mẹ thì", False),
                (2, "子どもに", "đối với đứa trẻ", False),
                (3, "野菜を", "rau", False),
                (4, "食べさせます。", "bắt ăn. (sai khiến)", True),
            ],
        },
        {
            "full_japanese": "先生は生徒に自由に意見を言わせました。",
            "full_romaji": "Sensei wa seito ni jiyuu ni iken o iwasemashita.",
            "full_vietnamese": "Giáo viên đã cho phép học sinh tự do phát biểu ý kiến.",
            "chunks": [
                (1, "先生は", "giáo viên thì", False),
                (2, "生徒に", "cho học sinh", False),
                (3, "自由に", "một cách tự do", False),
                (4, "意見を言わせました。", "đã cho phép phát biểu ý kiến. (sai khiến)", True),
            ],
        },
        {
            "full_japanese": "子どもを塾に行かせてください。",
            "full_romaji": "Kodomo o juku ni ikasete kudasai.",
            "full_vietnamese": "Xin hãy cho phép con tôi được đi học thêm.",
            "chunks": [
                (1, "子どもを", "đứa trẻ", False),
                (2, "塾に", "đến lớp học thêm", False),
                (3, "行かせてください。", "xin hãy cho phép đi.", True),
            ],
        },
        {
            "full_japanese": "すみません、明日休ませていただけませんか。",
            "full_romaji": "Sumimasen, ashita yasumasete itadakemasen ka.",
            "full_vietnamese": "Xin lỗi, ngày mai cho phép tôi nghỉ được không ạ?",
            "chunks": [
                (1, "すみません、", "xin lỗi,", False),
                (2, "明日", "ngày mai", False),
                (3, "休ませていただけませんか。", "có thể cho phép tôi nghỉ được không ạ?", True),
            ],
        },
        {
            "full_japanese": "母は弟に部屋を掃除させました。",
            "full_romaji": "Haha wa otouto ni heya o souji sasemashita.",
            "full_vietnamese": "Mẹ tôi đã bắt em trai dọn phòng.",
            "chunks": [
                (1, "母は", "mẹ tôi thì", False),
                (2, "弟に", "đối với em trai", False),
                (3, "部屋を", "phòng", False),
                (4, "掃除させました。", "bắt dọn dẹp.", True),
            ],
        },
        {
            "full_japanese": "課長は社員を早く帰らせました。",
            "full_romaji": "Kachou wa shain o hayaku kaerasemashita.",
            "full_vietnamese": "Trưởng nhóm đã cho nhân viên về sớm.",
            "chunks": [
                (1, "課長は", "trưởng nhóm thì", False),
                (2, "社員を", "nhân viên", False),
                (3, "早く", "sớm", False),
                (4, "帰らせました。", "cho về.", True),
            ],
        },
        {
            "full_japanese": "子どもに好きなことをさせるのは大切です。",
            "full_romaji": "Kodomo ni sukina koto o saseru no wa taisetsu desu.",
            "full_vietnamese": "Việc cho trẻ làm điều mình thích là quan trọng.",
            "chunks": [
                (1, "子どもに", "cho trẻ con", False),
                (2, "好きなことを", "việc mình thích", False),
                (3, "させるのは", "việc cho làm thì", True),
                (4, "大切です。", "quan trọng.", False),
            ],
        },
        {
            "full_japanese": "荷物をここに置かせていただけませんか。",
            "full_romaji": "Nimotsu o koko ni okasete itadakemasen ka.",
            "full_vietnamese": "Cho phép tôi để hành lý ở đây được không ạ?",
            "chunks": [
                (1, "荷物を", "hành lý", False),
                (2, "ここに", "ở đây", False),
                (3, "置かせていただけませんか。", "có thể cho phép tôi để không ạ?", True),
            ],
        },
        {
            "full_japanese": "忙しい時は、家族に手伝わせます。",
            "full_romaji": "Isogashii toki wa, kazoku ni tetsudawasemasu.",
            "full_vietnamese": "Khi bận, tôi nhờ/bảo gia đình giúp.",
            "chunks": [
                (1, "忙しい時は、", "khi bận,", False),
                (2, "家族に", "cho gia đình", False),
                (3, "手伝わせます。", "bảo/nhờ giúp.", True),
            ],
        },
    ],
    49: [
        {
            "full_japanese": "社長はもうお帰りになりました。",
            "full_romaji": "Shachou wa mou okaeri ni narimashita.",
            "full_vietnamese": "Giám đốc đã về rồi ạ.",
            "chunks": [
                (1, "社長は", "giám đốc thì", False),
                (2, "もう", "đã... rồi", False),
                (3, "お帰りになりました。", "đã về. (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "先生は何を召し上がりますか。",
            "full_romaji": "Sensei wa nani o meshiagarimasu ka.",
            "full_vietnamese": "Thầy sẽ dùng món gì ạ?",
            "chunks": [
                (1, "先生は", "thầy giáo thì", False),
                (2, "何を", "cái gì", False),
                (3, "召し上がりますか。", "sẽ dùng (ăn/uống)? (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "部長はアメリカへ出張されます。",
            "full_romaji": "Buchou wa Amerika e shucchou saremasu.",
            "full_vietnamese": "Trưởng phòng sẽ đi công tác ở Mỹ ạ.",
            "chunks": [
                (1, "部長は", "trưởng phòng thì", False),
                (2, "アメリカへ", "đến Mỹ", False),
                (3, "出張されます。", "sẽ đi công tác. (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "どうぞ、こちらにお座りください。",
            "full_romaji": "Douzo, kochira ni osuwari kudasai.",
            "full_vietnamese": "Xin mời ngài ngồi vào chỗ này.",
            "chunks": [
                (1, "どうぞ、", "xin mời,", False),
                (2, "こちらに", "vào chỗ này", False),
                (3, "お座りください。", "hãy ngồi. (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "あの方は松本先生でいらっしゃいます。",
            "full_romaji": "Ano kata wa Matsumoto-sensei de irasshaimasu.",
            "full_vietnamese": "Vị kia là thầy Matsumoto ạ.",
            "chunks": [
                (1, "あの方は", "vị kia thì", False),
                (2, "松本先生", "thầy Matsumoto", False),
                (3, "でいらっしゃいます。", "là (tôn kính).", True),
            ],
        },
        {
            "full_japanese": "社長は会場をご覧になりました。",
            "full_romaji": "Shachou wa kaijou o goran ni narimashita.",
            "full_vietnamese": "Giám đốc đã xem hội trường ạ.",
            "chunks": [
                (1, "社長は", "giám đốc thì", False),
                (2, "会場を", "hội trường", False),
                (3, "ご覧になりました。", "đã xem. (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "先生は日本の文化をご存知です。",
            "full_romaji": "Sensei wa Nihon no bunka o gozonji desu.",
            "full_vietnamese": "Thầy biết văn hóa Nhật ạ.",
            "chunks": [
                (1, "先生は", "thầy/cô thì", False),
                (2, "日本の文化を", "văn hóa Nhật", False),
                (3, "ご存知です。", "biết. (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "お客様は三階にいらっしゃいます。",
            "full_romaji": "Okyaku-sama wa sankai ni irasshaimasu.",
            "full_vietnamese": "Khách đang ở tầng ba ạ.",
            "chunks": [
                (1, "お客様は", "quý khách thì", False),
                (2, "三階に", "ở tầng ba", False),
                (3, "いらっしゃいます。", "ở/có. (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "こちらで少々お待ちください。",
            "full_romaji": "Kochira de shoushou omachi kudasai.",
            "full_vietnamese": "Xin quý khách vui lòng chờ một chút ở đây.",
            "chunks": [
                (1, "こちらで", "ở đây", False),
                (2, "少々", "một chút", False),
                (3, "お待ちください。", "xin hãy chờ. (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "先生は何とおっしゃいましたか。",
            "full_romaji": "Sensei wa nan to osshaimashita ka.",
            "full_vietnamese": "Thầy đã nói gì ạ?",
            "chunks": [
                (1, "先生は", "thầy/cô thì", False),
                (2, "何と", "rằng gì", False),
                (3, "おっしゃいましたか。", "đã nói? (tôn kính)", True),
            ],
        },
    ],
    50: [
        {
            "full_japanese": "私はグエンと申します。",
            "full_romaji": "Watashi wa Guen to moushimasu.",
            "full_vietnamese": "Tôi tên là Nguyễn ạ.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "グエンと", "Nguyễn", False),
                (3, "申します。", "được gọi là. (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "明日、先生のお宅へ伺います。",
            "full_romaji": "Ashita, sensei no otaku e ukagaimasu.",
            "full_vietnamese": "Ngày mai tôi sẽ đến thăm nhà thầy ạ.",
            "chunks": [
                (1, "明日、", "ngày mai,", False),
                (2, "先生のお宅へ", "đến nhà của thầy", False),
                (3, "伺います。", "tôi sẽ đến thăm. (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "私が荷物をお持ちします。",
            "full_romaji": "Watashi ga nimotsu o omochi shimasu.",
            "full_vietnamese": "Để tôi mang hành lý cho ạ.",
            "chunks": [
                (1, "私が", "chính tôi", False),
                (2, "荷物を", "hành lý", False),
                (3, "お持ちします。", "sẽ mang giúp cho. (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "スケジュールをお送りいたします。",
            "full_romaji": "Sukejuuru o ookuri itashimasu.",
            "full_vietnamese": "Tôi xin phép được gửi lịch trình ạ.",
            "chunks": [
                (1, "スケジュールを", "lịch trình", False),
                (2, "お送りいたします。", "tôi xin gửi. (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "はい、わかりました。すぐ参ります。",
            "full_romaji": "Hai, wakarimashita. Sugu mairimasu.",
            "full_vietnamese": "Vâng, tôi hiểu rồi. Tôi sẽ đến ngay ạ.",
            "chunks": [
                (1, "はい、", "vâng,", False),
                (2, "わかりました。", "tôi đã hiểu.", False),
                (3, "すぐ", "ngay lập tức", False),
                (4, "参ります。", "tôi sẽ đi/đến. (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "この資料を拝見してもよろしいでしょうか。",
            "full_romaji": "Kono shiryou o haiken shite mo yoroshii deshou ka.",
            "full_vietnamese": "Tôi xem tài liệu này có được không ạ?",
            "chunks": [
                (1, "この資料を", "tài liệu này", False),
                (2, "拝見しても", "xem (khiêm nhường) thì", True),
                (3, "よろしいでしょうか。", "có được không ạ?", False),
            ],
        },
        {
            "full_japanese": "私はハノイから参りました。",
            "full_romaji": "Watashi wa Hanoi kara mairimashita.",
            "full_vietnamese": "Tôi đến từ Hà Nội ạ.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "ハノイから", "từ Hà Nội", False),
                (3, "参りました。", "đã đến. (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "詳しいことはまだ存じません。",
            "full_romaji": "Kuwashii koto wa mada zonjimasen.",
            "full_vietnamese": "Tôi vẫn chưa biết chi tiết ạ.",
            "chunks": [
                (1, "詳しいことは", "việc chi tiết thì", False),
                (2, "まだ", "vẫn chưa", False),
                (3, "存じません。", "không biết. (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "こちらは会議室でございます。",
            "full_romaji": "Kochira wa kaigishitsu de gozaimasu.",
            "full_vietnamese": "Đây là phòng họp ạ.",
            "chunks": [
                (1, "こちらは", "đây thì", False),
                (2, "会議室", "phòng họp", False),
                (3, "でございます。", "là. (lịch sự)", True),
            ],
        },
        {
            "full_japanese": "皆様のご協力に心から感謝いたします。",
            "full_romaji": "Minasama no gokyouryoku ni kokoro kara kansha itashimasu.",
            "full_vietnamese": "Tôi xin chân thành cảm ơn sự hợp tác của quý vị.",
            "chunks": [
                (1, "皆様の", "của quý vị", False),
                (2, "ご協力に", "đối với sự hợp tác", False),
                (3, "心から", "từ tận đáy lòng", False),
                (4, "感謝いたします。", "xin cảm ơn. (khiêm nhường)", True),
            ],
        },
    ],
}

LESSON_PASSAGES = {
    46: [
        {
            "title": "電話 — Cuộc gọi",
            "content": [
                {"text": "もしもし、", "meaning": "Alo,"},
                {"text": "今", "meaning": "bây giờ"},
                {"text": "いいですか。", "meaning": "có tiện không?"},
                {"text": "すみません。", "meaning": "Xin lỗi."},
                {"text": "今", "meaning": "Bây giờ"},
                {"text": "から", "meaning": "từ lúc này"},
                {"text": "出かける", "meaning": "ra ngoài"},
                {"text": "ところなんです。", "meaning": "tôi đang chuẩn bị.", "note": "ところです biểu thị một hành động sắp sửa, đang, hoặc vừa mới diễn ra."},
                {"text": "じゃ、", "meaning": "Vậy thì,"},
                {"text": "また", "meaning": "lại"},
                {"text": "あとで", "meaning": "sau"},
                {"text": "電話します。", "meaning": "tôi sẽ gọi điện."},
            ],
        },
        {
            "title": "宅配便 — Giao hàng tận nhà",
            "content": [
                {"text": "宅配便が", "meaning": "dịch vụ giao hàng"},
                {"text": "来た", "meaning": "đã đến"},
                {"text": "ところです。", "meaning": "vừa mới đến.", "note": "Vたところです nhấn mạnh hành động vừa kết thúc ngay lúc này."},
                {"text": "田中さんは", "meaning": "anh Tanaka thì"},
                {"text": "留守の", "meaning": "vắng nhà"},
                {"text": "はずですから、", "meaning": "chắc là vì vậy,"},
                {"text": "荷物を", "meaning": "hành lý/đồ gửi"},
                {"text": "受付に", "meaning": "ở quầy lễ tân"},
                {"text": "預けます。", "meaning": "tôi sẽ gửi lại."},
            ],
        },
    ],
    47: [
        {
            "title": "伝聞 — Tin đồn",
            "content": [
                {"text": "田中さんが", "meaning": "Anh Tanaka"},
                {"text": "会社を", "meaning": "công ty"},
                {"text": "辞めるそうですよ。", "meaning": "nghe nói sẽ nghỉ việc đấy.", "note": "そうです (nghe nói) dùng để truyền đạt lại thông tin nghe được."},
                {"text": "えっ、", "meaning": "Hả,"},
                {"text": "本当ですか。", "meaning": "thật không?"},
                {"text": "ええ、", "meaning": "Vâng,"},
                {"text": "自分で", "meaning": "tự mình"},
                {"text": "会社を", "meaning": "công ty"},
                {"text": "作るそうです。", "meaning": "nghe nói anh ấy sẽ lập."},
            ],
        },
        {
            "title": "駅前 — Trước nhà ga",
            "content": [
                {"text": "駅の前に", "meaning": "trước nhà ga"},
                {"text": "人が", "meaning": "người"},
                {"text": "大勢", "meaning": "rất đông"},
                {"text": "集まっています。", "meaning": "đang tập trung."},
                {"text": "パトカーと", "meaning": "xe cảnh sát và"},
                {"text": "救急車も", "meaning": "cả xe cấp cứu"},
                {"text": "来ました。", "meaning": "đã đến."},
                {"text": "どうも", "meaning": "có lẽ"},
                {"text": "事故のようです。", "meaning": "hình như là tai nạn.", "note": "ようです dùng để suy đoán từ điều mình nhìn, nghe hoặc cảm nhận."},
            ],
        },
    ],
    48: [
        {
            "title": "子育て — Nuôi con",
            "content": [
                {"text": "子どもが", "meaning": "Đứa trẻ"},
                {"text": "ピアノを", "meaning": "đàn piano"},
                {"text": "習いたいと", "meaning": "rằng muốn học"},
                {"text": "言っているんですが。", "meaning": "đang nói như vậy."},
                {"text": "じゃ、", "meaning": "Vậy thì,"},
                {"text": "習わせて", "meaning": "cho phép học"},
                {"text": "あげたら", "meaning": "nếu làm cho"},
                {"text": "どうですか。", "meaning": "thì sao?", "note": "習わせます là thể sai khiến, chỉ sự cho phép."},
                {"text": "好きな", "meaning": "Yêu thích"},
                {"text": "ことを", "meaning": "những việc"},
                {"text": "させるのは", "meaning": "việc cho phép làm thì"},
                {"text": "いいことですよ。", "meaning": "là điều tốt đấy."},
            ],
        },
        {
            "title": "会社で — Ở công ty",
            "content": [
                {"text": "課長は", "meaning": "trưởng nhóm"},
                {"text": "新しい社員に", "meaning": "nhân viên mới"},
                {"text": "資料を", "meaning": "tài liệu"},
                {"text": "届けさせました。", "meaning": "đã bảo đi giao.", "note": "Người sai khiến + người bị sai khiến に/を + động từ sai khiến."},
                {"text": "そのあと、", "meaning": "sau đó,"},
                {"text": "社員を", "meaning": "nhân viên"},
                {"text": "早く", "meaning": "sớm"},
                {"text": "帰らせました。", "meaning": "cho về."},
            ],
        },
    ],
    49: [
        {
            "title": "尊敬語 — Tôn kính ngữ",
            "content": [
                {"text": "先生、", "meaning": "Thưa thầy,"},
                {"text": "あしたの", "meaning": "của ngày mai"},
                {"text": "パーティーに", "meaning": "vào buổi tiệc"},
                {"text": "いらっしゃいますか。", "meaning": "thầy có đến không ạ?", "note": "いらっしゃいます là tôn kính ngữ của 来ます."},
                {"text": "ええ、", "meaning": "Có,"},
                {"text": "行きますよ。", "meaning": "tôi sẽ đi."},
                {"text": "奥様も", "meaning": "Cả phu nhân"},
                {"text": "いらっしゃいますか。", "meaning": "cũng đến chứ ạ?"},
                {"text": "ええ、", "meaning": "Có,"},
                {"text": "妻も", "meaning": "cả vợ tôi"},
                {"text": "行きます。", "meaning": "cũng sẽ đi."},
            ],
        },
        {
            "title": "旅館 — Nhà trọ kiểu Nhật",
            "content": [
                {"text": "お客様、", "meaning": "quý khách,"},
                {"text": "こちらに", "meaning": "ở phía này"},
                {"text": "お掛けください。", "meaning": "xin hãy ngồi.", "note": "お + gốc ます + ください là mẫu yêu cầu tôn kính."},
                {"text": "社長は", "meaning": "giám đốc"},
                {"text": "もう", "meaning": "đã"},
                {"text": "お帰りに", "meaning": "về"},
                {"text": "なりました。", "meaning": "rồi."},
                {"text": "また", "meaning": "lại"},
                {"text": "お電話", "meaning": "gọi điện"},
                {"text": "ください。", "meaning": "xin hãy."},
            ],
        },
    ],
    50: [
        {
            "title": "謙譲語 — Khiêm nhường ngữ",
            "content": [
                {"text": "お飲み物は", "meaning": "Đồ uống thì"},
                {"text": "いかがですか。", "meaning": "ngài thấy sao ạ?"},
                {"text": "コーヒーを", "meaning": "Cà phê"},
                {"text": "お願いします。", "meaning": "xin hãy cho tôi."},
                {"text": "かしこまりました。", "meaning": "Tôi đã hiểu thưa ngài."},
                {"text": "すぐ", "meaning": "Ngay lập tức"},
                {"text": "お持ちします。", "meaning": "tôi sẽ mang đến ạ.", "note": "お持ちします là khiêm nhường ngữ, thể hiện sự hạ mình của người nói khi thực hiện hành động cho người nghe."},
            ],
        },
        {
            "title": "ご挨拶 — Lời chào trang trọng",
            "content": [
                {"text": "皆様、", "meaning": "kính thưa quý vị,"},
                {"text": "本日は", "meaning": "hôm nay"},
                {"text": "お忙しい中、", "meaning": "trong lúc bận rộn"},
                {"text": "お集まりいただき、", "meaning": "đã tập trung đến,", "note": "いただきます dùng khiêm nhường để nói mình nhận được hành động tốt từ người khác."},
                {"text": "ありがとうございます。", "meaning": "xin cảm ơn."},
                {"text": "心から", "meaning": "từ tận đáy lòng"},
                {"text": "感謝いたします。", "meaning": "xin cảm tạ."},
            ],
        },
    ],
}
