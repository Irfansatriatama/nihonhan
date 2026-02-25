# NihonHan — Belajar Bahasa Jepang & Mandarin

Aplikasi web interaktif untuk mempelajari Bahasa Jepang dan Mandarin.
Offline-first, pure localStorage, tidak membutuhkan server atau database.

---

## Status Proyek

**Fase Saat Ini: FASE 20.4 SELESAI ✅**
*(Fase 16 di-skip sementara)*

---

## Bug Fix

### Bug Fix #1 — `progress.js` & `pwa.js` [FIXED — sebelumnya]

**Bug 1 — Missing closing brace di `saveQuizScore()` dalam `progress.js`:**
- Fungsi `saveQuizScore()` kehilangan closing brace `}` setelah blok `ChallengeSystem`
- Dampak: **Seluruh modul Progress gagal load → semua halaman modul tidak bisa render**
- Fix: Tambahkan `}` penutup `saveQuizScore` sebelum `resetModule`

**Bug 2 — Salah hitung path di `pwa.js`:**
- Fix: Kalkulasi ulang path relatif ke sw.js

---

### Bug Fix #2 — GitHub Pages: Hiragana/Katakana/Kanji tidak muncul [FIXED]

**Root Cause:** Fungsi `getBase()` di `router.js` dan `auth.js` menggunakan logika yang terlalu sederhana:
```js
// LAMA (broken untuk GitHub Pages subdirectory):
return window.location.pathname.includes('/pages/') ? '../' : '';
```

Ini hanya mengembalikan `'../'` untuk SEMUA halaman yang mengandung `/pages/` di path-nya — padahal halaman di subdir seperti `/pages/japanese/hiragana.html` butuh `'../../'`.

**Dampak di GitHub Pages:**
- URL: `https://user.github.io/nihonhan_fase13/pages/japanese/hiragana.html`
- Saat `Router.guard()` dipanggil dan user belum login: redirect ke `'../pages/login.html'`
- Browser resolve: `/nihonhan_fase13/pages/` + `../pages/login.html` = `/nihonhan_fase13/pages/pages/login.html` ← **404!**
- Karena redirect gagal, halaman Hiragana/Katakana/Kanji/Kosakata JP/Mandarin yang ada di subfolder `/pages/japanese/` dan `/pages/mandarin/` **tidak bisa load kontennya**

**Kenapa lokal tidak masalah?** Saat buka file lokal, user biasanya sudah punya session di localStorage. `Router.guard()` tidak memicu redirect karena sudah login.

**Fix — `router.js` & `auth.js` `getBase()`:**
```js
// BARU (bekerja untuk local, GitHub Pages, semua kedalaman folder):
function getBase() {
  const parts = window.location.pathname.split('/');
  const pagesIdx = parts.indexOf('pages');
  if (pagesIdx === -1) return ''; // Di root (index.html)
  // Hitung: 1 untuk folder 'pages' + jumlah subdir di dalamnya
  const afterPages = parts.slice(pagesIdx + 1).filter(p => p && !p.includes('.'));
  const depth = 1 + afterPages.length;
  return '../'.repeat(depth);
}
```

**Fix — `pwa.js` `_resolveSWPath()` & `_resolveScope()`:**
- Dikoreksi menggunakan logika serupa (anchor ke segmen `pages` dalam URL)
- Bekerja untuk lokal maupun GitHub Pages subdirectory

**Fix — `sw.js`:**
- Cache name di-bump dari `nihonhan-v1` → `nihonhan-v2` untuk memaksa refresh cache lama yang mungkin sudah ter-cache dengan kode broken

**File yang diubah:** `assets/js/core/router.js`, `assets/js/core/auth.js`, `assets/js/modules/pwa.js`, `sw.js`

---

## Progress Per Fase

### FASE 20.4 — Live Clock di Topbar Dashboard [SELESAI]

**Tujuan:** Menampilkan waktu lokal Indonesia secara real-time di topbar halaman Dashboard (jam:menit:detik WIB), diperbarui setiap detik.

**Penempatan:** Topbar kanan (di samping kiri tombol toggle tema), dalam format dua baris — baris atas tanggal lengkap, baris bawah jam besar berwarna merah.

**Format waktu:** `HH:MM:SS WIB` (24 jam, selalu 2 digit, suffix WIB)

**File yang diubah:**

| File | Perubahan |
|------|-----------|
| `pages/dashboard.html` | Ganti `<span id="topbar-date">` menjadi container `.topbar-datetime` berisi dua elemen: `.topbar-date-text` (tanggal) dan `.topbar-clock` (jam live) |
| `assets/js/pages/dashboard.js` | Tambah fungsi `updateClock()` + `setInterval(updateClock, 1000)` untuk update jam setiap detik |
| `assets/css/dashboard.css` | Tambah CSS `.topbar-datetime`, `.topbar-date-text`, `.topbar-clock` (merah, bold, tabular-nums), dark mode override, hidden di mobile |

---



**Masalah:** Saat halaman Katakana dibuka, dua menu sidebar aktif sekaligus — Hiragana dan Katakana. Ini karena di `pages/japanese/katakana.html`, nav-item Hiragana secara keliru memiliki:
- `class="nav-item active"` (seharusnya tidak ada `active`)
- `href="katakana.html"` (seharusnya `href="hiragana.html"`)

**Fix di `pages/japanese/katakana.html`:**
- Nav-item Hiragana: hapus class `active`, perbaiki href dari `katakana.html` → `hiragana.html`

---



**Masalah:** Seluruh konten halaman (page body) menempel di kiri dekat sidebar, tidak ter-center di area konten yang tersedia.

**Fix di `assets/css/layout.css`:**
- `.main-content` — ditambah `align-items: center` agar child elements ter-center secara horizontal
- `.page-body` — ditambah `margin: 0 auto` agar konten ber-center sendiri di dalam main-content
- `.topbar` — ditambah `width: 100%` dan `align-self: stretch` agar topbar tetap full-width (tidak ikut ter-center seperti page-body)

**Efek:** Semua halaman kini menampilkan konten di tengah area main (di antara sidebar dan tepi kanan layar), bukan menempel ke kiri.

---



**Tujuan:** NihonHan bisa di-install di HP/komputer seperti aplikasi native dan berjalan penuh offline.

**Komponen PWA yang diimplementasikan:**

1. **`manifest.json`** — Web App Manifest lengkap:
   - Nama, deskripsi, bahasa, ikon 192×192 & 512×512, `display: standalone`, `theme_color: #C0392B`
   - Shortcuts: Dashboard, Quiz JP, Quiz ZH

2. **`sw.js`** — Service Worker dengan dual strategy:
   - **Cache-First** untuk CSS/JS/gambar, **Network-First** untuk HTML
   - Cache 50+ file saat install, hapus cache lama saat activate
   - Handle `SKIP_WAITING` message untuk update

3. **`assets/js/modules/pwa.js`** — PWA Manager:
   - Install Prompt Banner (popup merah, auto-hide 12s, dismiss per hari)
   - Update Banner saat SW baru tersedia
   - Offline Indicator banner saat `navigator.onLine === false`
   - `registerSW()` dengan path resolver otomatis dari halaman manapun

4. **Ikon app** — `assets/icons/icon-192.png` & `icon-512.png`:
   - Background merah #C0392B, teks "NH" putih bold, sub-teks "日漢" gold

5. **Update 21 halaman** — manifest link, PWA meta, apple-touch-icon, script pwa.js

6. **Settings** — Seksi "📲 Aplikasi (PWA)": status instalasi, status online/offline, info cache

**File Baru:** `manifest.json`, `sw.js`, `assets/js/modules/pwa.js`, `assets/icons/icon-192.png`, `assets/icons/icon-512.png`

**File Diupdate:** `index.html`, `404.html`, `pages/settings.html`, `assets/js/pages/settings.js`, semua 19 halaman authenticated

**Catatan:** SW hanya aktif di HTTPS atau localhost. Deploy ke GitHub Pages / Netlify untuk PWA penuh.

---

### FASE 19 — Export Progress ke PDF [SELESAI]

**Tujuan:** Pengguna bisa mengunduh/mencetak laporan kemajuan belajar sebagai PDF langsung dari browser, tanpa library eksternal.

**Teknologi:** `window.print()` dengan CSS `@media print` + `print-color-adjust: exact` untuk memastikan warna/gradien muncul saat dicetak.

**Konten laporan:**
- Header bergradient merah dengan logo NihonHan + tanggal cetak
- Kartu user (avatar, nama, email, tanggal bergabung, level badge emas)
- Ringkasan 8 pencapaian: total item, streak terbaik, quiz selesai, akurasi, XP, level, badge, favorit
- Progress level XP: bar progress + 7 level dots (completed/active/inactive)
- Progress per modul: 7 modul dengan progress bar merah + hitungan item
- Heatmap aktivitas 28 hari terakhir (5 level intensitas warna)
- Grid badge: 12 badge (earned = golden border, not earned = grayscale)
- Tabel riwayat 15 quiz terbaru dengan pill akurasi berwarna
- Kumpulan item yang telah dipelajari per modul (chip karakter, max 20 per modul)
- Footer gelap dengan tagline

**File Baru:**
- `pages/report.html` — halaman laporan standalone (tidak butuh sidebar/router)
- `assets/css/report.css` — styling screen + `@media print` lengkap
- `assets/js/pages/report.js` — render semua data dari localStorage

**File Diupdate:**
- `pages/stats.html` — Tombol "🖨️ Ekspor PDF" di topbar (klik → buka tab baru)
- **Semua 18 halaman authenticated** — Sidebar ditambahkan link "📎 Ekspor PDF" di section Umum

**Cara kerja:**
1. User klik "Ekspor PDF" dari sidebar atau tombol di halaman Statistik
2. Tab baru terbuka: `report.html` menampilkan loading spinner
3. `report.js` membaca semua data dari localStorage dan merender laporan
4. Toolbar screen-only muncul di atas dengan tombol "Cetak / Simpan PDF"
5. User klik tombol → `window.print()` → dialog print browser
6. User pilih "Save as PDF" di dialog print
7. Parameter URL `?autoprint=1` tersedia untuk auto-trigger print langsung

**Catatan print:**
- Sidebar & toolbar disembunyikan saat print (`display:none`)
- Semua warna hardcoded (bukan CSS var) agar muncul saat print
- `print-color-adjust: exact` memastikan background color/gradient dicetak
- Layout dioptimasi untuk kertas A4 portrait (margin 15mm)
- `break-inside: avoid` di section penting untuk cegah potong di tengah

**localStorage keys yang dibaca:**
```
nh_users                     — data user (nama, email, avatar, createdAt)
nh_session                   — session aktif untuk ambil userId
nh_user_{id}_stats           — totalLearned, quizCompleted, totalCorrect, totalQuestions
nh_user_{id}_streak          — count, best
nh_user_{id}_xp              — total XP + history
nh_user_{id}_progress        — progress per modul (learned[], quiz_scores[])
nh_user_{id}_activity        — heatmap aktivitas harian
nh_user_{id}_badges          — badge yang diraih
nh_user_{id}_favorites       — item favorit per modul
```

---



**Tujuan:** Pengingat harian agar pengguna tidak lupa belajar dan streak tidak putus. Menggunakan Web Notifications API dengan scheduling berbasis `setTimeout`.

**Cara Kerja:**
- Pengguna set jam pengingat (default 20:00) dan aktifkan toggle di Settings
- Browser meminta izin notifikasi (`Notification.requestPermission()`)
- Timer dihitung otomatis: jika jam target hari ini sudah lewat, dijadwalkan besok
- Notifikasi muncul saat jam yang ditentukan dengan pesan motivasi acak
- Jika user sudah belajar hari ini (ada `activity[today]`), notifikasi **tidak** ditampilkan
- Notifikasi otomatis dijadwalkan ulang setiap hari

**Limitasi:**
- Hanya bekerja saat tab/browser masih terbuka (tanpa Service Worker)
- Butuh izin eksplisit dari pengguna
- Jika browser ditutup setelah set reminder, timer hilang → akan reschedule saat app dibuka lagi

**File Baru:**
- `assets/js/modules/reminder.js` — ReminderSystem: `init()`, `schedule()`, `cancel()`, `preview()`, `requestPermission()`, `getSettings()`, `saveSettings()`, `formatTime()`, `parseTime()`

**File Diupdate:**
- `pages/settings.html` — Section baru "🔔 Pengingat Streak" dengan toggle on/off, time picker (input type="time"), tombol Tes Notifikasi, status bar
- `assets/css/settings.css` — CSS: `.reminder-time-input`, `.reminder-status-bar`, dark mode support
- `assets/js/pages/settings.js` — Bind semua reminder controls: toggle, time input, preview button
- `pages/dashboard.html` — Script `reminder.js` ditambahkan
- `assets/js/pages/dashboard.js` — `ReminderSystem.init(user.id)` dipanggil saat dashboard load

**Fitur:**
- Toggle "Aktifkan Pengingat Belajar" dengan flow permission request otomatis
- Time picker untuk memilih jam pengingat (format HH:MM, default 20:00)
- Pesan notifikasi bervariasi (5 pesan berbeda dipilih acak) agar tidak monoton
- Smart skip: notifikasi tidak muncul jika user sudah belajar hari itu
- Tombol "Tes Sekarang" untuk preview notifikasi langsung
- Status bar hijau saat pengingat aktif, menampilkan jam yang dijadwalkan
- Pesan error jika izin ditolak dengan panduan buka pengaturan browser
- Dark mode support penuh

**localStorage keys baru:**
```
nh_user_{id}_reminder  — { enabled: bool, hour: int, minute: int }
```

---

**Tujuan:** Halaman baru yang menyajikan contoh percakapan per situasi dalam bahasa Jepang dan Mandarin, lengkap dengan fitur interaktif untuk belajar dialog secara bertahap.

**Situasi Dialog Jepang (8 dialog, N5–N4):** Di Restoran, Di Stasiun, Berkenalan, Berbelanja, Menanyakan Arah, Di Dokter/RS, Di Tempat Kerja, Percakapan Telepon.

**Situasi Dialog Mandarin (7 dialog, HSK1–HSK3):** Di Restoran, Berkenalan, Berbelanja, Menanyakan Arah, Di Dokter, Di Tempat Kerja, Percakapan Telepon.

**File Baru:**
- `assets/js/data/jp-dialogs.js` — 8 dialog Jepang lengkap
- `assets/js/data/zh-dialogs.js` — 7 dialog Mandarin lengkap
- `pages/japanese/dialog.html` — Halaman dialog bahasa Jepang
- `pages/mandarin/dialog.html` — Halaman dialog bahasa Mandarin
- `assets/js/pages/jp-dialog.js` — Logic grid, viewer, playthrough, toggle JP
- `assets/js/pages/zh-dialog.js` — Logic grid, viewer, playthrough, toggle ZH
- `assets/css/dialog.css` — CSS lengkap: dialog-card, viewer, line, vocab, dark mode

**File Diupdate:**
- **Semua 18 halaman authenticated** — Sidebar ditambahkan link Dialog JP dan Dialog ZH

**Fitur:**
- Grid kartu dialog dengan icon, badge level, jumlah baris percakapan
- Filter per level (N5/N4 untuk JP; HSK1/HSK2/HSK3 untuk ZH)
- Viewer detail dengan baris A/B berbeda warna (merah=A, emas=B)
- Toggle Romaji/Pinyin dan Terjemahan on/off (mode latihan)
- Mode Playthrough: highlight baris per baris + auto-speak via Web Speech API
- Progress bar visual saat playthrough berlangsung
- Tombol 🔊 per baris untuk dengar manual
- Kosakata kunci per dialog (klik untuk dengar pengucapan)
- Integrasi Challenge System & Progress tracking
- Dark mode support penuh

---

### FASE 1 — Fondasi & Autentikasi [SELESAI]
Register, login, logout, session, streak, dashboard, profil, ganti password, sidebar, toast, responsive.

### FASE 2 — Transisi & 404 [SELESAI]
404.html, transitions.css, animasi fade-in.

### FASE 3 — Hiragana & Katakana [SELESAI]
104 hiragana + 104 katakana. Tab Tabel/Flashcard/Quiz Mini. Filter. Flashcard 3D flip.

### FASE 4 — Kanji [SELESAI]
153 kanji (N5:103, N4:30, N3:20). Filter JLPT. Search. Stroke widget. Modal detail.

### FASE 5 — Mandarin [SELESAI]
Pinyin (21 inisial + 38 final + kombinasi), Nada (5 tone + kurva SVG), Hanzi (HSK 1-3 = 208 karakter), Kosakata ZH (120+ kata per 15 tema).

### FASE 6 — Quiz & Gamifikasi [SELESAI]
QuizEngine (multiple choice, timer, feedback), BadgeSystem (12 badge), Quiz JP dan Quiz ZH lengkap.

### FASE 7 — Polish & Pengaturan [SELESAI]
Bug fix dashboard chart, halaman Settings (toggle romaji/pinyin/animasi/timer, reset progress), halaman Statistik (progress bar modul, riwayat quiz, badge grid, heatmap 28 hari), sidebar update semua halaman.

---

### FASE 15 — Challenge Harian [SELESAI]

**Tujuan:** Setiap hari ada 3 tantangan spesifik yang mendorong pengguna belajar dengan target jelas dan reward XP.

**Mekanisme:**
- Challenge di-generate deterministik setiap hari menggunakan seed dari tanggal (YYYYMMDD) → LCG algoritma → 3 template unik per hari
- Progress ditracking otomatis saat aktivitas belajar terjadi (hafal item, selesai quiz, SRS review)
- XP diklaim manual via tombol "Klaim XP" di dashboard setelah challenge selesai
- Konfeti CSS-only saat semua challenge hari ini berhasil diklaim

**Tipe Challenge:**
| Tipe | Contoh | XP Reward |
|------|--------|-----------|
| `learn_items` | Hafal 5 item baru | 35–70 XP |
| `quiz_complete` | Selesaikan 1–2 sesi quiz | 30–55 XP |
| `quiz_accuracy` | Quiz akurasi ≥80% / 100% | 45–80 XP |
| `srs_review` | Review 5–10 kartu SRS | 35–55 XP |
| `multi_module` | Belajar 2–3 modul berbeda | 40–60 XP |
| `streak_active` | Belajar hari ini (jaga streak) | 25 XP |

**File Baru:**
- `assets/js/modules/challenge.js` — ChallengeSystem: `getTodayChallenges()`, `updateProgress()`, `claimXP()`, `autoClaimCompleted()`, `getHistory()`, `getSummary()`, trigger helpers per tipe

**File Diupdate:**
- `pages/dashboard.html` — Section "🏆 Tantangan Hari Ini" dengan list 3 challenge + progress bar + tombol klaim + konfeti container
- `assets/js/pages/dashboard.js` — `renderChallenge()` (render list, bind claim buttons, trigger konfeti), `launchConfetti()` (40 partikel CSS animasi)
- `assets/css/dashboard.css` — CSS challenge-item, challenge-progress, challenge-claim-btn, confetti-wrap, confetti-piece + dark mode
- `assets/js/modules/progress.js` — `markLearned()` memanggil `ChallengeSystem.onLearnItem()` + `onModuleVisit()`; `saveQuizScore()` memanggil `onQuizComplete()` + `onQuizAccuracy()` + `onModuleVisit()`
- `assets/js/modules/srs-ui.js` — Rating button handler memanggil `ChallengeSystem.onSrsReview()` + `onModuleVisit()`
- `pages/stats.html` — Section "🏆 Riwayat Challenge Harian" baru + script challenge.js
- `assets/js/pages/stats.js` — Render riwayat challenge (max 20 terbaru) + summary badge
- **Semua halaman modul** — Script `challenge.js` ditambahkan agar progress terhitung saat belajar

**Fitur:**
- 3 challenge unik setiap hari, berganti otomatis tengah malam (seed tanggal)
- Progress bar per challenge (untuk tipe multi-step)
- Tombol "Klaim XP" muncul saat challenge selesai, berubah jadi ✅ setelah diklaim
- Toast XP muncul saat klaim reward
- Konfeti 40 partikel warna-warni (CSS animation) saat semua challenge diklaim
- Badge "X/3 Selesai" di header section dashboard
- Streak aktif otomatis dipenuhi jika user mengunjungi dashboard
- Riwayat lengkap di halaman Statistik (tanggal, icon, XP reward)
- Data cleanup otomatis (hapus data challenge >14 hari lalu)

**localStorage keys baru:**
```
nh_user_{id}_challenges  — { byDate: { "2026-02-24": [{...challenge+progress}] }, history: [{...}] }
```

---

### FASE 14 — Gamifikasi Lanjutan (XP & Level System) [SELESAI]

**Tujuan:** Meningkatkan retensi pengguna dengan sistem poin pengalaman (XP) dan level yang naik secara bertahap.

**Sistem Level:**
| Level | Nama JP | Nama ID | XP Dibutuhkan | Warna |
|-------|---------|---------|---------------|-------|
| 1 | 入門 | Pemula | 0 | Abu |
| 2 | 初級 | Dasar | 100 | Hijau |
| 3 | 中級 | Menengah | 300 | Biru |
| 4 | 上級 | Lanjutan | 700 | Ungu |
| 5 | 達人 | Mahir | 1.500 | Oranye |
| 6 | 師範 | Ahli | 3.000 | Merah |
| 7 | 名人 | Master | 6.000 | Emas |

**XP per Aktivitas:**
| Aktivitas | XP |
|-----------|-----|
| Hafal 1 karakter/kata baru | +5 XP |
| Selesai sesi quiz | +10 XP |
| Quiz akurasi 100% (bonus) | +25 XP |
| Pertahankan streak 1 hari | +15 XP |
| Buka badge baru | +30 XP |
| Selesai sesi SRS | +8 XP |
| Pertama kali pakai modul baru | +20 XP |

**File Baru:**
- `assets/js/modules/xp.js` — XPSystem: `addXP()`, `earnLearnItem()`, `earnQuizComplete()`, `earnQuizPerfect()`, `earnStreakDay()`, `earnBadge()`, `earnSrsSession()`, `getLevelInfo()`, `getLevelFromXP()`, `getAllLevels()`

**File Diupdate:**
- `assets/js/core/app.js` — Ditambah `toastXP()` (toast +XP dan level up), `renderUserInfo()` diupdate tampilkan level di sidebar
- `assets/js/core/auth.js` — `updateStreak()` kini memanggil `XPSystem.earnStreakDay()` tiap hari baru
- `assets/js/modules/progress.js` — `markLearned()` memanggil `XPSystem.earnLearnItem()`, `saveQuizScore()` memanggil `XPSystem.earnQuizComplete()` + `earnQuizPerfect()` jika 100%
- `assets/css/main.css` — Toast type `.xp` (ungu) dan `.levelup` (gradient oranye) baru
- `assets/css/dashboard.css` — CSS XP bar di welcome banner, level progression dots, XP history list
- `pages/dashboard.html` — XP bar di welcome banner, section "⚡ Level & XP" dengan progress dots dan riwayat
- `assets/js/pages/dashboard.js` — `renderXP()` — render XP bar, level dots, dan history list
- `pages/stats.html` — Section "⚡ XP & Level" baru + script xp.js
- `assets/js/pages/stats.js` — Render XP progress lengkap + riwayat XP di halaman statistik
- **Semua halaman modul** — Script `xp.js` ditambahkan agar XP fires saat markLearned/saveQuizScore

**Fitur:**
- XP bar bergradient emas di welcome banner dashboard (Lv.X + progress bar + label)
- Level progression dots di section "⚡ Level & XP" — visual 7 langkah dengan warna per level
- Toast `+X XP` (ungu) muncul tiap dapat XP
- Toast `🎉 Level Naik! 初級 Dasar` muncul saat naik level (otomatis setelah 600ms)
- Sidebar menampilkan level saat ini di bawah nama user (mis: "Lv.2 初級 Dasar")
- Riwayat XP terbaru (8 entri) di dashboard
- Halaman Statistik: level progress bar lengkap + semua 7 level badge + riwayat 15 XP terakhir
- XP disimpan per-user di localStorage, tidak hilang saat reload
- Level otomatis dihitung dari total XP tanpa perlu set manual

**localStorage keys baru:**
```
nh_user_{id}_xp   — { total: 1250, history: [{action, amount, label, date, totalAfter}] }
```

---

### FASE 13 — Mode Input Jawaban (Quiz) [SELESAI]

**Tujuan:** Meningkatkan kualitas latihan dengan mode "ketik jawaban" di samping mode "pilih jawaban" (multiple choice) yang sudah ada.

**Mekanisme:** Toggle mode di config panel quiz sebelum memulai. Mode input: pengguna mengetik jawaban di text field, sistem memeriksa dengan case-insensitive + normalisasi (romaji diacritic, pinyin tanda nada). Skip tersedia jika tidak tahu.

**File Baru:** Tidak ada file baru.

**File Diupdate:**
- `assets/css/quiz.css` — Ditambah CSS: `.quiz-mode-selector`, `.quiz-mode-btn`, `.quiz-input-wrap`, `.quiz-input-field`, `.quiz-input-submit`, `.quiz-input-skip`, `.quiz-correct-reveal`, dark mode overrides
- `pages/japanese/quiz.html` — Mode selector "🔘 Pilih / ⌨️ Ketik" di config panel, area input `#inputWrap` di session screen
- `pages/mandarin/quiz.html` — Sama seperti quiz JP
- `assets/js/pages/quiz-jp.js` — State `selectedMode`, fungsi `bindModeOptions()`, update `renderQuestion()` untuk branching mode, fungsi baru `submitInputAnswer()`
- `assets/js/pages/quiz-zh.js` — Sama, plus normalisasi pinyin tanda nada (ā→a, ǐ→i, dll)

**Fitur Mode Input:**
- Toggle "🔘 Pilih Jawaban" ↔ "⌨️ Ketik Jawaban" sebelum mulai quiz
- Input field dengan fokus otomatis setiap soal baru
- Submit dengan tombol atau tekan Enter
- Tombol "Lewati soal ini" jika tidak tahu jawaban
- Validasi case-insensitive + trim whitespace
- Normalisasi romaji: ā/á/ǎ/à → a (untuk romaji Jepang)
- Normalisasi pinyin: ā/á/ǎ/à → a, dll (user bisa ketik ni hao tanpa tanda nada)
- Alternatif jawaban didukung (misal: kanji punya multi-meaning)
- Input field berubah hijau (benar) / merah (salah) setelah submit
- Reveal jawaban benar di bawah input saat salah/skip
- Timer diperpanjang 30 detik (vs 20 detik mode pilih)
- Timer expired → otomatis skip soal
- Dark mode support penuh

**Modul yang mendapat Mode Input:**
| Quiz | Mode Pilih | Mode Input | Tipe Input yang Didukung |
|------|------------|------------|--------------------------|
| Quiz JP — Hiragana | ✅ | ✅ | Romaji, Kana |
| Quiz JP — Katakana | ✅ | ✅ | Romaji, Kana |
| Quiz JP — Kanji | ✅ | ✅ | Romaji, Arti ID, Kanji |
| Quiz ZH — Hanzi | ✅ | ✅ | Pinyin (dengan/tanpa nada), Arti ID, Hanzi |
| Quiz ZH — Kosakata | ✅ | ✅ | Pinyin, Arti ID, Karakter Mandarin |

---

### FASE 12 — Favorit & Bookmark [SELESAI]

**Tujuan:** Pengguna bisa menandai item tertentu dengan bintang ⭐ untuk difokuskan saat belajar.

**Algoritma/Mekanisme:** localStorage key `nh_user_{id}_favorites` menyimpan object `{ moduleId: [itemId, ...] }`. Toggle favorit: klik ★ → `Progress.toggleFavorite()` → update state.

**File Baru:**
- Tidak ada file baru (extend progress.js dan CSS)

**File Diupdate:**
- `assets/js/modules/progress.js` — Ditambah fungsi: `markFavorite()`, `unmarkFavorite()`, `isFavorite()`, `getFavorites()`, `getFavoritesAll()`, `toggleFavorite()`
- `assets/css/components.css` — Ditambah CSS: `.fav-btn`, `.modal-fav-btn`, `.fav-stats-grid`, `.fav-stat-card`, dark mode overrides
- `pages/japanese/hiragana.html` — Tombol ★ Favorit di filter-bar (tabel + flashcard), tombol modal-fav-btn di modal header
- `assets/js/pages/hiragana.js` — `showFavOnly` state, filter logic di `renderGrid()`, fav-btn click handler, modal fav btn sync, flashcard filter 'favorites'
- `pages/japanese/katakana.html` — Sama seperti hiragana
- `assets/js/pages/katakana.js` — Sama seperti hiragana
- `pages/japanese/kanji.html` — Tombol ★ Favorit di filter level, tombol modal-fav-btn
- `assets/js/pages/kanji.js` — Favorit support di renderGrid + modal + filter
- `pages/japanese/vocabulary.html` — Tombol ★ Favorit di toolbar
- `assets/js/pages/jp-vocab.js` — Favorit di vocab cards + filter
- `pages/mandarin/hanzi.html` — Tombol ★ Favorit di filter HSK, tombol modal-fav-btn
- `assets/js/pages/hanzi.js` — Favorit support di renderGrid + modal + filter
- `pages/mandarin/vocabulary.html` — Tombol ★ Favorit di toolbar
- `assets/js/pages/zh-vocab.js` — Favorit di vocab cards + filter
- `pages/stats.html` — Section "★ Favorit & Bookmark" baru (ringkasan per modul)
- `assets/js/pages/stats.js` — Render favorit summary dengan jumlah per modul

**Fitur Favorit:**
- Tombol ★ muncul saat hover pada setiap karakter/kartu di: Hiragana, Katakana, Kanji, Kosakata JP, Hanzi, Kosakata ZH
- Tombol ★ di header modal detail untuk toggle favorit langsung dari modal
- Tombol ★ berwarna emas saat item difavoritkan, abu-abu saat tidak
- Filter "★ Favorit" di filter-bar setiap halaman — tampilkan hanya item favorit
- Flashcard "★ Favorit" — sesi flashcard khusus item favorit (Hiragana & Katakana)
- Toast notification saat menambah/menghapus favorit
- Halaman Statistik: section "★ Favorit & Bookmark" dengan hitungan per modul + total
- Dark mode support penuh

**localStorage keys baru:**
```
nh_user_{id}_favorites   — { hiragana: ['あ','い',...], kanji: ['日','本',...], ... }
```

**Modul yang mendapat fitur Favorit:**
| Modul | Grid Cell ★ | Modal ★ | Filter Favorit | Flashcard Favorit |
|-------|------------|---------|----------------|-------------------|
| Hiragana | ✅ (hover) | ✅ | ✅ | ✅ |
| Katakana | ✅ (hover) | ✅ | ✅ | ✅ |
| Kanji | ✅ (hover) | ✅ | ✅ | - |
| Kosakata JP | ✅ (hover) | - | ✅ | - |
| Hanzi | ✅ (hover) | ✅ | ✅ | - |
| Kosakata ZH | ✅ (hover) | - | ✅ | - |

---

### FASE 11 — Spaced Repetition System (SRS) [SELESAI]

**Tujuan:** Algoritma pengulangan cerdas — kartu sulit muncul lebih sering, kartu mudah lebih jarang. Metode terbukti efektif seperti yang digunakan Anki.

**Algoritma:** SM-2 (SuperMemo 2)

**File Baru:**
- `assets/js/modules/srs.js` — SRS Engine: `calculateNext()` (SM-2), `rate()`, `getDueIds()`, `getDueCountPerModule()`, `getModuleStats()`, `intervalLabel()`
- `assets/js/modules/srs-ui.js` — SRS UI renderer: `SrsUI.init()` — reusable session renderer yang menampilkan kartu SRS dengan flip reveal & rating buttons

**File Diupdate:**
- `pages/japanese/hiragana.html` — Tab "🔁 SRS" baru + panel `#tab-srs` + script srs.js & srs-ui.js
- `assets/js/pages/hiragana.js` — Fungsi `initSrsTab()` dengan SrsUI.init
- `pages/japanese/katakana.html` — Tab "🔁 SRS" baru + panel + scripts
- `assets/js/pages/katakana.js` — Fungsi `initSrsTab()`
- `pages/japanese/kanji.html` — Tab "Jelajah" + "🔁 SRS" (wrap content dalam tab-panel) + scripts
- `assets/js/pages/kanji.js` — Tab handler + `initSrsTab()`
- `pages/japanese/vocabulary.html` — Tab "Jelajah" + "🔁 SRS" + scripts
- `assets/js/pages/jp-vocab.js` — Tab handler + `initSrsTab()`
- `pages/mandarin/hanzi.html` — Tab "Jelajah" + "🔁 SRS" + scripts
- `assets/js/pages/hanzi.js` — Tab handler + `initSrsTab()`
- `pages/mandarin/vocabulary.html` — Tab "Jelajah" + "🔁 SRS" + scripts
- `assets/js/pages/zh-vocab.js` — Tab handler + `initSrsTab()`
- `pages/dashboard.html` — Section "Kartu SRS Hari Ini" (tersembunyi sampai user mulai pakai SRS) + script srs.js
- `assets/js/pages/dashboard.js` — Fungsi `renderSrsDue()` — tampilkan modul dengan kartu jatuh tempo
- `assets/css/components.css` — CSS lengkap SRS: stats chips, srs-card, srs-ratings, srs-progress-bar, srs-due-grid (dashboard), dark mode overrides

**Fitur SRS:**
- Rating 4 tingkat: ❌ Lupa / 😐 Sulit / ✅ Mudah / 🔥 Hafal
- Interval otomatis: 1 → 3 → 7 → 14 → 30 → … hari (sesuai SM-2)
- Preview interval per rating ditampilkan di tombol sebelum user memilih
- Kartu "Lupa" dimasukkan kembali ke antrian sesi yang sama
- Queue prioritas: kartu jatuh tempo dahulu, lalu kartu baru (max 20 baru/sesi)
- Badge BARU / ULANG di pojok kartu
- Progress bar sesi (X/total, persentase)
- Stats bar: due / baru / dikuasai
- Setelah sesi selesai: summary + tombol mulai ulang
- Dashboard: section "🔁 Kartu SRS Hari Ini" muncul otomatis saat user punya data SRS, tampilkan jumlah kartu per modul yang jatuh tempo hari ini
- Rating "Mudah" / "Hafal" otomatis juga menandai item sebagai `Progress.markLearned`
- Dark mode support penuh

**localStorage keys baru:**
```
nh_user_{id}_srs_{moduleId}   — { [itemId]: { interval, repetitions, easeFactor, nextReview, lastRating, lastReview } }
```

**Modul yang mendapat SRS:**
| Modul | ID | Data key |
|-------|----|----------|
| Hiragana | hiragana | item.char |
| Katakana | katakana | item.char |
| Kanji | kanji | item.char |
| Kosakata JP | jp-vocab | item.word |
| Hanzi | hanzi | item.char |
| Kosakata ZH | zh-vocab | item.word |

---

### FASE 10 — Dark Mode [SELESAI]

**Tujuan:** Toggle tema gelap/terang untuk kenyamanan belajar di malam hari.

**Teknologi:** CSS custom properties (`data-theme="dark"` di `<html>`), `localStorage`, `prefers-color-scheme` media query.

**File Diubah:**

- `assets/css/main.css` — Ditambah blok `[data-theme="dark"]` dengan override seluruh variabel (bg, surface, border, text, shadow, red-soft, gold-soft), tombol `.theme-toggle-btn`, dan override komponen spesifik dengan warna hardcoded (HSK badges, tab/filter buttons, char/hanzi/kanji cells, vocab cards, quiz options, grammar cards, auth form, dll)

- `assets/js/core/app.js` — Ditambah fungsi:
  - `loadTheme()` — baca preferensi dari settings user / OS / localStorage, apply ke `<html data-theme>`
  - `toggleTheme()` — toggle dark↔light, simpan ke settings + `nh_last_theme`
  - `_updateThemeToggleBtns()` — sync ikon 🌙/☀️ di semua tombol + toggle settings
  - `init()` diperbarui: panggil `loadTheme()` dan bind `.theme-toggle-btn` click events

- `pages/settings.html` — Toggle "Mode Gelap" baru di section Tampilan (urutan pertama), versi diupdate ke 2.0

- `assets/js/pages/settings.js` — Bind toggle `#toggle-darkmode` ke `App.toggleTheme()`

- **Semua 19 halaman HTML** — Ditambah inline `<script>` anti-FOUC di `<head>` untuk apply tema sebelum CSS/JS dimuat (mencegah kedip putih saat loading di dark mode)

- **16 halaman authenticated** — Ditambah tombol `<button class="theme-toggle-btn">🌙</button>` di topbar desktop dan mobile topbar

**Fitur:**
- Default mengikuti `prefers-color-scheme` OS pengguna
- Preferensi disimpan per-user di settings + global di `nh_last_theme`
- Transisi mulus (menggunakan `--dur` variable yang sudah ada)
- Ikon otomatis berubah: 🌙 (light mode) → ☀️ (dark mode)
- Tersedia 2 cara toggle: tombol di topbar (quick) dan toggle di Settings
- Anti-FOUC: tema diapply sebelum body render untuk menghindari flash putih

---

### FASE 9.2 — Pelengkap Audio Mandarin [SELESAI]

**Latar Belakang:** Fase 9 melewatkan halaman Pinyin dan tidak memasang tombol 🔊 di grid cells Hanzi (hanya di modal). Fase 9.2 melengkapi keduanya.

**File Diupdate:**
- `assets/js/pages/pinyin.js` — Audio lengkap:
  - Tombol 🔊 di setiap grid cell Inisial, Final, dan Kombinasi (muncul on-hover, absolute position)
  - Event delegation per grid agar efisien
  - Tombol 🔊 di modal (karakter utama + contoh kata) via helper `_bindPinyinModalAudio()`
  - Auto-play on open jika setting diaktifkan
  - Teks yang diucapkan: hanzi contoh (misal 八, 爬, 妈) bukan simbol romanisasi
- `assets/js/pages/hanzi.js` — Tombol 🔊 di setiap grid cell karakter Hanzi (muncul on-hover)
- `pages/mandarin/pinyin.html` — Ditambahkan `<script src=".../audio.js"></script>`
- `assets/css/mandarin.css` — CSS positioning untuk `.hanzi-cell .audio-btn` dan `.pinyin-cell .audio-btn` (absolute, opacity 0→1 on hover, ukuran 22px)

**Setelah Fase 9 + 9.2, cakupan audio lengkap:**
| Halaman | Grid Cell | Modal/Detail |
|---------|-----------|--------------|
| Hiragana | — | ✅ (karakter + contoh kata) |
| Katakana | — | ✅ (karakter + contoh kata) |
| Kanji | — | ✅ (kanji + contoh kata) |
| Kosakata JP | ✅ | — |
| Pinyin | ✅ (hover) | ✅ (char + contoh) |
| Nada Mandarin | ✅ (per contoh) | — |
| Hanzi | ✅ (hover) | ✅ (char + contoh kalimat) |
| Kosakata ZH | ✅ | — |

---

### FASE 9 — Audio & Pelafalan [SELESAI]

**Teknologi:** Web Speech API (`SpeechSynthesis`) — built-in browser, gratis, tidak perlu server.

**File Baru:**
- `assets/js/modules/audio.js` — AudioEngine wrapper: `speak()`, `speakJP()`, `speakZH()`, `btnHTML()`, `init()`, `hasJPVoice()`, `hasZHVoice()`, `isSupported()`, `getAutoPlay()`

**Update CSS:**
- `assets/css/components.css` — Tambah `.audio-btn`, `.audio-btn-sm`, `.audio-btn-lg`, `.audio-btn.playing`, animasi `audio-pulse`

**Update Halaman:**
- `assets/js/pages/hiragana.js` — Tombol 🔊 di modal (karakter + contoh kata), auto-play jika aktif
- `assets/js/pages/katakana.js` — Sama seperti hiragana
- `assets/js/pages/kanji.js` — Tombol 🔊 di modal (kanji + contoh kata)
- `assets/js/pages/jp-vocab.js` — Tombol 🔊 di setiap kartu kosakata JP
- `assets/js/pages/hanzi.js` — Tombol 🔊 di modal hanzi (karakter + contoh kalimat), bahasa zh-CN
- `assets/js/pages/zh-vocab.js` — Tombol 🔊 di setiap kartu kosakata ZH
- `assets/js/pages/tones.js` — Tombol 🔊 per kartu contoh nada Mandarin
- `pages/settings.html` — Section "Audio & Pelafalan" baru: toggle auto-play + tombol tes suara JP/ZH
- `assets/js/pages/settings.js` — Bind toggle `audioAutoPlay`, inisialisasi AudioEngine, handler tes suara

**Semua HTML modul:** Ditambahkan `<script src=".../audio.js"></script>` sebelum script halaman.

**Fitur:**
- Tombol 🔊 muncul hanya jika `speechSynthesis` tersedia di browser
- Fallback graceful — tombol disembunyikan jika tidak didukung
- Auto-play on open: opsional, diatur lewat Settings → Audio
- Voice otomatis dipilih yang paling sesuai (`ja-JP` / `zh-CN`)
- Event delegation untuk kartu grid (efisien, tidak perlu re-bind setiap render)
- Tombol tes suara di Settings untuk verifikasi bahwa voice tersedia

---

### FASE 8.4 — Enhance Profil & Perbaikan Ganti Password [SELESAI]

**`pages/profile.html` — Redesign Total:**
- **Profile Hero** baru: header bergradient merah dengan dekorasi karakter besar transparan di background, ring avatar bergradient emas, badge edit kecil
- **Achievement Badges**: chip badge dinamis di hero berdasarkan pencapaian user (streak, dipelajari, quiz, akurasi)
- **Stats Strip**: 4 statistik utama dalam strip horizontal responsif di bawah hero
- **Layout Dua Kolom**: form edit profil di kiri, quick-links + tips belajar di kanan
- **Avatar Grid** diperbarui: hover naik dengan shadow emas, selected scale dengan shadow merah
- **Interaktivitas**: klik avatar di hero → scroll ke avatar grid; update real-time di hero

**`pages/change-password.html` — Centering Form:**
- Form di-center horizontal di area konten (tidak mepet sidebar)
- Icon header bulat (🔒) di atas kartu form untuk estetika
- Tombol Simpan diperluas penuh untuk tampilan lebih baik

---

### FASE 8.3.1 — Hapus Duplikat Kanji [SELESAI]

**Bug yang Ditemukan & Diperbaiki (`assets/js/data/kanji.js`):**
- `聞` — duplikat di N5 (baris 72 & 75) → dihapus yang kedua, pertahankan entry dengan onyomi lengkap `['ブン','モン']`
- `況` — duplikat di N2 (2 entry berurutan) → digabung menjadi 1 entry dengan contoh kata `好況`
- `的` — duplikat di N2 (2 entry berurutan) → dihapus yang kedua, pertahankan entry dengan meaning lengkap
- `悲` — ada di N4 (baris 153) DAN di N2 (baris 261) → dihapus dari N2, tetap di N4 (level yang benar)

**Catatan N5:**
- N5 = 105 kanji (bukan 103 seperti di README sebelumnya) — JLPT tidak pernah merilis daftar resmi, angka berbeda-beda per sumber komunitas. 105 adalah jumlah yang valid dan semua kanji memang level N5.

**Jumlah Kanji Final:**
- N5: 105 | N4: 30 | N3: 20 | N2: 93 | N1: 30 | **Total: 278 kanji**

---

### FASE 8.3 — Kanji N2 & N1 [SELESAI]

**Data Kanji Diperluas:**
- `assets/js/data/kanji.js` — Ditambah ~96 kanji N2 dan 30 kanji N1 yang sering digunakan
- Total kanji sekarang: N5 (103) + N4 (30) + N3 (20) + N2 (~96) + N1 (30) = **~279 kanji**
- Kanji N2 mencakup: verba penting (断・認・許・従・逃), konsep abstrak (状況・程・限・的), masyarakat & pekerjaan (議・法・規則・条件・税), alam & ilmu pengetahuan (温・震・波・森), tubuh & kesehatan (痛・病・薬・治療), perasaan & karakter (怒・悲・喜・恥・恐・緊張), teknologi (機・術・技・通・信・報), tempat & perjalanan, dll.
- Kanji N1 mencakup: kanji yang sering digunakan dalam media/berita (概・慮・促・拡・縮・融・壊・補・援・携・懸・渋滞・循環・顕・謙・憶, dll)

**Halaman Kanji (`pages/japanese/kanji.html`) Update:**
- Tambah progress bar N2 (hijau) dan N1 (ungu) di panel level
- Tambah filter button N2 dan N1 di toolbar
- Deskripsi diupdate: "N5 hingga N1"

**CSS (`assets/css/kanji.css`) Update:**
- `.klp-n2` badge: hijau (#E9F7EF / #1E8449)
- `.klp-n1` badge: ungu (#F5EEF8 / #7D3C98)
- `.klp-fill-n2`: hijau (#27AE60)
- `.klp-fill-n1`: ungu (#8E44AD)

**JS (`assets/js/pages/kanji.js`) Update:**
- Loop progress bar diperluas dari `['N5','N4','N3']` ke `['N5','N4','N3','N2','N1']`

---

### FASE 8.2 — Bug Fix Quiz JP & ZH [SELESAI]

**Bug yang Ditemukan & Diperbaiki:**

**Quiz Jepang (`assets/js/pages/quiz-jp.js`):**
- **Bug Kritis**: Fungsi `bindQuizControls()` dipanggil saat inisialisasi (baris 28) namun tidak pernah didefinisikan → script crash, semua event listener (Mulai Quiz, Soal Berikutnya, Ulangi Quiz, Pilih Modul) tidak terpasang → Quiz JP sama sekali tidak bisa digunakan.
- **Fix**: Membungkus binding event listener `nextBtn`, `retryBtn`, dan `backToSelectBtn` ke dalam fungsi `bindQuizControls()` yang properly terdefinisi.
- **Fix Tambahan**: Closure `buildQuestion` di `retryBtn` diperbaiki menggunakan arrow function `(item, all) => buildQuestion(item, all)` agar context `selectedModule` tetap terbaca dengan benar.

**Quiz Mandarin (`assets/js/pages/quiz-zh.js`):**
- Tidak ditemukan bug kritis — `bindQuizControls()` sudah terdefinisi dan benar.
- Quiz ZH dapat berjalan normal.

---

### FASE 8.1 — Redesign Login & Register [SELESAI]

**auth.css** — Ditulis ulang sepenuhnya:
- Layout dua kolom (left panel dekoratif + right form panel) dengan proporsi lebih baik
- Left panel: stats row baru (1000+ item, 9 modul, 12 badge, 100% offline), feature checklist di register
- Right panel: eyebrow label, heading bertingkat, accent line dengan dot, form alert terpusat
- Field input: height 48px, border-radius lebih besar, focus glow gold, state valid (hijau) / error (merah)
- Password toggle: ikon berganti saat diklik (👁 / 👀)
- Password strength: label + hint text, bar 3 segmen berwarna (merah/kuning/hijau)
- Submit button: gradient overlay, hover lift + shadow, success state (hijau + centang)
- Mobile: logo mark merah + teks, layout single column, padding disesuaikan
- Local notice: kotak info kuning di bawah form

**pages/login.html** — Redesign:
- Back link ke index, eyebrow "Selamat Datang Kembali", heading dua baris
- Live validation blur pada field email
- Alert box terpusat (bukan per-field) untuk error server
- Success state button sebelum redirect

**pages/register.html** — Redesign:
- Karakter はじめよう (ayo mulai) di left panel, feature list 4 poin
- Live validation: email format saat blur, password vs confirm realtime
- Strength indicator dengan hint text
- Semua field valid → border hijau sebelum submit

---

### FASE 8 — Konten Lengkap & Finalisasi [SELESAI]

**Data Baru:**
- `assets/js/data/jp-vocab.js` — 225 kata JP, 15 tema (salam, keluarga, makanan, waktu, tempat, transportasi, belanja, tubuh, sekolah, pekerjaan, alam, warna, angka, kata sifat, kata kerja)
- `assets/js/data/jp-grammar.js` — 35 pola grammar N5–N4 dalam 5 kategori (partikel, pola kalimat, waktu & aspek, menghubungkan, ekspresi)

**Pages Baru:**
- `pages/japanese/vocabulary.html` — Kosakata JP fungsional (filter tema + level, search, tandai hafal)
- `pages/japanese/grammar.html` — Grammar JP fungsional (accordion expand, tandai hafal, kategori + level filter)

**JS Baru:**
- `assets/js/pages/jp-vocab.js` — Grid kosakata JP dengan filter tema/level/search, tandai hafal, integrasi showRomaji
- `assets/js/pages/jp-grammar.js` — Accordion grammar: expand untuk baca penjelasan + contoh kalimat, tandai hafal

**CSS Update:**
- `assets/css/japanese.css` — Tambah styling vocab-grid, vocab-card, theme-tabs, grammar-card, grammar accordion

**Integrasi Settings:**
- `assets/js/pages/hiragana.js` — Membaca `settings.showRomaji` → romaji di grid tersembunyi jika dimatikan
- `assets/js/pages/katakana.js` — Membaca `settings.showRomaji` → sama seperti hiragana
- `assets/js/pages/hanzi.js` — Membaca `settings.showPinyin` → pinyin tersembunyi jika dimatikan

**Fitur Kosakata JP:**
- 225 kata dengan 15 tema lengkap
- Filter tema (15 tema dengan emoji), filter level (N5/N4/N3), search real-time
- Klik kartu untuk tandai hafal (warna golden saat hafal)
- Setiap kartu menampilkan: kanji/kana, reading + romaji, arti, contoh kalimat + terjemahan
- Progress tersimpan di localStorage via `Progress.markLearned('jp-vocab', word)`

**Fitur Grammar JP:**
- 35 pola grammar N5-N4 dalam 5 kategori
- Setiap pola: pattern, arti, penjelasan detail, 2-3 contoh kalimat (JP + romaji + Indonesia), catatan penting
- Klik kartu untuk expand/collapse (accordion)
- Tombol "Tandai Hafal" di dalam kartu yang ter-expand
- Filter kategori + level, search real-time

---

## Cara Menjalankan

1. Buka folder `nihonhan/` di file explorer
2. Double klik `index.html` (atau buka di browser)
3. Tidak perlu server, tidak perlu instalasi
4. Daftar akun baru → langsung bisa digunakan

---

## Struktur Folder

```
nihonhan/
├── index.html                    [SELESAI]
├── 404.html                      [SELESAI]
├── README.md
├── pages/
│   ├── login.html                [SELESAI]
│   ├── register.html             [SELESAI]
│   ├── dashboard.html            [SELESAI]
│   ├── profile.html              [SELESAI]
│   ├── change-password.html      [SELESAI]
│   ├── report.html               [BARU - Fase 19]
│   ├── stats.html                [SELESAI - Fase 7]
│   ├── japanese/
│   │   ├── hiragana.html         [SELESAI - Fase 3]
│   │   ├── katakana.html         [SELESAI - Fase 3]
│   │   ├── kanji.html            [SELESAI - Fase 4]
│   │   ├── vocabulary.html       [SELESAI - Fase 8]
│   │   ├── grammar.html          [SELESAI - Fase 8]
│   │   ├── dialog.html           [BARU - Fase 17]
│   │   └── quiz.html             [SELESAI - Fase 6]
│   └── mandarin/
│       ├── pinyin.html           [SELESAI - Fase 5]
│       ├── tones.html            [SELESAI - Fase 5]
│       ├── hanzi.html            [SELESAI - Fase 5]
│       ├── vocabulary.html       [SELESAI - Fase 5]
│       ├── dialog.html           [BARU - Fase 17]
│       └── quiz.html             [SELESAI - Fase 6]
├── assets/
│   ├── css/
│   │   ├── main.css              [UPDATE - Fase 10 dark mode]
│   │   ├── layout.css            [SELESAI]
│   │   ├── components.css        [SELESAI]
│   │   ├── auth.css              [SELESAI]
│   │   ├── dashboard.css         [SELESAI]
│   │   ├── transitions.css       [UPDATE - Fase 7]
│   │   ├── japanese.css          [UPDATE - Fase 8]
│   │   ├── kanji.css             [SELESAI - Fase 4]
│   │   ├── mandarin.css          [SELESAI - Fase 5]
│   │   ├── quiz.css              [SELESAI - Fase 6]
│   │   ├── settings.css          [SELESAI - Fase 7]
│   │   ├── dialog.css            [BARU - Fase 17]
│   │   └── report.css            [BARU - Fase 19]
│   └── js/
│       ├── core/
│       │   ├── storage.js        [SELESAI]
│       │   ├── auth.js           [SELESAI]
│       │   ├── router.js         [SELESAI]
│       │   └── app.js            [SELESAI]
│       ├── data/
│       │   ├── hiragana.js       [SELESAI - Fase 3]
│       │   ├── katakana.js       [SELESAI - Fase 3]
│       │   ├── kanji.js          [UPDATE - Fase 8.3 N2+N1]
│       │   ├── pinyin.js         [SELESAI - Fase 5]
│       │   ├── zh-tones.js       [SELESAI - Fase 5]
│       │   ├── hanzi.js          [SELESAI - Fase 5]
│       │   ├── zh-vocab.js       [SELESAI - Fase 5]
│       │   ├── jp-vocab.js       [SELESAI - Fase 8]
│       │   ├── jp-grammar.js     [SELESAI - Fase 8]
│       │   ├── jp-dialogs.js     [BARU - Fase 17]
│       │   └── zh-dialogs.js     [BARU - Fase 17]
│       ├── modules/
│       │   ├── flashcard.js      [SELESAI - Fase 3]
│       │   ├── progress.js       [UPDATE - Fase 14 XP integration]
│       │   ├── stroke.js         [SELESAI - Fase 4]
│       │   ├── quiz.js           [SELESAI - Fase 6]
│       │   ├── audio.js          [BARU - Fase 9]
│       │   ├── srs.js            [BARU - Fase 11]
│       │   ├── srs-ui.js         [BARU - Fase 11]
│       │   ├── xp.js             [BARU - Fase 14]
│       │   ├── challenge.js      [BARU - Fase 15]
│       │   └── reminder.js       [BARU - Fase 18]
│       └── pages/
│           ├── dashboard.js      [UPDATE - Fase 15 challenge]
│           ├── stats.js           [UPDATE - Fase 15 challenge history]
│           ├── hiragana.js       [UPDATE - Fase 11 SRS tab]
│           ├── katakana.js       [UPDATE - Fase 11 SRS tab]
│           ├── kanji.js          [UPDATE - Fase 11 SRS tab]
│           ├── pinyin.js         [SELESAI - Fase 5]
│           ├── tones.js          [UPDATE - Fase 9 audio]
│           ├── hanzi.js          [UPDATE - Fase 11 SRS tab]
│           ├── zh-vocab.js       [UPDATE - Fase 11 SRS tab]
│           ├── quiz-jp.js        [BUG FIX - Fase 8.2]
│           ├── quiz-zh.js        [SELESAI - Fase 6]
│           ├── settings.js       [UPDATE - Fase 9 audio]
│           ├── stats.js          [SELESAI - Fase 7]
│           ├── jp-vocab.js       [UPDATE - Fase 11 SRS tab]
│           ├── jp-grammar.js     [SELESAI - Fase 8]
│           ├── jp-dialog.js      [BARU - Fase 17]
│           ├── zh-dialog.js      [BARU - Fase 17]
│           └── report.js         [BARU - Fase 19]
│           └── (settings.js diupdate - Fase 20 PWA section)
│       └── modules/
│           └── pwa.js            [BARU - Fase 20]
└── components/
    └── sidebar.html              [referensi]
```

---

## localStorage Key Reference

```
nh_users               — semua user
nh_session             — session aktif
nh_user_{id}_progress  — progress per modul
nh_user_{id}_streak    — streak harian { count, best }
nh_user_{id}_settings  — { showRomaji, showPinyin, animationEnabled, timerEnabled }
nh_user_{id}_stats     — totalLearned, quizCompleted, totalCorrect, totalQuestions
nh_user_{id}_badges    — badge/achievement (12 badge)
nh_user_{id}_activity  — aktivitas harian (key: tanggal ISO, val: jumlah sesi)
nh_user_{id}_srs_{moduleId} — SRS data per modul
nh_user_{id}_favorites — favorit per modul
nh_user_{id}_xp        — { total: 1250, history: [{action, amount, label, date, totalAfter}] }
nh_user_{id}_challenges — { byDate: { "YYYY-MM-DD": [challenge...] }, history: [{id, title, icon, xp, date}] }
nh_user_{id}_reminder   — { enabled: bool, hour: int, minute: int }
```

---

## Ringkasan Konten Lengkap

| Modul | Jumlah | Level |
|-------|--------|-------|
| Hiragana | 104 karakter | Dasar |
| Katakana | 104 karakter | Dasar |
| Kanji | 278 karakter | N5/N4/N3/N2/N1 |
| Kosakata JP | 225 kata | N5/N4 |
| Grammar JP | 35 pola | N5/N4 |
| Pinyin | 59 elemen | Dasar |
| Nada Mandarin | 5 nada | Dasar |
| Hanzi | 208 karakter | HSK 1/2/3 |
| Kosakata ZH | 120+ kata | HSK 1-3 |
| **Total** | **~1,200+ item** | — |

---

*NihonHan — Belajar itu indah, satu karakter dalam satu waktu.*
