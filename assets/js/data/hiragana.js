/**
 * NihonHan - Hiragana Data
 * 46 dasar + 25 dakuten/handakuten + 33 kombinasi (yoon) = 104 karakter
 */
const HiraganaData = (() => {

  const basic = [
    // Vowels
    { char:'あ', romaji:'a',  group:'vokal',  example:{ word:'あめ', reading:'ame',  meaning:'hujan' } },
    { char:'い', romaji:'i',  group:'vokal',  example:{ word:'いぬ', reading:'inu',  meaning:'anjing' } },
    { char:'う', romaji:'u',  group:'vokal',  example:{ word:'うみ', reading:'umi',  meaning:'laut' } },
    { char:'え', romaji:'e',  group:'vokal',  example:{ word:'えき', reading:'eki',  meaning:'stasiun' } },
    { char:'お', romaji:'o',  group:'vokal',  example:{ word:'おかし', reading:'okashi', meaning:'kue' } },
    // K
    { char:'か', romaji:'ka', group:'k', example:{ word:'かわ', reading:'kawa', meaning:'sungai' } },
    { char:'き', romaji:'ki', group:'k', example:{ word:'きく', reading:'kiku', meaning:'mendengar' } },
    { char:'く', romaji:'ku', group:'k', example:{ word:'くも', reading:'kumo', meaning:'awan' } },
    { char:'け', romaji:'ke', group:'k', example:{ word:'けむり', reading:'kemuri', meaning:'asap' } },
    { char:'こ', romaji:'ko', group:'k', example:{ word:'こえ', reading:'koe', meaning:'suara' } },
    // S
    { char:'さ', romaji:'sa', group:'s', example:{ word:'さかな', reading:'sakana', meaning:'ikan' } },
    { char:'し', romaji:'shi',group:'s', example:{ word:'しお', reading:'shio', meaning:'garam' } },
    { char:'す', romaji:'su', group:'s', example:{ word:'すし', reading:'sushi', meaning:'sushi' } },
    { char:'せ', romaji:'se', group:'s', example:{ word:'せかい', reading:'sekai', meaning:'dunia' } },
    { char:'そ', romaji:'so', group:'s', example:{ word:'そら', reading:'sora', meaning:'langit' } },
    // T
    { char:'た', romaji:'ta', group:'t', example:{ word:'たまご', reading:'tamago', meaning:'telur' } },
    { char:'ち', romaji:'chi',group:'t', example:{ word:'ちず', reading:'chizu', meaning:'peta' } },
    { char:'つ', romaji:'tsu',group:'t', example:{ word:'つき', reading:'tsuki', meaning:'bulan' } },
    { char:'て', romaji:'te', group:'t', example:{ word:'てがみ', reading:'tegami', meaning:'surat' } },
    { char:'と', romaji:'to', group:'t', example:{ word:'とり', reading:'tori', meaning:'burung' } },
    // N
    { char:'な', romaji:'na', group:'n', example:{ word:'なつ', reading:'natsu', meaning:'musim panas' } },
    { char:'に', romaji:'ni', group:'n', example:{ word:'にく', reading:'niku', meaning:'daging' } },
    { char:'ぬ', romaji:'nu', group:'n', example:{ word:'ぬの', reading:'nuno', meaning:'kain' } },
    { char:'ね', romaji:'ne', group:'n', example:{ word:'ねこ', reading:'neko', meaning:'kucing' } },
    { char:'の', romaji:'no', group:'n', example:{ word:'のり', reading:'nori', meaning:'rumput laut' } },
    // H
    { char:'は', romaji:'ha', group:'h', example:{ word:'はな', reading:'hana', meaning:'bunga' } },
    { char:'ひ', romaji:'hi', group:'h', example:{ word:'ひと', reading:'hito', meaning:'orang' } },
    { char:'ふ', romaji:'fu', group:'h', example:{ word:'ふね', reading:'fune', meaning:'kapal' } },
    { char:'へ', romaji:'he', group:'h', example:{ word:'へや', reading:'heya', meaning:'kamar' } },
    { char:'ほ', romaji:'ho', group:'h', example:{ word:'ほし', reading:'hoshi', meaning:'bintang' } },
    // M
    { char:'ま', romaji:'ma', group:'m', example:{ word:'まち', reading:'machi', meaning:'kota' } },
    { char:'み', romaji:'mi', group:'m', example:{ word:'みず', reading:'mizu', meaning:'air' } },
    { char:'む', romaji:'mu', group:'m', example:{ word:'むし', reading:'mushi', meaning:'serangga' } },
    { char:'め', romaji:'me', group:'m', example:{ word:'めがね', reading:'megane', meaning:'kacamata' } },
    { char:'も', romaji:'mo', group:'m', example:{ word:'もり', reading:'mori', meaning:'hutan' } },
    // Y
    { char:'や', romaji:'ya', group:'y', example:{ word:'やま', reading:'yama', meaning:'gunung' } },
    { char:'ゆ', romaji:'yu', group:'y', example:{ word:'ゆき', reading:'yuki', meaning:'salju' } },
    { char:'よ', romaji:'yo', group:'y', example:{ word:'よる', reading:'yoru', meaning:'malam' } },
    // R
    { char:'ら', romaji:'ra', group:'r', example:{ word:'らいねん', reading:'rainen', meaning:'tahun depan' } },
    { char:'り', romaji:'ri', group:'r', example:{ word:'りんご', reading:'ringo', meaning:'apel' } },
    { char:'る', romaji:'ru', group:'r', example:{ word:'るす', reading:'rusu', meaning:'tidak ada di rumah' } },
    { char:'れ', romaji:'re', group:'r', example:{ word:'れんしゅう', reading:'renshuu', meaning:'latihan' } },
    { char:'ろ', romaji:'ro', group:'r', example:{ word:'ろうか', reading:'rouka', meaning:'koridor' } },
    // W
    { char:'わ', romaji:'wa', group:'w', example:{ word:'わたし', reading:'watashi', meaning:'saya' } },
    { char:'を', romaji:'wo', group:'w', example:{ word:'(partikel objek)', reading:'wo', meaning:'partikel objek' } },
    // N standalone
    { char:'ん', romaji:'n',  group:'n-lone', example:{ word:'あんい', reading:"an'i", meaning:'mudah' } },
  ];

  const dakuten = [
    // G (か+dakuten)
    { char:'が', romaji:'ga', group:'g', base:'か', example:{ word:'がくせい', reading:'gakusei', meaning:'pelajar' } },
    { char:'ぎ', romaji:'gi', group:'g', base:'き', example:{ word:'ぎんこう', reading:'ginkou', meaning:'bank' } },
    { char:'ぐ', romaji:'gu', group:'g', base:'く', example:{ word:'ぐあい', reading:'guai', meaning:'kondisi' } },
    { char:'げ', romaji:'ge', group:'g', base:'け', example:{ word:'げんき', reading:'genki', meaning:'sehat/bersemangat' } },
    { char:'ご', romaji:'go', group:'g', base:'こ', example:{ word:'ごはん', reading:'gohan', meaning:'nasi/makan' } },
    // Z (さ+dakuten)
    { char:'ざ', romaji:'za', group:'z', base:'さ', example:{ word:'ざっし', reading:'zasshi', meaning:'majalah' } },
    { char:'じ', romaji:'ji', group:'z', base:'し', example:{ word:'じかん', reading:'jikan', meaning:'waktu' } },
    { char:'ず', romaji:'zu', group:'z', base:'す', example:{ word:'ずつう', reading:'zutsuu', meaning:'sakit kepala' } },
    { char:'ぜ', romaji:'ze', group:'z', base:'せ', example:{ word:'ぜんぶ', reading:'zenbu', meaning:'semuanya' } },
    { char:'ぞ', romaji:'zo', group:'z', base:'そ', example:{ word:'ぞう', reading:'zou', meaning:'gajah' } },
    // D (た+dakuten)
    { char:'だ', romaji:'da', group:'d', base:'た', example:{ word:'だいがく', reading:'daigaku', meaning:'universitas' } },
    { char:'ぢ', romaji:'di', group:'d', base:'ち', example:{ word:'はなぢ', reading:'hanadi', meaning:'mimisan' } },
    { char:'づ', romaji:'du', group:'d', base:'つ', example:{ word:'つづく', reading:'tsuduku', meaning:'berlanjut' } },
    { char:'で', romaji:'de', group:'d', base:'て', example:{ word:'でんわ', reading:'denwa', meaning:'telepon' } },
    { char:'ど', romaji:'do', group:'d', base:'と', example:{ word:'どこ', reading:'doko', meaning:'di mana' } },
    // B (は+dakuten)
    { char:'ば', romaji:'ba', group:'b', base:'は', example:{ word:'バス', reading:'basu', meaning:'bus' } },
    { char:'び', romaji:'bi', group:'b', base:'ひ', example:{ word:'びょういん', reading:'byouin', meaning:'rumah sakit' } },
    { char:'ぶ', romaji:'bu', group:'b', base:'ふ', example:{ word:'ぶん', reading:'bun', meaning:'kalimat' } },
    { char:'べ', romaji:'be', group:'b', base:'へ', example:{ word:'べんきょう', reading:'benkyou', meaning:'belajar' } },
    { char:'ぼ', romaji:'bo', group:'b', base:'ほ', example:{ word:'ぼうし', reading:'boushi', meaning:'topi' } },
    // P (は+handakuten)
    { char:'ぱ', romaji:'pa', group:'p', base:'は', example:{ word:'ぱん', reading:'pan', meaning:'roti' } },
    { char:'ぴ', romaji:'pi', group:'p', base:'ひ', example:{ word:'ぴかぴか', reading:'pikapika', meaning:'berkilau' } },
    { char:'ぷ', romaji:'pu', group:'p', base:'ふ', example:{ word:'ぷーる', reading:'puuru', meaning:'kolam renang' } },
    { char:'ぺ', romaji:'pe', group:'p', base:'へ', example:{ word:'ぺん', reading:'pen', meaning:'pena' } },
    { char:'ぽ', romaji:'po', group:'p', base:'ほ', example:{ word:'ぽすと', reading:'posuto', meaning:'kotak surat' } },
  ];

  const yoon = [
    // KY
    { char:'きゃ', romaji:'kya', group:'ky', example:{ word:'きゃく', reading:'kyaku', meaning:'tamu' } },
    { char:'きゅ', romaji:'kyu', group:'ky', example:{ word:'きゅう', reading:'kyuu', meaning:'sembilan' } },
    { char:'きょ', romaji:'kyo', group:'ky', example:{ word:'きょう', reading:'kyou', meaning:'hari ini' } },
    // SH
    { char:'しゃ', romaji:'sha', group:'sh', example:{ word:'しゃしん', reading:'shashin', meaning:'foto' } },
    { char:'しゅ', romaji:'shu', group:'sh', example:{ word:'しゅくだい', reading:'shukudai', meaning:'PR' } },
    { char:'しょ', romaji:'sho', group:'sh', example:{ word:'しょうがっこう', reading:'shougakkou', meaning:'SD' } },
    // CH
    { char:'ちゃ', romaji:'cha', group:'ch', example:{ word:'おちゃ', reading:'ocha', meaning:'teh' } },
    { char:'ちゅ', romaji:'chu', group:'ch', example:{ word:'ちゅうがく', reading:'chuugaku', meaning:'SMP' } },
    { char:'ちょ', romaji:'cho', group:'ch', example:{ word:'ちょっと', reading:'chotto', meaning:'sebentar' } },
    // NY
    { char:'にゃ', romaji:'nya', group:'ny', example:{ word:'にゃー', reading:'nyaa', meaning:'suara kucing' } },
    { char:'にゅ', romaji:'nyu', group:'ny', example:{ word:'にゅうがく', reading:'nyuugaku', meaning:'masuk sekolah' } },
    { char:'にょ', romaji:'nyo', group:'ny', example:{ word:'にょろにょろ', reading:'nyoronyoro', meaning:'berkelok' } },
    // HY
    { char:'ひゃ', romaji:'hya', group:'hy', example:{ word:'ひゃく', reading:'hyaku', meaning:'seratus' } },
    { char:'ひゅ', romaji:'hyu', group:'hy', example:{ word:'ひゅーひゅー', reading:'hyuuhyuu', meaning:'bunyi angin' } },
    { char:'ひょ', romaji:'hyo', group:'hy', example:{ word:'ひょう', reading:'hyou', meaning:'harimau/bagan' } },
    // MY
    { char:'みゃ', romaji:'mya', group:'my', example:{ word:'みゃく', reading:'myaku', meaning:'denyut nadi' } },
    { char:'みゅ', romaji:'myu', group:'my', example:{ word:'みゅーじっく', reading:'myuujikku', meaning:'musik' } },
    { char:'みょ', romaji:'myo', group:'my', example:{ word:'みょうじ', reading:'myouji', meaning:'nama keluarga' } },
    // RY
    { char:'りゃ', romaji:'rya', group:'ry', example:{ word:'りゃく', reading:'ryaku', meaning:'singkatan' } },
    { char:'りゅ', romaji:'ryu', group:'ry', example:{ word:'りゅう', reading:'ryuu', meaning:'naga' } },
    { char:'りょ', romaji:'ryo', group:'ry', example:{ word:'りょこう', reading:'ryokou', meaning:'perjalanan' } },
    // GY
    { char:'ぎゃ', romaji:'gya', group:'gy', example:{ word:'ぎゃく', reading:'gyaku', meaning:'terbalik' } },
    { char:'ぎゅ', romaji:'gyu', group:'gy', example:{ word:'ぎゅうにく', reading:'gyuuniku', meaning:'daging sapi' } },
    { char:'ぎょ', romaji:'gyo', group:'gy', example:{ word:'ぎょうざ', reading:'gyouza', meaning:'gyoza' } },
    // JY
    { char:'じゃ', romaji:'ja', group:'j', example:{ word:'じゃあ', reading:'jaa', meaning:'kalau begitu' } },
    { char:'じゅ', romaji:'ju', group:'j', example:{ word:'じゅう', reading:'juu', meaning:'sepuluh' } },
    { char:'じょ', romaji:'jo', group:'j', example:{ word:'じょし', reading:'joshi', meaning:'perempuan' } },
    // BY
    { char:'びゃ', romaji:'bya', group:'by', example:{ word:'びゃくや', reading:'byakuya', meaning:'malam terang' } },
    { char:'びゅ', romaji:'byu', group:'by', example:{ word:'びゅーびゅー', reading:'byuubyuu', meaning:'angin kencang' } },
    { char:'びょ', romaji:'byo', group:'by', example:{ word:'びょうき', reading:'byouki', meaning:'sakit' } },
    // PY
    { char:'ぴゃ', romaji:'pya', group:'py', example:{ word:'ぴゃー', reading:'pyaa', meaning:'suara kejut' } },
    { char:'ぴゅ', romaji:'pyu', group:'py', example:{ word:'ぴゅーぴゅー', reading:'pyuupyuu', meaning:'bunyi' } },
    { char:'ぴょ', romaji:'pyo', group:'py', example:{ word:'ぴょんぴょん', reading:'pyonpyon', meaning:'melompat-lompat' } },
  ];

  // Tambahkan type ke setiap karakter
  const all = [
    ...basic.map(c  => ({ ...c, type: 'basic'   })),
    ...dakuten.map(c => ({ ...c, type: 'dakuten' })),
    ...yoon.map(c   => ({ ...c, type: 'yoon'    })),
  ];

  return { basic, dakuten, yoon, all };
})();

window.HiraganaData = HiraganaData;
