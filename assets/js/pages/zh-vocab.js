/**
 * NihonHan - Mandarin Vocabulary Page JS
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('zh-vocab');

  const _zhvocab_user = Auth.getActiveUser();
  if (AudioEngine.isSupported()) AudioEngine.init(_zhvocab_user.id);

  const MODULE_ID  = 'zh-vocab';
  let activeTheme  = 'all';
  let searchQuery  = '';
  let showFavOnly  = false;

  // ── Header ─────────────────────────────────────────────────
  function updateHeader() {
    const learned = Progress.getLearned(MODULE_ID);
    const total   = ZhVocabData.vocab.length;
    const pct     = total > 0 ? Math.round((learned.length / total) * 100) : 0;
    document.getElementById('hdr-pct').textContent = pct + '%';
    document.getElementById('hdr-sub').textContent = learned.length + ' / ' + total + ' hafal';
  }

  // ── Theme tabs ─────────────────────────────────────────────
  function renderThemeTabs() {
    const container = document.getElementById('theme-tabs');
    const allBtn    = `<button class="theme-tab active" data-theme="all">Semua (${ZhVocabData.vocab.length})</button>`;
    const themeBtns = ZhVocabData.themes.map(t => {
      const count = ZhVocabData.getByTheme(t.id).length;
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

  // ── Grid render ────────────────────────────────────────────
  function renderGrid() {
    const grid    = document.getElementById('vocab-grid');
    const learned = Progress.getLearned(MODULE_ID);
    const favs    = Progress.getFavorites(MODULE_ID);

    let data = searchQuery
      ? ZhVocabData.search(searchQuery)
      : (activeTheme === 'all' ? ZhVocabData.vocab : ZhVocabData.getByTheme(activeTheme));

    if (showFavOnly) data = data.filter(v => favs.includes(v.word));

    document.getElementById('grid-count').textContent = data.length + ' kata';

    if (data.length === 0) {
      if (showFavOnly) {
        grid.innerHTML = '<div class="zh-empty"><div class="zh-empty-icon">★</div><p>Belum ada kosakata favorit. Klik ★ untuk menandai.</p></div>';
      } else {
        grid.innerHTML = '<div class="zh-empty"><div class="zh-empty-icon">\u8bcd</div><p>Tidak ada kata ditemukan.</p></div>';
      }
      return;
    }

    grid.innerHTML = data.map(v => {
      const isLearned = learned.includes(v.word);
      const isFav = favs.includes(v.word);
      return `
        <div class="vocab-card${isLearned ? ' learned' : ''}" data-word="${v.word}">
          ${isLearned ? '<div class="vocab-card-check">\u2713 Hafal</div>' : ''}
          <button class="fav-btn${isFav ? ' active' : ''}" data-fav="${v.word}" title="Favorit">&#9733;</button>
          <div class="vocab-card-top">
            <div class="vocab-word cjk">${v.word}</div>
            <div class="vocab-pinyin">${v.pinyin}</div>
            ${AudioEngine.isSupported() ? AudioEngine.btnHTML(v.word, 'zh', 'audio-btn-sm') : ''}
          </div>
          <div class="vocab-meaning">${v.meaning}</div>
          <div class="vocab-example">
            <div class="vocab-ex-sentence cjk">${v.example.sentence}</div>
            <div class="vocab-ex-meaning">${v.example.meaning}</div>
          </div>
        </div>
      `;
    }).join('');

    // Click delegation
    grid.addEventListener('click', e => {
      const aBtn = e.target.closest('.audio-btn');
      if (aBtn) {
        e.stopPropagation();
        AudioEngine.speakZH(aBtn.dataset.speak);
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
        const v    = ZhVocabData.vocab.find(x => x.word === word);
        if (!v) return;
        if (Progress.isLearned(MODULE_ID, v.word)) {
          Progress.unmarkLearned(MODULE_ID, v.word);
          App.toast('Tanda dihapus', 'default', 1500);
        } else {
          Progress.markLearned(MODULE_ID, v.word);
          App.toast('Ditandai hafal! \U0001F389', 'success', 2000);
        }
        renderGrid();
        updateHeader();
      }
    });
  }

  // ── Reset ─────────────────────────────────────────────────
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset semua progress Kosakata Mandarin?')) {
      Progress.resetModule(MODULE_ID);
      renderGrid();
      updateHeader();
      App.toast('Progress direset', 'warning', 2000);
    }
  });

  const favFilterBtn = document.getElementById('fav-filter-btn');
  if (favFilterBtn) {
    favFilterBtn.addEventListener('click', () => {
      showFavOnly = !showFavOnly;
      favFilterBtn.classList.toggle('active', showFavOnly);
      if (showFavOnly) {
        document.querySelectorAll('.theme-tab').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-theme="all"]').classList.add('active');
        activeTheme = 'all';
      }
      renderGrid();
    });
  }

  // ── Init ─────────────────────────────────────────────────
  renderThemeTabs();
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
      items: ZhVocabData.vocab,
      getItemId: item => item.word,
      renderFront: item => `
        <div class="srs-char" style="font-size:2rem;">${item.word}</div>
      `,
      renderBack: item => `
        <div class="srs-reading">${item.pinyin}</div>
        <div class="srs-meaning">${item.meaning}</div>
        ${item.example ? `<div class="srs-meaning" style="margin-top:6px;font-size:0.85rem;">${item.example.sentence || item.example.zh || ''}<br><span style="color:var(--text-3)">${item.example.meaning || item.example.id || ''}</span></div>` : ''}
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.word, 'zh', 'audio-btn') : ''}
      `,
    });
  }
});
