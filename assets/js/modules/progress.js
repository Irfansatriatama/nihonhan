/**
 * NihonHan - Progress Module
 * Simpan dan ambil progress belajar per modul dari localStorage.
 */
const Progress = (() => {

  function getUserId() {
    const s = Auth.getSession();
    return s ? s.userId : null;
  }

  function getAll() {
    const uid = getUserId();
    if (!uid) return {};
    return Storage.getUser(uid, 'progress', {});
  }

  function getModule(moduleId) {
    const all = getAll();
    return all[moduleId] || { learned: [], quiz_scores: [] };
  }

  // Tandai satu karakter/kata sebagai dipelajari
  function markLearned(moduleId, charId) {
    const uid = getUserId();
    if (!uid) return;
    const all = getAll();
    if (!all[moduleId]) all[moduleId] = { learned: [], quiz_scores: [] };
    if (!all[moduleId].learned.includes(charId)) {
      all[moduleId].learned.push(charId);
      Storage.setUser(uid, 'progress', all);
      _updateTotalLearned(uid);
      _markActivity(uid);
      // XP (Fase 14)
      if (typeof XPSystem !== 'undefined') {
        const result = XPSystem.earnLearnItem();
        if (typeof App !== 'undefined') App.toastXP(result);
      }
      // Challenge (Fase 15)
      if (typeof ChallengeSystem !== 'undefined') {
        ChallengeSystem.onLearnItem(moduleId);
        ChallengeSystem.onModuleVisit(moduleId);
      }
    }
  }

  // Hapus tanda dari karakter
  function unmarkLearned(moduleId, charId) {
    const uid = getUserId();
    if (!uid) return;
    const all = getAll();
    if (!all[moduleId]) return;
    all[moduleId].learned = all[moduleId].learned.filter(c => c !== charId);
    Storage.setUser(uid, 'progress', all);
    _updateTotalLearned(uid);
  }

  function isLearned(moduleId, charId) {
    return getModule(moduleId).learned.includes(charId);
  }

  function getLearned(moduleId) {
    return getModule(moduleId).learned;
  }

  // Simpan hasil quiz
  function saveQuizScore(moduleId, { score, total }) {
    const uid = getUserId();
    if (!uid) return;
    const all = getAll();
    if (!all[moduleId]) all[moduleId] = { learned: [], quiz_scores: [] };
    all[moduleId].quiz_scores.push({
      score, total,
      date: new Date().toISOString().split('T')[0],
    });
    Storage.setUser(uid, 'progress', all);
    _updateQuizStats(uid, score, total);
    _markActivity(uid);
    // XP (Fase 14)
    if (typeof XPSystem !== 'undefined') {
      const r1 = XPSystem.earnQuizComplete();
      if (typeof App !== 'undefined') App.toastXP(r1);
      if (total > 0 && score === total) {
        setTimeout(() => {
          const r2 = XPSystem.earnQuizPerfect();
          if (typeof App !== 'undefined') App.toastXP(r2);
        }, 800);
      }
    }
    // Challenge (Fase 15)
    if (typeof ChallengeSystem !== 'undefined') {
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      ChallengeSystem.onQuizComplete();
      ChallengeSystem.onQuizAccuracy(accuracy);
      ChallengeSystem.onModuleVisit(moduleId);
    }
  }

  // Reset progress satu modul
  function resetModule(moduleId) {
    const uid = getUserId();
    if (!uid) return;
    const all = getAll();
    all[moduleId] = { learned: [], quiz_scores: [] };
    Storage.setUser(uid, 'progress', all);
    _updateTotalLearned(uid);
  }

  // ── Internal ─────────────────────────────────────────────

  function _updateTotalLearned(uid) {
    const all   = Storage.getUser(uid, 'progress', {});
    let total   = 0;
    Object.values(all).forEach(m => { if (m.learned) total += m.learned.length; });
    Storage.mergeUser(uid, 'stats', { totalLearned: total });
  }

  function _updateQuizStats(uid, score, total) {
    const stats = Storage.getUser(uid, 'stats', {
      totalLearned:0, quizCompleted:0, totalCorrect:0, totalQuestions:0
    });
    stats.quizCompleted  += 1;
    stats.totalCorrect   += score;
    stats.totalQuestions += total;
    Storage.setUser(uid, 'stats', stats);
  }

  function _markActivity(uid) {
    const today    = new Date().toISOString().split('T')[0];
    const activity = Storage.getUser(uid, 'activity', {});
    activity[today] = (activity[today] || 0) + 1;
    Storage.setUser(uid, 'activity', activity);
  }

  // ── Favorites ─────────────────────────────────────────────

  function getFavoritesAll() {
    const uid = getUserId();
    if (!uid) return {};
    return Storage.getUser(uid, 'favorites', {});
  }

  function markFavorite(moduleId, itemId) {
    const uid = getUserId();
    if (!uid) return;
    const favs = getFavoritesAll();
    if (!favs[moduleId]) favs[moduleId] = [];
    if (!favs[moduleId].includes(itemId)) {
      favs[moduleId].push(itemId);
      Storage.setUser(uid, 'favorites', favs);
    }
  }

  function unmarkFavorite(moduleId, itemId) {
    const uid = getUserId();
    if (!uid) return;
    const favs = getFavoritesAll();
    if (!favs[moduleId]) return;
    favs[moduleId] = favs[moduleId].filter(id => id !== itemId);
    Storage.setUser(uid, 'favorites', favs);
  }

  function isFavorite(moduleId, itemId) {
    const favs = getFavoritesAll();
    return !!(favs[moduleId] && favs[moduleId].includes(itemId));
  }

  function getFavorites(moduleId) {
    const favs = getFavoritesAll();
    return favs[moduleId] || [];
  }

  function toggleFavorite(moduleId, itemId) {
    if (isFavorite(moduleId, itemId)) {
      unmarkFavorite(moduleId, itemId);
      return false;
    } else {
      markFavorite(moduleId, itemId);
      return true;
    }
  }

  return {
    getAll, getModule,
    markLearned, unmarkLearned, isLearned, getLearned,
    saveQuizScore, resetModule,
    // Favorit
    markFavorite, unmarkFavorite, isFavorite, getFavorites, getFavoritesAll, toggleFavorite,
  };
})();

window.Progress = Progress;
