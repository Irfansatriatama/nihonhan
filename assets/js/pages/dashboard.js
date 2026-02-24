/**
 * NihonHan - Dashboard Page
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;

  const user = Auth.getActiveUser();
  App.init('dashboard');

  // ── Fase 18: Init ReminderSystem ────────────────────────────
  if (typeof ReminderSystem !== 'undefined') {
    ReminderSystem.init(user.id);
  }

  // ── Date ────────────────────────────────────────────────
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('id-ID', opts);
  }

  // Live clock (Fase 20.4)
  const clockEl = document.getElementById('topbar-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = hh + ':' + mm + ':' + ss + ' WIB';
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── Welcome banner ───────────────────────────────────────
  const nameEl = document.getElementById('welcome-name');
  if (nameEl && user) nameEl.textContent = user.name;

  const cjkBg = document.getElementById('welcome-cjk');
  if (cjkBg && user) cjkBg.textContent = user.avatar || '日';

  // ── Streak ───────────────────────────────────────────────
  const streak = Storage.getUser(user.id, 'streak', { count: 0 });
  document.getElementById('streak-count').textContent = streak.count + ' hari';
  document.getElementById('stat-streak').textContent  = streak.count;

  // ── Stats ────────────────────────────────────────────────
  const stats = Storage.getUser(user.id, 'stats', {
    totalLearned: 0, quizCompleted: 0, totalCorrect: 0, totalQuestions: 0
  });
  document.getElementById('stat-total').textContent   = stats.totalLearned;
  document.getElementById('stat-quiz').textContent    = stats.quizCompleted;
  document.getElementById('stat-accuracy').textContent =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) + '%'
      : '-';

  // ── Module data ──────────────────────────────────────────
  const progress = Storage.getUser(user.id, 'progress', {});

  const jpModules = [
    { id: 'hiragana', char: 'あ', name: 'Hiragana', total: 104, href: 'japanese/hiragana.html', lang: 'JP' },
    { id: 'katakana', char: 'ア', name: 'Katakana', total: 104, href: 'japanese/katakana.html', lang: 'JP' },
    { id: 'kanji',    char: '漢', name: 'Kanji',    total: 103, href: 'japanese/kanji.html',    lang: 'JP', note: 'N5' },
    { id: 'jp-vocab', char: '語', name: 'Kosakata', total: 500, href: 'japanese/vocabulary.html', lang: 'JP' },
    { id: 'jp-grammar',char:'文', name: 'Grammar',  total: 50,  href: 'japanese/grammar.html',  lang: 'JP' },
  ];

  const zhModules = [
    { id: 'pinyin',  char: '拼', name: 'Pinyin',  total: 59,   href: 'mandarin/pinyin.html',     lang: 'ZH' },
    { id: 'tones',   char: '声', name: 'Nada',    total: 5,    href: 'mandarin/tones.html',      lang: 'ZH' },
    { id: 'hanzi',   char: '汉', name: 'Hanzi',   total: 150,  href: 'mandarin/hanzi.html',      lang: 'ZH', note: 'HSK1' },
    { id: 'zh-vocab',char: '词', name: 'Kosakata',total: 500,  href: 'mandarin/vocabulary.html', lang: 'ZH' },
  ];

  function renderModules(modules, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = modules.map(mod => {
      const learned = (progress[mod.id] && progress[mod.id].learned)
        ? progress[mod.id].learned.length : 0;
      const pct = Math.round((learned / mod.total) * 100);

      return `
        <a class="module-card" href="${mod.href}">
          <div class="module-card-top">
            <span class="module-char">${mod.char}</span>
            ${mod.note ? `<span class="badge badge-gray">${mod.note}</span>` : ''}
          </div>
          <div>
            <div class="module-name">${mod.name}</div>
            <div class="module-count">${learned} / ${mod.total} dipelajari</div>
          </div>
          <div>
            <div class="module-progress-info">
              <span>Progress</span>
              <span>${pct}%</span>
            </div>
            <div class="progress-bar progress-sm">
              <div class="progress-fill" style="width:${pct}%"></div>
            </div>
          </div>
        </a>
      `;
    }).join('');
  }

  renderModules(jpModules, 'jp-modules');
  renderModules(zhModules, 'zh-modules');

  // ── Daily quote ──────────────────────────────────────────
  const quotes = [
    { char: '学', text: 'Belajar tanpa berpikir adalah sia-sia. Berpikir tanpa belajar adalah berbahaya.', src: '— Konfusius' },
    { char: '道', text: 'Perjalanan seribu mil dimulai dari satu langkah.', src: '— Lao Tzu' },
    { char: '継', text: 'Jatuh tujuh kali, bangkit delapan kali.', src: '— Peribahasa Jepang (七転び八起き)' },
    { char: '精', text: 'Latihan membuat sempurna. Kesabaran membawa keberhasilan.', src: '— Peribahasa Mandarin' },
    { char: '志', text: 'Orang yang belajar bahasa baru membuka jendela baru ke dunia.', src: '— Pepatah Ceko' },
    { char: '歩', text: 'Tidak peduli seberapa lambat kamu melangkah, selama kamu tidak berhenti.', src: '— Konfusius' },
    { char: '努', text: 'Rajin melatih diri adalah kunci menguasai bahasa apa pun.', src: '— Peribahasa Umum' },
  ];

  const today = new Date().getDay();
  const q     = quotes[today % quotes.length];
  document.getElementById('quote-char').textContent  = q.char;
  document.getElementById('quote-text').textContent  = q.text;
  document.getElementById('quote-source').textContent = q.src;

  // ── Welcome quote variation ──────────────────────────────
  const welcomeQuotes = [
    'Setiap karakter yang kamu pelajari adalah langkah menuju pemahaman baru.',
    'Konsistensi adalah kunci. Belajar sedikit setiap hari lebih baik dari sekaligus banyak.',
    '一日一字 — Satu hari, satu karakter.',
    'Bahasa adalah jembatan antara dua dunia yang berbeda.',
  ];
  const wq = document.getElementById('welcome-quote');
  if (wq) wq.textContent = welcomeQuotes[new Date().getDate() % welcomeQuotes.length];

  // ── Weekly activity chart ─────────────────────────────────
  const weekChart = document.getElementById('week-chart');
  if (weekChart) {
    const dayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
    const now = new Date();
    const activity = Storage.getUser(user.id, 'activity', {});
    let totalSessions = 0;
    const bars = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const k = d.toISOString().split('T')[0];
      const c = activity[k] || 0;
      totalSessions += c;
      bars.push({ label: dayNames[d.getDay()], count: c, isToday: i === 0 });
    }
    const maxCount = Math.max(...bars.map(b => b.count), 1);
    weekChart.innerHTML = bars.map(b => {
      const h = b.count > 0 ? Math.max(Math.round((b.count / maxCount) * 64), 10) : 4;
      return `<div class="week-bar-wrap">
        <div class="week-bar${b.count===0?' empty':''}${b.isToday?' today':''}" style="height:${h}px" title="${b.count} sesi"></div>
        <span class="week-label${b.isToday?' today':''}">${b.label}</span>
      </div>`;
    }).join('');
    const lbl = document.getElementById('week-total-label');
    if (lbl) lbl.textContent = totalSessions + ' sesi minggu ini';
  }

  // ── SRS Due Today ─────────────────────────────────────────
  const srsModules = [
    { id: 'hiragana', icon: 'あ', name: 'Hiragana',    href: 'japanese/hiragana.html' },
    { id: 'katakana', icon: 'ア', name: 'Katakana',    href: 'japanese/katakana.html' },
    { id: 'kanji',    icon: '漢', name: 'Kanji',       href: 'japanese/kanji.html' },
    { id: 'jp-vocab', icon: '語', name: 'Kosakata JP', href: 'japanese/vocabulary.html' },
    { id: 'hanzi',    icon: '汉', name: 'Hanzi',       href: 'mandarin/hanzi.html' },
    { id: 'zh-vocab', icon: '词', name: 'Kosakata ZH', href: 'mandarin/vocabulary.html' },
  ];

  function renderSrsDue() {
    const section = document.getElementById('srs-due-section');
    if (!section) return;

    // Show section only if any SRS data exists
    const hasAnySrs = srsModules.some(mod => {
      const data = Storage.getUser(user.id, 'srs_' + mod.id, {});
      return Object.keys(data).length > 0;
    });

    if (!hasAnySrs) { section.style.display = 'none'; return; }
    section.style.display = '';

    const dueGrid = document.getElementById('srs-due-grid');
    if (!dueGrid) return;

    const dueIds   = SRS.getDueCountPerModule(srsModules.map(m => m.id));
    const totalDue = Object.values(dueIds).reduce((a,b) => a+b, 0);

    const totalBadge = document.getElementById('srs-total-badge');
    if (totalBadge) totalBadge.textContent = totalDue + ' kartu';

    if (totalDue === 0) {
      dueGrid.innerHTML = `<div class="srs-due-zero">✅ Semua kartu SRS sudah diulang hari ini! Kembali besok.</div>`;
      return;
    }

    dueGrid.innerHTML = srsModules
      .filter(mod => (dueIds[mod.id] || 0) > 0)
      .map(mod => `
        <a class="srs-due-module-card" href="${mod.href}">
          <div class="due-icon cjk">${mod.icon}</div>
          <div class="due-info">
            <div class="due-name">${mod.name}</div>
            <div class="due-count">${dueIds[mod.id]}</div>
            <div class="due-label">kartu jatuh tempo</div>
          </div>
          <span>→</span>
        </a>
      `).join('');
  }

  renderSrsDue();

  // ── XP & Level (Fase 14) ──────────────────────────────────
  function renderXP() {
    if (typeof XPSystem === 'undefined') return;

    const totalXP = XPSystem.getTotalXP();
    const info    = XPSystem.getLevelInfo(totalXP);
    const { current, next, pct, xpInLevel, xpNeeded } = info;

    // Welcome bar
    const fill   = document.getElementById('xp-bar-fill');
    const badge  = document.getElementById('xp-level-badge');
    const lblCur = document.getElementById('xp-label-current');
    const lblName= document.getElementById('xp-label-name');
    const lblNext= document.getElementById('xp-label-next');

    if (fill)    fill.style.width = pct + '%';
    if (badge)   { badge.textContent = 'Lv.' + current.level; badge.style.background = current.color; }
    if (lblCur)  lblCur.textContent = xpInLevel + ' XP';
    if (lblName) lblName.textContent = current.name + ' ' + current.nameID;
    if (lblNext) lblNext.textContent = next ? xpNeeded + ' XP' : 'MAX';

    // XP total badge di section
    const totalBadge = document.getElementById('xp-total-badge');
    if (totalBadge) totalBadge.textContent = totalXP + ' XP Total';

    // Level progression row
    const levelsRow = document.getElementById('xp-levels-row');
    if (levelsRow) {
      const allLevels = XPSystem.getAllLevels();
      levelsRow.innerHTML = allLevels.map(lvl => {
        const isCurrentLvl = lvl.level === current.level;
        const isPassed = lvl.level < current.level;
        return `
          <div class="xp-level-dot ${isPassed ? 'passed' : ''} ${isCurrentLvl ? 'active' : ''}">
            <div class="xp-dot-circle" style="${isPassed || isCurrentLvl ? 'background:' + lvl.color : ''}">
              ${isPassed ? '✓' : lvl.level}
            </div>
            <div class="xp-dot-label">${lvl.name}</div>
            <div class="xp-dot-sublabel">${lvl.nameID}</div>
          </div>
        `;
      }).join('<div class="xp-level-connector"></div>');
    }

    // History list
    const histList = document.getElementById('xp-history-list');
    if (histList) {
      const history = XPSystem.getHistory().slice().reverse().slice(0, 8);
      if (history.length === 0) {
        histList.innerHTML = '<div class="xp-history-empty">Belum ada aktivitas XP. Mulai belajar untuk mendapat XP!</div>';
      } else {
        histList.innerHTML = history.map(entry => {
          const d = new Date(entry.date);
          const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          return `
            <div class="xp-history-item">
              <span class="xp-history-label">${entry.label}</span>
              <span class="xp-history-date">${dateStr} ${timeStr}</span>
              <span class="xp-history-amount">+${entry.amount} XP</span>
            </div>
          `;
        }).join('');
      }
    }
  }

  renderXP();

  // ── Daily Challenge (Fase 15) ────────────────────────────
  function renderChallenge() {
    if (typeof ChallengeSystem === 'undefined') return;

    ChallengeSystem.cleanup();
    // Tandai streak aktif
    ChallengeSystem.onStreakActive();

    const list         = ChallengeSystem.getTodayChallenges();
    const statusBadge  = document.getElementById('challenge-status-badge');
    const challengeList= document.getElementById('challenge-list');
    if (!challengeList) return;

    const doneCount = list.filter(c => c.completed).length;
    if (statusBadge) {
      statusBadge.textContent = doneCount + '/' + list.length + ' Selesai';
      statusBadge.className   = 'badge ' + (doneCount === list.length ? 'badge-red' : 'badge-gold');
    }

    challengeList.innerHTML = list.map(ch => {
      const maxProg = ch.target || ch.count || 1;
      const prog    = Math.min(ch.progress || 0, maxProg);
      const pct     = Math.round((prog / maxProg) * 100);
      const isClaimed  = ch.claimedXP;
      const isComplete = ch.completed;

      return `
        <div class="challenge-item ${isComplete ? 'completed' : ''}" data-id="${ch.id}">
          <div class="challenge-icon">${ch.icon}</div>
          <div class="challenge-body">
            <div class="challenge-title-row">
              <span class="challenge-title">${ch.title}</span>
              <span class="challenge-xp-badge">+${ch.xp} XP</span>
            </div>
            <div class="challenge-desc">${ch.desc}</div>
            ${maxProg > 1 ? `
            <div class="challenge-progress-wrap">
              <div class="challenge-progress-bar">
                <div class="challenge-progress-fill" style="width:${pct}%"></div>
              </div>
              <span class="challenge-progress-label">${prog}/${maxProg}</span>
            </div>` : ''}
          </div>
          <div class="challenge-action">
            ${isComplete && !isClaimed
              ? `<button class="btn btn-sm challenge-claim-btn" data-id="${ch.id}">Klaim XP</button>`
              : isComplete && isClaimed
              ? `<span class="challenge-done-check">✅</span>`
              : `<span class="challenge-status-pending">${maxProg > 1 ? pct + '%' : 'Belum'}</span>`
            }
          </div>
        </div>
      `;
    }).join('');

    // Bind claim buttons
    challengeList.querySelectorAll('.challenge-claim-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const r  = ChallengeSystem.claimXP(id);
        if (r) {
          // Toast XP
          if (typeof App !== 'undefined' && App.toastXP) {
            App.toastXP(r.result);
          }
          // Cek all done → konfeti
          const newList = ChallengeSystem.getTodayChallenges();
          const allDone = newList.every(c => c.claimedXP || !c.completed);
          const allComplete = newList.every(c => c.completed && c.claimedXP);
          if (allComplete) launchConfetti();
          renderChallenge();
          renderXP(); // refresh XP bar
        }
      });
    });
  }

  function launchConfetti() {
    const wrap = document.getElementById('confetti-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    const colors = ['#e74c3c','#f39c12','#27ae60','#2980b9','#8e44ad','#f1c40f'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.cssText = [
        'left:' + Math.random() * 100 + '%',
        'background:' + colors[Math.floor(Math.random() * colors.length)],
        'animation-duration:' + (0.8 + Math.random() * 1.2) + 's',
        'animation-delay:' + (Math.random() * 0.4) + 's',
        'width:' + (6 + Math.random() * 6) + 'px',
        'height:' + (6 + Math.random() * 6) + 'px',
        'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
      ].join(';');
      wrap.appendChild(p);
    }
    setTimeout(() => { wrap.innerHTML = ''; }, 2500);
  }

  renderChallenge();

});
