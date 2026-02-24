/**
 * NihonHan - Report / Export PDF (Fase 19)
 * Membaca semua data user dari localStorage dan merender laporan.
 * Auto-print tersedia, dipicu oleh URL parameter ?autoprint=1
 */

// ── Constants ──────────────────────────────────────────────────────────

const MODULES = [
  { id: 'hiragana',  char: 'あ', name: 'Hiragana',      total: 104,  lang: 'jp' },
  { id: 'katakana',  char: 'ア', name: 'Katakana',      total: 104,  lang: 'jp' },
  { id: 'kanji',     char: '漢', name: 'Kanji',          total: 278,  lang: 'jp' },
  { id: 'jp-vocab',  char: '語', name: 'Kosakata JP',   total: 225,  lang: 'jp' },
  { id: 'pinyin',    char: '拼', name: 'Pinyin',         total: 59,   lang: 'zh' },
  { id: 'hanzi',     char: '汉', name: 'Hanzi',          total: 208,  lang: 'zh' },
  { id: 'zh-vocab',  char: '词', name: 'Kosakata ZH',   total: 600,  lang: 'zh' },
];

const ALL_BADGES = [
  { id: 'first_quiz',       name: 'Pemula Berani',      icon: '🎯', desc: 'Selesaikan quiz pertama' },
  { id: 'quiz_10',          name: 'Rajin Berlatih',     icon: '📝', desc: 'Selesaikan 10 quiz' },
  { id: 'quiz_perfect',     name: 'Nilai Sempurna',     icon: '💯', desc: 'Raih skor 100% di quiz' },
  { id: 'learned_10',       name: 'Karakter Pertama',   icon: '✨', desc: 'Pelajari 10 item' },
  { id: 'learned_50',       name: 'Pelajar Serius',     icon: '📚', desc: 'Pelajari 50 item' },
  { id: 'learned_100',      name: 'Setengah Jalan',     icon: '🏅', desc: 'Pelajari 100 item' },
  { id: 'learned_200',      name: 'Hampir Master',      icon: '🌟', desc: 'Pelajari 200 item' },
  { id: 'streak_3',         name: '3 Hari Berturut',    icon: '🔥', desc: 'Streak 3 hari' },
  { id: 'streak_7',         name: 'Seminggu Penuh',     icon: '🔥', desc: 'Streak 7 hari' },
  { id: 'streak_30',        name: 'Master Dedikasi',    icon: '👑', desc: 'Streak 30 hari' },
  { id: 'accuracy_80',      name: 'Akurat',             icon: '🎯', desc: 'Akurasi ≥80%' },
  { id: 'perfect_streak',   name: 'Streak Sempurna',    icon: '⭐', desc: 'Streak sempurna' },
];

const LEVELS = [
  { level: 1, name: '入門',  nameID: 'Pemula',   xpRequired: 0     },
  { level: 2, name: '初級',  nameID: 'Dasar',    xpRequired: 100   },
  { level: 3, name: '中級',  nameID: 'Menengah', xpRequired: 300   },
  { level: 4, name: '上級',  nameID: 'Lanjutan', xpRequired: 700   },
  { level: 5, name: '達人',  nameID: 'Mahir',    xpRequired: 1500  },
  { level: 6, name: '師範',  nameID: 'Ahli',     xpRequired: 3000  },
  { level: 7, name: '名人',  nameID: 'Master',   xpRequired: 6000  },
];

const MODULE_NAME_MAP = {
  hiragana: 'Hiragana', katakana: 'Katakana', kanji: 'Kanji',
  hanzi: 'Hanzi', 'jp-vocab': 'Kosakata JP', 'zh-vocab': 'Kosakata ZH',
  'quiz-jp-hiragana': 'Quiz Hiragana', 'quiz-jp-katakana': 'Quiz Katakana',
  'quiz-jp-kanji': 'Quiz Kanji', 'quiz-zh-hanzi': 'Quiz Hanzi',
  'quiz-zh-vocab': 'Quiz Kosakata ZH', 'quiz-zh-pinyin': 'Quiz Pinyin',
};

// ── Helpers ────────────────────────────────────────────────────────────

function getLevelFromXP(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

function getLevelProgress(xp) {
  const current = getLevelFromXP(xp);
  const next = LEVELS.find(l => l.level === current.level + 1) || null;
  if (!next) return { current, next: null, pct: 100, xpInLevel: xp - current.xpRequired, xpNeeded: 0 };
  const xpInLevel = xp - current.xpRequired;
  const xpNeeded  = next.xpRequired - current.xpRequired;
  return { current, next, pct: Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)), xpInLevel, xpNeeded };
}

function formatDate(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return isoStr; }
}

function formatDateShort(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return isoStr; }
}

// ── Main renderer ──────────────────────────────────────────────────────

function renderReport(user) {
  // ── Date ─────────────────────────────────────────────────
  document.getElementById('report-date').textContent =
    'Dicetak: ' + formatDate(new Date().toISOString());

  // ── User info ─────────────────────────────────────────────
  document.getElementById('report-name').textContent  = user.name || '-';
  document.getElementById('report-email').textContent = user.email || '-';
  document.getElementById('report-avatar').textContent = user.avatar || '日';
  document.getElementById('report-since').textContent  =
    user.createdAt ? 'Bergabung: ' + formatDate(new Date(user.createdAt).toISOString()) : '-';

  // ── XP & Level ────────────────────────────────────────────
  const xpData   = Storage.getUser(user.id, 'xp', { total: 0, history: [] });
  const totalXP  = xpData.total || 0;
  const lvlInfo  = getLevelProgress(totalXP);

  document.getElementById('report-level-jp').textContent  = lvlInfo.current.name;
  document.getElementById('report-level-id').textContent  = lvlInfo.current.nameID;
  document.getElementById('report-level-xp').textContent  = totalXP.toLocaleString('id') + ' XP';

  // ── Stats ─────────────────────────────────────────────────
  const stats  = Storage.getUser(user.id, 'stats',  { totalLearned: 0, quizCompleted: 0, totalCorrect: 0, totalQuestions: 0 });
  const streak = Storage.getUser(user.id, 'streak', { count: 0, best: 0 });
  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) + '%'
    : '-';

  const summaryGrid = document.getElementById('summary-grid');
  summaryGrid.innerHTML = [
    { value: (stats.totalLearned || 0).toLocaleString('id'), label: 'Total Item Dipelajari' },
    { value: streak.best || streak.count || 0,              label: 'Streak Terbaik (Hari)' },
    { value: stats.quizCompleted || 0,                       label: 'Sesi Quiz Selesai' },
    { value: accuracy,                                        label: 'Rata-rata Akurasi Quiz' },
    { value: totalXP.toLocaleString('id'),                   label: 'Total XP Diraih' },
    { value: lvlInfo.current.name + ' ' + lvlInfo.current.nameID, label: 'Level Saat Ini' },
    { value: Object.keys(Storage.getUser(user.id, 'badges', {})).length + ' / ' + ALL_BADGES.length, label: 'Badge Diraih' },
    { value: (() => {
        const favs = Storage.getUser(user.id, 'favorites', {});
        return Object.values(favs).reduce((sum, arr) => sum + (arr?.length || 0), 0);
      })(), label: 'Item Difavoritkan' },
  ].map(s => `
    <div class="summary-card">
      <div class="summary-card-value">${s.value}</div>
      <div class="summary-card-label">${s.label}</div>
    </div>
  `).join('');

  // ── XP Level row ──────────────────────────────────────────
  const xpLevelRow = document.getElementById('xp-level-row');
  const xpBarHTML = `
    <div class="xp-bar-wrap">
      <div class="xp-bar-label">
        Lv.${lvlInfo.current.level} ${lvlInfo.current.name}
        ${lvlInfo.next ? `→ Lv.${lvlInfo.next.level} ${lvlInfo.next.name}` : '(Max Level)'}
      </div>
      <div class="xp-bar-track">
        <div class="xp-bar-fill" style="width:${lvlInfo.pct}%"></div>
      </div>
      <div class="xp-bar-pct">${lvlInfo.pct}%</div>
    </div>
    <div class="level-dots">
      ${LEVELS.map(lvl => {
        const isActive    = lvl.level === lvlInfo.current.level;
        const isCompleted = lvl.level < lvlInfo.current.level;
        return `<div class="level-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
          <span class="level-dot-jp">${lvl.name}</span>
          <span class="level-dot-id">${lvl.nameID}</span>
          ${isCompleted ? '<span class="level-dot-check">✓</span>' : ''}
          ${isActive ? '<span class="level-dot-check">◉</span>' : ''}
        </div>`;
      }).join('')}
    </div>
  `;
  xpLevelRow.innerHTML = xpBarHTML;

  // ── Module progress ───────────────────────────────────────
  const progress   = Storage.getUser(user.id, 'progress', {});
  const moduleList = document.getElementById('module-list');

  moduleList.innerHTML = MODULES.map(mod => {
    const learned = progress[mod.id]?.learned?.length || 0;
    const pct     = Math.min(100, Math.round((learned / mod.total) * 100));
    return `
      <div class="module-row">
        <div class="module-row-char">${mod.char}</div>
        <div class="module-row-info">
          <div class="module-row-name">${mod.name}</div>
          <div class="module-row-bar-wrap">
            <div class="module-row-bar">
              <div class="module-row-fill" style="width:${pct}%"></div>
            </div>
            <div class="module-row-count">${learned}/${mod.total}</div>
          </div>
        </div>
        <div class="module-row-pct">${pct}%</div>
      </div>
    `;
  }).join('');

  // ── Activity heatmap (28 hari) ────────────────────────────
  const activity   = Storage.getUser(user.id, 'activity', {});
  const heatmapWrap = document.getElementById('heatmap-wrap');
  const today      = new Date();
  const cells      = [];

  for (let i = 27; i >= 0; i--) {
    const d    = new Date(today);
    d.setDate(today.getDate() - i);
    const key  = d.toISOString().split('T')[0];
    const val  = activity[key] || 0;
    const lvl  = val === 0 ? 0 : val === 1 ? 1 : val <= 3 ? 2 : val <= 6 ? 3 : 4;
    const label = key + (val ? ` (${val} sesi)` : ' (tidak aktif)');
    cells.push(`<div class="heatmap-cell lvl-${lvl}" title="${label}"></div>`);
  }

  heatmapWrap.innerHTML = `
    <div class="heatmap-days">${cells.join('')}</div>
    <div class="heatmap-legend">
      Tidak aktif
      <div class="heatmap-legend-cell" style="background:#F5F0EB;border:1px solid #E8DDD0;"></div>
      <div class="heatmap-legend-cell" style="background:#FADBD8;"></div>
      <div class="heatmap-legend-cell" style="background:#E74C3C;"></div>
      <div class="heatmap-legend-cell" style="background:#C0392B;"></div>
      <div class="heatmap-legend-cell" style="background:#7B241C;"></div>
      Sangat aktif
    </div>
  `;

  // ── Badges ────────────────────────────────────────────────
  const earnedBadges = Storage.getUser(user.id, 'badges', {});
  const badgesGrid   = document.getElementById('badges-grid');

  badgesGrid.innerHTML = ALL_BADGES.map(b => {
    const earned    = !!earnedBadges[b.id];
    const earnedAt  = earnedBadges[b.id]?.date || null;
    return `
      <div class="badge-card ${earned ? 'earned' : ''}">
        <div class="badge-card-icon">${b.icon}</div>
        <div class="badge-card-name">${b.name}</div>
        <div class="badge-card-desc">${b.desc}</div>
        ${earned && earnedAt ? `<div class="badge-card-date">${formatDateShort(earnedAt)}</div>` : ''}
      </div>
    `;
  }).join('');

  // ── Quiz history ──────────────────────────────────────────
  const allScores = [];
  Object.entries(progress).forEach(([moduleId, data]) => {
    if (data.quiz_scores) {
      data.quiz_scores.forEach(entry => allScores.push({ moduleId, ...entry }));
    }
  });
  allScores.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const recent = allScores.slice(0, 15);

  const quizTbody = document.getElementById('quiz-tbody');
  if (recent.length === 0) {
    quizTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#9A8A7A;padding:20px;">Belum ada riwayat quiz.</td></tr>';
  } else {
    quizTbody.innerHTML = recent.map(s => {
      const acc   = s.total > 0 ? Math.round((s.score / s.total) * 100) : 0;
      const name  = MODULE_NAME_MAP[s.moduleId] || s.moduleId;
      const pillCls = acc === 100 ? 'perfect' : acc >= 80 ? 'good' : acc >= 60 ? 'ok' : 'poor';
      return `
        <tr>
          <td>${name}</td>
          <td>${s.score}/${s.total}</td>
          <td><span class="quiz-acc-pill ${pillCls}">${acc}%</span></td>
          <td>${s.date || '-'}</td>
        </tr>
      `;
    }).join('');
  }

  // ── Recently learned items ────────────────────────────────
  const learnedSummary = document.getElementById('learned-summary');
  const learnedHTML    = MODULES.map(mod => {
    const items = progress[mod.id]?.learned || [];
    if (items.length === 0) return '';
    const show  = items.slice(-20); // last 20 learned
    const extra = items.length - show.length;
    return `
      <div class="learned-module-box">
        <div class="learned-module-title">
          <span class="learned-module-title-char">${mod.char}</span>
          ${mod.name} <span style="color:#9A8A7A;font-weight:400;font-size:0.75rem;">(${items.length} item)</span>
        </div>
        <div class="learned-chars">
          ${show.map(ch => `<span class="learned-char-chip">${ch}</span>`).join('')}
        </div>
        ${extra > 0 ? `<div class="learned-more">+${extra} item lainnya</div>` : ''}
      </div>
    `;
  }).filter(Boolean).join('');

  learnedSummary.innerHTML = learnedHTML || '<div style="color:#9A8A7A;font-size:0.85rem;">Belum ada item yang dipelajari.</div>';
}

// ── Init ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Check session
  const session = Auth.getSession ? Auth.getSession() : null;
  const allUsers = Storage.get('users', []);

  let user = null;
  if (session && session.userId) {
    user = allUsers.find(u => u.id === session.userId);
  }

  if (!user) {
    // Not logged in — redirect to login
    window.location.href = '../pages/login.html';
    return;
  }

  // Render
  try {
    renderReport(user);
  } catch (e) {
    console.error('[Report] Render error:', e);
  }

  // Show report, hide loading
  document.getElementById('report-loading').style.display = 'none';
  document.getElementById('report-wrap').style.display    = 'block';

  // Auto-print if URL has ?autoprint=1
  const params = new URLSearchParams(window.location.search);
  if (params.get('autoprint') === '1') {
    setTimeout(() => window.print(), 800);
  }
});
