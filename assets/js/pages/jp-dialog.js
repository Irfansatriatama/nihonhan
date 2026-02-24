/**
 * NihonHan — Dialog Bahasa Jepang
 * Fase 17
 */

(function () {
  'use strict';

  App.init('jp-dialog');

  // ── State ───────────────────────────────────────────────
  let activeDialog = null;
  let showRomaji = true;
  let showTranslation = true;
  let currentHighlight = -1;
  let levelFilter = 'all';

  // ── DOM refs ────────────────────────────────────────────
  const listSection   = document.getElementById('dialog-list-section');
  const viewerSection = document.getElementById('dialog-viewer-section');
  const gridEl        = document.getElementById('dialog-grid');
  const filterBar     = document.getElementById('dialog-filter-bar');

  // ── Init ────────────────────────────────────────────────
  function init() {
    renderFilterBar();
    renderGrid();
    bindFilterBar();
    ChallengeSystem && ChallengeSystem.onModuleVisit && ChallengeSystem.onModuleVisit('jp-dialog');
  }

  // ── Filter Bar ──────────────────────────────────────────
  function renderFilterBar() {
    const levels = ['all', 'N5', 'N4'];
    filterBar.innerHTML = levels.map(lv =>
      `<button class="dialog-filter-btn ${lv === levelFilter ? 'active' : ''}" data-level="${lv}">
        ${lv === 'all' ? '🗂️ Semua Level' : '📘 ' + lv}
      </button>`
    ).join('');
  }

  function bindFilterBar() {
    filterBar.addEventListener('click', e => {
      const btn = e.target.closest('.dialog-filter-btn');
      if (!btn) return;
      levelFilter = btn.dataset.level;
      filterBar.querySelectorAll('.dialog-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid();
    });
  }

  // ── Grid ────────────────────────────────────────────────
  function renderGrid() {
    const data = levelFilter === 'all'
      ? JP_DIALOGS
      : JP_DIALOGS.filter(d => d.level === levelFilter);

    gridEl.innerHTML = data.map(dialog => `
      <div class="dialog-card" data-id="${dialog.id}">
        <div class="dialog-card-icon">${dialog.icon}</div>
        <div class="dialog-card-body">
          <div class="dialog-card-title">${dialog.situasi}</div>
          <div class="dialog-card-desc">${dialog.deskripsi}</div>
          <div class="dialog-card-meta">
            <span class="dialog-level-badge">${dialog.level}</span>
            <span class="dialog-lines-count">💬 ${dialog.lines.length} baris</span>
          </div>
        </div>
        <span class="dialog-card-arrow">›</span>
      </div>
    `).join('');

    gridEl.querySelectorAll('.dialog-card').forEach(card => {
      card.addEventListener('click', () => openDialog(card.dataset.id));
    });
  }

  // ── Open Dialog ─────────────────────────────────────────
  function openDialog(id) {
    activeDialog = JP_DIALOGS.find(d => d.id === id);
    if (!activeDialog) return;

    currentHighlight = -1;

    listSection.style.display = 'none';
    viewerSection.classList.add('active');

    renderViewer();
    ChallengeSystem && ChallengeSystem.onLearnItem && ChallengeSystem.onLearnItem('jp-dialog');
    Progress.markLearned && Progress.markLearned('jp-dialog', id);
  }

  function closeViewer() {
    viewerSection.classList.remove('active');
    listSection.style.display = '';
    activeDialog = null;
    currentHighlight = -1;
  }

  // ── Render Viewer ───────────────────────────────────────
  function renderViewer() {
    const d = activeDialog;
    viewerSection.innerHTML = `
      <div class="dialog-viewer-header">
        <button class="dialog-back-btn" id="dialog-back">← Kembali</button>
        <div class="dialog-viewer-title-wrap">
          <span class="dialog-viewer-icon">${d.icon}</span>
          <div class="dialog-viewer-title">${d.situasi}</div>
          <div class="dialog-viewer-desc">${d.deskripsi}</div>
        </div>
        <span class="dialog-level-badge">${d.level}</span>
      </div>

      <div class="dialog-controls">
        <button class="dialog-toggle-btn on" id="toggle-romaji">ローマ字 Romaji</button>
        <button class="dialog-toggle-btn on" id="toggle-trans">🌐 Terjemahan</button>
        <div class="dialog-play-controls">
          <button class="dialog-play-btn" id="btn-prev" disabled>‹ Prev</button>
          <button class="dialog-play-btn" id="btn-next">Mulai ›</button>
        </div>
      </div>

      <div class="dialog-progress-bar">
        <div class="dialog-progress-fill" id="dialog-progress-fill" style="width:0%"></div>
      </div>

      <div class="dialog-lines" id="dialog-lines">
        ${d.lines.map((line, i) => renderLine(line, i)).join('')}
      </div>

      ${renderVocab(d.vocab)}
    `;

    // Bind controls
    document.getElementById('dialog-back').addEventListener('click', closeViewer);
    document.getElementById('toggle-romaji').addEventListener('click', toggleRomaji);
    document.getElementById('toggle-trans').addEventListener('click', toggleTranslation);
    document.getElementById('btn-next').addEventListener('click', stepNext);
    document.getElementById('btn-prev').addEventListener('click', stepPrev);

    // Audio buttons
    viewerSection.querySelectorAll('.dialog-line-audio').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const text = btn.dataset.text;
        if (window.AudioEngine) AudioEngine.speakJP(text);
      });
    });

    // Vocab audio
    viewerSection.querySelectorAll('.dialog-vocab-item').forEach(item => {
      item.addEventListener('click', () => {
        const text = item.dataset.text;
        if (window.AudioEngine) AudioEngine.speakJP(text);
      });
    });
  }

  function renderLine(line, index) {
    const audioBtn = (window.AudioEngine && AudioEngine.isSupported && AudioEngine.isSupported())
      ? `<button class="dialog-line-audio" data-text="${line.jp}" title="Dengar">🔊</button>`
      : '';
    return `
      <div class="dialog-line speaker-${line.speaker.toLowerCase()}" data-index="${index}">
        <div class="dialog-speaker-badge">${line.speaker}</div>
        <div class="dialog-line-content">
          <div class="dialog-line-main">${line.jp}</div>
          <div class="dialog-line-sub dialog-line-pinyin">${line.romaji}</div>
          <div class="dialog-line-trans">${line.id}</div>
        </div>
        ${audioBtn}
      </div>
    `;
  }

  function renderVocab(vocab) {
    if (!vocab || !vocab.length) return '';
    return `
      <div class="dialog-vocab-section">
        <div class="dialog-vocab-title">📚 Kosakata Kunci</div>
        <div class="dialog-vocab-grid">
          ${vocab.map(v => `
            <div class="dialog-vocab-item" data-text="${v.jp}" title="Klik untuk dengar">
              <div class="dialog-vocab-jp">${v.jp}</div>
              <div class="dialog-vocab-reading">${v.romaji}</div>
              <div class="dialog-vocab-meaning">${v.id}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── Playthrough ─────────────────────────────────────────
  function stepNext() {
    const lines = viewerSection.querySelectorAll('.dialog-line');
    const total = activeDialog.lines.length;

    currentHighlight++;
    if (currentHighlight >= total) {
      // Reset to show all
      currentHighlight = -1;
      lines.forEach(l => { l.classList.remove('highlighted', 'dimmed'); });
      document.getElementById('btn-next').textContent = 'Mulai ›';
      document.getElementById('btn-prev').disabled = true;
      document.getElementById('dialog-progress-fill').style.width = '0%';
      return;
    }

    // Highlight current
    lines.forEach((l, i) => {
      l.classList.toggle('highlighted', i === currentHighlight);
      l.classList.toggle('dimmed', i !== currentHighlight);
    });

    // Scroll to line
    lines[currentHighlight].scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto speak
    if (window.AudioEngine && AudioEngine.isSupported && AudioEngine.isSupported()) {
      const text = activeDialog.lines[currentHighlight].jp;
      setTimeout(() => AudioEngine.speakJP(text), 200);
    }

    // Update buttons/progress
    document.getElementById('btn-prev').disabled = false;
    document.getElementById('btn-next').textContent = currentHighlight === total - 1 ? '↩ Ulangi' : 'Lanjut ›';
    document.getElementById('dialog-progress-fill').style.width = `${((currentHighlight + 1) / total) * 100}%`;
  }

  function stepPrev() {
    if (currentHighlight <= 0) return;
    const lines = viewerSection.querySelectorAll('.dialog-line');
    currentHighlight--;
    lines.forEach((l, i) => {
      l.classList.toggle('highlighted', i === currentHighlight);
      l.classList.toggle('dimmed', i !== currentHighlight);
    });
    lines[currentHighlight].scrollIntoView({ behavior: 'smooth', block: 'center' });
    const total = activeDialog.lines.length;
    document.getElementById('btn-prev').disabled = currentHighlight === 0;
    document.getElementById('btn-next').textContent = 'Lanjut ›';
    document.getElementById('dialog-progress-fill').style.width = `${((currentHighlight + 1) / total) * 100}%`;
  }

  // ── Toggles ─────────────────────────────────────────────
  function toggleRomaji() {
    showRomaji = !showRomaji;
    const btn = document.getElementById('toggle-romaji');
    btn.classList.toggle('on', showRomaji);
    viewerSection.querySelectorAll('.dialog-line-sub').forEach(el => {
      el.style.display = showRomaji ? '' : 'none';
    });
  }

  function toggleTranslation() {
    showTranslation = !showTranslation;
    const btn = document.getElementById('toggle-trans');
    btn.classList.toggle('on', showTranslation);
    viewerSection.querySelectorAll('.dialog-line-trans').forEach(el => {
      el.style.display = showTranslation ? '' : 'none';
    });
  }

  // ── Start ───────────────────────────────────────────────
  init();

})();
