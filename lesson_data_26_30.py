"""Comprehensive chunk-based seed content for Minna no Nihongo lessons 26-30."""

LESSON_SENTENCES = {
    26: [
        {
            "full_japanese": "あしたから旅行なんです。",
            "full_romaji": "Ashita kara ryokou nan desu.",
            "full_vietnamese": "Từ ngày mai tôi sẽ đi du lịch.",
            "chunks": [
                (1, "あしたから", "từ ngày mai", False),
                (2, "旅行", "du lịch", False),
                (3, "なんです。", "sẽ... (nhấn mạnh)", True),
            ],
        },
        {
            "full_japanese": "どうして遅れたんですか。",
            "full_romaji": "Doushite okuretan desu ka.",
            "full_vietnamese": "Tại sao bạn lại đến muộn vậy?",
            "chunks": [
                (1, "どうして", "tại sao", True),
                (2, "遅れた", "đã đến muộn", False),
                (3, "んですか。", "vậy? (nhấn mạnh lý do)", False),
            ],
        },
        {
            "full_japanese": "頭が痛いんです。",
            "full_romaji": "Atama ga itain desu.",
            "full_vietnamese": "Tôi bị đau đầu.",
            "chunks": [
                (1, "頭が", "đầu (của tôi)", False),
                (2, "痛い", "đau", False),
                (3, "んです。", "lắm (giải thích tình trạng)", True),
            ],
        },
        {
            "full_japanese": "日本語がわからないんですが、英語で話していただけませんか。",
            "full_romaji": "Nihongo ga wakaranain desu ga, Eigo de hanashite itadakemasen ka.",
            "full_vietnamese": "Tôi không hiểu tiếng Nhật, bạn có thể nói bằng tiếng Anh giúp tôi được không?",
            "chunks": [
                (1, "日本語が", "tiếng Nhật", False),
                (2, "わからないんですが、", "tôi không hiểu (trình bày hoàn cảnh)", True),
                (3, "英語で", "bằng tiếng Anh", False),
                (4, "話して", "nói", False),
                (5, "いただけませんか。", "giúp tôi được không? (nhờ vả lịch sự)", True),
            ],
        },
        {
            "full_japanese": "カメラを買いたいんですが、どこで買ったらいいですか。",
            "full_romaji": "Kamera o kaitain desu ga, doko de kattara ii desu ka.",
            "full_vietnamese": "Tôi muốn mua máy ảnh, mua ở đâu thì tốt nhỉ?",
            "chunks": [
                (1, "カメラを", "máy ảnh", False),
                (2, "買いたいんですが、", "tôi muốn mua (trình bày)", False),
                (3, "どこで", "ở đâu", True),
                (4, "買ったらいい", "nếu mua thì tốt", False),
                (5, "ですか。", "nhỉ? (xin lời khuyên)", True),
            ],
        },
        {
            "full_japanese": "ごみを出したいんですが、どこに出したらいいですか。",
            "full_romaji": "Gomi o dashitain desu ga, doko ni dashitara ii desu ka.",
            "full_vietnamese": "Tôi muốn đổ rác, nên mang ra chỗ nào thì được?",
            "chunks": [
                (1, "ごみを", "rác", False),
                (2, "出したいんですが、", "tôi muốn mang ra/đổ (mở lời)", True),
                (3, "どこに", "ở đâu / vào chỗ nào", False),
                (4, "出したらいい", "nên mang ra thì tốt", True),
                (5, "ですか。", "ạ?", False),
            ],
        },
        {
            "full_japanese": "運動会に参加したいんですが、申し込みはどこですか。",
            "full_romaji": "Undoukai ni sanka shitain desu ga, moushikomi wa doko desu ka.",
            "full_vietnamese": "Tôi muốn tham gia hội thao, đăng ký ở đâu vậy?",
            "chunks": [
                (1, "運動会に", "hội thao", False),
                (2, "参加したいんですが、", "tôi muốn tham gia (mở lời)", True),
                (3, "申し込みは", "việc đăng ký thì", False),
                (4, "どこですか。", "ở đâu vậy?", False),
            ],
        },
        {
            "full_japanese": "気分が悪いんですが、早く帰ってもいいですか。",
            "full_romaji": "Kibun ga waruin desu ga, hayaku kaette mo ii desu ka.",
            "full_vietnamese": "Tôi thấy không khỏe, tôi về sớm có được không?",
            "chunks": [
                (1, "気分が", "tình trạng/cảm giác", False),
                (2, "悪いんですが、", "không tốt (trình bày hoàn cảnh)", True),
                (3, "早く", "sớm", False),
                (4, "帰ってもいい", "về có được không", True),
                (5, "ですか。", "ạ?", False),
            ],
        },
        {
            "full_japanese": "この書類を直接渡していただけませんか。",
            "full_romaji": "Kono shorui o chokusetsu watashite itadakemasen ka.",
            "full_vietnamese": "Bạn có thể trao trực tiếp tài liệu này giúp tôi được không?",
            "chunks": [
                (1, "この書類を", "tài liệu này", False),
                (2, "直接", "trực tiếp", False),
                (3, "渡して", "trao, đưa", False),
                (4, "いただけませんか。", "giúp tôi được không?", True),
            ],
        },
        {
            "full_japanese": "都合が悪いんですが、時間を変えていただけませんか。",
            "full_romaji": "Tsugou ga waruin desu ga, jikan o kaete itadakemasen ka.",
            "full_vietnamese": "Tôi không tiện, bạn có thể đổi giờ giúp tôi được không?",
            "chunks": [
                (1, "都合が", "lịch trình/sự thuận tiện", False),
                (2, "悪いんですが、", "không tiện (mở lời)", True),
                (3, "時間を", "thời gian", False),
                (4, "変えて", "đổi", False),
                (5, "いただけませんか。", "giúp tôi được không?", True),
            ],
        },
    ],
    27: [
        {
            "full_japanese": "私は日本語の新聞が読めます。",
            "full_romaji": "Watashi wa Nihongo no shinbun ga yomemasu.",
            "full_vietnamese": "Tôi có thể đọc được báo tiếng Nhật.",
            "chunks": [
                (1, "私は", "tôi thì", False),
                (2, "日本語の新聞が", "báo tiếng Nhật (đối tượng của khả năng)", True),
                (3, "読めます。", "có thể đọc", False),
            ],
        },
        {
            "full_japanese": "ここで写真が撮れますか。",
            "full_romaji": "Koko de shashin ga toremasu ka.",
            "full_vietnamese": "Ở đây có thể chụp ảnh được không?",
            "chunks": [
                (1, "ここで", "ở đây", False),
                (2, "写真が", "ảnh", False),
                (3, "撮れますか。", "có thể chụp không?", True),
            ],
        },
        {
            "full_japanese": "富士山が見えます。",
            "full_romaji": "Fujisan ga miemasu.",
            "full_vietnamese": "Có thể nhìn thấy núi Phú Sĩ.",
            "chunks": [
                (1, "富士山が", "núi Phú Sĩ", False),
                (2, "見えます。", "có thể nhìn thấy (tự nhiên lọt vào mắt)", True),
            ],
        },
        {
            "full_japanese": "波の音が聞こえます。",
            "full_romaji": "Nami no oto ga kikoemasu.",
            "full_vietnamese": "Có thể nghe thấy tiếng sóng.",
            "chunks": [
                (1, "波の音が", "tiếng sóng", False),
                (2, "聞こえます。", "có thể nghe thấy (tự nhiên lọt vào tai)", True),
            ],
        },
        {
            "full_japanese": "ローマ字しか書けません。",
            "full_romaji": "Roomaji shika kakemasen.",
            "full_vietnamese": "Tôi chỉ có thể viết được Romaji.",
            "chunks": [
                (1, "ローマ字", "chữ Romaji", False),
                (2, "しか", "chỉ (đi với phủ định)", True),
                (3, "書けません。", "không thể viết", False),
            ],
        },
        {
            "full_japanese": "このアパートではペットが飼えます。",
            "full_romaji": "Kono apaato de wa petto ga kaemasu.",
            "full_vietnamese": "Ở căn hộ này có thể nuôi thú cưng.",
            "chunks": [
                (1, "このアパートでは", "ở căn hộ này thì", False),
                (2, "ペットが", "thú cưng (đối tượng khả năng)", True),
                (3, "飼えます。", "có thể nuôi", False),
            ],
        },
        {
            "full_japanese": "来週から新しい図書館が使えます。",
            "full_romaji": "Raishuu kara atarashii toshokan ga tsukaemasu.",
            "full_vietnamese": "Từ tuần sau có thể dùng thư viện mới.",
            "chunks": [
                (1, "来週から", "từ tuần sau", False),
                (2, "新しい図書館が", "thư viện mới", False),
                (3, "使えます。", "có thể sử dụng", True),
            ],
        },
        {
            "full_japanese": "この部屋から海が見えます。",
            "full_romaji": "Kono heya kara umi ga miemasu.",
            "full_vietnamese": "Từ căn phòng này có thể nhìn thấy biển.",
            "chunks": [
                (1, "この部屋から", "từ căn phòng này", False),
                (2, "海が", "biển", False),
                (3, "見えます。", "có thể nhìn thấy", True),
            ],
        },
        {
            "full_japanese": "隣の部屋から子供の声が聞こえます。",
            "full_romaji": "Tonari no heya kara kodomo no koe ga kikoemasu.",
            "full_vietnamese": "Từ phòng bên cạnh nghe thấy tiếng trẻ con.",
            "chunks": [
                (1, "隣の部屋から", "từ phòng bên cạnh", False),
                (2, "子供の声が", "tiếng trẻ con", False),
                (3, "聞こえます。", "có thể nghe thấy", True),
            ],
        },
        {
            "full_japanese": "日曜日しか休みが取れません。",
            "full_romaji": "Nichiyoubi shika yasumi ga toremasen.",
            "full_vietnamese": "Tôi chỉ có thể xin nghỉ vào Chủ nhật.",
            "chunks": [
                (1, "日曜日", "Chủ nhật", False),
                (2, "しか", "chỉ (đi với phủ định)", True),
                (3, "休みが", "ngày nghỉ", False),
                (4, "取れません。", "không thể lấy/xin", False),
            ],
        },
    ],
    28: [
        {
            "full_japanese": "音楽を聞きながら食事します。",
            "full_romaji": "Ongaku o kikinagara shokuji shimasu.",
            "full_vietnamese": "Tôi vừa nghe nhạc vừa dùng bữa.",
            "chunks": [
                (1, "音楽を", "nhạc", False),
                (2, "聞きながら", "vừa nghe...", True),
                (3, "食事します。", "...vừa dùng bữa.", False),
            ],
        },
        {
            "full_japanese": "毎朝ジョギングをしています。",
            "full_romaji": "Maiasa jogingu o shite imasu.",
            "full_vietnamese": "Mỗi sáng tôi đều chạy bộ.",
            "chunks": [
                (1, "毎朝", "mỗi sáng", False),
                (2, "ジョギングを", "việc chạy bộ", False),
                (3, "しています。", "đang làm (thói quen lặp lại)", True),
            ],
        },
        {
            "full_japanese": "鈴木さんは英語もわかるし、中国語もわかります。",
            "full_romaji": "Suzuki-san wa Eigo mo wakaru shi, Chuugokugo mo wakarimasu.",
            "full_vietnamese": "Anh Suzuki hiểu cả tiếng Anh lẫn tiếng Trung.",
            "chunks": [
                (1, "鈴木さんは", "anh Suzuki thì", False),
                (2, "英語もわかるし、", "vừa hiểu tiếng Anh,", True),
                (3, "中国語も", "tiếng Trung cũng", False),
                (4, "わかります。", "hiểu.", False),
            ],
        },
        {
            "full_japanese": "この店は安いし、おいしいし、いつも人が多いです。",
            "full_romaji": "Kono mise wa yasui shi, oishii shi, itsumo hito ga ooi desu.",
            "full_vietnamese": "Cửa hàng này vừa rẻ, vừa ngon nên lúc nào cũng đông khách.",
            "chunks": [
                (1, "この店は", "cửa hàng này thì", False),
                (2, "安いし、", "vừa rẻ,", True),
                (3, "おいしいし、", "vừa ngon,", True),
                (4, "いつも", "lúc nào cũng", False),
                (5, "人が多いです。", "đông người.", False),
            ],
        },
        {
            "full_japanese": "母は働きながら日本語を勉強しています。",
            "full_romaji": "Haha wa hatarakinagara Nihongo o benkyou shite imasu.",
            "full_vietnamese": "Mẹ tôi vừa đi làm vừa học tiếng Nhật.",
            "chunks": [
                (1, "母は", "mẹ tôi thì", False),
                (2, "働きながら", "vừa làm việc", True),
                (3, "日本語を", "tiếng Nhật", False),
                (4, "勉強しています。", "đang học / học thường xuyên", False),
            ],
        },
        {
            "full_japanese": "兄は毎週ダンス教室に通っています。",
            "full_romaji": "Ani wa maishuu dansu kyoushitsu ni kayotte imasu.",
            "full_vietnamese": "Anh trai tôi hằng tuần đều đi học lớp nhảy.",
            "chunks": [
                (1, "兄は", "anh trai tôi thì", False),
                (2, "毎週", "mỗi tuần", False),
                (3, "ダンス教室に", "đến lớp nhảy", False),
                (4, "通っています。", "đi học/đi lại thường xuyên", True),
            ],
        },
        {
            "full_japanese": "この番組はおもしろいし、勉強にもなります。",
            "full_romaji": "Kono bangumi wa omoshiroi shi, benkyou ni mo narimasu.",
            "full_vietnamese": "Chương trình này vừa thú vị, lại còn có ích cho việc học.",
            "chunks": [
                (1, "この番組は", "chương trình này thì", False),
                (2, "おもしろいし、", "vừa thú vị,", True),
                (3, "勉強にも", "cũng cho việc học", False),
                (4, "なります。", "trở thành/có ích", False),
            ],
        },
        {
            "full_japanese": "娘は歌も上手だし、踊りも上手です。",
            "full_romaji": "Musume wa uta mo jouzu da shi, odori mo jouzu desu.",
            "full_vietnamese": "Con gái tôi hát cũng giỏi mà nhảy cũng giỏi.",
            "chunks": [
                (1, "娘は", "con gái tôi thì", False),
                (2, "歌も上手だし、", "hát cũng giỏi,", True),
                (3, "踊りも", "nhảy cũng", False),
                (4, "上手です。", "giỏi.", False),
            ],
        },
        {
            "full_japanese": "給料もいいし、休みも多いです。",
            "full_romaji": "Kyuuryou mo ii shi, yasumi mo ooi desu.",
            "full_vietnamese": "Lương cũng tốt, ngày nghỉ cũng nhiều.",
            "chunks": [
                (1, "給料も", "lương cũng", False),
                (2, "いいし、", "tốt,", True),
                (3, "休みも", "ngày nghỉ cũng", False),
                (4, "多いです。", "nhiều.", False),
            ],
        },
        {
            "full_japanese": "ガムをかみながら話さないでください。",
            "full_romaji": "Gamu o kaminagara hanasanaide kudasai.",
            "full_vietnamese": "Xin đừng vừa nhai kẹo cao su vừa nói chuyện.",
            "chunks": [
                (1, "ガムを", "kẹo cao su", False),
                (2, "かみながら", "vừa nhai", True),
                (3, "話さないで", "đừng nói chuyện", False),
                (4, "ください。", "xin hãy", False),
            ],
        },
    ],
    29: [
        {
            "full_japanese": "ドアが開いています。",
            "full_romaji": "Doa ga aite imasu.",
            "full_vietnamese": "Cửa đang mở.",
            "chunks": [
                (1, "ドアが", "cửa (tự động từ)", False),
                (2, "開いています。", "đang mở (trạng thái)", True),
            ],
        },
        {
            "full_japanese": "このパソコンは壊れています。",
            "full_romaji": "Kono pasokon wa kowarete imasu.",
            "full_vietnamese": "Cái máy tính này đang bị hỏng.",
            "chunks": [
                (1, "このパソコンは", "cái máy tính này thì", False),
                (2, "壊れています。", "đang bị hỏng (trạng thái)", True),
            ],
        },
        {
            "full_japanese": "電車に傘を忘れてしまいました。",
            "full_romaji": "Densha ni kasa o wasurete shimaimashita.",
            "full_vietnamese": "Tôi đã lỡ để quên ô trên tàu điện rồi.",
            "chunks": [
                (1, "電車に", "ở trên tàu điện", False),
                (2, "傘を", "chiếc ô", False),
                (3, "忘れてしまいました。", "đã lỡ để quên mất rồi (sự tiếc nuối)", True),
            ],
        },
        {
            "full_japanese": "漢字の宿題はもうやってしまいました。",
            "full_romaji": "Kanji no shukudai wa mou yatte shimaimashita.",
            "full_vietnamese": "Tôi đã làm xong hết bài tập Hán tự rồi.",
            "chunks": [
                (1, "漢字の宿題は", "bài tập Hán tự thì", False),
                (2, "もう", "đã... rồi", False),
                (3, "やってしまいました。", "làm xong hết rồi (hoàn thành triệt để)", True),
            ],
        },
        {
            "full_japanese": "窓が閉まっています。",
            "full_romaji": "Mado ga shimatte imasu.",
            "full_vietnamese": "Cửa sổ đang đóng.",
            "chunks": [
                (1, "窓が", "cửa sổ (tự động từ)", False),
                (2, "閉まっています。", "đang đóng (trạng thái)", True),
            ],
        },
        {
            "full_japanese": "電気が消えています。",
            "full_romaji": "Denki ga kiete imasu.",
            "full_vietnamese": "Đèn đang tắt.",
            "chunks": [
                (1, "電気が", "đèn", False),
                (2, "消えています。", "đang tắt (trạng thái)", True),
            ],
        },
        {
            "full_japanese": "このコップは割れています。",
            "full_romaji": "Kono koppu wa warete imasu.",
            "full_vietnamese": "Cái cốc này bị vỡ.",
            "chunks": [
                (1, "このコップは", "cái cốc này thì", False),
                (2, "割れています。", "đang bị vỡ", True),
            ],
        },
        {
            "full_japanese": "かばんのボタンが外れています。",
            "full_romaji": "Kaban no botan ga hazurete imasu.",
            "full_vietnamese": "Nút của cái cặp bị bung ra.",
            "chunks": [
                (1, "かばんのボタンが", "nút của cái cặp", False),
                (2, "外れています。", "bị tuột/bung", True),
            ],
        },
        {
            "full_japanese": "財布をどこかに落としてしまいました。",
            "full_romaji": "Saifu o dokoka ni otoshite shimaimashita.",
            "full_vietnamese": "Tôi lỡ đánh rơi ví ở đâu đó mất rồi.",
            "chunks": [
                (1, "財布を", "ví", False),
                (2, "どこかに", "ở đâu đó", False),
                (3, "落としてしまいました。", "đã lỡ đánh rơi mất rồi", True),
            ],
        },
        {
            "full_japanese": "レポートを全部書いてしまいました。",
            "full_romaji": "Repooto o zenbu kaite shimaimashita.",
            "full_vietnamese": "Tôi đã viết xong toàn bộ báo cáo rồi.",
            "chunks": [
                (1, "レポートを", "báo cáo", False),
                (2, "全部", "toàn bộ", False),
                (3, "書いてしまいました。", "đã viết xong hết", True),
            ],
        },
    ],
    30: [
        {
            "full_japanese": "壁にカレンダーが張ってあります。",
            "full_romaji": "Kabe ni karendaa ga hatte arimasu.",
            "full_vietnamese": "Trên tường có dán tờ lịch.",
            "chunks": [
                (1, "壁に", "trên tường", False),
                (2, "カレンダーが", "tờ lịch", False),
                (3, "張ってあります。", "được dán sẵn (trạng thái có chủ đích)", True),
            ],
        },
        {
            "full_japanese": "パスポートは引き出しの中にしまってあります。",
            "full_romaji": "Pasupooto wa hikidashi no naka ni shimatte arimasu.",
            "full_vietnamese": "Hộ chiếu đã được cất ở trong ngăn kéo.",
            "chunks": [
                (1, "パスポートは", "hộ chiếu thì", False),
                (2, "引き出しの中に", "ở trong ngăn kéo", False),
                (3, "しまってあります。", "được cất sẵn", True),
            ],
        },
        {
            "full_japanese": "旅行の前に、切符を買っておきます。",
            "full_romaji": "Ryokou no mae ni, kippu o katte okimasu.",
            "full_vietnamese": "Trước khi đi du lịch, tôi sẽ mua sẵn vé.",
            "chunks": [
                (1, "旅行の前に、", "trước chuyến du lịch,", False),
                (2, "切符を", "vé", False),
                (3, "買っておきます。", "tôi sẽ mua sẵn (chuẩn bị trước)", True),
            ],
        },
        {
            "full_japanese": "使ったら、元の所に戻しておいてください。",
            "full_romaji": "Tsukattara, moto no tokoro ni modoshite oite kudasai.",
            "full_vietnamese": "Sau khi dùng xong, xin hãy để lại vị trí cũ.",
            "chunks": [
                (1, "使ったら、", "sau khi dùng xong,", False),
                (2, "元の所に", "về vị trí ban đầu", False),
                (3, "戻しておいてください。", "hãy để lại (như cũ)", True),
            ],
        },
        {
            "full_japanese": "玄関に花が飾ってあります。",
            "full_romaji": "Genkan ni hana ga kazatte arimasu.",
            "full_vietnamese": "Ở cửa ra vào có trang trí hoa.",
            "chunks": [
                (1, "玄関に", "ở cửa ra vào", False),
                (2, "花が", "hoa", False),
                (3, "飾ってあります。", "được trang trí sẵn", True),
            ],
        },
        {
            "full_japanese": "机の上に書類が並べてあります。",
            "full_romaji": "Tsukue no ue ni shorui ga narabete arimasu.",
            "full_vietnamese": "Trên bàn có xếp sẵn tài liệu.",
            "chunks": [
                (1, "机の上に", "trên bàn", False),
                (2, "書類が", "tài liệu", False),
                (3, "並べてあります。", "được xếp sẵn", True),
            ],
        },
        {
            "full_japanese": "会議の前に資料をコピーしておきます。",
            "full_romaji": "Kaigi no mae ni shiryou o kopi shite okimasu.",
            "full_vietnamese": "Trước cuộc họp, tôi sẽ photo sẵn tài liệu.",
            "chunks": [
                (1, "会議の前に", "trước cuộc họp", False),
                (2, "資料を", "tài liệu", False),
                (3, "コピーしておきます。", "photo sẵn", True),
            ],
        },
        {
            "full_japanese": "授業の前に予習しておいてください。",
            "full_romaji": "Jugyou no mae ni yoshuu shite oite kudasai.",
            "full_vietnamese": "Trước giờ học, xin hãy chuẩn bị bài trước.",
            "chunks": [
                (1, "授業の前に", "trước giờ học", False),
                (2, "予習して", "chuẩn bị bài trước", False),
                (3, "おいてください。", "hãy làm sẵn", True),
            ],
        },
        {
            "full_japanese": "予定はまだ決めてありません。",
            "full_romaji": "Yotei wa mada kimete arimasen.",
            "full_vietnamese": "Lịch trình vẫn chưa được quyết định sẵn.",
            "chunks": [
                (1, "予定は", "lịch trình thì", False),
                (2, "まだ", "vẫn chưa", False),
                (3, "決めてありません。", "chưa được quyết định sẵn", True),
            ],
        },
        {
            "full_japanese": "窓はそのままにしておいてください。",
            "full_romaji": "Mado wa sono mama ni shite oite kudasai.",
            "full_vietnamese": "Xin cứ để cửa sổ nguyên như vậy.",
            "chunks": [
                (1, "窓は", "cửa sổ thì", False),
                (2, "そのままにして", "để nguyên như vậy", True),
                (3, "おいてください。", "xin hãy giữ sẵn", False),
            ],
        },
    ]
}

LESSON_PASSAGES = {
    26: [
        {
            "title": "どうして遅れたんですか — Tại sao lại muộn?",
            "content": [
                {"text": "すみません、", "meaning": "Xin lỗi,"},
                {"text": "遅れました。", "meaning": "tôi đến muộn."},
                {"text": "どうして", "meaning": "Tại sao"},
                {"text": "遅れたんですか。", "meaning": "bạn lại đến muộn vậy?", "note": "Dùng んですか để hỏi lý do một cách quan tâm hoặc căn vặn."},
                {"text": "実は、", "meaning": "Thực ra là,"},
                {"text": "バスが", "meaning": "xe buýt"},
                {"text": "来なかったんです。", "meaning": "đã không đến.", "note": "Dùng んです để giải thích lý do một cách mềm mỏng."},
            ],
        },
        {
            "title": "ごみの出し方 — Cách đổ rác",
            "content": [
                {"text": "すみません、", "meaning": "Xin lỗi,"},
                {"text": "ごみを", "meaning": "rác"},
                {"text": "出したいんですが、", "meaning": "tôi muốn mang ra/đổ rác,", "note": "たいんですが dùng để mở lời trước khi hỏi hoặc nhờ."},
                {"text": "どこに", "meaning": "ở đâu"},
                {"text": "出したらいいですか。", "meaning": "thì nên mang ra?", "note": "Vたらいいですか dùng khi xin lời khuyên nên làm gì."},
                {"text": "月・水・金の朝、", "meaning": "Sáng thứ Hai, Tư, Sáu,"},
                {"text": "置き場に", "meaning": "ở nơi để rác"},
                {"text": "出してください。", "meaning": "hãy mang ra."},
            ],
        },
    ],
    27: [
        {
            "title": "何ができますか — Bạn có thể làm gì?",
            "content": [
                {"text": "日本語の", "meaning": "Của tiếng Nhật"},
                {"text": "新聞が", "meaning": "tờ báo"},
                {"text": "読めますか。", "meaning": "bạn có thể đọc được không?", "note": "読めます là thể khả năng của 読みます. Trợ từ を chuyển thành が."},
                {"text": "いいえ、", "meaning": "Không,"},
                {"text": "漢字が", "meaning": "Hán tự"},
                {"text": "むずかしいですから、", "meaning": "vì khó nên,"},
                {"text": "まだ読めません。", "meaning": "tôi vẫn chưa thể đọc được."},
            ],
        },
        {
            "title": "窓から見える景色 — Phong cảnh nhìn từ cửa sổ",
            "content": [
                {"text": "この部屋から", "meaning": "Từ căn phòng này"},
                {"text": "海が", "meaning": "biển"},
                {"text": "見えます。", "meaning": "có thể nhìn thấy.", "note": "見えます là khả năng nhìn thấy tự nhiên do điều kiện bên ngoài."},
                {"text": "夜は", "meaning": "Ban đêm thì"},
                {"text": "波の音も", "meaning": "cả tiếng sóng"},
                {"text": "聞こえます。", "meaning": "có thể nghe thấy."},
                {"text": "でも、", "meaning": "Nhưng,"},
                {"text": "小さい字は", "meaning": "chữ nhỏ thì"},
                {"text": "まだ読めません。", "meaning": "vẫn chưa đọc được."},
            ],
        },
    ],
    28: [
        {
            "title": "休みの日は何をしていますか — Ngày nghỉ bạn thường làm gì?",
            "content": [
                {"text": "休みの日は", "meaning": "Vào ngày nghỉ thì"},
                {"text": "いつも", "meaning": "lúc nào cũng"},
                {"text": "何を", "meaning": "cái gì"},
                {"text": "していますか。", "meaning": "bạn thường làm?", "note": "しています dùng để diễn tả thói quen lặp đi lặp lại."},
                {"text": "そうですね。", "meaning": "Để xem nào."},
                {"text": "音楽を", "meaning": "Nhạc"},
                {"text": "聞きながら、", "meaning": "vừa nghe,"},
                {"text": "本を読んだり、", "meaning": "vừa đọc sách, hoặc là"},
                {"text": "掃除したり", "meaning": "hoặc là dọn dẹp"},
                {"text": "しています。", "meaning": "tôi thường làm (những việc như vậy)."},
            ],
        },
        {
            "title": "いい会社 — Công ty tốt",
            "content": [
                {"text": "この会社は", "meaning": "Công ty này thì"},
                {"text": "給料もいいし、", "meaning": "lương cũng tốt,", "note": "し liệt kê một lý do hoặc đặc điểm, gợi ý còn lý do khác."},
                {"text": "休みも多いし、", "meaning": "ngày nghỉ cũng nhiều,"},
                {"text": "働きやすいです。", "meaning": "dễ làm việc."},
                {"text": "社員は", "meaning": "Nhân viên thì"},
                {"text": "音楽を聞きながら", "meaning": "vừa nghe nhạc"},
                {"text": "仕事をしてもいいです。", "meaning": "cũng được làm việc."},
            ],
        },
    ],
    29: [
        {
            "title": "忘れ物 — Đồ bỏ quên",
            "content": [
                {"text": "あ、", "meaning": "Á,"},
                {"text": "しまった！", "meaning": "chết rồi!"},
                {"text": "どうしたんですか。", "meaning": "Có chuyện gì vậy?"},
                {"text": "電車に", "meaning": "Trên tàu điện"},
                {"text": "傘を", "meaning": "chiếc ô"},
                {"text": "忘れてしまいました。", "meaning": "tôi đã lỡ để quên mất rồi.", "note": "てしまいました thể hiện sự tiếc nuối, hối hận."},
                {"text": "それは", "meaning": "Việc đó thì"},
                {"text": "たいへんですね。", "meaning": "thật gay go nhỉ."},
            ],
        },
        {
            "title": "壊れている物 — Đồ bị hỏng",
            "content": [
                {"text": "この部屋は", "meaning": "Căn phòng này thì"},
                {"text": "ドアが", "meaning": "cửa"},
                {"text": "開いています。", "meaning": "đang mở.", "note": "Tự động từ + ています diễn tả trạng thái."},
                {"text": "でも、", "meaning": "Nhưng,"},
                {"text": "窓は", "meaning": "cửa sổ thì"},
                {"text": "閉まっています。", "meaning": "đang đóng."},
                {"text": "机の上のコップは", "meaning": "Cái cốc trên bàn thì"},
                {"text": "割れてしまいました。", "meaning": "đã lỡ bị vỡ mất rồi.", "note": "てしまいました có sắc thái tiếc nuối."},
            ],
        },
    ],
    30: [
        {
            "title": "旅行の準備 — Chuẩn bị du lịch",
            "content": [
                {"text": "来週の旅行の", "meaning": "Của chuyến du lịch tuần sau"},
                {"text": "ホテルは", "meaning": "khách sạn thì"},
                {"text": "もう", "meaning": "đã"},
                {"text": "予約してありますか。", "meaning": "được đặt sẵn chưa?", "note": "てあります diễn tả trạng thái của sự vật sau khi ai đó đã tác động vào có mục đích."},
                {"text": "はい、", "meaning": "Vâng,"},
                {"text": "もう", "meaning": "đã"},
                {"text": "予約してあります。", "meaning": "được đặt sẵn rồi."},
                {"text": "じゃ、", "meaning": "Vậy thì,"},
                {"text": "旅行の前に、", "meaning": "trước chuyến du lịch,"},
                {"text": "ガイドブックを", "meaning": "sách hướng dẫn"},
                {"text": "買っておきます。", "meaning": "tôi sẽ mua sẵn.", "note": "ておきます diễn tả việc chuẩn bị trước một hành động nào đó."},
            ],
        },
        {
            "title": "教室の準備 — Chuẩn bị lớp học",
            "content": [
                {"text": "教室の壁に", "meaning": "Trên tường lớp học"},
                {"text": "ポスターが", "meaning": "áp phích"},
                {"text": "張ってあります。", "meaning": "được dán sẵn.", "note": "てあります diễn tả trạng thái có chủ đích sau khi ai đó làm."},
                {"text": "机の上には", "meaning": "Trên bàn thì"},
                {"text": "資料が", "meaning": "tài liệu"},
                {"text": "並べてあります。", "meaning": "được xếp sẵn."},
                {"text": "授業の前に", "meaning": "Trước giờ học"},
                {"text": "予習しておいてください。", "meaning": "hãy chuẩn bị bài trước.", "note": "ておいてください dùng để yêu cầu chuẩn bị trước."},
            ],
        },
    ],
}
