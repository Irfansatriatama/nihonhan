/**
 * NihonHan Service Worker — Fase 20 (PWA)
 * Strategi: Cache-First untuk semua aset statik
 * Data pengguna tetap di localStorage (tidak diurus SW)
 */

const CACHE_NAME = 'nihonhan-v2';
const CACHE_VERSION = 2;

// Semua aset yang perlu di-cache untuk offline
const ASSETS_TO_CACHE = [
  // Root
  './',
  './index.html',
  './404.html',
  './manifest.json',

  // CSS
  './assets/css/main.css',
  './assets/css/layout.css',
  './assets/css/components.css',
  './assets/css/auth.css',
  './assets/css/dashboard.css',
  './assets/css/transitions.css',
  './assets/css/japanese.css',
  './assets/css/kanji.css',
  './assets/css/mandarin.css',
  './assets/css/quiz.css',
  './assets/css/settings.css',
  './assets/css/dialog.css',
  './assets/css/report.css',

  // Core JS
  './assets/js/core/storage.js',
  './assets/js/core/auth.js',
  './assets/js/core/router.js',
  './assets/js/core/app.js',

  // Module JS
  './assets/js/modules/flashcard.js',
  './assets/js/modules/progress.js',
  './assets/js/modules/stroke.js',
  './assets/js/modules/quiz.js',
  './assets/js/modules/audio.js',
  './assets/js/modules/srs.js',
  './assets/js/modules/srs-ui.js',
  './assets/js/modules/xp.js',
  './assets/js/modules/challenge.js',
  './assets/js/modules/reminder.js',

  // Data JS
  './assets/js/data/hiragana.js',
  './assets/js/data/katakana.js',
  './assets/js/data/kanji.js',
  './assets/js/data/pinyin.js',
  './assets/js/data/zh-tones.js',
  './assets/js/data/hanzi.js',
  './assets/js/data/zh-vocab.js',
  './assets/js/data/jp-vocab.js',
  './assets/js/data/jp-grammar.js',
  './assets/js/data/jp-dialogs.js',
  './assets/js/data/zh-dialogs.js',

  // Page JS
  './assets/js/pages/dashboard.js',
  './assets/js/pages/hiragana.js',
  './assets/js/pages/katakana.js',
  './assets/js/pages/kanji.js',
  './assets/js/pages/jp-vocab.js',
  './assets/js/pages/jp-grammar.js',
  './assets/js/pages/jp-dialog.js',
  './assets/js/pages/zh-dialog.js',
  './assets/js/pages/pinyin.js',
  './assets/js/pages/tones.js',
  './assets/js/pages/hanzi.js',
  './assets/js/pages/zh-vocab.js',
  './assets/js/pages/quiz-jp.js',
  './assets/js/pages/quiz-zh.js',
  './assets/js/pages/settings.js',
  './assets/js/pages/stats.js',
  './assets/js/pages/report.js',

  // Pages
  './pages/login.html',
  './pages/register.html',
  './pages/dashboard.html',
  './pages/profile.html',
  './pages/change-password.html',
  './pages/settings.html',
  './pages/stats.html',
  './pages/report.html',
  './pages/japanese/hiragana.html',
  './pages/japanese/katakana.html',
  './pages/japanese/kanji.html',
  './pages/japanese/vocabulary.html',
  './pages/japanese/grammar.html',
  './pages/japanese/dialog.html',
  './pages/japanese/quiz.html',
  './pages/mandarin/pinyin.html',
  './pages/mandarin/tones.html',
  './pages/mandarin/hanzi.html',
  './pages/mandarin/vocabulary.html',
  './pages/mandarin/dialog.html',
  './pages/mandarin/quiz.html',

  // Icons
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

// ============================================================
// INSTALL — cache semua aset
// ============================================================
self.addEventListener('install', event => {
  console.log('[SW] Install — NihonHan v' + CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching semua aset...');
      // Cache satu-satu agar satu kegagalan tidak block semua
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Gagal cache:', url, err.message);
          })
        )
      );
    }).then(() => {
      console.log('[SW] Install selesai');
      // Paksa activate tanpa menunggu tab lama ditutup
      return self.skipWaiting();
    })
  );
});

// ============================================================
// ACTIVATE — hapus cache lama
// ============================================================
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Hapus cache lama:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      console.log('[SW] Aktif — mengambil kendali semua client');
      return self.clients.claim();
    })
  );
});

// ============================================================
// FETCH — Cache-First Strategy
// Untuk request navigasi (HTML), pakai Network-First agar
// update selalu terambil jika online.
// ============================================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Hanya handle request dari origin yang sama
  if (url.origin !== location.origin) return;

  // Strategi berbeda untuk HTML (navigasi) vs aset statik
  if (request.mode === 'navigate') {
    // Network-First untuk halaman HTML
    event.respondWith(networkFirstThenCache(request));
  } else {
    // Cache-First untuk CSS, JS, gambar, dll
    event.respondWith(cacheFirstThenNetwork(request));
  }
});

/**
 * Cache-First: cek cache dulu, baru fetch jika tidak ada
 */
async function cacheFirstThenNetwork(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Offline dan tidak ada di cache — return offline page jika ada
    return new Response('Konten tidak tersedia offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

/**
 * Network-First: coba fetch dulu, fallback ke cache jika gagal
 */
async function networkFirstThenCache(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Offline — coba dari cache
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback ke index.html sebagai SPA shell
    const indexCached = await caches.match('./index.html');
    if (indexCached) return indexCached;

    return new Response('Aplikasi tidak tersedia offline saat ini.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ============================================================
// MESSAGE — handle pesan dari halaman
// ============================================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      cacheName: CACHE_NAME
    });
  }
});
