"""Chunk-based learning content for Minna no Nihongo lessons 6-10."""

from __future__ import annotations


def _sentence(
    japanese: str,
    romaji: str,
    vietnamese: str,
    chunks: list[tuple[str, str, bool]],
) -> dict[str, object]:
    """Build the canonical sentence dictionary and number its chunks."""
    return {
        "full_japanese": japanese,
        "full_romaji": romaji,
        "full_vietnamese": vietnamese,
        "chunks": [
            (index, text, meaning, is_key)
            for index, (text, meaning, is_key) in enumerate(chunks, start=1)
        ],
    }


S = _sentence


LESSON_SENTENCES = {
    6: [
        S("毎朝パンと卵を食べます。", "Maiasa pan to tamago o tabemasu.", "Mỗi sáng tôi ăn bánh mì và trứng.", [("毎朝", "mỗi sáng", False), ("パンと卵を", "bánh mì và trứng", True), ("食べます。", "ăn", False)]),
        S("昼ご飯はレストランで食べます。", "Hirugohan wa resutoran de tabemasu.", "Tôi ăn cơm trưa ở nhà hàng.", [("昼ご飯は", "cơm trưa thì", False), ("レストランで", "tại nhà hàng", True), ("食べます。", "ăn", False)]),
        S("晩ご飯にご飯と肉と野菜を食べます。", "Bangohan ni gohan to niku to yasai o tabemasu.", "Bữa tối tôi ăn cơm, thịt và rau.", [("晩ご飯に", "vào bữa tối", False), ("ご飯と肉と野菜を", "cơm, thịt và rau", True), ("食べます。", "ăn", False)]),
        S("水とお茶を飲みます。牛乳は飲みません。", "Mizu to ocha o nomimasu. Gyuunyuu wa nomimasen.", "Tôi uống nước và trà. Tôi không uống sữa.", [("水とお茶を", "nước và trà", True), ("飲みます。", "uống", False), ("牛乳は", "sữa thì", False), ("飲みません。", "không uống", False)]),
        S("時々ジュースやビールを飲みます。", "Tokidoki juusu ya biiru o nomimasu.", "Thỉnh thoảng tôi uống nước trái cây hoặc bia.", [("時々", "thỉnh thoảng", False), ("ジュースやビールを", "nước trái cây, bia, v.v.", True), ("飲みます。", "uống", False)]),
        S("父はお酒を飲みますが、たばこは吸いません。", "Chichi wa osake o nomimasu ga, tabako wa suimasen.", "Bố tôi uống rượu nhưng không hút thuốc.", [("父はお酒を飲みますが、", "bố uống rượu nhưng", False), ("たばこは", "thuốc lá thì", True), ("吸いません。", "không hút", False)]),
        S("日曜日にうちで映画やビデオを見ます。", "Nichiyoubi ni uchi de eiga ya bideo o mimasu.", "Chủ nhật tôi xem phim và video ở nhà.", [("日曜日に", "vào Chủ nhật", False), ("うちで", "ở nhà", True), ("映画やビデオを見ます。", "xem phim, video, v.v.", False)]),
        S("毎晩CDを聞きます。", "Maiban shiidii o kikimasu.", "Mỗi tối tôi nghe đĩa CD.", [("毎晩", "mỗi tối", False), ("CDを", "đĩa CD", True), ("聞きます。", "nghe", False)]),
        S("朝、新聞を読みます。それから本を読みます。", "Asa, shinbun o yomimasu. Sorekara hon o yomimasu.", "Buổi sáng tôi đọc báo. Sau đó tôi đọc sách.", [("朝、新聞を", "buổi sáng, báo", True), ("読みます。", "đọc", False), ("それから", "sau đó", False), ("本を読みます。", "đọc sách", False)]),
        S("図書館で手紙とレポートを書きます。", "Toshokan de tegami to repooto o kakimasu.", "Tôi viết thư và báo cáo ở thư viện.", [("図書館で", "tại thư viện", True), ("手紙とレポートを", "thư và báo cáo", False), ("書きます。", "viết", False)]),
        S("店で魚と果物を買います。", "Mise de sakana to kudamono o kaimasu.", "Tôi mua cá và trái cây ở cửa hàng.", [("店で", "tại cửa hàng", False), ("魚と果物を", "cá và trái cây", True), ("買います。", "mua", False)]),
        S("庭で家族の写真を撮ります。", "Niwa de kazoku no shashin o torimasu.", "Tôi chụp ảnh gia đình ở sân vườn.", [("庭で", "tại sân vườn", True), ("家族の写真を", "ảnh gia đình", False), ("撮ります。", "chụp", False)]),
        S("土曜日に友達とテニスをします。", "Doyoubi ni tomodachi to tenisu o shimasu.", "Thứ Bảy tôi chơi quần vợt cùng bạn.", [("土曜日に", "vào thứ Bảy", False), ("友達と", "cùng bạn", False), ("テニスを", "quần vợt", True), ("します。", "chơi", False)]),
        S("公園でサッカーをします。", "Kouen de sakkaa o shimasu.", "Tôi chơi bóng đá ở công viên.", [("公園で", "tại công viên", True), ("サッカーを", "bóng đá", False), ("します。", "chơi", False)]),
        S("毎日うちで宿題をします。", "Mainichi uchi de shukudai o shimasu.", "Hằng ngày tôi làm bài tập ở nhà.", [("毎日", "hằng ngày", False), ("うちで", "ở nhà", False), ("宿題を", "bài tập", True), ("します。", "làm", False)]),
        S("日曜日に公園でお花見をします。", "Nichiyoubi ni kouen de ohanami o shimasu.", "Chủ nhật tôi ngắm hoa anh đào ở công viên.", [("日曜日に", "vào Chủ nhật", False), ("公園で", "tại công viên", False), ("お花見をします。", "ngắm hoa anh đào", True)]),
        S("あした何をしますか。", "Ashita nani o shimasu ka.", "Ngày mai bạn làm gì?", [("あした", "ngày mai", False), ("何を", "làm gì", True), ("しますか。", "sẽ làm?", False)]),
        S("いっしょに昼ご飯を食べませんか。", "Issho ni hirugohan o tabemasen ka.", "Bạn cùng ăn trưa nhé?", [("いっしょに", "cùng nhau", False), ("昼ご飯を", "cơm trưa", False), ("食べませんか。", "cùng ăn nhé?", True)]),
        S("ちょっと休みましょう。", "Chotto yasumimashou.", "Chúng ta nghỉ một chút nhé.", [("ちょっと", "một chút", False), ("休みましょう。", "cùng nghỉ nhé", True)]),
        S("いつも駅で友達に会います。", "Itsumo eki de tomodachi ni aimasu.", "Tôi luôn gặp bạn ở nhà ga.", [("いつも", "luôn luôn", False), ("駅で", "tại nhà ga", False), ("友達に", "với bạn", True), ("会います。", "gặp", False)]),
        S("きょうはいっしょに映画を見ましょう。", "Kyou wa issho ni eiga o mimashou.", "Hôm nay chúng ta cùng xem phim nhé.", [("きょうは", "hôm nay thì", False), ("いっしょに", "cùng nhau", False), ("映画を見ましょう。", "cùng xem phim nhé", True)]),
        S("いいですね。じゃ、またあした。", "Ii desu ne. Ja, mata ashita.", "Hay đấy. Vậy hẹn gặp lại ngày mai.", [("いいですね。", "hay đấy nhỉ", True), ("じゃ、", "vậy thì", False), ("またあした。", "hẹn gặp lại ngày mai", False)]),
    ],
    7: [
        S("箸でご飯を食べます。", "Hashi de gohan o tabemasu.", "Tôi ăn cơm bằng đũa.", [("箸で", "bằng đũa", True), ("ご飯を", "cơm", False), ("食べます。", "ăn", False)]),
        S("スプーンでカレーを食べます。", "Supuun de karee o tabemasu.", "Tôi ăn cà ri bằng thìa.", [("スプーンで", "bằng thìa", True), ("カレーを", "cà ri", False), ("食べます。", "ăn", False)]),
        S("ナイフで肉を切ります。", "Naifu de niku o kirimasu.", "Tôi cắt thịt bằng dao.", [("ナイフで", "bằng dao", True), ("肉を", "thịt", False), ("切ります。", "cắt", False)]),
        S("はさみで紙を切ります。", "Hasami de kami o kirimasu.", "Tôi cắt giấy bằng kéo.", [("はさみで", "bằng kéo", True), ("紙を", "giấy", False), ("切ります。", "cắt", False)]),
        S("パソコンでレポートを書きます。", "Pasokon de repooto o kakimasu.", "Tôi viết báo cáo bằng máy tính.", [("パソコンで", "bằng máy tính", True), ("レポートを", "báo cáo", False), ("書きます。", "viết", False)]),
        S("携帯で母に電話をかけます。", "Keitai de haha ni denwa o kakemasu.", "Tôi gọi điện cho mẹ bằng điện thoại di động.", [("携帯で", "bằng điện thoại di động", False), ("母に", "cho mẹ", True), ("電話をかけます。", "gọi điện", False)]),
        S("日本語でメールを書きます。", "Nihongo de meeru o kakimasu.", "Tôi viết email bằng tiếng Nhật.", [("日本語で", "bằng tiếng Nhật", True), ("メールを", "email", False), ("書きます。", "viết", False)]),
        S("友達に年賀状を送ります。", "Tomodachi ni nengajou o okurimasu.", "Tôi gửi thiệp năm mới cho bạn.", [("友達に", "cho bạn", True), ("年賀状を", "thiệp năm mới", False), ("送ります。", "gửi", False)]),
        S("これはパンチとホッチキスです。", "Kore wa panchi to hotchikisu desu.", "Đây là dụng cụ bấm lỗ và dập ghim.", [("これは", "đây thì", False), ("パンチとホッチキス", "dụng cụ bấm lỗ và dập ghim", True), ("です。", "là", False)]),
        S("それはセロテープと消しゴムです。", "Sore wa seroteepu to keshigomu desu.", "Đó là băng dính và cục tẩy.", [("それは", "đó thì", False), ("セロテープと消しゴム", "băng dính và cục tẩy", True), ("です。", "là", False)]),
        S("母に花をあげます。", "Haha ni hana o agemasu.", "Tôi tặng hoa cho mẹ.", [("母に", "cho mẹ", True), ("花を", "hoa", False), ("あげます。", "tặng", False)]),
        S("父にシャツをあげました。", "Chichi ni shatsu o agemashita.", "Tôi đã tặng áo sơ mi cho bố.", [("父に", "cho bố", True), ("シャツを", "áo sơ mi", False), ("あげました。", "đã tặng", False)]),
        S("誕生日に友達からプレゼントをもらいました。", "Tanjoubi ni tomodachi kara purezento o moraimashita.", "Vào sinh nhật tôi đã nhận quà từ bạn.", [("誕生日に", "vào sinh nhật", False), ("友達から", "từ bạn", True), ("プレゼントをもらいました。", "đã nhận quà", False)]),
        S("先生に日本のお土産をもらいました。", "Sensei ni Nihon no omiyage o moraimashita.", "Tôi đã nhận quà Nhật từ giáo viên.", [("先生に", "từ giáo viên", True), ("日本のお土産を", "quà Nhật", False), ("もらいました。", "đã nhận", False)]),
        S("父にお金を借ります。", "Chichi ni okane o karimasu.", "Tôi mượn tiền của bố.", [("父に", "từ bố", True), ("お金を", "tiền", False), ("借ります。", "mượn", False)]),
        S("友達に辞書を貸します。", "Tomodachi ni jisho o kashimasu.", "Tôi cho bạn mượn từ điển.", [("友達に", "cho bạn", True), ("辞書を", "từ điển", False), ("貸します。", "cho mượn", False)]),
        S("先生に日本語を習います。", "Sensei ni Nihongo o naraimasu.", "Tôi học tiếng Nhật từ giáo viên.", [("先生に", "từ giáo viên", True), ("日本語を", "tiếng Nhật", False), ("習います。", "học", False)]),
        S("母に英語を教えます。", "Haha ni Eigo o oshiemasu.", "Tôi dạy tiếng Anh cho mẹ.", [("母に", "cho mẹ", True), ("英語を", "tiếng Anh", False), ("教えます。", "dạy", False)]),
        S("もう切符を買いました。", "Mou kippu o kaimashita.", "Tôi đã mua vé rồi.", [("もう", "đã rồi", True), ("切符を", "vé", False), ("買いました。", "đã mua", False)]),
        S("荷物はもう送りましたか。", "Nimotsu wa mou okurimashita ka.", "Bạn đã gửi hành lý chưa?", [("荷物は", "hành lý thì", False), ("もう", "đã... chưa", True), ("送りましたか。", "đã gửi chưa", False)]),
        S("いいえ、まだです。これから送ります。", "Iie, mada desu. Korekara okurimasu.", "Chưa, vẫn chưa. Bây giờ tôi sẽ gửi.", [("いいえ、まだです。", "chưa, vẫn chưa", True), ("これから", "từ bây giờ", False), ("送ります。", "sẽ gửi", False)]),
        S("ごめんください。どうぞお上がりください。", "Gomen kudasai. Douzo oagari kudasai.", "Xin phép có ai ở nhà không? Xin mời vào.", [("ごめんください。", "xin phép có ai ở nhà không", False), ("どうぞ", "xin mời", False), ("お上がりください。", "mời vào nhà", True)]),
        S("コーヒーはいかがですか。いただきます。", "Koohii wa ikaga desu ka. Itadakimasu.", "Bạn dùng cà phê nhé? Tôi xin nhận.", [("コーヒーはいかがですか。", "bạn dùng cà phê nhé", True), ("いただきます。", "tôi xin nhận/dùng", False)]),
    ],
    8: [
        S("ミラーさんはハンサムです。", "Miraa-san wa hansamu desu.", "Anh Miller đẹp trai.", [("ミラーさんは", "anh Miller thì", False), ("ハンサムです。", "đẹp trai", True)]),
        S("奈良はきれいな町です。そして静かです。", "Nara wa kirei na machi desu. Soshite shizuka desu.", "Nara là một thành phố đẹp. Và nơi đó yên tĩnh.", [("奈良は", "Nara thì", False), ("きれいな町です。", "là thành phố đẹp", True), ("そして", "và", False), ("静かです。", "yên tĩnh", False)]),
        S("大阪はにぎやかな町です。そして有名です。", "Oosaka wa nigiyaka na machi desu. Soshite yuumei desu.", "Osaka là một thành phố nhộn nhịp. Và nơi đó nổi tiếng.", [("大阪は", "Osaka thì", False), ("にぎやかな町です。", "là thành phố nhộn nhịp", True), ("そして", "và", False), ("有名です。", "nổi tiếng", False)]),
        S("山田先生は親切です。", "Yamada-sensei wa shinsetsu desu.", "Thầy Yamada tốt bụng.", [("山田先生は", "thầy Yamada thì", False), ("親切です。", "tốt bụng", True)]),
        S("お母さんは元気ですか。", "Okaasan wa genki desu ka.", "Mẹ bạn có khỏe không?", [("お母さんは", "mẹ bạn thì", False), ("元気ですか。", "có khỏe không", True)]),
        S("きょうは暇じゃありません。", "Kyou wa hima ja arimasen.", "Hôm nay tôi không rảnh.", [("きょうは", "hôm nay thì", False), ("暇じゃありません。", "không rảnh", True)]),
        S("東京は大きい町です。", "Toukyou wa ookii machi desu.", "Tokyo là thành phố lớn.", [("東京は", "Tokyo thì", False), ("大きい", "lớn", True), ("町です。", "là thành phố", False)]),
        S("この辞書は小さいです。", "Kono jisho wa chiisai desu.", "Quyển từ điển này nhỏ.", [("この辞書は", "quyển từ điển này thì", False), ("小さいです。", "nhỏ", True)]),
        S("これは新しい車です。", "Kore wa atarashii kuruma desu.", "Đây là chiếc ô tô mới.", [("これは", "đây thì", False), ("新しい", "mới", True), ("車です。", "là ô tô", False)]),
        S("あの車は古いです。", "Ano kuruma wa furui desu.", "Chiếc ô tô kia cũ.", [("あの車は", "chiếc ô tô kia thì", False), ("古いです。", "cũ", True)]),
        S("このカメラはいいです。あのカメラはよくないです。", "Kono kamera wa ii desu. Ano kamera wa yokunai desu.", "Máy ảnh này tốt. Máy ảnh kia không tốt.", [("このカメラはいいです。", "máy ảnh này tốt", False), ("あのカメラは", "máy ảnh kia thì", False), ("よくないです。", "không tốt", True)]),
        S("きょうは暑いですが、北海道は寒いです。", "Kyou wa atsui desu ga, Hokkaidou wa samui desu.", "Hôm nay nóng nhưng Hokkaido lạnh.", [("きょうは暑いですが、", "hôm nay nóng nhưng", True), ("北海道は", "Hokkaido thì", False), ("寒いです。", "lạnh", False)]),
        S("北海道は涼しいです。", "Hokkaidou wa suzushii desu.", "Hokkaido mát mẻ.", [("北海道は", "Hokkaido thì", False), ("涼しいです。", "mát mẻ", True)]),
        S("日本語は難しいですが、おもしろいです。", "Nihongo wa muzukashii desu ga, omoshiroi desu.", "Tiếng Nhật khó nhưng thú vị.", [("日本語は", "tiếng Nhật thì", False), ("難しいですが、", "khó nhưng", True), ("おもしろいです。", "thú vị", False)]),
        S("この本は易しいです。", "Kono hon wa yasashii desu.", "Quyển sách này dễ.", [("この本は", "quyển sách này thì", False), ("易しいです。", "dễ", True)]),
        S("この時計は高いです。あの時計は安いです。", "Kono tokei wa takai desu. Ano tokei wa yasui desu.", "Đồng hồ này đắt. Đồng hồ kia rẻ.", [("この時計は高いです。", "đồng hồ này đắt", True), ("あの時計は", "đồng hồ kia thì", False), ("安いです。", "rẻ", False)]),
        S("富士山は高い山です。", "Fujisan wa takai yama desu.", "Núi Phú Sĩ là ngọn núi cao.", [("富士山は", "núi Phú Sĩ thì", False), ("高い", "cao", True), ("山です。", "là núi", False)]),
        S("この映画はとてもおもしろいです。", "Kono eiga wa totemo omoshiroi desu.", "Bộ phim này rất thú vị.", [("この映画は", "bộ phim này thì", False), ("とても", "rất", True), ("おもしろいです。", "thú vị", False)]),
        S("日本の食べ物はおいしいです。", "Nihon no tabemono wa oishii desu.", "Đồ ăn Nhật ngon.", [("日本の食べ物は", "đồ ăn Nhật thì", False), ("おいしいです。", "ngon", True)]),
        S("毎日忙しいですが、楽しいです。", "Mainichi isogashii desu ga, tanoshii desu.", "Mỗi ngày bận nhưng vui.", [("毎日", "mỗi ngày", False), ("忙しいですが、", "bận nhưng", True), ("楽しいです。", "vui", False)]),
        S("白いシャツと黒い靴を買いました。", "Shiroi shatsu to kuroi kutsu o kaimashita.", "Tôi đã mua áo sơ mi trắng và giày đen.", [("白いシャツと", "áo sơ mi trắng và", True), ("黒い靴を", "giày đen", False), ("買いました。", "đã mua", False)]),
        S("これは赤い花です。あれは青い花です。", "Kore wa akai hana desu. Are wa aoi hana desu.", "Đây là hoa đỏ. Kia là hoa xanh.", [("これは", "đây thì", False), ("赤い花です。", "là hoa đỏ", True), ("あれは", "kia thì", False), ("青い花です。", "là hoa xanh", False)]),
        S("奈良はどんな所ですか。古い所です。そして静かです。", "Nara wa donna tokoro desu ka. Furui tokoro desu. Soshite shizuka desu.", "Nara là nơi như thế nào? Đó là nơi cổ kính. Và nơi đó yên tĩnh.", [("奈良はどんな所ですか。", "Nara là nơi như thế nào", True), ("古い所です。", "là nơi cổ kính", False), ("そして", "và", False), ("静かです。", "yên tĩnh", False)]),
        S("この寮はあまりきれいじゃありません。", "Kono ryou wa amari kirei ja arimasen.", "Ký túc xá này không đẹp lắm.", [("この寮は", "ký túc xá này thì", False), ("あまり", "không... lắm", True), ("きれいじゃありません。", "không đẹp/sạch", False)]),
    ],
}


LESSON_SENTENCES.update(
    {
        9: [
            S("わたしは日本語が分かります。", "Watashi wa Nihongo ga wakarimasu.", "Tôi hiểu tiếng Nhật.", [("わたしは", "tôi thì", False), ("日本語が", "tiếng Nhật", True), ("分かります。", "hiểu", False)]),
            S("マリアさんは英語がよく分かります。", "Maria-san wa Eigo ga yoku wakarimasu.", "Chị Maria hiểu tiếng Anh rất rõ.", [("マリアさんは", "chị Maria thì", False), ("英語が", "tiếng Anh", False), ("よく分かります。", "hiểu rõ", True)]),
            S("漢字が少し分かります。", "Kanji ga sukoshi wakarimasu.", "Tôi hiểu một ít Kanji.", [("漢字が", "Kanji", False), ("少し", "một ít", True), ("分かります。", "hiểu", False)]),
            S("フランス語は全然分かりません。", "Furansugo wa zenzen wakarimasen.", "Tôi hoàn toàn không hiểu tiếng Pháp.", [("フランス語は", "tiếng Pháp thì", False), ("全然", "hoàn toàn không", True), ("分かりません。", "không hiểu", False)]),
            S("わたしは音楽が好きです。", "Watashi wa ongaku ga suki desu.", "Tôi thích âm nhạc.", [("わたしは", "tôi thì", False), ("音楽が", "âm nhạc", True), ("好きです。", "thích", False)]),
            S("田中さんはクラシックが大好きです。", "Tanaka-san wa kurashikku ga daisuki desu.", "Anh Tanaka rất thích nhạc cổ điển.", [("田中さんは", "anh Tanaka thì", False), ("クラシックが", "nhạc cổ điển", False), ("大好きです。", "rất thích", True)]),
            S("妹はジャズがあまり好きじゃありません。", "Imouto wa jazu ga amari suki ja arimasen.", "Em gái tôi không thích nhạc jazz lắm.", [("妹は", "em gái tôi thì", False), ("ジャズが", "nhạc jazz", False), ("あまり好きじゃありません。", "không thích lắm", True)]),
            S("父は野球が好きです。", "Chichi wa yakyuu ga suki desu.", "Bố tôi thích bóng chày.", [("父は", "bố tôi thì", False), ("野球が", "bóng chày", True), ("好きです。", "thích", False)]),
            S("母は料理が上手です。", "Haha wa ryouri ga jouzu desu.", "Mẹ tôi nấu ăn giỏi.", [("母は", "mẹ tôi thì", False), ("料理が", "nấu ăn", False), ("上手です。", "giỏi", True)]),
            S("わたしは歌が下手です。", "Watashi wa uta ga heta desu.", "Tôi hát không giỏi.", [("わたしは", "tôi thì", False), ("歌が", "hát", False), ("下手です。", "không giỏi", True)]),
            S("ミラーさんはカタカナがよく分かります。", "Miraa-san wa katakana ga yoku wakarimasu.", "Anh Miller hiểu Katakana rất rõ.", [("ミラーさんは", "anh Miller thì", False), ("カタカナが", "Katakana", True), ("よく分かります。", "hiểu rõ", False)]),
            S("サントスさんはひらがながだいたい分かります。", "Santosu-san wa hiragana ga daitai wakarimasu.", "Anh Santos hiểu phần lớn Hiragana.", [("サントスさんは", "anh Santos thì", False), ("ひらがなが", "Hiragana", False), ("だいたい分かります。", "hiểu phần lớn", True)]),
            S("日本語のCDがたくさんあります。", "Nihongo no shiidii ga takusan arimasu.", "Tôi có nhiều đĩa CD tiếng Nhật.", [("日本語のCDが", "đĩa CD tiếng Nhật", False), ("たくさん", "nhiều", True), ("あります。", "có", False)]),
            S("コンサートのチケットがあります。", "Konsaato no chiketto ga arimasu.", "Tôi có vé hòa nhạc.", [("コンサートのチケットが", "vé hòa nhạc", True), ("あります。", "có", False)]),
            S("細かいお金が少しあります。", "Komakai okane ga sukoshi arimasu.", "Tôi có một ít tiền lẻ.", [("細かいお金が", "tiền lẻ", False), ("少し", "một ít", True), ("あります。", "có", False)]),
            S("きょうは時間がありません。", "Kyou wa jikan ga arimasen.", "Hôm nay tôi không có thời gian.", [("きょうは", "hôm nay thì", False), ("時間が", "thời gian", True), ("ありません。", "không có", False)]),
            S("あした用事があります。", "Ashita youji ga arimasu.", "Ngày mai tôi có việc bận.", [("あした", "ngày mai", False), ("用事が", "việc bận", True), ("あります。", "có", False)]),
            S("今晩友達と約束があります。", "Konban tomodachi to yakusoku ga arimasu.", "Tối nay tôi có hẹn với bạn.", [("今晩", "tối nay", False), ("友達と", "với bạn", False), ("約束があります。", "có hẹn", True)]),
            S("どうして早く帰りますか。用事がありますから。", "Doushite hayaku kaerimasu ka. Youji ga arimasu kara.", "Tại sao bạn về sớm? Vì tôi có việc bận.", [("どうして早く帰りますか。", "tại sao về sớm", True), ("用事が", "việc bận", False), ("ありますから。", "vì có", False)]),
            S("日本の料理が好きですから、日本へ行きます。", "Nihon no ryouri ga suki desu kara, Nihon e ikimasu.", "Vì thích món Nhật nên tôi đi Nhật.", [("日本の料理が", "món ăn Nhật", False), ("好きですから、", "vì thích", True), ("日本へ", "đến Nhật", False), ("行きます。", "đi", False)]),
            S("カラオケはどうですか。いいですね。", "Karaoke wa dou desu ka. Ii desu ne.", "Đi karaoke thì sao? Hay đấy nhỉ.", [("カラオケはどうですか。", "karaoke thì sao", True), ("いいですね。", "hay đấy nhỉ", False)]),
            S("歌舞伎を見ませんか。ちょっと……。", "Kabuki o mimasen ka. Chotto...", "Bạn đi xem Kabuki không? Tiếc là tôi hơi bận...", [("歌舞伎を", "Kabuki", False), ("見ませんか。", "cùng xem không", True), ("ちょっと……。", "hơi khó/không tiện", False)]),
            S("土曜日コンサートがありますよ。いっしょに行きませんか。", "Doyoubi konsaato ga arimasu yo. Issho ni ikimasen ka.", "Thứ Bảy có hòa nhạc đấy. Bạn cùng đi không?", [("土曜日", "thứ Bảy", False), ("コンサートがありますよ。", "có hòa nhạc đấy", False), ("いっしょに行きませんか。", "cùng đi không", True)]),
            S("残念ですが、きょうはアルバイトがあります。", "Zannen desu ga, kyou wa arubaito ga arimasu.", "Tiếc quá, nhưng hôm nay tôi có việc làm thêm.", [("残念ですが、", "tiếc quá nhưng", True), ("きょうは", "hôm nay thì", False), ("アルバイトがあります。", "có việc làm thêm", False)]),
        ],
        10: [
            S("教室に先生がいます。", "Kyoushitsu ni sensei ga imasu.", "Có giáo viên trong lớp học.", [("教室に", "trong lớp học", True), ("先生が", "giáo viên", False), ("います。", "có/ở", False)]),
            S("ロビーに女の人がいます。", "Robii ni onna no hito ga imasu.", "Có một người phụ nữ ở sảnh.", [("ロビーに", "ở sảnh", False), ("女の人が", "người phụ nữ", True), ("います。", "có/ở", False)]),
            S("公園に男の子と女の子がいます。", "Kouen ni otoko no ko to onna no ko ga imasu.", "Có một bé trai và một bé gái trong công viên.", [("公園に", "trong công viên", False), ("男の子と女の子が", "bé trai và bé gái", True), ("います。", "có/ở", False)]),
            S("うちに犬と猫がいます。", "Uchi ni inu to neko ga imasu.", "Nhà tôi có chó và mèo.", [("うちに", "ở nhà", False), ("犬と猫が", "chó và mèo", True), ("います。", "có/ở", False)]),
            S("机の上に本があります。", "Tsukue no ue ni hon ga arimasu.", "Có quyển sách ở trên bàn.", [("机の上に", "trên bàn", True), ("本が", "quyển sách", False), ("あります。", "có/ở", False)]),
            S("机の下に箱があります。", "Tsukue no shita ni hako ga arimasu.", "Có cái hộp ở dưới bàn.", [("机の下に", "dưới bàn", True), ("箱が", "cái hộp", False), ("あります。", "có/ở", False)]),
            S("箱の中に手紙と写真があります。", "Hako no naka ni tegami to shashin ga arimasu.", "Có thư và ảnh trong hộp.", [("箱の中に", "trong hộp", True), ("手紙と写真が", "thư và ảnh", False), ("あります。", "có", False)]),
            S("いすの隣にかばんがあります。", "Isu no tonari ni kaban ga arimasu.", "Có cái cặp bên cạnh ghế.", [("いすの隣に", "bên cạnh ghế", True), ("かばんが", "cái cặp", False), ("あります。", "có/ở", False)]),
            S("銀行は郵便局の右にあります。", "Ginkou wa yuubinkyoku no migi ni arimasu.", "Ngân hàng ở bên phải bưu điện.", [("銀行は", "ngân hàng thì", False), ("郵便局の右に", "bên phải bưu điện", True), ("あります。", "ở", False)]),
            S("本屋は喫茶店の左にあります。", "Honya wa kissaten no hidari ni arimasu.", "Hiệu sách ở bên trái quán cà phê.", [("本屋は", "hiệu sách thì", False), ("喫茶店の左に", "bên trái quán cà phê", True), ("あります。", "ở", False)]),
            S("コンビニは駅の前にあります。", "Konbini wa eki no mae ni arimasu.", "Cửa hàng tiện lợi ở trước nhà ga.", [("コンビニは", "cửa hàng tiện lợi thì", False), ("駅の前に", "trước nhà ga", True), ("あります。", "ở", False)]),
            S("公園は学校の後ろにあります。", "Kouen wa gakkou no ushiro ni arimasu.", "Công viên ở phía sau trường học.", [("公園は", "công viên thì", False), ("学校の後ろに", "phía sau trường học", True), ("あります。", "ở", False)]),
            S("駅の近くにATMがあります。", "Eki no chikaku ni eetiiemu ga arimasu.", "Có máy ATM ở gần nhà ga.", [("駅の近くに", "gần nhà ga", True), ("ATMが", "máy ATM", False), ("あります。", "có", False)]),
            S("冷蔵庫の中に飲み物があります。", "Reizouko no naka ni nomimono ga arimasu.", "Có đồ uống trong tủ lạnh.", [("冷蔵庫の中に", "trong tủ lạnh", True), ("飲み物が", "đồ uống", False), ("あります。", "có", False)]),
            S("テーブルの上にスイッチと電池があります。", "Teeburu no ue ni suicchi to denchi ga arimasu.", "Có công tắc và pin ở trên bàn.", [("テーブルの上に", "trên bàn", False), ("スイッチと電池が", "công tắc và pin", True), ("あります。", "có", False)]),
            S("ベッドと窓の間に棚があります。", "Beddo to mado no aida ni tana ga arimasu.", "Có cái kệ ở giữa giường và cửa sổ.", [("ベッドと窓の間に", "giữa giường và cửa sổ", True), ("棚が", "cái kệ", False), ("あります。", "có/ở", False)]),
            S("ポストはビルの外にあります。", "Posuto wa biru no soto ni arimasu.", "Hòm thư ở bên ngoài tòa nhà.", [("ポストは", "hòm thư thì", False), ("ビルの外に", "bên ngoài tòa nhà", True), ("あります。", "ở", False)]),
            S("エレベーターはドアの右にあります。", "Erebeetaa wa doa no migi ni arimasu.", "Thang máy ở bên phải cửa ra vào.", [("エレベーターは", "thang máy thì", False), ("ドアの右に", "bên phải cửa", True), ("あります。", "ở", False)]),
            S("あそこに大きい木があります。", "Asoko ni ookii ki ga arimasu.", "Có một cái cây lớn ở đằng kia.", [("あそこに", "ở đằng kia", False), ("大きい木が", "cái cây lớn", True), ("あります。", "có", False)]),
            S("教室にだれがいますか。佐藤先生がいます。", "Kyoushitsu ni dare ga imasu ka. Satou-sensei ga imasu.", "Ai ở trong lớp học? Có thầy Sato.", [("教室に", "trong lớp học", False), ("だれがいますか。", "có ai", True), ("佐藤先生がいます。", "có thầy Sato", False)]),
            S("箱の中に何がありますか。フィルムがあります。", "Hako no naka ni nani ga arimasu ka. Firumu ga arimasu.", "Trong hộp có gì? Có cuộn phim.", [("箱の中に", "trong hộp", False), ("何がありますか。", "có gì", True), ("フィルムがあります。", "có cuộn phim", False)]),
            S("ミラーさんはどこにいますか。会議室にいます。", "Miraa-san wa doko ni imasu ka. Kaigishitsu ni imasu.", "Anh Miller ở đâu? Anh ấy ở phòng họp.", [("ミラーさんは", "anh Miller thì", False), ("どこにいますか。", "ở đâu", True), ("会議室にいます。", "ở phòng họp", False)]),
            S("乗り場はどこにありますか。あのビルの中です。", "Noriba wa doko ni arimasu ka. Ano biru no naka desu.", "Bến đón xe ở đâu? Ở trong tòa nhà kia.", [("乗り場は", "bến đón xe thì", False), ("どこにありますか。", "ở đâu", True), ("あのビルの中です。", "ở trong tòa nhà kia", False)]),
            S("公園に木や花などがあります。", "Kouen ni ki ya hana nado ga arimasu.", "Trong công viên có cây, hoa, v.v.", [("公園に", "trong công viên", False), ("木や花などが", "cây, hoa, v.v.", True), ("あります。", "có", False)]),
        ],
    }
)


LESSON_PASSAGES = {
    6: {
        "title": "いっしょに昼ご飯 — Cùng ăn trưa",
        "content": [
            {"text": "きょうは土曜日です。", "furigana": "きょうはどようびです", "meaning": "Hôm nay là thứ Bảy.", "note": "は đánh dấu chủ đề của câu."},
            {"text": "午前、図書館で日本語を勉強します。", "furigana": "ごぜん、としょかんでにほんごをべんきょうします", "meaning": "Buổi sáng tôi học tiếng Nhật ở thư viện.", "note": "で chỉ địa điểm diễn ra hành động."},
            {"text": "十二時に友達に会います。", "furigana": "じゅうにじにともだちにあいます", "meaning": "Mười hai giờ tôi gặp bạn.", "note": "人に会います dùng に để chỉ người gặp."},
            {"text": "いっしょに昼ご飯を食べます。", "furigana": "いっしょにひるごはんをたべます", "meaning": "Chúng tôi cùng ăn trưa.", "note": "いっしょに nghĩa là cùng nhau."},
            {"text": "レストランで魚と野菜を食べます。", "furigana": "レストランでさかなとやさいをたべます", "meaning": "Chúng tôi ăn cá và rau tại nhà hàng.", "note": "と nối các danh từ được liệt kê đầy đủ."},
            {"text": "それから、喫茶店でコーヒーを飲みます。", "furigana": "それから、きっさてんでコーヒーをのみます", "meaning": "Sau đó chúng tôi uống cà phê ở quán.", "note": "それから nối hai hành động theo trình tự."},
            {"text": "午後はいっしょに映画を見ましょう。", "furigana": "ごごはいっしょにえいがをみましょう", "meaning": "Buổi chiều chúng ta cùng xem phim nhé.", "note": "〜ましょう là lời rủ cùng làm một việc."},
        ],
    },
    7: {
        "title": "友達のうち — Nhà của người bạn",
        "content": [
            {"text": "きょう、友達のうちへ行きます。", "furigana": "きょう、ともだちのうちへいきます", "meaning": "Hôm nay tôi đến nhà bạn.", "note": "へ chỉ đích đến."},
            {"text": "友達のお母さんに花をあげます。", "furigana": "ともだちのおかあさんにはなをあげます", "meaning": "Tôi tặng hoa cho mẹ của bạn.", "note": "人に物をあげます: tặng vật cho người."},
            {"text": "友達から日本のお土産をもらいます。", "furigana": "ともだちからにほんのおみやげをもらいます", "meaning": "Tôi nhận quà Nhật từ người bạn.", "note": "人から物をもらいます: nhận vật từ người."},
            {"text": "箸で日本の料理を食べます。", "furigana": "はしでにほんのりょうりをたべます", "meaning": "Tôi ăn món Nhật bằng đũa.", "note": "道具で biểu thị dụng cụ dùng cho hành động."},
            {"text": "お母さんに料理を習います。", "furigana": "おかあさんにりょうりをならいます", "meaning": "Tôi học nấu ăn từ mẹ của bạn.", "note": "人に習います dùng に chỉ người dạy."},
            {"text": "もう写真を撮りました。", "furigana": "もうしゃしんをとりました", "meaning": "Tôi đã chụp ảnh rồi.", "note": "もう〜ました diễn tả việc đã hoàn tất."},
            {"text": "うちで友達にメールを送ります。", "furigana": "うちでともだちにメールをおくります", "meaning": "Ở nhà tôi gửi email cho bạn.", "note": "人に物を送ります: gửi một vật/nội dung cho người."},
        ],
    },
    8: {
        "title": "奈良はどんな所ですか — Nara là nơi thế nào?",
        "content": [
            {"text": "奈良は古い町です。", "furigana": "ならはふるいまちです", "meaning": "Nara là một thành phố cổ.", "note": "Tính từ い đứng trực tiếp trước danh từ."},
            {"text": "静かな所です。", "furigana": "しずかなところです", "meaning": "Đó là một nơi yên tĩnh.", "note": "Tính từ な thêm な khi đứng trước danh từ."},
            {"text": "きれいなお寺がたくさんあります。", "furigana": "きれいなおてらがたくさんあります", "meaning": "Có nhiều ngôi chùa đẹp.", "note": "きれい là tính từ な dù kết thúc bằng い."},
            {"text": "奈良の食べ物はおいしいです。", "furigana": "ならのたべものはおいしいです", "meaning": "Đồ ăn ở Nara ngon.", "note": "おいしい là tính từ い."},
            {"text": "町はあまりにぎやかじゃありません。", "furigana": "まちはあまりにぎやかじゃありません", "meaning": "Thành phố không nhộn nhịp lắm.", "note": "あまり đi với dạng phủ định: không... lắm."},
            {"text": "でも、とてもきれいです。", "furigana": "でも、とてもきれいです", "meaning": "Nhưng nơi đó rất đẹp.", "note": "とても nhấn mạnh mức độ: rất."},
            {"text": "奈良の旅行は楽しいです。", "furigana": "ならのりょこうはたのしいです", "meaning": "Chuyến du lịch Nara rất vui.", "note": "楽しい mô tả sự vui vẻ, thú vị."},
        ],
    },
    9: {
        "title": "コンサートの約束 — Hẹn đi hòa nhạc",
        "content": [
            {"text": "わたしは音楽が大好きです。", "furigana": "わたしはおんがくがだいすきです", "meaning": "Tôi rất thích âm nhạc.", "note": "Nが好きです dùng が với đối tượng yêu thích."},
            {"text": "特にクラシックが好きです。", "furigana": "とくにクラシックがすきです", "meaning": "Tôi đặc biệt thích nhạc cổ điển.", "note": "好き là tính từ な chỉ sở thích."},
            {"text": "土曜日にコンサートがあります。", "furigana": "どようびにコンサートがあります", "meaning": "Thứ Bảy có một buổi hòa nhạc.", "note": "Nがあります diễn tả có một sự vật/sự kiện."},
            {"text": "コンサートのチケットがあります。", "furigana": "コンサートのチケットがあります", "meaning": "Tôi có vé hòa nhạc.", "note": "Nがあります diễn tả việc có một đồ vật."},
            {"text": "友達もクラシックが好きです。", "furigana": "ともだちもクラシックがすきです", "meaning": "Bạn tôi cũng thích nhạc cổ điển.", "note": "も mang nghĩa cũng."},
            {"text": "ですから、友達といっしょに行きます。", "furigana": "ですから、ともだちといっしょにいきます", "meaning": "Vì vậy tôi đi cùng bạn.", "note": "ですから nêu kết quả sau nguyên nhân."},
            {"text": "友達は日本語がよく分かります。", "furigana": "ともだちはにほんごがよくわかります", "meaning": "Bạn tôi hiểu tiếng Nhật rất rõ.", "note": "よく bổ nghĩa cho 分かります: hiểu rõ."},
        ],
    },
    10: {
        "title": "わたしの部屋 — Phòng của tôi",
        "content": [
            {"text": "わたしの部屋は二階にあります。", "furigana": "わたしのへやはにかいにあります", "meaning": "Phòng của tôi ở tầng hai.", "note": "Vật は nơi にあります diễn tả vị trí của đồ vật."},
            {"text": "部屋の中にベッドと机があります。", "furigana": "へやのなかにベッドとつくえがあります", "meaning": "Trong phòng có giường và bàn học.", "note": "Nơi に vật があります diễn tả sự tồn tại."},
            {"text": "机の上に本や辞書などがあります。", "furigana": "つくえのうえにほんやじしょなどがあります", "meaning": "Trên bàn có sách, từ điển, v.v.", "note": "や〜など liệt kê một vài ví dụ."},
            {"text": "机の隣に小さい棚があります。", "furigana": "つくえのとなりにちいさいたながあります", "meaning": "Bên cạnh bàn có một cái kệ nhỏ.", "note": "隣 chỉ vị trí sát bên."},
            {"text": "棚の中にCDと写真があります。", "furigana": "たなのなかにシーディーとしゃしんがあります", "meaning": "Trong kệ có CD và ảnh.", "note": "中 nghĩa là bên trong."},
            {"text": "窓の前に猫がいます。", "furigana": "まどのまえにねこがいます", "meaning": "Có một con mèo trước cửa sổ.", "note": "います dùng cho người và động vật."},
            {"text": "猫は今ベッドの下にいます。", "furigana": "ねこはいまベッドのしたにいます", "meaning": "Bây giờ con mèo ở dưới giường.", "note": "あります dùng cho đồ vật; います dùng cho sinh vật."},
        ],
    },
}
