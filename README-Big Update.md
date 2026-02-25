# NihonHan — Big Update Roadmap (Fase 21+)

Dokumen ini berisi ide-ide pengembangan besar setelah Fase 20 selesai.
Disusun dari yang paling impactful ke yang paling ambisius.

> **Prinsip:** NihonHan tetap **offline-first, pure localStorage, tanpa server**.
> Semua fitur di bawah dirancang dengan prinsip ini.

---

## Ringkasan Prioritas

| Prioritas | Fase | Nama | Kategori |
|-----------|------|------|----------|
| 🔴 Tinggi | 21 | Konten Lanjutan (N3/HSK4) | Konten |
| 🔴 Tinggi | 22 | Listening Mode (Audio Quiz) | Fitur Belajar |
| 🔴 Tinggi | 23 | Stroke Order Animasi (Hiragana/Katakana) | UX |
| 🟡 Sedang | 24 | Vocabulary Builder (Kalimat Lengkap) | Konten |
| 🟡 Sedang | 25 | Leaderboard Lokal & Multiplayer Offline | Gamifikasi |
| 🟡 Sedang | 26 | Onboarding & Placement Test | UX |
| 🟡 Sedang | 27 | Study Planner / Jadwal Belajar | Produktivitas |
| 🟢 Rendah | 28 | Mini Game (Word Matching, Scramble) | Gamifikasi |
| 🟢 Rendah | 29 | Tema & Kustomisasi UI | UX |
| 🟢 Rendah | 30 | Backup & Restore Progress | Data |

---

## FASE 21 — Konten Lanjutan: Kosakata N3 & HSK 4

**Kategori:** Konten
**Estimasi effort:** Besar (banyak data)
**Dampak:** Sangat tinggi — membuka NihonHan untuk pelajar intermediate

**Tujuan:** Pelajar yang sudah kuasai N5/N4 dan HSK 1-3 bisa lanjut ke level berikutnya.

### Target Konten

**Bahasa Jepang — N3:**
- `jp-vocab-n3.js` — 300+ kata kosakata N3 (15 tema: berita, emosi, masyarakat, alam, teknologi, dll)
- `jp-grammar-n3.js` — 30+ pola grammar N3 yang sering muncul di JLPT:
  - 〜ば / 〜なければならない / 〜ようだ / 〜らしい
  - 〜ことにする / 〜てしまう / 〜ておく / 〜てある
  - 〜のに / 〜ものの / 〜わけだ / 〜はずだ

**Bahasa Mandarin — HSK 4:**
- `hanzi-hsk4.js` — 300 karakter baru HSK 4
- `zh-vocab-hsk4.js` — 300+ kata kosakata HSK 4 (kata kerja majemuk, kata sifat abstrak, ekspresi formal)

### File yang Perlu Dibuat/Diubah

```
assets/js/data/jp-vocab-n3.js       [BARU]
assets/js/data/jp-grammar-n3.js     [BARU]
assets/js/data/hanzi-hsk4.js        [BARU]
assets/js/data/zh-vocab-hsk4.js     [BARU]
pages/japanese/vocabulary.html      [UPDATE] — tab N3
pages/japanese/grammar.html         [UPDATE] — tab N3
pages/mandarin/hanzi.html           [UPDATE] — tab HSK4
pages/mandarin/vocabulary.html      [UPDATE] — tab HSK4
```

### Catatan Penting
- Pisahkan file data per level agar tidak terlalu berat (jangan gabung semua ke 1 file)
- Prioritaskan kata yang sering muncul di JLPT N3 / HSK 4 real test
- Update dashboard progress cards untuk tampilkan N3 dan HSK4

---

## FASE 22 — Listening Mode (Audio Quiz)

**Kategori:** Fitur Belajar
**Estimasi effort:** Sedang
**Dampak:** Tinggi — melatih kemampuan mendengar, bukan hanya membaca

**Tujuan:** Mode quiz baru di mana soal berupa audio, bukan teks. User mendengar kata lalu memilih/mengetik artinya.

### Cara Kerja
1. Quiz dimulai dalam "Listening Mode"
2. Karakter/kata **disembunyikan** — hanya ada tombol 🔊
3. Audio di-play otomatis saat soal muncul
4. User memilih arti yang benar (atau mengetik romaji/pinyin)
5. Setelah jawab, karakter baru terungkap
6. Skor bonus +5 XP untuk setiap soal Listening yang benar

### Perbedaan dari Quiz Normal
| | Quiz Normal | Listening Mode |
|--|-------------|----------------|
| Soal | Teks karakter | Audio (tersembunyi) |
| Jawaban | Pilih/ketik arti | Pilih/ketik arti atau karakter |
| Skill | Reading | Listening |
| Timer | 20 detik | 25 detik |

### File yang Perlu Dibuat/Diubah
```
pages/japanese/quiz.html        [UPDATE] — tambah mode "Listening"
pages/mandarin/quiz.html        [UPDATE] — sama
assets/js/pages/quiz-jp.js      [UPDATE] — listening mode logic
assets/js/pages/quiz-zh.js      [UPDATE] — sama
assets/css/quiz.css             [UPDATE] — UI hidden-character card
```

### Catatan
- Gunakan `AudioEngine.speakJP()` / `speakZH()` yang sudah ada (Fase 9)
- Pastikan fallback graceful jika browser tidak punya voice yang sesuai
- Auto-replay audio jika user klik soal lagi

---

## FASE 23 — Stroke Order Animasi (Hiragana & Katakana)

**Kategori:** UX / Konten
**Estimasi effort:** Sedang-Besar
**Dampak:** Tinggi — cara menulis karakter adalah hal fundamental yang sering diabaikan

**Tujuan:** Animasi urutan coretan (stroke order) untuk semua hiragana dan katakana, bukan hanya kanji.

### Status Saat Ini
- Stroke order **sudah ada** untuk Kanji (`modules/stroke.js`) — menggunakan SVG path animasi
- Hiragana dan Katakana **belum punya** stroke order animasi

### Rencana Implementasi
- Buat data SVG stroke order untuk 46 hiragana dasar + dakuten + kombinasi
- Buat data SVG stroke order untuk 46 katakana dasar + dakuten + kombinasi
- Tambahkan tab "✍️ Menulis" di halaman Hiragana dan Katakana
- Animasi: stroke muncul satu per satu, dengan panah arah dan nomor urutan
- Mode latihan: canvas kosong, user trace dengan mouse/finger, lalu dibandingkan

### File yang Perlu Dibuat/Diubah
```
assets/js/data/hiragana-strokes.js   [BARU] — data SVG stroke order
assets/js/data/katakana-strokes.js   [BARU] — data SVG stroke order
pages/japanese/hiragana.html         [UPDATE] — tab Menulis
pages/japanese/katakana.html         [UPDATE] — tab Menulis
assets/js/pages/hiragana.js          [UPDATE] — init stroke tab
assets/js/pages/katakana.js          [UPDATE] — sama
assets/css/japanese.css              [UPDATE] — canvas trace styling
```

### Catatan
- Data SVG stroke untuk hiragana tersedia di open-source projects (KanjiVG-style)
- Mode trace (latihan menulis) butuh Canvas API — cek kompatibilitas mobile
- Prioritaskan animasi dulu, mode trace bisa jadi Fase 23.2

---

## FASE 24 — Vocabulary Builder (Kalimat Kontekstual)

**Kategori:** Konten / Fitur Belajar
**Estimasi effort:** Sedang
**Dampak:** Sedang-Tinggi — belajar kata dalam konteks jauh lebih efektif

**Tujuan:** Setiap kata kosakata punya 3-5 contoh kalimat dengan level kesulitan berbeda, bisa dijelajahi dan di-quiz.

### Fitur
- Modal kosakata yang sudah ada ditambah section "Contoh Kalimat"
- 3-5 kalimat per kata, dari sederhana (N5) ke kompleks (N3)
- Setiap kalimat: JP + romaji/pinyin + terjemahan
- Tombol 🔊 per kalimat (sudah ada AudioEngine)
- "Kalimat Quiz": diberikan kalimat dengan satu kata dikosongkan, user isi

### File yang Perlu Dibuat/Diubah
```
assets/js/data/jp-vocab.js          [UPDATE] — tambah field 'sentences' per kata
assets/js/data/zh-vocab.js          [UPDATE] — sama
assets/css/japanese.css             [UPDATE] — sentence list styling
assets/css/mandarin.css             [UPDATE] — sama
assets/js/pages/jp-vocab.js         [UPDATE] — render sentences di modal
assets/js/pages/zh-vocab.js         [UPDATE] — sama
```

### Format Data
```javascript
{
  word: '食べる',
  reading: 'たべる',
  romaji: 'taberu',
  meaning: 'makan',
  sentences: [
    { jp: '毎日ご飯を食べます。', romaji: 'Mainichi gohan wo tabemasu.', id: 'Saya makan nasi setiap hari.', level: 'N5' },
    { jp: '友達と一緒に食べるのが好きです。', romaji: '...', id: '...', level: 'N4' },
  ]
}
```

---

## FASE 25 — Leaderboard Lokal & Tantangan Teman

**Kategori:** Gamifikasi / Sosial
**Estimasi effort:** Sedang
**Dampak:** Sedang — meningkatkan motivasi kompetitif

**Tujuan:** Beberapa user di device yang sama (HP keluarga, lab sekolah) bisa lihat progress masing-masing dan bersaing.

### Fitur
- **Leaderboard Lokal:** Tabel peringkat semua user yang terdaftar di device ini (XP, streak, badge)
- **Challenge Teman:** User A bisa kirim challenge ke User B (misal: "siapa yang quiz 5 kali duluan")
- **Perbandingan Progress:** Side-by-side chart progress dua user

### Catatan
- Semua data sudah ada di localStorage (multi-user sudah supported sejak Fase 1)
- Hanya perlu halaman baru untuk visualisasinya
- Tidak butuh server atau internet

### File yang Perlu Dibuat/Diubah
```
pages/leaderboard.html              [BARU]
assets/js/pages/leaderboard.js      [BARU]
assets/css/leaderboard.css          [BARU]
pages/dashboard.html                [UPDATE] — link ke leaderboard
```

---

## FASE 26 — Onboarding & Placement Test

**Kategori:** UX / Onboarding
**Estimasi effort:** Sedang
**Dampak:** Tinggi untuk user baru — first impression yang jauh lebih baik

**Tujuan:** User baru tidak langsung "nyemplung" ke semua konten. Ada proses onboarding yang menentukan level awal.

### Alur Onboarding
1. **Selamat Datang:** Tampilan welcome screen dengan animasi karakter Jepang/Mandarin
2. **Pilih Bahasa Fokus:** Jepang / Mandarin / Keduanya
3. **Placement Test:** 10 soal singkat untuk tentukan level awal (Pemula / Menengah)
4. **Rekomendasi Modul:** Berdasarkan hasil test, sistem rekomendasikan dari mana mulai
5. **Set Target Harian:** Berapa menit per hari yang ingin diluangkan
6. **Selesai:** Dashboard langsung tampilkan modul yang direkomendasikan

### File yang Perlu Dibuat/Diubah
```
pages/onboarding.html               [BARU] — multi-step wizard
assets/js/pages/onboarding.js       [BARU]
assets/css/onboarding.css           [BARU]
assets/js/core/auth.js              [UPDATE] — redirect ke onboarding setelah register baru
pages/dashboard.html                [UPDATE] — "modul direkomendasikan" section
```

### localStorage keys baru
```
nh_user_{id}_onboarding   — { completed: bool, focusLang: 'jp'|'zh'|'both', level: 'beginner'|'intermediate', dailyGoal: 15 }
```

---

## FASE 27 — Study Planner / Jadwal Belajar

**Kategori:** Produktivitas
**Estimasi effort:** Sedang-Besar
**Dampak:** Tinggi untuk user yang ingin persiapan ujian (JLPT, HSK)

**Tujuan:** User bisa set target (misal: "Siap JLPT N4 dalam 3 bulan") dan sistem buatkan jadwal belajar harian otomatis.

### Fitur
- **Goal Setting:** Pilih target ujian (JLPT N5/N4/N3, HSK 1-4) + tanggal ujian
- **Auto Schedule:** Sistem hitung berapa item perlu dipelajari per hari agar selesai tepat waktu
- **Daily To-Do:** Dashboard menampilkan "hari ini kamu perlu: 5 kanji + 3 grammar + 1 quiz"
- **Progress Timeline:** Grafik garis menunjukkan progress vs jadwal ideal
- **Catch-up Mode:** Jika ada hari terlewat, sistem sesuaikan jadwal hari berikutnya

### File yang Perlu Dibuat/Diubah
```
pages/planner.html                  [BARU]
assets/js/pages/planner.js          [BARU]
assets/js/modules/planner.js        [BARU] — schedule calculation engine
assets/css/planner.css              [BARU]
pages/dashboard.html                [UPDATE] — daily to-do dari planner
```

### localStorage keys baru
```
nh_user_{id}_planner   — { goal, targetDate, dailyQuota, schedule: {...} }
```

---

## FASE 28 — Mini Game

**Kategori:** Gamifikasi
**Estimasi effort:** Sedang
**Dampak:** Sedang — bikin belajar lebih fun, terutama untuk pemula

**Tujuan:** Variasi belajar melalui game ringan yang tetap melatih hafalan.

### Game yang Direncanakan

**Game 1 — Kartu Pasangan (Memory Match):**
- Grid kartu terbalik (4x4 atau 6x6)
- Klik 2 kartu: jika pasangan cocok (karakter + artinya), kartu menghilang
- Timer + skor combo

**Game 2 — Word Scramble:**
- Kata/kalimat Jepang diacak hurufnya
- User susun kembali dengan drag-and-drop
- Tingkat kesulitan bertahap

**Game 3 — Falling Kana:**
- Karakter hiragana/katakana "jatuh" dari atas layar
- User mengetik romaji sebelum karakter menyentuh garis bawah
- Semakin lama semakin cepat (arcade style)

### File yang Perlu Dibuat/Diubah
```
pages/games.html                    [BARU] — hub semua game
pages/games/memory.html             [BARU]
pages/games/scramble.html           [BARU]
pages/games/falling-kana.html       [BARU]
assets/js/pages/game-memory.js      [BARU]
assets/js/pages/game-scramble.js    [BARU]
assets/js/pages/game-falling.js     [BARU]
assets/css/games.css                [BARU]
```

---

## FASE 29 — Tema & Kustomisasi UI

**Kategori:** UX / Personalisasi
**Estimasi effort:** Kecil-Sedang
**Dampak:** Rendah-Sedang — meningkatkan kepuasan personal

**Tujuan:** User bisa ganti tema warna aplikasi sesuai preferensi.

### Tema yang Direncanakan
| Tema | Warna Utama | Aksen | Vibe |
|------|-------------|-------|------|
| Sakura (default) | Merah #C0392B | Gold #D4AF37 | Tradisional Jepang |
| Zen | Abu-abu gelap | Hijau sage | Minimalis |
| Neon Tokyo | Ungu tua | Cyan neon | Futuristik |
| Bamboo | Hijau tua | Kuning | Alam Mandarin |
| Midnight | Hitam | Oranye | Dark mode kuat |

### Implementasi
- CSS custom properties sudah ada di `main.css` — tinggal override per tema
- Pilihan tema di Settings → Tampilan
- Preview real-time sebelum simpan

### File yang Perlu Dibuat/Diubah
```
assets/css/themes.css               [BARU] — semua theme variable overrides
assets/js/modules/theme.js          [BARU] — ThemeSystem
pages/settings.html                 [UPDATE] — theme picker dengan preview
assets/js/pages/settings.js         [UPDATE] — bind theme picker
```

---

## FASE 30 — Backup & Restore Progress

**Kategori:** Data / Utilitas
**Estimasi effort:** Kecil
**Dampak:** Tinggi untuk user yang ganti device atau takut kehilangan progress

**Tujuan:** User bisa export semua data progress ke file JSON, lalu import kembali di device lain.

### Fitur
- **Export:** Tombol "Backup Data" di Settings → download file `nihonhan-backup-[tanggal].json`
- **Import:** Tombol "Restore Data" → pilih file backup → semua progress pulih
- **Auto-backup lokal:** Setiap 7 hari, otomatis simpan snapshot ke localStorage (max 3 snapshot)
- **Validasi:** Cek integritas file backup sebelum import

### Format Backup
```json
{
  "version": "1.0",
  "exportDate": "2026-02-24",
  "userId": "usr_xxx",
  "userName": "Budi",
  "data": {
    "progress": {...},
    "srs": {...},
    "favorites": {...},
    "xp": {...},
    "badges": {...},
    "activity": {...},
    "streak": {...}
  }
}
```

### File yang Perlu Dibuat/Diubah
```
assets/js/modules/backup.js         [BARU] — BackupSystem: export(), import(), validate()
pages/settings.html                 [UPDATE] — section Backup & Restore
assets/js/pages/settings.js         [UPDATE] — bind tombol backup/restore
```

---

## FASE BONUS — Ide Jangka Panjang

Ide-ide di bawah lebih ambisius dan mungkin butuh perubahan arsitektur, tapi menarik untuk masa depan.

### FASE B1 — Text-to-Speech Custom Voice
Saat ini pakai Web Speech API yang suaranya bergantung OS. Alternatifnya: integrasi API gratis seperti Google TTS atau OpenAI TTS untuk suara yang lebih natural dan konsisten.

### FASE B2 — OCR: Scan & Terjemah
User bisa foto teks Jepang/Mandarin (menu restoran, papan nama, buku) → app kenali karakter dan tampilkan arti. Bisa pakai Tesseract.js (OCR offline).

### FASE B3 — Kamus Inline
Saat membaca dialog atau teks, user bisa tap/klik kata yang tidak dimengerti → popup arti langsung. Butuh database kamus yang lebih lengkap.

### FASE B4 — Multi-Platform Sync (jika ada server)
Jika suatu saat NihonHan punya backend, progress bisa sync antar device via akun. Tapi ini keluar dari prinsip "offline-first pure localStorage".

---

## Urutan Pengerjaan yang Disarankan

Untuk **impact maksimal dengan effort minimal**, urutan yang disarankan:

```
Fase 21 (Konten N3/HSK4)     ← Konten selalu prioritas
  ↓
Fase 26 (Onboarding)          ← UX first impression
  ↓
Fase 22 (Listening Quiz)      ← Fitur belajar baru yang keren
  ↓
Fase 30 (Backup/Restore)      ← Keamanan data user
  ↓
Fase 27 (Study Planner)       ← Untuk user serius
  ↓
Fase 23 (Stroke Animasi)      ← Visual menarik
  ↓
Fase 28 (Mini Game)           ← Fun factor
  ↓
Fase 24 (Kalimat Kontekstual) ← Depth konten
  ↓
Fase 25 (Leaderboard)         ← Sosial
  ↓
Fase 29 (Tema)                ← Polish
```

---

## Catatan untuk Claude Selanjutnya

- **Selalu baca `README.md` dulu** sebelum mulai fase baru — catat progress di sana
- Ikuti pola `App.init('page-id')` dan `Router.guard()` di setiap halaman baru
- Gunakan `Storage.getUser()` / `Storage.setUser()` untuk semua data persisten
- Gunakan `Progress.markLearned()` / `Progress.getLearned()` untuk tracking hafalan
- Setelah setiap fase selesai: **update `README.md` + buat zip baru**
- File ini (`README-Big Update.md`) tidak perlu diupdate per fase — itu tugasnya `README.md`
- Naming convention JS: `assets/js/pages/nama-halaman.js` dan `assets/js/modules/nama-modul.js`

---

*NihonHan — Belajar itu indah, satu karakter dalam satu waktu.*
