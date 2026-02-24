/**
 * NihonHan - Mandarin Tones Data
 * 4 nada + nada netral (nada 0)
 * Format tone: { number, name, nameCN, mark, desc, curve, color, examples:[] }
 * Format example: { pinyin, hanzi, meaning }
 */
const TonesData = (() => {

  const tones = [
    {
      number: 1,
      name: 'Nada Pertama',
      nameCN: '第一声 (yīshēng)',
      mark: 'ā',
      symbol: '—',
      desc: 'Nada tinggi dan rata. Seperti orang dokter minta kamu bilang "aaaaah". Tetap tinggi sepanjang waktu.',
      curve: 'M10,60 L190,60',
      color: '#C0392B',
      colorSoft: '#FDECEA',
      mnemomic: 'Datar seperti garis lurus di atas',
      examples: [
        { pinyin:'māo', hanzi:'猫', meaning:'kucing' },
        { pinyin:'tiān', hanzi:'天', meaning:'langit/hari' },
        { pinyin:'shū', hanzi:'书', meaning:'buku' },
        { pinyin:'fēi', hanzi:'飞', meaning:'terbang' },
        { pinyin:'chī', hanzi:'吃', meaning:'makan' },
        { pinyin:'māma', hanzi:'妈妈', meaning:'ibu' },
        { pinyin:'yī', hanzi:'一', meaning:'satu' },
        { pinyin:'gāo', hanzi:'高', meaning:'tinggi' },
      ]
    },
    {
      number: 2,
      name: 'Nada Kedua',
      nameCN: '第二声 (èrshēng)',
      mark: 'á',
      symbol: '↗',
      desc: 'Nada naik. Seperti kamu bertanya "hah?" atau intonasi ketika heran. Mulai dari tengah lalu naik.',
      curve: 'M10,80 Q100,50 190,20',
      color: '#2471A3',
      colorSoft: '#EAF4FB',
      mnemomic: 'Naik seperti pertanyaan',
      examples: [
        { pinyin:'lái', hanzi:'来', meaning:'datang' },
        { pinyin:'nán', hanzi:'男', meaning:'laki-laki' },
        { pinyin:'shí', hanzi:'十', meaning:'sepuluh' },
        { pinyin:'hé', hanzi:'和', meaning:'dan' },
        { pinyin:'rén', hanzi:'人', meaning:'orang' },
        { pinyin:'xué', hanzi:'学', meaning:'belajar' },
        { pinyin:'méi', hanzi:'没', meaning:'tidak ada' },
        { pinyin:'guó', hanzi:'国', meaning:'negara' },
      ]
    },
    {
      number: 3,
      name: 'Nada Ketiga',
      nameCN: '第三声 (sānshēng)',
      mark: 'ǎ',
      symbol: '↘↗',
      desc: 'Nada turun lalu naik. Seperti suara "hmm~" ketika sedang berpikir ragu. Turun dulu ke rendah, lalu naik sedikit.',
      curve: 'M10,40 Q70,90 130,85 Q160,82 190,50',
      color: '#229954',
      colorSoft: '#EAFAF1',
      mnemomic: 'Turun dulu, lalu naik — seperti lembah',
      examples: [
        { pinyin:'nǐ', hanzi:'你', meaning:'kamu' },
        { pinyin:'hǎo', hanzi:'好', meaning:'baik' },
        { pinyin:'wǒ', hanzi:'我', meaning:'saya' },
        { pinyin:'xiǎo', hanzi:'小', meaning:'kecil' },
        { pinyin:'lǎo', hanzi:'老', meaning:'tua' },
        { pinyin:'kěyi', hanzi:'可以', meaning:'boleh/bisa' },
        { pinyin:'liǎng', hanzi:'两', meaning:'dua (jumlah)' },
        { pinyin:'yǒu', hanzi:'有', meaning:'ada/punya' },
      ]
    },
    {
      number: 4,
      name: 'Nada Keempat',
      nameCN: '第四声 (sìshēng)',
      mark: 'à',
      symbol: '↘',
      desc: 'Nada turun tajam. Seperti orang marah atau memerintah "diam!". Mulai tinggi lalu turun cepat dan tegas.',
      curve: 'M10,20 Q100,50 190,90',
      color: '#8E44AD',
      colorSoft: '#F5EEF8',
      mnemomic: 'Turun tajam seperti perintah tegas',
      examples: [
        { pinyin:'qù', hanzi:'去', meaning:'pergi' },
        { pinyin:'shì', hanzi:'是', meaning:'adalah' },
        { pinyin:'bù', hanzi:'不', meaning:'tidak' },
        { pinyin:'dà', hanzi:'大', meaning:'besar' },
        { pinyin:'zài', hanzi:'在', meaning:'ada/di' },
        { pinyin:'duì', hanzi:'对', meaning:'benar' },
        { pinyin:'rì', hanzi:'日', meaning:'hari' },
        { pinyin:'kuài', hanzi:'快', meaning:'cepat' },
      ]
    },
    {
      number: 0,
      name: 'Nada Netral',
      nameCN: '轻声 (qīngshēng)',
      mark: 'a',
      symbol: '·',
      desc: 'Nada ringan dan pendek. Tidak ada aksen, diucapkan dengan cepat dan ringan. Sering muncul di akhir kata atau partikel.',
      curve: 'M10,60 L80,60',
      color: '#7F8C8D',
      colorSoft: '#F2F3F4',
      mnemomic: 'Ringan dan pendek — hampir tidak terdengar',
      examples: [
        { pinyin:'māma', hanzi:'妈妈', meaning:'ibu (suku ke-2 netral)' },
        { pinyin:'ba', hanzi:'吧', meaning:'partikel saran/ajak' },
        { pinyin:'ne', hanzi:'呢', meaning:'partikel tanya ringan' },
        { pinyin:'de', hanzi:'的', meaning:'partikel kepemilikan' },
        { pinyin:'le', hanzi:'了', meaning:'partikel aspek selesai' },
        { pinyin:'ma', hanzi:'吗', meaning:'partikel tanya ya/tidak' },
        { pinyin:'men', hanzi:'们', meaning:'suffix jamak (orang)' },
        { pinyin:'zhe', hanzi:'着', meaning:'partikel aspek progresif' },
      ]
    },
  ];

  // Minimal pairs (kata yang berbeda hanya karena nada)
  const minimalPairs = [
    {
      base: 'ma',
      words: [
        { tone:1, pinyin:'mā', hanzi:'妈', meaning:'ibu' },
        { tone:2, pinyin:'má', hanzi:'麻', meaning:'goni/kebas' },
        { tone:3, pinyin:'mǎ', hanzi:'马', meaning:'kuda' },
        { tone:4, pinyin:'mà', hanzi:'骂', meaning:'memaki' },
        { tone:0, pinyin:'ma', hanzi:'吗', meaning:'partikel tanya' },
      ]
    },
    {
      base: 'tang',
      words: [
        { tone:1, pinyin:'tāng', hanzi:'汤', meaning:'sup/kaldu' },
        { tone:2, pinyin:'táng', hanzi:'糖', meaning:'gula/permen' },
        { tone:3, pinyin:'tǎng', hanzi:'躺', meaning:'berbaring' },
        { tone:4, pinyin:'tàng', hanzi:'烫', meaning:'panas/menyetrika' },
      ]
    },
    {
      base: 'mai',
      words: [
        { tone:2, pinyin:'mái', hanzi:'埋', meaning:'mengubur' },
        { tone:3, pinyin:'mǎi', hanzi:'买', meaning:'membeli' },
        { tone:4, pinyin:'mài', hanzi:'卖', meaning:'menjual' },
      ]
    },
    {
      base: 'shui',
      words: [
        { tone:2, pinyin:'shuí', hanzi:'谁', meaning:'siapa' },
        { tone:3, pinyin:'shuǐ', hanzi:'水', meaning:'air' },
        { tone:4, pinyin:'shuì', hanzi:'睡', meaning:'tidur' },
      ]
    },
  ];

  function getByNumber(n) {
    return tones.find(t => t.number === n) || null;
  }

  return { tones, minimalPairs, getByNumber };
})();

window.TonesData = TonesData;
