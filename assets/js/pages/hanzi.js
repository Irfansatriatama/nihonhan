/**
 * NihonHan - Hanzi Page JS
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('hanzi');

  const MODULE_ID = 'hanzi';
  let activeHsk   = 1;
  let searchQuery = '';
  let currentHanzi = null;

  // Settings integration
  const _user     = Auth.getActiveUser();
  const _settings = Storage.getUser(_user.id, 'settings', { showPinyin: true });
  const showPinyin = _settings.showPinyin !== false;

  // Audio
  if (AudioEngine.isSupported()) AudioEngine.init(_user.id);

  // Count labels
  document.getElementById('cnt-1').textContent = HanziData.hsk1.length;
  document.getElementById('cnt-2').textContent = HanziData.hsk2.length;
  document.getElementById('cnt-3').textContent = HanziData.hsk3.length;

  // ── Header & level bars ────────────────────────────────────
  function updateHeader() {
    const learned = Progress.getLearned(MODULE_ID);
    const total   = HanziData.all.length;
    const pct     = total > 0 ? Math.round((learned.length / total) * 100) : 0;
    document.getElementById('hdr-pct').textContent = pct + '%';
    document.getElementById('hdr-sub').textContent = learned.length + ' / ' + total + ' hafal';

    [1,2,3].forEach(lvl => {
      const lvlData    = HanziData.getByHsk(lvl);
      const lvlLearned = lvlData.filter(h => learned.includes(h.char));
      const bar = document.getElementById('lvl-bar-' + lvl);
      const lbl = document.getElementById('lvl-lbl-' + lvl);
      if (bar) bar.style.width = (lvlData.length ? Math.round((lvlLearned.length/lvlData.length)*100) : 0) + '%';
      if (lbl) lbl.textContent = lvlLearned.length + '/' + lvlData.length;
    });
  }

  // ── HSK filter tabs ────────────────────────────────────────
  document.querySelectorAll('[data-hsk]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-hsk]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeHsk   = parseInt(btn.dataset.hsk);
      searchQuery = '';
      showFavOnly = false;
      const favFilterBtn = document.getElementById('fav-filter-btn');
      if (favFilterBtn) favFilterBtn.classList.remove('active');
      document.getElementById('hanzi-search').value = '';
      renderGrid();
    });
  });

  const favFilterBtn = document.getElementById('fav-filter-btn');
  if (favFilterBtn) {
    favFilterBtn.addEventListener('click', () => {
      showFavOnly = !showFavOnly;
      favFilterBtn.classList.toggle('active', showFavOnly);
      document.querySelectorAll('[data-hsk]').forEach(b => b.classList.remove('active'));
      renderGrid();
    });
  }

  // ── Search ─────────────────────────────────────────────────
  document.getElementById('hanzi-search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderGrid();
  });

  // ── Grid render ────────────────────────────────────────────
  function renderGrid() {
    const grid    = document.getElementById('hanzi-grid');
    const learned = Progress.getLearned(MODULE_ID);
    const favs    = Progress.getFavorites(MODULE_ID);

    let data = searchQuery
      ? HanziData.all.filter(h =>
          h.char.includes(searchQuery) ||
          h.pinyin.toLowerCase().includes(searchQuery) ||
          h.meaning.some(m => m.toLowerCase().includes(searchQuery))
        )
      : HanziData.getByHsk(activeHsk);

    if (showFavOnly) data = data.filter(h => favs.includes(h.char));

    if (data.length === 0) {
      if (showFavOnly) {
        grid.innerHTML = '<div class="zh-empty"><div class="zh-empty-icon">★</div><p>Belum ada hanzi favorit. Klik ★ untuk menandai.</p></div>';
      } else {
        grid.innerHTML = '<div class="zh-empty"><div class="zh-empty-icon">字</div><p>Tidak ada hasil ditemukan.</p></div>';
      }
      document.getElementById('grid-count').textContent = '';
      return;
    }

    grid.innerHTML = data.map(h => {
      const isLearned = learned.includes(h.char);
      const isFav = favs.includes(h.char);
      return `
        <div class="hanzi-cell${isLearned ? ' learned' : ''}" data-char="${h.char}">
          <span class="hanzi-cell-char cjk">${h.char}</span>
          <div class="hanzi-cell-pinyin">${showPinyin ? h.pinyin : ''}</div>
          <div class="hanzi-cell-meaning">${h.meaning[0]}</div>
          ${isLearned ? '<div class="hanzi-cell-check">\u2713</div>' : ''}
          ${AudioEngine.isSupported() ? AudioEngine.btnHTML(h.char, 'zh', 'audio-btn-sm') : ''}
          <button class="fav-btn${isFav ? ' active' : ''}" data-fav="${h.char}" title="Favorit">&#9733;</button>
        </div>
      `;
    }).join('');

    document.getElementById('grid-count').textContent = data.length + ' karakter';

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
      const cell = e.target.closest('.hanzi-cell');
      if (cell) {
        const h = HanziData.findByChar(cell.dataset.char);
        if (h) openModal(h);
      }
    });
  }

  // ── Modal ─────────────────────────────────────────────────
  function openModal(h) {
    currentHanzi = h;
    const learned   = Progress.getLearned(MODULE_ID);
    const isLearned = learned.includes(h.char);

    document.getElementById('hm-char').textContent        = h.char;
    document.getElementById('hm-hsk').textContent         = 'HSK ' + h.hsk;
    document.getElementById('hm-hsk').className           = 'hsk-badge hsk-' + h.hsk;
    document.getElementById('hm-strokes').textContent     = h.strokes ? h.strokes + ' stroke' : '';
    document.getElementById('hm-pinyin').textContent      = h.pinyin;
    document.getElementById('hm-meaning').textContent     = h.meaning.join(' / ');
    document.getElementById('hm-ex-sentence').textContent = h.example.sentence;
    document.getElementById('hm-ex-pinyin').textContent   = h.example.pinyin;
    document.getElementById('hm-ex-meaning').textContent  = h.example.meaning;

    const markBtn = document.getElementById('hm-mark-btn');
    if (isLearned) {
      markBtn.textContent = '✓ Hafal — Hapus';
      markBtn.className   = 'btn btn-ghost btn-sm';
    } else {
      markBtn.textContent = 'Tandai Hafal';
      markBtn.className   = 'btn btn-primary btn-sm';
    }

    // Audio buttons
    if (AudioEngine.isSupported()) {
      const charEl = document.getElementById('hm-char');
      let oldBtn = charEl.nextElementSibling;
      if (oldBtn && oldBtn.classList.contains('audio-btn')) oldBtn.remove();
      const aBtn = document.createElement('button');
      aBtn.className = 'audio-btn audio-btn-lg';
      aBtn.textContent = '🔊';
      aBtn.title = 'Dengar pengucapan';
      aBtn.addEventListener('click', e => { e.stopPropagation(); AudioEngine.speakZH(h.char); });
      charEl.after(aBtn);

      const exEl = document.getElementById('hm-ex-sentence');
      let oldExBtn = exEl.nextElementSibling;
      if (oldExBtn && oldExBtn.classList.contains('audio-btn')) oldExBtn.remove();
      const exBtn = document.createElement('button');
      exBtn.className = 'audio-btn audio-btn-sm';
      exBtn.textContent = '🔊';
      exBtn.title = 'Dengar contoh kalimat';
      exBtn.addEventListener('click', e => { e.stopPropagation(); AudioEngine.speakZH(h.example.sentence); });
      exEl.after(exBtn);

      if (AudioEngine.getAutoPlay()) AudioEngine.speakZH(h.char);
    }

    // Fav btn in modal
    const modalFavBtn = document.getElementById('modal-fav-btn');
    if (modalFavBtn) {
      const nowFav = Progress.isFavorite(MODULE_ID, h.char);
      modalFavBtn.classList.toggle('active', nowFav);
      modalFavBtn.title = nowFav ? 'Hapus dari favorit' : 'Tambah ke favorit';
    }

    document.getElementById('hanzi-modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('hanzi-modal').classList.remove('open');
    currentHanzi = null;
  }

  document.getElementById('hm-close').addEventListener('click', closeModal);
  document.getElementById('hm-close-btn').addEventListener('click', closeModal);
  document.getElementById('hanzi-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('hanzi-modal')) closeModal();
  });

  // Modal fav button
  const _hModalFavBtn = document.getElementById('modal-fav-btn');
  if (_hModalFavBtn) {
    _hModalFavBtn.addEventListener('click', () => {
      if (!currentHanzi) return;
      const isNowFav = Progress.toggleFavorite(MODULE_ID, currentHanzi.char);
      _hModalFavBtn.classList.toggle('active', isNowFav);
      _hModalFavBtn.title = isNowFav ? 'Hapus dari favorit' : 'Tambah ke favorit';
      App.toast(isNowFav ? '\u2b50 Ditambahkan ke favorit' : 'Favorit dihapus', 'default', 1400);
      renderGrid();
    });
  }

  document.getElementById('hm-mark-btn').addEventListener('click', () => {
    if (!currentHanzi) return;
    if (Progress.isLearned(MODULE_ID, currentHanzi.char)) {
      Progress.unmarkLearned(MODULE_ID, currentHanzi.char);
      App.toast('Tanda dihapus', 'default', 1500);
    } else {
      Progress.markLearned(MODULE_ID, currentHanzi.char);
      App.toast('Ditandai hafal! 🎉', 'success', 2000);
    }
    openModal(currentHanzi);
    renderGrid();
    updateHeader();
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset semua progress Hanzi?')) {
      Progress.resetModule(MODULE_ID);
      renderGrid();
      updateHeader();
      App.toast('Progress direset', 'warning', 2000);
    }
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

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
      items: HanziData.all,
      getItemId: item => item.char,
      renderFront: item => `
        <div class="srs-char">${item.char}</div>
        <div class="srs-reading" style="font-size:0.8rem;color:var(--text-3);">HSK ${item.hsk}</div>
      `,
      renderBack: item => `
        <div class="srs-reading">${item.pinyin}</div>
        <div class="srs-meaning">${Array.isArray(item.meaning) ? item.meaning.join(', ') : item.meaning}</div>
        ${item.example ? `<div class="srs-meaning" style="margin-top:6px;font-size:0.85rem;">${item.example.sentence}<br><span style="color:var(--text-3)">${item.example.meaning}</span></div>` : ''}
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.char, 'zh', 'audio-btn') : ''}
      `,
    });
  }
});
