/**
 * NihonHan - Katakana Data
 * 46 dasar + 25 dakuten/handakuten + 33 kombinasi = 104 karakter
 */
const KatakanaData = (() => {

  const basic = [
    { char:'ア', romaji:'a',   group:'vokal', example:{ word:'アイス', reading:'aisu', meaning:'es krim' } },
    { char:'イ', romaji:'i',   group:'vokal', example:{ word:'イタリア', reading:'itaria', meaning:'Italia' } },
    { char:'ウ', romaji:'u',   group:'vokal', example:{ word:'ウサギ', reading:'usagi', meaning:'kelinci' } },
    { char:'エ', romaji:'e',   group:'vokal', example:{ word:'エアコン', reading:'eakon', meaning:'AC' } },
    { char:'オ', romaji:'o',   group:'vokal', example:{ word:'オレンジ', reading:'orenji', meaning:'jeruk' } },
    // K
    { char:'カ', romaji:'ka',  group:'k', example:{ word:'カメラ', reading:'kamera', meaning:'kamera' } },
    { char:'キ', romaji:'ki',  group:'k', example:{ word:'キス', reading:'kisu', meaning:'ciuman' } },
    { char:'ク', romaji:'ku',  group:'k', example:{ word:'クラス', reading:'kurasu', meaning:'kelas' } },
    { char:'ケ', romaji:'ke',  group:'k', example:{ word:'ケーキ', reading:'keeki', meaning:'kue' } },
    { char:'コ', romaji:'ko',  group:'k', example:{ word:'コーヒー', reading:'koohii', meaning:'kopi' } },
    // S
    { char:'サ', romaji:'sa',  group:'s', example:{ word:'サッカー', reading:'sakkaa', meaning:'sepak bola' } },
    { char:'シ', romaji:'shi', group:'s', example:{ word:'シャツ', reading:'shatsu', meaning:'kemeja' } },
    { char:'ス', romaji:'su',  group:'s', example:{ word:'スポーツ', reading:'supootsu', meaning:'olahraga' } },
    { char:'セ', romaji:'se',  group:'s', example:{ word:'セーター', reading:'seetaa', meaning:'sweater' } },
    { char:'ソ', romaji:'so',  group:'s', example:{ word:'ソファ', reading:'sofa', meaning:'sofa' } },
    // T
    { char:'タ', romaji:'ta',  group:'t', example:{ word:'タクシー', reading:'takushii', meaning:'taksi' } },
    { char:'チ', romaji:'chi', group:'t', example:{ word:'チーズ', reading:'chiizu', meaning:'keju' } },
    { char:'ツ', romaji:'tsu', group:'t', example:{ word:'ツアー', reading:'tsuaa', meaning:'tur' } },
    { char:'テ', romaji:'te',  group:'t', example:{ word:'テスト', reading:'tesuto', meaning:'ujian' } },
    { char:'ト', romaji:'to',  group:'t', example:{ word:'トマト', reading:'tomato', meaning:'tomat' } },
    // N
    { char:'ナ', romaji:'na',  group:'n', example:{ word:'ナイフ', reading:'naifu', meaning:'pisau' } },
    { char:'ニ', romaji:'ni',  group:'n', example:{ word:'ニュース', reading:'nyuusu', meaning:'berita' } },
    { char:'ヌ', romaji:'nu',  group:'n', example:{ word:'ヌードル', reading:'nuudoru', meaning:'mi' } },
    { char:'ネ', romaji:'ne',  group:'n', example:{ word:'ネクタイ', reading:'nekutai', meaning:'dasi' } },
    { char:'ノ', romaji:'no',  group:'n', example:{ word:'ノート', reading:'nooto', meaning:'buku catatan' } },
    // H
    { char:'ハ', romaji:'ha',  group:'h', example:{ word:'ハンバーガー', reading:'hanbaagaa', meaning:'hamburger' } },
    { char:'ヒ', romaji:'hi',  group:'h', example:{ word:'ヒーター', reading:'hiitaa', meaning:'pemanas' } },
    { char:'フ', romaji:'fu',  group:'h', example:{ word:'フランス', reading:'furansu', meaning:'Prancis' } },
    { char:'ヘ', romaji:'he',  group:'h', example:{ word:'ヘルメット', reading:'herumetto', meaning:'helm' } },
    { char:'ホ', romaji:'ho',  group:'h', example:{ word:'ホテル', reading:'hoteru', meaning:'hotel' } },
    // M
    { char:'マ', romaji:'ma',  group:'m', example:{ word:'マップ', reading:'mappu', meaning:'peta' } },
    { char:'ミ', romaji:'mi',  group:'m', example:{ word:'ミルク', reading:'miruku', meaning:'susu' } },
    { char:'ム', romaji:'mu',  group:'m', example:{ word:'ムード', reading:'muudo', meaning:'suasana' } },
    { char:'メ', romaji:'me',  group:'m', example:{ word:'メール', reading:'meeru', meaning:'email/surat' } },
    { char:'モ', romaji:'mo',  group:'m', example:{ word:'モデル', reading:'moderu', meaning:'model' } },
    // Y
    { char:'ヤ', romaji:'ya',  group:'y', example:{ word:'ヤシ', reading:'yashi', meaning:'pohon kelapa' } },
    { char:'ユ', romaji:'yu',  group:'y', example:{ word:'ユニフォーム', reading:'yunifoomu', meaning:'seragam' } },
    { char:'ヨ', romaji:'yo',  group:'y', example:{ word:'ヨーロッパ', reading:'yooroppa', meaning:'Eropa' } },
    // R
    { char:'ラ', romaji:'ra',  group:'r', example:{ word:'ラジオ', reading:'rajio', meaning:'radio' } },
    { char:'リ', romaji:'ri',  group:'r', example:{ word:'リンゴ', reading:'ringo', meaning:'apel' } },
    { char:'ル', romaji:'ru',  group:'r', example:{ word:'ルール', reading:'ruuru', meaning:'aturan' } },
    { char:'レ', romaji:'re',  group:'r', example:{ word:'レストラン', reading:'resutoran', meaning:'restoran' } },
    { char:'ロ', romaji:'ro',  group:'r', example:{ word:'ロボット', reading:'robotto', meaning:'robot' } },
    // W
    { char:'ワ', romaji:'wa',  group:'w', example:{ word:'ワイン', reading:'wain', meaning:'anggur/wine' } },
    { char:'ヲ', romaji:'wo',  group:'w', example:{ word:'(partikel objek)', reading:'wo', meaning:'partikel objek' } },
    { char:'ン', romaji:'n',   group:'n-lone', example:{ word:'パン', reading:'pan', meaning:'roti' } },
  ];

  const dakuten = [
    { char:'ガ', romaji:'ga',  group:'g', base:'カ', example:{ word:'ガス', reading:'gasu', meaning:'gas' } },
    { char:'ギ', romaji:'gi',  group:'g', base:'キ', example:{ word:'ギター', reading:'gitaa', meaning:'gitar' } },
    { char:'グ', romaji:'gu',  group:'g', base:'ク', example:{ word:'グラス', reading:'gurasu', meaning:'gelas' } },
    { char:'ゲ', romaji:'ge',  group:'g', base:'ケ', example:{ word:'ゲーム', reading:'geemu', meaning:'game' } },
    { char:'ゴ', romaji:'go',  group:'g', base:'コ', example:{ word:'ゴール', reading:'gooru', meaning:'gol/tujuan' } },
    { char:'ザ', romaji:'za',  group:'z', base:'サ', example:{ word:'ザ', reading:'za', meaning:'the (artikel)' } },
    { char:'ジ', romaji:'ji',  group:'z', base:'シ', example:{ word:'ジュース', reading:'juusu', meaning:'jus' } },
    { char:'ズ', romaji:'zu',  group:'z', base:'ス', example:{ word:'ズボン', reading:'zubon', meaning:'celana' } },
    { char:'ゼ', romaji:'ze',  group:'z', base:'セ', example:{ word:'ゼロ', reading:'zero', meaning:'nol' } },
    { char:'ゾ', romaji:'zo',  group:'z', base:'ソ', example:{ word:'ゾーン', reading:'zoon', meaning:'zona' } },
    { char:'ダ', romaji:'da',  group:'d', base:'タ', example:{ word:'ダンス', reading:'dansu', meaning:'tari' } },
    { char:'ヂ', romaji:'di',  group:'d', base:'チ', example:{ word:'(jarang)', reading:'di', meaning:'-' } },
    { char:'ヅ', romaji:'du',  group:'d', base:'ツ', example:{ word:'(jarang)', reading:'du', meaning:'-' } },
    { char:'デ', romaji:'de',  group:'d', base:'テ', example:{ word:'デート', reading:'deeto', meaning:'kencan' } },
    { char:'ド', romaji:'do',  group:'d', base:'ト', example:{ word:'ドア', reading:'doa', meaning:'pintu' } },
    { char:'バ', romaji:'ba',  group:'b', base:'ハ', example:{ word:'バナナ', reading:'banana', meaning:'pisang' } },
    { char:'ビ', romaji:'bi',  group:'b', base:'ヒ', example:{ word:'ビール', reading:'biiru', meaning:'bir' } },
    { char:'ブ', romaji:'bu',  group:'b', base:'フ', example:{ word:'ブラジル', reading:'burajiru', meaning:'Brasil' } },
    { char:'ベ', romaji:'be',  group:'b', base:'ヘ', example:{ word:'ベッド', reading:'beddo', meaning:'tempat tidur' } },
    { char:'ボ', romaji:'bo',  group:'b', base:'ホ', example:{ word:'ボール', reading:'booru', meaning:'bola' } },
    { char:'パ', romaji:'pa',  group:'p', base:'ハ', example:{ word:'パン', reading:'pan', meaning:'roti' } },
    { char:'ピ', romaji:'pi',  group:'p', base:'ヒ', example:{ word:'ピアノ', reading:'piano', meaning:'piano' } },
    { char:'プ', romaji:'pu',  group:'p', base:'フ', example:{ word:'プール', reading:'puuru', meaning:'kolam renang' } },
    { char:'ペ', romaji:'pe',  group:'p', base:'ヘ', example:{ word:'ペン', reading:'pen', meaning:'pena' } },
    { char:'ポ', romaji:'po',  group:'p', base:'ホ', example:{ word:'ポスト', reading:'posuto', meaning:'kotak surat' } },
  ];

  const yoon = [
    { char:'キャ', romaji:'kya', group:'ky', example:{ word:'キャンプ', reading:'kyanpu', meaning:'berkemah' } },
    { char:'キュ', romaji:'kyu', group:'ky', example:{ word:'キュウリ', reading:'kyuuri', meaning:'mentimun' } },
    { char:'キョ', romaji:'kyo', group:'ky', example:{ word:'キョウト', reading:'kyouto', meaning:'Kyoto' } },
    { char:'シャ', romaji:'sha', group:'sh', example:{ word:'シャワー', reading:'shawaa', meaning:'pancuran' } },
    { char:'シュ', romaji:'shu', group:'sh', example:{ word:'シュークリーム', reading:'shuukuriimu', meaning:'sus' } },
    { char:'ショ', romaji:'sho', group:'sh', example:{ word:'ショッピング', reading:'shoppingu', meaning:'belanja' } },
    { char:'チャ', romaji:'cha', group:'ch', example:{ word:'チャンス', reading:'chansu', meaning:'kesempatan' } },
    { char:'チュ', romaji:'chu', group:'ch', example:{ word:'チューリップ', reading:'chuurippu', meaning:'tulip' } },
    { char:'チョ', romaji:'cho', group:'ch', example:{ word:'チョコレート', reading:'chokoreeto', meaning:'coklat' } },
    { char:'ニャ', romaji:'nya', group:'ny', example:{ word:'ニャンコ', reading:'nyanko', meaning:'kucing (informal)' } },
    { char:'ニュ', romaji:'nyu', group:'ny', example:{ word:'ニュース', reading:'nyuusu', meaning:'berita' } },
    { char:'ニョ', romaji:'nyo', group:'ny', example:{ word:'ニョロニョロ', reading:'nyoronyoro', meaning:'berkelok-kelok' } },
    { char:'ヒャ', romaji:'hya', group:'hy', example:{ word:'ヒャク', reading:'hyaku', meaning:'seratus' } },
    { char:'ヒュ', romaji:'hyu', group:'hy', example:{ word:'ヒューズ', reading:'hyuuzu', meaning:'sekring' } },
    { char:'ヒョ', romaji:'hyo', group:'hy', example:{ word:'ヒョウ', reading:'hyou', meaning:'macan tutul' } },
    { char:'ミャ', romaji:'mya', group:'my', example:{ word:'ミャンマー', reading:'myanmaa', meaning:'Myanmar' } },
    { char:'ミュ', romaji:'myu', group:'my', example:{ word:'ミュージカル', reading:'myuujikaru', meaning:'musikal' } },
    { char:'ミョ', romaji:'myo', group:'my', example:{ word:'ミョウガ', reading:'myouga', meaning:'jahe Jepang' } },
    { char:'リャ', romaji:'rya', group:'ry', example:{ word:'リャクゴ', reading:'ryakugo', meaning:'singkatan' } },
    { char:'リュ', romaji:'ryu', group:'ry', example:{ word:'リュック', reading:'ryukku', meaning:'ransel' } },
    { char:'リョ', romaji:'ryo', group:'ry', example:{ word:'リョコウ', reading:'ryokou', meaning:'perjalanan' } },
    { char:'ギャ', romaji:'gya', group:'gy', example:{ word:'ギャップ', reading:'gyappu', meaning:'kesenjangan' } },
    { char:'ギュ', romaji:'gyu', group:'gy', example:{ word:'ギュウニク', reading:'gyuuniku', meaning:'sapi' } },
    { char:'ギョ', romaji:'gyo', group:'gy', example:{ word:'ギョウザ', reading:'gyouza', meaning:'gyoza' } },
    { char:'ジャ', romaji:'ja',  group:'j',  example:{ word:'ジャケット', reading:'jaketto', meaning:'jaket' } },
    { char:'ジュ', romaji:'ju',  group:'j',  example:{ word:'ジュース', reading:'juusu', meaning:'jus' } },
    { char:'ジョ', romaji:'jo',  group:'j',  example:{ word:'ジョギング', reading:'jogingu', meaning:'joging' } },
    { char:'ビャ', romaji:'bya', group:'by', example:{ word:'(jarang)', reading:'bya', meaning:'-' } },
    { char:'ビュ', romaji:'byu', group:'by', example:{ word:'ビュッフェ', reading:'byuffe', meaning:'prasmanan' } },
    { char:'ビョ', romaji:'byo', group:'by', example:{ word:'ビョウイン', reading:'byouin', meaning:'rumah sakit' } },
    { char:'ピャ', romaji:'pya', group:'py', example:{ word:'(jarang)', reading:'pya', meaning:'-' } },
    { char:'ピュ', romaji:'pyu', group:'py', example:{ word:'ピュア', reading:'pyua', meaning:'murni' } },
    { char:'ピョ', romaji:'pyo', group:'py', example:{ word:'(jarang)', reading:'pyo', meaning:'-' } },
  ];

  const all = [
    ...basic.map(c  => ({ ...c, type: 'basic'   })),
    ...dakuten.map(c => ({ ...c, type: 'dakuten' })),
    ...yoon.map(c   => ({ ...c, type: 'yoon'    })),
  ];

  return { basic, dakuten, yoon, all };
})();

window.KatakanaData = KatakanaData;
