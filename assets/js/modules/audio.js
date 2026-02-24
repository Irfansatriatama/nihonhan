/**
 * NihonHan - Audio Engine (Fase 9)
 * Wrapper untuk Web Speech API (SpeechSynthesis).
 * Mendukung suara Jepang (ja-JP) dan Mandarin (zh-CN).
 */
const AudioEngine = (() => {

  let voicesLoaded  = false;
  let jaVoice       = null;
  let zhVoice       = null;
  let _autoPlay     = false;   // diisi dari settings saat init

  // ── Muat voices ──────────────────────────────────────────
  function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    jaVoice = voices.find(v => v.lang.startsWith('ja')) || null;
    zhVoice = voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh-TW' || v.lang.startsWith('zh')) || null;
    voicesLoaded = true;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    // Coba muat langsung (Chrome/Edge sudah tersedia)
    loadVoices();
  }

  // ── Speak core ────────────────────────────────────────────
  function speak(text, lang = 'ja-JP', rate = 0.85) {
    if (!window.speechSynthesis) return false;
    if (!text) return false;

    window.speechSynthesis.cancel();

    const utt  = new SpeechSynthesisUtterance(text);
    utt.lang   = lang;
    utt.rate   = rate;
    utt.pitch  = 1;
    utt.volume = 1;

    // Pilih voice yang sesuai jika ada
    if (lang.startsWith('ja') && jaVoice) utt.voice = jaVoice;
    if (lang.startsWith('zh') && zhVoice) utt.voice = zhVoice;

    window.speechSynthesis.speak(utt);
    return true;
  }

  function speakJP(text) {
    return speak(text, 'ja-JP', 0.85);
  }

  function speakZH(text) {
    return speak(text, 'zh-CN', 0.8);
  }

  // ── Cek ketersediaan voice ────────────────────────────────
  function hasJPVoice() {
    if (!window.speechSynthesis) return false;
    loadVoices(); // refresh
    return jaVoice !== null || window.speechSynthesis.getVoices().some(v => v.lang.startsWith('ja'));
  }

  function hasZHVoice() {
    if (!window.speechSynthesis) return false;
    loadVoices();
    return zhVoice !== null || window.speechSynthesis.getVoices().some(v => v.lang.startsWith('zh'));
  }

  function isSupported() {
    return typeof window !== 'undefined' && !!window.speechSynthesis;
  }

  // ── Auto-play preference ──────────────────────────────────
  function setAutoPlay(val) { _autoPlay = !!val; }
  function getAutoPlay()     { return _autoPlay; }

  // ── Init dari settings user ───────────────────────────────
  function init(userId) {
    if (!isSupported()) return;
    try {
      const s = Storage.getUser(userId, 'settings', {});
      _autoPlay = s.audioAutoPlay === true;
    } catch(e) { /* ignore */ }
  }

  // ── Helper: buat tombol speaker HTML ─────────────────────
  // lang: 'jp' | 'zh'
  // text: teks yang akan diucapkan
  // kelas tambahan opsional
  function btnHTML(text, lang, extraClass = '') {
    const escaped = text.replace(/"/g, '&quot;');
    return `<button class="audio-btn${extraClass ? ' ' + extraClass : ''}" 
              data-speak="${escaped}" data-lang="${lang}" 
              title="Dengar pengucapan" aria-label="Putar suara">🔊</button>`;
  }

  return {
    speak, speakJP, speakZH,
    hasJPVoice, hasZHVoice, isSupported,
    setAutoPlay, getAutoPlay,
    init, btnHTML,
  };
})();

window.AudioEngine = AudioEngine;
