/**
 * NihonHan — Data Dialog Bahasa Jepang
 * Format: situasi, percakapan A/B, romaji, terjemahan, kosakata kunci
 * Fase 17
 */
const JP_DIALOGS = [
  {
    id: 'restaurant',
    situasi: 'Di Restoran',
    icon: '🍜',
    level: 'N5',
    deskripsi: 'Percakapan saat memesan makanan di restoran Jepang.',
    lines: [
      {
        speaker: 'A',
        jp: 'すみません。',
        romaji: 'Sumimasen.',
        id: 'Permisi / Maaf mengganggu.'
      },
      {
        speaker: 'B',
        jp: 'はい、いらっしゃいませ。',
        romaji: 'Hai, irasshaimase.',
        id: 'Ya, selamat datang.'
      },
      {
        speaker: 'A',
        jp: 'メニューをもらえますか？',
        romaji: 'Menyuu o moraemasu ka?',
        id: 'Bisa saya minta menunya?'
      },
      {
        speaker: 'B',
        jp: 'どうぞ。ご注文はお決まりですか？',
        romaji: 'Douzo. Go-chuumon wa o-kimari desu ka?',
        id: 'Silakan. Apakah Anda sudah memilih pesanan?'
      },
      {
        speaker: 'A',
        jp: 'ラーメンをひとつと、餃子をふたつください。',
        romaji: 'Raamen o hitotsu to, gyouza o futatsu kudasai.',
        id: 'Satu ramen dan dua gyoza, tolong.'
      },
      {
        speaker: 'B',
        jp: 'かしこまりました。お飲み物はいかがですか？',
        romaji: 'Kashikomarimashita. O-nomimono wa ikaga desu ka?',
        id: 'Baik. Bagaimana dengan minumannya?'
      },
      {
        speaker: 'A',
        jp: 'お水をください。',
        romaji: 'O-mizu o kudasai.',
        id: 'Air putih saja, tolong.'
      },
      {
        speaker: 'B',
        jp: 'はい、少々お待ちください。',
        romaji: 'Hai, shoushou o-machi kudasai.',
        id: 'Baik, mohon tunggu sebentar.'
      },
      {
        speaker: 'A',
        jp: 'お会計をお願いします。',
        romaji: 'O-kaikei o onegaishimasu.',
        id: 'Tolong minta tagihan.'
      },
      {
        speaker: 'B',
        jp: '全部で１３００円になります。',
        romaji: 'Zenbu de senzenhyaku-en ni narimasu.',
        id: 'Total semuanya 1.300 yen.'
      }
    ],
    vocab: [
      { jp: 'すみません', romaji: 'sumimasen', id: 'permisi / maaf' },
      { jp: 'メニュー', romaji: 'menyuu', id: 'menu' },
      { jp: '注文', romaji: 'chuumon', id: 'pesanan' },
      { jp: '〜をください', romaji: '〜o kudasai', id: 'tolong beri saya 〜' },
      { jp: 'お会計', romaji: 'o-kaikei', id: 'tagihan / bill' },
      { jp: '全部で', romaji: 'zenbu de', id: 'total semuanya' }
    ]
  },
  {
    id: 'station',
    situasi: 'Di Stasiun',
    icon: '🚃',
    level: 'N5',
    deskripsi: 'Membeli tiket kereta dan menanyakan jadwal di stasiun.',
    lines: [
      {
        speaker: 'A',
        jp: 'すみません、東京駅まで一枚いくらですか？',
        romaji: 'Sumimasen, Toukyou-eki made ichimai ikura desu ka?',
        id: 'Permisi, satu lembar ke Stasiun Tokyo berapa?'
      },
      {
        speaker: 'B',
        jp: '２１０円です。',
        romaji: 'Nihyaku-juu-en desu.',
        id: '210 yen.'
      },
      {
        speaker: 'A',
        jp: '一枚ください。',
        romaji: 'Ichimai kudasai.',
        id: 'Satu lembar tolong.'
      },
      {
        speaker: 'B',
        jp: 'はい、どうぞ。',
        romaji: 'Hai, douzo.',
        id: 'Ya, silakan.'
      },
      {
        speaker: 'A',
        jp: '次の電車は何時ですか？',
        romaji: 'Tsugi no densha wa nanji desu ka?',
        id: 'Kereta berikutnya jam berapa?'
      },
      {
        speaker: 'B',
        jp: '３番線から１０時１５分発です。',
        romaji: 'San-ban-sen kara juuji juugofun hatsu desu.',
        id: 'Berangkat dari jalur 3 pukul 10.15.'
      },
      {
        speaker: 'A',
        jp: 'どのくらいかかりますか？',
        romaji: 'Dono kurai kakarimasu ka?',
        id: 'Berapa lama jaraknya?'
      },
      {
        speaker: 'B',
        jp: '約２０分です。',
        romaji: 'Yaku nijuppun desu.',
        id: 'Sekitar 20 menit.'
      }
    ],
    vocab: [
      { jp: '〜駅', romaji: '〜eki', id: 'Stasiun 〜' },
      { jp: '〜まで', romaji: '〜made', id: 'sampai 〜 / ke 〜' },
      { jp: '一枚', romaji: 'ichimai', id: 'satu lembar (tiket)' },
      { jp: '電車', romaji: 'densha', id: 'kereta listrik' },
      { jp: '何番線', romaji: 'nan-ban-sen', id: 'jalur nomor berapa' },
      { jp: '〜分発', romaji: '〜pun hatsu', id: 'berangkat pukul 〜 menit' },
      { jp: 'どのくらい', romaji: 'dono kurai', id: 'seberapa / berapa lama' }
    ]
  },
  {
    id: 'selfintro',
    situasi: 'Berkenalan',
    icon: '🤝',
    level: 'N5',
    deskripsi: 'Perkenalan diri pertama kali bertemu orang baru.',
    lines: [
      {
        speaker: 'A',
        jp: 'はじめまして。',
        romaji: 'Hajimemashite.',
        id: 'Senang berkenalan dengan Anda.'
      },
      {
        speaker: 'B',
        jp: 'はじめまして。',
        romaji: 'Hajimemashite.',
        id: 'Senang berkenalan juga.'
      },
      {
        speaker: 'A',
        jp: '私はアンディです。インドネシアから来ました。',
        romaji: 'Watashi wa Andi desu. Indoneshia kara kimashita.',
        id: 'Saya Andi. Saya datang dari Indonesia.'
      },
      {
        speaker: 'B',
        jp: '私は田中です。日本人です。どうぞよろしく。',
        romaji: 'Watashi wa Tanaka desu. Nihonjin desu. Douzo yoroshiku.',
        id: 'Saya Tanaka. Orang Jepang. Salam kenal.'
      },
      {
        speaker: 'A',
        jp: 'こちらこそ、よろしくお願いします。日本語を勉強しています。',
        romaji: 'Kochira koso, yoroshiku onegaishimasu. Nihongo o benkyou shite imasu.',
        id: 'Salam kenal juga. Saya sedang belajar bahasa Jepang.'
      },
      {
        speaker: 'B',
        jp: 'すごいですね。日本語が上手ですよ。',
        romaji: 'Sugoi desu ne. Nihongo ga jouzu desu yo.',
        id: 'Hebat ya. Bahasa Jepangnya bagus!'
      },
      {
        speaker: 'A',
        jp: 'いいえ、まだまだです。でも、頑張ります。',
        romaji: 'Iie, mada mada desu. Demo, ganbarimasu.',
        id: 'Tidak, masih jauh. Tapi saya akan berusaha.'
      },
      {
        speaker: 'B',
        jp: '頑張ってください！',
        romaji: 'Ganbatte kudasai!',
        id: 'Semangat!'
      }
    ],
    vocab: [
      { jp: 'はじめまして', romaji: 'hajimemashite', id: 'senang berkenalan' },
      { jp: '〜から来ました', romaji: '〜kara kimashita', id: 'datang dari 〜' },
      { jp: 'どうぞよろしく', romaji: 'douzo yoroshiku', id: 'salam kenal' },
      { jp: '勉強しています', romaji: 'benkyou shite imasu', id: 'sedang belajar' },
      { jp: '上手', romaji: 'jouzu', id: 'mahir / pandai' },
      { jp: 'まだまだ', romaji: 'mada mada', id: 'masih jauh / belum' },
      { jp: '頑張ります', romaji: 'ganbarimasu', id: 'akan berusaha' }
    ]
  },
  {
    id: 'shopping',
    situasi: 'Berbelanja',
    icon: '🛍️',
    level: 'N5',
    deskripsi: 'Percakapan saat berbelanja di toko.',
    lines: [
      {
        speaker: 'A',
        jp: 'すみません、このシャツはいくらですか？',
        romaji: 'Sumimasen, kono shatsu wa ikura desu ka?',
        id: 'Permisi, baju ini berapa harganya?'
      },
      {
        speaker: 'B',
        jp: '２８００円です。',
        romaji: 'Nisen happyaku-en desu.',
        id: '2.800 yen.'
      },
      {
        speaker: 'A',
        jp: 'もう少し安いものはありますか？',
        romaji: 'Mou sukoshi yasui mono wa arimasu ka?',
        id: 'Ada yang sedikit lebih murah?'
      },
      {
        speaker: 'B',
        jp: 'こちらは１５００円です。',
        romaji: 'Kochira wa senzenhyaku-en desu.',
        id: 'Ini 1.500 yen.'
      },
      {
        speaker: 'A',
        jp: 'サイズはMですか？',
        romaji: 'Saizu wa M desu ka?',
        id: 'Ukurannya M?'
      },
      {
        speaker: 'B',
        jp: 'S、M、Lがあります。どのサイズがよろしいですか？',
        romaji: 'S, M, L ga arimasu. Dono saizu ga yoroshii desu ka?',
        id: 'Ada S, M, L. Ukuran berapa yang diinginkan?'
      },
      {
        speaker: 'A',
        jp: 'Mをください。これにします。',
        romaji: 'M o kudasai. Kore ni shimasu.',
        id: 'Minta ukuran M. Saya pilih ini.'
      },
      {
        speaker: 'B',
        jp: 'ありがとうございます。袋はご利用ですか？',
        romaji: 'Arigatou gozaimasu. Fukuro wa go-riyou desu ka?',
        id: 'Terima kasih. Apakah butuh kantong?'
      },
      {
        speaker: 'A',
        jp: 'はい、お願いします。',
        romaji: 'Hai, onegaishimasu.',
        id: 'Ya, tolong.'
      }
    ],
    vocab: [
      { jp: 'いくら', romaji: 'ikura', id: 'berapa harganya' },
      { jp: '安い', romaji: 'yasui', id: 'murah' },
      { jp: 'サイズ', romaji: 'saizu', id: 'ukuran' },
      { jp: '〜にします', romaji: '〜ni shimasu', id: 'saya pilih 〜' },
      { jp: '袋', romaji: 'fukuro', id: 'kantong / tas belanja' },
      { jp: 'ご利用', romaji: 'go-riyou', id: 'menggunakan (sopan)' }
    ]
  },
  {
    id: 'directions',
    situasi: 'Menanyakan Arah',
    icon: '🗺️',
    level: 'N5',
    deskripsi: 'Cara bertanya dan memberi petunjuk arah.',
    lines: [
      {
        speaker: 'A',
        jp: 'すみません、郵便局はどこですか？',
        romaji: 'Sumimasen, yuubinkyoku wa doko desu ka?',
        id: 'Permisi, di mana kantor pos?'
      },
      {
        speaker: 'B',
        jp: 'この道をまっすぐ行ってください。',
        romaji: 'Kono michi o massugu itte kudasai.',
        id: 'Lurus saja di jalan ini.'
      },
      {
        speaker: 'A',
        jp: 'どのくらいかかりますか？',
        romaji: 'Dono kurai kakarimasu ka?',
        id: 'Berapa lama / jauh?'
      },
      {
        speaker: 'B',
        jp: '歩いて約５分です。信号を右に曲がって、左側にあります。',
        romaji: 'Aruite yaku gofun desu. Shingou o migi ni magatte, hidari-gawa ni arimasu.',
        id: 'Sekitar 5 menit jalan kaki. Belok kanan di lampu merah, ada di sebelah kiri.'
      },
      {
        speaker: 'A',
        jp: 'ありがとうございます。分かりました。',
        romaji: 'Arigatou gozaimasu. Wakarimashita.',
        id: 'Terima kasih. Saya mengerti.'
      },
      {
        speaker: 'B',
        jp: 'いいえ、どういたしまして。',
        romaji: 'Iie, douitashimashite.',
        id: 'Tidak, sama-sama.'
      }
    ],
    vocab: [
      { jp: 'どこ', romaji: 'doko', id: 'di mana' },
      { jp: 'まっすぐ', romaji: 'massugu', id: 'lurus' },
      { jp: '右/左', romaji: 'migi/hidari', id: 'kanan/kiri' },
      { jp: '曲がる', romaji: 'magaru', id: 'belok' },
      { jp: '信号', romaji: 'shingou', id: 'lampu lalu lintas' },
      { jp: '〜側', romaji: '〜gawa', id: 'sisi 〜' },
      { jp: '歩いて', romaji: 'aruite', id: 'berjalan kaki' }
    ]
  },
  {
    id: 'hospital',
    situasi: 'Di Dokter / Rumah Sakit',
    icon: '🏥',
    level: 'N4',
    deskripsi: 'Menjelaskan gejala sakit dan berkomunikasi dengan dokter.',
    lines: [
      {
        speaker: 'A',
        jp: '頭が痛くて、熱があります。',
        romaji: 'Atama ga itakute, netsu ga arimasu.',
        id: 'Kepala saya sakit dan saya demam.'
      },
      {
        speaker: 'B',
        jp: 'いつからですか？',
        romaji: 'Itsu kara desu ka?',
        id: 'Sejak kapan?'
      },
      {
        speaker: 'A',
        jp: '昨日の夜からです。のども痛いです。',
        romaji: 'Kinou no yoru kara desu. Nodo mo itai desu.',
        id: 'Sejak tadi malam. Tenggorokan saya juga sakit.'
      },
      {
        speaker: 'B',
        jp: 'アレルギーはありますか？',
        romaji: 'Arerugii wa arimasu ka?',
        id: 'Apakah Anda punya alergi?'
      },
      {
        speaker: 'A',
        jp: 'いいえ、ありません。',
        romaji: 'Iie, arimasen.',
        id: 'Tidak ada.'
      },
      {
        speaker: 'B',
        jp: 'では、喉の検査をしましょう。口を開けてください。',
        romaji: 'Dewa, nodo no kensa o shimashou. Kuchi o akete kudasai.',
        id: 'Baiklah, mari periksa tenggorokan. Tolong buka mulutnya.'
      },
      {
        speaker: 'A',
        jp: 'はい。',
        romaji: 'Hai.',
        id: 'Ya.'
      },
      {
        speaker: 'B',
        jp: '風邪ですね。薬を出しますので、三日間飲んでください。',
        romaji: 'Kaze desu ne. Kusuri o dashimasu no de, mikkakan nonde kudasai.',
        id: 'Ini flu. Saya akan beri obat, tolong diminum selama 3 hari.'
      },
      {
        speaker: 'A',
        jp: 'ありがとうございます。',
        romaji: 'Arigatou gozaimasu.',
        id: 'Terima kasih, Dokter.'
      }
    ],
    vocab: [
      { jp: '頭が痛い', romaji: 'atama ga itai', id: 'sakit kepala' },
      { jp: '熱がある', romaji: 'netsu ga aru', id: 'demam' },
      { jp: '喉', romaji: 'nodo', id: 'tenggorokan' },
      { jp: 'アレルギー', romaji: 'arerugii', id: 'alergi' },
      { jp: '検査', romaji: 'kensa', id: 'pemeriksaan' },
      { jp: '風邪', romaji: 'kaze', id: 'flu / masuk angin' },
      { jp: '薬', romaji: 'kusuri', id: 'obat' }
    ]
  },
  {
    id: 'workplace',
    situasi: 'Di Tempat Kerja',
    icon: '💼',
    level: 'N4',
    deskripsi: 'Percakapan formal di kantor dan rapat.',
    lines: [
      {
        speaker: 'A',
        jp: '山田部長、会議の資料を確認していただけますか？',
        romaji: 'Yamada buchou, kaigi no shiryou o kakunin shite itadakemasu ka?',
        id: 'Manajer Yamada, bisakah Anda memeriksa materi rapat ini?'
      },
      {
        speaker: 'B',
        jp: 'はい、見ておきます。会議は何時からですか？',
        romaji: 'Hai, mite okimasu. Kaigi wa nanji kara desu ka?',
        id: 'Ya, akan saya lihat. Rapatnya jam berapa?'
      },
      {
        speaker: 'A',
        jp: '午後２時からです。会議室Aでお願いします。',
        romaji: 'Gogo niji kara desu. Kaigishitsu A de onegaishimasu.',
        id: 'Mulai jam 2 sore. Di ruang rapat A, tolong.'
      },
      {
        speaker: 'B',
        jp: 'わかりました。田中さんも参加しますか？',
        romaji: 'Wakarimashita. Tanaka-san mo sanka shimasu ka?',
        id: 'Mengerti. Apakah Tanaka juga hadir?'
      },
      {
        speaker: 'A',
        jp: 'はい、全員参加する予定です。',
        romaji: 'Hai, zen\'in sanka suru yotei desu.',
        id: 'Ya, semua orang dijadwalkan hadir.'
      },
      {
        speaker: 'B',
        jp: 'では、後でメールを送ってください。',
        romaji: 'Dewa, ato de meeru o okutte kudasai.',
        id: 'Baiklah, tolong kirim email nanti.'
      }
    ],
    vocab: [
      { jp: '会議', romaji: 'kaigi', id: 'rapat' },
      { jp: '資料', romaji: 'shiryou', id: 'materi / dokumen' },
      { jp: '確認する', romaji: 'kakunin suru', id: 'memeriksa / memastikan' },
      { jp: '部長', romaji: 'buchou', id: 'manajer / kepala bagian' },
      { jp: '参加する', romaji: 'sanka suru', id: 'berpartisipasi / hadir' },
      { jp: '予定', romaji: 'yotei', id: 'jadwal / rencana' },
      { jp: 'メールを送る', romaji: 'meeru o okuru', id: 'mengirim email' }
    ]
  },
  {
    id: 'phone',
    situasi: 'Percakapan Telepon',
    icon: '📞',
    level: 'N4',
    deskripsi: 'Berkomunikasi melalui telepon secara formal.',
    lines: [
      {
        speaker: 'B',
        jp: 'はい、山田商事でございます。',
        romaji: 'Hai, Yamada Shouji de gozaimasu.',
        id: 'Halo, ini Yamada Trading.'
      },
      {
        speaker: 'A',
        jp: 'もしもし、私はアンディと申します。鈴木様はいらっしゃいますか？',
        romaji: 'Moshi moshi, watashi wa Andi to moushimasu. Suzuki-sama wa irasshaimasu ka?',
        id: 'Halo, nama saya Andi. Apakah Pak/Bu Suzuki ada?'
      },
      {
        speaker: 'B',
        jp: 'ただいま席を外しております。折り返しお電話いたしましょうか？',
        romaji: 'Tadaima seki o hazushite orimasu. Orikaeshi o-denwa itashimashou ka?',
        id: 'Beliau sedang tidak di tempat. Apakah kami bisa menelepon balik?'
      },
      {
        speaker: 'A',
        jp: 'はい、お願いします。電話番号は０８１２－３４５６－７８９０です。',
        romaji: 'Hai, onegaishimasu. Denwa bangou wa 0812-3456-7890 desu.',
        id: 'Ya, tolong. Nomor telepon saya 0812-3456-7890.'
      },
      {
        speaker: 'B',
        jp: 'かしこまりました。伝言はございますか？',
        romaji: 'Kashikomarimashita. Dengon wa gozaimasu ka?',
        id: 'Baik. Apakah ada pesan yang ingin disampaikan?'
      },
      {
        speaker: 'A',
        jp: '明日の会議の件でお電話しました、とお伝えください。',
        romaji: 'Ashita no kaigi no ken de o-denwa shimashita, to otsutae kudasai.',
        id: 'Tolong sampaikan bahwa saya menelepon tentang rapat besok.'
      },
      {
        speaker: 'B',
        jp: 'かしこまりました。では、失礼いたします。',
        romaji: 'Kashikomarimashita. Dewa, shitsurei itashimasu.',
        id: 'Baik. Permisi kalau begitu.'
      }
    ],
    vocab: [
      { jp: 'もしもし', romaji: 'moshi moshi', id: 'halo (di telepon)' },
      { jp: '〜と申します', romaji: '〜to moushimasu', id: 'nama saya 〜 (formal)' },
      { jp: 'いらっしゃいますか', romaji: 'irasshaimasu ka', id: 'apakah ada? (hormat)' },
      { jp: '席を外す', romaji: 'seki o hazusu', id: 'tidak di tempat' },
      { jp: '折り返し', romaji: 'orikaeshi', id: 'menelepon balik' },
      { jp: '伝言', romaji: 'dengon', id: 'pesan (lisan)' },
      { jp: '失礼いたします', romaji: 'shitsurei itashimasu', id: 'permisi (salam penutup)' }
    ]
  }
];

if (typeof module !== 'undefined') module.exports = JP_DIALOGS;
