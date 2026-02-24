/**
 * NihonHan - Stroke Order Module
 * Animasi stroke order SVG untuk kanji N5.
 * Menggunakan pendekatan visual sederhana: highlight & animasi urutan stroke.
 *
 * Karena data SVG stroke order lengkap membutuhkan file eksternal besar,
 * modul ini menggunakan pendekatan:
 * 1. Tampilkan karakter kanji besar
 * 2. Tampilkan panduan stroke count dengan animasi visual
 * 3. Link ke sumber referensi jika tersedia
 */
const Stroke = (() => {

  /**
   * Render stroke order widget di dalam container
   * @param {HTMLElement} container
   * @param {Object} kanjiData - { char, strokes }
   */
  function render(container, kanjiData) {
    if (!container || !kanjiData) return;

    const { char, strokes } = kanjiData;

    container.innerHTML = `
      <div class="stroke-widget">
        <div class="stroke-char-display">
          <div class="stroke-char cjk">${char}</div>
          <div class="stroke-info">
            <span class="stroke-count-badge">${strokes} stroke${strokes > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="stroke-steps" id="stroke-steps-${char.codePointAt(0)}">
          ${_buildStepDots(strokes, char)}
        </div>
        <div class="stroke-tip">
          <span>💡</span>
          <span>Pelajari urutan stroke yang benar untuk menulis ${char} (${strokes} coretan)</span>
        </div>
        <div class="stroke-external-links">
          <a href="https://jisho.org/search/${encodeURIComponent(char)}%23kanji" target="_blank" rel="noopener" class="stroke-ext-btn">
            Lihat di Jisho
          </a>
          <a href="https://www.wanikani.com/kanji/${encodeURIComponent(char)}" target="_blank" rel="noopener" class="stroke-ext-btn">
            WaniKani
          </a>
        </div>
      </div>
    `;

    _initStepAnimation(container, char, strokes);
  }

  function _buildStepDots(strokes, char) {
    let html = '<div class="stroke-dots">';
    for (let i = 1; i <= strokes; i++) {
      html += `<div class="stroke-dot" data-step="${i}" title="Stroke ${i}">
        <div class="stroke-dot-num">${i}</div>
        <div class="stroke-dot-char cjk">${char}</div>
      </div>`;
    }
    html += '</div>';
    return html;
  }

  function _initStepAnimation(container, char, strokes) {
    const dots = container.querySelectorAll('.stroke-dot');
    if (!dots.length) return;

    // Hover to show step
    dots.forEach((dot, i) => {
      dot.addEventListener('mouseenter', () => {
        dots.forEach((d, j) => {
          d.classList.toggle('active', j <= i);
          d.classList.toggle('dim', j > i);
        });
      });
      dot.addEventListener('mouseleave', () => {
        dots.forEach(d => { d.classList.remove('active','dim'); });
      });
      dot.addEventListener('click', () => {
        dots.forEach((d, j) => {
          d.classList.toggle('active', j <= i);
        });
      });
    });
  }

  /**
   * Animate stroke count visually (pulse effect)
   */
  function animate(container) {
    const dots = container.querySelectorAll('.stroke-dot');
    if (!dots.length) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i > 0) dots[i - 1].classList.remove('active');
      if (i < dots.length) {
        dots[i].classList.add('active');
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
  }

  return { render, animate };
})();

window.Stroke = Stroke;
