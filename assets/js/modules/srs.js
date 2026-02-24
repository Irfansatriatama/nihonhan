/**
 * NihonHan - SRS (Spaced Repetition System) Module
 * Algoritma SM-2 (SuperMemo 2) untuk pengulangan cerdas.
 *
 * Rating dari pengguna:
 *   0 = ❌ Lupa      — interval reset ke 1 hari
 *   1 = 😐 Sulit     — interval sedikit naik, easeFactor turun
 *   2 = ✅ Mudah     — interval naik normal
 *   3 = 🔥 Hafal     — interval naik cepat
 *
 * Storage key: nh_user_{id}_srs_{moduleId}
 *   { [itemId]: { interval, repetitions, easeFactor, nextReview } }
 */
const SRS = (() => {

  // ── Helpers ──────────────────────────────────────────────

  function getUserId() {
    const s = Auth.getSession();
    return s ? s.userId : null;
  }

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  // ── SM-2 Core ─────────────────────────────────────────────

  /**
   * Hitung interval berikutnya berdasarkan rating SM-2.
   * @param {Object} card - { interval, repetitions, easeFactor }
   * @param {number} rating - 0..3
   * @returns {Object} updated card fields + nextReview string (YYYY-MM-DD)
   */
  function calculateNext(card, rating) {
    let { interval = 1, repetitions = 0, easeFactor = 2.5 } = card;

    if (rating < 1) {
      // Lupa: reset
      interval = 1;
      repetitions = 0;
    } else {
      // Ingat dengan berbagai tingkat kemudahan
      if (repetitions === 0)      interval = 1;
      else if (repetitions === 1) interval = 3;
      else                        interval = Math.round(interval * easeFactor);

      repetitions += 1;

      // Update easeFactor (tetap minimum 1.3)
      easeFactor = Math.max(
        1.3,
        easeFactor + 0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02)
      );
    }

    // Cap interval di 365 hari
    interval = Math.min(interval, 365);

    const d = new Date();
    d.setDate(d.getDate() + interval);
    const nextReview = d.toISOString().split('T')[0];

    return { interval, repetitions, easeFactor, nextReview };
  }

  // ── Storage ───────────────────────────────────────────────

  function _srsKey(moduleId) {
    return 'srs_' + moduleId;
  }

  function getAllCards(moduleId) {
    const uid = getUserId();
    if (!uid) return {};
    return Storage.getUser(uid, _srsKey(moduleId), {});
  }

  function saveAllCards(moduleId, data) {
    const uid = getUserId();
    if (!uid) return;
    Storage.setUser(uid, _srsKey(moduleId), data);
  }

  function getCard(moduleId, itemId) {
    const all = getAllCards(moduleId);
    return all[itemId] || null;
  }

  /**
   * Perbarui card setelah pengguna memberi rating.
   */
  function rate(moduleId, itemId, rating) {
    const uid = getUserId();
    if (!uid) return;

    const all  = getAllCards(moduleId);
    const card = all[itemId] || { interval: 1, repetitions: 0, easeFactor: 2.5 };
    const next = calculateNext(card, rating);

    all[itemId] = {
      ...card,
      ...next,
      lastRating: rating,
      lastReview: today(),
    };

    saveAllCards(moduleId, all);

    // Jika dinilai "hafal" atau "mudah", juga tandai sebagai learned
    if (rating >= 2) {
      Progress.markLearned(moduleId, itemId);
    }

    return all[itemId];
  }

  // ── Query ─────────────────────────────────────────────────

  /**
   * Ambil ID item yang jatuh tempo hari ini atau sebelumnya.
   */
  function getDueIds(moduleId) {
    const all = getAllCards(moduleId);
    const t   = today();
    return Object.entries(all)
      .filter(([, card]) => !card.nextReview || card.nextReview <= t)
      .map(([id]) => id);
  }

  /**
   * Ambil jumlah kartu due per modul (semua modul sekaligus).
   */
  function getDueCountPerModule(moduleIds) {
    const result = {};
    moduleIds.forEach(id => {
      result[id] = getDueIds(id).length;
    });
    return result;
  }

  /**
   * Total kartu due hari ini lintas semua modul.
   */
  function getTotalDue(moduleIds) {
    return moduleIds.reduce((sum, id) => sum + getDueIds(id).length, 0);
  }

  /**
   * Apakah item ini baru (belum pernah di-review SRS)?
   */
  function isNew(moduleId, itemId) {
    return !getCard(moduleId, itemId);
  }

  /**
   * Ambil semua kartu untuk modul beserta statusnya.
   * Berguna untuk menampilkan SRS tab.
   */
  function getModuleStats(moduleId) {
    const all = getAllCards(moduleId);
    const t   = today();
    let due = 0, learning = 0, mastered = 0, newCount = 0;

    // "new" dihitung dari itemIds yang diberikan
    Object.entries(all).forEach(([, card]) => {
      if (card.repetitions >= 5 && card.easeFactor >= 2.0) {
        mastered++;
      } else if (!card.nextReview || card.nextReview <= t) {
        due++;
      } else {
        learning++;
      }
    });

    return { due, learning, mastered };
  }

  /**
   * Reset SRS data untuk satu modul.
   */
  function resetModule(moduleId) {
    const uid = getUserId();
    if (!uid) return;
    Storage.setUser(uid, _srsKey(moduleId), {});
  }

  // ── Label helpers ─────────────────────────────────────────

  function ratingLabel(r) {
    return ['❌ Lupa', '😐 Sulit', '✅ Mudah', '🔥 Hafal'][r] || '';
  }

  function intervalLabel(days) {
    if (days <= 1)  return 'Besok';
    if (days < 7)   return days + ' hari lagi';
    if (days < 30)  return Math.round(days / 7) + ' minggu lagi';
    return Math.round(days / 30) + ' bulan lagi';
  }

  // ── Public API ────────────────────────────────────────────

  return {
    calculateNext,
    rate,
    getCard,
    getAllCards,
    getDueIds,
    getDueCountPerModule,
    getTotalDue,
    isNew,
    getModuleStats,
    resetModule,
    ratingLabel,
    intervalLabel,
    today,
  };

})();

window.SRS = SRS;
