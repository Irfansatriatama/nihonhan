/**
 * NihonHan - Pinyin Page JS
 */
document.addEventListener('DOMContentLoaded', () => {
  if (!Router.guard()) return;
  App.init('pinyin');

  const _pinyin_user = Auth.getActiveUser();
  if (AudioEngine.isSupported()) AudioEngine.init(_pinyin_user.id);

  let currentItem = null;

  // ── Tabs ──────────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // ── Render initials ────────────────────────────────────────
  function renderInitials() {
    const grid = document.getElementById('initials-grid');
    grid.innerHTML = PinyinData.initials.map(item => `
      <div class="pinyin-cell" data-type="initial" data-symbol="${item.symbol}">
        <span class="pinyin-cell-symbol">${item.symbol}</span>
        <div class="pinyin-cell-ipa">[${item.ipa}]</div>
        <div class="pinyin-cell-example">${item.example.word}</div>
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.example.hanzi || item.example.word, 'zh', 'audio-btn-sm') : ''}
      </div>
    `).join('');

    // Audio delegation
    grid.addEventListener('click', e => {
      const aBtn = e.target.closest('.audio-btn');
      if (aBtn) { e.stopPropagation(); AudioEngine.speakZH(aBtn.dataset.speak); return; }
    });

    grid.querySelectorAll('.pinyin-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const item = PinyinData.initials.find(i => i.symbol === cell.dataset.symbol);
        if (item) openModal(item, 'initial');
      });
    });
  }

  // ── Render finals ──────────────────────────────────────────
  function renderFinals() {
    const grid = document.getElementById('finals-grid');
    grid.innerHTML = PinyinData.finals.map(item => `
      <div class="pinyin-cell" data-type="final" data-symbol="${item.symbol}">
        <span class="pinyin-cell-symbol">${item.symbol}</span>
        <div class="pinyin-cell-ipa" style="font-style:normal;">${item.desc.substring(0,18)}…</div>
        <div class="pinyin-cell-example cjk">${item.example.hanzi || item.example.word}</div>
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.example.hanzi || item.example.word, 'zh', 'audio-btn-sm') : ''}
      </div>
    `).join('');

    // Audio delegation
    grid.addEventListener('click', e => {
      const aBtn = e.target.closest('.audio-btn');
      if (aBtn) { e.stopPropagation(); AudioEngine.speakZH(aBtn.dataset.speak); return; }
    });

    grid.querySelectorAll('.pinyin-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const item = PinyinData.finals.find(i => i.symbol === cell.dataset.symbol);
        if (item) openModal(item, 'final');
      });
    });
  }

  // ── Render combinations ────────────────────────────────────
  function renderCombinations() {
    const grid = document.getElementById('comb-grid');
    grid.innerHTML = PinyinData.combinations.map(item => `
      <div class="pinyin-cell" data-pinyin="${item.pinyin}">
        <span class="pinyin-cell-symbol" style="font-size:1rem;">${item.pinyin}</span>
        <div class="pinyin-cell-example cjk">${item.example.hanzi}</div>
        <div class="pinyin-cell-ipa">${item.example.meaning}</div>
        ${AudioEngine.isSupported() ? AudioEngine.btnHTML(item.example.hanzi, 'zh', 'audio-btn-sm') : ''}
      </div>
    `).join('');

    // Audio delegation
    grid.addEventListener('click', e => {
      const aBtn = e.target.closest('.audio-btn');
      if (aBtn) { e.stopPropagation(); AudioEngine.speakZH(aBtn.dataset.speak); return; }
    });

    grid.querySelectorAll('.pinyin-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const item = PinyinData.combinations.find(i => i.pinyin === cell.dataset.pinyin);
        if (item) openCombModal(item);
      });
    });
  }

  // ── Modal ─────────────────────────────────────────────────
  function openModal(item, type) {
    currentItem = item;
    document.getElementById('pm-title').textContent = type === 'initial' ? 'Konsonan Awal' : 'Vokal Akhir';
    document.getElementById('pm-char').textContent = item.symbol;
    document.getElementById('pm-ipa').textContent  = item.ipa ? `IPA: [${item.ipa}]` : '';
    document.getElementById('pm-desc').textContent = item.desc;
    document.getElementById('pm-ex-word').textContent    = item.example.hanzi || item.example.word;
    document.getElementById('pm-ex-pinyin').textContent  = item.example.word;
    document.getElementById('pm-ex-meaning').textContent = item.example.meaning;

    // Audio buttons
    _bindPinyinModalAudio(item.example.hanzi || item.example.word, item.symbol);

    if (AudioEngine.isSupported() && AudioEngine.getAutoPlay()) {
      AudioEngine.speakZH(item.example.hanzi || item.example.word);
    }

    document.getElementById('pinyin-modal').classList.add('open');
  }

  function openCombModal(item) {
    document.getElementById('pm-title').textContent = 'Kombinasi Pinyin';
    document.getElementById('pm-char').textContent  = item.pinyin;
    document.getElementById('pm-ipa').textContent   = `Inisial: ${item.initial} | Final: ${item.final}`;
    document.getElementById('pm-desc').textContent  = '';
    document.getElementById('pm-ex-word').textContent    = item.example.hanzi;
    document.getElementById('pm-ex-pinyin').textContent  = item.pinyin;
    document.getElementById('pm-ex-meaning').textContent = item.example.meaning;

    // Audio buttons
    _bindPinyinModalAudio(item.example.hanzi, item.pinyin);

    if (AudioEngine.isSupported() && AudioEngine.getAutoPlay()) {
      AudioEngine.speakZH(item.example.hanzi);
    }

    document.getElementById('pinyin-modal').classList.add('open');
  }

  // Inject audio buttons into pinyin modal
  function _bindPinyinModalAudio(hanziText, symbolText) {
    if (!AudioEngine.isSupported()) return;

    // Button next to main char display
    const charEl = document.getElementById('pm-char');
    let existBtn = charEl.nextElementSibling;
    if (existBtn && existBtn.classList.contains('audio-btn')) existBtn.remove();
    const charAudioBtn = document.createElement('button');
    charAudioBtn.className = 'audio-btn audio-btn-lg';
    charAudioBtn.textContent = '🔊';
    charAudioBtn.title = 'Dengar pengucapan';
    charAudioBtn.style.marginLeft = '8px';
    charAudioBtn.addEventListener('click', e => { e.stopPropagation(); AudioEngine.speakZH(hanziText); });
    charEl.after(charAudioBtn);

    // Button next to example word
    const exWordEl = document.getElementById('pm-ex-word');
    let existExBtn = exWordEl.nextElementSibling;
    if (existExBtn && existExBtn.classList.contains('audio-btn')) existExBtn.remove();
    const exAudioBtn = document.createElement('button');
    exAudioBtn.className = 'audio-btn audio-btn-sm';
    exAudioBtn.textContent = '🔊';
    exAudioBtn.title = 'Dengar contoh kata';
    exAudioBtn.style.marginLeft = '6px';
    exAudioBtn.addEventListener('click', e => { e.stopPropagation(); AudioEngine.speakZH(hanziText); });
    exWordEl.after(exAudioBtn);
  }

  function closeModal() {
    document.getElementById('pinyin-modal').classList.remove('open');
  }

  document.getElementById('pm-close').addEventListener('click', closeModal);
  document.getElementById('pm-close-btn').addEventListener('click', closeModal);
  document.getElementById('pinyin-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('pinyin-modal')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── Init ─────────────────────────────────────────────────
  renderInitials();
  renderFinals();
  renderCombinations();
});
