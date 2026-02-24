/**
 * NihonHan - Japanese Grammar Data (Fase 8)
 * 52 pola grammar N5-N4
 * Format: { id, pattern, reading, meaning, level, explanation, examples:[{jp, romaji, id}], notes? }
 */
const JpGrammarData = (() => {

  const categories = [
    { id:'particles',    label:'Partikel Dasar',       icon:'⚡' },
    { id:'sentence',     label:'Pola Kalimat',         icon:'📝' },
    { id:'tense',        label:'Waktu & Aspek',        icon:'🕐' },
    { id:'linking',      label:'Menghubungkan',        icon:'🔗' },
    { id:'expression',   label:'Ekspresi Berguna',     icon:'💬' },
  ];

  const patterns = [
    // ── Partikel Dasar ──────────────────────────────────────
    {
      id: 'wa',
      pattern: '〜は〜',
      reading: 'は',
      meaning: 'adalah (topik kalimat)',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel は (wa) menandai topik kalimat. Berbeda dengan が yang menandai subjek, は memperkenalkan tema yang sedang dibicarakan.',
      examples: [
        { jp:'私は学生です。', romaji:'Watashi wa gakusei desu.', id:'Saya adalah pelajar.' },
        { jp:'東京は大きい都市です。', romaji:'Toukyou wa ookii toshi desu.', id:'Tokyo adalah kota besar.' },
        { jp:'これは何ですか？', romaji:'Kore wa nan desu ka?', id:'Ini apa?' },
      ],
      notes: 'は ditulis dengan hiragana "ha" tapi dibaca "wa" saat digunakan sebagai partikel.',
    },
    {
      id: 'ga',
      pattern: '〜が〜',
      reading: 'が',
      meaning: 'subjek kalimat / penekanan',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel が menandai subjek kalimat. Sering digunakan saat memperkenalkan sesuatu yang baru atau memberikan penekanan pada subjek.',
      examples: [
        { jp:'猫が好きです。', romaji:'Neko ga suki desu.', id:'(Saya) suka kucing.' },
        { jp:'雨が降っています。', romaji:'Ame ga futte imasu.', id:'Hujan sedang turun.' },
        { jp:'田中さんが来ました。', romaji:'Tanaka-san ga kimashita.', id:'Tanaka-san yang datang.' },
      ],
      notes: 'Setelah kata sifat seperti suki (suka), kirai (tidak suka), hoshii (ingin) — gunakan が, bukan を.',
    },
    {
      id: 'wo',
      pattern: '〜を〜',
      reading: 'を',
      meaning: 'objek langsung kata kerja',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel を menandai objek langsung dari kata kerja transitif (kata kerja yang memerlukan objek).',
      examples: [
        { jp:'本を読みます。', romaji:'Hon wo yomimasu.', id:'Membaca buku.' },
        { jp:'コーヒーを飲みます。', romaji:'Koohii wo nomimasu.', id:'Minum kopi.' },
        { jp:'日本語を勉強しています。', romaji:'Nihongo wo benkyou shite imasu.', id:'Sedang belajar bahasa Jepang.' },
      ],
    },
    {
      id: 'ni',
      pattern: '〜に〜',
      reading: 'に',
      meaning: 'ke / di / pada (waktu/tempat tujuan)',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel に memiliki banyak fungsi: menunjukkan waktu spesifik, tujuan pergerakan, tempat keberadaan, atau penerima.',
      examples: [
        { jp:'三時に来てください。', romaji:'Sanji ni kite kudasai.', id:'Tolong datang jam 3.' },
        { jp:'東京に行きます。', romaji:'Toukyou ni ikimasu.', id:'Pergi ke Tokyo.' },
        { jp:'友達に手紙を書きます。', romaji:'Tomodachi ni tegami wo kakimasu.', id:'Menulis surat kepada teman.' },
      ],
    },
    {
      id: 'de',
      pattern: '〜で〜',
      reading: 'で',
      meaning: 'di (tempat aktivitas) / dengan (alat/cara)',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel で digunakan untuk menunjukkan tempat terjadinya suatu aksi, atau alat/cara yang digunakan.',
      examples: [
        { jp:'図書館で勉強します。', romaji:'Toshokan de benkyou shimasu.', id:'Belajar di perpustakaan.' },
        { jp:'電車で行きます。', romaji:'Densha de ikimasu.', id:'Pergi naik kereta.' },
        { jp:'日本語で話してください。', romaji:'Nihongo de hanashite kudasai.', id:'Tolong berbicara dalam bahasa Jepang.' },
      ],
      notes: 'Perbedaan に vs で: に = tempat keberadaan, で = tempat aktivitas. "公園にいます" (berada di taman) vs "公園で遊びます" (bermain di taman).',
    },
    {
      id: 'mo',
      pattern: '〜も〜',
      reading: 'も',
      meaning: 'juga / pun',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel も berarti "juga" dan menggantikan partikel は atau が untuk menyatakan bahwa sesuatu berlaku sama.',
      examples: [
        { jp:'私も学生です。', romaji:'Watashi mo gakusei desu.', id:'Saya juga pelajar.' },
        { jp:'猫も犬も好きです。', romaji:'Neko mo inu mo suki desu.', id:'Saya suka kucing maupun anjing.' },
        { jp:'田中さんも来ますか？', romaji:'Tanaka-san mo kimasu ka?', id:'Apakah Tanaka-san juga datang?' },
      ],
    },
    {
      id: 'no',
      pattern: '〜の〜',
      reading: 'の',
      meaning: 'kepunyaan / hubungan',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel の menunjukkan kepemilikan atau hubungan antara dua kata benda.',
      examples: [
        { jp:'私の本です。', romaji:'Watashi no hon desu.', id:'Ini buku saya.' },
        { jp:'日本語の先生。', romaji:'Nihongo no sensei.', id:'Guru bahasa Jepang.' },
        { jp:'東京の電車は複雑です。', romaji:'Toukyou no densha wa fukuzatsu desu.', id:'Kereta Tokyo itu rumit.' },
      ],
    },
    {
      id: 'kara-made',
      pattern: '〜から〜まで',
      reading: 'から〜まで',
      meaning: 'dari ... sampai ...',
      level: 'N5',
      category: 'particles',
      explanation: 'から (kara) berarti "dari" dan まで (made) berarti "sampai". Keduanya sering dipakai bersama untuk menyatakan rentang waktu atau jarak.',
      examples: [
        { jp:'九時から五時まで働きます。', romaji:'Kuji kara goji made hatarakimasu.', id:'Bekerja dari jam 9 sampai jam 5.' },
        { jp:'東京から大阪まで。', romaji:'Toukyou kara Oosaka made.', id:'Dari Tokyo sampai Osaka.' },
        { jp:'月曜日から金曜日まで授業があります。', romaji:'Getsuyoubi kara Kinyoubi made jugyou ga arimasu.', id:'Ada pelajaran dari Senin sampai Jumat.' },
      ],
    },
    {
      id: 'to',
      pattern: '〜と〜',
      reading: 'と',
      meaning: 'dan / bersama',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel と digunakan untuk menghubungkan kata benda (dan) atau menunjukkan teman melakukan aksi (bersama dengan).',
      examples: [
        { jp:'猫と犬がいます。', romaji:'Neko to inu ga imasu.', id:'Ada kucing dan anjing.' },
        { jp:'友達と映画を見ます。', romaji:'Tomodachi to eiga wo mimasu.', id:'Menonton film bersama teman.' },
        { jp:'母と買い物に行きます。', romaji:'Haha to kaimono ni ikimasu.', id:'Pergi belanja bersama ibu.' },
      ],
    },
    {
      id: 'ya',
      pattern: '〜や〜',
      reading: 'や',
      meaning: 'dan ... (tidak lengkap)',
      level: 'N5',
      category: 'particles',
      explanation: 'Partikel や digunakan untuk menyebutkan beberapa contoh dari suatu kategori, menyiratkan masih ada yang lain (tidak terbatas).',
      examples: [
        { jp:'りんごやオレンジなど。', romaji:'Ringo ya orenji nado.', id:'Apel, jeruk, dan lain-lain.' },
        { jp:'学校やスーパーに行きます。', romaji:'Gakkou ya suupaa ni ikimasu.', id:'Pergi ke sekolah, supermarket, dsb.' },
      ],
      notes: 'と = dan (exhaustif, semua disebutkan). や = dan (tidak exhaustif, ada yang tidak disebutkan). Biasanya diikuti など (nado) = dan sebagainya.',
    },

    // ── Pola Kalimat ─────────────────────────────────────────
    {
      id: 'desu',
      pattern: '〜です',
      reading: 'です',
      meaning: 'adalah (kopula sopan)',
      level: 'N5',
      category: 'sentence',
      explanation: 'です adalah bentuk sopan dari kata kerja "to be" dalam bahasa Jepang. Digunakan di akhir kalimat.',
      examples: [
        { jp:'私は田中です。', romaji:'Watashi wa Tanaka desu.', id:'Saya adalah Tanaka.' },
        { jp:'これはペンです。', romaji:'Kore wa pen desu.', id:'Ini adalah pena.' },
        { jp:'今日は月曜日です。', romaji:'Kyou wa Getsuyoubi desu.', id:'Hari ini adalah Senin.' },
      ],
    },
    {
      id: 'dewa-nai',
      pattern: '〜ではありません / じゃないです',
      reading: 'ではありません',
      meaning: 'bukan (negasi)',
      level: 'N5',
      category: 'sentence',
      explanation: 'Bentuk negatif dari です. じゃないです lebih kasual, ではありません lebih formal.',
      examples: [
        { jp:'私は先生ではありません。', romaji:'Watashi wa sensei dewa arimasen.', id:'Saya bukan guru.' },
        { jp:'これはペンじゃないです。', romaji:'Kore wa pen ja nai desu.', id:'Ini bukan pena.' },
      ],
    },
    {
      id: 'masu',
      pattern: '〜ます / 〜ません',
      reading: 'ます・ません',
      meaning: 'bentuk sopan kata kerja (positif / negatif)',
      level: 'N5',
      category: 'sentence',
      explanation: 'Bentuk ます adalah bentuk sopan kata kerja untuk menyatakan kebiasaan atau fakta. ません adalah bentuk negatifnya.',
      examples: [
        { jp:'毎日勉強します。', romaji:'Mainichi benkyou shimasu.', id:'Belajar setiap hari.' },
        { jp:'お酒を飲みません。', romaji:'Osake wo nomimasen.', id:'Tidak minum alkohol.' },
        { jp:'肉は食べません。', romaji:'Niku wa tabemasen.', id:'Tidak makan daging.' },
      ],
    },
    {
      id: 'mashita',
      pattern: '〜ました / 〜ませんでした',
      reading: 'ました・ませんでした',
      meaning: 'bentuk lampau sopan (sudah / belum)',
      level: 'N5',
      category: 'tense',
      explanation: 'ました adalah bentuk lampau dari ます. ませんでした adalah bentuk lampau negatif.',
      examples: [
        { jp:'昨日映画を見ました。', romaji:'Kinou eiga wo mimashita.', id:'Kemarin menonton film.' },
        { jp:'宿題をしませんでした。', romaji:'Shukudai wo shimasen deshita.', id:'Tidak mengerjakan PR.' },
        { jp:'朝ごはんを食べませんでした。', romaji:'Asagohan wo tabemasen deshita.', id:'Tidak sarapan.' },
      ],
    },
    {
      id: 'imasu-arimasu',
      pattern: '〜がいます / 〜があります',
      reading: 'います・あります',
      meaning: 'ada (hidup / benda)',
      level: 'N5',
      category: 'sentence',
      explanation: 'います digunakan untuk makhluk hidup (manusia, hewan). あります untuk benda mati atau hal abstrak.',
      examples: [
        { jp:'犬がいます。', romaji:'Inu ga imasu.', id:'Ada anjing.' },
        { jp:'机の上に本があります。', romaji:'Tsukue no ue ni hon ga arimasu.', id:'Ada buku di atas meja.' },
        { jp:'公園に子供がいます。', romaji:'Kouen ni kodomo ga imasu.', id:'Ada anak-anak di taman.' },
      ],
      notes: 'います = ada (orang/hewan). あります = ada (benda/peristiwa). Penting: "hewan peliharaan" bisa pakai います.',
    },
    {
      id: 'nani-dare-doko-itsu',
      pattern: '何・誰・どこ・いつ',
      reading: 'なに・だれ・どこ・いつ',
      meaning: 'apa / siapa / di mana / kapan',
      level: 'N5',
      category: 'sentence',
      explanation: 'Kata tanya dasar dalam bahasa Jepang. Selalu ditempatkan di posisi yang sama dalam kalimat.',
      examples: [
        { jp:'これは何ですか？', romaji:'Kore wa nan desu ka?', id:'Ini apa?' },
        { jp:'あの人は誰ですか？', romaji:'Ano hito wa dare desu ka?', id:'Orang itu siapa?' },
        { jp:'学校はどこですか？', romaji:'Gakkou wa doko desu ka?', id:'Di mana sekolahnya?' },
      ],
    },
    {
      id: 'donna',
      pattern: 'どんな〜 / どう',
      reading: 'どんな・どう',
      meaning: 'seperti apa / bagaimana',
      level: 'N5',
      category: 'sentence',
      explanation: 'どんな digunakan sebelum kata benda untuk menanyakan jenis/sifatnya. どう menanyakan keadaan atau cara.',
      examples: [
        { jp:'どんな音楽が好きですか？', romaji:'Donna ongaku ga suki desu ka?', id:'Musik seperti apa yang kamu suka?' },
        { jp:'日本語はどうですか？', romaji:'Nihongo wa dou desu ka?', id:'Bagaimana bahasa Jepangnya?' },
      ],
    },

    // ── Waktu & Aspek ─────────────────────────────────────────
    {
      id: 'te-iru',
      pattern: '〜ています',
      reading: 'ています',
      meaning: 'sedang ... / sudah ... (keadaan)',
      level: 'N5',
      category: 'tense',
      explanation: '〜ています memiliki dua makna: (1) aksi yang sedang berlangsung, (2) keadaan yang berlanjut dari aksi sebelumnya.',
      examples: [
        { jp:'今、勉強しています。', romaji:'Ima, benkyou shite imasu.', id:'Sekarang sedang belajar.' },
        { jp:'結婚しています。', romaji:'Kekkon shite imasu.', id:'(Saya) sudah menikah.' },
        { jp:'雨が降っています。', romaji:'Ame ga futte imasu.', id:'Sedang hujan.' },
      ],
      notes: 'Aksi berkelanjutan: 勉強している (sedang belajar). Keadaan: 結婚している (sudah menikah/berstatus menikah).',
    },
    {
      id: 'tai',
      pattern: '〜たい',
      reading: 'たい',
      meaning: 'ingin ...',
      level: 'N5',
      category: 'tense',
      explanation: '〜たい ditambahkan pada bentuk stem kata kerja untuk menyatakan keinginan. Objeknya menggunakan が (bukan を) dalam bahasa sopan.',
      examples: [
        { jp:'寿司が食べたいです。', romaji:'Sushi ga tabetai desu.', id:'Saya ingin makan sushi.' },
        { jp:'日本に行きたいです。', romaji:'Nihon ni ikitai desu.', id:'Saya ingin pergi ke Jepang.' },
        { jp:'新しいスマホが欲しいです。', romaji:'Atarashii sumaho ga hoshii desu.', id:'Saya ingin smartphone baru.' },
      ],
      notes: 'たい untuk kata kerja, ほしい untuk kata benda.',
    },
    {
      id: 'mashou',
      pattern: '〜ましょう / 〜ましょうか',
      reading: 'ましょう',
      meaning: 'mari ... / bagaimana kalau ...',
      level: 'N5',
      category: 'tense',
      explanation: 'ましょう adalah ajakan untuk melakukan sesuatu bersama. ましょうか digunakan untuk menawarkan atau mengusulkan.',
      examples: [
        { jp:'一緒に食べましょう！', romaji:'Issho ni tabemashou!', id:'Mari makan bersama!' },
        { jp:'始めましょうか？', romaji:'Hajimemashou ka?', id:'Bagaimana kalau kita mulai?' },
        { jp:'休みましょう。', romaji:'Yasumimashou.', id:'Mari istirahat.' },
      ],
    },
    {
      id: 'te-kudasai',
      pattern: '〜てください',
      reading: 'てください',
      meaning: 'tolong ... (permintaan sopan)',
      level: 'N5',
      category: 'expression',
      explanation: '〜てください adalah cara sopan untuk meminta seseorang melakukan sesuatu. Dibuat dengan menambah ください pada bentuk て kata kerja.',
      examples: [
        { jp:'ゆっくり話してください。', romaji:'Yukkuri hanashite kudasai.', id:'Tolong bicara pelan-pelan.' },
        { jp:'ここに名前を書いてください。', romaji:'Koko ni namae wo kaite kudasai.', id:'Tolong tulis nama di sini.' },
        { jp:'待ってください！', romaji:'Matte kudasai!', id:'Tolong tunggu!' },
      ],
    },
    {
      id: 'naide-kudasai',
      pattern: '〜ないでください',
      reading: 'ないでください',
      meaning: 'tolong jangan ...',
      level: 'N5',
      category: 'expression',
      explanation: 'Bentuk negatif dari 〜てください. Digunakan untuk meminta seseorang agar tidak melakukan sesuatu.',
      examples: [
        { jp:'ここで写真を撮らないでください。', romaji:'Koko de shashin wo toranaide kudasai.', id:'Tolong jangan mengambil foto di sini.' },
        { jp:'遅れないでください。', romaji:'Okurenaide kudasai.', id:'Tolong jangan terlambat.' },
        { jp:'心配しないでください。', romaji:'Shinpaishinaide kudasai.', id:'Tolong jangan khawatir.' },
      ],
    },
    {
      id: 'koto-ga-dekiru',
      pattern: '〜ことができます',
      reading: 'ことができます',
      meaning: 'bisa / mampu ...',
      level: 'N4',
      category: 'tense',
      explanation: '〜ことができます menyatakan kemampuan. Bentuk kasualnya adalah 〜ができる. Juga bisa menggunakan stem kata kerja + られます untuk kata kerja ichidan.',
      examples: [
        { jp:'日本語を話すことができます。', romaji:'Nihongo wo hanasu koto ga dekimasu.', id:'Bisa berbicara bahasa Jepang.' },
        { jp:'料理することができます。', romaji:'Ryouri suru koto ga dekimasu.', id:'Bisa memasak.' },
        { jp:'泳ぐことができません。', romaji:'Oyogu koto ga dekimasen.', id:'Tidak bisa berenang.' },
      ],
    },

    // ── Menghubungkan ────────────────────────────────────────
    {
      id: 'te-form',
      pattern: '〜て〜 (Bentuk て)',
      reading: 'て形',
      meaning: 'menghubungkan aksi berurutan / cara',
      level: 'N5',
      category: 'linking',
      explanation: 'Bentuk て menghubungkan dua atau lebih kata kerja untuk menyatakan rangkaian aksi. Urutan kejadian mencerminkan urutan di kalimat.',
      examples: [
        { jp:'起きて、顔を洗って、朝ごはんを食べます。', romaji:'Okite, kao wo aratte, asagohan wo tabemasu.', id:'Bangun, cuci muka, lalu sarapan.' },
        { jp:'バスに乗って、学校に行きます。', romaji:'Basu ni notte, gakkou ni ikimasu.', id:'Naik bus, lalu pergi ke sekolah.' },
      ],
    },
    {
      id: 'ga-conjunction',
      pattern: '〜が、〜',
      reading: 'が (konjungsi)',
      meaning: 'tetapi / namun (di tengah kalimat)',
      level: 'N5',
      category: 'linking',
      explanation: 'が di tengah kalimat berfungsi sebagai konjungsi yang artinya "tetapi" atau "namun". Berbeda dengan が partikel subjek.',
      examples: [
        { jp:'日本語は難しいですが、楽しいです。', romaji:'Nihongo wa muzukashii desu ga, tanoshii desu.', id:'Bahasa Jepang itu sulit, tapi menyenangkan.' },
        { jp:'行きたいですが、お金がありません。', romaji:'Ikitai desu ga, okane ga arimasen.', id:'Ingin pergi, tapi tidak punya uang.' },
      ],
    },
    {
      id: 'kara',
      pattern: '〜から、〜',
      reading: 'から',
      meaning: 'karena ... (alasan)',
      level: 'N5',
      category: 'linking',
      explanation: 'から setelah kalimat lengkap menyatakan alasan. Berbeda dengan から partikel (dari).',
      examples: [
        { jp:'疲れたから、早く寝ます。', romaji:'Tsukareta kara, hayaku nemasu.', id:'Karena lelah, tidur lebih awal.' },
        { jp:'雨が降っているから、傘を持ってください。', romaji:'Ame ga futte iru kara, kasa wo motte kudasai.', id:'Karena hujan, tolong bawa payung.' },
      ],
    },
    {
      id: 'node',
      pattern: '〜ので、〜',
      reading: 'ので',
      meaning: 'karena ... (lebih sopan dari から)',
      level: 'N4',
      category: 'linking',
      explanation: 'ので juga berarti "karena" tapi lebih sopan dan objektif dibanding から. Cocok untuk situasi formal.',
      examples: [
        { jp:'用事があるので、先に帰ります。', romaji:'Youji ga aru node, saki ni kaerimasu.', id:'Karena ada keperluan, saya pulang duluan.' },
        { jp:'病気なので、学校を休みます。', romaji:'Byouki na node, gakkou wo yasumimasu.', id:'Karena sakit, absen sekolah.' },
      ],
    },
    {
      id: 'to-omou',
      pattern: '〜と思います',
      reading: 'とおもいます',
      meaning: 'saya pikir ... / saya rasa ...',
      level: 'N4',
      category: 'linking',
      explanation: 'と思います digunakan untuk menyatakan pendapat atau opini. Menggunakan bentuk biasa (bukan ます) sebelum と.',
      examples: [
        { jp:'明日は晴れると思います。', romaji:'Ashita wa hareru to omoimasu.', id:'Saya pikir besok akan cerah.' },
        { jp:'彼は来ないと思います。', romaji:'Kare wa konai to omoimasu.', id:'Saya rasa dia tidak akan datang.' },
        { jp:'日本語は面白いと思います。', romaji:'Nihongo wa omoshiroi to omoimasu.', id:'Saya pikir bahasa Jepang itu menarik.' },
      ],
    },
    {
      id: 'tari-tari',
      pattern: '〜たり〜たりします',
      reading: 'たりたり',
      meaning: 'melakukan hal ini, itu, dsb.',
      level: 'N4',
      category: 'linking',
      explanation: '〜たり〜たりします menyebutkan beberapa contoh aktivitas (tidak exhaustif). Dibuat dari bentuk lampau kata kerja + り.',
      examples: [
        { jp:'週末は映画を見たり、本を読んだりします。', romaji:'Shuumatsu wa eiga wo mitari, hon wo yondari shimasu.', id:'Di akhir pekan, menonton film, membaca buku, dan lain-lain.' },
        { jp:'歌を歌ったり、踊ったりします。', romaji:'Uta wo utattari, odottari shimasu.', id:'Bernyanyi, menari, dsb.' },
      ],
    },

    // ── Ekspresi Berguna ──────────────────────────────────────
    {
      id: 'te-mo-ii',
      pattern: '〜てもいいですか',
      reading: 'てもいいですか',
      meaning: 'boleh saya ...?',
      level: 'N5',
      category: 'expression',
      explanation: 'Digunakan untuk meminta izin melakukan sesuatu. Bentuk negatifnya 〜てはいけません = tidak boleh.',
      examples: [
        { jp:'ここに座ってもいいですか？', romaji:'Koko ni suwatte mo ii desu ka?', id:'Boleh saya duduk di sini?' },
        { jp:'写真を撮ってもいいですか？', romaji:'Shashin wo totte mo ii desu ka?', id:'Boleh saya mengambil foto?' },
        { jp:'質問してもいいですか？', romaji:'Shitsumon shite mo ii desu ka?', id:'Boleh saya bertanya?' },
      ],
    },
    {
      id: 'nakereba-naranai',
      pattern: '〜なければなりません',
      reading: 'なければなりません',
      meaning: 'harus ... (kewajiban)',
      level: 'N4',
      category: 'expression',
      explanation: 'Menyatakan kewajiban atau keharusan. Bentuk kasualnya adalah 〜なければならない atau 〜ないといけない.',
      examples: [
        { jp:'宿題をしなければなりません。', romaji:'Shukudai wo shinakereba narimasen.', id:'Harus mengerjakan PR.' },
        { jp:'早く起きなければなりません。', romaji:'Hayaku okinareba narimasen.', id:'Harus bangun lebih awal.' },
      ],
      notes: 'Bentuk kasual yang lebih umum: 〜ないといけない atau 〜なきゃ.',
    },
    {
      id: 'hoshii',
      pattern: '〜が欲しい',
      reading: 'がほしい',
      meaning: 'menginginkan (benda)',
      level: 'N5',
      category: 'expression',
      explanation: '欲しい digunakan untuk menyatakan keinginan terhadap benda (kata benda). Berbeda dengan たい yang digunakan untuk kata kerja.',
      examples: [
        { jp:'新しいカメラが欲しいです。', romaji:'Atarashii kamera ga hoshii desu.', id:'Saya ingin kamera baru.' },
        { jp:'何が欲しいですか？', romaji:'Nani ga hoshii desu ka?', id:'Kamu mau apa?' },
      ],
    },
    {
      id: 'dou-omoimasu',
      pattern: '〜はどうですか',
      reading: 'はどうですか',
      meaning: 'Bagaimana ... ? (tawaran/pendapat)',
      level: 'N5',
      category: 'expression',
      explanation: 'Digunakan untuk meminta pendapat atau menawarkan sesuatu kepada seseorang.',
      examples: [
        { jp:'コーヒーはどうですか？', romaji:'Koohii wa dou desu ka?', id:'Bagaimana (kalau minum) kopi?' },
        { jp:'日本語の勉強はどうですか？', romaji:'Nihongo no benkyou wa dou desu ka?', id:'Bagaimana pelajaran bahasa Jepangnya?' },
      ],
    },
    {
      id: 'n-desu',
      pattern: '〜んです / 〜のです',
      reading: 'んです',
      meaning: 'memberikan penjelasan / alasan',
      level: 'N4',
      category: 'expression',
      explanation: '〜んです (bentuk kasual) / 〜のです (bentuk formal) menambahkan nuansa penjelasan atau konteks. Sering menunjukkan bahwa pembicara sedang menjelaskan situasi.',
      examples: [
        { jp:'風邪をひいたんです。', romaji:'Kaze wo hiita n desu.', id:'(Penjelasan:) Saya masuk angin.' },
        { jp:'どうしたんですか？', romaji:'Dou shita n desu ka?', id:'Kenapa / Ada apa?' },
        { jp:'実は日本に行くんです。', romaji:'Jitsu wa Nihon ni iku n desu.', id:'Sebenarnya (saya) akan pergi ke Jepang.' },
      ],
    },
    {
      id: 'yori-hoga',
      pattern: '〜より〜の方が',
      reading: 'よりのほうが',
      meaning: '... lebih ... daripada ...',
      level: 'N4',
      category: 'expression',
      explanation: 'Digunakan untuk perbandingan. A より B の方が = B lebih ... daripada A.',
      examples: [
        { jp:'犬より猫の方が好きです。', romaji:'Inu yori neko no hou ga suki desu.', id:'Lebih suka kucing daripada anjing.' },
        { jp:'電車より車の方が便利です。', romaji:'Densha yori kuruma no hou ga benri desu.', id:'Mobil lebih praktis daripada kereta.' },
        { jp:'去年より今年の方が忙しいです。', romaji:'Kyonen yori kotoshi no hou ga isogashii desu.', id:'Tahun ini lebih sibuk daripada tahun lalu.' },
      ],
    },
    {
      id: 'ichiban',
      pattern: '〜が一番〜',
      reading: 'がいちばん',
      meaning: 'paling ... (superlative)',
      level: 'N4',
      category: 'expression',
      explanation: '一番 (ichiban) berarti "yang paling" dan digunakan untuk membentuk superlative (paling/ter-).',
      examples: [
        { jp:'日本語が一番好きです。', romaji:'Nihongo ga ichiban suki desu.', id:'Bahasa Jepang yang paling saya suka.' },
        { jp:'富士山は日本で一番高い山です。', romaji:'Fujisan wa Nihon de ichiban takai yama desu.', id:'Gunung Fuji adalah gunung tertinggi di Jepang.' },
      ],
    },
    {
      id: 'koto-ga-aru',
      pattern: '〜たことがあります',
      reading: 'たことがあります',
      meaning: 'pernah melakukan ...',
      level: 'N4',
      category: 'expression',
      explanation: '〜たことがあります menyatakan pengalaman yang pernah dilakukan. Menggunakan bentuk lampau kata kerja sebelum ことがあります.',
      examples: [
        { jp:'日本に行ったことがあります。', romaji:'Nihon ni itta koto ga arimasu.', id:'Saya pernah pergi ke Jepang.' },
        { jp:'寿司を食べたことがありますか？', romaji:'Sushi wo tabeta koto ga arimasu ka?', id:'Pernahkah kamu makan sushi?' },
        { jp:'富士山に登ったことがありません。', romaji:'Fujisan ni nobotta koto ga arimasen.', id:'Saya belum pernah mendaki Gunung Fuji.' },
      ],
    },
    {
      id: 'nagara',
      pattern: '〜ながら',
      reading: 'ながら',
      meaning: 'sambil ...',
      level: 'N4',
      category: 'linking',
      explanation: '〜ながら menunjukkan dua aksi yang dilakukan bersamaan oleh subjek yang sama. Aksi yang lebih minor/latarbelakang menggunakan ながら.',
      examples: [
        { jp:'音楽を聴きながら勉強します。', romaji:'Ongaku wo kikinagara benkyou shimasu.', id:'Belajar sambil mendengarkan musik.' },
        { jp:'歩きながら電話します。', romaji:'Arukinagara denwa shimasu.', id:'Menelepon sambil berjalan.' },
      ],
    },
    {
      id: 'deshita',
      pattern: '〜でした / 〜ではありませんでした',
      reading: 'でした',
      meaning: 'adalah (lampau) / bukan (lampau)',
      level: 'N5',
      category: 'tense',
      explanation: 'Bentuk lampau dari です. でした = adalah (dulu). ではありませんでした = bukan (dulu).',
      examples: [
        { jp:'昨日は休みでした。', romaji:'Kinou wa yasumi deshita.', id:'Kemarin adalah hari libur.' },
        { jp:'彼は学生でした。', romaji:'Kare wa gakusei deshita.', id:'Dia dulunya adalah pelajar.' },
        { jp:'天気は良くありませんでした。', romaji:'Tenki wa yoku arimasen deshita.', id:'Cuacanya tidak baik (waktu itu).' },
      ],
    },
    {
      id: 'souda',
      pattern: '〜そうです (様態)',
      reading: 'そうです',
      meaning: 'kelihatannya ...',
      level: 'N4',
      category: 'expression',
      explanation: '〜そうです dari pengamatan menyatakan kesan atau prediksi berdasarkan apa yang dilihat/dirasakan.',
      examples: [
        { jp:'このケーキはおいしそうです。', romaji:'Kono keeki wa oishisou desu.', id:'Kue ini kelihatannya enak.' },
        { jp:'雨が降りそうです。', romaji:'Ame ga furisou desu.', id:'Sepertinya mau hujan.' },
        { jp:'彼女は忙しそうです。', romaji:'Kanojo wa isogashisou desu.', id:'Dia kelihatannya sibuk.' },
      ],
    },
  ];

  function getByCategory(catId) {
    return patterns.filter(p => p.category === catId);
  }

  function getByLevel(level) {
    return patterns.filter(p => p.level === level);
  }

  function search(q) {
    const lq = q.toLowerCase();
    return patterns.filter(p =>
      p.pattern.includes(q) ||
      p.meaning.toLowerCase().includes(lq) ||
      p.explanation.toLowerCase().includes(lq)
    );
  }

  return { categories, patterns, getByCategory, getByLevel, search };
})();

window.JpGrammarData = JpGrammarData;
