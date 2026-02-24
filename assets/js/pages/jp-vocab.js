/**
 * NihonHan - Japanese Vocabulary Page JS (Fase 8)
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('jp-vocab');

  const MODULE_ID  = 'jp-vocab';
  let activeTheme  = 'all';
  let activeLevel  = 'all';
  let showFavOnly  = false;
  let searchQuery  = '';

  // Load settings
  const user     = Auth.getActiveUser();
  const settings = Storage.getUser(user.id, 'settings', { showRomaji: true });

  // Audio
  if (AudioEngine.isSupported()) AudioEngine.init(user.id);

  // ── Header ─────────────────────────────────────────────────
  function updateHeader() {
    const learned = Progress.getLearned(MODULE_ID);
    const total   = JpVocabData.vocab.length;
    const pct     = total > 0 ? Math.round((learned.length / total) * 100) : 0;
    document.getElementById('hdr-pct').textContent = pct + '%';
    document.getElementById('hdr-sub').textContent = learned.length + ' / ' + total + ' hafal';
  }

  updateHeader();

  // ── Theme tabs ─────────────────────────────────────────────
  function renderThemeTabs() {
    const container = document.getElementById('theme-tabs');
    const allCount  = getFiltered('all', activeLevel).length;
    const allBtn    = `<button class="theme-tab active" data-theme="all">Semua (${allCount})</button>`;
    const themeBtns = JpVocabData.themes.map(t => {
      const count = JpVocabData.getByTheme(t.id).length;
      return `<button class="theme-tab" data-theme="${t.id}">${t.icon} ${t.label} (${count})</button>`;
    }).join('');
    container.innerHTML = allBtn + themeBtns;

    container.querySelectorAll('.theme-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.theme-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTheme = btn.dataset.theme;
        searchQuery = '';
        document.getElementById('vocab-search').value = '';
        renderGrid();
      });
    });
  }

  renderThemeTabs();

  // ── Level filter ───────────────────────────────────────────
  document.querySelectorAll('.filter-level').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-level').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLevel = btn.dataset.level;
      renderGrid();
    });
  });

  // ── Search ─────────────────────────────────────────────────
  document.getElementById('vocab-search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    if (searchQuery) {
      document.querySelectorAll('.theme-tab').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-theme="all"]').classList.add('active');
      activeTheme = 'all';
    }
    renderGrid();
  });

  // ── Reset ──────────────────────────────────────────────────
  document.getElementById('reset-btn').addEventListener('click', () => {
    searchQuery = '';
    activeTheme = 'all';
    activeLevel = 'all';
    document.getElementById('vocab-search').value = '';
    document.querySelectorAll('.theme-tab').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-theme="all"]').classList.add('active');
    document.querySelectorAll('.filter-level').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-level="all"]').classList.add('active');
    renderGrid();
  });

  const favFilterBtn = document.getElementById('fav-filter-btn');
  if (favFilterBtn) {
    favFilterBtn.addEventListener('click', () => {
      showFavOnly = !showFavOnly;
      favFilterBtn.classList.toggle('active', showFavOnly);
      if (showFavOnly) {
        document.querySelectorAll('.filter-level').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-level[data-level="all"]').classList.add('active');
        activeLevel = 'all';
      }
      renderGrid();
    });
  }

  // ── Filter helper ──────────────────────────────────────────
  function getFiltered(theme, level) {
    let data = theme === 'all' ? JpVocabData.vocab : JpVocabData.getByTheme(theme);
    if (level !== 'all') data = data.filter(v => v.level === level);
    return data;
  }

  // ── Grid render ────────────────────────────────────────────
  function renderGrid() {
    const grid    = document.getElementById('vocab-grid');
    const learned = Progress.getLearned(MODULE_ID);
    const favs    = Progress.getFavorites(MODULE_ID);
    const showRomaji = settings.showRomaji !== false;

    let data = searchQuery
      ? JpVocabData.search(searchQuery)
      : getFiltered(activeTheme, activeLevel);

    // Apply level filter to search results too
    if (searchQuery && activeLevel !== 'all') {
      data = data.filter(v => v.level === activeLevel);
    }

    if (showFavOnly) data = data.filter(v => favs.includes(v.word));

    document.getElementById('grid-count').textContent = data.length + ' kata';

    if (data.length === 0) {
      if (showFavOnly) {
        grid.innerHTML = '<div class="zh-empty"><div class="zh-empty-icon">★</div><p>Belum ada kosakata favorit. Klik ★ pada kartu untuk menandai.</p></div>';
      } else {
        grid.innerHTML = '<div class="zh-empty"><div class="zh-empty-icon">語</div><p>Tidak ada kata ditemukan.</p></div>';
      }
      return;
    }

    grid.innerHTML = data.map(v => {
      const isLearned = learned.includes(v.word);
      const isFav = favs.includes(v.word);
      const levelBadge = v.level === 'N5' ? 'badge-red' : v.level === 'N4' ? 'badge-gold' : 'badge-gray';
      return `
        <div class="vocab-card${isLearned ? ' learned' : ''}" data-word="${v.word}" data-reading="${v.reading}" data-romaji="${v.romaji}" data-meaning="${v.meaning}" data-theme="${v.theme}" data-level="${v.level}">
          ${isLearned ? '<div class="vocab-card-check">&#10003; Hafal</div>' : ''}
          <button class="fav-btn${isFav ? ' active' : ''}" data-fav="${v.word}" title="Favorit">&#9733;</button>
          <div class="vocab-card-top">
            <div class="vocab-word cjk">${v.word}</div>
            <span class="badge ${levelBadge}" style="font-size:0.65rem">${v.level}</span>
            ${AudioEngine.isSupported() ? AudioEngine.btnHTML(v.word, 'jp', 'audio-btn-sm') : ''}
          </div>
          ${showRomaji ? `<div class="vocab-pinyin">${v.reading} \u00b7 ${v.romaji}</div>` : `<div class="vocab-pinyin">${v.reading}</div>`}
          <div class="vocab-meaning">${v.meaning}</div>
          <div class="vocab-example">
            <div class="vocab-example-jp">${v.example.jp}</div>
            <div class="vocab-example-tr">${v.example.id}</div>
          </div>
        </div>
      `;
    }).join('');

    // Click handler (audio, fav, learned)
    grid.addEventListener('click', e => {
      const aBtn = e.target.closest('.audio-btn');
      if (aBtn) {
        e.stopPropagation();
        AudioEngine.speakJP(aBtn.dataset.speak);
        return;
      }
      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        e.stopPropagation();
        const isNowFav = Progress.toggleFavorite(MODULE_ID, favBtn.dataset.fav);
        favBtn.classList.toggle('active', isNowFav);
        App.toast(isNowFav ? '\u2b50 Ditambahkan ke favorit' : 'Favorit dihapus', 'default', 1400);
        return;
      }
      const card = e.target.closest('.vocab-card');
      if (card) {
        const word = card.dataset.word;
        const wasLearned = Progress.isLearned(MODULE_ID, word);
        if (wasLearned) {
          Progress.unmarkLearned(MODULE_ID, word);
          card.classList.remove('learned');
          const check = card.querySelector('.vocab-card-check');
          if (check) check.remove();
        } else {
          Progress.markLearned(MODULE_ID, word);
          card.classList.add('learned');
          const checkEl = document.createElement('div');
          checkEl.className = 'vocab-card-check';
          checkEl.textContent = '\u2713 Hafal';
          card.prepend(checkEl);
        }
        updateHeader();
      }
    });
  }

  renderGrid();

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
      items: JpVocabData.vocab,
      getItemId: item => item.word,
      renderFront: item => `
        <div class="srs-char" style="font-size:2rem;">${item.word}</div>
        <div class="srs-reading" style="font-size:0.78rem;color:var(--text-3);">${item.level}</div>
      `,
      renderBack: item => `
        <div class="srs-reading">${item.reading} (${item.romaji})</div>
        <div class="srs-meaning">${item.meaning}</div>
        ${item.example ? `<div class="srs-meaning" style="margin-top:6px;font-size:0.85rem;">${item.example.jp}<br><span style="color:var(--text-3)">${item.example.id}</span></div>` : ''}
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.word, 'jp', 'audio-btn') : ''}
      `,
    });
  }
});
