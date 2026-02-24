/**
 * NihonHan - Daily Challenge System (Fase 15)
 * Challenge harian di-generate otomatis berdasarkan tanggal (seed).
 * Setiap hari ada 3 challenge dengan target dan reward XP.
 */
const ChallengeSystem = (() => {

  // ── Daftar template challenge ─────────────────────────────
  // type: 'learn_items', 'quiz_accuracy', 'srs_review', 'multi_module', 'quiz_complete', 'streak'
  const TEMPLATES = [
    // learn items
    { type: 'learn_items', module: 'any',      target: 5,  icon: '📖', title: 'Pelajar Aktif',    desc: 'Hafal 5 item baru hari ini (modul apa saja)',         xp: 40 },
    { type: 'learn_items', module: 'any',      target: 10, icon: '📚', title: 'Rajin Belajar',    desc: 'Hafal 10 item baru hari ini',                         xp: 70 },
    { type: 'learn_items', module: 'hiragana', target: 5,  icon: 'あ', title: 'Kuasai Hiragana',  desc: 'Hafal 5 karakter Hiragana baru',                      xp: 35 },
    { type: 'learn_items', module: 'katakana', target: 5,  icon: 'ア', title: 'Kuasai Katakana',  desc: 'Hafal 5 karakter Katakana baru',                      xp: 35 },
    { type: 'learn_items', module: 'kanji',    target: 3,  icon: '漢', title: 'Pemburu Kanji',    desc: 'Hafal 3 kanji baru hari ini',                         xp: 40 },
    { type: 'learn_items', module: 'jp-vocab', target: 5,  icon: '語', title: 'Kosakata JP',      desc: 'Hafal 5 kata kosakata Jepang baru',                   xp: 50 },
    { type: 'learn_items', module: 'hanzi',    target: 3,  icon: '汉', title: 'Pemburu Hanzi',    desc: 'Hafal 3 hanzi baru hari ini',                         xp: 40 },
    { type: 'learn_items', module: 'zh-vocab', target: 5,  icon: '词', title: 'Kosakata ZH',      desc: 'Hafal 5 kata kosakata Mandarin baru',                 xp: 50 },
    // quiz
    { type: 'quiz_complete', count: 1,         icon: '🎯', title: 'Quiz Pertama',     desc: 'Selesaikan 1 sesi quiz manapun',                      xp: 30 },
    { type: 'quiz_complete', count: 2,         icon: '🏆', title: 'Double Quiz',      desc: 'Selesaikan 2 sesi quiz hari ini',                     xp: 55 },
    { type: 'quiz_accuracy', minPct: 80,       icon: '🎖', title: 'Akurasi Tinggi',  desc: 'Selesaikan quiz dengan akurasi ≥80%',                  xp: 45 },
    { type: 'quiz_accuracy', minPct: 100,      icon: '💯', title: 'Sempurna!',        desc: 'Selesaikan quiz dengan akurasi 100%',                  xp: 80 },
    // srs
    { type: 'srs_review', count: 5,            icon: '🔁', title: 'Review SRS',       desc: 'Review 5 kartu SRS yang jatuh tempo',                 xp: 35 },
    { type: 'srs_review', count: 10,           icon: '🔂', title: 'Master SRS',       desc: 'Review 10 kartu SRS hari ini',                        xp: 55 },
    // multi module
    { type: 'multi_module', count: 2,          icon: '🌐', title: 'Penjelajah',       desc: 'Belajar di 2 modul berbeda hari ini',                 xp: 40 },
    { type: 'multi_module', count: 3,          icon: '🌍', title: 'Multitasker',      desc: 'Belajar di 3 modul berbeda hari ini',                 xp: 60 },
    // streak
    { type: 'streak_active',                   icon: '🔥', title: 'Jaga Api Streak', desc: 'Belajar hari ini untuk menjaga streak-mu tetap hidup', xp: 25 },
  ];

  const MAX_DAILY = 3; // jumlah challenge per hari

  // ── Seed-based random (deterministik dari tanggal) ────────
  function seededRand(seed, n) {
    // simple LCG
    let s = seed;
    const results = [];
    for (let i = 0; i < n; i++) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      results.push(Math.abs(s));
    }
    return results;
  }

  function getTodaySeed() {
    const d = new Date();
    // seed: YYYYMMDD as integer
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  // Pilih MAX_DAILY template unik berdasarkan seed hari ini
  function generateTodayChallenges() {
    const seed  = getTodaySeed();
    const rands = seededRand(seed, MAX_DAILY * 5);
    const picked = [];
    const usedTypes = new Set();

    for (let i = 0; i < rands.length && picked.length < MAX_DAILY; i++) {
      const idx = rands[i] % TEMPLATES.length;
      const tpl = TEMPLATES[idx];
      // hindari tipe duplikat dalam satu hari
      const key = tpl.type + (tpl.module || '') + (tpl.target || '') + (tpl.count || '') + (tpl.minPct || '');
      if (!usedTypes.has(key)) {
        usedTypes.add(key);
        picked.push({ ...tpl, id: 'ch_' + seed + '_' + picked.length });
      }
    }
    // fallback jika kurang
    while (picked.length < MAX_DAILY) {
      const tpl = TEMPLATES[picked.length % TEMPLATES.length];
      picked.push({ ...tpl, id: 'ch_' + seed + '_' + picked.length });
    }
    return picked;
  }

  // ── Storage helpers ───────────────────────────────────────
  function getUserId() {
    const s = Auth.getSession();
    return s ? s.userId : null;
  }

  function getStorageKey() {
    const uid = getUserId();
    return uid ? 'nh_user_' + uid + '_challenges' : null;
  }

  function getData() {
    const uid = getUserId();
    if (!uid) return { byDate: {}, history: [] };
    return Storage.getUser(uid, 'challenges', { byDate: {}, history: [] });
  }

  function saveData(data) {
    const uid = getUserId();
    if (!uid) return;
    Storage.setUser(uid, 'challenges', data);
  }

  function getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  // ── Inisialisasi challenge hari ini ──────────────────────
  function initToday() {
    const data    = getData();
    const dateKey = getTodayKey();

    if (!data.byDate[dateKey]) {
      const challenges = generateTodayChallenges();
      data.byDate[dateKey] = challenges.map(ch => ({
        ...ch,
        progress: 0,
        completed: false,
        claimedXP: false,
      }));
      saveData(data);
    }
    return data.byDate[dateKey];
  }

  // ── Get challenge hari ini ────────────────────────────────
  function getTodayChallenges() {
    return initToday();
  }

  // ── Update progress challenge ─────────────────────────────
  // Dipanggil oleh event di progress.js / quiz.js
  function updateProgress(type, payload) {
    const uid = getUserId();
    if (!uid) return;

    const data     = getData();
    const dateKey  = getTodayKey();
    const list     = data.byDate[dateKey];
    if (!list) return;

    let anyChange = false;

    list.forEach((ch, idx) => {
      if (ch.completed) return;

      let progBefore = ch.progress;

      if (ch.type === type) {
        switch (type) {
          case 'learn_items': {
            // payload: { module }
            if (ch.module === 'any' || ch.module === payload.module) {
              ch.progress = Math.min(ch.target, (ch.progress || 0) + 1);
            }
            break;
          }
          case 'quiz_complete': {
            ch.progress = Math.min(ch.count, (ch.progress || 0) + 1);
            break;
          }
          case 'quiz_accuracy': {
            // payload: { accuracy } — 0-100
            if (payload.accuracy >= ch.minPct) {
              ch.progress = 1;
            }
            break;
          }
          case 'srs_review': {
            ch.progress = Math.min(ch.count, (ch.progress || 0) + (payload.count || 1));
            break;
          }
          case 'multi_module': {
            // payload: { module } — track distinct modules used today
            if (!ch._modulesUsed) ch._modulesUsed = [];
            if (!ch._modulesUsed.includes(payload.module)) {
              ch._modulesUsed.push(payload.module);
            }
            ch.progress = Math.min(ch.count, ch._modulesUsed.length);
            break;
          }
          case 'streak_active': {
            ch.progress = 1;
            break;
          }
        }
      }

      if (ch.progress !== progBefore) anyChange = true;

      // Cek apakah target tercapai
      const target = ch.target || ch.count || ch.minPct !== undefined ? 1 : 1;
      const maxProg = ch.target || ch.count || 1;
      if (!ch.completed && ch.progress >= maxProg) {
        ch.completed = true;
        anyChange = true;
      }
    });

    if (anyChange) {
      data.byDate[dateKey] = list;
      saveData(data);
    }

    return list;
  }

  // ── Claim XP untuk challenge yang selesai ────────────────
  function claimXP(challengeId) {
    const uid = getUserId();
    if (!uid || typeof XPSystem === 'undefined') return null;

    const data    = getData();
    const dateKey = getTodayKey();
    const list    = data.byDate[dateKey];
    if (!list) return null;

    const ch = list.find(c => c.id === challengeId);
    if (!ch || !ch.completed || ch.claimedXP) return null;

    ch.claimedXP = true;

    // Tambah ke history
    if (!data.history) data.history = [];
    data.history.push({
      id:        ch.id,
      title:     ch.title,
      icon:      ch.icon,
      xp:        ch.xp,
      date:      getTodayKey(),
      timestamp: new Date().toISOString(),
    });
    if (data.history.length > 100) data.history = data.history.slice(-100);

    saveData(data);

    // Tambah XP
    const result = XPSystem.addXP('challenge_complete', ch.xp, '🏆 Challenge: ' + ch.title);
    return { result, ch };
  }

  // ── Auto-claim semua yang selesai (utility) ───────────────
  function autoClaimCompleted() {
    const list = getTodayChallenges();
    const claimed = [];
    list.forEach(ch => {
      if (ch.completed && !ch.claimedXP) {
        const r = claimXP(ch.id);
        if (r) claimed.push(r);
      }
    });
    return claimed;
  }

  // ── History challenge selesai ─────────────────────────────
  function getHistory() {
    return getData().history || [];
  }

  // ── Stats summary ─────────────────────────────────────────
  function getSummary() {
    const history = getHistory();
    const today   = getTodayKey();
    const todayList = getTodayChallenges();

    return {
      totalCompleted: history.length,
      totalXPEarned:  history.reduce((s, h) => s + (h.xp || 0), 0),
      todayCount:     todayList.filter(c => c.completed).length,
      todayTotal:     todayList.length,
    };
  }

  // ── Trigger helpers (dipanggil dari modul lain) ───────────
  function onLearnItem(moduleId)           { return updateProgress('learn_items',   { module: moduleId }); }
  function onQuizComplete()                { return updateProgress('quiz_complete',  {}); }
  function onQuizAccuracy(accuracyPct)     { return updateProgress('quiz_accuracy',  { accuracy: accuracyPct }); }
  function onSrsReview(count)              { return updateProgress('srs_review',     { count: count || 1 }); }
  function onModuleVisit(moduleId)         { return updateProgress('multi_module',   { module: moduleId }); }
  function onStreakActive()                { return updateProgress('streak_active',  {}); }

  // ── Cleanup data lama (>14 hari) ─────────────────────────
  function cleanup() {
    const data  = getData();
    const now   = new Date();
    const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    let changed = false;
    Object.keys(data.byDate || {}).forEach(k => {
      if (k < cutoff) { delete data.byDate[k]; changed = true; }
    });
    if (changed) saveData(data);
  }

  return {
    getTodayChallenges,
    updateProgress,
    claimXP,
    autoClaimCompleted,
    getHistory,
    getSummary,
    onLearnItem, onQuizComplete, onQuizAccuracy,
    onSrsReview, onModuleVisit, onStreakActive,
    cleanup,
  };

})();

window.ChallengeSystem = ChallengeSystem;
