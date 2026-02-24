/**
 * NihonHan - Hiragana Page JS
 * Tabel karakter, flashcard, quiz mini
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('hiragana');

  const MODULE_ID = 'hiragana';
  const TOTAL     = HiraganaData.all.length; // 104
  let currentChar = null;
  let fcInstance  = null;
  let activeFilter = 'all';
  let activeTab    = 'table';
  let showFavOnly  = false;

  // Settings integration
  const _user     = Auth.getActiveUser();
  const _settings = Storage.getUser(_user.id, 'settings', { showRomaji: true });
  const showRomaji = _settings.showRomaji !== false;

  // Audio
  if (AudioEngine.isSupported()) AudioEngine.init(_user.id);

  // ── Header progress ──────────────────────────────────────
  function updateHeader() {
    const learned = Progress.getLearned(MODULE_ID);
    const pct     = Math.round((learned.length / TOTAL) * 100);
    document.getElementById('hdr-pct').textContent = pct + '%';
    document.getElementById('hdr-sub').textContent = learned.length + ' / ' + TOTAL + ' hafal';
  }

  updateHeader();

  // ── Tabs ─────────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      activeTab = tab;

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');

      if (tab === 'flashcard') initFlashcard('all');
      if (tab === 'quiz')      initQuizMini();
      if (tab === 'srs')       initSrsTab();

      // Destroy flashcard keyboard listener when not on flashcard tab
      if (tab !== 'flashcard' && fcInstance) {
        fcInstance.destroy();
        fcInstance = null;
      }
    });
  });

  // ── TABLE TAB ────────────────────────────────────────────
  function renderGrid(filter) {
    activeFilter = filter;
    let data = filter === 'all' ? HiraganaData.all
      : HiraganaData.all.filter(c => c.type === filter);

    const learned = Progress.getLearned(MODULE_ID);
    const favs    = Progress.getFavorites(MODULE_ID);

    if (showFavOnly) data = data.filter(c => favs.includes(c.char));

    const grid = document.getElementById('char-grid');

    if (data.length === 0 && showFavOnly) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text-3)">Belum ada favorit. Klik ★ pada karakter untuk menandai.</div>';
      return;
    }

    grid.innerHTML = data.map(c => `
      <div class="char-cell${learned.includes(c.char) ? ' learned' : ''}"
           data-char="${c.char}" title="${c.romaji}">
        <div class="char-main cjk">${c.char}</div>
        ${showRomaji ? `<div class="char-romaji">${c.romaji}</div>` : ''}
        <button class="fav-btn${favs.includes(c.char) ? ' active' : ''}" data-fav="${c.char}" title="Favorit">&#9733;</button>
      </div>
    `).join('');

    grid.addEventListener('click', e => {
      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        e.stopPropagation();
        const isNowFav = Progress.toggleFavorite(MODULE_ID, favBtn.dataset.fav);
        favBtn.classList.toggle('active', isNowFav);
        App.toast(isNowFav ? '⭐ Ditambahkan ke favorit' : 'Favorit dihapus', 'default', 1400);
        return;
      }
      const cell = e.target.closest('.char-cell');
      if (!cell) return;
      const charData = HiraganaData.all.find(c => c.char === cell.dataset.char);
      if (charData) openModal(charData);
    });
  }

  renderGrid('all');

  // Filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showFavOnly = false;
      const favFilterBtn = document.getElementById('fav-filter-btn');
      if (favFilterBtn) favFilterBtn.classList.remove('active');
      renderGrid(btn.dataset.filter);
    });
  });

  // Favorit filter button
  const favFilterBtn = document.getElementById('fav-filter-btn');
  if (favFilterBtn) {
    favFilterBtn.addEventListener('click', () => {
      showFavOnly = !showFavOnly;
      favFilterBtn.classList.toggle('active', showFavOnly);
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      if (!showFavOnly) document.querySelector('[data-filter="all"]').classList.add('active');
      renderGrid(activeFilter);
    });
  }

  // ── MODAL ────────────────────────────────────────────────
  function openModal(charData) {
    currentChar = charData;
    const isLearned = Progress.isLearned(MODULE_ID, charData.char);
    const markBtn   = document.getElementById('modal-mark-btn');

    const _audioBtn = AudioEngine.isSupported()
      ? `<div style="margin:8px 0">${AudioEngine.btnHTML(charData.char, 'jp', 'audio-btn-lg')}</div>`
      : '';
    const _exAudioBtn = AudioEngine.isSupported()
      ? AudioEngine.btnHTML(charData.example.word, 'jp', 'audio-btn-sm')
      : '';

    document.getElementById('modal-content').innerHTML = `
      <span class="char-detail-big cjk">${charData.char}</span>
      ${_audioBtn}
      <div class="char-detail-romaji">${charData.romaji}</div>
      <span class="char-detail-type">
        <span class="badge ${charData.type === 'basic' ? 'badge-red' : charData.type === 'dakuten' ? 'badge-gold' : 'badge-gray'}">
          ${charData.type === 'basic' ? 'Dasar' : charData.type === 'dakuten' ? 'Dakuten' : 'Kombinasi'}
        </span>
      </span>
      <div class="char-detail-example">
        <div class="ex-label">Contoh Kata ${_exAudioBtn}</div>
        <span class="ex-word cjk">${charData.example.word}</span>
        <div class="ex-reading">${charData.example.reading}</div>
        <div class="ex-meaning">${charData.example.meaning}</div>
      </div>
    `;

    // Bind audio buttons di modal
    document.getElementById('modal-content').querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        AudioEngine.speakJP(btn.dataset.speak);
      });
    });

    if (AudioEngine.isSupported() && AudioEngine.getAutoPlay()) {
      AudioEngine.speakJP(charData.char);
    }

    markBtn.textContent = isLearned ? 'Hapus Tanda' : 'Tandai Hafal';
    markBtn.className   = isLearned ? 'btn btn-ghost btn-sm' : 'btn btn-outline btn-sm';

    // Fav button in modal header
    const modalFavBtn = document.getElementById('modal-fav-btn');
    if (modalFavBtn) {
      const nowFav = Progress.isFavorite(MODULE_ID, charData.char);
      modalFavBtn.classList.toggle('active', nowFav);
      modalFavBtn.title = nowFav ? 'Hapus dari favorit' : 'Tambah ke favorit';
    }

    document.getElementById('char-modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('char-modal').classList.remove('open');
    currentChar = null;
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('char-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('modal-mark-btn').addEventListener('click', () => {
    if (!currentChar) return;
    const isLearned = Progress.isLearned(MODULE_ID, currentChar.char);
    if (isLearned) {
      Progress.unmarkLearned(MODULE_ID, currentChar.char);
      App.toast('Tanda dihapus', 'default', 1500);
    } else {
      Progress.markLearned(MODULE_ID, currentChar.char);
      App.toast('Ditandai hafal!', 'success', 1500);
    }
    updateHeader();
    renderGrid(activeFilter);
    // Update modal button
    const markBtn = document.getElementById('modal-mark-btn');
    const nowLearned = Progress.isLearned(MODULE_ID, currentChar.char);
    markBtn.textContent = nowLearned ? 'Hapus Tanda' : 'Tandai Hafal';
    markBtn.className   = nowLearned ? 'btn btn-ghost btn-sm' : 'btn btn-outline btn-sm';
  });

  // Tombol favorit di modal
  const _modalFavBtn = document.getElementById('modal-fav-btn');
  if (_modalFavBtn) {
    _modalFavBtn.addEventListener('click', () => {
      if (!currentChar) return;
      const isNowFav = Progress.toggleFavorite(MODULE_ID, currentChar.char);
      _modalFavBtn.classList.toggle('active', isNowFav);
      _modalFavBtn.title = isNowFav ? 'Hapus dari favorit' : 'Tambah ke favorit';
      App.toast(isNowFav ? '\u2b50 Ditambahkan ke favorit' : 'Favorit dihapus', 'default', 1400);
      renderGrid(activeFilter);
    });
  }

  // ── FLASHCARD TAB ─────────────────────────────────────────
  function initFlashcard(filter) {
    if (fcInstance) { fcInstance.destroy(); fcInstance = null; }

    let data = HiraganaData.all;
    if (filter === 'basic')    data = HiraganaData.basic;
    if (filter === 'dakuten')  data = HiraganaData.dakuten;
    if (filter === 'yoon')     data = HiraganaData.yoon;
    if (filter === 'unlearned') {
      const learned = Progress.getLearned(MODULE_ID);
      data = HiraganaData.all.filter(c => !learned.includes(c.char));
      if (data.length === 0) {
        document.getElementById('flashcard-container').innerHTML =
          '<div class="empty-state"><p>Semua karakter sudah ditandai hafal!</p></div>';
        return;
      }
    }
    if (filter === 'favorites') {
      const favs = Progress.getFavorites(MODULE_ID);
      data = HiraganaData.all.filter(c => favs.includes(c.char));
      if (data.length === 0) {
        document.getElementById('flashcard-container').innerHTML =
          '<div class="empty-state"><p>Belum ada karakter favorit.</p></div>';
        return;
      }
    }

    fcInstance = new Flashcard({
      container: document.getElementById('flashcard-container'),
      data,
      moduleId:  MODULE_ID,
      onProgress: () => { updateHeader(); renderGrid(activeFilter); },
    });
  }

  document.querySelectorAll('[data-fcfilter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-fcfilter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      initFlashcard(btn.dataset.fcfilter);
    });
  });

  // ── QUIZ MINI ─────────────────────────────────────────────
  function initQuizMini() {
    const container = document.getElementById('quiz-mini-container');
    const pool      = [...HiraganaData.all];
    let score = 0, total = 0, answered = false;

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function getChoices(correct) {
      const wrong = shuffle(pool.filter(c => c.char !== correct.char)).slice(0, 3);
      return shuffle([correct, ...wrong]);
    }

    function renderQuestion() {
      answered = false;
      const correct  = pool[Math.floor(Math.random() * pool.length)];
      const choices  = getChoices(correct);

      container.innerHTML = `
        <div class="qm-question">
          <span class="qm-char cjk">${correct.char}</span>
          <div class="qm-prompt">Pilih romaji yang benar</div>
        </div>
        <div class="qm-choices">
          ${choices.map(c => `
            <button class="qm-choice" data-char="${c.char}" data-romaji="${c.romaji}">
              ${c.romaji}
            </button>`).join('')}
        </div>
        <div class="qm-score">
          <span>Benar: ${score}</span>
          <span>Total: ${total}</span>
          <span>Akurasi: ${total > 0 ? Math.round((score/total)*100) : 0}%</span>
        </div>
      `;

      container.querySelectorAll('.qm-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          total++;
          const isCorrect = btn.dataset.char === correct.char;
          if (isCorrect) score++;

          btn.classList.add(isCorrect ? 'correct' : 'wrong');
          if (!isCorrect) {
            container.querySelectorAll('.qm-choice').forEach(b => {
              if (b.dataset.char === correct.char) b.classList.add('correct');
            });
          }
          container.querySelectorAll('.qm-choice').forEach(b => b.disabled = true);

          if (isCorrect) {
            Progress.markLearned(MODULE_ID, correct.char);
            updateHeader();
            renderGrid(activeFilter);
          }
          if (isCorrect) Progress.saveQuizScore(MODULE_ID, { score: 1, total: 1 });
          else           Progress.saveQuizScore(MODULE_ID, { score: 0, total: 1 });

          // Feedback + next
          const fb = document.createElement('div');
          fb.className = 'qm-feedback ' + (isCorrect ? 'correct' : 'wrong');
          fb.textContent = isCorrect ? 'Benar!' : `Salah. Jawaban: ${correct.romaji}`;
          container.querySelector('.qm-choices').after(fb);

          setTimeout(() => renderQuestion(), 1400);
        });
      });
    }

    renderQuestion();
  }

  // ── SRS TAB ──────────────────────────────────────────────
  function initSrsTab() {
    SrsUI.init({
      containerId: 'tab-srs',
      moduleId: MODULE_ID,
      items: HiraganaData.all,
      getItemId: item => item.char,
      renderFront: item => `
        <div class="srs-char">${item.char}</div>
      `,
      renderBack: item => `
        <div class="srs-reading">${item.romaji}</div>
        <div class="srs-meaning">
          ${item.example ? `${item.example.word} — ${item.example.meaning}` : ''}
        </div>
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.char, 'jp', 'audio-btn') : ''}
      `,
    });
  }

});
