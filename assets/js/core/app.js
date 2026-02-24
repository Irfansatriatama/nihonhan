/**
 * NihonHan - App Core
 * Toast notifications, shared UI, global init helpers.
 */
const App = (() => {

  // ── Toast ────────────────────────────────────────────────

  function toast(message, type = 'default', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    container.appendChild(el);

    setTimeout(() => {
      el.classList.add('hide');
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  // ── Sidebar / Drawer (Mobile) ─────────────────────────────

  function initSidebar() {
    const hamburger = document.getElementById('hamburger');
    const overlay   = document.getElementById('drawer-overlay');
    const sidebar   = document.getElementById('sidebar');
    if (!hamburger || !overlay || !sidebar) return;

    hamburger.addEventListener('click', () => {
      sidebar.classList.add('drawer-open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    overlay.addEventListener('click', closeSidebar);

    function closeSidebar() {
      sidebar.classList.remove('drawer-open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Close on nav item click (mobile)
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });
  }

  // ── Render sidebar user info ─────────────────────────────

  function renderUserInfo() {
    const user = Auth.getActiveUser();
    if (!user) return;

    document.querySelectorAll('[data-user-name]').forEach(el => {
      el.textContent = user.name;
    });
    document.querySelectorAll('[data-user-email]').forEach(el => {
      // Show XP level if XPSystem available, else show email
      if (typeof XPSystem !== 'undefined') {
        const lvl = XPSystem.getCurrentLevel();
        el.textContent = 'Lv.' + lvl.level + ' ' + lvl.name + ' ' + lvl.nameID;
      } else {
        el.textContent = user.email;
      }
    });
    document.querySelectorAll('[data-user-avatar]').forEach(el => {
      el.textContent = user.avatar || '日';
    });
  }

  // ── Theme (Dark Mode) — Fase 10 ────────────────────────────

  function loadTheme() {
    const user = Auth.getActiveUser();
    let theme;
    if (user) {
      const s = Storage.getUser(user.id, 'settings', {});
      theme = s.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      // Halaman login/register: ikuti OS atau last preference
      try {
        const raw = localStorage.getItem('nh_last_theme');
        theme = raw || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      } catch(e) {
        theme = 'light';
      }
    }
    document.documentElement.setAttribute('data-theme', theme);
    _updateThemeToggleBtns(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    _updateThemeToggleBtns(next);
    // Simpan ke settings user
    const user = Auth.getActiveUser();
    if (user) {
      const s = Storage.getUser(user.id, 'settings', {});
      s.theme = next;
      Storage.setUser(user.id, 'settings', s);
    }
    try { localStorage.setItem('nh_last_theme', next); } catch(e) {}
  }

  function _updateThemeToggleBtns(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap';
    });
    const settingsToggle = document.getElementById('toggle-darkmode');
    if (settingsToggle) settingsToggle.checked = (theme === 'dark');
  }

  // ── Init shared elements ─────────────────────────────────

  function init(pageId) {
    loadTheme();
    initSidebar();
    renderUserInfo();
    if (pageId) Router.setActiveNav(pageId);

    // Theme toggle buttons in topbar
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Logout buttons
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', () => Auth.logout());
    });
  }

  // ── Password strength checker ────────────────────────────

  function checkPasswordStrength(password) {
    if (password.length < 6) return { score: 0, label: 'Terlalu pendek' };
    let score = 0;
    if (password.length >= 8)   score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Lemah',  cls: 'weak'   };
    if (score <= 2) return { score: 2, label: 'Sedang', cls: 'medium' };
    return             { score: 3, label: 'Kuat',   cls: 'strong' };
  }

  // ── Form validation helpers ──────────────────────────────

  function showError(inputEl, errorEl, msg) {
    inputEl.classList.add('error');
    if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('show'); }
  }

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove('error');
    if (errorEl) { errorEl.classList.remove('show'); }
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
    const alert = form.querySelector('.alert');
    if (alert) alert.style.display = 'none';
  }

  function showFormAlert(form, msg, type = 'alert-error') {
    let alert = form.querySelector('.form-alert');
    if (!alert) {
      alert = document.createElement('div');
      alert.className = 'alert form-alert ' + type;
      form.prepend(alert);
    }
    alert.className = 'alert form-alert ' + type;
    alert.textContent = msg;
    alert.style.display = 'flex';
  }

  // ── XP Toast (Fase 14) ───────────────────────────────────

  function toastXP(result) {
    if (!result) return;
    // Toast XP gain
    toast(`+${result.xpGained} XP`, 'xp');
    // Toast level up
    if (result.leveledUp && result.newLevel) {
      setTimeout(() => {
        toast(`🎉 Level Naik! ${result.newLevel.name} ${result.newLevel.nameID}`, 'levelup', 4000);
      }, 600);
    }
  }

  return {
    toast, toastXP, init,
    loadTheme, toggleTheme,
    checkPasswordStrength,
    showError, clearError, clearAllErrors, showFormAlert,
    renderUserInfo,
  };
})();

window.App = App;
