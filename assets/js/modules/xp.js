/**
 * NihonHan - XP & Level System (Fase 14)
 * Sistem poin pengalaman dan level untuk gamifikasi.
 */
const XPSystem = (() => {

  // ── Level table ───────────────────────────────────────────
  const LEVELS = [
    { level: 1, name: '入門',  nameID: 'Pemula',   xpRequired: 0,     color: '#7f8c8d' },
    { level: 2, name: '初級',  nameID: 'Dasar',    xpRequired: 100,   color: '#27ae60' },
    { level: 3, name: '中級',  nameID: 'Menengah', xpRequired: 300,   color: '#2980b9' },
    { level: 4, name: '上級',  nameID: 'Lanjutan', xpRequired: 700,   color: '#8e44ad' },
    { level: 5, name: '達人',  nameID: 'Mahir',    xpRequired: 1500,  color: '#e67e22' },
    { level: 6, name: '師範',  nameID: 'Ahli',     xpRequired: 3000,  color: '#e74c3c' },
    { level: 7, name: '名人',  nameID: 'Master',   xpRequired: 6000,  color: '#f39c12' },
  ];

  // ── XP per aktivitas ──────────────────────────────────────
  const XP_VALUES = {
    LEARN_ITEM:        5,   // Hafal 1 karakter/kata baru
    QUIZ_COMPLETE:    10,   // Selesai sesi quiz
    QUIZ_PERFECT:     25,   // Quiz akurasi 100% (bonus)
    STREAK_DAY:       15,   // Pertahankan streak 1 hari
    BADGE_UNLOCK:     30,   // Buka badge baru
    SRS_SESSION:       8,   // Selesai sesi SRS
    FIRST_MODULE:     20,   // Pertama kali pakai modul baru
  };

  function getUserId() {
    const s = Auth.getSession();
    return s ? s.userId : null;
  }

  function getData() {
    const uid = getUserId();
    if (!uid) return { total: 0, history: [] };
    return Storage.getUser(uid, 'xp', { total: 0, history: [] });
  }

  function saveData(data) {
    const uid = getUserId();
    if (!uid) return;
    Storage.setUser(uid, 'xp', data);
  }

  // ── Core: tambah XP ──────────────────────────────────────
  function addXP(action, amount, label) {
    const uid = getUserId();
    if (!uid) return null;

    const data = getData();
    const prevTotal = data.total;
    const prevLevel = getLevelFromXP(prevTotal);

    data.total += amount;
    data.history.push({
      action,
      amount,
      label: label || action,
      date: new Date().toISOString(),
      totalAfter: data.total,
    });

    // Trim history jika terlalu panjang (max 200 entri)
    if (data.history.length > 200) {
      data.history = data.history.slice(-200);
    }

    saveData(data);

    const newLevel = getLevelFromXP(data.total);
    const leveledUp = newLevel.level > prevLevel.level;

    return {
      xpGained: amount,
      newTotal: data.total,
      leveledUp,
      newLevel: leveledUp ? newLevel : null,
      prevLevel,
      currentLevel: newLevel,
    };
  }

  // ── XP untuk aktivitas spesifik ───────────────────────────
  function earnLearnItem()    { return addXP('learn_item',    XP_VALUES.LEARN_ITEM,    'Hafal item baru'); }
  function earnQuizComplete() { return addXP('quiz_complete', XP_VALUES.QUIZ_COMPLETE, 'Selesai quiz'); }
  function earnQuizPerfect()  { return addXP('quiz_perfect',  XP_VALUES.QUIZ_PERFECT,  'Quiz sempurna!'); }
  function earnStreakDay()     { return addXP('streak_day',    XP_VALUES.STREAK_DAY,    'Streak harian'); }
  function earnBadge()        { return addXP('badge_unlock',  XP_VALUES.BADGE_UNLOCK,  'Badge baru!'); }
  function earnSrsSession()   { return addXP('srs_session',   XP_VALUES.SRS_SESSION,   'Sesi SRS'); }
  function earnFirstModule(moduleName) {
    return addXP('first_module', XP_VALUES.FIRST_MODULE, 'Modul baru: ' + moduleName);
  }

  // ── Level calculation ─────────────────────────────────────
  function getLevelFromXP(xp) {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
      if (xp >= lvl.xpRequired) current = lvl;
      else break;
    }
    return current;
  }

  function getNextLevel(currentLevelNum) {
    return LEVELS.find(l => l.level === currentLevelNum + 1) || null;
  }

  function getLevelProgress(xp) {
    const current = getLevelFromXP(xp);
    const next = getNextLevel(current.level);
    if (!next) {
      return { current, next: null, pct: 100, xpInLevel: 0, xpNeeded: 0 };
    }
    const xpInLevel = xp - current.xpRequired;
    const xpNeeded  = next.xpRequired - current.xpRequired;
    const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
    return { current, next, pct, xpInLevel, xpNeeded };
  }

  // ── Getters ───────────────────────────────────────────────
  function getTotalXP() {
    return getData().total;
  }

  function getCurrentLevel() {
    return getLevelFromXP(getTotalXP());
  }

  function getHistory() {
    return getData().history;
  }

  function getLevelInfo(xp) {
    return getLevelProgress(xp != null ? xp : getTotalXP());
  }

  function getAllLevels() {
    return LEVELS;
  }

  function getXPValues() {
    return XP_VALUES;
  }

  return {
    addXP,
    earnLearnItem, earnQuizComplete, earnQuizPerfect,
    earnStreakDay, earnBadge, earnSrsSession, earnFirstModule,
    getLevelFromXP, getLevelProgress, getLevelInfo,
    getTotalXP, getCurrentLevel, getHistory,
    getAllLevels, getXPValues,
  };

})();

window.XPSystem = XPSystem;
