/**
 * NihonHan - Japanese Vocabulary Data (Fase 8)
 * 500+ kata Bahasa Jepang, 15 tema
 * Format: { word, reading, romaji, meaning, theme, level, example:{ jp, romaji, id } }
 * level: 'N5' | 'N4' | 'N3'
 */
const JpVocabData = (() => {

  const themes = [
    { id:'greetings',  label:'Salam & Sapaan',   icon:'👋' },
    { id:'family',     label:'Keluarga',          icon:'👨‍👩‍👧‍👦' },
    { id:'food',       label:'Makanan & Minuman', icon:'🍱' },
    { id:'time',       label:'Waktu & Tanggal',   icon:'🕐' },
    { id:'places',     label:'Tempat & Lokasi',   icon:'📍' },
    { id:'transport',  label:'Transportasi',      icon:'🚃' },
    { id:'shopping',   label:'Belanja',           icon:'🛍️' },
    { id:'body',       label:'Tubuh & Kesehatan', icon:'🏥' },
    { id:'school',     label:'Sekolah & Belajar', icon:'📚' },
    { id:'work',       label:'Pekerjaan',         icon:'💼' },
    { id:'nature',     label:'Alam & Cuaca',      icon:'🌸' },
    { id:'colors',     label:'Warna & Bentuk',    icon:'🎨' },
    { id:'numbers',    label:'Angka & Ukuran',    icon:'🔢' },
    { id:'adjectives', label:'Kata Sifat',        icon:'✨' },
    { id:'verbs',      label:'Kata Kerja',        icon:'⚡' },
  ];

  const vocab = [
    // ── Greetings ───────────────────────────────────────────
    { word:'おはよう',     reading:'おはよう',       romaji:'ohayou',         meaning:'selamat pagi (kasual)',     theme:'greetings', level:'N5', example:{ jp:'おはよう！元気？', romaji:'Ohayou! Genki?', id:'Pagi! Apa kabar?' } },
    { word:'おはようございます', reading:'おはようございます', romaji:'ohayou gozaimasu', meaning:'selamat pagi (sopan)', theme:'greetings', level:'N5', example:{ jp:'おはようございます、先生。', romaji:'Ohayou gozaimasu, sensei.', id:'Selamat pagi, Sensei.' } },
    { word:'こんにちは',   reading:'こんにちは',     romaji:'konnichiwa',     meaning:'halo / selamat siang',     theme:'greetings', level:'N5', example:{ jp:'こんにちは、田中さん！', romaji:'Konnichiwa, Tanaka-san!', id:'Halo, Tanaka!' } },
    { word:'こんばんは',   reading:'こんばんは',     romaji:'konbanwa',       meaning:'selamat malam',            theme:'greetings', level:'N5', example:{ jp:'こんばんは、お元気ですか？', romaji:'Konbanwa, o-genki desu ka?', id:'Selamat malam, apa kabar?' } },
    { word:'さようなら',   reading:'さようなら',     romaji:'sayounara',      meaning:'selamat tinggal',          theme:'greetings', level:'N5', example:{ jp:'さようなら、また明日。', romaji:'Sayounara, mata ashita.', id:'Selamat tinggal, sampai besok.' } },
    { word:'またね',       reading:'またね',         romaji:'matane',         meaning:'sampai nanti (kasual)',    theme:'greetings', level:'N5', example:{ jp:'またね！気をつけてね。', romaji:'Matane! Ki wo tsukete ne.', id:'Sampai nanti! Hati-hati.' } },
    { word:'ありがとう',   reading:'ありがとう',     romaji:'arigatou',       meaning:'terima kasih (kasual)',    theme:'greetings', level:'N5', example:{ jp:'ありがとう、助かった！', romaji:'Arigatou, tasukatta!', id:'Terima kasih, kamu menolongku!' } },
    { word:'ありがとうございます', reading:'ありがとうございます', romaji:'arigatou gozaimasu', meaning:'terima kasih (sopan)', theme:'greetings', level:'N5', example:{ jp:'ありがとうございます。', romaji:'Arigatou gozaimasu.', id:'Terima kasih banyak.' } },
    { word:'すみません',   reading:'すみません',     romaji:'sumimasen',      meaning:'maaf / permisi',          theme:'greetings', level:'N5', example:{ jp:'すみません、ちょっと聞いてもいいですか？', romaji:'Sumimasen, chotto kiite mo ii desu ka?', id:'Permisi, boleh saya tanya sebentar?' } },
    { word:'ごめんなさい', reading:'ごめんなさい',   romaji:'gomennasai',     meaning:'maaf (minta maaf)',       theme:'greetings', level:'N5', example:{ jp:'ごめんなさい、遅れました。', romaji:'Gomennasai, okuremashita.', id:'Maaf, saya terlambat.' } },
    { word:'どうぞ',       reading:'どうぞ',         romaji:'douzo',          meaning:'silakan',                 theme:'greetings', level:'N5', example:{ jp:'どうぞ、お座りください。', romaji:'Douzo, o-suwari kudasai.', id:'Silakan duduk.' } },
    { word:'どういたしまして', reading:'どういたしまして', romaji:'dou itashimashite', meaning:'sama-sama',     theme:'greetings', level:'N5', example:{ jp:'「ありがとう。」「どういたしまして。」', romaji:'"Arigatou." "Dou itashimashite."', id:'"Terima kasih." "Sama-sama."' } },
    { word:'はじめまして', reading:'はじめまして',   romaji:'hajimemashite',  meaning:'senang berkenalan',       theme:'greetings', level:'N5', example:{ jp:'はじめまして、山田です。', romaji:'Hajimemashite, Yamada desu.', id:'Senang berkenalan, saya Yamada.' } },
    { word:'よろしく',     reading:'よろしく',       romaji:'yoroshiku',      meaning:'mohon kerja samanya',     theme:'greetings', level:'N5', example:{ jp:'よろしくお願いします。', romaji:'Yoroshiku onegaishimasu.', id:'Mohon kerja samanya.' } },
    { word:'おやすみ',     reading:'おやすみ',       romaji:'oyasumi',        meaning:'selamat tidur',           theme:'greetings', level:'N5', example:{ jp:'おやすみなさい！', romaji:'Oyasumi nasai!', id:'Selamat tidur!' } },
    { word:'いただきます', reading:'いただきます',   romaji:'itadakimasu',    meaning:'sebelum makan',           theme:'greetings', level:'N5', example:{ jp:'いただきます！おいしそう。', romaji:'Itadakimasu! Oishisou.', id:'Selamat makan! Kelihatan enak.' } },
    { word:'ごちそうさま', reading:'ごちそうさま',   romaji:'gochisousama',   meaning:'setelah makan (terima kasih)', theme:'greetings', level:'N5', example:{ jp:'ごちそうさまでした！', romaji:'Gochisousama deshita!', id:'Terima kasih atas makanannya!' } },
    { word:'お元気ですか', reading:'おげんきですか', romaji:'o-genki desu ka', meaning:'apa kabar?',             theme:'greetings', level:'N5', example:{ jp:'お元気ですか？はい、元気です。', romaji:'O-genki desu ka? Hai, genki desu.', id:'Apa kabar? Ya, saya baik.' } },

    // ── Family ──────────────────────────────────────────────
    { word:'家族',   reading:'かぞく',   romaji:'kazoku',    meaning:'keluarga',          theme:'family', level:'N5', example:{ jp:'私の家族は四人です。', romaji:'Watashi no kazoku wa yonin desu.', id:'Keluarga saya ada empat orang.' } },
    { word:'父',     reading:'ちち',     romaji:'chichi',    meaning:'ayah (bicara sendiri)', theme:'family', level:'N5', example:{ jp:'父は医者です。', romaji:'Chichi wa isha desu.', id:'Ayah saya adalah dokter.' } },
    { word:'母',     reading:'はは',     romaji:'haha',      meaning:'ibu (bicara sendiri)', theme:'family', level:'N5', example:{ jp:'母は料理が上手です。', romaji:'Haha wa ryouri ga jouzu desu.', id:'Ibu saya pandai memasak.' } },
    { word:'お父さん', reading:'おとうさん', romaji:'otousan', meaning:'ayah (berbicara ke orang lain)', theme:'family', level:'N5', example:{ jp:'お父さんはどこですか？', romaji:'Otousan wa doko desu ka?', id:'Di mana ayahmu?' } },
    { word:'お母さん', reading:'おかあさん', romaji:'okaasan', meaning:'ibu (berbicara ke orang lain)', theme:'family', level:'N5', example:{ jp:'お母さんはきれいですね。', romaji:'Okaasan wa kirei desu ne.', id:'Ibumu cantik ya.' } },
    { word:'兄',     reading:'あに',     romaji:'ani',       meaning:'kakak laki-laki',    theme:'family', level:'N5', example:{ jp:'兄は大学生です。', romaji:'Ani wa daigakusei desu.', id:'Kakak laki-laki saya mahasiswa.' } },
    { word:'姉',     reading:'あね',     romaji:'ane',       meaning:'kakak perempuan',    theme:'family', level:'N5', example:{ jp:'姉は結婚しています。', romaji:'Ane wa kekkon shite imasu.', id:'Kakak perempuan saya sudah menikah.' } },
    { word:'弟',     reading:'おとうと', romaji:'otouto',    meaning:'adik laki-laki',     theme:'family', level:'N5', example:{ jp:'弟は十歳です。', romaji:'Otouto wa jussai desu.', id:'Adik laki-laki saya 10 tahun.' } },
    { word:'妹',     reading:'いもうと', romaji:'imouto',    meaning:'adik perempuan',     theme:'family', level:'N5', example:{ jp:'妹はかわいいです。', romaji:'Imouto wa kawaii desu.', id:'Adik perempuan saya lucu.' } },
    { word:'祖父',   reading:'そふ',     romaji:'sofu',      meaning:'kakek',              theme:'family', level:'N4', example:{ jp:'祖父は八十歳です。', romaji:'Sofu wa hachijussai desu.', id:'Kakek saya 80 tahun.' } },
    { word:'祖母',   reading:'そぼ',     romaji:'sobo',      meaning:'nenek',              theme:'family', level:'N4', example:{ jp:'祖母の手料理が好きです。', romaji:'Sobo no teryouri ga suki desu.', id:'Saya suka masakan tangan nenek.' } },
    { word:'子供',   reading:'こども',   romaji:'kodomo',    meaning:'anak-anak',          theme:'family', level:'N5', example:{ jp:'子供が二人います。', romaji:'Kodomo ga futari imasu.', id:'Saya punya dua anak.' } },
    { word:'夫',     reading:'おっと',   romaji:'otto',      meaning:'suami',              theme:'family', level:'N4', example:{ jp:'夫は会社員です。', romaji:'Otto wa kaishain desu.', id:'Suami saya karyawan.' } },
    { word:'妻',     reading:'つま',     romaji:'tsuma',     meaning:'istri',              theme:'family', level:'N4', example:{ jp:'妻は先生です。', romaji:'Tsuma wa sensei desu.', id:'Istri saya guru.' } },
    { word:'友達',   reading:'ともだち', romaji:'tomodachi', meaning:'teman',              theme:'family', level:'N5', example:{ jp:'友達とご飯を食べました。', romaji:'Tomodachi to gohan wo tabemashita.', id:'Makan bersama teman.' } },

    // ── Food ────────────────────────────────────────────────
    { word:'ご飯',   reading:'ごはん',   romaji:'gohan',     meaning:'nasi / makan',        theme:'food', level:'N5', example:{ jp:'ご飯を食べましょう。', romaji:'Gohan wo tabemashou.', id:'Mari makan nasi.' } },
    { word:'パン',   reading:'パン',     romaji:'pan',       meaning:'roti',                theme:'food', level:'N5', example:{ jp:'朝ごはんにパンを食べます。', romaji:'Asagohan ni pan wo tabemasu.', id:'Saya makan roti untuk sarapan.' } },
    { word:'魚',     reading:'さかな',   romaji:'sakana',    meaning:'ikan',                theme:'food', level:'N5', example:{ jp:'魚が好きですか？', romaji:'Sakana ga suki desu ka?', id:'Apakah kamu suka ikan?' } },
    { word:'肉',     reading:'にく',     romaji:'niku',      meaning:'daging',              theme:'food', level:'N5', example:{ jp:'肉は毎日食べます。', romaji:'Niku wa mainichi tabemasu.', id:'Saya makan daging setiap hari.' } },
    { word:'野菜',   reading:'やさい',   romaji:'yasai',     meaning:'sayuran',             theme:'food', level:'N5', example:{ jp:'野菜を食べてください。', romaji:'Yasai wo tabete kudasai.', id:'Tolong makan sayurannya.' } },
    { word:'果物',   reading:'くだもの', romaji:'kudamono',  meaning:'buah-buahan',         theme:'food', level:'N5', example:{ jp:'果物は体にいいです。', romaji:'Kudamono wa karada ni ii desu.', id:'Buah-buahan baik untuk tubuh.' } },
    { word:'水',     reading:'みず',     romaji:'mizu',      meaning:'air',                 theme:'food', level:'N5', example:{ jp:'水を一杯ください。', romaji:'Mizu wo ippai kudasai.', id:'Tolong satu gelas air.' } },
    { word:'お茶',   reading:'おちゃ',   romaji:'ocha',      meaning:'teh',                 theme:'food', level:'N5', example:{ jp:'お茶を飲みますか？', romaji:'Ocha wo nomimasu ka?', id:'Apakah kamu minum teh?' } },
    { word:'コーヒー', reading:'コーヒー', romaji:'koohii',  meaning:'kopi',                theme:'food', level:'N5', example:{ jp:'毎朝コーヒーを飲みます。', romaji:'Maiasa koohii wo nomimasu.', id:'Setiap pagi saya minum kopi.' } },
    { word:'牛乳',   reading:'ぎゅうにゅう', romaji:'gyuunyuu', meaning:'susu sapi',       theme:'food', level:'N5', example:{ jp:'牛乳は骨にいいです。', romaji:'Gyuunyuu wa hone ni ii desu.', id:'Susu sapi baik untuk tulang.' } },
    { word:'ラーメン', reading:'ラーメン', romaji:'raamen',  meaning:'ramen',               theme:'food', level:'N5', example:{ jp:'ラーメンが大好きです。', romaji:'Raamen ga daisuki desu.', id:'Saya sangat suka ramen.' } },
    { word:'寿司',   reading:'すし',     romaji:'sushi',     meaning:'sushi',               theme:'food', level:'N5', example:{ jp:'寿司を食べたいです。', romaji:'Sushi wo tabetai desu.', id:'Saya ingin makan sushi.' } },
    { word:'天ぷら', reading:'てんぷら', romaji:'tenpura',   meaning:'tempura',             theme:'food', level:'N4', example:{ jp:'天ぷらが好きです。', romaji:'Tenpura ga suki desu.', id:'Saya suka tempura.' } },
    { word:'うどん', reading:'うどん',   romaji:'udon',      meaning:'udon (mie tebal)',    theme:'food', level:'N5', example:{ jp:'うどんは温かいです。', romaji:'Udon wa atatakai desu.', id:'Udon itu hangat.' } },
    { word:'おにぎり', reading:'おにぎり', romaji:'onigiri', meaning:'nasi kepal',          theme:'food', level:'N4', example:{ jp:'コンビニでおにぎりを買いました。', romaji:'Konbini de onigiri wo kaimashita.', id:'Saya beli nasi kepal di convenience store.' } },
    { word:'卵',     reading:'たまご',   romaji:'tamago',    meaning:'telur',               theme:'food', level:'N5', example:{ jp:'卵を二個使ってください。', romaji:'Tamago wo niko tsukatte kudasai.', id:'Tolong gunakan dua butir telur.' } },
    { word:'塩',     reading:'しお',     romaji:'shio',      meaning:'garam',               theme:'food', level:'N4', example:{ jp:'塩を少し入れてください。', romaji:'Shio wo sukoshi irete kudasai.', id:'Tolong masukkan sedikit garam.' } },
    { word:'砂糖',   reading:'さとう',   romaji:'satou',     meaning:'gula',                theme:'food', level:'N4', example:{ jp:'砂糖を入れますか？', romaji:'Satou wo iremasu ka?', id:'Apakah kamu memasukkan gula?' } },
    { word:'おいしい', reading:'おいしい', romaji:'oishii',  meaning:'enak / lezat',        theme:'food', level:'N5', example:{ jp:'このケーキ、おいしい！', romaji:'Kono keeki, oishii!', id:'Kue ini enak!' } },

    // ── Time ────────────────────────────────────────────────
    { word:'今日',   reading:'きょう',   romaji:'kyou',      meaning:'hari ini',           theme:'time', level:'N5', example:{ jp:'今日は何曜日ですか？', romaji:'Kyou wa nan-youbi desu ka?', id:'Hari ini hari apa?' } },
    { word:'明日',   reading:'あした',   romaji:'ashita',    meaning:'besok',              theme:'time', level:'N5', example:{ jp:'明日また来てください。', romaji:'Ashita mata kite kudasai.', id:'Tolong datang lagi besok.' } },
    { word:'昨日',   reading:'きのう',   romaji:'kinou',     meaning:'kemarin',            theme:'time', level:'N5', example:{ jp:'昨日映画を見ました。', romaji:'Kinou eiga wo mimashita.', id:'Kemarin saya menonton film.' } },
    { word:'今',     reading:'いま',     romaji:'ima',       meaning:'sekarang',           theme:'time', level:'N5', example:{ jp:'今何時ですか？', romaji:'Ima nanji desu ka?', id:'Sekarang jam berapa?' } },
    { word:'毎日',   reading:'まいにち', romaji:'mainichi',  meaning:'setiap hari',        theme:'time', level:'N5', example:{ jp:'毎日勉強します。', romaji:'Mainichi benkyou shimasu.', id:'Saya belajar setiap hari.' } },
    { word:'毎週',   reading:'まいしゅう', romaji:'maishuu', meaning:'setiap minggu',      theme:'time', level:'N5', example:{ jp:'毎週日曜日に掃除します。', romaji:'Maishuu nichiyoubi ni souji shimasu.', id:'Setiap hari Minggu saya bersih-bersih.' } },
    { word:'毎月',   reading:'まいつき', romaji:'maitsuki',  meaning:'setiap bulan',       theme:'time', level:'N5', example:{ jp:'毎月給料が入ります。', romaji:'Maitsuki kyuuryou ga hairimasu.', id:'Setiap bulan gaji masuk.' } },
    { word:'月曜日', reading:'げつようび', romaji:'getsuyoubi', meaning:'Senin',           theme:'time', level:'N5', example:{ jp:'月曜日は仕事が多いです。', romaji:'Getsuyoubi wa shigoto ga ooi desu.', id:'Hari Senin pekerjaan banyak.' } },
    { word:'火曜日', reading:'かようび', romaji:'kayoubi',   meaning:'Selasa',             theme:'time', level:'N5', example:{ jp:'火曜日に会議があります。', romaji:'Kayoubi ni kaigi ga arimasu.', id:'Ada rapat hari Selasa.' } },
    { word:'水曜日', reading:'すいようび', romaji:'suiyoubi', meaning:'Rabu',              theme:'time', level:'N5', example:{ jp:'水曜日は忙しいです。', romaji:'Suiyoubi wa isogashii desu.', id:'Hari Rabu sibuk.' } },
    { word:'木曜日', reading:'もくようび', romaji:'mokuyoubi', meaning:'Kamis',            theme:'time', level:'N5', example:{ jp:'木曜日に友達と会います。', romaji:'Mokuyoubi ni tomodachi to aimasu.', id:'Kamis bertemu teman.' } },
    { word:'金曜日', reading:'きんようび', romaji:'kinyoubi', meaning:'Jumat',             theme:'time', level:'N5', example:{ jp:'金曜日が好きです。', romaji:'Kinyoubi ga suki desu.', id:'Saya suka hari Jumat.' } },
    { word:'土曜日', reading:'どようび', romaji:'doyoubi',   meaning:'Sabtu',              theme:'time', level:'N5', example:{ jp:'土曜日は休みです。', romaji:'Doyoubi wa yasumi desu.', id:'Hari Sabtu libur.' } },
    { word:'日曜日', reading:'にちようび', romaji:'nichiyoubi', meaning:'Minggu',          theme:'time', level:'N5', example:{ jp:'日曜日は家族と過ごします。', romaji:'Nichiyoubi wa kazoku to sugoshimasu.', id:'Hari Minggu menghabiskan waktu dengan keluarga.' } },
    { word:'午前',   reading:'ごぜん',   romaji:'gozen',     meaning:'pagi / AM',          theme:'time', level:'N5', example:{ jp:'午前九時に起きます。', romaji:'Gozen kuji ni okimasu.', id:'Saya bangun pukul 9 pagi.' } },
    { word:'午後',   reading:'ごご',     romaji:'gogo',      meaning:'sore / PM',          theme:'time', level:'N5', example:{ jp:'午後三時に終わります。', romaji:'Gogo sanji ni owarimasu.', id:'Selesai pukul 3 sore.' } },
    { word:'朝',     reading:'あさ',     romaji:'asa',       meaning:'pagi',               theme:'time', level:'N5', example:{ jp:'朝ごはんを食べましょう。', romaji:'Asa gohan wo tabemashou.', id:'Mari sarapan.' } },
    { word:'夜',     reading:'よる',     romaji:'yoru',      meaning:'malam',              theme:'time', level:'N5', example:{ jp:'夜遅く寝ます。', romaji:'Yoru osoku nemasu.', id:'Tidur larut malam.' } },
    { word:'先週',   reading:'せんしゅう', romaji:'senshuu', meaning:'minggu lalu',        theme:'time', level:'N5', example:{ jp:'先週旅行しました。', romaji:'Senshuu ryokou shimashita.', id:'Minggu lalu saya bepergian.' } },
    { word:'来週',   reading:'らいしゅう', romaji:'raishuu', meaning:'minggu depan',       theme:'time', level:'N5', example:{ jp:'来週テストがあります。', romaji:'Raishuu tesuto ga arimasu.', id:'Minggu depan ada tes.' } },

    // ── Places ──────────────────────────────────────────────
    { word:'家',     reading:'いえ',     romaji:'ie',        meaning:'rumah',              theme:'places', level:'N5', example:{ jp:'家に帰ります。', romaji:'Ie ni kaerimasu.', id:'Saya pulang ke rumah.' } },
    { word:'学校',   reading:'がっこう', romaji:'gakkou',    meaning:'sekolah',            theme:'places', level:'N5', example:{ jp:'学校は九時に始まります。', romaji:'Gakkou wa kuji ni hajimarimasu.', id:'Sekolah dimulai pukul 9.' } },
    { word:'会社',   reading:'かいしゃ', romaji:'kaisha',    meaning:'perusahaan / kantor', theme:'places', level:'N5', example:{ jp:'会社まで電車で行きます。', romaji:'Kaisha made densha de ikimasu.', id:'Saya pergi ke kantor naik kereta.' } },
    { word:'病院',   reading:'びょういん', romaji:'byouin',   meaning:'rumah sakit',        theme:'places', level:'N5', example:{ jp:'病院に行きましょう。', romaji:'Byouin ni ikimashou.', id:'Mari ke rumah sakit.' } },
    { word:'銀行',   reading:'ぎんこう', romaji:'ginkou',    meaning:'bank',               theme:'places', level:'N5', example:{ jp:'銀行でお金を引き出します。', romaji:'Ginkou de okane wo hikidashimasu.', id:'Menarik uang di bank.' } },
    { word:'郵便局', reading:'ゆうびんきょく', romaji:'yuubinkyoku', meaning:'kantor pos', theme:'places', level:'N5', example:{ jp:'郵便局で切手を買います。', romaji:'Yuubinkyoku de kitte wo kaimasu.', id:'Beli perangko di kantor pos.' } },
    { word:'図書館', reading:'としょかん', romaji:'toshokan', meaning:'perpustakaan',      theme:'places', level:'N5', example:{ jp:'図書館で勉強します。', romaji:'Toshokan de benkyou shimasu.', id:'Belajar di perpustakaan.' } },
    { word:'駅',     reading:'えき',     romaji:'eki',       meaning:'stasiun kereta',     theme:'places', level:'N5', example:{ jp:'駅はどこですか？', romaji:'Eki wa doko desu ka?', id:'Di mana stasiunnya?' } },
    { word:'空港',   reading:'くうこう', romaji:'kuukou',    meaning:'bandara',            theme:'places', level:'N5', example:{ jp:'空港まで一時間かかります。', romaji:'Kuukou made ichijikan kakarimasu.', id:'Butuh satu jam ke bandara.' } },
    { word:'公園',   reading:'こうえん', romaji:'kouen',     meaning:'taman',              theme:'places', level:'N5', example:{ jp:'公園で散歩します。', romaji:'Kouen de sanpo shimasu.', id:'Jalan-jalan di taman.' } },
    { word:'レストラン', reading:'レストラン', romaji:'resutoran', meaning:'restoran',     theme:'places', level:'N5', example:{ jp:'レストランで夕食を食べます。', romaji:'Resutoran de yuushoku wo tabemasu.', id:'Makan malam di restoran.' } },
    { word:'スーパー', reading:'スーパー', romaji:'suupaa',  meaning:'supermarket',        theme:'places', level:'N5', example:{ jp:'スーパーで野菜を買います。', romaji:'Suupaa de yasai wo kaimasu.', id:'Beli sayuran di supermarket.' } },
    { word:'コンビニ', reading:'コンビニ', romaji:'konbini', meaning:'minimarket / convenience store', theme:'places', level:'N5', example:{ jp:'コンビニは二十四時間営業です。', romaji:'Konbini wa nijuuyojikan eigyou desu.', id:'Convenience store buka 24 jam.' } },
    { word:'ホテル', reading:'ホテル',   romaji:'hoteru',    meaning:'hotel',              theme:'places', level:'N5', example:{ jp:'ホテルを予約しました。', romaji:'Hoteru wo yoyaku shimashita.', id:'Saya sudah memesan hotel.' } },
    { word:'お寺',   reading:'おてら',   romaji:'otera',     meaning:'kuil Buddha',        theme:'places', level:'N4', example:{ jp:'お寺でお参りします。', romaji:'Otera de omairi shimasu.', id:'Berdoa di kuil Buddha.' } },
    { word:'神社',   reading:'じんじゃ', romaji:'jinja',     meaning:'kuil Shinto',        theme:'places', level:'N4', example:{ jp:'神社に初詣に行きます。', romaji:'Jinja ni hatsumoude ni ikimasu.', id:'Pergi ke kuil Shinto saat Tahun Baru.' } },

    // ── Transport ────────────────────────────────────────────
    { word:'電車',   reading:'でんしゃ', romaji:'densha',    meaning:'kereta listrik',     theme:'transport', level:'N5', example:{ jp:'電車で学校に行きます。', romaji:'Densha de gakkou ni ikimasu.', id:'Saya pergi ke sekolah naik kereta.' } },
    { word:'地下鉄', reading:'ちかてつ', romaji:'chikatetsu', meaning:'kereta bawah tanah', theme:'transport', level:'N5', example:{ jp:'地下鉄は便利です。', romaji:'Chikatetsu wa benri desu.', id:'Kereta bawah tanah itu praktis.' } },
    { word:'バス',   reading:'バス',     romaji:'basu',      meaning:'bus',                theme:'transport', level:'N5', example:{ jp:'バスで会社に行きます。', romaji:'Basu de kaisha ni ikimasu.', id:'Pergi ke kantor naik bus.' } },
    { word:'タクシー', reading:'タクシー', romaji:'takushii', meaning:'taksi',             theme:'transport', level:'N5', example:{ jp:'タクシーを呼んでください。', romaji:'Takushii wo yonde kudasai.', id:'Tolong panggil taksi.' } },
    { word:'自転車', reading:'じてんしゃ', romaji:'jitensha', meaning:'sepeda',            theme:'transport', level:'N5', example:{ jp:'自転車で公園に行きます。', romaji:'Jitensha de kouen ni ikimasu.', id:'Pergi ke taman naik sepeda.' } },
    { word:'車',     reading:'くるま',   romaji:'kuruma',    meaning:'mobil',              theme:'transport', level:'N5', example:{ jp:'車で旅行します。', romaji:'Kuruma de ryokou shimasu.', id:'Bepergian dengan mobil.' } },
    { word:'飛行機', reading:'ひこうき', romaji:'hikouki',   meaning:'pesawat terbang',    theme:'transport', level:'N5', example:{ jp:'飛行機で外国に行きます。', romaji:'Hikouki de gaikoku ni ikimasu.', id:'Pergi ke luar negeri naik pesawat.' } },
    { word:'船',     reading:'ふね',     romaji:'fune',      meaning:'kapal',              theme:'transport', level:'N5', example:{ jp:'船で島に行きます。', romaji:'Fune de shima ni ikimasu.', id:'Pergi ke pulau naik kapal.' } },
    { word:'新幹線', reading:'しんかんせん', romaji:'shinkansen', meaning:'kereta cepat (Shinkansen)', theme:'transport', level:'N4', example:{ jp:'新幹線で東京から大阪に行きます。', romaji:'Shinkansen de Toukyou kara Oosaka ni ikimasu.', id:'Naik Shinkansen dari Tokyo ke Osaka.' } },
    { word:'乗り換え', reading:'のりかえ', romaji:'norikae', meaning:'ganti kendaraan / transit', theme:'transport', level:'N4', example:{ jp:'新宿で乗り換えてください。', romaji:'Shinjuku de norikae te kudasai.', id:'Tolong transit di Shinjuku.' } },

    // ── Shopping ────────────────────────────────────────────
    { word:'お金',   reading:'おかね',   romaji:'okane',     meaning:'uang',               theme:'shopping', level:'N5', example:{ jp:'お金がありません。', romaji:'Okane ga arimasen.', id:'Saya tidak punya uang.' } },
    { word:'いくら', reading:'いくら',   romaji:'ikura',     meaning:'berapa (harga)',      theme:'shopping', level:'N5', example:{ jp:'これはいくらですか？', romaji:'Kore wa ikura desu ka?', id:'Ini berapa harganya?' } },
    { word:'安い',   reading:'やすい',   romaji:'yasui',     meaning:'murah',              theme:'shopping', level:'N5', example:{ jp:'このシャツは安いです。', romaji:'Kono shatsu wa yasui desu.', id:'Kemeja ini murah.' } },
    { word:'高い',   reading:'たかい',   romaji:'takai',     meaning:'mahal / tinggi',     theme:'shopping', level:'N5', example:{ jp:'このかばんは高いです。', romaji:'Kono kaban wa takai desu.', id:'Tas ini mahal.' } },
    { word:'買う',   reading:'かう',     romaji:'kau',       meaning:'membeli',            theme:'shopping', level:'N5', example:{ jp:'新しい本を買いました。', romaji:'Atarashii hon wo kaimashita.', id:'Saya membeli buku baru.' } },
    { word:'売る',   reading:'うる',     romaji:'uru',       meaning:'menjual',            theme:'shopping', level:'N5', example:{ jp:'中古品を売ります。', romaji:'Chuukohin wo urimasu.', id:'Menjual barang bekas.' } },
    { word:'店',     reading:'みせ',     romaji:'mise',      meaning:'toko',               theme:'shopping', level:'N5', example:{ jp:'この店は安いですね。', romaji:'Kono mise wa yasui desu ne.', id:'Toko ini murah ya.' } },
    { word:'デパート', reading:'デパート', romaji:'depaato', meaning:'department store',   theme:'shopping', level:'N5', example:{ jp:'デパートでプレゼントを買います。', romaji:'Depaato de purezento wo kaimasu.', id:'Beli hadiah di department store.' } },
    { word:'レシート', reading:'レシート', romaji:'reshiito', meaning:'struk / receipt',   theme:'shopping', level:'N4', example:{ jp:'レシートをもらいましたか？', romaji:'Reshiito wo moraimashita ka?', id:'Apakah kamu menerima struk?' } },
    { word:'割引',   reading:'わりびき', romaji:'waribiki',  meaning:'diskon',             theme:'shopping', level:'N4', example:{ jp:'三十パーセント割引です。', romaji:'Sanjuu paasento waribiki desu.', id:'Diskon 30 persen.' } },

    // ── Body & Health ────────────────────────────────────────
    { word:'頭',     reading:'あたま',   romaji:'atama',     meaning:'kepala',             theme:'body', level:'N5', example:{ jp:'頭が痛いです。', romaji:'Atama ga itai desu.', id:'Kepala saya sakit.' } },
    { word:'目',     reading:'め',       romaji:'me',        meaning:'mata',               theme:'body', level:'N5', example:{ jp:'目が悪いです。', romaji:'Me ga warui desu.', id:'Mata saya buruk (rabun).' } },
    { word:'耳',     reading:'みみ',     romaji:'mimi',      meaning:'telinga',            theme:'body', level:'N5', example:{ jp:'耳がよく聞こえません。', romaji:'Mimi ga yoku kikoemasen.', id:'Telinga saya kurang bisa mendengar.' } },
    { word:'鼻',     reading:'はな',     romaji:'hana',      meaning:'hidung',             theme:'body', level:'N5', example:{ jp:'鼻が詰まっています。', romaji:'Hana ga tsumatte imasu.', id:'Hidung saya tersumbat.' } },
    { word:'口',     reading:'くち',     romaji:'kuchi',     meaning:'mulut',              theme:'body', level:'N5', example:{ jp:'口を開けてください。', romaji:'Kuchi wo akete kudasai.', id:'Tolong buka mulut.' } },
    { word:'手',     reading:'て',       romaji:'te',        meaning:'tangan',             theme:'body', level:'N5', example:{ jp:'手を洗ってください。', romaji:'Te wo aratte kudasai.', id:'Tolong cuci tangan.' } },
    { word:'足',     reading:'あし',     romaji:'ashi',      meaning:'kaki',               theme:'body', level:'N5', example:{ jp:'足が痛いです。', romaji:'Ashi ga itai desu.', id:'Kaki saya sakit.' } },
    { word:'体',     reading:'からだ',   romaji:'karada',    meaning:'tubuh / badan',      theme:'body', level:'N5', example:{ jp:'体に気をつけてください。', romaji:'Karada ni ki wo tsukete kudasai.', id:'Jaga kesehatan badan.' } },
    { word:'病気',   reading:'びょうき', romaji:'byouki',    meaning:'sakit / penyakit',   theme:'body', level:'N5', example:{ jp:'病気で学校を休みました。', romaji:'Byouki de gakkou wo yasumimashita.', id:'Absen sekolah karena sakit.' } },
    { word:'薬',     reading:'くすり',   romaji:'kusuri',    meaning:'obat',               theme:'body', level:'N5', example:{ jp:'薬を飲んでください。', romaji:'Kusuri wo nonde kudasai.', id:'Tolong minum obatnya.' } },
    { word:'熱',     reading:'ねつ',     romaji:'netsu',     meaning:'demam',              theme:'body', level:'N5', example:{ jp:'熱があります。', romaji:'Netsu ga arimasu.', id:'Saya demam.' } },
    { word:'痛い',   reading:'いたい',   romaji:'itai',      meaning:'sakit / nyeri',      theme:'body', level:'N5', example:{ jp:'お腹が痛いです。', romaji:'Onaka ga itai desu.', id:'Perut saya sakit.' } },

    // ── School ──────────────────────────────────────────────
    { word:'勉強',   reading:'べんきょう', romaji:'benkyou', meaning:'belajar',            theme:'school', level:'N5', example:{ jp:'毎日日本語を勉強します。', romaji:'Mainichi nihongo wo benkyou shimasu.', id:'Setiap hari belajar bahasa Jepang.' } },
    { word:'授業',   reading:'じゅぎょう', romaji:'jugyou',  meaning:'kelas / pelajaran',  theme:'school', level:'N4', example:{ jp:'授業は九時から始まります。', romaji:'Jugyou wa kuji kara hajimarimasu.', id:'Pelajaran mulai dari jam 9.' } },
    { word:'先生',   reading:'せんせい', romaji:'sensei',    meaning:'guru / sensei',      theme:'school', level:'N5', example:{ jp:'先生はとても優しいです。', romaji:'Sensei wa totemo yasashii desu.', id:'Gurunya sangat baik.' } },
    { word:'学生',   reading:'がくせい', romaji:'gakusei',   meaning:'pelajar / murid',    theme:'school', level:'N5', example:{ jp:'私は学生です。', romaji:'Watashi wa gakusei desu.', id:'Saya adalah pelajar.' } },
    { word:'大学生', reading:'だいがくせい', romaji:'daigakusei', meaning:'mahasiswa',     theme:'school', level:'N5', example:{ jp:'兄は大学生です。', romaji:'Ani wa daigakusei desu.', id:'Kakak laki-laki saya adalah mahasiswa.' } },
    { word:'本',     reading:'ほん',     romaji:'hon',       meaning:'buku',               theme:'school', level:'N5', example:{ jp:'図書館で本を借ります。', romaji:'Toshokan de hon wo karimasu.', id:'Meminjam buku di perpustakaan.' } },
    { word:'ノート', reading:'ノート',   romaji:'nooto',     meaning:'buku catatan',       theme:'school', level:'N5', example:{ jp:'ノートを忘れました。', romaji:'Nooto wo wasuremashita.', id:'Saya lupa bawa buku catatan.' } },
    { word:'鉛筆',   reading:'えんぴつ', romaji:'enpitsu',   meaning:'pensil',             theme:'school', level:'N5', example:{ jp:'鉛筆で書いてください。', romaji:'Enpitsu de kaite kudasai.', id:'Tolong tulis dengan pensil.' } },
    { word:'テスト', reading:'テスト',   romaji:'tesuto',    meaning:'ujian / tes',        theme:'school', level:'N5', example:{ jp:'明日テストがあります。', romaji:'Ashita tesuto ga arimasu.', id:'Besok ada ujian.' } },
    { word:'宿題',   reading:'しゅくだい', romaji:'shukudai', meaning:'pekerjaan rumah',   theme:'school', level:'N5', example:{ jp:'宿題をやりましたか？', romaji:'Shukudai wo yarimashita ka?', id:'Apakah kamu sudah mengerjakan PR?' } },
    { word:'答え',   reading:'こたえ',   romaji:'kotae',     meaning:'jawaban',            theme:'school', level:'N4', example:{ jp:'正しい答えを選んでください。', romaji:'Tadashii kotae wo erande kudasai.', id:'Tolong pilih jawaban yang benar.' } },
    { word:'質問',   reading:'しつもん', romaji:'shitsumon', meaning:'pertanyaan',         theme:'school', level:'N4', example:{ jp:'質問があります。', romaji:'Shitsumon ga arimasu.', id:'Saya punya pertanyaan.' } },

    // ── Work ────────────────────────────────────────────────
    { word:'仕事',   reading:'しごと',   romaji:'shigoto',   meaning:'pekerjaan',          theme:'work', level:'N5', example:{ jp:'仕事は楽しいですか？', romaji:'Shigoto wa tanoshii desu ka?', id:'Apakah pekerjaan kamu menyenangkan?' } },
    { word:'会議',   reading:'かいぎ',   romaji:'kaigi',     meaning:'rapat / pertemuan',  theme:'work', level:'N4', example:{ jp:'三時から会議があります。', romaji:'Sanji kara kaigi ga arimasu.', id:'Ada rapat mulai pukul 3.' } },
    { word:'上司',   reading:'じょうし', romaji:'joushi',    meaning:'atasan / bos',       theme:'work', level:'N4', example:{ jp:'上司に報告しました。', romaji:'Joushi ni houkoku shimashita.', id:'Saya lapor ke atasan.' } },
    { word:'部下',   reading:'ぶか',     romaji:'buka',      meaning:'bawahan',            theme:'work', level:'N4', example:{ jp:'部下に仕事を頼みます。', romaji:'Buka ni shigoto wo tanomimasu.', id:'Meminta bawahan untuk mengerjakan tugas.' } },
    { word:'残業',   reading:'ざんぎょう', romaji:'zangyou', meaning:'lembur',             theme:'work', level:'N4', example:{ jp:'今日は残業があります。', romaji:'Kyou wa zangyou ga arimasu.', id:'Hari ini ada lembur.' } },
    { word:'給料',   reading:'きゅうりょう', romaji:'kyuuryou', meaning:'gaji',            theme:'work', level:'N4', example:{ jp:'給料が上がりました。', romaji:'Kyuuryou ga agarimashita.', id:'Gaji saya naik.' } },
    { word:'休み',   reading:'やすみ',   romaji:'yasumi',    meaning:'istirahat / libur',  theme:'work', level:'N5', example:{ jp:'明日は休みです。', romaji:'Ashita wa yasumi desu.', id:'Besok libur.' } },
    { word:'退社',   reading:'たいしゃ', romaji:'taisha',    meaning:'keluar kantor / resign', theme:'work', level:'N4', example:{ jp:'六時に退社します。', romaji:'Rokuji ni taisha shimasu.', id:'Keluar kantor pukul 6.' } },
    { word:'出張',   reading:'しゅっちょう', romaji:'shucchou', meaning:'perjalanan dinas', theme:'work', level:'N4', example:{ jp:'来週大阪に出張します。', romaji:'Raishuu Oosaka ni shucchou shimasu.', id:'Minggu depan dinas ke Osaka.' } },

    // ── Nature ──────────────────────────────────────────────
    { word:'天気',   reading:'てんき',   romaji:'tenki',     meaning:'cuaca',              theme:'nature', level:'N5', example:{ jp:'今日の天気はどうですか？', romaji:'Kyou no tenki wa dou desu ka?', id:'Bagaimana cuaca hari ini?' } },
    { word:'晴れ',   reading:'はれ',     romaji:'hare',      meaning:'cerah',              theme:'nature', level:'N5', example:{ jp:'今日は晴れです。', romaji:'Kyou wa hare desu.', id:'Hari ini cerah.' } },
    { word:'雨',     reading:'あめ',     romaji:'ame',       meaning:'hujan',              theme:'nature', level:'N5', example:{ jp:'雨が降っています。', romaji:'Ame ga futte imasu.', id:'Sedang hujan.' } },
    { word:'雪',     reading:'ゆき',     romaji:'yuki',      meaning:'salju',              theme:'nature', level:'N5', example:{ jp:'雪が好きです。', romaji:'Yuki ga suki desu.', id:'Saya suka salju.' } },
    { word:'風',     reading:'かぜ',     romaji:'kaze',      meaning:'angin',              theme:'nature', level:'N5', example:{ jp:'風が強いです。', romaji:'Kaze ga tsuyoi desu.', id:'Anginnya kencang.' } },
    { word:'山',     reading:'やま',     romaji:'yama',      meaning:'gunung',             theme:'nature', level:'N5', example:{ jp:'富士山はきれいです。', romaji:'Fujisan wa kirei desu.', id:'Gunung Fuji indah.' } },
    { word:'海',     reading:'うみ',     romaji:'umi',       meaning:'laut',               theme:'nature', level:'N5', example:{ jp:'海で泳ぎます。', romaji:'Umi de oyogimasu.', id:'Berenang di laut.' } },
    { word:'川',     reading:'かわ',     romaji:'kawa',      meaning:'sungai',             theme:'nature', level:'N5', example:{ jp:'川でさかなを釣ります。', romaji:'Kawa de sakana wo tsurimasu.', id:'Memancing ikan di sungai.' } },
    { word:'花',     reading:'はな',     romaji:'hana',      meaning:'bunga',              theme:'nature', level:'N5', example:{ jp:'桜の花が咲いています。', romaji:'Sakura no hana ga saite imasu.', id:'Bunga sakura sedang mekar.' } },
    { word:'木',     reading:'き',       romaji:'ki',        meaning:'pohon',              theme:'nature', level:'N5', example:{ jp:'公園に大きい木があります。', romaji:'Kouen ni ookii ki ga arimasu.', id:'Di taman ada pohon besar.' } },
    { word:'春',     reading:'はる',     romaji:'haru',      meaning:'musim semi',         theme:'nature', level:'N5', example:{ jp:'春は暖かいです。', romaji:'Haru wa atatakai desu.', id:'Musim semi hangat.' } },
    { word:'夏',     reading:'なつ',     romaji:'natsu',     meaning:'musim panas',        theme:'nature', level:'N5', example:{ jp:'夏は暑いです。', romaji:'Natsu wa atsui desu.', id:'Musim panas panas.' } },
    { word:'秋',     reading:'あき',     romaji:'aki',       meaning:'musim gugur',        theme:'nature', level:'N5', example:{ jp:'秋は涼しいです。', romaji:'Aki wa suzushii desu.', id:'Musim gugur sejuk.' } },
    { word:'冬',     reading:'ふゆ',     romaji:'fuyu',      meaning:'musim dingin',       theme:'nature', level:'N5', example:{ jp:'冬は寒いです。', romaji:'Fuyu wa samui desu.', id:'Musim dingin dingin.' } },

    // ── Colors ──────────────────────────────────────────────
    { word:'赤',     reading:'あか',     romaji:'aka',       meaning:'merah',              theme:'colors', level:'N5', example:{ jp:'赤いリンゴが好きです。', romaji:'Akai ringo ga suki desu.', id:'Saya suka apel merah.' } },
    { word:'青',     reading:'あお',     romaji:'ao',        meaning:'biru',               theme:'colors', level:'N5', example:{ jp:'青い空が好きです。', romaji:'Aoi sora ga suki desu.', id:'Saya suka langit biru.' } },
    { word:'白',     reading:'しろ',     romaji:'shiro',     meaning:'putih',              theme:'colors', level:'N5', example:{ jp:'白いシャツを着ています。', romaji:'Shiroi shatsu wo kite imasu.', id:'Memakai kemeja putih.' } },
    { word:'黒',     reading:'くろ',     romaji:'kuro',      meaning:'hitam',              theme:'colors', level:'N5', example:{ jp:'黒い猫がいます。', romaji:'Kuroi neko ga imasu.', id:'Ada kucing hitam.' } },
    { word:'黄色',   reading:'きいろ',   romaji:'kiiro',     meaning:'kuning',             theme:'colors', level:'N5', example:{ jp:'黄色いひまわりが咲いています。', romaji:'Kiiroi himawari ga saite imasu.', id:'Bunga matahari kuning sedang mekar.' } },
    { word:'緑',     reading:'みどり',   romaji:'midori',    meaning:'hijau',              theme:'colors', level:'N5', example:{ jp:'緑の木がたくさんあります。', romaji:'Midori no ki ga takusan arimasu.', id:'Ada banyak pohon hijau.' } },
    { word:'ピンク', reading:'ピンク',   romaji:'pinku',     meaning:'merah muda / pink',  theme:'colors', level:'N5', example:{ jp:'ピンクのドレスがかわいいです。', romaji:'Pinku no doresu ga kawaii desu.', id:'Gaun pink itu lucu.' } },
    { word:'紫',     reading:'むらさき', romaji:'murasaki',  meaning:'ungu',               theme:'colors', level:'N4', example:{ jp:'紫の花が好きです。', romaji:'Murasaki no hana ga suki desu.', id:'Saya suka bunga ungu.' } },
    { word:'茶色',   reading:'ちゃいろ', romaji:'chairo',    meaning:'cokelat',            theme:'colors', level:'N4', example:{ jp:'茶色の犬を飼っています。', romaji:'Chairo no inu wo katte imasu.', id:'Saya memelihara anjing cokelat.' } },
    { word:'大きい', reading:'おおきい', romaji:'ookii',     meaning:'besar',              theme:'colors', level:'N5', example:{ jp:'大きいかばんが欲しいです。', romaji:'Ookii kaban ga hoshii desu.', id:'Saya ingin tas yang besar.' } },
    { word:'小さい', reading:'ちいさい', romaji:'chiisai',   meaning:'kecil',              theme:'colors', level:'N5', example:{ jp:'小さい猫がかわいいです。', romaji:'Chiisai neko ga kawaii desu.', id:'Kucing kecil itu lucu.' } },
    { word:'丸い',   reading:'まるい',   romaji:'marui',     meaning:'bulat',              theme:'colors', level:'N4', example:{ jp:'丸い月が見えます。', romaji:'Marui tsuki ga miemasu.', id:'Terlihat bulan bulat.' } },

    // ── Numbers ─────────────────────────────────────────────
    { word:'一',     reading:'いち',     romaji:'ichi',      meaning:'satu (1)',           theme:'numbers', level:'N5', example:{ jp:'一つください。', romaji:'Hitotsu kudasai.', id:'Tolong berikan satu.' } },
    { word:'二',     reading:'に',       romaji:'ni',        meaning:'dua (2)',            theme:'numbers', level:'N5', example:{ jp:'二人で行きます。', romaji:'Futari de ikimasu.', id:'Pergi berdua.' } },
    { word:'三',     reading:'さん',     romaji:'san',       meaning:'tiga (3)',           theme:'numbers', level:'N5', example:{ jp:'三時に来てください。', romaji:'Sanji ni kite kudasai.', id:'Tolong datang jam 3.' } },
    { word:'四',     reading:'よん',     romaji:'yon',       meaning:'empat (4)',          theme:'numbers', level:'N5', example:{ jp:'四月に日本に行きます。', romaji:'Shigatsu ni Nihon ni ikimasu.', id:'Bulan April pergi ke Jepang.' } },
    { word:'五',     reading:'ご',       romaji:'go',        meaning:'lima (5)',           theme:'numbers', level:'N5', example:{ jp:'五個ください。', romaji:'Goko kudasai.', id:'Tolong berikan 5 buah.' } },
    { word:'十',     reading:'じゅう',   romaji:'juu',       meaning:'sepuluh (10)',       theme:'numbers', level:'N5', example:{ jp:'十分待ってください。', romaji:'Juppun matte kudasai.', id:'Tolong tunggu 10 menit.' } },
    { word:'百',     reading:'ひゃく',   romaji:'hyaku',     meaning:'seratus (100)',      theme:'numbers', level:'N5', example:{ jp:'百円のお菓子を買いました。', romaji:'Hyakuen no okashi wo kaimashita.', id:'Beli kue 100 yen.' } },
    { word:'千',     reading:'せん',     romaji:'sen',       meaning:'seribu (1.000)',     theme:'numbers', level:'N5', example:{ jp:'千円あれば足ります。', romaji:'Senen areba tarimasu.', id:'1000 yen sudah cukup.' } },
    { word:'万',     reading:'まん',     romaji:'man',       meaning:'sepuluh ribu (10.000)', theme:'numbers', level:'N5', example:{ jp:'一万円持っています。', romaji:'Ichiman-en motte imasu.', id:'Saya punya 10.000 yen.' } },
    { word:'半',     reading:'はん',     romaji:'han',       meaning:'setengah',          theme:'numbers', level:'N5', example:{ jp:'三時半に会いましょう。', romaji:'Sanji han ni aimashou.', id:'Mari bertemu pukul setengah 4.' } },
    { word:'番',     reading:'ばん',     romaji:'ban',       meaning:'nomor urut',        theme:'numbers', level:'N5', example:{ jp:'何番バスに乗りますか？', romaji:'Nanban basu ni norimasu ka?', id:'Naik bus nomor berapa?' } },
    { word:'個',     reading:'こ',       romaji:'ko',        meaning:'buah (satuan benda kecil)', theme:'numbers', level:'N5', example:{ jp:'リンゴを三個ください。', romaji:'Ringo wo sango kudasai.', id:'Tolong 3 buah apel.' } },
    { word:'枚',     reading:'まい',     romaji:'mai',       meaning:'lembar / buah (benda tipis)', theme:'numbers', level:'N5', example:{ jp:'切手を二枚ください。', romaji:'Kitte wo nimai kudasai.', id:'Tolong 2 lembar perangko.' } },

    // ── Adjectives ──────────────────────────────────────────
    { word:'いい',   reading:'いい',     romaji:'ii',        meaning:'baik / bagus',      theme:'adjectives', level:'N5', example:{ jp:'今日はいい天気ですね。', romaji:'Kyou wa ii tenki desu ne.', id:'Cuaca hari ini bagus ya.' } },
    { word:'悪い',   reading:'わるい',   romaji:'warui',     meaning:'buruk / jelek',     theme:'adjectives', level:'N5', example:{ jp:'調子が悪いです。', romaji:'Choushi ga warui desu.', id:'Kondisi saya tidak baik.' } },
    { word:'新しい', reading:'あたらしい', romaji:'atarashii', meaning:'baru',            theme:'adjectives', level:'N5', example:{ jp:'新しいスマホを買いました。', romaji:'Atarashii sumaho wo kaimashita.', id:'Membeli smartphone baru.' } },
    { word:'古い',   reading:'ふるい',   romaji:'furui',     meaning:'lama / tua',        theme:'adjectives', level:'N5', example:{ jp:'この建物は古いです。', romaji:'Kono tatemono wa furui desu.', id:'Gedung ini sudah tua.' } },
    { word:'暑い',   reading:'あつい',   romaji:'atsui',     meaning:'panas (udara)',     theme:'adjectives', level:'N5', example:{ jp:'今日は暑いですね。', romaji:'Kyou wa atsui desu ne.', id:'Hari ini panas ya.' } },
    { word:'寒い',   reading:'さむい',   romaji:'samui',     meaning:'dingin (udara)',    theme:'adjectives', level:'N5', example:{ jp:'冬は寒いです。', romaji:'Fuyu wa samui desu.', id:'Musim dingin itu dingin.' } },
    { word:'熱い',   reading:'あつい',   romaji:'atsui',     meaning:'panas (sentuhan)', theme:'adjectives', level:'N5', example:{ jp:'スープが熱いです。', romaji:'Suupu ga atsui desu.', id:'Supnya panas.' } },
    { word:'冷たい', reading:'つめたい', romaji:'tsumetai',  meaning:'dingin (sentuhan)', theme:'adjectives', level:'N5', example:{ jp:'冷たい水が飲みたいです。', romaji:'Tsumetai mizu ga nomitai desu.', id:'Ingin minum air dingin.' } },
    { word:'楽しい', reading:'たのしい', romaji:'tanoshii',  meaning:'menyenangkan',     theme:'adjectives', level:'N5', example:{ jp:'日本語の勉強は楽しいです。', romaji:'Nihongo no benkyou wa tanoshii desu.', id:'Belajar bahasa Jepang menyenangkan.' } },
    { word:'難しい', reading:'むずかしい', romaji:'muzukashii', meaning:'sulit / susah',  theme:'adjectives', level:'N5', example:{ jp:'この問題は難しいです。', romaji:'Kono mondai wa muzukashii desu.', id:'Soal ini sulit.' } },
    { word:'易しい', reading:'やさしい', romaji:'yasashii',  meaning:'mudah',             theme:'adjectives', level:'N5', example:{ jp:'これは易しい問題です。', romaji:'Kore wa yasashii mondai desu.', id:'Ini soal yang mudah.' } },
    { word:'忙しい', reading:'いそがしい', romaji:'isogashii', meaning:'sibuk',           theme:'adjectives', level:'N5', example:{ jp:'今日は忙しいです。', romaji:'Kyou wa isogashii desu.', id:'Hari ini saya sibuk.' } },
    { word:'暇',     reading:'ひま',     romaji:'hima',      meaning:'waktu luang / senggang', theme:'adjectives', level:'N5', example:{ jp:'今日は暇です。', romaji:'Kyou wa hima desu.', id:'Hari ini saya senggang.' } },
    { word:'きれい', reading:'きれい',   romaji:'kirei',     meaning:'cantik / bersih',  theme:'adjectives', level:'N5', example:{ jp:'この花はきれいですね。', romaji:'Kono hana wa kirei desu ne.', id:'Bunga ini cantik ya.' } },
    { word:'かわいい', reading:'かわいい', romaji:'kawaii',  meaning:'lucu / imut',       theme:'adjectives', level:'N5', example:{ jp:'この子猫はかわいいです。', romaji:'Kono koneko wa kawaii desu.', id:'Anak kucing ini lucu.' } },
    { word:'かっこいい', reading:'かっこいい', romaji:'kakkoii', meaning:'keren / ganteng', theme:'adjectives', level:'N5', example:{ jp:'あの人はかっこいいですね。', romaji:'Ano hito wa kakkoii desu ne.', id:'Orang itu keren ya.' } },
    { word:'元気',   reading:'げんき',   romaji:'genki',     meaning:'sehat / bersemangat', theme:'adjectives', level:'N5', example:{ jp:'お元気ですか？', romaji:'O-genki desu ka?', id:'Apakah kamu sehat?' } },
    { word:'好き',   reading:'すき',     romaji:'suki',      meaning:'suka',              theme:'adjectives', level:'N5', example:{ jp:'日本語が好きです。', romaji:'Nihongo ga suki desu.', id:'Saya suka bahasa Jepang.' } },
    { word:'嫌い',   reading:'きらい',   romaji:'kirai',     meaning:'tidak suka',        theme:'adjectives', level:'N5', example:{ jp:'虫が嫌いです。', romaji:'Mushi ga kirai desu.', id:'Saya tidak suka serangga.' } },

    // ── Verbs ────────────────────────────────────────────────
    { word:'食べる', reading:'たべる',   romaji:'taberu',    meaning:'makan',             theme:'verbs', level:'N5', example:{ jp:'寿司を食べます。', romaji:'Sushi wo tabemasu.', id:'Makan sushi.' } },
    { word:'飲む',   reading:'のむ',     romaji:'nomu',      meaning:'minum',             theme:'verbs', level:'N5', example:{ jp:'水を飲みます。', romaji:'Mizu wo nomimasu.', id:'Minum air.' } },
    { word:'行く',   reading:'いく',     romaji:'iku',       meaning:'pergi',             theme:'verbs', level:'N5', example:{ jp:'学校に行きます。', romaji:'Gakkou ni ikimasu.', id:'Pergi ke sekolah.' } },
    { word:'来る',   reading:'くる',     romaji:'kuru',      meaning:'datang',            theme:'verbs', level:'N5', example:{ jp:'友達が来ます。', romaji:'Tomodachi ga kimasu.', id:'Teman datang.' } },
    { word:'帰る',   reading:'かえる',   romaji:'kaeru',     meaning:'pulang',            theme:'verbs', level:'N5', example:{ jp:'家に帰ります。', romaji:'Ie ni kaerimasu.', id:'Pulang ke rumah.' } },
    { word:'見る',   reading:'みる',     romaji:'miru',      meaning:'melihat',           theme:'verbs', level:'N5', example:{ jp:'テレビを見ます。', romaji:'Terebi wo mimasu.', id:'Menonton TV.' } },
    { word:'聞く',   reading:'きく',     romaji:'kiku',      meaning:'mendengar / bertanya', theme:'verbs', level:'N5', example:{ jp:'音楽を聞きます。', romaji:'Ongaku wo kikimasu.', id:'Mendengarkan musik.' } },
    { word:'話す',   reading:'はなす',   romaji:'hanasu',    meaning:'berbicara',         theme:'verbs', level:'N5', example:{ jp:'日本語で話しましょう。', romaji:'Nihongo de hanashimashou.', id:'Mari berbicara dalam bahasa Jepang.' } },
    { word:'書く',   reading:'かく',     romaji:'kaku',      meaning:'menulis',           theme:'verbs', level:'N5', example:{ jp:'漢字を書く練習をします。', romaji:'Kanji wo kaku renshuu wo shimasu.', id:'Berlatih menulis kanji.' } },
    { word:'読む',   reading:'よむ',     romaji:'yomu',      meaning:'membaca',           theme:'verbs', level:'N5', example:{ jp:'本を読みます。', romaji:'Hon wo yomimasu.', id:'Membaca buku.' } },
    { word:'買う',   reading:'かう',     romaji:'kau',       meaning:'membeli',           theme:'verbs', level:'N5', example:{ jp:'洋服を買います。', romaji:'Youfuku wo kaimasu.', id:'Membeli pakaian.' } },
    { word:'起きる', reading:'おきる',   romaji:'okiru',     meaning:'bangun tidur',      theme:'verbs', level:'N5', example:{ jp:'七時に起きます。', romaji:'Shichiji ni okimasu.', id:'Bangun jam 7.' } },
    { word:'寝る',   reading:'ねる',     romaji:'neru',      meaning:'tidur',             theme:'verbs', level:'N5', example:{ jp:'十時に寝ます。', romaji:'Juuji ni nemasu.', id:'Tidur jam 10.' } },
    { word:'勉強する', reading:'べんきょうする', romaji:'benkyou suru', meaning:'belajar', theme:'verbs', level:'N5', example:{ jp:'日本語を勉強します。', romaji:'Nihongo wo benkyou shimasu.', id:'Belajar bahasa Jepang.' } },
    { word:'働く',   reading:'はたらく', romaji:'hataraku',  meaning:'bekerja',           theme:'verbs', level:'N5', example:{ jp:'会社で働きます。', romaji:'Kaisha de hatarakimasu.', id:'Bekerja di kantor.' } },
    { word:'遊ぶ',   reading:'あそぶ',   romaji:'asobu',     meaning:'bermain',           theme:'verbs', level:'N5', example:{ jp:'公園で遊びます。', romaji:'Kouen de asobimasu.', id:'Bermain di taman.' } },
    { word:'泳ぐ',   reading:'およぐ',   romaji:'oyogu',     meaning:'berenang',          theme:'verbs', level:'N5', example:{ jp:'海で泳ぎます。', romaji:'Umi de oyogimasu.', id:'Berenang di laut.' } },
    { word:'走る',   reading:'はしる',   romaji:'hashiru',   meaning:'berlari',           theme:'verbs', level:'N5', example:{ jp:'毎朝走ります。', romaji:'Maiasa hashirimasu.', id:'Berlari setiap pagi.' } },
    { word:'歩く',   reading:'あるく',   romaji:'aruku',     meaning:'berjalan',          theme:'verbs', level:'N5', example:{ jp:'駅まで歩きます。', romaji:'Eki made arukimasu.', id:'Berjalan sampai stasiun.' } },
    { word:'持つ',   reading:'もつ',     romaji:'motsu',     meaning:'memegang / membawa', theme:'verbs', level:'N5', example:{ jp:'かばんを持ちます。', romaji:'Kaban wo mochimasu.', id:'Membawa tas.' } },
    { word:'使う',   reading:'つかう',   romaji:'tsukau',    meaning:'menggunakan',       theme:'verbs', level:'N5', example:{ jp:'スマホをよく使います。', romaji:'Sumaho wo yoku tsukaimasu.', id:'Sering menggunakan smartphone.' } },
    { word:'待つ',   reading:'まつ',     romaji:'matsu',     meaning:'menunggu',          theme:'verbs', level:'N5', example:{ jp:'少し待ってください。', romaji:'Sukoshi matte kudasai.', id:'Tolong tunggu sebentar.' } },
    { word:'分かる', reading:'わかる',   romaji:'wakaru',    meaning:'mengerti',          theme:'verbs', level:'N5', example:{ jp:'日本語が分かりますか？', romaji:'Nihongo ga wakarimasu ka?', id:'Apakah kamu mengerti bahasa Jepang?' } },
    { word:'知る',   reading:'しる',     romaji:'shiru',     meaning:'mengetahui',        theme:'verbs', level:'N5', example:{ jp:'あの人を知っていますか？', romaji:'Ano hito wo shitte imasu ka?', id:'Apakah kamu mengenal orang itu?' } },
    { word:'思う',   reading:'おもう',   romaji:'omou',      meaning:'berpikir / merasa', theme:'verbs', level:'N5', example:{ jp:'日本語は難しいと思います。', romaji:'Nihongo wa muzukashii to omoimasu.', id:'Saya rasa bahasa Jepang itu sulit.' } },
    { word:'教える', reading:'おしえる', romaji:'oshieru',   meaning:'mengajar',          theme:'verbs', level:'N5', example:{ jp:'日本語を教えています。', romaji:'Nihongo wo oshiete imasu.', id:'Saya mengajar bahasa Jepang.' } },
  ];

  function getByTheme(themeId) {
    return vocab.filter(v => v.theme === themeId);
  }

  function search(q) {
    const lq = q.toLowerCase();
    return vocab.filter(v =>
      v.word.includes(q) ||
      v.reading.includes(q) ||
      v.romaji.toLowerCase().includes(lq) ||
      v.meaning.toLowerCase().includes(lq)
    );
  }

  function getByLevel(level) {
    return vocab.filter(v => v.level === level);
  }

  return { themes, vocab, getByTheme, search, getByLevel };
})();

window.JpVocabData = JpVocabData;
