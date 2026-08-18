"""Comprehensive chunk-based seed content for Minna no Nihongo lessons 36-40."""

LESSON_SENTENCES = {
    36: [
        {
            "full_japanese": "速く泳げるように、毎日練習しています。",
            "full_romaji": "Hayaku oyogeru you ni, mainichi renshuu shite imasu.",
            "full_vietnamese": "Tôi đang luyện tập mỗi ngày để có thể bơi nhanh.",
            "chunks": [
                (1, "速く", "nhanh", False),
                (2, "泳げるように、", "để có thể bơi,", True),
                (3, "毎日", "mỗi ngày", False),
                (4, "練習しています。", "tôi đang luyện tập.", False),
            ],
        },
        {
            "full_japanese": "忘れないように、メモしておきます。",
            "full_romaji": "Wasurenai you ni, memo shite okimasu.",
            "full_vietnamese": "Tôi sẽ ghi chú lại để không bị quên.",
            "chunks": [
                (1, "忘れないように、", "để không bị quên,", True),
                (2, "メモしておきます。", "tôi sẽ ghi chú lại (chuẩn bị trước).", False),
            ],
        },
        {
            "full_japanese": "毎日練習して、泳げるようになりました。",
            "full_romaji": "Mainichi renshuu shite, oyogeru you ni narimashita.",
            "full_vietnamese": "Nhờ luyện tập mỗi ngày, tôi đã trở nên biết bơi.",
            "chunks": [
                (1, "毎日練習して、", "nhờ luyện tập mỗi ngày,", False),
                (2, "泳げるように", "có thể bơi", False),
                (3, "なりました。", "tôi đã trở nên", True),
            ],
        },
        {
            "full_japanese": "最近、日本語の新聞が読めるようになりました。",
            "full_romaji": "Saikin, Nihongo no shinbun ga yomeru you ni narimashita.",
            "full_vietnamese": "Dạo này tôi đã trở nên có thể đọc được báo tiếng Nhật.",
            "chunks": [
                (1, "最近、", "dạo này,", False),
                (2, "日本語の新聞が", "báo tiếng Nhật", False),
                (3, "読めるように", "có thể đọc", False),
                (4, "なりました。", "tôi đã trở nên", True),
            ],
        },
        {
            "full_japanese": "野菜をたくさん食べるようにしています。",
            "full_romaji": "Yasai o takusan taberu you ni shite imasu.",
            "full_vietnamese": "Tôi đang cố gắng ăn nhiều rau.",
            "chunks": [
                (1, "野菜を", "rau", False),
                (2, "たくさん食べるように", "ăn nhiều", False),
                (3, "しています。", "tôi đang cố gắng", True),
            ],
        },
        {
            "full_japanese": "日本の生活に慣れるように、毎日日本人と話しています。",
            "full_romaji": "Nihon no seikatsu ni nareru you ni, mainichi Nihonjin to hanashite imasu.",
            "full_vietnamese": "Để quen với cuộc sống ở Nhật, tôi nói chuyện với người Nhật mỗi ngày.",
            "chunks": [
                (1, "日本の生活に", "với cuộc sống ở Nhật", False),
                (2, "慣れるように、", "để quen được", True),
                (3, "毎日", "mỗi ngày", False),
                (4, "日本人と", "với người Nhật", False),
                (5, "話しています。", "đang nói chuyện", False),
            ],
        },
        {
            "full_japanese": "健康のために、夜遅く寝ないようにしています。",
            "full_romaji": "Kenkou no tame ni, yoru osoku nenai you ni shite imasu.",
            "full_vietnamese": "Vì sức khỏe, tôi cố gắng không ngủ muộn.",
            "chunks": [
                (1, "健康のために、", "vì sức khỏe", False),
                (2, "夜遅く", "muộn ban đêm", False),
                (3, "寝ないように", "không ngủ", True),
                (4, "しています。", "đang cố gắng", False),
            ],
        },
        {
            "full_japanese": "やっと電子メールが打てるようになりました。",
            "full_romaji": "Yatto denshi meeru ga uteru you ni narimashita.",
            "full_vietnamese": "Cuối cùng tôi đã có thể gõ email.",
            "chunks": [
                (1, "やっと", "cuối cùng", False),
                (2, "電子メールが", "email", False),
                (3, "打てるように", "có thể gõ", True),
                (4, "なりました。", "đã trở nên", False),
            ],
        },
        {
            "full_japanese": "貯金できるように、毎月少しずつお金を入れています。",
            "full_romaji": "Chokin dekiru you ni, maitsuki sukoshi zutsu okane o irete imasu.",
            "full_vietnamese": "Để có thể tiết kiệm, mỗi tháng tôi gửi từng chút tiền.",
            "chunks": [
                (1, "貯金できるように、", "để có thể tiết kiệm", True),
                (2, "毎月", "mỗi tháng", False),
                (3, "少しずつ", "từng chút một", False),
                (4, "お金を", "tiền", False),
                (5, "入れています。", "đang bỏ vào/gửi", False),
            ],
        },
        {
            "full_japanese": "絶対に忘れないようにしてください。",
            "full_romaji": "Zettai ni wasurenai you ni shite kudasai.",
            "full_vietnamese": "Xin hãy cố gắng tuyệt đối đừng quên.",
            "chunks": [
                (1, "絶対に", "tuyệt đối", False),
                (2, "忘れないように", "để không quên", True),
                (3, "してください。", "xin hãy cố gắng", False),
            ],
        },
    ],
    37: [
        {
            "full_japanese": "私は先生に褒められました。",
            "full_romaji": "Watashi wa sensei ni homeraremashita.",
            "full_vietnamese": "Tôi đã được giáo viên khen.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "先生に", "bởi giáo viên", False),
                (3, "褒められました。", "đã được khen. (bị động)", True),
            ],
        },
        {
            "full_japanese": "私は犬に手をかまれました。",
            "full_romaji": "Watashi wa inu ni te o kamaremashita.",
            "full_vietnamese": "Tôi bị chó cắn vào tay.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "犬に", "bởi con chó", False),
                (3, "手を", "vào tay", False),
                (4, "かまれました。", "đã bị cắn.", True),
            ],
        },
        {
            "full_japanese": "弟にパソコンを壊されました。",
            "full_romaji": "Otouto ni pasokon o kowasaremashita.",
            "full_vietnamese": "Tôi bị em trai làm hỏng máy tính.",
            "chunks": [
                (1, "弟に", "bởi em trai", False),
                (2, "パソコンを", "máy tính", False),
                (3, "壊されました。", "đã bị làm hỏng. (bị động gián tiếp)", True),
            ],
        },
        {
            "full_japanese": "大阪で展覧会が開かれます。",
            "full_romaji": "Oosaka de tenrankai ga hirakaremasu.",
            "full_vietnamese": "Triển lãm sẽ được tổ chức ở Osaka.",
            "chunks": [
                (1, "大阪で", "ở Osaka", False),
                (2, "展覧会が", "triển lãm", False),
                (3, "開かれます。", "sẽ được tổ chức.", True),
            ],
        },
        {
            "full_japanese": "電話はベルによって発明されました。",
            "full_romaji": "Denwa wa Beru ni yotte hatsumei saremashita.",
            "full_vietnamese": "Điện thoại được phát minh bởi Bell.",
            "chunks": [
                (1, "電話は", "điện thoại thì", False),
                (2, "ベルによって", "bởi Bell", True),
                (3, "発明されました。", "đã được phát minh.", False),
            ],
        },
        {
            "full_japanese": "私は友達にパーティーに誘われました。",
            "full_romaji": "Watashi wa tomodachi ni paatii ni sasowaremashita.",
            "full_vietnamese": "Tôi được bạn rủ đến bữa tiệc.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "友達に", "bởi bạn", False),
                (3, "パーティーに", "đến bữa tiệc", False),
                (4, "誘われました。", "được rủ", True),
            ],
        },
        {
            "full_japanese": "母に朝早く起こされました。",
            "full_romaji": "Haha ni asa hayaku okosaremashita.",
            "full_vietnamese": "Tôi bị mẹ đánh thức từ sáng sớm.",
            "chunks": [
                (1, "母に", "bởi mẹ", False),
                (2, "朝早く", "sáng sớm", False),
                (3, "起こされました。", "bị đánh thức", True),
            ],
        },
        {
            "full_japanese": "この小説は世界中で読まれています。",
            "full_romaji": "Kono shousetsu wa sekaijuu de yomarete imasu.",
            "full_vietnamese": "Cuốn tiểu thuyết này đang được đọc khắp thế giới.",
            "chunks": [
                (1, "この小説は", "cuốn tiểu thuyết này thì", False),
                (2, "世界中で", "khắp thế giới", False),
                (3, "読まれています。", "đang được đọc", True),
            ],
        },
        {
            "full_japanese": "米はアジアの国々へ輸出されています。",
            "full_romaji": "Kome wa Ajia no kuniguni e yushutsu sarete imasu.",
            "full_vietnamese": "Gạo đang được xuất khẩu sang các nước châu Á.",
            "chunks": [
                (1, "米は", "gạo thì", False),
                (2, "アジアの国々へ", "đến các nước châu Á", False),
                (3, "輸出されています。", "đang được xuất khẩu", True),
            ],
        },
        {
            "full_japanese": "泥棒に財布を取られました。",
            "full_romaji": "Dorobou ni saifu o toraremashita.",
            "full_vietnamese": "Tôi bị kẻ trộm lấy mất ví.",
            "chunks": [
                (1, "泥棒に", "bởi kẻ trộm", False),
                (2, "財布を", "ví", False),
                (3, "取られました。", "bị lấy mất", True),
            ],
        },
    ],
    38: [
        {
            "full_japanese": "絵を描くのは楽しいです。",
            "full_romaji": "E o kaku no wa tanoshii desu.",
            "full_vietnamese": "Việc vẽ tranh thì rất vui.",
            "chunks": [
                (1, "絵を描くのは", "việc vẽ tranh thì", True),
                (2, "楽しいです。", "rất vui.", False),
            ],
        },
        {
            "full_japanese": "私は星を見るのが好きです。",
            "full_romaji": "Watashi wa hoshi o miru no ga suki desu.",
            "full_vietnamese": "Tôi thích việc ngắm sao.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "星を見るのが", "việc ngắm sao", True),
                (3, "好きです。", "thích.", False),
            ],
        },
        {
            "full_japanese": "薬を飲むのを忘れました。",
            "full_romaji": "Kusuri o nomu no o wasuremashita.",
            "full_vietnamese": "Tôi đã quên việc uống thuốc.",
            "chunks": [
                (1, "薬を飲むのを", "việc uống thuốc", True),
                (2, "忘れました。", "tôi đã quên.", False),
            ],
        },
        {
            "full_japanese": "鈴木さんが結婚したのを知っていますか。",
            "full_romaji": "Suzuki-san ga kekkon shita no o shitte imasu ka.",
            "full_vietnamese": "Bạn có biết việc anh Suzuki đã kết hôn không?",
            "chunks": [
                (1, "鈴木さんが", "anh Suzuki", False),
                (2, "結婚したのを", "việc đã kết hôn", True),
                (3, "知っていますか。", "bạn có biết không?", False),
            ],
        },
        {
            "full_japanese": "初めて会ったのは3年前です。",
            "full_romaji": "Hajimete atta no wa sannen mae desu.",
            "full_vietnamese": "Lần đầu tiên chúng tôi gặp nhau là 3 năm trước.",
            "chunks": [
                (1, "初めて会ったのは", "lần đầu gặp gỡ là", True),
                (2, "3年前です。", "3 năm trước.", False),
            ],
        },
        {
            "full_japanese": "赤ちゃんを育てるのは大変です。",
            "full_romaji": "Akachan o sodateru no wa taihen desu.",
            "full_vietnamese": "Việc nuôi em bé rất vất vả.",
            "chunks": [
                (1, "赤ちゃんを育てるのは", "việc nuôi em bé thì", True),
                (2, "大変です。", "vất vả", False),
            ],
        },
        {
            "full_japanese": "電源を切るのを忘れないでください。",
            "full_romaji": "Dengen o kiru no o wasurenaide kudasai.",
            "full_vietnamese": "Xin đừng quên tắt nguồn điện.",
            "chunks": [
                (1, "電源を切るのを", "việc tắt nguồn điện", True),
                (2, "忘れないで", "đừng quên", False),
                (3, "ください。", "xin hãy", False),
            ],
        },
        {
            "full_japanese": "駅前に新しい病院ができたのを知っていますか。",
            "full_romaji": "Ekimae ni atarashii byouin ga dekita no o shitte imasu ka.",
            "full_vietnamese": "Bạn có biết việc một bệnh viện mới được xây trước ga không?",
            "chunks": [
                (1, "駅前に", "trước ga", False),
                (2, "新しい病院が", "bệnh viện mới", False),
                (3, "できたのを", "việc đã được xây/có", True),
                (4, "知っていますか。", "bạn có biết không?", False),
            ],
        },
        {
            "full_japanese": "書類を整理するのに時間がかかります。",
            "full_romaji": "Shorui o seiri suru noni jikan ga kakarimasu.",
            "full_vietnamese": "Việc sắp xếp giấy tờ mất thời gian.",
            "chunks": [
                (1, "書類を整理するのに", "cho việc sắp xếp giấy tờ", True),
                (2, "時間が", "thời gian", False),
                (3, "かかります。", "tốn/mất", False),
            ],
        },
        {
            "full_japanese": "海岸を散歩するのは気持ちがいいです。",
            "full_romaji": "Kaigan o sanpo suru no wa kimochi ga ii desu.",
            "full_vietnamese": "Việc đi dạo ở bờ biển rất dễ chịu.",
            "chunks": [
                (1, "海岸を散歩するのは", "việc đi dạo ở bờ biển thì", True),
                (2, "気持ちがいいです。", "dễ chịu", False),
            ],
        },
    ],
    39: [
        {
            "full_japanese": "ニュースを聞いて、びっくりしました。",
            "full_romaji": "Nyuusu o kiite, bikkuri shimashita.",
            "full_vietnamese": "Nghe tin tức xong, tôi đã rất ngạc nhiên.",
            "chunks": [
                (1, "ニュースを聞いて、", "nghe tin tức xong (lý do),", True),
                (2, "びっくりしました。", "tôi đã rất ngạc nhiên.", False),
            ],
        },
        {
            "full_japanese": "家族に会えなくて、寂しいです。",
            "full_romaji": "Kazoku ni aenakute, sabishii desu.",
            "full_vietnamese": "Vì không được gặp gia đình nên tôi rất buồn.",
            "chunks": [
                (1, "家族に会えなくて、", "vì không thể gặp gia đình,", True),
                (2, "寂しいです。", "nên tôi buồn.", False),
            ],
        },
        {
            "full_japanese": "お金がなくて、パソコンが買えません。",
            "full_romaji": "Okane ga nakute, pasokon ga kaemasen.",
            "full_vietnamese": "Vì không có tiền nên tôi không thể mua máy tính.",
            "chunks": [
                (1, "お金がなくて、", "vì không có tiền,", True),
                (2, "パソコンが買えません。", "nên không thể mua máy tính.", False),
            ],
        },
        {
            "full_japanese": "事故で電車が止まりました。",
            "full_romaji": "Jiko de densha ga tomarimashita.",
            "full_vietnamese": "Vì tai nạn nên tàu điện đã dừng lại.",
            "chunks": [
                (1, "事故で", "vì tai nạn,", True),
                (2, "電車が", "tàu điện", False),
                (3, "止まりました。", "đã dừng lại.", False),
            ],
        },
        {
            "full_japanese": "病気で学校を休みました。",
            "full_romaji": "Byouki de gakkou o yasumimashita.",
            "full_vietnamese": "Vì bị ốm nên tôi đã nghỉ học.",
            "chunks": [
                (1, "病気で", "vì bị ốm,", True),
                (2, "学校を", "trường học", False),
                (3, "休みました。", "đã nghỉ.", False),
            ],
        },
        {
            "full_japanese": "試験に合格して、安心しました。",
            "full_romaji": "Shiken ni goukaku shite, anshin shimashita.",
            "full_vietnamese": "Vì đã đỗ kỳ thi nên tôi thấy yên tâm.",
            "chunks": [
                (1, "試験に合格して、", "vì đã đỗ kỳ thi", True),
                (2, "安心しました。", "tôi thấy yên tâm", False),
            ],
        },
        {
            "full_japanese": "友達に会えて、うれしいです。",
            "full_romaji": "Tomodachi ni aete, ureshii desu.",
            "full_vietnamese": "Vì gặp được bạn nên tôi vui.",
            "chunks": [
                (1, "友達に会えて、", "vì gặp được bạn", True),
                (2, "うれしいです。", "tôi vui", False),
            ],
        },
        {
            "full_japanese": "台風で木が倒れました。",
            "full_romaji": "Taifuu de ki ga taoremashita.",
            "full_vietnamese": "Vì bão nên cây đã đổ.",
            "chunks": [
                (1, "台風で", "vì bão", True),
                (2, "木が", "cây", False),
                (3, "倒れました。", "đã đổ", False),
            ],
        },
        {
            "full_japanese": "火事で店が焼けました。",
            "full_romaji": "Kaji de mise ga yakemashita.",
            "full_vietnamese": "Vì hỏa hoạn nên cửa hàng đã cháy.",
            "chunks": [
                (1, "火事で", "vì hỏa hoạn", True),
                (2, "店が", "cửa hàng", False),
                (3, "焼けました。", "đã cháy", False),
            ],
        },
        {
            "full_japanese": "道が複雑で、迷ってしまいました。",
            "full_romaji": "Michi ga fukuzatsu de, mayotte shimaimashita.",
            "full_vietnamese": "Vì đường phức tạp nên tôi đã lạc mất.",
            "chunks": [
                (1, "道が", "đường", False),
                (2, "複雑で、", "vì phức tạp", True),
                (3, "迷ってしまいました。", "đã lạc mất", False),
            ],
        },
    ],
    40: [
        {
            "full_japanese": "会議は何時に終わるか、わかりません。",
            "full_romaji": "Kaigi wa nanji ni owaru ka, wakarimasen.",
            "full_vietnamese": "Tôi không biết cuộc họp sẽ kết thúc lúc mấy giờ.",
            "chunks": [
                (1, "会議は", "cuộc họp thì", False),
                (2, "何時に終わるか、", "kết thúc lúc mấy giờ,", True),
                (3, "わかりません。", "tôi không biết.", False),
            ],
        },
        {
            "full_japanese": "どこでなくしたか、覚えていません。",
            "full_romaji": "Doko de nakushita ka, oboete imasen.",
            "full_vietnamese": "Tôi không nhớ là đã làm mất ở đâu.",
            "chunks": [
                (1, "どこでなくしたか、", "đã làm mất ở đâu,", True),
                (2, "覚えていません。", "tôi không nhớ.", False),
            ],
        },
        {
            "full_japanese": "その話が本当かどうか、わかりません。",
            "full_romaji": "Sono hanashi ga hontou ka dou ka, wakarimasen.",
            "full_vietnamese": "Tôi không biết câu chuyện đó có thật hay không.",
            "chunks": [
                (1, "その話が", "câu chuyện đó", False),
                (2, "本当かどうか、", "có thật hay không,", True),
                (3, "わかりません。", "tôi không biết.", False),
            ],
        },
        {
            "full_japanese": "間違いがないかどうか、調べてください。",
            "full_romaji": "Machigai ga nai ka dou ka, shirabete kudasai.",
            "full_vietnamese": "Hãy kiểm tra xem có sai sót hay không.",
            "chunks": [
                (1, "間違いがないかどうか、", "có lỗi sai hay không,", True),
                (2, "調べてください。", "xin hãy kiểm tra.", False),
            ],
        },
        {
            "full_japanese": "新しい靴を履いてみます。",
            "full_romaji": "Atarashii kutsu o haite mimasu.",
            "full_vietnamese": "Tôi sẽ đi thử đôi giày mới.",
            "chunks": [
                (1, "新しい靴を", "đôi giày mới", False),
                (2, "履いてみます。", "tôi sẽ mang thử.", True),
            ],
        },
        {
            "full_japanese": "電車が何番線に到着するか、駅員に聞きます。",
            "full_romaji": "Densha ga nanbansen ni touchaku suru ka, ekiin ni kikimasu.",
            "full_vietnamese": "Tôi sẽ hỏi nhân viên nhà ga xem tàu đến đường ray số mấy.",
            "chunks": [
                (1, "電車が", "tàu điện", False),
                (2, "何番線に到着するか、", "đến đường ray số mấy", True),
                (3, "駅員に", "nhân viên nhà ga", False),
                (4, "聞きます。", "hỏi", False),
            ],
        },
        {
            "full_japanese": "このズボンの長さが合うかどうか、確かめます。",
            "full_romaji": "Kono zubon no nagasa ga au ka dou ka, tashikamemasu.",
            "full_vietnamese": "Tôi sẽ xác nhận xem chiều dài của cái quần này có vừa không.",
            "chunks": [
                (1, "このズボンの長さが", "chiều dài của quần này", False),
                (2, "合うかどうか、", "có vừa hay không", True),
                (3, "確かめます。", "xác nhận", False),
            ],
        },
        {
            "full_japanese": "荷物の重さを測ってみます。",
            "full_romaji": "Nimotsu no omosa o hakatte mimasu.",
            "full_vietnamese": "Tôi sẽ thử cân trọng lượng hành lý.",
            "chunks": [
                (1, "荷物の重さを", "trọng lượng hành lý", False),
                (2, "測ってみます。", "thử cân/đo", True),
            ],
        },
        {
            "full_japanese": "返事が来たかどうか、メールを見てください。",
            "full_romaji": "Henji ga kita ka dou ka, meeru o mite kudasai.",
            "full_vietnamese": "Hãy xem email xem đã có hồi âm chưa.",
            "chunks": [
                (1, "返事が", "hồi âm", False),
                (2, "来たかどうか、", "đã đến hay chưa", True),
                (3, "メールを", "email", False),
                (4, "見てください。", "hãy xem", False),
            ],
        },
        {
            "full_japanese": "この料理を一度食べてみてもいいですか。",
            "full_romaji": "Kono ryouri o ichido tabete mite mo ii desu ka.",
            "full_vietnamese": "Tôi ăn thử món này một lần có được không?",
            "chunks": [
                (1, "この料理を", "món ăn này", False),
                (2, "一度", "một lần", False),
                (3, "食べてみてもいい", "ăn thử có được không", True),
                (4, "ですか。", "ạ?", False),
            ],
        },
    ],
}

LESSON_PASSAGES = {
    36: [
        {
            "title": "目標 — Mục tiêu",
            "content": [
                {"text": "来年", "meaning": "Năm sau"},
                {"text": "日本へ", "meaning": "đến Nhật"},
                {"text": "行くんですか。", "meaning": "bạn sẽ đi à?"},
                {"text": "ええ。", "meaning": "Vâng."},
                {"text": "日本の", "meaning": "Của Nhật"},
                {"text": "大学で", "meaning": "ở đại học"},
                {"text": "勉強できるように、", "meaning": "để có thể học tập,", "note": "ように chỉ mục tiêu."},
                {"text": "今", "meaning": "bây giờ"},
                {"text": "一生懸命", "meaning": "chăm chỉ"},
                {"text": "日本語を", "meaning": "tiếng Nhật"},
                {"text": "勉強しています。", "meaning": "tôi đang học."}
            ],
        },
        {
            "title": "健康のために — Vì sức khỏe",
            "content": [
                {"text": "このごろ", "meaning": "Gần đây"},
                {"text": "少し", "meaning": "một chút"},
                {"text": "太りました。", "meaning": "tôi đã tăng cân."},
                {"text": "健康のために、", "meaning": "Vì sức khỏe,"},
                {"text": "夜遅く", "meaning": "muộn ban đêm"},
                {"text": "食べないように", "meaning": "để không ăn,", "note": "Vないようにしています diễn tả cố gắng tránh làm một việc."},
                {"text": "しています。", "meaning": "tôi đang cố gắng."},
                {"text": "それから、", "meaning": "Ngoài ra,"},
                {"text": "毎週", "meaning": "mỗi tuần"},
                {"text": "水泳を", "meaning": "môn bơi"},
                {"text": "するように", "meaning": "để duy trì làm"},
                {"text": "しています。", "meaning": "tôi đang cố gắng."},
            ],
        },
    ],
    37: [
        {
            "title": "子供のころ — Hồi còn nhỏ",
            "content": [
                {"text": "子供のころ、", "meaning": "Hồi còn nhỏ,"},
                {"text": "よく", "meaning": "thường xuyên"},
                {"text": "お母さんに", "meaning": "bởi mẹ"},
                {"text": "叱られましたか。", "meaning": "bạn có bị mắng không?", "note": "叱られました là thể bị động của 叱ります (mắng)."},
                {"text": "ええ。", "meaning": "Có."},
                {"text": "よく", "meaning": "Thường xuyên"},
                {"text": "弟を", "meaning": "em trai"},
                {"text": "泣かせましたから。", "meaning": "vì tôi đã làm cho khóc."},
                {"text": "それで、", "meaning": "Vì thế,"},
                {"text": "母に", "meaning": "bởi mẹ"},
                {"text": "叱られました。", "meaning": "tôi đã bị mắng."}
            ],
        },
        {
            "title": "有名な発明 — Phát minh nổi tiếng",
            "content": [
                {"text": "電話は", "meaning": "Điện thoại thì"},
                {"text": "ベルによって", "meaning": "bởi Bell", "note": "によって dùng để nêu người phát minh, sáng tác hoặc thiết kế."},
                {"text": "発明されました。", "meaning": "đã được phát minh."},
                {"text": "飛行機は", "meaning": "Máy bay thì"},
                {"text": "ライト兄弟によって", "meaning": "bởi anh em nhà Wright"},
                {"text": "作られました。", "meaning": "được tạo ra."},
                {"text": "今では", "meaning": "Ngày nay thì"},
                {"text": "世界中で", "meaning": "khắp thế giới"},
                {"text": "利用されています。", "meaning": "đang được sử dụng."},
            ],
        },
    ],
    38: [
        {
            "title": "片付け — Việc dọn dẹp",
            "content": [
                {"text": "部屋を", "meaning": "Căn phòng"},
                {"text": "片付けるのは", "meaning": "việc dọn dẹp thì", "note": "のは dùng để danh từ hóa cụm động từ đóng vai trò chủ đề."},
                {"text": "好きですか。", "meaning": "bạn có thích không?"},
                {"text": "いいえ、", "meaning": "Không,"},
                {"text": "好きじゃありません。", "meaning": "tôi không thích."},
                {"text": "私は", "meaning": "Tôi thì"},
                {"text": "本を", "meaning": "sách"},
                {"text": "読むのが", "meaning": "việc đọc", "note": "のが dùng để danh từ hóa đi với các tính từ chỉ sở thích, kỹ năng."},
                {"text": "好きですから、", "meaning": "vì thích nên,"},
                {"text": "部屋には", "meaning": "ở trong phòng thì"},
                {"text": "本が", "meaning": "sách"},
                {"text": "たくさん", "meaning": "rất nhiều"},
                {"text": "あります。", "meaning": "có."}
            ],
        },
        {
            "title": "研究室のルール — Quy tắc phòng nghiên cứu",
            "content": [
                {"text": "研究室を", "meaning": "Phòng nghiên cứu"},
                {"text": "きちんと", "meaning": "ngăn nắp"},
                {"text": "整理するのは", "meaning": "việc sắp xếp thì", "note": "Vるのは biến cả cụm động từ thành chủ đề."},
                {"text": "大切です。", "meaning": "quan trọng."},
                {"text": "電源を", "meaning": "nguồn điện"},
                {"text": "切るのを", "meaning": "việc tắt"},
                {"text": "忘れないでください。", "meaning": "xin đừng quên."},
                {"text": "書類を", "meaning": "giấy tờ"},
                {"text": "運ぶのに", "meaning": "cho việc vận chuyển"},
                {"text": "時間が", "meaning": "thời gian"},
                {"text": "かかります。", "meaning": "mất."},
            ],
        },
    ],
    39: [
        {
            "title": "遅刻の理由 — Lý do đi muộn",
            "content": [
                {"text": "どうして", "meaning": "Tại sao"},
                {"text": "遅れたんですか。", "meaning": "bạn lại đến muộn vậy?"},
                {"text": "すみません。", "meaning": "Tôi xin lỗi."},
                {"text": "事故で", "meaning": "Vì tai nạn,", "note": "N + で dùng để chỉ nguyên nhân thiên tai, sự cố."},
                {"text": "バスが", "meaning": "xe buýt"},
                {"text": "来なかったんです。", "meaning": "đã không đến."},
                {"text": "そうですか。", "meaning": "Vậy à."},
                {"text": "次からは", "meaning": "Từ lần sau thì"},
                {"text": "気を付けてくださいね。", "meaning": "hãy cẩn thận nhé."}
            ],
        },
        {
            "title": "台風の日 — Ngày bão",
            "content": [
                {"text": "昨日は", "meaning": "Hôm qua thì"},
                {"text": "台風で", "meaning": "vì bão", "note": "Nで chỉ nguyên nhân như thiên tai, tai nạn, bệnh tật."},
                {"text": "電車が", "meaning": "tàu điện"},
                {"text": "止まりました。", "meaning": "đã dừng."},
                {"text": "大勢の人が", "meaning": "nhiều người"},
                {"text": "駅で", "meaning": "ở ga"},
                {"text": "並んでいました。", "meaning": "đã xếp hàng."},
                {"text": "ニュースを聞いて、", "meaning": "nghe tin xong,"},
                {"text": "びっくりしました。", "meaning": "tôi đã ngạc nhiên."},
            ],
        },
    ],
    40: [
        {
            "title": "服のサイズ — Kích cỡ quần áo",
            "content": [
                {"text": "この", "meaning": "Cái này"},
                {"text": "ズボン、", "meaning": "quần dài,"},
                {"text": "いいですね。", "meaning": "đẹp nhỉ."},
                {"text": "ええ。", "meaning": "Vâng."},
                {"text": "でも、", "meaning": "Nhưng mà,"},
                {"text": "サイズが", "meaning": "kích cỡ"},
                {"text": "合うかどうか", "meaning": "có vừa hay không,", "note": "かどうか dùng để lồng câu hỏi Yes/No vào trong một câu khác."},
                {"text": "わかりません。", "meaning": "tôi không biết."},
                {"text": "じゃ、", "meaning": "Vậy thì,"},
                {"text": "一度", "meaning": "một lần"},
                {"text": "はいてみたら", "meaning": "nếu thử mặc", "note": "てみます nghĩa là thử làm một việc gì đó."},
                {"text": "どうですか。", "meaning": "thì sao?"}
            ],
        },
        {
            "title": "忘年会の確認 — Xác nhận tiệc tất niên",
            "content": [
                {"text": "忘年会は", "meaning": "Tiệc tất niên thì"},
                {"text": "何人", "meaning": "bao nhiêu người"},
                {"text": "来るか", "meaning": "sẽ đến,", "note": "疑問詞 + か dùng để lồng câu hỏi có từ nghi vấn vào câu lớn."},
                {"text": "数えてください。", "meaning": "hãy đếm."},
                {"text": "会場が", "meaning": "hội trường"},
                {"text": "必要な大きさかどうか", "meaning": "có kích thước cần thiết hay không", "note": "かどうか dùng cho câu hỏi có/không."},
                {"text": "確かめます。", "meaning": "sẽ xác nhận."},
                {"text": "新しい料理も", "meaning": "món ăn mới cũng"},
                {"text": "食べてみましょう。", "meaning": "hãy thử ăn."},
            ],
        },
    ],
}
