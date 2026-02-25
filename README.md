# NihonHan — Belajar Bahasa Jepang & Mandarin

Aplikasi web interaktif untuk mempelajari Bahasa Jepang dan Mandarin.  
**Offline-first · Pure localStorage · Tanpa server · Tanpa instalasi**

---

## Daftar Isi

1. [Status & Versi](#1-status--versi)
2. [Deskripsi Proyek](#2-deskripsi-proyek)
3. [Cara Menjalankan](#3-cara-menjalankan)
4. [Struktur Folder](#4-struktur-folder)
5. [Arsitektur & Pola Kode](#5-arsitektur--pola-kode)
6. [localStorage Key Reference](#6-localstorage-key-reference)
7. [Ringkasan Konten](#7-ringkasan-konten)
8. [Riwayat Fase (1–20.4)](#8-riwayat-fase-1204)
9. [Bug Fix yang Sudah Diperbaiki](#9-bug-fix-yang-sudah-diperbaiki)
10. [Roadmap Fase 21 ke Atas](#10-roadmap-fase-21-ke-atas)
11. [Panduan untuk Claude Selanjutnya](#11-panduan-untuk-claude-selanjutnya)

---

## 1. Status & Versi

| Info | Detail |
|------|--------|
| **Fase Saat Ini** | FASE 20.4 ✅ SELESAI |
| **Fase Terakhir Dikerjakan** | Live Clock di Topbar Dashboard |
| **Fase 16** | Di-skip sementara (konten N3/N2 lanjutan — effort besar) |
| **Deploy** | GitHub Pages / Netlify (butuh HTTPS agar PWA penuh berfungsi) |

---

## 2. Deskripsi Proyek

NihonHan adalah aplikasi web belajar bahasa yang berjalan 100% di browser tanpa server, database, atau koneksi internet setelah diunduh. Seluruh data user tersimpan di `localStorage`.

**Dua bahasa yang didukung:**
- 🇯🇵 **Bahasa Jepang** — Hiragana, Katakana, Kanji (N5–N1), Kosakata, Grammar, Dialog
- 🇨🇳 **Bahasa Mandarin** — Pinyin, Nada, Hanzi (HSK 1–3), Kosakata, Dialog

**Fitur unggulan:**
- Spaced Repetition System (SM-2) layaknya Anki
- Gamifikasi: XP, Level, Badge, Challenge Harian, Streak
- Quiz ganda: mode pilih + mode ketik jawaban
- Audio pengucapan via Web Speech API
- Export laporan progress ke PDF
- PWA: bisa di-install di HP/laptop, berjalan offline
- Dark mode dengan anti-FOUC
- Pengingat belajar (browser notification)
- Multi-user: beberapa akun di device yang sama

---

## 3. Cara Menjalankan

**Lokal (tanpa server):**
1. Buka folder `nihonhan_fase13/` di file explorer
2. Double klik `index.html`
3. Daftar akun baru → langsung bisa digunakan
4. Tidak perlu npm, pip, server, atau koneksi internet

**GitHub Pages / Netlify (untuk PWA penuh):**
1. Upload folder ke repo GitHub
2. Aktifkan GitHub Pages dari root
3. Akses via HTTPS → PWA install prompt akan muncul
4. Service Worker aktif → offline berfungsi penuh

> **Catatan:** Service Worker (`sw.js`) hanya aktif di HTTPS atau `localhost`. Di `file://`, fitur PWA tidak aktif tapi app tetap berfungsi normal.

---

## 4. Struktur Folder

```
nihonhan_fase13/
├── index.html                          ← Landing page & redirect
├── 404.html                            ← Halaman not found
├── manifest.json                       ← PWA manifest
├── sw.js                               ← Service Worker (cache-first)
├── README.md                           ← File ini
│
├── components/
│   └── sidebar.html                    ← Referensi template sidebar
│
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html                  ← Hub utama: streak, XP, challenge, SRS due
│   ├── profile.html                    ← Edit profil, avatar, statistik
│   ├── change-password.html
│   ├── settings.html                   ← Semua pengaturan app
│   ├── stats.html                      ← Statistik lengkap, heatmap, badge, riwayat
│   ├── report.html                     ← Laporan PDF (standalone, tanpa sidebar)
│   ├── japanese/
│   │   ├── hiragana.html               ← Tab: Tabel / Flashcard / SRS
│   │   ├── katakana.html               ← Tab: Tabel / Flashcard / SRS
│   │   ├── kanji.html                  ← Tab: Jelajah / SRS | Filter N5–N1
│   │   ├── vocabulary.html             ← Tab: Jelajah / SRS | Filter tema & level
│   │   ├── grammar.html                ← Accordion pola grammar N5–N4
│   │   ├── dialog.html                 ← Percakapan situasional 8 dialog
│   │   └── quiz.html                   ← Quiz JP: pilih/ketik, modul pilihan
│   └── mandarin/
│       ├── pinyin.html                 ← Inisial, Final, Kombinasi + audio
│       ├── tones.html                  ← 5 nada + kurva SVG + audio
│       ├── hanzi.html                  ← Tab: Jelajah / SRS | Filter HSK 1–3
│       ├── vocabulary.html             ← Tab: Jelajah / SRS | Filter tema & level
│       ├── dialog.html                 ← Percakapan situasional 7 dialog
│       └── quiz.html                   ← Quiz ZH: pilih/ketik, modul pilihan
│
├── assets/
│   ├── css/
│   │   ├── main.css                    ← Variabel global, dark mode, toast, XP
│   │   ├── layout.css                  ← Sidebar, main-content, topbar, responsive
│   │   ├── components.css              ← Shared: modal, badge, SRS, audio btn, fav
│   │   ├── auth.css                    ← Login & register (dua kolom)
│   │   ├── dashboard.css               ← XP bar, challenge, clock, dark mode
│   │   ├── transitions.css             ← Animasi fade-in halaman
│   │   ├── japanese.css                ← Hiragana/Katakana/Kanji/Vocab/Grammar
│   │   ├── kanji.css                   ← Grid, modal, badge N5–N1, stroke widget
│   │   ├── mandarin.css                ← Pinyin, Hanzi, Nada, Vocab ZH
│   │   ├── quiz.css                    ← Quiz engine UI, mode pilih & ketik
│   │   ├── settings.css                ← Settings page, reminder, dark mode
│   │   ├── dialog.css                  ← Dialog viewer, playthrough, vocab chip
│   │   └── report.css                  ← Laporan PDF, @media print
│   │
│   ├── js/
│   │   ├── core/
│   │   │   ├── storage.js              ← Storage wrapper (get/set per user)
│   │   │   ├── auth.js                 ← Register, login, logout, session, streak
│   │   │   ├── router.js               ← Guard auth, getBase() path resolver
│   │   │   └── app.js                  ← Init, sidebar, toast, dark mode toggle
│   │   │
│   │   ├── data/
│   │   │   ├── hiragana.js             ← 104 karakter + metadata
│   │   │   ├── katakana.js             ← 104 karakter + metadata
│   │   │   ├── kanji.js                ← 278 kanji (N5–N1) + onyomi/kunyomi/contoh
│   │   │   ├── jp-vocab.js             ← 225 kata JP, 15 tema
│   │   │   ├── jp-grammar.js           ← 35 pola grammar N5–N4, 5 kategori
│   │   │   ├── jp-dialogs.js           ← 8 dialog situasional JP
│   │   │   ├── pinyin.js               ← 21 inisial + 38 final + kombinasi
│   │   │   ├── zh-tones.js             ← 5 nada + contoh kata
│   │   │   ├── hanzi.js                ← 208 karakter HSK 1–3
│   │   │   ├── zh-vocab.js             ← 120+ kata ZH, 15 tema
│   │   │   └── zh-dialogs.js           ← 7 dialog situasional ZH
│   │   │
│   │   ├── modules/
│   │   │   ├── audio.js                ← AudioEngine (Web Speech API)
│   │   │   ├── flashcard.js            ← Flashcard 3D flip engine
│   │   │   ├── progress.js             ← markLearned, favorites, quiz score
│   │   │   ├── quiz.js                 ← QuizEngine (multiple choice)
│   │   │   ├── stroke.js               ← Stroke order widget (SVG, Kanji)
│   │   │   ├── srs.js                  ← SRS Engine (SM-2 algorithm)
│   │   │   ├── srs-ui.js               ← SRS UI renderer (reusable)
│   │   │   ├── xp.js                   ← XPSystem (level, history, toast)
│   │   │   ├── challenge.js            ← ChallengeSystem (harian, seed tanggal)
│   │   │   ├── reminder.js             ← ReminderSystem (notifikasi browser)
│   │   │   └── pwa.js                  ← PWA Manager (install, update, offline)
│   │   │
│   │   └── pages/
│   │       ├── dashboard.js            ← XP, streak, challenge, SRS due, clock
│   │       ├── stats.js                ← Statistik, heatmap, badge, XP, favorit
│   │       ├── report.js               ← Generate laporan PDF dari localStorage
│   │       ├── settings.js             ← Semua toggle & preferensi
│   │       ├── hiragana.js             ← Grid, flashcard, SRS, favorit, audio
│   │       ├── katakana.js             ← Grid, flashcard, SRS, favorit, audio
│   │       ├── kanji.js                ← Grid, modal stroke, SRS, favorit, audio
│   │       ├── jp-vocab.js             ← Vocab cards, SRS, favorit, audio
│   │       ├── jp-grammar.js           ← Accordion grammar, filter, tandai hafal
│   │       ├── jp-dialog.js            ← Dialog grid, viewer, playthrough, TTS
│   │       ├── quiz-jp.js              ← Quiz JP (pilih + ketik), normalisasi romaji
│   │       ├── pinyin.js               ← Grid pinyin, modal, audio hover
│   │       ├── tones.js                ← Kartu nada, SVG, audio
│   │       ├── hanzi.js                ← Grid hanzi, modal, SRS, favorit, audio
│   │       ├── zh-vocab.js             ← Vocab cards ZH, SRS, favorit, audio
│   │       ├── zh-dialog.js            ← Dialog grid ZH, viewer, playthrough, TTS
│   │       └── quiz-zh.js              ← Quiz ZH (pilih + ketik), normalisasi pinyin
│   │
│   └── icons/
│       ├── icon-192.png                ← Ikon PWA 192×192
│       └── icon-512.png                ← Ikon PWA 512×512
```

---

## 5. Arsitektur & Pola Kode

### Prinsip Utama

- **Offline-first, pure localStorage** — tidak ada API call, tidak ada database eksternal
- **Multi-user** — setiap user punya namespace `nh_user_{id}_*` di localStorage
- **Modular** — setiap fitur di module terpisah, halaman hanya pakai modul yang diperlukan
- **Vanilla JS** — tidak ada framework; hanya HTML, CSS, dan JavaScript murni

### Pola Inisialisasi Halaman

Setiap halaman authenticated mengikuti pola ini:

```javascript
// Di atas setiap script halaman:
Router.guard();                          // Redirect ke login jika belum auth
const user = Auth.getActiveUser();       // Ambil user aktif
App.init('nama-halaman');                // Init sidebar, toast, dark mode, topbar

// Lalu load data dan render:
const data = Progress.getLearned('modul-id');
renderGrid(data);
```

### Pola Path Resolution

`router.js` dan `auth.js` menggunakan `getBase()` untuk menghitung path relatif secara dinamis agar berfungsi di semua level kedalaman folder (lokal maupun GitHub Pages subdirectory):

```javascript
function getBase() {
  const parts = window.location.pathname.split('/');
  const pagesIdx = parts.indexOf('pages');
  if (pagesIdx === -1) return '';
  const afterPages = parts.slice(pagesIdx + 1).filter(p => p && !p.includes('.'));
  const depth = 1 + afterPages.length;
  return '../'.repeat(depth);
}
```

### Pola Storage

```javascript
// Baca data user
const progress = Storage.getUser(userId, 'progress', {});
const settings = Storage.getUser(userId, 'settings', { showRomaji: true });

// Simpan data user
Storage.setUser(userId, 'progress', updatedProgress);

// Tandai item dipelajari (otomatis update stats, XP, challenge)
Progress.markLearned('hiragana', 'あ');

// Favorit
Progress.toggleFavorite('kanji', '日');
const isFav = Progress.isFavorite('kanji', '日');

// SRS
SRS.rate(userId, 'hiragana', 'あ', 2);  // rating: 0=lupa, 1=sulit, 2=mudah, 3=hafal
const due = SRS.getDueIds(userId, 'kanji');

// XP
XPSystem.addXP(userId, 'learn_item', 5, 'Hafal あ');
const lvl = XPSystem.getLevelInfo(userId);
```

### Pola Toast Notifikasi

```javascript
App.toast('Berhasil disimpan!', 'success');  // hijau
App.toast('Ada kesalahan', 'error');          // merah
App.toastXP('+5 XP', 'Hafal kanji baru');    // ungu (XP)
// Level up otomatis di-handle oleh XPSystem.addXP()
```

### Pola Modul Quiz

Quiz engine (`quiz.js`) menerima config dan callbacks:

```javascript
QuizEngine.start({
  items: filteredItems,
  mode: 'choice' | 'input',
  timer: 20,
  onAnswer: (item, isCorrect) => { /* update progress */ },
  onComplete: (score, total) => { /* simpan skor */ }
});
```

---

## 6. localStorage Key Reference

```
nh_users                          → semua akun user terdaftar (array)
nh_session                        → session aktif { userId, loginAt }
nh_last_theme                     → 'light' | 'dark' (global, sebelum login)

nh_user_{id}_settings             → { showRomaji, showPinyin, animationEnabled,
                                      timerEnabled, audioAutoPlay, theme,
                                      reminder: { enabled, hour, minute } }
nh_user_{id}_progress             → { [moduleId]: { learned: [], quiz_scores: [] } }
nh_user_{id}_streak               → { count, best, lastDate }
nh_user_{id}_stats                → { totalLearned, quizCompleted,
                                      totalCorrect, totalQuestions }
nh_user_{id}_badges               → { [badgeId]: { earnedAt } }
nh_user_{id}_activity             → { "YYYY-MM-DD": jumlah_sesi }
nh_user_{id}_xp                   → { total, history: [{action, amount, label,
                                      date, totalAfter}] }
nh_user_{id}_srs_{moduleId}       → { [itemId]: { interval, repetitions,
                                      easeFactor, nextReview, lastRating,
                                      lastReview } }
nh_user_{id}_favorites            → { [moduleId]: [itemId, ...] }
nh_user_{id}_challenges           → { byDate: { "YYYY-MM-DD": [challenge...] },
                                      history: [{id, title, icon, xp, date}] }
nh_user_{id}_reminder             → { enabled: bool, hour: int, minute: int }
```

**Module ID yang valid untuk progress, SRS, dan favorites:**

| Module ID | Halaman |
|-----------|---------|
| `hiragana` | pages/japanese/hiragana.html |
| `katakana` | pages/japanese/katakana.html |
| `kanji` | pages/japanese/kanji.html |
| `jp-vocab` | pages/japanese/vocabulary.html |
| `jp-grammar` | pages/japanese/grammar.html |
| `jp-dialog` | pages/japanese/dialog.html |
| `hanzi` | pages/mandarin/hanzi.html |
| `zh-vocab` | pages/mandarin/vocabulary.html |
| `zh-dialog` | pages/mandarin/dialog.html |

---

## 7. Ringkasan Konten

| Modul | Jumlah | Level / Cakupan |
|-------|--------|-----------------|
| Hiragana | 104 karakter | Dasar + dakuten + kombinasi |
| Katakana | 104 karakter | Dasar + dakuten + kombinasi |
| Kanji | 278 karakter | N5 (105) / N4 (30) / N3 (20) / N2 (93) / N1 (30) |
| Kosakata JP | 225 kata | N5/N4, 15 tema |
| Grammar JP | 35 pola | N5/N4, 5 kategori |
| Dialog JP | 8 dialog | N5–N4, 8 situasi |
| Pinyin | 59 elemen | 21 inisial + 38 final + kombinasi |
| Nada Mandarin | 5 nada | + kurva SVG + contoh kata |
| Hanzi | 208 karakter | HSK 1 / HSK 2 / HSK 3 |
| Kosakata ZH | 120+ kata | HSK 1–3, 15 tema |
| Dialog ZH | 7 dialog | HSK 1–3, 7 situasi |
| **Total** | **~1.200+ item** | |

**12 Badge yang Tersedia:**

| Badge | Kondisi |
|-------|---------|
| 🌸 Pemula | Daftar pertama kali |
| 📚 Rajin | Hafal 10 item |
| 🔥 Streaker | Streak 3 hari |
| ⚡ Kilat | Selesaikan quiz pertama |
| 🎯 Tepat | Akurasi quiz ≥90% |
| 🏆 Juara | Akurasi quiz 100% |
| 💎 Berlian | Streak 7 hari |
| 🌟 Bintang | Hafal 50 item |
| 🦅 Elang | Hafal 100 item |
| 👑 Raja | Level 5 (Mahir) |
| 🎌 Samurai | Selesaikan semua modul JP |
| 🐉 Naga | Selesaikan semua modul ZH |

**7 Level XP:**

| Level | Nama JP | Nama ID | XP Butuh | Warna |
|-------|---------|---------|----------|-------|
| 1 | 入門 | Pemula | 0 | Abu |
| 2 | 初級 | Dasar | 100 | Hijau |
| 3 | 中級 | Menengah | 300 | Biru |
| 4 | 上級 | Lanjutan | 700 | Ungu |
| 5 | 達人 | Mahir | 1.500 | Oranye |
| 6 | 師範 | Ahli | 3.000 | Merah |
| 7 | 名人 | Master | 6.000 | Emas |

---

## 8. Riwayat Fase (1–20.4)

### FASE 1 — Fondasi & Autentikasi ✅
Register, login, logout, session aktif, streak harian, dashboard awal, profil, ganti password, sidebar navigasi, toast notifikasi, layout responsif.

### FASE 2 — Transisi & 404 ✅
Halaman `404.html`, `transitions.css` dengan animasi fade-in antar halaman.

### FASE 3 — Hiragana & Katakana ✅
104 hiragana + 104 katakana. Tiga tab: Tabel (grid dengan filter row), Flashcard (3D flip), Quiz Mini. Filter romaji on/off.

### FASE 4 — Kanji ✅
153 kanji awal (N5/N4/N3). Filter JLPT. Search real-time. Stroke order widget (SVG animasi). Modal detail (onyomi, kunyomi, contoh kata).

### FASE 5 — Mandarin ✅
Pinyin (21 inisial + 38 final + kombinasi), Nada (5 tone + kurva SVG), Hanzi (HSK 1–3 = 208 karakter), Kosakata ZH (120+ kata, 15 tema).

### FASE 6 — Quiz & Gamifikasi Awal ✅
QuizEngine (multiple choice, timer, feedback), BadgeSystem (12 badge), halaman Quiz JP dan Quiz ZH fungsional penuh.

### FASE 7 — Polish & Pengaturan ✅
Bug fix dashboard chart. Halaman Settings (toggle romaji/pinyin/animasi/timer, reset progress). Halaman Statistik (progress bar modul, riwayat quiz, badge grid, heatmap 28 hari). Sidebar update semua halaman.

### FASE 8 — Konten Lengkap & Finalisasi ✅
- **jp-vocab.js** — 225 kata JP, 15 tema (salam, keluarga, makanan, waktu, tempat, transportasi, belanja, tubuh, sekolah, pekerjaan, alam, warna, angka, kata sifat, kata kerja)
- **jp-grammar.js** — 35 pola grammar N5–N4 dalam 5 kategori
- Halaman `vocabulary.html` dan `grammar.html` JP fungsional (filter tema/level, search, tandai hafal)
- Integrasi setting `showRomaji`/`showPinyin` ke grid hiragana, katakana, hanzi

### FASE 8.1 — Redesign Login & Register ✅
Layout dua kolom (panel dekoratif + form). Live validation. Password strength indicator. Success state button. Mobile responsive.

### FASE 8.2 — Bug Fix Quiz JP ✅
Fix bug kritis: `bindQuizControls()` tidak terdefinisi → Quiz JP sama sekali tidak bisa digunakan. Fix closure di `retryBtn`.

### FASE 8.3 — Kanji N2 & N1 ✅
Tambah ~96 kanji N2 dan 30 kanji N1. Total kanji: 278. Badge level N2 (hijau) dan N1 (ungu) di halaman Kanji.

### FASE 8.3.1 — Hapus Duplikat Kanji ✅
Hapus 4 duplikat: `聞`, `況`, `的`, `悲`. Koreksi penghitungan N5 = 105 (bukan 103).

### FASE 8.4 — Enhance Profil ✅
Profile hero bergradient dengan achievement badges dinamis, stats strip 4 kolom, layout dua kolom, avatar grid dengan hover animasi. Form change-password di-center.

### FASE 9 — Audio & Pelafalan ✅
`AudioEngine` (`modules/audio.js`) via Web Speech API. Tombol 🔊 di modal (hiragana, katakana, kanji), kartu vocab (JP & ZH), nada Mandarin. Auto-play on open. Settings toggle audio. Fallback graceful jika browser tidak support.

### FASE 9.2 — Pelengkap Audio Mandarin ✅
Tombol 🔊 hover di grid cell Pinyin dan Hanzi. Modal Pinyin + contoh kata audio. Cakupan audio kini lengkap di semua 8 modul.

### FASE 10 — Dark Mode ✅
CSS custom properties `[data-theme="dark"]`. Toggle di topbar (🌙/☀️) dan Settings. Default ikut `prefers-color-scheme` OS. Anti-FOUC: tema diapply sebelum body render via inline script di `<head>`. Disimpan per-user di settings.

### FASE 11 — Spaced Repetition System (SRS) ✅
Algoritma SM-2. Modul: `srs.js` (engine) + `srs-ui.js` (UI renderer reusable). Tab SRS di Hiragana, Katakana, Kanji, Vocab JP, Hanzi, Vocab ZH. Rating 4 tingkat (Lupa/Sulit/Mudah/Hafal). Preview interval di tombol. Queue: due → baru (max 20/sesi). Dashboard section "🔁 Kartu SRS Hari Ini".

### FASE 12 — Favorit & Bookmark ✅
Tombol ★ hover di setiap sel/kartu. Toggle favorit di modal header. Filter "★ Favorit" per halaman. Flashcard mode favorit (Hiragana & Katakana). Section favorit di halaman Statistik. Tersimpan per-modul di localStorage.

### FASE 13 — Mode Input Jawaban (Quiz) ✅
Toggle "🔘 Pilih / ⌨️ Ketik" sebelum mulai quiz. Input field dengan fokus otomatis. Submit via tombol atau Enter. Tombol "Lewati". Normalisasi romaji (ā→a) dan pinyin (ā→a). Alternatif jawaban didukung. Timer diperpanjang 30 detik di mode ketik. Berlaku untuk Quiz JP dan Quiz ZH.

### FASE 14 — Gamifikasi Lanjutan: XP & Level ✅
`xp.js`: `addXP()`, `getLevelInfo()`, `getAllLevels()`. XP bar bergradient di dashboard. Level progression dots (7 level). Toast `+X XP` (ungu). Toast Level Naik. Sidebar menampilkan level saat ini. Riwayat XP di dashboard dan Statistik. XP per aktivitas: hafal item (+5), selesai quiz (+10), akurasi 100% (+25), streak (+15), badge baru (+30), SRS session (+8), modul pertama kali (+20).

### FASE 15 — Challenge Harian ✅
`challenge.js`: generate 3 challenge/hari deterministik (seed dari tanggal, algoritma LCG). 6 tipe challenge: `learn_items`, `quiz_complete`, `quiz_accuracy`, `srs_review`, `multi_module`, `streak_active`. Tombol "Klaim XP" muncul saat selesai. Toast XP saat klaim. Konfeti 40 partikel CSS-only saat semua challenge diklaim. Badge "X/3 Selesai". Riwayat di halaman Statistik. Auto-cleanup data >14 hari.

### FASE 16 — Di-skip Sementara ⏸️
Konten lanjutan N3/N2/N1/HSK4 — effort terlalu besar, ditunda. Ini sekarang menjadi **Fase 21** di roadmap.

### FASE 17 — Dialog & Percakapan ✅
8 dialog JP (situasi N5–N4): restoran, stasiun, berkenalan, belanja, arah, dokter, kantor, telepon. 7 dialog ZH (HSK 1–3). Filter per level. Viewer dengan warna A/B berbeda. Toggle romaji/pinyin & terjemahan. Mode Playthrough (highlight per baris + TTS). Tombol 🔊 per baris dan per kosakata kunci. Integrasi Challenge System & Progress.

### FASE 18 — Streak Reminder ✅
`reminder.js`: `ReminderSystem` dengan `init()`, `schedule()`, `cancel()`, `preview()`. Web Notifications API + `setTimeout`. Set jam pengingat di Settings (default 20:00). Smart skip: tidak notif jika sudah belajar hari itu. 5 pesan motivasi berbeda (acak). Tombol "Tes Sekarang". Status bar hijau saat aktif. Dark mode support.

### FASE 19 — Export Progress ke PDF ✅
`window.print()` + CSS `@media print`. Halaman `report.html` standalone (tanpa sidebar). Konten: header bergradient, kartu user, ringkasan 8 pencapaian, XP progress dots, progress per modul, heatmap 28 hari, badge grid 12, tabel 15 quiz terbaru, item dipelajari per modul (max 20), footer. Layout dioptimasi A4 portrait. Tombol "Ekspor PDF" di sidebar semua halaman + di topbar Stats. Parameter `?autoprint=1` untuk auto-trigger print.

### FASE 20 — PWA (Progressive Web App) ✅
`manifest.json` lengkap (shortcuts: Dashboard, Quiz JP, Quiz ZH). `sw.js` dengan dual strategy: Cache-First (CSS/JS/gambar) + Network-First (HTML). Cache bump v2 untuk force refresh. `pwa.js`: install prompt banner (auto-hide 12s), update banner saat SW baru, offline indicator. Ikon app 192×192 dan 512×512 (latar merah #C0392B, teks "NH" putih, sub-teks "日漢" gold). Section PWA di Settings. Update 21 halaman dengan manifest link + PWA meta + apple-touch-icon.

### FASE 20.4 — Live Clock di Topbar Dashboard ✅
Tampilan jam real-time (HH:MM:SS WIB) di topbar kanan dashboard. Format dua baris: tanggal (atas) + jam merah besar (bawah). `updateClock()` + `setInterval(updateClock, 1000)`. CSS tabular-nums. Hidden di mobile. Fix sidebar Katakana (duplikat active + href salah). Fix layout `.main-content` (align-items center) + `.page-body` (margin auto) agar konten ter-center.

---

## 9. Bug Fix yang Sudah Diperbaiki

### BF-1 — Missing closing brace di `progress.js` ✅
Fungsi `saveQuizScore()` kehilangan `}` → seluruh modul Progress gagal load → semua halaman modul tidak bisa render.

### BF-2 — Salah path di `pwa.js` ✅
Kalkulasi path relatif ke `sw.js` salah → Service Worker tidak terdaftar.

### BF-3 — GitHub Pages: Hiragana/Katakana/Kanji tidak muncul ✅
**Root cause:** `getBase()` lama (`return window.location.pathname.includes('/pages/') ? '../' : ''`) tidak menghitung kedalaman subfolder. Halaman di `/pages/japanese/hiragana.html` butuh `'../../'` tapi hanya dapat `'../'` → redirect ke path salah (`/pages/pages/login.html`) → 404.

**Fix:** `getBase()` baru menghitung depth secara dinamis dengan `parts.indexOf('pages')`. Diapply ke `router.js`, `auth.js`, dan `pwa.js`.

**Kenapa tidak ketahuan lokal:** Lokal, user biasanya sudah login → `Router.guard()` tidak trigger redirect.

### BF-4 — Quiz JP tidak bisa digunakan ✅
`bindQuizControls()` dipanggil tapi tidak terdefinisi → script crash → semua event listener quiz tidak terpasang.

### BF-5 — Duplikat Kanji ✅
4 kanji duplikat ditemukan dan dihapus/digabung: `聞`, `況`, `的`, `悲`.

### BF-6 — Sidebar Katakana: dua menu aktif sekaligus ✅
Nav-item Hiragana di `katakana.html` punya class `active` dan `href` salah → fix: hapus `active`, perbaiki href.

### BF-7 — Konten tidak ter-center di area main ✅
`.main-content` tidak punya `align-items: center` dan `.page-body` tidak punya `margin: 0 auto` → konten menempel kiri. Fix di `layout.css`.

---

## 10. Roadmap Fase 21 ke Atas

> **Prinsip tetap:** NihonHan selalu **offline-first, pure localStorage, tanpa server**.

### Prioritas Pengerjaan yang Disarankan

```
Fase 21 (Konten N3/HSK4)      ← Konten selalu prioritas
  ↓
Fase 26 (Onboarding)           ← UX first impression
  ↓
Fase 22 (Listening Quiz)       ← Fitur belajar baru
  ↓
Fase 30 (Backup/Restore)       ← Keamanan data user
  ↓
Fase 27 (Study Planner)        ← Untuk user serius
  ↓
Fase 23 (Stroke Animasi)       ← Visual menarik
  ↓
Fase 28 (Mini Game)            ← Fun factor
  ↓
Fase 24 (Kalimat Kontekstual)  ← Depth konten
  ↓
Fase 25 (Leaderboard)          ← Sosial
  ↓
Fase 29 (Tema)                 ← Polish
```

| Prioritas | Fase | Nama | Kategori | Estimasi Effort |
|-----------|------|------|----------|-----------------|
| 🔴 Tinggi | 21 | Konten Lanjutan (N3/HSK4) | Konten | Besar |
| 🔴 Tinggi | 22 | Listening Mode (Audio Quiz) | Fitur Belajar | Sedang |
| 🔴 Tinggi | 23 | Stroke Order Animasi (Hiragana/Katakana) | UX | Sedang-Besar |
| 🟡 Sedang | 24 | Vocabulary Builder (Kalimat Kontekstual) | Konten | Sedang |
| 🟡 Sedang | 25 | Leaderboard Lokal | Gamifikasi | Sedang |
| 🟡 Sedang | 26 | Onboarding & Placement Test | UX | Sedang |
| 🟡 Sedang | 27 | Study Planner / Jadwal Belajar | Produktivitas | Sedang-Besar |
| 🟢 Rendah | 28 | Mini Game | Gamifikasi | Sedang |
| 🟢 Rendah | 29 | Tema & Kustomisasi UI | UX | Kecil-Sedang |
| 🟢 Rendah | 30 | Backup & Restore Progress | Data | Kecil |

---

### FASE 21 — Konten Lanjutan: Kosakata N3 & HSK 4

**Tujuan:** Membuka NihonHan untuk pelajar intermediate yang sudah kuasai N5/N4 dan HSK 1–3.

**Target konten:**

**Bahasa Jepang — N3:**
- `jp-vocab-n3.js` — 300+ kata kosakata N3, 15 tema (berita, emosi, masyarakat, alam, teknologi, dll)
- `jp-grammar-n3.js` — 30+ pola grammar N3:
  - 〜ば / 〜なければならない / 〜ようだ / 〜らしい
  - 〜ことにする / 〜てしまう / 〜ておく / 〜てある
  - 〜のに / 〜ものの / 〜わけだ / 〜はずだ

**Bahasa Mandarin — HSK 4:**
- `hanzi-hsk4.js` — 300 karakter baru HSK 4
- `zh-vocab-hsk4.js` — 300+ kata kosakata HSK 4

**File yang perlu dibuat/diubah:**
```
assets/js/data/jp-vocab-n3.js       [BARU]
assets/js/data/jp-grammar-n3.js     [BARU]
assets/js/data/hanzi-hsk4.js        [BARU]
assets/js/data/zh-vocab-hsk4.js     [BARU]
pages/japanese/vocabulary.html      [UPDATE] — tab N3
pages/japanese/grammar.html         [UPDATE] — tab N3
pages/mandarin/hanzi.html           [UPDATE] — tab HSK4
pages/mandarin/vocabulary.html      [UPDATE] — tab HSK4
pages/dashboard.html                [UPDATE] — progress cards N3 & HSK4
```

**Catatan penting:**
- Pisahkan file data per level agar tidak terlalu berat (jangan gabung ke 1 file besar)
- Prioritaskan kata yang benar-benar sering muncul di JLPT N3 / HSK 4 real test
- Verifikasi akurasi data sebelum commit — kesalahan pengucapan/arti fatal untuk pembelajaran

---

### FASE 22 — Listening Mode (Audio Quiz)

**Tujuan:** Mode quiz baru di mana soal berupa audio. User mendengar kata lalu memilih/mengetik artinya — melatih kemampuan listening, bukan hanya reading.

**Cara kerja:**
1. Quiz dimulai dalam "Listening Mode"
2. Karakter/kata **disembunyikan** — hanya ada tombol 🔊
3. Audio di-play otomatis saat soal muncul
4. User memilih arti yang benar (atau mengetik romaji/pinyin)
5. Setelah jawab, karakter baru terungkap
6. Skor bonus +5 XP tiap soal Listening yang benar

**Perbedaan dari Quiz Normal:**

| | Quiz Normal | Listening Mode |
|--|-------------|----------------|
| Soal | Teks karakter | Audio (tersembunyi) |
| Skill | Reading | Listening |
| Timer | 20 detik | 25 detik |

**File yang perlu dibuat/diubah:**
```
pages/japanese/quiz.html        [UPDATE] — tambah pilihan mode "Listening"
pages/mandarin/quiz.html        [UPDATE] — sama
assets/js/pages/quiz-jp.js      [UPDATE] — listening mode logic
assets/js/pages/quiz-zh.js      [UPDATE] — sama
assets/css/quiz.css             [UPDATE] — UI hidden-character card
```

**Catatan:** Gunakan `AudioEngine.speakJP()` / `speakZH()` yang sudah ada (Fase 9). Pastikan fallback graceful jika browser tidak punya voice.

---

### FASE 23 — Stroke Order Animasi (Hiragana & Katakana)

**Tujuan:** Animasi urutan coretan (stroke order) untuk semua hiragana dan katakana. Kanji sudah punya stroke widget — sekarang gilirannya kana.

**Rencana implementasi:**
- Data SVG stroke order untuk 46 hiragana dasar + dakuten + kombinasi
- Data SVG stroke order untuk 46 katakana dasar + dakuten + kombinasi
- Tab "✍️ Menulis" baru di halaman Hiragana dan Katakana
- Animasi: stroke muncul satu per satu, panah arah + nomor urutan
- Mode latihan (Fase 23.2): canvas kosong, user trace dengan mouse/finger

**File yang perlu dibuat/diubah:**
```
assets/js/data/hiragana-strokes.js   [BARU] — data SVG stroke order
assets/js/data/katakana-strokes.js   [BARU] — data SVG stroke order
pages/japanese/hiragana.html         [UPDATE] — tab Menulis
pages/japanese/katakana.html         [UPDATE] — tab Menulis
assets/js/pages/hiragana.js          [UPDATE] — init stroke tab
assets/js/pages/katakana.js          [UPDATE] — sama
assets/css/japanese.css              [UPDATE] — canvas trace styling
```

**Catatan:** Data SVG stroke open-source tersedia (KanjiVG-style). Prioritaskan animasi dulu; mode trace (Canvas API) bisa jadi Fase 23.2.

---

### FASE 24 — Vocabulary Builder (Kalimat Kontekstual)

**Tujuan:** Setiap kata kosakata punya 3–5 contoh kalimat dengan level kesulitan berbeda.

**Fitur:**
- Section "Contoh Kalimat" di modal kosakata
- 3–5 kalimat per kata (N5 ke N3, dari sederhana ke kompleks)
- Setiap kalimat: JP + romaji/pinyin + terjemahan
- Tombol 🔊 per kalimat
- "Kalimat Quiz": kalimat dengan satu kata dikosongkan, user isi

**Format data yang disarankan:**
```javascript
{
  word: '食べる',
  reading: 'たべる',
  romaji: 'taberu',
  meaning: 'makan',
  sentences: [
    { jp: '毎日ご飯を食べます。', romaji: 'Mainichi gohan wo tabemasu.',
      id: 'Saya makan nasi setiap hari.', level: 'N5' },
    { jp: '友達と一緒に食べるのが好きです。', romaji: '...', id: '...', level: 'N4' }
  ]
}
```

**File yang perlu dibuat/diubah:**
```
assets/js/data/jp-vocab.js          [UPDATE] — tambah field 'sentences' per kata
assets/js/data/zh-vocab.js          [UPDATE] — sama
assets/js/pages/jp-vocab.js         [UPDATE] — render sentences di modal/expand
assets/js/pages/zh-vocab.js         [UPDATE] — sama
assets/css/japanese.css             [UPDATE] — sentence list styling
assets/css/mandarin.css             [UPDATE] — sama
```

---

### FASE 25 — Leaderboard Lokal & Tantangan Teman

**Tujuan:** Beberapa user di device yang sama bisa lihat progress masing-masing dan bersaing (cocok untuk HP keluarga atau lab sekolah).

**Fitur:**
- Leaderboard: tabel peringkat semua user di device (XP, streak, badge)
- Perbandingan Progress: side-by-side chart dua user
- Challenge Teman: user A tantang user B dengan target spesifik

**Catatan:** Semua data multi-user sudah ada di localStorage sejak Fase 1 — hanya perlu halaman visualisasi baru. Tidak butuh server.

**File yang perlu dibuat/diubah:**
```
pages/leaderboard.html              [BARU]
assets/js/pages/leaderboard.js      [BARU]
assets/css/leaderboard.css          [BARU]
pages/dashboard.html                [UPDATE] — link ke leaderboard
```

---

### FASE 26 — Onboarding & Placement Test

**Tujuan:** User baru tidak langsung "nyemplung" ke semua konten. Ada proses onboarding yang menentukan level awal dan memberikan rekomendasi modul.

**Alur (5 langkah):**
1. Welcome screen dengan animasi karakter
2. Pilih bahasa fokus: Jepang / Mandarin / Keduanya
3. Placement Test: 10 soal singkat → tentukan Pemula / Menengah
4. Rekomendasi modul berdasarkan hasil test
5. Set target harian (menit/hari) → Dashboard tampilkan modul rekomendasi

**File yang perlu dibuat/diubah:**
```
pages/onboarding.html               [BARU] — multi-step wizard
assets/js/pages/onboarding.js       [BARU]
assets/css/onboarding.css           [BARU]
assets/js/core/auth.js              [UPDATE] — redirect ke onboarding setelah register
pages/dashboard.html                [UPDATE] — section "Modul Direkomendasikan"
```

**localStorage keys baru:**
```
nh_user_{id}_onboarding   → { completed, focusLang: 'jp'|'zh'|'both',
                               level: 'beginner'|'intermediate', dailyGoal: 15 }
```

---

### FASE 27 — Study Planner / Jadwal Belajar

**Tujuan:** User bisa set target ujian (JLPT N5/N4/N3, HSK 1–4) + tanggal ujian → sistem buatkan jadwal belajar harian otomatis.

**Fitur:**
- Goal Setting: pilih target ujian + tanggal ujian
- Auto Schedule: sistem hitung berapa item perlu dipelajari/hari
- Daily To-Do: dashboard tampilkan "hari ini: 5 kanji + 3 grammar + 1 quiz"
- Progress Timeline: grafik progress vs jadwal ideal
- Catch-up Mode: jadwal menyesuaikan jika ada hari terlewat

**File yang perlu dibuat/diubah:**
```
pages/planner.html                  [BARU]
assets/js/pages/planner.js          [BARU]
assets/js/modules/planner.js        [BARU] — schedule calculation engine
assets/css/planner.css              [BARU]
pages/dashboard.html                [UPDATE] — daily to-do dari planner
```

**localStorage keys baru:**
```
nh_user_{id}_planner   → { goal, targetDate, dailyQuota, schedule: {...} }
```

---

### FASE 28 — Mini Game

**Tujuan:** Variasi belajar melalui game ringan yang tetap melatih hafalan.

**Tiga game yang direncanakan:**

**Game 1 — Memory Match (Kartu Pasangan):**
- Grid 4×4 atau 6×6 kartu terbalik
- Klik 2 kartu: cocok (karakter + artinya) → menghilang
- Timer + skor combo

**Game 2 — Word Scramble:**
- Kata/kalimat diacak hurufnya
- User susun kembali dengan drag-and-drop
- Tingkat kesulitan bertahap

**Game 3 — Falling Kana (Arcade):**
- Karakter hiragana/katakana jatuh dari atas layar
- User ketik romaji sebelum menyentuh garis bawah
- Semakin lama semakin cepat

**File yang perlu dibuat:**
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

### FASE 29 — Tema & Kustomisasi UI

**Tujuan:** User bisa ganti tema warna sesuai preferensi.

**5 tema yang direncanakan:**

| Tema | Warna Utama | Aksen | Vibe |
|------|-------------|-------|------|
| Sakura (default) | Merah #C0392B | Gold #D4AF37 | Tradisional Jepang |
| Zen | Abu gelap | Hijau sage | Minimalis |
| Neon Tokyo | Ungu tua | Cyan neon | Futuristik |
| Bamboo | Hijau tua | Kuning | Alam Mandarin |
| Midnight | Hitam | Oranye | Dark mode kuat |

**Implementasi:** CSS custom properties di `main.css` sudah ada — tinggal buat override per tema. Pilihan di Settings → Tampilan dengan preview real-time.

**File yang perlu dibuat/diubah:**
```
assets/css/themes.css               [BARU] — semua theme variable overrides
assets/js/modules/theme.js          [BARU] — ThemeSystem
pages/settings.html                 [UPDATE] — theme picker + preview
assets/js/pages/settings.js         [UPDATE] — bind theme picker
```

---

### FASE 30 — Backup & Restore Progress

**Tujuan:** User bisa export semua data progress ke file JSON dan import kembali di device lain — mengatasi ketakutan kehilangan progress jika localStorage terhapus.

**Fitur:**
- Export: tombol "Backup Data" → download `nihonhan-backup-[tanggal].json`
- Import: tombol "Restore Data" → pilih file → semua progress pulih
- Auto-backup lokal: setiap 7 hari simpan snapshot ke localStorage (max 3 snapshot)
- Validasi: cek integritas file backup sebelum import

**Format backup:**
```json
{
  "version": "1.0",
  "exportDate": "2026-02-24",
  "userId": "usr_xxx",
  "userName": "Budi",
  "data": {
    "progress": {},
    "srs": {},
    "favorites": {},
    "xp": {},
    "badges": {},
    "activity": {},
    "streak": {},
    "challenges": {}
  }
}
```

**File yang perlu dibuat/diubah:**
```
assets/js/modules/backup.js         [BARU] — BackupSystem: export(), import(), validate()
pages/settings.html                 [UPDATE] — section "Backup & Restore"
assets/js/pages/settings.js         [UPDATE] — bind tombol backup/restore
```

---

### FASE BONUS — Ide Jangka Panjang

**B1 — Text-to-Speech Custom Voice:** Integrasi API TTS yang lebih natural (Google TTS atau OpenAI TTS) sebagai pengganti/pelengkap Web Speech API yang kualitas suaranya bergantung OS.

**B2 — OCR: Scan & Terjemah:** User foto teks Jepang/Mandarin → app kenali karakter dan tampilkan arti. Implementasi via Tesseract.js (OCR offline, tidak butuh server).

**B3 — Kamus Inline:** Tap/klik kata di dialog atau teks untuk muncul popup arti langsung. Butuh database kamus yang lebih lengkap.

**B4 — Multi-Platform Sync:** Jika suatu saat ada backend, progress bisa sync antar device. Saat ini di luar prinsip "offline-first pure localStorage".

---

## 11. Panduan untuk Claude Selanjutnya

### Sebelum Mulai Fase Baru

1. **Baca README ini dulu** secara keseluruhan — pahami struktur, pola kode, dan bug fix yang sudah ada
2. **Baca kode file yang akan diubah** sebelum mulai coding
3. **Tentukan fase yang dikerjakan** berdasarkan Roadmap di atas (Fase 21 = konten N3/HSK4)

### Aturan Wajib

- Ikuti pola `App.init('page-id')` dan `Router.guard()` di setiap halaman baru
- Gunakan `Storage.getUser()` / `Storage.setUser()` untuk semua data persisten — JANGAN gunakan `localStorage` langsung
- Gunakan `Progress.markLearned()` / `Progress.getLearned()` untuk tracking hafalan
- Tambahkan `ChallengeSystem.onLearnItem()` / `onModuleVisit()` di setiap modul baru (lihat `progress.js` Fase 15)
- Tambahkan `XPSystem.earnLearnItem()` / `earnQuizComplete()` di modul yang relevan
- Setiap halaman authenticated **wajib** punya: `<script>` anti-FOUC di head, link manifest PWA, script `pwa.js`, dan tombol theme toggle di topbar

### Naming Convention

```
Halaman HTML    → pages/{bahasa}/{nama-modul}.html
Script halaman  → assets/js/pages/{nama-halaman}.js
Data konten     → assets/js/data/{modul}-{level}.js
Modul reusable  → assets/js/modules/{nama-modul}.js
CSS per fitur   → assets/css/{nama-fitur}.css
```

### Setelah Setiap Fase Selesai

1. Update section **Riwayat Fase** di README ini
2. Update section **Struktur Folder** jika ada file baru
3. Update **localStorage Key Reference** jika ada key baru
4. Update **Ringkasan Konten** jika ada konten baru
5. Buat zip baru dengan nama `nihonhan_fase{N}.zip`

### Anti-Pattern yang Harus Dihindari

- ❌ Jangan gunakan `localStorage` langsung — selalu pakai `Storage.getUser()`
- ❌ Jangan hardcode path — selalu gunakan `getBase()` untuk path relatif
- ❌ Jangan gabungkan data konten besar ke 1 file — pisah per level/modul
- ❌ Jangan lupa tambahkan script baru ke semua halaman yang relevan (termasuk sidebar update)
- ❌ Jangan lupa test di GitHub Pages (bukan hanya lokal) — bug path sering tidak ketahuan lokal

### Checklist Halaman Baru

Untuk setiap halaman authenticated baru, pastikan memiliki:
- [ ] Anti-FOUC script di `<head>` untuk dark mode
- [ ] `<link rel="manifest" href="...manifest.json">`
- [ ] Meta PWA (`apple-mobile-web-app-capable`, `theme-color`, dll)
- [ ] Script `pwa.js` sebelum closing `</body>`
- [ ] Tombol `.theme-toggle-btn` di topbar
- [ ] `Router.guard()` di script halaman
- [ ] `App.init('nama-halaman')` di script halaman
- [ ] Link halaman ini di sidebar semua halaman lain
- [ ] Script `challenge.js` jika halaman punya aktivitas belajar
- [ ] Script `xp.js` jika halaman punya aktivitas yang memberi XP

---

*NihonHan — Belajar itu indah, satu karakter dalam satu waktu.*

*Dokumen ini adalah README tunggal yang mencakup semua informasi proyek — dari konteks, arsitektur, riwayat pengembangan, hingga roadmap lengkap fase 21 dan seterusnya.*
