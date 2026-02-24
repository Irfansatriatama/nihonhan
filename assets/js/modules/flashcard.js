/**
 * NihonHan - Flashcard Module
 * Komponen flashcard dengan animasi flip 3D, navigasi, dan tandai hafal.
 * Gunakan: new Flashcard({ container, data, moduleId, onProgress })
 */
class Flashcard {
  constructor({ container, data, moduleId, onProgress }) {
    this.container  = container;
    this.data       = data;        // array of { char, romaji, example, ... }
    this.moduleId   = moduleId;
    this.onProgress = onProgress || (() => {});
    this.index      = 0;
    this.flipped    = false;
    this.render();
    this.attachEvents();
  }

  get current() { return this.data[this.index]; }

  render() {
    const learned = Progress.getLearned(this.moduleId);
    this.container.innerHTML = `
      <div class="fc-wrapper">
        <div class="fc-progress-bar">
          <div class="fc-progress-fill" id="fc-prog-fill"></div>
        </div>
        <div class="fc-counter" id="fc-counter"></div>

        <div class="fc-scene" id="fc-scene">
          <div class="fc-card" id="fc-card">
            <div class="fc-face fc-front" id="fc-front"></div>
            <div class="fc-face fc-back"  id="fc-back"></div>
          </div>
        </div>

        <p class="fc-hint">Klik kartu untuk membalik</p>

        <div class="fc-actions">
          <button class="btn btn-ghost btn-sm" id="fc-prev">&#8592; Prev</button>
          <button class="btn btn-outline btn-sm" id="fc-mark">Tandai Hafal</button>
          <button class="btn btn-ghost btn-sm" id="fc-next">Next &#8594;</button>
        </div>

        <div class="fc-learned-count" id="fc-learned-count"></div>
      </div>
    `;

    this.frontEl  = this.container.querySelector('#fc-front');
    this.backEl   = this.container.querySelector('#fc-back');
    this.cardEl   = this.container.querySelector('#fc-card');
    this.markBtn  = this.container.querySelector('#fc-mark');
    this.counter  = this.container.querySelector('#fc-counter');
    this.progFill = this.container.querySelector('#fc-prog-fill');
    this.learnedCountEl = this.container.querySelector('#fc-learned-count');

    this.updateCard();
  }

  updateCard() {
    const c       = this.current;
    const learned = Progress.getLearned(this.moduleId);
    const isLearned = learned.includes(c.char);
    const total   = this.data.length;

    // Counter
    this.counter.textContent = `${this.index + 1} / ${total}`;

    // Progress bar
    const pct = Math.round((learned.length / total) * 100);
    this.progFill.style.width = pct + '%';

    // Learned count
    this.learnedCountEl.textContent = `${learned.length} dari ${total} karakter ditandai hafal`;

    // Card faces
    this.frontEl.innerHTML = `
      <div class="fc-char cjk">${c.char}</div>
      <div class="fc-type-badge">${this._typeLabel(c.type)}</div>
      ${isLearned ? '<div class="fc-learned-badge">Hafal</div>' : ''}
    `;
    this.backEl.innerHTML = `
      <div class="fc-romaji">${c.romaji}</div>
      <div class="fc-example">
        <span class="cjk">${c.example.word}</span>
        <span class="fc-reading">${c.example.reading}</span>
        <span class="fc-meaning">${c.example.meaning}</span>
      </div>
      ${isLearned ? '<div class="fc-learned-badge">Hafal</div>' : ''}
    `;

    // Mark button state
    if (isLearned) {
      this.markBtn.textContent   = 'Hapus Tanda';
      this.markBtn.className     = 'btn btn-ghost btn-sm';
    } else {
      this.markBtn.textContent   = 'Tandai Hafal';
      this.markBtn.className     = 'btn btn-outline btn-sm';
    }

    // Reset flip
    this.flipped = false;
    this.cardEl.classList.remove('flipped');
  }

  attachEvents() {
    // Flip on click
    this.container.querySelector('#fc-scene').addEventListener('click', () => {
      this.flipped = !this.flipped;
      this.cardEl.classList.toggle('flipped', this.flipped);
    });

    // Keyboard support
    this._keyHandler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'l') this.next();
      if (e.key === 'ArrowLeft'  || e.key === 'j') this.prev();
      if (e.key === ' ' || e.key === 'f') { e.preventDefault(); this.flipCard(); }
      if (e.key === 'Enter') this.toggleLearned();
    };
    document.addEventListener('keydown', this._keyHandler);

    this.container.querySelector('#fc-prev').addEventListener('click', () => this.prev());
    this.container.querySelector('#fc-next').addEventListener('click', () => this.next());
    this.markBtn.addEventListener('click', () => this.toggleLearned());
  }

  flipCard() {
    this.flipped = !this.flipped;
    this.cardEl.classList.toggle('flipped', this.flipped);
  }

  next() {
    this.index = (this.index + 1) % this.data.length;
    this.updateCard();
  }

  prev() {
    this.index = (this.index - 1 + this.data.length) % this.data.length;
    this.updateCard();
  }

  goTo(index) {
    this.index = Math.max(0, Math.min(index, this.data.length - 1));
    this.updateCard();
  }

  toggleLearned() {
    const c = this.current;
    if (Progress.isLearned(this.moduleId, c.char)) {
      Progress.unmarkLearned(this.moduleId, c.char);
      App.toast('Tanda dihapus', 'default', 1500);
    } else {
      Progress.markLearned(this.moduleId, c.char);
      App.toast('Ditandai hafal!', 'success', 1500);
    }
    this.updateCard();
    this.onProgress();
  }

  destroy() {
    document.removeEventListener('keydown', this._keyHandler);
  }

  _typeLabel(type) {
    if (type === 'basic')   return 'Dasar';
    if (type === 'dakuten') return 'Dakuten';
    if (type === 'yoon')    return 'Kombinasi';
    return '';
  }
}

window.Flashcard = Flashcard;
