# NihonHan — Roadmap Fase Lanjutan

Dokumen ini mencatat seluruh ide pengembangan setelah Fase 8 selesai.
Fase-fase di bawah belum dikerjakan dan bisa diimplementasikan secara bertahap.

> **Catatan:** Sebelum mengerjakan fase baru, selesaikan bug-fixing terlebih dahulu.

---

## Urutan Prioritas yang Disarankan

| Prioritas | Fase | Nama | Alasan |
|-----------|------|------|--------|
| 🔴 Tinggi | 9 | Audio & Pelafalan | Dampak besar, implementasi mudah |
| 🔴 Tinggi | 10 | Dark Mode | Struktur CSS sudah siap |
| 🔴 Tinggi | 11 | Spaced Repetition (SRS) | Fitur pembeda, efektif untuk hafalan |
| 🟡 Sedang | 12 | Favorit & Bookmark | UX improvement, mudah diimplementasi |
| 🟡 Sedang | 13 | Mode Input Jawaban (Quiz) | Meningkatkan kualitas latihan |
| 🟡 Sedang | 14 | Gamifikasi Lanjutan (XP & Level) | Meningkatkan retensi pengguna |
| 🟡 Sedang | 15 | Challenge Harian | Mendorong kebiasaan belajar |
| 🟢 Rendah | 16 | Konten Lanjutan (N2/N1/N3) | Butuh banyak data — di-skip sementara |
| ✅ Selesai | 17 | Contoh Dialog / Percakapan | SELESAI Fase 17 |
| ✅ Selesai | 18 | Streak Reminder (Notifikasi) | SELESAI Fase 18 |
| ✅ Selesai | 19 | Export Progress ke PDF | SELESAI Fase 19 |
| ✅ Selesai | 20 | PWA (Progressive Web App) | SELESAI Fase 20 |

---

## FASE 9 — Audio & Pelafalan

**Tujuan:** Pengguna bisa mendengar pengucapan kata/karakter yang sedang dipelajari.

**Teknologi:** Web Speech API (`SpeechSynthesis`) — built-in browser, gratis, tidak perlu server.

**Target:**
- Tombol 🔊 di setiap kartu hiragana/katakana/kanji/kosakata
- Tombol 🔊 di modal detail semua modul
- Di halaman Nada Mandarin: tombol untuk mendengar contoh per nada
- Opsi pilih bahasa suara: `ja-JP` (Jepang) atau `zh-CN` (Mandarin)
- Setting toggle "Auto-play saat buka kartu" di halaman Settings

**File yang perlu dibuat/diubah:**
```
assets/js/modules/audio.js         [BARU] — AudioEngine wrapper SpeechSynthesis
assets/js/pages/hiragana.js        [UPDATE] — tambah tombol 🔊 di grid & modal
assets/js/pages/katakana.js        [UPDATE] — sama
assets/js/pages/kanji.js           [UPDATE] — sama
assets/js/pages/jp-vocab.js        [UPDATE] — sama
assets/js/pages/hanzi.js           [UPDATE] — sama, bahasa zh-CN
assets/js/pages/zh-vocab.js        [UPDATE] — sama
assets/js/pages/tones.js           [UPDATE] — tombol play per contoh nada
pages/settings.html                [UPDATE] — tambah toggle auto-play
assets/js/pages/settings.js        [UPDATE] — simpan preferensi audio
```

**Pola kode:**
```javascript
// assets/js/modules/audio.js
const AudioEngine = (() => {
  function speak(text, lang = 'ja-JP', rate = 0.85) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = rate;
    window.speechSynthesis.speak(utt);
  }
  function speakJP(text) { speak(text, 'ja-JP', 0.85); }
  function speakZH(text) { speak(text, 'zh-CN', 0.8); }
  return { speak, speakJP, speakZH };
})();
```

**Catatan:**
- Tidak semua browser/OS punya voice `ja-JP` atau `zh-CN`. Cek dulu dengan `speechSynthesis.getVoices()`.
- Beri fallback graceful jika voice tidak tersedia (sembunyikan tombol 🔊).
- Di mobile iOS, SpeechSynthesis hanya bekerja setelah ada interaksi pengguna.

---

## FASE 10 — Dark Mode

**Tujuan:** Toggle tema gelap/terang untuk kenyamanan belajar di malam hari.

**Teknologi:** CSS custom properties (sudah ada), `data-theme` attribute di `<html>`, `localStorage`.

**Target:**
- Toggle dark/light di halaman Settings
- Transisi mulus antar tema (sudah ada `--dur` variable)
- Ikon matahari ☀️ / bulan 🌙 di topbar untuk toggle cepat
- Tema tersimpan di `Storage.setUser(uid, 'settings', { theme: 'dark' })`
- Default: mengikuti `prefers-color-scheme` sistem operasi

**File yang perlu dibuat/diubah:**
```
assets/css/main.css            [UPDATE] — tambah [data-theme="dark"] CSS variables
assets/js/core/app.js          [UPDATE] — loadTheme() di init, toggle function
pages/settings.html            [UPDATE] — tambah toggle dark mode
assets/js/pages/settings.js   [UPDATE] — bind toggle + simpan preferensi
```

**Pola kode:**
```css
/* assets/css/main.css */
[data-theme="dark"] {
  --bg:       #0f0f13;
  --surface:  #1a1a22;
  --border:   #2e2e3a;
  --text:     #e8e8f0;
  --text-2:   #a8a8c0;
  --text-3:   #6868880;
  --red-soft: rgba(192,57,43,0.15);
  --gold-soft: rgba(212,175,55,0.1);
}
```

```javascript
// assets/js/core/app.js — tambah di dalam init()
function loadTheme() {
  const user = Auth.getActiveUser();
  if (!user) return;
  const s = Storage.getUser(user.id, 'settings', {});
  const theme = s.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}
```

**Catatan:**
- Perhatikan kontras warna untuk aksesibilitas (WCAG AA minimum).
- Elemen CJK (kanji/hanzi) mungkin perlu penyesuaian opacity di dark mode.
- Test di semua halaman karena warna latar modul (merah, gold) terpengaruh.

---

## FASE 11 — Spaced Repetition System (SRS)

**Tujuan:** Algoritma pengulangan cerdas — kartu sulit muncul lebih sering, kartu mudah lebih jarang. Metode terbukti efektif seperti yang digunakan Anki.

**Algoritma:** SM-2 (SuperMemo 2) — sederhana dan terbukti efektif.

**Target:**
- Mode belajar baru "SRS" di samping mode Tabel/Flashcard
- Pengguna menilai sendiri: ❌ Lupa / 😐 Sulit / ✅ Mudah / 🔥 Hafal
- Sistem menghitung interval pengulangan berikutnya (1 hari → 3 hari → 7 hari → 14 hari → dst)
- Dashboard menampilkan: "X kartu perlu diulang hari ini"
- Notifikasi di dashboard jika ada kartu yang jatuh tempo

**File yang perlu dibuat/diubah:**
```
assets/js/modules/srs.js          [BARU] — SRS Engine (SM-2 algorithm)
assets/js/pages/hiragana.js       [UPDATE] — tab SRS baru
assets/js/pages/kanji.js          [UPDATE] — tab SRS baru
assets/js/pages/jp-vocab.js       [UPDATE] — tab SRS baru
assets/js/pages/hanzi.js          [UPDATE] — tab SRS baru
assets/js/pages/zh-vocab.js       [UPDATE] — tab SRS baru
assets/js/pages/dashboard.js      [UPDATE] — tampilkan kartu jatuh tempo hari ini
pages/dashboard.html              [UPDATE] — section "Ulang Hari Ini"
```

**Pola kode (SM-2):**
```javascript
// assets/js/modules/srs.js
const SRS = (() => {
  // rating: 0=lupa, 1=sulit, 2=mudah, 3=hafal
  function calculateNext(card, rating) {
    let { interval = 1, repetitions = 0, easeFactor = 2.5 } = card;
    if (rating < 1) {
      interval = 1;
      repetitions = 0;
    } else {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 3;
      else interval = Math.round(interval * easeFactor);
      repetitions++;
      easeFactor = Math.max(1.3, easeFactor + 0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02));
    }
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    return { interval, repetitions, easeFactor, nextReview: nextReview.toISOString().split('T')[0] };
  }

  function getDueCards(moduleId) {
    const today = new Date().toISOString().split('T')[0];
    const srsData = Storage.get('srs_' + moduleId, {});
    return Object.entries(srsData)
      .filter(([_, card]) => !card.nextReview || card.nextReview <= today)
      .map(([id]) => id);
  }

  return { calculateNext, getDueCards };
})();
```

**localStorage keys baru:**
```
nh_user_{id}_srs_{moduleId}   — { [itemId]: { interval, repetitions, easeFactor, nextReview } }
```

**Catatan:**
- SRS hanya efektif jika pengguna buka app setiap hari. Kombinasikan dengan Fase 15 (Challenge Harian).
- Mulai dengan modul yang paling sering digunakan: Hiragana, Kanji, Kosakata JP.
- UI rating harus jelas dan cepat — hindari friction.

---

## FASE 12 — Favorit & Bookmark

**Tujuan:** Pengguna bisa menandai item tertentu dengan bintang ⭐ untuk difokuskan saat belajar.

**Target:**
- Tombol ⭐ di setiap kartu/sel (hiragana, katakana, kanji, kosakata, hanzi)
- Filter "Favorit saja" di setiap halaman modul
- Halaman ringkasan favorit di Stats (berapa item difavoritkan per modul)
- Flashcard mode: opsi "hanya kartu favorit"

**File yang perlu dibuat/diubah:**
```
assets/js/modules/progress.js    [UPDATE] — tambah markFavorite(), unmarkFavorite(), isFavorite(), getFavorites()
assets/js/pages/hiragana.js      [UPDATE] — tombol ⭐ + filter favorit
assets/js/pages/katakana.js      [UPDATE] — sama
assets/js/pages/kanji.js         [UPDATE] — sama
assets/js/pages/jp-vocab.js      [UPDATE] — sama
assets/js/pages/hanzi.js         [UPDATE] — sama
assets/js/pages/zh-vocab.js      [UPDATE] — sama
assets/js/pages/stats.js         [UPDATE] — tampilkan jumlah favorit per modul
```

**localStorage keys baru:**
```
nh_user_{id}_favorites   — { hiragana: ['あ','い',...], kanji: ['日','本',...], ... }
```

**Pola kode:**
```javascript
// Tambah di progress.js
function markFavorite(moduleId, itemId) {
  const uid = getUserId();
  const favs = Storage.getUser(uid, 'favorites', {});
  if (!favs[moduleId]) favs[moduleId] = [];
  if (!favs[moduleId].includes(itemId)) favs[moduleId].push(itemId);
  Storage.setUser(uid, 'favorites', favs);
}
```

---

## FASE 13 — Mode Input Jawaban di Quiz

**Tujuan:** Selain pilihan ganda, tambah mode di mana pengguna mengetik jawaban sendiri — lebih menantang dan efektif.

**Target:**
- Tipe soal baru: "Ketik romaji dari karakter ini" / "Ketik arti dari kata ini"
- Input field dengan validasi: benar/salah + tampilkan jawaban benar
- Toleransi typo ringan (Levenshtein distance ≤ 1 untuk jawaban romaji)
- Opsi pilih tipe soal saat setup quiz: Pilihan Ganda / Input Teks / Campur

**File yang perlu dibuat/diubah:**
```
assets/js/modules/quiz.js       [UPDATE] — tambah tipe 'text-input', validasi, fuzzy match
assets/css/quiz.css             [UPDATE] — styling input answer field
assets/js/pages/quiz-jp.js      [UPDATE] — opsi tipe soal di select screen
assets/js/pages/quiz-zh.js      [UPDATE] — sama
```

**Pola kode (fuzzy match):**
```javascript
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[a.length][b.length];
}

function isCorrectAnswer(input, correct) {
  const norm = s => s.toLowerCase().trim();
  return norm(input) === norm(correct) || levenshtein(norm(input), norm(correct)) <= 1;
}
```

---

## FASE 14 — Gamifikasi Lanjutan (XP & Level System)

**Tujuan:** Pengguna mendapat XP dari setiap aktivitas belajar dan naik level secara bertahap.

**Level:**
| Level | Nama | XP Dibutuhkan |
|-------|------|---------------|
| 1 | 入門 Pemula | 0 |
| 2 | 初級 Dasar | 100 |
| 3 | 中級 Menengah | 300 |
| 4 | 上級 Lanjutan | 700 |
| 5 | 達人 Mahir | 1.500 |
| 6 | 師範 Ahli | 3.000 |
| 7 | 名人 Master | 6.000 |

**XP per aktivitas:**
- Hafal 1 karakter/kata baru: +5 XP
- Selesai sesi quiz: +10 XP
- Quiz dengan akurasi 100%: +25 XP bonus
- Pertahankan streak 1 hari: +15 XP
- Buka badge baru: +30 XP

**File yang perlu dibuat/diubah:**
```
assets/js/modules/xp.js         [BARU] — XPSystem (addXP, getLevel, getLevelInfo)
assets/js/core/app.js           [UPDATE] — integrasi XP ke toast notifikasi
assets/js/pages/dashboard.js   [UPDATE] — tampilkan XP bar & level di welcome banner
pages/dashboard.html            [UPDATE] — XP progress bar di welcome section
assets/js/pages/stats.js        [UPDATE] — tampilkan riwayat XP
assets/css/dashboard.css        [UPDATE] — styling XP bar & level badge
```

**localStorage keys baru:**
```
nh_user_{id}_xp   — { total: 1250, history: [{action, amount, date}] }
```

---

## FASE 15 — Challenge Harian

**Tujuan:** Setiap hari ada tantangan spesifik yang mendorong pengguna untuk belajar dengan target yang jelas.

**Contoh challenge:**
- "Hafal 5 kata kosakata JP baru hari ini" → reward: +50 XP
- "Selesaikan quiz dengan akurasi ≥80%" → reward: +30 XP + badge
- "Review 10 kartu SRS yang jatuh tempo" → reward: +40 XP
- "Belajar di 3 modul berbeda hari ini" → reward: +60 XP

**Fitur:**
- Challenge di-generate otomatis setiap hari (seed dari tanggal)
- Progress bar challenge di dashboard
- Notifikasi selesai + animasi konfeti sederhana (CSS only)
- Riwayat challenge selesai di halaman Stats

**File yang perlu dibuat/diubah:**
```
assets/js/modules/challenge.js   [BARU] — ChallengeSystem
assets/js/pages/dashboard.js     [UPDATE] — render daily challenge card
pages/dashboard.html             [UPDATE] — section "Tantangan Hari Ini"
assets/css/dashboard.css         [UPDATE] — styling challenge card
assets/js/pages/stats.js         [UPDATE] — riwayat challenge
```

---

## FASE 16 — Konten Lanjutan (N3 / N2 / N1)

**Tujuan:** Menambah konten untuk level yang lebih tinggi.

**Target konten:**
- `jp-vocab-n3.js` — 300+ kata kosakata N3 (15 tema lanjutan)
- `jp-vocab-n2.js` — 300+ kata kosakata N2
- `kanji.js` [UPDATE] — tambah Kanji N2 (300 kanji) dan N1 (300 kanji) = total ~750 kanji
- `jp-grammar-n3.js` — 30+ pola grammar N3 (〜ば、〜のに、〜ものの、〜わけだ, dll)
- `hanzi-hsk4.js` — HSK 4 (300 kata), HSK 5 (300 kata)

**Catatan:**
- Fase ini yang paling labor-intensive — butuh banyak data yang akurat.
- Pertimbangkan untuk memisahkan file data per level agar tidak terlalu besar.
- Prioritaskan akurasi data di atas kuantitas.

---

## FASE 17 — Dialog & Percakapan

**Tujuan:** Halaman baru yang menyajikan contoh percakapan per situasi.

**Situasi:**
- Di restoran / memesan makanan
- Di stasiun / membeli tiket
- Berkenalan dengan orang baru
- Di toko / berbelanja
- Menanyakan arah
- Di dokter / rumah sakit
- Di tempat kerja / rapat
- Percakapan telepon

**Format per dialog:**
```
[Situasi: Di restoran]
A: すみません、注文してもいいですか？
   Sumimasen, chuumon shite mo ii desu ka?
   (Permisi, boleh saya memesan?)

B: はい、どうぞ。
   Hai, douzo.
   (Ya, silakan.)
```

**File yang perlu dibuat:**
```
assets/js/data/jp-dialogs.js     [BARU]
assets/js/data/zh-dialogs.js     [BARU]
pages/japanese/dialog.html       [BARU]
pages/mandarin/dialog.html       [BARU]
assets/js/pages/jp-dialog.js     [BARU]
assets/js/pages/zh-dialog.js     [BARU]
assets/css/dialog.css            [BARU]
```

---

## FASE 18 — Streak Reminder (Notifikasi Browser)

**Tujuan:** Pengingat harian agar pengguna tidak lupa belajar dan streak tidak putus.

**Teknologi:** Web Notifications API + (opsional) Service Worker untuk push di background.

**Target:**
- Pengguna bisa set jam pengingat (misal: 20:00 setiap hari)
- Notifikasi muncul: "🔥 Jangan putus streak-mu! Belajar sekarang di NihonHan"
- Toggle on/off di Settings
- Tanpa server — pakai `setTimeout` atau Service Worker lokal

**Catatan:**
- Butuh izin eksplisit dari pengguna (`Notification.requestPermission()`)
- Hanya bekerja jika tab/browser masih terbuka (tanpa Service Worker)
- Dengan Service Worker bisa bekerja di background tapi lebih kompleks

**File yang perlu dibuat/diubah:**
```
assets/js/modules/reminder.js    [BARU] — ReminderSystem
pages/settings.html              [UPDATE] — tambah waktu pengingat + toggle
assets/js/pages/settings.js      [UPDATE] — bind reminder settings
```

---

## FASE 19 — Export Progress ke PDF

**Tujuan:** Pengguna bisa mengunduh laporan kemajuan belajar sebagai PDF.

**Konten laporan:**
- Nama pengguna, tanggal cetak
- Ringkasan: total dipelajari, streak tertinggi, akurasi rata-rata
- Progress bar per modul (visual)
- Daftar badge yang diraih + tanggal
- Grafik aktivitas 4 minggu (heatmap)
- Daftar 20 kata terakhir yang dipelajari

**Teknologi:** `window.print()` dengan CSS `@media print` — tanpa library eksternal, gratis.

**File yang perlu dibuat/diubah:**
```
pages/report.html               [BARU] — halaman khusus print-friendly
assets/css/report.css           [BARU] — @media print styling
assets/js/pages/report.js       [BARU] — generate konten laporan
```

**Pola kode:**
```javascript
// Buka halaman laporan lalu trigger print
function exportPDF() {
  window.open('report.html', '_blank');
}

// Di report.js — setelah render, auto print
window.onload = () => {
  renderReport();
  setTimeout(() => window.print(), 500);
};
```

---

## FASE 20 — PWA (Progressive Web App)

**Tujuan:** NihonHan bisa di-install di HP/komputer seperti aplikasi native dan berjalan penuh offline.

**Komponen PWA:**
1. **Web App Manifest** (`manifest.json`) — nama, ikon, warna tema, mode standalone
2. **Service Worker** (`sw.js`) — cache semua aset untuk offline, strategi cache-first
3. **Install prompt** — banner "Pasang NihonHan di HP kamu"

**File yang perlu dibuat:**
```
manifest.json                   [BARU] — PWA manifest
sw.js                           [BARU] — Service Worker
assets/icons/                   [BARU] — ikon 192x192 dan 512x512 (PNG)
index.html                      [UPDATE] — link manifest + register SW
```

**Pola kode:**
```json
// manifest.json
{
  "name": "NihonHan",
  "short_name": "NihonHan",
  "description": "Belajar Bahasa Jepang & Mandarin",
  "start_url": "/pages/dashboard.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#C0392B",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```javascript
// sw.js (cache-first strategy)
const CACHE = 'nihonhan-v1';
const ASSETS = ['/index.html', '/pages/dashboard.html', /* semua aset */];

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(ASSETS))
));

self.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
));
```

**Catatan:**
- Service Worker hanya bekerja di HTTPS atau localhost.
- Karena NihonHan pure file-based, bisa dijalankan via `file://` — tapi SW butuh server.
- Saran: deploy ke GitHub Pages / Netlify agar PWA bisa berfungsi penuh.

---

## Ringkasan File Baru per Fase

| Fase | File Baru | File Diubah |
|------|-----------|-------------|
| 9 — Audio | `modules/audio.js` | 6 halaman JS |
| 10 — Dark Mode | — | `main.css`, `app.js`, 2 halaman |
| 11 — SRS | `modules/srs.js` | 5 halaman JS, dashboard |
| 12 — Favorit | — | `modules/progress.js`, 6 halaman JS |
| 13 — Input Quiz | — | `modules/quiz.js`, 2 quiz JS |
| 14 — XP & Level | `modules/xp.js` | `app.js`, dashboard |
| 15 — Challenge | `modules/challenge.js` | dashboard |
| 16 — Konten N3+ | 4 data files | `kanji.js` |
| 17 — Dialog | 4 data + page files | sidebar semua halaman |
| 18 — Reminder | `modules/reminder.js` | settings |
| 19 — Export PDF | `pages/report.html`, `report.css`, `report.js` | — |
| 20 — PWA | `manifest.json`, `sw.js`, ikon | `index.html` |

---

## Catatan untuk Claude Selanjutnya

- Selalu baca README utama (`README.md`) terlebih dahulu untuk memahami struktur proyek
- Ikuti pola `App.init('page-id')` dan `Router.guard()` di setiap halaman baru
- Gunakan `Storage.getUser()` / `Storage.setUser()` untuk semua data persisten
- Gunakan `Progress.markLearned()` / `Progress.getLearned()` untuk tracking hafalan
- Selalu update `README.md` dan buat zip baru setelah setiap fase selesai
- Naming convention: file JS halaman → `assets/js/pages/nama-halaman.js`
- Naming convention: modul → `assets/js/modules/nama-modul.js`

---

*NihonHan — Belajar itu indah, satu karakter dalam satu waktu.*
