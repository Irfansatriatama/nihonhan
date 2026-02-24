/**
 * NihonHan — PWA Module (Fase 20)
 * Handle: install prompt banner, SW registration, update notif
 */

const PWAManager = (() => {
  let deferredPrompt = null;
  let bannerShown = false;

  // ── Register Service Worker ──────────────────────────────────
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;

    // Tentukan path SW relatif terhadap root
    const swPath = _resolveSWPath();

    navigator.serviceWorker.register(swPath, { scope: _resolveScope() })
      .then(reg => {
        console.log('[PWA] SW terdaftar:', reg.scope);
        _watchForUpdates(reg);
      })
      .catch(err => console.warn('[PWA] SW gagal registrasi:', err));
  }

  // Resolve path sw.js dari lokasi halaman saat ini.
  // sw.js selalu berada di folder yang sama dengan /pages/ (app root).
  // Bekerja untuk local file maupun GitHub Pages subdirectory.
  // Contoh:
  //   /pages/dashboard.html             → '../sw.js'
  //   /pages/japanese/hiragana.html     → '../../sw.js'
  //   /repo/pages/japanese/hiragana.html → '../../sw.js'  (GitHub Pages)
  function _resolveSWPath() {
    const parts = location.pathname.split('/');
    const pagesIdx = parts.indexOf('pages');
    if (pagesIdx === -1) return './sw.js'; // Di root (index.html)
    // Hitung: 1 level untuk folder 'pages' + jumlah subdirektori di dalamnya
    const afterPages = parts.slice(pagesIdx + 1).filter(p => p && !p.includes('.'));
    const ups = 1 + afterPages.length;
    return Array(ups).fill('..').join('/') + '/sw.js';
  }

  function _resolveScope() {
    const parts = location.pathname.split('/');
    const pagesIdx = parts.indexOf('pages');
    if (pagesIdx === -1) return './'; // Di root
    const afterPages = parts.slice(pagesIdx + 1).filter(p => p && !p.includes('.'));
    const ups = 1 + afterPages.length;
    return Array(ups).fill('..').join('/') + '/';
  }

  // ── Watch for SW updates ──────────────────────────────────────
  function _watchForUpdates(reg) {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          _showUpdateBanner();
        }
      });
    });
  }

  function _showUpdateBanner() {
    // Cek apakah sudah ada banner
    if (document.getElementById('pwa-update-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: #1a1a22; color: #e8e8f0; border: 1px solid #C0392B;
      border-radius: 12px; padding: 12px 20px; z-index: 99999;
      display: flex; align-items: center; gap: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      font-family: system-ui, sans-serif; font-size: 14px;
      animation: slideUp 0.3s ease;
      max-width: calc(100vw - 40px);
    `;
    banner.innerHTML = `
      <span>🔄 Pembaruan NihonHan tersedia!</span>
      <button id="pwa-update-btn" style="
        background: #C0392B; color: white; border: none; border-radius: 8px;
        padding: 6px 14px; cursor: pointer; font-size: 13px; font-weight: 600;
        white-space: nowrap;
      ">Perbarui</button>
      <button id="pwa-update-close" style="
        background: none; color: #a8a8c0; border: none; cursor: pointer; font-size: 18px; padding: 0 4px;
      ">✕</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-update-btn').addEventListener('click', () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });
    document.getElementById('pwa-update-close').addEventListener('click', () => {
      banner.remove();
    });
  }

  // ── Install Prompt ────────────────────────────────────────────
  function initInstallPrompt() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;

      // Tunggu sedikit agar tidak langsung popup
      setTimeout(() => {
        if (!_wasBannerDismissed()) {
          _showInstallBanner();
        }
      }, 3000);
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.remove();
      _markBannerDismissed();
      console.log('[PWA] NihonHan berhasil diinstall!');
    });
  }

  function _showInstallBanner() {
    if (bannerShown || document.getElementById('pwa-install-banner')) return;
    bannerShown = true;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, #C0392B, #922b21);
      color: white; border-radius: 16px; padding: 16px 20px; z-index: 99999;
      display: flex; align-items: center; gap: 14px;
      box-shadow: 0 8px 30px rgba(192,57,43,0.4);
      font-family: system-ui, sans-serif; font-size: 14px;
      max-width: calc(100vw - 40px); min-width: 280px;
      animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
    `;
    banner.innerHTML = `
      <div style="font-size:36px;flex-shrink:0">📲</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:15px;margin-bottom:3px">Pasang NihonHan!</div>
        <div style="font-size:12px;opacity:0.9">Install di HP/komputer untuk akses offline kapan saja</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
        <button id="pwa-install-btn" style="
          background: white; color: #C0392B; border: none; border-radius: 8px;
          padding: 7px 16px; cursor: pointer; font-size: 13px; font-weight: 700;
        ">Install</button>
        <button id="pwa-install-close" style="
          background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 8px;
          padding: 4px 8px; cursor: pointer; font-size: 11px;
        ">Nanti</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Install outcome:', outcome);
      deferredPrompt = null;
      banner.remove();
      _markBannerDismissed();
    });

    document.getElementById('pwa-install-close').addEventListener('click', () => {
      banner.remove();
      _markBannerDismissed();
    });

    // Auto-hide setelah 12 detik
    setTimeout(() => {
      if (document.getElementById('pwa-install-banner')) {
        banner.style.opacity = '0';
        banner.style.transition = 'opacity 0.5s';
        setTimeout(() => banner.remove(), 500);
      }
    }, 12000);
  }

  // Tandai banner sudah ditutup — jangan tampil lagi hari ini
  function _markBannerDismissed() {
    try {
      localStorage.setItem('nh_pwa_banner_dismissed', new Date().toISOString().split('T')[0]);
    } catch(e) {}
  }

  function _wasBannerDismissed() {
    try {
      const d = localStorage.getItem('nh_pwa_banner_dismissed');
      if (!d) return false;
      return d === new Date().toISOString().split('T')[0];
    } catch(e) { return false; }
  }

  // ── isInstalled helper ────────────────────────────────────────
  function isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
  }

  // ── isOnline helper ──────────────────────────────────────────
  function isOnline() {
    return navigator.onLine;
  }

  // ── Offline/Online indicator ──────────────────────────────────
  function initOfflineIndicator() {
    function updateIndicator() {
      let ind = document.getElementById('pwa-offline-ind');
      if (navigator.onLine) {
        if (ind) ind.remove();
      } else {
        if (ind) return;
        ind = document.createElement('div');
        ind.id = 'pwa-offline-ind';
        ind.style.cssText = `
          position: fixed; top: 0; left: 0; right: 0;
          background: #555; color: white; text-align: center;
          padding: 6px; font-size: 13px; z-index: 99998;
          font-family: system-ui, sans-serif;
        `;
        ind.textContent = '📵 Kamu sedang offline — NihonHan tetap bisa digunakan!';
        document.body.insertBefore(ind, document.body.firstChild);
      }
    }
    window.addEventListener('online', updateIndicator);
    window.addEventListener('offline', updateIndicator);
    updateIndicator();
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    // Inject keyframe animation jika belum ada
    if (!document.getElementById('pwa-styles')) {
      const style = document.createElement('style');
      style.id = 'pwa-styles';
      style.textContent = `
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    registerSW();
    initInstallPrompt();
    initOfflineIndicator();
  }

  return { init, isInstalled, isOnline, registerSW };
})();
