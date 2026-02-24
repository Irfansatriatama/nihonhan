/**
 * NihonHan - Auth Module
 * Handles register, login, logout, session, and password change.
 * All data stored in localStorage — no backend required.
 */
const Auth = (() => {

  // ── Helpers ──────────────────────────────────────────────

  function hashPassword(pass) {
    // Simple deterministic hash for client-side only (not cryptographic)
    let h = 0;
    for (let i = 0; i < pass.length; i++) {
      h = Math.imul(31, h) + pass.charCodeAt(i) | 0;
    }
    return 'h_' + Math.abs(h).toString(36) + '_' + pass.length;
  }

  function getAllUsers() {
    return Storage.get('users', []);
  }

  function saveUsers(users) {
    Storage.set('users', users);
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ── Register ─────────────────────────────────────────────

  function register({ name, email, password }) {
    const users = getAllUsers();

    if (!name || !email || !password) {
      return { ok: false, error: 'Semua kolom wajib diisi.' };
    }

    const emailLower = email.trim().toLowerCase();
    const nameTrim   = name.trim();

    if (nameTrim.length < 2) {
      return { ok: false, error: 'Nama minimal 2 karakter.' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      return { ok: false, error: 'Format email tidak valid.' };
    }

    if (password.length < 6) {
      return { ok: false, error: 'Password minimal 6 karakter.' };
    }

    if (users.find(u => u.email === emailLower)) {
      return { ok: false, error: 'Email sudah terdaftar.' };
    }

    const user = {
      id:        generateId(),
      name:      nameTrim,
      email:     emailLower,
      password:  hashPassword(password),
      avatar:    '日',
      createdAt: Date.now(),
    };

    users.push(user);
    saveUsers(users);

    // Init progress & settings for new user
    Storage.setUser(user.id, 'progress', {});
    Storage.setUser(user.id, 'streak', { lastDate: null, count: 0 });
    Storage.setUser(user.id, 'settings', { showRomaji: true });
    Storage.setUser(user.id, 'stats', {
      totalLearned: 0, quizCompleted: 0, totalCorrect: 0, totalQuestions: 0
    });

    return { ok: true, user: sanitize(user) };
  }

  // ── Login ────────────────────────────────────────────────

  function login({ email, password }) {
    if (!email || !password) {
      return { ok: false, error: 'Email dan password wajib diisi.' };
    }

    const users = getAllUsers();
    const user  = users.find(u => u.email === email.trim().toLowerCase());

    if (!user) {
      return { ok: false, error: 'Email tidak ditemukan.' };
    }

    if (user.password !== hashPassword(password)) {
      return { ok: false, error: 'Password salah.' };
    }

    const session = { userId: user.id, loginAt: Date.now() };
    Storage.set('session', session);
    updateStreak(user.id);

    return { ok: true, user: sanitize(user) };
  }

  // ── Logout ───────────────────────────────────────────────

  function logout() {
    Storage.remove('session');
    window.location.href = getBase() + 'pages/login.html';
  }

  // ── Session ──────────────────────────────────────────────

  function getSession() {
    return Storage.get('session', null);
  }

  function getActiveUser() {
    const session = getSession();
    if (!session) return null;
    const users = getAllUsers();
    const user  = users.find(u => u.id === session.userId);
    return user ? sanitize(user) : null;
  }

  function isLoggedIn() {
    return !!getSession();
  }

  // ── Change Password ──────────────────────────────────────

  function changePassword(userId, { oldPassword, newPassword }) {
    if (!oldPassword || !newPassword) {
      return { ok: false, error: 'Semua kolom wajib diisi.' };
    }
    if (newPassword.length < 6) {
      return { ok: false, error: 'Password baru minimal 6 karakter.' };
    }

    const users = getAllUsers();
    const idx   = users.findIndex(u => u.id === userId);

    if (idx === -1) return { ok: false, error: 'User tidak ditemukan.' };

    if (users[idx].password !== hashPassword(oldPassword)) {
      return { ok: false, error: 'Password lama salah.' };
    }

    users[idx].password = hashPassword(newPassword);
    saveUsers(users);
    return { ok: true };
  }

  // ── Update Profile ───────────────────────────────────────

  function updateProfile(userId, { name, avatar }) {
    const users = getAllUsers();
    const idx   = users.findIndex(u => u.id === userId);
    if (idx === -1) return { ok: false, error: 'User tidak ditemukan.' };

    if (name) {
      const n = name.trim();
      if (n.length < 2) return { ok: false, error: 'Nama minimal 2 karakter.' };
      users[idx].name = n;
    }
    if (avatar) users[idx].avatar = avatar;

    saveUsers(users);
    return { ok: true, user: sanitize(users[idx]) };
  }

  // ── Streak ───────────────────────────────────────────────

  function updateStreak(userId) {
    const streak  = Storage.getUser(userId, 'streak', { lastDate: null, count: 0 });
    const today   = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (streak.lastDate === today) return;

    if (streak.lastDate === yesterday) {
      streak.count += 1;
    } else {
      streak.count = 1;
    }
    streak.lastDate = today;
    Storage.setUser(userId, 'streak', streak);
    // XP (Fase 14) — award for maintaining streak
    if (typeof XPSystem !== 'undefined') {
      const result = XPSystem.earnStreakDay();
      if (typeof App !== 'undefined') App.toastXP(result);
    }
  }

  // ── Internal ─────────────────────────────────────────────

  function sanitize(user) {
    const { password, ...safe } = user;
    return safe;
  }

  // Menghitung prefix path ke root app.
  // Bekerja untuk local file, GitHub Pages subdirectory, dan semua kedalaman folder.
  function getBase() {
    const parts = window.location.pathname.split('/');
    const pagesIdx = parts.indexOf('pages');
    if (pagesIdx === -1) return ''; // Di root (index.html)
    const afterPages = parts.slice(pagesIdx + 1).filter(p => p && !p.includes('.'));
    const depth = 1 + afterPages.length;
    return '../'.repeat(depth);
  }

  return {
    register, login, logout,
    getSession, getActiveUser, isLoggedIn,
    changePassword, updateProfile,
    updateStreak,
  };
})();

window.Auth = Auth;
