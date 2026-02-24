/**
 * NihonHan - Router
 * Guards pages that require login.
 * Call Router.guard() at top of every protected page.
 * Call Router.guestOnly() on login/register pages.
 */
const Router = (() => {

  // Menghitung prefix path ke root app.
  // Bekerja untuk local file, GitHub Pages subdirectory, dan semua kedalaman folder.
  // Contoh:
  //   /pages/login.html             → '../'
  //   /pages/japanese/hiragana.html → '../../'
  //   /nihonhan_fase13/pages/japanese/hiragana.html → '../../'  (GitHub Pages)
  function getBase() {
    const parts = window.location.pathname.split('/');
    const pagesIdx = parts.indexOf('pages');
    if (pagesIdx === -1) return ''; // Di root (index.html)
    // Hitung kedalaman: pages + subdirektori di dalamnya (tanpa filename)
    const afterPages = parts.slice(pagesIdx + 1).filter(p => p && !p.includes('.'));
    const depth = 1 + afterPages.length;
    return '../'.repeat(depth);
  }

  // Redirect to login if not authenticated
  function guard() {
    if (!Auth.isLoggedIn()) {
      window.location.href = getBase() + 'pages/login.html';
      return false;
    }
    return true;
  }

  // Redirect to dashboard if already logged in
  function guestOnly() {
    if (Auth.isLoggedIn()) {
      window.location.href = getBase() + 'pages/dashboard.html';
      return false;
    }
    return true;
  }

  function go(path) {
    window.location.href = getBase() + path;
  }

  // Highlight active nav item
  function setActiveNav(pageId) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageId);
    });
    document.querySelectorAll('.bottom-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pageId);
    });
  }

  return { guard, guestOnly, go, setActiveNav };
})();

window.Router = Router;
