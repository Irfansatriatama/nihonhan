/**
 * NihonHan - Japanese Grammar Page JS (Fase 8)
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('jp-grammar');

  const MODULE_ID     = 'jp-grammar';
  let activeCategory  = 'all';
  let activeLevel     = 'all';
  let searchQuery     = '';
  let expandedId      = null;

  // ── Header ─────────────────────────────────────────────────
  function updateHeader() {
    const learned = Progress.getLearned(MODULE_ID);
    const total   = JpGrammarData.patterns.length;
    const pct     = total > 0 ? Math.round((learned.length / total) * 100) : 0;
    document.getElementById('hdr-pct').textContent = pct + '%';
    document.getElementById('hdr-sub').textContent = learned.length + ' / ' + total + ' dipelajari';
  }

  updateHeader();

  // ── Category tabs ──────────────────────────────────────────
  function renderCategoryTabs() {
    const container = document.getElementById('category-tabs');
    const allBtn    = `<button class="theme-tab active" data-cat="all">Semua (${JpGrammarData.patterns.length})</button>`;
    const catBtns   = JpGrammarData.categories.map(c => {
      const count = JpGrammarData.getByCategory(c.id).length;
      return `<button class="theme-tab" data-cat="${c.id}">${c.icon} ${c.label} (${count})</button>`;
    }).join('');
    container.innerHTML = allBtn + catBtns;

    container.querySelectorAll('.theme-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.theme-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        searchQuery = '';
        document.getElementById('grammar-search').value = '';
        renderList();
      });
    });
  }

  renderCategoryTabs();

  // ── Level filter ───────────────────────────────────────────
  document.querySelectorAll('.filter-level').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-level').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLevel = btn.dataset.level;
      renderList();
    });
  });

  // ── Search ─────────────────────────────────────────────────
  document.getElementById('grammar-search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    if (searchQuery) {
      document.querySelectorAll('.theme-tab').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-cat="all"]').classList.add('active');
      activeCategory = 'all';
    }
    renderList();
  });

  // ── List render ────────────────────────────────────────────
  function getFiltered() {
    let data = searchQuery
      ? JpGrammarData.search(searchQuery)
      : (activeCategory === 'all' ? JpGrammarData.patterns : JpGrammarData.getByCategory(activeCategory));

    if (activeLevel !== 'all') data = data.filter(p => p.level === activeLevel);
    return data;
  }

  function renderList() {
    const listEl  = document.getElementById('grammar-list');
    const learned = Progress.getLearned(MODULE_ID);
    const data    = getFiltered();

    document.getElementById('grid-count').textContent = data.length + ' pola';

    if (data.length === 0) {
      listEl.innerHTML = `<div class="zh-empty"><div class="zh-empty-icon">文</div><p>Tidak ada pola ditemukan.</p></div>`;
      return;
    }

    listEl.innerHTML = data.map(p => {
      const isLearned   = learned.includes(p.id);
      const isExpanded  = expandedId === p.id;
      const levelBadge  = p.level === 'N5' ? 'badge-red' : 'badge-gold';
      const catDef      = JpGrammarData.categories.find(c => c.id === p.category);
      const catIcon     = catDef ? catDef.icon : '';

      return `
        <div class="grammar-card${isExpanded ? ' expanded' : ''}${isLearned ? ' learned' : ''}" data-id="${p.id}">
          <div class="grammar-card-header">
            <div class="grammar-card-main">
              <div class="grammar-pattern cjk">${p.pattern}</div>
              <div class="grammar-meaning">${p.meaning}</div>
            </div>
            <div class="grammar-card-meta">
              <span class="badge ${levelBadge}" style="font-size:0.65rem">${p.level}</span>
              ${isLearned ? '<span class="grammar-learned-badge">&#10003;</span>' : ''}
              <span class="grammar-expand-icon">${isExpanded ? '&#9650;' : '&#9660;'}</span>
            </div>
          </div>

          ${isExpanded ? `
          <div class="grammar-card-body">
            <p class="grammar-explanation">${p.explanation}</p>

            <div class="grammar-examples">
              <div class="grammar-examples-title">Contoh Kalimat</div>
              ${p.examples.map(ex => `
                <div class="grammar-example-item">
                  <div class="grammar-ex-jp cjk">${ex.jp}</div>
                  <div class="grammar-ex-romaji">${ex.romaji}</div>
                  <div class="grammar-ex-id">${ex.id}</div>
                </div>
              `).join('')}
            </div>

            ${p.notes ? `<div class="grammar-notes"><span class="grammar-notes-icon">💡</span> ${p.notes}</div>` : ''}

            <div class="grammar-actions">
              <button class="btn ${isLearned ? 'btn-outline' : 'btn-primary'} btn-sm grammar-mark-btn" data-id="${p.id}">
                ${isLearned ? '✗ Batal Hafal' : '✓ Tandai Hafal'}
              </button>
            </div>
          </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Click to expand
    listEl.querySelectorAll('.grammar-card-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.grammar-card');
        const id   = card.dataset.id;
        expandedId = expandedId === id ? null : id;
        renderList();
      });
    });

    // Mark learned buttons
    listEl.querySelectorAll('.grammar-mark-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const wasLearned = Progress.isLearned(MODULE_ID, id);
        if (wasLearned) {
          Progress.unmarkLearned(MODULE_ID, id);
          App.toast('Pola dibatalkan dari hafal.', 'default', 2000);
        } else {
          Progress.markLearned(MODULE_ID, id);
          App.toast('Pola ditandai hafal! 🎉', 'success', 2000);
        }
        updateHeader();
        renderList();
      });
    });
  }

  renderList();
});
