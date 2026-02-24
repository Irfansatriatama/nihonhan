/**
 * NihonHan - Tones Page JS
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('tones');

  const _tones_user = Auth.getActiveUser();
  if (AudioEngine.isSupported()) AudioEngine.init(_tones_user.id);

  let activeTone = null;

  // ── Render tone cards ──────────────────────────────────────
  function renderToneCards() {
    const grid = document.getElementById('tone-cards-grid');
    grid.innerHTML = TonesData.tones.map(tone => `
      <div class="tone-card" data-tone="${tone.number}" style="border-color:${tone.color}20;">
        <div class="tone-card-header">
          <div class="tone-number-badge" style="background:${tone.color};">${tone.number === 0 ? '·' : tone.number}</div>
          <div>
            <div class="tone-card-name">${tone.name}</div>
            <div class="tone-card-namecn">${tone.nameCN}</div>
          </div>
          <div style="margin-left:auto;font-size:1.8rem;font-weight:700;font-family:var(--font-display);color:${tone.color};">${tone.mark}</div>
        </div>

        <svg class="tone-curve-svg" width="200" height="100" viewBox="0 0 200 100">
          <path class="tone-curve-path" d="${tone.curve}" stroke="${tone.color}"/>
        </svg>

        <p style="font-size:0.8rem;color:var(--text-2);line-height:1.5;margin-top:4px;">${tone.desc}</p>
        <div class="tone-mnemo" style="color:${tone.color};">"${tone.mnemomic}"</div>

        <button class="btn btn-outline btn-sm" style="margin-top:12px;width:100%;border-color:${tone.color};color:${tone.color};"
          data-showtone="${tone.number}">Lihat Contoh →</button>
      </div>
    `).join('');

    grid.querySelectorAll('[data-showtone]').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.dataset.showtone);
        showToneDetail(n);
      });
    });
  }

  // ── Show tone detail ───────────────────────────────────────
  function showToneDetail(n) {
    activeTone = n;
    const tone = TonesData.getByNumber(n);
    if (!tone) return;

    const section = document.getElementById('tone-detail-section');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('tone-detail-title').textContent = `${tone.name} (${tone.mark}) — Contoh Kata`;
    document.getElementById('tone-ex-title').innerHTML = `
      <span class="tone-number-badge" style="background:${tone.color};color:#fff;">${n === 0 ? '·' : n}</span>
      ${tone.examples.length} contoh kata dengan ${tone.name}
    `;

    document.getElementById('tone-ex-grid').innerHTML = tone.examples.map(ex => `
      <div class="tone-ex-card" style="border-color:${tone.color}40;">
        <div style="display:flex;align-items:center;gap:8px;justify-content:center;">
          <div class="tone-ex-hanzi cjk" style="color:${tone.color};">${ex.hanzi}</div>
          ${AudioEngine.isSupported() ? AudioEngine.btnHTML(ex.hanzi, 'zh', 'audio-btn-sm') : ''}
        </div>
        <div class="tone-ex-pinyin">${ex.pinyin}</div>
        <div class="tone-ex-meaning">${ex.meaning}</div>
      </div>
    `).join('');

    // Bind audio buttons
    document.getElementById('tone-ex-grid').querySelectorAll('.audio-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        AudioEngine.speakZH(btn.dataset.speak);
      });
    });
  }

  // ── Render minimal pairs ───────────────────────────────────
  function renderMinimalPairs() {
    const container = document.getElementById('minimal-pairs-container');
    container.innerHTML = TonesData.minimalPairs.map(pair => `
      <div class="minimal-pair-row">
        <div class="minimal-pair-base">Suku kata dasar: "${pair.base}"</div>
        <div class="minimal-pair-words">
          ${pair.words.map(w => {
            const tone = TonesData.getByNumber(w.tone);
            return `
              <div class="minimal-pair-word" style="border-color:${tone ? tone.color : 'var(--border)'}40;background:${tone ? tone.colorSoft : 'var(--surface)'};">
                <span class="mpw-pinyin" style="color:${tone ? tone.color : 'var(--text)'};">${w.pinyin}</span>
                <span class="mpw-hanzi cjk">${w.hanzi}</span>
                <span class="mpw-meaning">${w.meaning}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
  }

  // ── Init ─────────────────────────────────────────────────
  renderToneCards();
  renderMinimalPairs();
});
