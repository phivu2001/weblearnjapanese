"""Comprehensive chunk-based seed content for Minna no Nihongo lessons 41-45."""

LESSON_SENTENCES = {
    41: [
        {
            "full_japanese": "私は部長に時計をいただきました。",
            "full_romaji": "Watashi wa buchou ni tokei o itadakimashita.",
            "full_vietnamese": "Tôi đã được trưởng phòng tặng cho chiếc đồng hồ.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "部長に", "từ trưởng phòng", False),
                (3, "時計を", "chiếc đồng hồ", False),
                (4, "いただきました。", "tôi đã nhận được (khiêm nhường).", True),
            ],
        },
        {
            "full_japanese": "社長が私にお土産をくださいました。",
            "full_romaji": "Shachou ga watashi ni omiyage o kudasaimashita.",
            "full_vietnamese": "Giám đốc đã tặng quà lưu niệm cho tôi.",
            "chunks": [
                (1, "社長が", "giám đốc", False),
                (2, "私に", "cho tôi", False),
                (3, "お土産を", "quà lưu niệm", False),
                (4, "くださいました。", "đã tặng cho (tôn kính).", True),
            ],
        },
        {
            "full_japanese": "私は犬にえさをやります。",
            "full_romaji": "Watashi wa inu ni esa o yarimasu.",
            "full_vietnamese": "Tôi cho chó ăn.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "犬に", "cho chó", False),
                (3, "えさを", "thức ăn", False),
                (4, "やります。", "tôi cho (người dưới/động vật).", True),
            ],
        },
        {
            "full_japanese": "先生に本を貸していただきました。",
            "full_romaji": "Sensei ni hon o kashite itadakimashita.",
            "full_vietnamese": "Tôi đã được thầy giáo cho mượn sách.",
            "chunks": [
                (1, "先生に", "từ thầy giáo", False),
                (2, "本を貸して", "cho mượn sách", False),
                (3, "いただきました。", "tôi đã nhận được (nhờ vả lịch sự).", True),
            ],
        },
        {
            "full_japanese": "先生が漢字を教えてくださいました。",
            "full_romaji": "Sensei ga kanji o oshiete kudasaimashita.",
            "full_vietnamese": "Thầy giáo đã dạy Hán tự cho tôi.",
            "chunks": [
                (1, "先生が", "thầy giáo", False),
                (2, "漢字を教えて", "dạy Hán tự", False),
                (3, "くださいました。", "đã làm giúp cho (tôn kính).", True),
            ],
        },
        {
            "full_japanese": "祖母に手袋を編んでいただきました。",
            "full_romaji": "Sobo ni tebukuro o ande itadakimashita.",
            "full_vietnamese": "Tôi được bà đan găng tay cho.",
            "chunks": [
                (1, "祖母に", "từ bà tôi", False),
                (2, "手袋を", "găng tay", False),
                (3, "編んで", "đan", False),
                (4, "いただきました。", "được làm cho (khiêm nhường)", True),
            ],
        },
        {
            "full_japanese": "課長が新しい情報を教えてくださいました。",
            "full_romaji": "Kachou ga atarashii jouhou o oshiete kudasaimashita.",
            "full_vietnamese": "Trưởng nhóm đã cho tôi biết thông tin mới.",
            "chunks": [
                (1, "課長が", "trưởng nhóm", False),
                (2, "新しい情報を", "thông tin mới", False),
                (3, "教えて", "chỉ/báo cho", False),
                (4, "くださいました。", "đã làm cho tôi (tôn kính)", True),
            ],
        },
        {
            "full_japanese": "私は孫に絵本を読んでやりました。",
            "full_romaji": "Watashi wa mago ni ehon o yonde yarimashita.",
            "full_vietnamese": "Tôi đã đọc truyện tranh cho cháu.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "孫に", "cho cháu", False),
                (3, "絵本を読んで", "đọc truyện tranh", False),
                (4, "やりました。", "làm cho (người dưới)", True),
            ],
        },
        {
            "full_japanese": "部長に発音を直していただきました。",
            "full_romaji": "Buchou ni hatsuon o naoshite itadakimashita.",
            "full_vietnamese": "Tôi được trưởng phòng sửa phát âm cho.",
            "chunks": [
                (1, "部長に", "bởi trưởng phòng", False),
                (2, "発音を", "phát âm", False),
                (3, "直して", "sửa", False),
                (4, "いただきました。", "được làm giúp", True),
            ],
        },
        {
            "full_japanese": "申し訳ありませんが、荷物を預かっていただけませんか。",
            "full_romaji": "Moushiwake arimasen ga, nimotsu o azukatte itadakemasen ka.",
            "full_vietnamese": "Xin lỗi, anh/chị có thể giữ hộ hành lý giúp tôi được không?",
            "chunks": [
                (1, "申し訳ありませんが、", "xin lỗi nhưng", False),
                (2, "荷物を", "hành lý", False),
                (3, "預かって", "giữ hộ", False),
                (4, "いただけませんか。", "giúp tôi được không?", True),
            ],
        },
    ],
    42: [
        {
            "full_japanese": "自分の店を持つために、貯金しています。",
            "full_romaji": "Jibun no mise o motsu tame ni, chokin shite imasu.",
            "full_vietnamese": "Tôi đang tiết kiệm tiền để mở cửa hàng của riêng mình.",
            "chunks": [
                (1, "自分の店を", "cửa hàng của chính mình", False),
                (2, "持つために、", "để có,", True),
                (3, "貯金しています。", "tôi đang tiết kiệm tiền.", False),
            ],
        },
        {
            "full_japanese": "家族のために、家を建てるつもりです。",
            "full_romaji": "Kazoku no tame ni, ie o tateru tsumori desu.",
            "full_vietnamese": "Tôi dự định xây nhà cho gia đình.",
            "chunks": [
                (1, "家族のために、", "vì gia đình,", True),
                (2, "家を建てる", "xây nhà", False),
                (3, "つもりです。", "tôi dự định.", False),
            ],
        },
        {
            "full_japanese": "このはさみは花を切るのに使います。",
            "full_romaji": "Kono hasami wa hana o kiru no ni tsukaimasu.",
            "full_vietnamese": "Cái kéo này được dùng để cắt hoa.",
            "chunks": [
                (1, "このはさみは", "cái kéo này thì", False),
                (2, "花を切るのに", "vào việc cắt hoa", True),
                (3, "使います。", "được sử dụng.", False),
            ],
        },
        {
            "full_japanese": "日本へ来るのに、いくらかかりましたか。",
            "full_romaji": "Nihon e kuru no ni, ikura kakarimashita ka.",
            "full_vietnamese": "Để đến được Nhật Bản thì đã mất bao nhiêu tiền?",
            "chunks": [
                (1, "日本へ来るのに、", "để đến Nhật Bản,", True),
                (2, "いくら", "bao nhiêu", False),
                (3, "かかりましたか。", "đã tốn (thời gian/tiền bạc)?", False),
            ],
        },
        {
            "full_japanese": "健康のために、毎日歩いています。",
            "full_romaji": "Kenkou no tame ni, mainichi aruite imasu.",
            "full_vietnamese": "Tôi đi bộ mỗi ngày vì sức khỏe.",
            "chunks": [
                (1, "健康のために、", "vì sức khỏe,", True),
                (2, "毎日", "mỗi ngày", False),
                (3, "歩いています。", "tôi đang đi bộ.", False),
            ],
        },
        {
            "full_japanese": "平和のために、国連で働きたいです。",
            "full_romaji": "Heiwa no tame ni, Kokuren de hatarakitai desu.",
            "full_vietnamese": "Tôi muốn làm việc ở Liên Hợp Quốc vì hòa bình.",
            "chunks": [
                (1, "平和のために、", "vì hòa bình", True),
                (2, "国連で", "ở Liên Hợp Quốc", False),
                (3, "働きたいです。", "muốn làm việc", False),
            ],
        },
        {
            "full_japanese": "論文を書くために、データを集めています。",
            "full_romaji": "Ronbun o kaku tame ni, deeta o atsumete imasu.",
            "full_vietnamese": "Tôi đang thu thập dữ liệu để viết luận văn.",
            "chunks": [
                (1, "論文を書くために、", "để viết luận văn", True),
                (2, "データを", "dữ liệu", False),
                (3, "集めています。", "đang thu thập", False),
            ],
        },
        {
            "full_japanese": "このやかんはお湯を沸かすのに使います。",
            "full_romaji": "Kono yakan wa oyu o wakasu noni tsukaimasu.",
            "full_vietnamese": "Cái ấm này dùng để đun nước nóng.",
            "chunks": [
                (1, "このやかんは", "cái ấm này thì", False),
                (2, "お湯を沸かすのに", "vào việc đun nước nóng", True),
                (3, "使います。", "dùng", False),
            ],
        },
        {
            "full_japanese": "体温計は熱を測るのに必要です。",
            "full_romaji": "Tai onkei wa netsu o hakaru noni hitsuyou desu.",
            "full_vietnamese": "Nhiệt kế cần thiết để đo sốt.",
            "chunks": [
                (1, "体温計は", "nhiệt kế thì", False),
                (2, "熱を測るのに", "cho việc đo sốt", True),
                (3, "必要です。", "cần thiết", False),
            ],
        },
        {
            "full_japanese": "この仕事をするのに、法律の知識が必要です。",
            "full_romaji": "Kono shigoto o suru noni, houritsu no chishiki ga hitsuyou desu.",
            "full_vietnamese": "Để làm công việc này cần kiến thức pháp luật.",
            "chunks": [
                (1, "この仕事をするのに、", "để làm công việc này", True),
                (2, "法律の知識が", "kiến thức pháp luật", False),
                (3, "必要です。", "cần thiết", False),
            ],
        },
    ],
    43: [
        {
            "full_japanese": "今にも雨が降りそうです。",
            "full_romaji": "Ima ni mo ame ga furisou desu.",
            "full_vietnamese": "Trời trông có vẻ sắp mưa đến nơi rồi.",
            "chunks": [
                (1, "今にも", "ngay bây giờ", False),
                (2, "雨が", "trời (mưa)", False),
                (3, "降りそうです。", "trông có vẻ sắp mưa.", True),
            ],
        },
        {
            "full_japanese": "この料理は辛そうですね。",
            "full_romaji": "Kono ryouri wa karasou desu ne.",
            "full_vietnamese": "Món ăn này trông có vẻ cay nhỉ.",
            "chunks": [
                (1, "この料理は", "món ăn này thì", False),
                (2, "辛そうですね。", "trông có vẻ cay nhỉ.", True),
            ],
        },
        {
            "full_japanese": "ちょっとたばこを買って来ます。",
            "full_romaji": "Chotto tabako o katte kimasu.",
            "full_vietnamese": "Tôi đi mua bao thuốc một lát rồi về.",
            "chunks": [
                (1, "ちょっと", "một lát", False),
                (2, "たばこを買って", "mua thuốc lá rồi", False),
                (3, "来ます。", "sẽ quay lại ngay (đi rồi về).", True),
            ],
        },
        {
            "full_japanese": "スーパーで牛乳を買って来てください。",
            "full_romaji": "Suupaa de gyuunyuu o katte kite kudasai.",
            "full_vietnamese": "Hãy đi siêu thị mua sữa rồi về nhé.",
            "chunks": [
                (1, "スーパーで", "ở siêu thị", False),
                (2, "牛乳を買って", "mua sữa rồi", False),
                (3, "来てください。", "hãy quay về nhé.", True),
            ],
        },
        {
            "full_japanese": "ボタンが取れそうです。",
            "full_romaji": "Botan ga toresou desu.",
            "full_vietnamese": "Cái cúc áo trông có vẻ sắp đứt ra rồi.",
            "chunks": [
                (1, "ボタンが", "cái cúc áo", False),
                (2, "取れそうです。", "trông có vẻ sắp tuột ra.", True),
            ],
        },
        {
            "full_japanese": "ガソリンの値段が上がりそうです。",
            "full_romaji": "Gasorin no nedan ga agarisou desu.",
            "full_vietnamese": "Giá xăng trông có vẻ sắp tăng.",
            "chunks": [
                (1, "ガソリンの値段が", "giá xăng", False),
                (2, "上がりそうです。", "trông có vẻ sắp tăng", True),
            ],
        },
        {
            "full_japanese": "このかばんは丈夫そうです。",
            "full_romaji": "Kono kaban wa joubu sou desu.",
            "full_vietnamese": "Cái cặp này trông có vẻ chắc chắn.",
            "chunks": [
                (1, "このかばんは", "cái cặp này thì", False),
                (2, "丈夫そうです。", "trông có vẻ chắc chắn", True),
            ],
        },
        {
            "full_japanese": "この部屋はよさそうですね。",
            "full_romaji": "Kono heya wa yosasou desu ne.",
            "full_vietnamese": "Căn phòng này trông có vẻ tốt nhỉ.",
            "chunks": [
                (1, "この部屋は", "căn phòng này thì", False),
                (2, "よさそうですね。", "trông có vẻ tốt nhỉ", True),
            ],
        },
        {
            "full_japanese": "ちょっと会員カードを取って来ます。",
            "full_romaji": "Chotto kaiin kaado o totte kimasu.",
            "full_vietnamese": "Tôi đi lấy thẻ hội viên một lát rồi quay lại.",
            "chunks": [
                (1, "ちょっと", "một lát", False),
                (2, "会員カードを", "thẻ hội viên", False),
                (3, "取って", "lấy", False),
                (4, "来ます。", "đi rồi quay lại", True),
            ],
        },
        {
            "full_japanese": "火を消して来てください。",
            "full_romaji": "Hi o keshite kite kudasai.",
            "full_vietnamese": "Xin hãy đi tắt lửa rồi quay lại.",
            "chunks": [
                (1, "火を", "lửa", False),
                (2, "消して", "tắt", False),
                (3, "来てください。", "hãy đi rồi quay lại", True),
            ],
        },
    ],
    44: [
        {
            "full_japanese": "昨日の夜、お酒を飲みすぎました。",
            "full_romaji": "Kinou no yoru, osake o nomisugimashita.",
            "full_vietnamese": "Tối qua, tôi đã uống quá nhiều rượu.",
            "chunks": [
                (1, "昨日の夜、", "tối qua,", False),
                (2, "お酒を", "rượu", False),
                (3, "飲みすぎました。", "tôi đã uống quá nhiều.", True),
            ],
        },
        {
            "full_japanese": "このパソコンは使いやすいです。",
            "full_romaji": "Kono pasokon wa tsukaiyasui desu.",
            "full_vietnamese": "Cái máy tính này rất dễ sử dụng.",
            "chunks": [
                (1, "このパソコンは", "máy tính này thì", False),
                (2, "使いやすいです。", "rất dễ sử dụng.", True),
            ],
        },
        {
            "full_japanese": "東京は人が多くて、住みにくいです。",
            "full_romaji": "Toukyou wa hito ga ookute, suminikui desu.",
            "full_vietnamese": "Tokyo đông người nên rất khó sống.",
            "chunks": [
                (1, "東京は", "Tokyo thì", False),
                (2, "人が多くて、", "người đông nên", False),
                (3, "住みにくいです。", "khó sống.", True),
            ],
        },
        {
            "full_japanese": "テレビの音を大きくします。",
            "full_romaji": "Terebi no oto o ookiku shimasu.",
            "full_vietnamese": "Tôi sẽ bật âm thanh tivi to lên.",
            "chunks": [
                (1, "テレビの音を", "âm thanh tivi", False),
                (2, "大きくします。", "tôi sẽ làm cho to lên.", True),
            ],
        },
        {
            "full_japanese": "部屋をきれいにします。",
            "full_romaji": "Heya o kirei ni shimasu.",
            "full_vietnamese": "Tôi sẽ dọn dẹp phòng cho sạch sẽ.",
            "chunks": [
                (1, "部屋を", "căn phòng", False),
                (2, "きれいにします。", "tôi sẽ làm cho sạch sẽ.", True),
            ],
        },
        {
            "full_japanese": "このスープは塩を入れすぎました。",
            "full_romaji": "Kono suupu wa shio o iresugimashita.",
            "full_vietnamese": "Món súp này đã cho quá nhiều muối.",
            "chunks": [
                (1, "このスープは", "món súp này thì", False),
                (2, "塩を", "muối", False),
                (3, "入れすぎました。", "đã cho vào quá nhiều", True),
            ],
        },
        {
            "full_japanese": "この説明書は字が細かくて、読みにくいです。",
            "full_romaji": "Kono setsumeisho wa ji ga komakakute, yominikui desu.",
            "full_vietnamese": "Sách hướng dẫn này chữ nhỏ chi tiết nên khó đọc.",
            "chunks": [
                (1, "この説明書は", "sách hướng dẫn này thì", False),
                (2, "字が細かくて、", "chữ nhỏ/chi tiết nên", False),
                (3, "読みにくいです。", "khó đọc", True),
            ],
        },
        {
            "full_japanese": "空気が乾いていますから、加湿器を強くします。",
            "full_romaji": "Kuuki ga kawaite imasu kara, kashitsuki o tsuyoku shimasu.",
            "full_vietnamese": "Vì không khí khô nên tôi chỉnh máy tạo ẩm mạnh lên.",
            "chunks": [
                (1, "空気が", "không khí", False),
                (2, "乾いていますから、", "vì đang khô", False),
                (3, "加湿器を", "máy tạo ẩm", False),
                (4, "強くします。", "làm cho mạnh lên", True),
            ],
        },
        {
            "full_japanese": "洗濯物を半分にします。",
            "full_romaji": "Sentakumono o hanbun ni shimasu.",
            "full_vietnamese": "Tôi chia đồ giặt ra một nửa.",
            "chunks": [
                (1, "洗濯物を", "đồ giặt", False),
                (2, "半分にします。", "làm thành một nửa", True),
            ],
        },
        {
            "full_japanese": "安全にするために、火を小さくしてください。",
            "full_romaji": "Anzen ni suru tame ni, hi o chiisaku shite kudasai.",
            "full_vietnamese": "Để an toàn, xin hãy vặn nhỏ lửa.",
            "chunks": [
                (1, "安全にするために、", "để làm cho an toàn", False),
                (2, "火を", "lửa", False),
                (3, "小さくして", "làm nhỏ", True),
                (4, "ください。", "xin hãy", False),
            ],
        },
    ],
    45: [
        {
            "full_japanese": "パスポートをなくした場合は、どうしたらいいですか。",
            "full_romaji": "Pasupooto o nakushita baai wa, doushitara ii desu ka.",
            "full_vietnamese": "Trong trường hợp làm mất hộ chiếu thì nên làm thế nào?",
            "chunks": [
                (1, "パスポートを", "hộ chiếu", False),
                (2, "なくした場合は、", "trong trường hợp đánh mất,", True),
                (3, "どうしたらいいですか。", "tôi nên làm thế nào?", False),
            ],
        },
        {
            "full_japanese": "火事の場合は、119番に電話してください。",
            "full_romaji": "Kaji no baai wa, hyakujuukyuuban ni denwa shite kudasai.",
            "full_vietnamese": "Trong trường hợp hỏa hoạn, xin hãy gọi số 119.",
            "chunks": [
                (1, "火事の場合は、", "trong trường hợp hỏa hoạn,", True),
                (2, "119番に", "vào số 119", False),
                (3, "電話してください。", "xin hãy gọi điện.", False),
            ],
        },
        {
            "full_japanese": "約束をしたのに、彼女は来ませんでした。",
            "full_romaji": "Yakusoku o shita no ni, kanojo wa kimasen deshita.",
            "full_vietnamese": "Mặc dù đã hẹn rồi vậy mà cô ấy lại không đến.",
            "chunks": [
                (1, "約束をしたのに、", "mặc dù đã hẹn vậy mà,", True),
                (2, "彼女は", "cô ấy", False),
                (3, "来ませんでした。", "đã không đến.", False),
            ],
        },
        {
            "full_japanese": "毎日練習しているのに、上手になりません。",
            "full_romaji": "Mainichi renshuu shite iru no ni, jouzu ni narimasen.",
            "full_vietnamese": "Mặc dù ngày nào tôi cũng luyện tập, vậy mà vẫn không giỏi lên.",
            "chunks": [
                (1, "毎日練習しているのに、", "mặc dù ngày nào cũng luyện tập vậy mà,", True),
                (2, "上手に", "giỏi lên", False),
                (3, "なりません。", "lại không trở nên.", False),
            ],
        },
        {
            "full_japanese": "日曜日なのに、仕事をしなければなりません。",
            "full_romaji": "Nichiyoubi na no ni, shigoto o shinakereba narimasen.",
            "full_vietnamese": "Dù là ngày Chủ Nhật vậy mà tôi vẫn phải làm việc.",
            "chunks": [
                (1, "日曜日なのに、", "mặc dù là Chủ Nhật vậy mà,", True),
                (2, "仕事を", "công việc", False),
                (3, "しなければなりません。", "vẫn phải làm.", False),
            ],
        },
        {
            "full_japanese": "雨の場合は、キャンプは中止です。",
            "full_romaji": "Ame no baai wa, kyanpu wa chuushi desu.",
            "full_vietnamese": "Trường hợp trời mưa thì buổi cắm trại sẽ bị hủy.",
            "chunks": [
                (1, "雨の場合は、", "trường hợp trời mưa thì", True),
                (2, "キャンプは", "buổi cắm trại thì", False),
                (3, "中止です。", "bị hủy", False),
            ],
        },
        {
            "full_japanese": "事故に会った場合は、すぐ係に連絡してください。",
            "full_romaji": "Jiko ni atta baai wa, sugu kakari ni renraku shite kudasai.",
            "full_vietnamese": "Trường hợp gặp tai nạn, hãy liên lạc ngay với người phụ trách.",
            "chunks": [
                (1, "事故に会った場合は、", "trường hợp gặp tai nạn thì", True),
                (2, "すぐ", "ngay", False),
                (3, "係に", "người phụ trách", False),
                (4, "連絡してください。", "hãy liên lạc", False),
            ],
        },
        {
            "full_japanese": "保証書があるのに、取り替えてくれませんでした。",
            "full_romaji": "Hoshousho ga aru noni, torikaete kuremasen deshita.",
            "full_vietnamese": "Mặc dù có giấy bảo hành vậy mà họ đã không đổi cho tôi.",
            "chunks": [
                (1, "保証書があるのに、", "mặc dù có giấy bảo hành vậy mà", True),
                (2, "取り替えて", "đổi lại", False),
                (3, "くれませんでした。", "đã không làm cho tôi", False),
            ],
        },
        {
            "full_japanese": "急に用事ができた場合は、電話してください。",
            "full_romaji": "Kyuu ni youji ga dekita baai wa, denwa shite kudasai.",
            "full_vietnamese": "Trường hợp đột nhiên có việc bận, hãy gọi điện.",
            "chunks": [
                (1, "急に", "đột nhiên", False),
                (2, "用事ができた場合は、", "trường hợp có việc bận", True),
                (3, "電話してください。", "hãy gọi điện", False),
            ],
        },
        {
            "full_japanese": "ちゃんと用意したのに、忘れてしまいました。",
            "full_romaji": "Chanto youi shita noni, wasurete shimaimashita.",
            "full_vietnamese": "Mặc dù đã chuẩn bị hẳn hoi vậy mà tôi lại quên mất.",
            "chunks": [
                (1, "ちゃんと", "hẳn hoi", False),
                (2, "用意したのに、", "mặc dù đã chuẩn bị vậy mà", True),
                (3, "忘れてしまいました。", "đã lỡ quên mất", False),
            ],
        },
    ],
}

LESSON_PASSAGES = {
    41: [
        {
            "title": "プレゼント — Món quà",
            "content": [
                {"text": "素敵な", "meaning": "Đẹp"},
                {"text": "ネクタイですね。", "meaning": "cái cà vạt nhỉ."},
                {"text": "ありがとうございます。", "meaning": "Xin cảm ơn."},
                {"text": "誕生日に", "meaning": "Vào dịp sinh nhật"},
                {"text": "部長に", "meaning": "từ trưởng phòng"},
                {"text": "いただいたんです。", "meaning": "tôi đã được tặng.", "note": "いただきました là khiêm nhường ngữ của もらいました."},
                {"text": "そうですか。", "meaning": "Vậy à."},
                {"text": "いいですね。", "meaning": "Tuyệt quá nhỉ."}
            ],
        },
        {
            "title": "助かりました — May mà được giúp",
            "content": [
                {"text": "先日は", "meaning": "Mấy hôm trước"},
                {"text": "文法を", "meaning": "ngữ pháp"},
                {"text": "教えてくださって、", "meaning": "thầy/cô đã dạy cho tôi,", "note": "Vてくださいます nói người trên làm việc có lợi cho mình."},
                {"text": "ありがとうございました。", "meaning": "xin cảm ơn."},
                {"text": "いいえ。", "meaning": "Không có gì."},
                {"text": "また", "meaning": "Lại/nữa"},
                {"text": "わからない所が", "meaning": "chỗ không hiểu"},
                {"text": "あったら、", "meaning": "nếu có,"},
                {"text": "いつでも", "meaning": "bất cứ lúc nào"},
                {"text": "聞いてください。", "meaning": "hãy hỏi."},
                {"text": "助かります。", "meaning": "Thế thì may quá/có ích quá."},
            ],
        },
    ],
    42: [
        {
            "title": "目的 — Mục đích",
            "content": [
                {"text": "ボーナスは", "meaning": "Tiền thưởng thì"},
                {"text": "何に", "meaning": "vào việc gì"},
                {"text": "使いますか。", "meaning": "bạn sẽ dùng?"},
                {"text": "将来", "meaning": "Trong tương lai"},
                {"text": "自分の", "meaning": "của chính mình"},
                {"text": "店を", "meaning": "cửa hàng"},
                {"text": "持つために、", "meaning": "để có,", "note": "ために dùng để chỉ mục đích mạnh mẽ."},
                {"text": "貯金しようと", "meaning": "để tiết kiệm"},
                {"text": "思っています。", "meaning": "tôi đang dự định."}
            ],
        },
        {
            "title": "便利な道具 — Dụng cụ tiện lợi",
            "content": [
                {"text": "これは", "meaning": "Đây là"},
                {"text": "何に", "meaning": "vào việc gì"},
                {"text": "使うんですか。", "meaning": "dùng vậy?"},
                {"text": "これは", "meaning": "Cái này"},
                {"text": "びんのふたを", "meaning": "nắp chai"},
                {"text": "開けるのに", "meaning": "cho việc mở,", "note": "Vるのに使います nói công dụng của đồ vật."},
                {"text": "使います。", "meaning": "dùng."},
                {"text": "薄い紙を", "meaning": "giấy mỏng"},
                {"text": "包むのにも", "meaning": "cho việc gói cũng"},
                {"text": "便利です。", "meaning": "tiện."},
            ],
        },
    ],
    43: [
        {
            "title": "様子 — Vẻ ngoài",
            "content": [
                {"text": "あ、", "meaning": "Á,"},
                {"text": "危ない！", "meaning": "nguy hiểm quá!"},
                {"text": "荷物が", "meaning": "Hành lý"},
                {"text": "落ちそうですよ。", "meaning": "trông có vẻ sắp rơi kìa.", "note": "そうです diễn tả một trạng thái sắp sửa xảy ra do phán đoán qua thị giác."},
                {"text": "あ、", "meaning": "A,"},
                {"text": "本当だ。", "meaning": "đúng thật."},
                {"text": "どうも", "meaning": "Thật sự"},
                {"text": "ありがとうございます。", "meaning": "xin cảm ơn."}
            ],
        },
        {
            "title": "変な音 — Âm thanh lạ",
            "content": [
                {"text": "この暖房、", "meaning": "Máy sưởi này,"},
                {"text": "変な音が", "meaning": "âm thanh lạ"},
                {"text": "しますね。", "meaning": "phát ra nhỉ."},
                {"text": "ええ。", "meaning": "Vâng."},
                {"text": "すぐ", "meaning": "ngay"},
                {"text": "壊れそうです。", "meaning": "trông có vẻ sắp hỏng.", "note": "Vます bỏます + そうです nói dấu hiệu sắp xảy ra."},
                {"text": "じゃ、", "meaning": "Vậy thì,"},
                {"text": "係の人を", "meaning": "người phụ trách"},
                {"text": "呼んで来ます。", "meaning": "tôi đi gọi rồi quay lại.", "note": "Vて来ます diễn tả đi làm gì đó rồi quay về."},
            ],
        },
    ],
    44: [
        {
            "title": "使いやすさ — Sự dễ dùng",
            "content": [
                {"text": "この", "meaning": "Cái"},
                {"text": "パソコンは", "meaning": "máy tính này thì"},
                {"text": "新しいのですね。", "meaning": "là cái mới nhỉ."},
                {"text": "ええ。", "meaning": "Vâng."},
                {"text": "とても", "meaning": "Rất"},
                {"text": "軽くて、", "meaning": "nhẹ và"},
                {"text": "持ち運び", "meaning": "mang đi mang lại"},
                {"text": "しやすいです。", "meaning": "thì rất dễ.", "note": "V-ます bỏ ます + やすいです dùng để chỉ việc dễ làm điều gì đó."}
            ],
        },
        {
            "title": "レストランで — Ở nhà hàng",
            "content": [
                {"text": "この料理は", "meaning": "Món này thì"},
                {"text": "量が", "meaning": "lượng"},
                {"text": "多すぎます。", "meaning": "quá nhiều.", "note": "すぎます diễn tả vượt quá mức bình thường."},
                {"text": "半分に", "meaning": "thành một nửa"},
                {"text": "できますか。", "meaning": "có thể làm được không?"},
                {"text": "はい。", "meaning": "Vâng."},
                {"text": "味も", "meaning": "vị cũng"},
                {"text": "薄く", "meaning": "nhạt đi"},
                {"text": "しましょうか。", "meaning": "tôi làm cho nhé?"},
                {"text": "お願いします。", "meaning": "Nhờ anh/chị."},
            ],
        },
    ],
    45: [
        {
            "title": "がっかり — Thất vọng",
            "content": [
                {"text": "どうしたんですか。", "meaning": "Có chuyện gì vậy?"},
                {"text": "一生懸命", "meaning": "Rất chăm chỉ"},
                {"text": "勉強したのに、", "meaning": "mặc dù đã học,", "note": "のに diễn tả sự bất mãn hoặc bất ngờ trước một kết quả trái ngược."},
                {"text": "試験に", "meaning": "kỳ thi"},
                {"text": "落ちてしまったんです。", "meaning": "tôi đã lỡ trượt mất rồi."},
                {"text": "それは", "meaning": "Điều đó thì"},
                {"text": "残念ですね。", "meaning": "thật đáng tiếc nhỉ."}
            ],
        },
        {
            "title": "キャンプの場合 — Trường hợp cắm trại",
            "content": [
                {"text": "明日のキャンプは", "meaning": "Buổi cắm trại ngày mai thì"},
                {"text": "雨の場合、", "meaning": "trường hợp trời mưa,", "note": "Nの場合は nêu tình huống giả định cụ thể."},
                {"text": "中止ですか。", "meaning": "sẽ hủy à?"},
                {"text": "いいえ。", "meaning": "Không."},
                {"text": "少し雨が", "meaning": "mưa một chút"},
                {"text": "降っても", "meaning": "dù có rơi"},
                {"text": "行います。", "meaning": "vẫn tổ chức."},
                {"text": "でも、", "meaning": "Nhưng,"},
                {"text": "台風が来た場合は、", "meaning": "trường hợp bão đến thì"},
                {"text": "中止します。", "meaning": "sẽ hủy."},
                {"text": "楽しみにしていたのに、", "meaning": "mặc dù tôi đã mong chờ vậy mà,", "note": "のに thể hiện trái kỳ vọng, thường có cảm xúc tiếc nuối."},
                {"text": "残念ですね。", "meaning": "tiếc nhỉ."},
            ],
        },
    ],
}
