/**
 * NihonHan - SRS UI Module (Fase 11)
 * Reusable SRS session renderer.
 * Dipakai oleh halaman: hiragana, katakana, kanji, jp-vocab, hanzi, zh-vocab
 *
 * Usage:
 *   SrsUI.init({
 *     containerId: 'tab-srs',
 *     moduleId: 'hiragana',
 *     items: [...],       // array item data
 *     getItemId: item => item.char,
 *     renderFront: item => '<span class="cjk">'+item.char+'</span>',
 *     renderBack: item => '<div>...</div>',
 *   });
 */
const SrsUI = (() => {

  /**
   * Inisialisasi SRS session di dalam container.
   * @param {Object} opts
   */
  function init(opts) {
    const {
      containerId,
      moduleId,
      items,
      getItemId,
      renderFront,   // fn(item) → HTML string (sisi depan kartu)
      renderBack,    // fn(item) → HTML string (sisi belakang, ditampilkan setelah reveal)
    } = opts;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Build queue: prioritaskan due items, tambah new items
    const dueIds  = SRS.getDueIds(moduleId);
    const allIds  = items.map(getItemId);
    const newIds  = allIds.filter(id => SRS.isNew(moduleId, id));

    // Queue: due first, then new (max 20 new per session)
    const queue = [
      ...items.filter(it => dueIds.includes(getItemId(it))),
      ...items.filter(it => newIds.slice(0, 20).includes(getItemId(it))),
    ];

    // Render stats bar
    const stats = SRS.getModuleStats(moduleId);
    _renderStats(container, moduleId, stats, newIds.length, queue.length);

    if (queue.length === 0) {
      _renderEmpty(container);
      return;
    }

    _runSession(container, moduleId, queue, getItemId, renderFront, renderBack);
  }

  // ── Private ────────────────────────────────────────────────

  function _renderStats(container, moduleId, stats, newCount, queueLen) {
    const statsEl = container.querySelector('.srs-stats-bar') || (() => {
      const el = document.createElement('div');
      el.className = 'srs-stats-bar';
      container.prepend(el);
      return el;
    })();

    statsEl.innerHTML = `
      <div class="srs-stat-chip due">
        <span class="chip-icon">📅</span>
        <span>${stats.due} jatuh tempo</span>
      </div>
      <div class="srs-stat-chip learn">
        <span class="chip-icon">📖</span>
        <span>${newCount} baru</span>
      </div>
      <div class="srs-stat-chip master">
        <span class="chip-icon">🏆</span>
        <span>${stats.mastered} dikuasai</span>
      </div>
    `;
  }

  function _renderEmpty(container) {
    // Stats already rendered above
    let main = container.querySelector('.srs-main');
    if (!main) { main = document.createElement('div'); main.className = 'srs-main'; container.appendChild(main); }
    main.innerHTML = `
      <div class="srs-done-wrap">
        <div class="srs-done-icon">🎉</div>
        <div class="srs-done-title">Semua Beres!</div>
        <div class="srs-done-sub">Tidak ada kartu yang perlu diulang sekarang.<br>Kembali besok untuk sesi berikutnya.</div>
      </div>
    `;
  }

  function _runSession(container, moduleId, queue, getItemId, renderFront, renderBack) {
    let index = 0;
    let revealed = false;
    const total = queue.length;

    let main = container.querySelector('.srs-main');
    if (!main) { main = document.createElement('div'); main.className = 'srs-main'; container.appendChild(main); }

    function renderCard() {
      if (index >= queue.length) {
        _renderDone(main, total, moduleId);
        _refreshStats(container, moduleId, queue, getItemId);
        return;
      }

      revealed = false;
      const item = queue[index];
      const id   = getItemId(item);
      const card = SRS.getCard(moduleId, id);
      const isNew = !card;
      const pct  = Math.round((index / total) * 100);

      // Preview next interval for each rating (based on current card state)
      const baseCard = card || { interval:1, repetitions:0, easeFactor:2.5 };
      const previews = [0,1,2,3].map(r => {
        const next = SRS.calculateNext(baseCard, r);
        return SRS.intervalLabel(next.interval);
      });

      main.innerHTML = `
        <div class="srs-card-wrap">
          <div class="srs-progress-row">
            <span>${index + 1} / ${total}</span>
            <div class="srs-progress-bar-wrap">
              <div class="srs-progress-bar-fill" style="width:${pct}%"></div>
            </div>
            <span>${pct}%</span>
          </div>

          <div class="srs-card" id="srs-card">
            <span class="srs-counter">#${index + 1}</span>
            ${isNew ? '<span class="srs-badge new-badge">BARU</span>' : '<span class="srs-badge">ULANG</span>'}
            <div class="srs-front">${renderFront(item)}</div>
            <div class="srs-back srs-hidden">${renderBack(item)}</div>
          </div>

          <button class="srs-reveal-btn" id="srs-reveal">Tampilkan Jawaban 👁</button>

          <div class="srs-ratings" id="srs-ratings" style="display:none">
            ${[0,1,2,3].map(r => `
              <button class="srs-rating-btn" data-rating="${r}">
                <span class="rbtn-emoji">${['❌','😐','✅','🔥'][r]}</span>
                <span class="rbtn-label">${['Lupa','Sulit','Mudah','Hafal'][r]}</span>
                <span class="rbtn-interval">${previews[r]}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // Bind reveal
      document.getElementById('srs-reveal').addEventListener('click', () => {
        revealed = true;
        document.querySelector('.srs-back').classList.remove('srs-hidden');
        document.getElementById('srs-reveal').style.display = 'none';
        document.getElementById('srs-ratings').style.display = 'flex';
      });

      // Bind rating buttons
      document.getElementById('srs-ratings').addEventListener('click', e => {
        const btn = e.target.closest('.srs-rating-btn');
        if (!btn) return;
        const rating = parseInt(btn.dataset.rating);

        // Save to SRS
        SRS.rate(moduleId, id, rating);

        // Challenge (Fase 15)
        if (typeof ChallengeSystem !== 'undefined') {
          ChallengeSystem.onSrsReview(1);
          ChallengeSystem.onModuleVisit(moduleId);
        }

        // If "lupa", re-add to end of queue
        if (rating === 0) {
          queue.push(item);
        }

        index++;
        renderCard();
      });
    }

    renderCard();
  }

  function _renderDone(container, total, moduleId) {
    const stats = SRS.getModuleStats(moduleId);
    container.innerHTML = `
      <div class="srs-done-wrap">
        <div class="srs-done-icon">✅</div>
        <div class="srs-done-title">Sesi Selesai!</div>
        <div class="srs-done-sub">
          Kamu telah mereview ${total} kartu.<br>
          ${stats.mastered} kartu sudah dikuasai — keren! 🏆
        </div>
        <button class="btn btn-primary" id="srs-restart">Mulai Ulang Sesi</button>
      </div>
    `;
    document.getElementById('srs-restart')?.addEventListener('click', () => {
      // Re-trigger SRS tab click
      const tabBtn = document.querySelector('[data-tab="srs"]');
      if (tabBtn) tabBtn.click();
    });
  }

  function _refreshStats(container, moduleId, queue, getItemId) {
    const stats = SRS.getModuleStats(moduleId);
    const newIds = queue.map(getItemId).filter(id => SRS.isNew(moduleId, id));
    const statsEl = container.querySelector('.srs-stats-bar');
    if (!statsEl) return;
    statsEl.innerHTML = `
      <div class="srs-stat-chip due"><span class="chip-icon">📅</span><span>${stats.due} jatuh tempo</span></div>
      <div class="srs-stat-chip learn"><span class="chip-icon">📖</span><span>${newIds.length} baru</span></div>
      <div class="srs-stat-chip master"><span class="chip-icon">🏆</span><span>${stats.mastered} dikuasai</span></div>
    `;
  }

  return { init };

})();

window.SrsUI = SrsUI;
