/**
 * NihonHan - Kanji Page JS
 * Filter per level, grid karakter, modal detail, search, progress
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('kanji');

  // Audio
  const _kanji_user = Auth.getActiveUser();
  if (AudioEngine.isSupported()) AudioEngine.init(_kanji_user.id);

  const MODULE_ID = 'kanji';
  let activeLevel  = 'N5';
  let searchQuery  = '';
  let currentKanji = null;
  let showFavOnly  = false;

  // ── Header progress ────────────────────────────────────────
  function updateHeader() {
    const learned  = Progress.getLearned(MODULE_ID);
    const total    = KanjiData.all.length;
    const n5Count  = KanjiData.n5.length;
    const pct      = total > 0 ? Math.round((learned.length / total) * 100) : 0;
    document.getElementById('hdr-pct').textContent = pct + '%';
    document.getElementById('hdr-sub').textContent = learned.length + ' / ' + total + ' hafal';
    // Update per-level bars
    ['N5','N4','N3','N2','N1'].forEach(lvl => {
      const lvlData    = KanjiData.getByLevel(lvl);
      const lvlLearned = lvlData.filter(k => learned.includes(k.char));
      const bar = document.getElementById('lvl-bar-' + lvl);
      const lbl = document.getElementById('lvl-lbl-' + lvl);
      if (bar) bar.style.width = (lvlData.length ? Math.round((lvlLearned.length/lvlData.length)*100) : 0) + '%';
      if (lbl) lbl.textContent = lvlLearned.length + '/' + lvlData.length;
    });
  }

  // ── Level filter tabs ──────────────────────────────────────
  document.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLevel = btn.dataset.level;
      searchQuery = '';
      showFavOnly = false;
      const favFilterBtn = document.getElementById('fav-filter-btn');
      if (favFilterBtn) favFilterBtn.classList.remove('active');
      document.getElementById('kanji-search').value = '';
      renderGrid();
    });
  });

  const favFilterBtn = document.getElementById('fav-filter-btn');
  if (favFilterBtn) {
    favFilterBtn.addEventListener('click', () => {
      showFavOnly = !showFavOnly;
      favFilterBtn.classList.toggle('active', showFavOnly);
      document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
      if (!showFavOnly) document.querySelector('[data-level="N5"]').classList.add('active');
      renderGrid();
    });
  }

  // ── Search ────────────────────────────────────────────────
  const searchInput = document.getElementById('kanji-search');
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderGrid();
  });

  // ── Grid render ───────────────────────────────────────────
  function renderGrid() {
    const grid    = document.getElementById('kanji-grid');
    const learned = Progress.getLearned(MODULE_ID);
    const favs    = Progress.getFavorites(MODULE_ID);

    let data = activeLevel === 'all' ? KanjiData.all : KanjiData.getByLevel(activeLevel);

    if (searchQuery) {
      data = KanjiData.all.filter(k =>
        k.char.includes(searchQuery) ||
        k.meaning.some(m => m.toLowerCase().includes(searchQuery)) ||
        k.romaji ||
        k.onyomi.some(r => r.toLowerCase().includes(searchQuery)) ||
        k.kunyomi.some(r => r.toLowerCase().includes(searchQuery))
      );
    }

    if (showFavOnly) data = data.filter(k => favs.includes(k.char));

    if (data.length === 0) {
      if (showFavOnly) {
        grid.innerHTML = '<div class="kanji-empty"><div class="kanji-empty-icon">★</div><p>Belum ada kanji favorit. Klik ★ pada kartu untuk menandai.</p></div>';
      } else {
        grid.innerHTML = `<div class="kanji-empty"><div class="kanji-empty-icon">漢</div><p>Tidak ada kanji ditemukan.</p></div>`;
      }
      return;
    }

    grid.innerHTML = data.map(k => {
      const isLearned = learned.includes(k.char);
      const isFav = favs.includes(k.char);
      return `
        <div class="kanji-cell${isLearned ? ' learned' : ''}" data-char="${k.char}" title="${k.meaning[0]}">
          <div class="kanji-cell-char cjk">${k.char}</div>
          <div class="kanji-cell-meaning">${k.meaning[0]}</div>
          <div class="kanji-cell-strokes">${k.strokes}str</div>
          ${isLearned ? '<div class="kanji-cell-check">✓</div>' : ''}
          <button class="fav-btn${isFav ? ' active' : ''}" data-fav="${k.char}" title="Favorit">&#9733;</button>
        </div>
      `;
    }).join('');

    // Click handler with fav support
    grid.addEventListener('click', e => {
      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        e.stopPropagation();
        const isNowFav = Progress.toggleFavorite(MODULE_ID, favBtn.dataset.fav);
        favBtn.classList.toggle('active', isNowFav);
        App.toast(isNowFav ? '\u2b50 Ditambahkan ke favorit' : 'Favorit dihapus', 'default', 1400);
        return;
      }
      const cell = e.target.closest('.kanji-cell');
      if (cell) {
        const k = KanjiData.findByChar(cell.dataset.char);
        if (k) openModal(k);
      }
    });

    // Update count
    const countEl = document.getElementById('grid-count');
    if (countEl) countEl.textContent = `${data.length} kanji`;
  }

  // ── Modal ─────────────────────────────────────────────────
  function openModal(k) {
    currentKanji = k;
    const learned  = Progress.getLearned(MODULE_ID);
    const isLearned = learned.includes(k.char);

    document.getElementById('modal-kanji-char').textContent = k.char;
    document.getElementById('modal-kanji-char').className   = 'modal-kanji-char cjk';
    document.getElementById('modal-kanji-level').textContent = k.level;
    document.getElementById('modal-kanji-strokes').textContent = k.strokes + ' stroke';
    document.getElementById('modal-kanji-meaning').textContent = k.meaning.join('、');
    document.getElementById('modal-onyomi').textContent  = k.onyomi.length  ? k.onyomi.join('、')  : '—';
    document.getElementById('modal-kunyomi').textContent = k.kunyomi.length ? k.kunyomi.join('、') : '—';
    document.getElementById('modal-example-word').textContent    = k.example.word;
    document.getElementById('modal-example-reading').textContent = k.example.reading;
    document.getElementById('modal-example-meaning').textContent = k.example.meaning;

    // Stroke widget
    const strokeContainer = document.getElementById('modal-stroke-widget');
    Stroke.render(strokeContainer, k);

    // Mark button
    const markBtn = document.getElementById('modal-mark-btn');
    if (isLearned) {
      markBtn.textContent  = '✓ Sudah Hafal — Hapus';
      markBtn.className    = 'btn btn-ghost btn-sm';
    } else {
      markBtn.textContent  = 'Tandai Hafal';
      markBtn.className    = 'btn btn-primary btn-sm';
    }

    // Audio button
    const modalCharEl = document.getElementById('modal-kanji-char');
    if (AudioEngine.isSupported()) {
      let existingAudioBtn = modalCharEl.nextElementSibling;
      if (existingAudioBtn && existingAudioBtn.classList.contains('audio-btn')) existingAudioBtn.remove();
      const aBtn = document.createElement('button');
      aBtn.className = 'audio-btn audio-btn-lg';
      aBtn.dataset.speak = k.char;
      aBtn.dataset.lang = 'jp';
      aBtn.title = 'Dengar pengucapan';
      aBtn.textContent = '🔊';
      aBtn.addEventListener('click', e => {
        e.stopPropagation();
        AudioEngine.speakJP(k.char);
      });
      // Insert after modal-kanji-char element
      const charRow = modalCharEl.closest('.modal-kanji-char-row') || modalCharEl.parentElement;
      modalCharEl.after(aBtn);

      // Audio for example word
      const exWordEl = document.getElementById('modal-example-word');
      let existingExBtn = exWordEl.nextElementSibling;
      if (existingExBtn && existingExBtn.classList.contains('audio-btn')) existingExBtn.remove();
      const exBtn = document.createElement('button');
      exBtn.className = 'audio-btn audio-btn-sm';
      exBtn.dataset.speak = k.example.word;
      exBtn.dataset.lang = 'jp';
      exBtn.title = 'Dengar contoh kata';
      exBtn.textContent = '🔊';
      exBtn.addEventListener('click', e => {
        e.stopPropagation();
        AudioEngine.speakJP(k.example.word);
      });
      exWordEl.after(exBtn);

      if (AudioEngine.getAutoPlay()) AudioEngine.speakJP(k.char);
    }

    // Fav btn in modal
    const modalFavBtn = document.getElementById('modal-fav-btn');
    if (modalFavBtn) {
      const nowFav = Progress.isFavorite(MODULE_ID, k.char);
      modalFavBtn.classList.toggle('active', nowFav);
      modalFavBtn.title = nowFav ? 'Hapus dari favorit' : 'Tambah ke favorit';
    }

    document.getElementById('kanji-modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('kanji-modal').classList.remove('open');
    currentKanji = null;
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('kanji-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('kanji-modal')) closeModal();
  });

  // Tombol favorit di modal
  const _kModalFavBtn = document.getElementById('modal-fav-btn');
  if (_kModalFavBtn) {
    _kModalFavBtn.addEventListener('click', () => {
      if (!currentKanji) return;
      const isNowFav = Progress.toggleFavorite(MODULE_ID, currentKanji.char);
      _kModalFavBtn.classList.toggle('active', isNowFav);
      _kModalFavBtn.title = isNowFav ? 'Hapus dari favorit' : 'Tambah ke favorit';
      App.toast(isNowFav ? '\u2b50 Ditambahkan ke favorit' : 'Favorit dihapus', 'default', 1400);
      renderGrid();
    });
  }

  document.getElementById('modal-mark-btn').addEventListener('click', () => {
    if (!currentKanji) return;
    if (Progress.isLearned(MODULE_ID, currentKanji.char)) {
      Progress.unmarkLearned(MODULE_ID, currentKanji.char);
      App.toast('Tanda dihapus', 'default', 1500);
    } else {
      Progress.markLearned(MODULE_ID, currentKanji.char);
      App.toast('Ditandai hafal! 🎉', 'success', 2000);
    }
    openModal(currentKanji); // refresh modal
    renderGrid();
    updateHeader();
  });

  // ── Keyboard shortcuts ────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Reset progress ────────────────────────────────────────
  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset semua progress Kanji? Tindakan ini tidak bisa dibatalkan.')) {
        Progress.resetModule(MODULE_ID);
        renderGrid();
        updateHeader();
        App.toast('Progress direset', 'warning', 2000);
      }
    });
  }

  // ── Init ─────────────────────────────────────────────────
  renderGrid();
  updateHeader();

  // ── Tabs (Browse / SRS) ───────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      if (btn.dataset.tab === 'srs') initSrsTab();
    });
  });

  function initSrsTab() {
    SrsUI.init({
      containerId: 'tab-srs',
      moduleId: MODULE_ID,
      items: KanjiData.all,
      getItemId: item => item.char,
      renderFront: item => `
        <div class="srs-char">${item.char}</div>
        <div class="srs-reading" style="font-size:0.8rem;color:var(--text-3);">${item.level}</div>
      `,
      renderBack: item => `
        <div class="srs-reading">${item.meaning ? item.meaning.join('、') : ''}</div>
        <div class="srs-meaning">
          ${item.kunyomi?.length ? '訓: ' + item.kunyomi.join('、') : ''}
          ${item.onyomi?.length ? '  音: ' + item.onyomi.join('、') : ''}
        </div>
        ${item.example ? `<div class="srs-meaning" style="margin-top:6px;">${item.example.word} (${item.example.reading}) — ${item.example.meaning}</div>` : ''}
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.char, 'jp', 'audio-btn') : ''}
      `,
    });
  }
});
