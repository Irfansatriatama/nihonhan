/**
 * NihonHan - Pinyin Data
 * 21 inisial + 38 final + kombinasi lengkap
 * Format inisial/final: { symbol, ipa, desc, example: { word, meaning } }
 * Format kombinasi: { pinyin, initial, final, example: { word, hanzi, meaning } }
 */
const PinyinData = (() => {

  const initials = [
    { symbol:'b',  ipa:'p',   desc:'seperti "b" dalam "bola"',       example:{ word:'bā',  hanzi:'八', meaning:'delapan' } },
    { symbol:'p',  ipa:'pʰ',  desc:'seperti "p" dalam "pagi"',       example:{ word:'pá',  hanzi:'爬', meaning:'merangkak' } },
    { symbol:'m',  ipa:'m',   desc:'seperti "m" dalam "makan"',      example:{ word:'mā',  hanzi:'妈', meaning:'ibu' } },
    { symbol:'f',  ipa:'f',   desc:'seperti "f" dalam "foto"',       example:{ word:'fā',  hanzi:'发', meaning:'mengirim' } },
    { symbol:'d',  ipa:'t',   desc:'seperti "d" dalam "dua"',        example:{ word:'dà',  hanzi:'大', meaning:'besar' } },
    { symbol:'t',  ipa:'tʰ',  desc:'seperti "t" dalam "tiga"',       example:{ word:'tā',  hanzi:'他', meaning:'dia (L)' } },
    { symbol:'n',  ipa:'n',   desc:'seperti "n" dalam "nama"',       example:{ word:'nǐ',  hanzi:'你', meaning:'kamu' } },
    { symbol:'l',  ipa:'l',   desc:'seperti "l" dalam "laut"',       example:{ word:'lái', hanzi:'来', meaning:'datang' } },
    { symbol:'g',  ipa:'k',   desc:'seperti "g" dalam "gula"',       example:{ word:'gē',  hanzi:'哥', meaning:'kakak laki-laki' } },
    { symbol:'k',  ipa:'kʰ',  desc:'seperti "k" dalam "kaki"',       example:{ word:'kāi', hanzi:'开', meaning:'membuka' } },
    { symbol:'h',  ipa:'x',   desc:'seperti "h" dalam "hari" (lebih berat)', example:{ word:'hǎo', hanzi:'好', meaning:'baik' } },
    { symbol:'j',  ipa:'tɕ',  desc:'seperti "j" dalam "jalan" (palatalisasi)', example:{ word:'jiā', hanzi:'家', meaning:'rumah/keluarga' } },
    { symbol:'q',  ipa:'tɕʰ', desc:'seperti "c" dalam "cita" (palatalisasi)', example:{ word:'qù',  hanzi:'去', meaning:'pergi' } },
    { symbol:'x',  ipa:'ɕ',   desc:'seperti "s" dalam "siap" (palatalisasi)',  example:{ word:'xué', hanzi:'学', meaning:'belajar' } },
    { symbol:'zh', ipa:'ʈʂ',  desc:'"j" dengan lidah ditekuk ke belakang',     example:{ word:'zhè', hanzi:'这', meaning:'ini' } },
    { symbol:'ch', ipa:'ʈʂʰ', desc:'"ch" dengan lidah ditekuk ke belakang',   example:{ word:'chī', hanzi:'吃', meaning:'makan' } },
    { symbol:'sh', ipa:'ʂ',   desc:'"sh" dengan lidah ditekuk ke belakang',   example:{ word:'shū', hanzi:'书', meaning:'buku' } },
    { symbol:'r',  ipa:'ɻ',   desc:'campuran "r" dan "zh"',                   example:{ word:'rén', hanzi:'人', meaning:'orang' } },
    { symbol:'z',  ipa:'ts',  desc:'seperti "dz" dalam "dzikir"',             example:{ word:'zài', hanzi:'在', meaning:'ada/di' } },
    { symbol:'c',  ipa:'tsʰ', desc:'seperti "ts" dalam "tsunami"',            example:{ word:'cài', hanzi:'菜', meaning:'sayuran' } },
    { symbol:'s',  ipa:'s',   desc:'seperti "s" dalam "satu"',                example:{ word:'sān', hanzi:'三', meaning:'tiga' } },
  ];

  const finals = [
    // Simple finals
    { symbol:'a',   desc:'vokal "a" terbuka',                  example:{ word:'māo', hanzi:'猫', meaning:'kucing' } },
    { symbol:'o',   desc:'vokal "o" bulat',                    example:{ word:'wǒ',  hanzi:'我', meaning:'saya' } },
    { symbol:'e',   desc:'vokal "e" tengah',                   example:{ word:'hé',  hanzi:'和', meaning:'dan' } },
    { symbol:'i',   desc:'vokal "i" depan',                    example:{ word:'nǐ',  hanzi:'你', meaning:'kamu' } },
    { symbol:'u',   desc:'vokal "u" bulat belakang',           example:{ word:'shū', hanzi:'书', meaning:'buku' } },
    { symbol:'ü',   desc:'vokal "u" dengan bibir maju (seperti Prancis "tu")', example:{ word:'yú', hanzi:'鱼', meaning:'ikan' } },
    // Compound finals
    { symbol:'ai',  desc:'"a" + "i"',  example:{ word:'ài',   hanzi:'爱', meaning:'cinta' } },
    { symbol:'ei',  desc:'"e" + "i"',  example:{ word:'fēi',  hanzi:'飞', meaning:'terbang' } },
    { symbol:'ui',  desc:'"u" + "ei"', example:{ word:'duì',  hanzi:'对', meaning:'benar' } },
    { symbol:'ao',  desc:'"a" + "o"',  example:{ word:'hǎo',  hanzi:'好', meaning:'baik' } },
    { symbol:'ou',  desc:'"o" + "u"',  example:{ word:'yǒu',  hanzi:'有', meaning:'ada/punya' } },
    { symbol:'iu',  desc:'"i" + "ou"', example:{ word:'jiǔ',  hanzi:'九', meaning:'sembilan' } },
    { symbol:'ie',  desc:'"i" + "e"',  example:{ word:'xiě',  hanzi:'写', meaning:'menulis' } },
    { symbol:'üe',  desc:'"ü" + "e"',  example:{ word:'yuè',  hanzi:'月', meaning:'bulan' } },
    { symbol:'er',  desc:'"e" + rhotic', example:{ word:'ér', hanzi:'儿', meaning:'anak' } },
    // Nasal finals
    { symbol:'an',  desc:'"a" + "n"',  example:{ word:'nán',  hanzi:'难', meaning:'sulit' } },
    { symbol:'en',  desc:'"e" + "n"',  example:{ word:'rén',  hanzi:'人', meaning:'orang' } },
    { symbol:'in',  desc:'"i" + "n"',  example:{ word:'xīn',  hanzi:'心', meaning:'hati' } },
    { symbol:'un',  desc:'"u" + "n"',  example:{ word:'wèn',  hanzi:'问', meaning:'bertanya' } },
    { symbol:'ün',  desc:'"ü" + "n"',  example:{ word:'yùn',  hanzi:'运', meaning:'nasib' } },
    { symbol:'ang', desc:'"a" + "ng"', example:{ word:'máng', hanzi:'忙', meaning:'sibuk' } },
    { symbol:'eng', desc:'"e" + "ng"', example:{ word:'néng', hanzi:'能', meaning:'bisa' } },
    { symbol:'ing', desc:'"i" + "ng"', example:{ word:'míng', hanzi:'名', meaning:'nama' } },
    { symbol:'ong', desc:'"o" + "ng"', example:{ word:'tóng', hanzi:'同', meaning:'sama' } },
    // Special
    { symbol:'ia',  desc:'"i" + "a"',  example:{ word:'jiā',  hanzi:'家', meaning:'rumah' } },
    { symbol:'ua',  desc:'"u" + "a"',  example:{ word:'huā',  hanzi:'花', meaning:'bunga' } },
    { symbol:'uo',  desc:'"u" + "o"',  example:{ word:'zuò',  hanzi:'坐', meaning:'duduk' } },
    { symbol:'iao', desc:'"i"+"a"+"o"', example:{ word:'xiǎo', hanzi:'小', meaning:'kecil' } },
    { symbol:'uai', desc:'"u"+"a"+"i"', example:{ word:'kuài', hanzi:'快', meaning:'cepat' } },
    { symbol:'uan', desc:'"u" + "an"', example:{ word:'wán',  hanzi:'完', meaning:'selesai' } },
    { symbol:'ian', desc:'"i" + "an"', example:{ word:'tiān', hanzi:'天', meaning:'langit/hari' } },
    { symbol:'üan', desc:'"ü" + "an"', example:{ word:'yuān', hanzi:'冤', meaning:'tidak adil' } },
    { symbol:'iang',desc:'"i"+"a"+"ng"', example:{ word:'liǎng', hanzi:'两', meaning:'dua (jumlah)' } },
    { symbol:'uang',desc:'"u"+"a"+"ng"', example:{ word:'wǎng',  hanzi:'网', meaning:'jaringan/internet' } },
    { symbol:'iong',desc:'"i"+"o"+"ng"', example:{ word:'yòng',  hanzi:'用', meaning:'menggunakan' } },
    { symbol:'ueng',desc:'"u"+"e"+"ng"', example:{ word:'wēng',  hanzi:'翁', meaning:'orang tua laki-laki' } },
    { symbol:'iou', desc:'"i"+"o"+"u"',  example:{ word:'niú',   hanzi:'牛', meaning:'sapi' } },
  ];

  // Kombinasi penting (subset yang paling sering dipakai)
  const combinations = [
    // b combinations
    { pinyin:'bā',  initial:'b', final:'a',  tone:1, example:{ word:'bā', hanzi:'八', meaning:'delapan' } },
    { pinyin:'bái', initial:'b', final:'ai', tone:2, example:{ word:'bái', hanzi:'白', meaning:'putih' } },
    { pinyin:'bǎo', initial:'b', final:'ao', tone:3, example:{ word:'bǎo', hanzi:'饱', meaning:'kenyang' } },
    { pinyin:'bèi', initial:'b', final:'ei', tone:4, example:{ word:'bèi', hanzi:'被', meaning:'oleh / selimut' } },
    { pinyin:'bān', initial:'b', final:'an', tone:1, example:{ word:'bān', hanzi:'班', meaning:'kelas' } },
    { pinyin:'bǐ',  initial:'b', final:'i',  tone:3, example:{ word:'bǐ', hanzi:'笔', meaning:'pena' } },
    { pinyin:'bù',  initial:'b', final:'u',  tone:4, example:{ word:'bù', hanzi:'不', meaning:'tidak' } },
    // m combinations
    { pinyin:'māo', initial:'m', final:'ao', tone:1, example:{ word:'māo', hanzi:'猫', meaning:'kucing' } },
    { pinyin:'mā',  initial:'m', final:'a',  tone:1, example:{ word:'mā',  hanzi:'妈', meaning:'ibu' } },
    { pinyin:'méi', initial:'m', final:'ei', tone:2, example:{ word:'méi', hanzi:'没', meaning:'tidak ada' } },
    { pinyin:'mén', initial:'m', final:'en', tone:2, example:{ word:'mén', hanzi:'门', meaning:'pintu' } },
    { pinyin:'míng',initial:'m', final:'ing',tone:2, example:{ word:'míng',hanzi:'名', meaning:'nama' } },
    // d combinations
    { pinyin:'dà',  initial:'d', final:'a',  tone:4, example:{ word:'dà',  hanzi:'大', meaning:'besar' } },
    { pinyin:'dōu', initial:'d', final:'ou', tone:1, example:{ word:'dōu', hanzi:'都', meaning:'semua' } },
    { pinyin:'duì', initial:'d', final:'ui', tone:4, example:{ word:'duì', hanzi:'对', meaning:'benar' } },
    { pinyin:'diǎn',initial:'d', final:'ian',tone:3, example:{ word:'diǎn',hanzi:'点', meaning:'titik/poin' } },
    // n combinations
    { pinyin:'nǐ',  initial:'n', final:'i',  tone:3, example:{ word:'nǐ',  hanzi:'你', meaning:'kamu' } },
    { pinyin:'nán', initial:'n', final:'an', tone:2, example:{ word:'nán', hanzi:'男', meaning:'laki-laki' } },
    { pinyin:'néng',initial:'n', final:'eng',tone:2, example:{ word:'néng',hanzi:'能', meaning:'bisa' } },
    { pinyin:'nǚ',  initial:'n', final:'ü',  tone:3, example:{ word:'nǚ',  hanzi:'女', meaning:'perempuan' } },
    // l combinations
    { pinyin:'lái', initial:'l', final:'ai', tone:2, example:{ word:'lái', hanzi:'来', meaning:'datang' } },
    { pinyin:'lǎo', initial:'l', final:'ao', tone:3, example:{ word:'lǎo', hanzi:'老', meaning:'tua' } },
    { pinyin:'lèi', initial:'l', final:'ei', tone:4, example:{ word:'lèi', hanzi:'累', meaning:'lelah' } },
    { pinyin:'liǎng',initial:'l',final:'iang',tone:3, example:{ word:'liǎng',hanzi:'两', meaning:'dua (jumlah)' } },
    // g combinations
    { pinyin:'gāo', initial:'g', final:'ao', tone:1, example:{ word:'gāo', hanzi:'高', meaning:'tinggi' } },
    { pinyin:'gège',initial:'g', final:'e',  tone:4, example:{ word:'gège',hanzi:'哥哥', meaning:'kakak laki-laki' } },
    { pinyin:'guó', initial:'g', final:'uo', tone:2, example:{ word:'guó', hanzi:'国', meaning:'negara' } },
    // h combinations
    { pinyin:'hǎo', initial:'h', final:'ao', tone:3, example:{ word:'hǎo', hanzi:'好', meaning:'baik' } },
    { pinyin:'hé',  initial:'h', final:'e',  tone:2, example:{ word:'hé',  hanzi:'和', meaning:'dan' } },
    { pinyin:'huā', initial:'h', final:'ua', tone:1, example:{ word:'huā', hanzi:'花', meaning:'bunga' } },
    { pinyin:'huí', initial:'h', final:'ui', tone:2, example:{ word:'huí', hanzi:'回', meaning:'kembali' } },
    // j combinations
    { pinyin:'jiā', initial:'j', final:'ia', tone:1, example:{ word:'jiā', hanzi:'家', meaning:'rumah/keluarga' } },
    { pinyin:'jiǔ', initial:'j', final:'iu', tone:3, example:{ word:'jiǔ', hanzi:'九', meaning:'sembilan' } },
    { pinyin:'jīn', initial:'j', final:'in', tone:1, example:{ word:'jīn', hanzi:'今', meaning:'sekarang' } },
    // q combinations
    { pinyin:'qù',  initial:'q', final:'u',  tone:4, example:{ word:'qù',  hanzi:'去', meaning:'pergi' } },
    { pinyin:'qǐng',initial:'q', final:'ing',tone:3, example:{ word:'qǐng',hanzi:'请', meaning:'silakan/tolong' } },
    { pinyin:'qián',initial:'q', final:'ian',tone:2, example:{ word:'qián',hanzi:'钱', meaning:'uang' } },
    // x combinations
    { pinyin:'xué', initial:'x', final:'üe', tone:2, example:{ word:'xué', hanzi:'学', meaning:'belajar' } },
    { pinyin:'xiǎo',initial:'x', final:'iao',tone:3, example:{ word:'xiǎo',hanzi:'小', meaning:'kecil' } },
    { pinyin:'xīn', initial:'x', final:'in', tone:1, example:{ word:'xīn', hanzi:'心', meaning:'hati' } },
    // zh combinations
    { pinyin:'zhè', initial:'zh',final:'e',  tone:4, example:{ word:'zhè', hanzi:'这', meaning:'ini' } },
    { pinyin:'zhōng',initial:'zh',final:'ong',tone:1, example:{ word:'zhōng',hanzi:'中', meaning:'tengah' } },
    { pinyin:'zhī', initial:'zh',final:'i',  tone:1, example:{ word:'zhī', hanzi:'知', meaning:'tahu' } },
    // ch combinations
    { pinyin:'chī', initial:'ch',final:'i',  tone:1, example:{ word:'chī', hanzi:'吃', meaning:'makan' } },
    { pinyin:'chǎng',initial:'ch',final:'ang',tone:3, example:{ word:'chǎng',hanzi:'场', meaning:'lapangan' } },
    // sh combinations
    { pinyin:'shū', initial:'sh',final:'u',  tone:1, example:{ word:'shū', hanzi:'书', meaning:'buku' } },
    { pinyin:'shí', initial:'sh',final:'i',  tone:2, example:{ word:'shí', hanzi:'十', meaning:'sepuluh' } },
    { pinyin:'shéi',initial:'sh',final:'ei', tone:2, example:{ word:'shéi',hanzi:'谁', meaning:'siapa' } },
    // r combinations
    { pinyin:'rén', initial:'r', final:'en', tone:2, example:{ word:'rén', hanzi:'人', meaning:'orang' } },
    { pinyin:'rì',  initial:'r', final:'i',  tone:4, example:{ word:'rì',  hanzi:'日', meaning:'hari/matahari' } },
    // z combinations
    { pinyin:'zài', initial:'z', final:'ai', tone:4, example:{ word:'zài', hanzi:'在', meaning:'ada/di' } },
    { pinyin:'zuò', initial:'z', final:'uo', tone:4, example:{ word:'zuò', hanzi:'坐', meaning:'duduk' } },
    // c combinations
    { pinyin:'cài', initial:'c', final:'ai', tone:4, example:{ word:'cài', hanzi:'菜', meaning:'sayuran/lauk' } },
    // s combinations
    { pinyin:'sān', initial:'s', final:'an', tone:1, example:{ word:'sān', hanzi:'三', meaning:'tiga' } },
    { pinyin:'shuō',initial:'sh',final:'uo', tone:1, example:{ word:'shuō',hanzi:'说', meaning:'berbicara' } },
  ];

  return { initials, finals, combinations };
})();

window.PinyinData = PinyinData;
