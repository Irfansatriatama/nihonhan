/**
 * NihonHan - Quiz Engine
 * Engine quiz reusable: multiple choice, timer, skor, badge.
 */
const QuizEngine = (() => {

  // ── State ────────────────────────────────────────────────
  let _questions    = [];
  let _current      = 0;
  let _score        = 0;
  let _answered     = false;
  let _timer        = null;
  let _timeLeft     = 0;
  let _config       = {};
  let _results      = [];
  let _onFinish     = null;

  // ── Default config ───────────────────────────────────────
  const DEFAULTS = {
    totalQuestions : 10,
    choicesCount   : 4,
    timerSeconds   : 20,  // 0 = no timer
    moduleId       : 'quiz',
  };

  // ── Public: init ─────────────────────────────────────────
  /**
   * Mulai quiz baru.
   * @param {Array}    allItems  — semua item dari dataset
   * @param {Function} buildFn  — fn(item, allItems) => { question, answer, choices[] }
   * @param {Object}   config   — merge dengan DEFAULTS
   * @param {Function} onFinish — callback(results, score, total)
   */
  function start(allItems, buildFn, config = {}, onFinish = null) {
    _config    = { ...DEFAULTS, ...config };
    _onFinish  = onFinish;
    _score     = 0;
    _current   = 0;
    _results   = [];
    _answered  = false;

    // Acak dan potong dataset
    const shuffled = _shuffle([...allItems]);
    const pool     = shuffled.slice(0, Math.min(_config.totalQuestions * 3, shuffled.length));

    _questions = pool
      .slice(0, _config.totalQuestions)
      .map(item => buildFn(item, allItems))
      .filter(q => q && q.choices && q.choices.length >= 2);

    if (_questions.length === 0) {
      console.warn('[QuizEngine] Tidak ada soal yang bisa dibuat.');
      return false;
    }

    return true;
  }

  // ── Public: getQuestion ──────────────────────────────────
  function getQuestion() {
    if (_current >= _questions.length) return null;
    return {
      ..._questions[_current],
      index   : _current,
      total   : _questions.length,
    };
  }

  // ── Public: answer ───────────────────────────────────────
  /**
   * Jawab soal saat ini.
   * @returns {{ correct: bool, correctAnswer: string, explanation: string }}
   */
  function answer(choice) {
    if (_answered) return null;
    _answered = true;
    _stopTimer();

    const q       = _questions[_current];
    const correct = choice === q.answer;
    if (correct) _score++;

    const result = {
      index     : _current,
      question  : q.question,
      userAnswer: choice,
      answer    : q.answer,
      correct,
      explanation: q.explanation || '',
    };
    _results.push(result);
    return result;
  }

  // ── Public: next ─────────────────────────────────────────
  function next() {
    _current++;
    _answered = false;
    if (_current >= _questions.length) {
      _finish();
      return false; // quiz selesai
    }
    return true;
  }

  // ── Public: getProgress ──────────────────────────────────
  function getProgress() {
    return {
      current : _current,
      total   : _questions.length,
      score   : _score,
    };
  }

  function getResults() { return _results; }
  function getScore()   { return _score; }
  function getTotal()   { return _questions.length; }

  // ── Timer ────────────────────────────────────────────────
  function startTimer(onTick, onExpire) {
    if (!_config.timerSeconds) return;
    _timeLeft = _config.timerSeconds;
    onTick(_timeLeft);
    _timer = setInterval(() => {
      _timeLeft--;
      onTick(_timeLeft);
      if (_timeLeft <= 0) {
        _stopTimer();
        onExpire();
      }
    }, 1000);
  }

  function _stopTimer() {
    if (_timer) { clearInterval(_timer); _timer = null; }
  }

  // ── Finish ───────────────────────────────────────────────
  function _finish() {
    _stopTimer();
    Progress.saveQuizScore(_config.moduleId, {
      score: _score,
      total: _questions.length,
    });
    BadgeSystem.checkAndAward(_config.moduleId, _score, _questions.length);
    if (_onFinish) _onFinish(_results, _score, _questions.length);
  }

  // ── Utility ──────────────────────────────────────────────
  function _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ── Helper: buat 4 choices dari pool ─────────────────────
  /**
   * Pilih N item unik dari array (tidak termasuk excludeVal).
   */
  function pickWrongAnswers(pool, correct, getVal, count = 3) {
    const wrongs = _shuffle(pool.filter(x => getVal(x) !== correct));
    return wrongs.slice(0, count).map(getVal);
  }

  function shuffleChoices(choices) {
    return _shuffle([...choices]);
  }

  return {
    start, getQuestion, answer, next,
    getProgress, getResults, getScore, getTotal,
    startTimer,
    pickWrongAnswers, shuffleChoices,
  };
})();

window.QuizEngine = QuizEngine;


// ═══════════════════════════════════════════════════════════
// Badge System
// ═══════════════════════════════════════════════════════════
const BadgeSystem = (() => {

  const BADGES = [
    // Quiz milestones
    { id:'first_quiz',       name:'Pemula Berani',      icon:'🎯', desc:'Selesaikan quiz pertama kamu!',          check: (stats) => stats.quizCompleted >= 1 },
    { id:'quiz_10',          name:'Rajin Berlatih',     icon:'📝', desc:'Selesaikan 10 sesi quiz.',               check: (stats) => stats.quizCompleted >= 10 },
    { id:'quiz_perfect',     name:'Nilai Sempurna',     icon:'💯', desc:'Raih skor 100% dalam satu sesi quiz.',   check: (stats, last) => last && last.score === last.total && last.total >= 5 },

    // Learned milestones
    { id:'learned_10',       name:'Karakter Pertama',   icon:'✨', desc:'Hafal 10 karakter atau kosakata.',       check: (stats) => stats.totalLearned >= 10 },
    { id:'learned_50',       name:'Pelajar Serius',     icon:'📚', desc:'Hafal 50 karakter atau kosakata.',       check: (stats) => stats.totalLearned >= 50 },
    { id:'learned_100',      name:'Setengah Jalan',     icon:'🏅', desc:'Hafal 100 karakter atau kosakata.',      check: (stats) => stats.totalLearned >= 100 },
    { id:'learned_200',      name:'Hampir Master',      icon:'🌟', desc:'Hafal 200 karakter atau kosakata.',      check: (stats) => stats.totalLearned >= 200 },

    // Streak milestones
    { id:'streak_3',         name:'3 Hari Berturut',    icon:'🔥', desc:'Belajar 3 hari berturut-turut.',         check: (stats, last, streak) => streak >= 3 },
    { id:'streak_7',         name:'Seminggu Penuh',     icon:'🔥', desc:'Belajar 7 hari berturut-turut.',         check: (stats, last, streak) => streak >= 7 },
    { id:'streak_30',        name:'Master Dedikasi',    icon:'👑', desc:'Belajar 30 hari berturut-turut.',        check: (stats, last, streak) => streak >= 30 },

    // Accuracy
    { id:'accuracy_80',      name:'Akurat',             icon:'🎯', desc:'Jawab 80% soal benar secara keseluruhan.', check: (stats) => stats.totalQuestions >= 20 && (stats.totalCorrect / stats.totalQuestions) >= 0.8 },
  ];

  function getUserId() {
    const s = Auth.getSession();
    return s ? s.userId : null;
  }

  function getBadges() {
    const uid = getUserId();
    if (!uid) return {};
    return Storage.getUser(uid, 'badges', {});
  }

  function hasBadge(id) {
    return !!getBadges()[id];
  }

  function awardBadge(badgeId) {
    const uid = getUserId();
    if (!uid) return false;
    const badges = getBadges();
    if (badges[badgeId]) return false; // sudah punya
    badges[badgeId] = { earnedAt: new Date().toISOString() };
    Storage.setUser(uid, 'badges', badges);
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      _showBadgeToast(badge);
    }
    return true;
  }

  function checkAndAward(moduleId, score, total) {
    const uid = getUserId();
    if (!uid) return;

    const stats  = Storage.getUser(uid, 'stats', {});
    const streak = _getStreak(uid);
    const last   = { score, total, moduleId };

    BADGES.forEach(badge => {
      if (!hasBadge(badge.id)) {
        if (badge.check(stats, last, streak)) {
          awardBadge(badge.id);
        }
      }
    });
  }

  function _getStreak(uid) {
    const streak = Storage.getUser(uid, 'streak', { current: 0 });
    return streak.current || 0;
  }

  function _showBadgeToast(badge) {
    // Buat toast badge khusus
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = 'toast badge-toast';
    el.innerHTML = `
      <span class="badge-toast-icon">${badge.icon}</span>
      <div class="badge-toast-info">
        <div class="badge-toast-title">Badge Baru!</div>
        <div class="badge-toast-name">${badge.name}</div>
      </div>
    `;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('hide');
      setTimeout(() => el.remove(), 300);
    }, 4000);
  }

  function getAllBadgeDefs() { return BADGES; }

  return { getBadges, hasBadge, awardBadge, checkAndAward, getAllBadgeDefs };
})();

window.BadgeSystem = BadgeSystem;
