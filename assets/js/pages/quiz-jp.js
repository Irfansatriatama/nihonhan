/**
 * NihonHan - Quiz Jepang Page
 * Hiragana, Katakana, Kanji quiz dengan multiple choice.
 */
(() => {
  if (!Router.guard()) return;
  App.init('quiz-jp');

  // ── State ──────────────────────────────────────────────
  let selectedModule = null;
  let selectedType   = 'char-to-romaji';
  let selectedCount  = 10;
  let selectedKLevel = 'all';
  let selectedMode   = 'choice'; // 'choice' | 'input'
  let isSessionActive = false;

  // ── DOM ────────────────────────────────────────────────
  const selectScreen  = document.getElementById('selectScreen');
  const sessionScreen = document.getElementById('sessionScreen');
  const resultScreen  = document.getElementById('resultScreen');
  const startBtn      = document.getElementById('startBtn');

  // ── Init ───────────────────────────────────────────────
  renderBadges();
  bindModuleCards();
  bindModeOptions();
  bindTypeOptions();
  bindCountOptions();
  bindKanjiLevelOptions();
  bindQuizControls();

  // ── Module cards ───────────────────────────────────────
  function bindModuleCards() {
    document.querySelectorAll('.quiz-module-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.quiz-module-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedModule = card.dataset.module;

        // Show kanji level panel only for kanji
        document.getElementById('kanjiLevelPanel').style.display =
          selectedModule === 'kanji' ? 'block' : 'none';

        // Tipe soal: kanji punya "arti" option
        updateTypeOptionsForModule();

        startBtn.disabled = false;
        startBtn.textContent = `Mulai Quiz ${card.querySelector('.card-title').textContent}`;
      });
    });
  }

  function updateTypeOptionsForModule() {
    const meaningBtn = document.querySelector('[data-type="char-to-meaning"]');
    if (selectedModule === 'kanji') {
      meaningBtn.style.display = '';
    } else {
      meaningBtn.style.display = 'none';
      if (selectedType === 'char-to-meaning') {
        selectedType = 'char-to-romaji';
        document.querySelectorAll('.quiz-type-btn[data-type]').forEach(b => {
          b.classList.toggle('active', b.dataset.type === selectedType);
        });
      }
    }
  }

  // ── Mode options ───────────────────────────────────────
  function bindModeOptions() {
    document.querySelectorAll('#modeOptions .quiz-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#modeOptions .quiz-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMode = btn.dataset.mode;
      });
    });
  }

  // ── Type options ───────────────────────────────────────
  function bindTypeOptions() {
    document.querySelectorAll('#typeOptions .quiz-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#typeOptions .quiz-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedType = btn.dataset.type;
      });
    });
  }

  function bindCountOptions() {
    document.querySelectorAll('#countOptions .quiz-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#countOptions .quiz-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCount = parseInt(btn.dataset.count);
      });
    });
  }

  function bindKanjiLevelOptions() {
    document.querySelectorAll('#kanjiLevelOptions .quiz-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#kanjiLevelOptions .quiz-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedKLevel = btn.dataset.klevel;
      });
    });
  }

  // ── Start quiz ─────────────────────────────────────────
  startBtn.addEventListener('click', () => {
    if (!selectedModule) return;
    const items = getDataset();
    if (!items || items.length < 4) {
      App.toast('Data tidak cukup untuk membuat quiz.', 'error');
      return;
    }

    const ok = QuizEngine.start(
      items,
      (item, all) => buildQuestion(item, all),
      { totalQuestions: selectedCount, timerSeconds: selectedMode === 'input' ? 30 : 20, moduleId: `quiz-jp-${selectedModule}` },
      onFinish
    );

    if (!ok) { App.toast('Gagal membuat soal.', 'error'); return; }

    isSessionActive = true;
    showScreen('session');
    renderQuestion();
  });

  // ── Dataset helper ─────────────────────────────────────
  function getDataset() {
    if (selectedModule === 'hiragana') {
      return HiraganaData.all;
    }
    if (selectedModule === 'katakana') {
      return KatakanaData.all;
    }
    if (selectedModule === 'kanji') {
      if (selectedKLevel === 'all') return KanjiData.all;
      return KanjiData.getByLevel(selectedKLevel);
    }
    return [];
  }

  // ── Build question ─────────────────────────────────────
  function buildQuestion(item, allItems) {
    if (selectedModule === 'hiragana' || selectedModule === 'katakana') {
      return buildKanaQuestion(item, allItems);
    }
    return buildKanjiQuestion(item, allItems);
  }

  function buildKanaQuestion(item, allItems) {
    if (selectedType === 'char-to-romaji') {
      const wrongs = QuizEngine.pickWrongAnswers(allItems, item.romaji, x => x.romaji, 3);
      return {
        question    : item.char,
        questionType: 'char',
        answer      : item.romaji,
        choices     : QuizEngine.shuffleChoices([item.romaji, ...wrongs]),
        hint        : '',
        explanation : `${item.char} dibaca "${item.romaji}"`,
      };
    }
    // romaji-to-char
    const wrongs = QuizEngine.pickWrongAnswers(allItems, item.char, x => x.char, 3);
    return {
      question    : item.romaji,
      questionType: 'text',
      answer      : item.char,
      choices     : QuizEngine.shuffleChoices([item.char, ...wrongs]),
      hint        : 'Pilih karakter yang sesuai',
      explanation : `"${item.romaji}" ditulis sebagai ${item.char}`,
    };
  }

  function buildKanjiQuestion(item, allItems) {
    if (selectedType === 'char-to-meaning') {
      const wrongs = QuizEngine.pickWrongAnswers(allItems, item.meaning[0], x => x.meaning[0], 3);
      return {
        question    : item.char,
        questionType: 'char',
        answer      : item.meaning[0],
        choices     : QuizEngine.shuffleChoices([item.meaning[0], ...wrongs]),
        hint        : `${item.onyomi.join('・') || ''} ${item.kunyomi.join('・') || ''}`.trim(),
        explanation : `${item.char} berarti "${item.meaning.join(', ')}"`,
      };
    }
    if (selectedType === 'char-to-romaji') {
      // onyomi reading
      const reading = item.onyomi[0] || item.kunyomi[0] || '';
      const wrongs  = QuizEngine.pickWrongAnswers(
        allItems,
        reading,
        x => x.onyomi[0] || x.kunyomi[0] || '',
        3
      ).filter(w => w);
      if (!reading || wrongs.length < 3) return null;
      return {
        question    : item.char,
        questionType: 'char',
        answer      : reading,
        choices     : QuizEngine.shuffleChoices([reading, ...wrongs.slice(0,3)]),
        hint        : `Arti: ${item.meaning[0]}`,
        explanation : `${item.char} dibaca "${reading}" (${item.meaning[0]})`,
      };
    }
    // romaji-to-char
    const reading = item.onyomi[0] || item.kunyomi[0] || '';
    if (!reading) return null;
    const wrongs = QuizEngine.pickWrongAnswers(allItems, item.char, x => x.char, 3);
    return {
      question    : `${reading} — ${item.meaning[0]}`,
      questionType: 'text',
      answer      : item.char,
      choices     : QuizEngine.shuffleChoices([item.char, ...wrongs]),
      hint        : 'Pilih kanji yang tepat',
      explanation : `"${reading}" (${item.meaning[0]}) ditulis sebagai ${item.char}`,
    };
  }

  // ── Render question ────────────────────────────────────
  function renderQuestion() {
    const q = QuizEngine.getQuestion();
    if (!q) return;

    const p = QuizEngine.getProgress();

    // Progress
    document.getElementById('progressLabel').textContent = `Soal ${p.current + 1} dari ${p.total}`;
    document.getElementById('progressFill').style.width  = `${(p.current / p.total) * 100}%`;
    document.getElementById('scoreNum').textContent       = p.score;

    // Question
    const qChar = document.getElementById('qChar');
    const qText = document.getElementById('qText');
    const qHint = document.getElementById('qHint');

    if (q.questionType === 'char') {
      qChar.textContent     = q.question;
      qChar.style.display   = 'flex';
      qText.style.display   = 'none';
      document.getElementById('qLabel').textContent = selectedType === 'char-to-meaning'
        ? 'Apa arti kanji ini?' : 'Apa bacaan dari karakter ini?';
    } else {
      qText.textContent     = q.question;
      qText.style.display   = 'block';
      qChar.style.display   = 'none';
      document.getElementById('qLabel').textContent = 'Pilih karakter yang sesuai';
    }
    qHint.textContent = q.hint || '';

    // Reset feedback & next
    const fb = document.getElementById('feedback');
    fb.className = 'quiz-feedback';
    document.getElementById('nextBtn').style.display = 'none';

    const choicesGrid = document.getElementById('choicesGrid');
    const inputWrap   = document.getElementById('inputWrap');

    if (selectedMode === 'input') {
      // ── Mode Ketik ──────────────────────────────────
      choicesGrid.style.display = 'none';
      inputWrap.style.display   = 'flex';

      const inputField    = document.getElementById('quizInputField');
      const inputSubmit   = document.getElementById('inputSubmitBtn');
      const inputSkip     = document.getElementById('inputSkipBtn');
      const correctReveal = document.getElementById('correctReveal');
      const inputHint     = document.getElementById('inputHint');

      // Reset state input
      inputField.value = '';
      inputField.className = 'quiz-input-field';
      inputField.disabled  = false;
      inputSubmit.disabled = false;
      correctReveal.style.display = 'none';
      correctReveal.innerHTML = '';
      inputHint.textContent = q.questionType === 'char'
        ? 'Ketik dalam romaji atau kana' : 'Ketik karakter yang tepat';

      // Focus input
      setTimeout(() => inputField.focus(), 100);

      // Submit handler
      inputSubmit.onclick = () => submitInputAnswer(q);
      inputSkip.onclick   = () => submitInputAnswer(q, true);

      // Enter key submit
      inputField.onkeydown = (e) => {
        if (e.key === 'Enter' && !inputField.disabled) submitInputAnswer(q);
      };

    } else {
      // ── Mode Pilih ───────────────────────────────────
      choicesGrid.style.display = '';
      inputWrap.style.display   = 'none';

      choicesGrid.innerHTML = '';
      q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'quiz-choice';
        btn.textContent = choice;
        btn.addEventListener('click', () => onAnswer(choice));
        choicesGrid.appendChild(btn);
      });
    }

    // Timer
    const timerEl = document.getElementById('quizTimer');
    timerEl.className = 'quiz-timer';
    QuizEngine.startTimer(
      t => {
        timerEl.textContent = t;
        if (t <= 5) timerEl.classList.add('urgent');
      },
      () => {
        // Time expired
        if (selectedMode === 'input') {
          submitInputAnswer(QuizEngine.getQuestion(), true);
        } else {
          onAnswer(null);
        }
      }
    );
  }

  // ── Submit Input Answer ────────────────────────────────
  function submitInputAnswer(q, skip = false) {
    const inputField    = document.getElementById('quizInputField');
    const inputSubmit   = document.getElementById('inputSubmitBtn');
    const inputSkip     = document.getElementById('inputSkipBtn');
    const correctReveal = document.getElementById('correctReveal');

    const userRaw = skip ? '' : inputField.value.trim();

    // Normalize untuk perbandingan
    const normalize = s => s.toLowerCase().trim()
      .replace(/[ā]/g, 'a').replace(/[ī]/g, 'i').replace(/[ū]/g, 'u')
      .replace(/[ē]/g, 'e').replace(/[ō]/g, 'o');

    const userNorm   = normalize(userRaw);
    const correctNorm = normalize(q.answer);

    // Juga cek alternatif jawaban jika ada
    const alternatives = q.alternatives || [];
    const isCorrect = !skip && (
      userNorm === correctNorm ||
      alternatives.some(alt => normalize(alt) === userNorm)
    );

    const choice = skip ? null : (userRaw || null);
    const result = QuizEngine.answer(isCorrect ? q.answer : (choice || '__wrong__'));

    if (!result) return;

    // Lock input
    inputField.disabled  = true;
    inputSubmit.disabled = true;

    // Visual feedback pada input
    if (!skip && userRaw) {
      inputField.className = `quiz-input-field ${isCorrect ? 'input-correct' : 'input-wrong'}`;
    }

    // Reveal jawaban benar jika salah/skip
    if (!isCorrect) {
      correctReveal.style.display = 'block';
      correctReveal.innerHTML = `Jawaban benar: <strong>${result.answer}</strong>`;
    }

    // Feedback bar
    const fb     = document.getElementById('feedback');
    const fbIcon = document.getElementById('feedbackIcon');
    const fbText = document.getElementById('feedbackText');

    if (isCorrect) {
      fb.className    = 'quiz-feedback correct show';
      fbIcon.textContent = '✅';
      fbText.innerHTML   = `<strong>Benar!</strong> ${result.explanation}`;
      App.toast('Benar! +1', 'success', 1200);
    } else {
      fb.className    = 'quiz-feedback wrong show';
      fbIcon.textContent = skip ? '⏩' : '❌';
      fbText.innerHTML   = `<strong>${skip ? 'Dilewati.' : 'Kurang tepat.'}</strong> ${result.explanation}`;
    }

    document.getElementById('scoreNum').textContent = QuizEngine.getProgress().score;
    document.getElementById('nextBtn').style.display = 'block';
  }

  // ── On answer ──────────────────────────────────────────
  function onAnswer(choice) {
    const result = QuizEngine.answer(choice);
    if (!result) return;

    // Highlight choices
    document.querySelectorAll('.quiz-choice').forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === result.answer) btn.classList.add('correct');
      if (btn.textContent === choice && !result.correct) btn.classList.add('wrong');
    });

    // Feedback
    const fb     = document.getElementById('feedback');
    const fbIcon = document.getElementById('feedbackIcon');
    const fbText = document.getElementById('feedbackText');

    if (result.correct) {
      fb.className    = 'quiz-feedback correct show';
      fbIcon.textContent = '✅';
      fbText.innerHTML   = `<strong>Benar!</strong>${result.explanation}`;
      App.toast('Benar! +1', 'success', 1200);
    } else {
      fb.className    = 'quiz-feedback wrong show';
      fbIcon.textContent = '❌';
      fbText.innerHTML   = `<strong>${choice === null ? 'Waktu habis!' : 'Kurang tepat.'}</strong>${result.explanation}`;
    }

    document.getElementById('scoreNum').textContent = QuizEngine.getProgress().score;
    document.getElementById('nextBtn').style.display = 'block';
  }

  // ── Quiz Controls ──────────────────────────────────────
  function bindQuizControls() {
    document.getElementById('nextBtn').addEventListener('click', () => {
      const hasMore = QuizEngine.next();
      if (hasMore) {
        renderQuestion();
      }
      // jika tidak ada lagi, onFinish dipanggil dari QuizEngine
    });

    document.getElementById('retryBtn').addEventListener('click', () => {
      showScreen('session');
      const items = getDataset();
      QuizEngine.start(items, (item, all) => buildQuestion(item, all), {
        totalQuestions: selectedCount, timerSeconds: selectedMode === 'input' ? 30 : 20, moduleId: `quiz-jp-${selectedModule}`
      }, onFinish);
      renderQuestion();
    });

    document.getElementById('backToSelectBtn').addEventListener('click', () => {
      showScreen('select');
      renderBadges();
    });
  }

  // ── Finish ─────────────────────────────────────────────
  function onFinish(results, score, total) {
    isSessionActive = false;
    showScreen('result');

    const pct = Math.round((score / total) * 100);

    // Emoji & title
    let emoji = '😔', title = 'Coba Lagi!';
    if (pct === 100) { emoji = '🏆'; title = 'Sempurna!'; }
    else if (pct >= 80) { emoji = '🎉'; title = 'Luar Biasa!'; }
    else if (pct >= 60) { emoji = '👍'; title = 'Bagus!'; }
    else if (pct >= 40) { emoji = '🙂'; title = 'Lumayan!'; }

    document.getElementById('resultEmoji').textContent    = emoji;
    document.getElementById('resultTitle').textContent    = title;
    document.getElementById('resultSubtitle').textContent = `Kamu menjawab ${score} dari ${total} soal dengan benar.`;
    document.getElementById('resultScoreBig').textContent = score;
    document.getElementById('resultDenom').textContent    = `/ ${total}`;
    document.getElementById('statAccuracy').textContent   = pct + '%';
    document.getElementById('statCorrect').textContent    = score;
    document.getElementById('statWrong').textContent      = total - score;

    // Ring
    const circumference = 2 * Math.PI * 60; // r=60
    const fillLen = (score / total) * circumference;
    document.getElementById('ringFill').setAttribute('stroke-dasharray', `${fillLen} ${circumference}`);

    // Review
    const list = document.getElementById('reviewList');
    list.innerHTML = results.map(r => `
      <div class="quiz-review-item">
        <div class="review-icon">${r.correct ? '✅' : '❌'}</div>
        <div class="review-q">${r.question}</div>
        <div class="review-a ${r.correct ? 'review-correct' : 'review-wrong'}">
          ${r.correct ? r.answer : `${r.userAnswer || '—'} → ${r.answer}`}
        </div>
      </div>
    `).join('');

    renderBadges();
  }

  // ── Screen helpers ─────────────────────────────────────
  function showScreen(name) {
    selectScreen.className  = 'quiz-select-screen'  + (name === 'select'  ? '' : ' hidden');
    sessionScreen.className = 'quiz-session-screen' + (name === 'session' ? ' active' : '');
    resultScreen.className  = 'quiz-result-screen'  + (name === 'result'  ? ' active' : '');
  }

  // ── Badges ─────────────────────────────────────────────
  function renderBadges() {
    const grid  = document.getElementById('badgesGrid');
    const owned = BadgeSystem.getBadges();
    const defs  = BadgeSystem.getAllBadgeDefs();

    grid.innerHTML = defs.map(b => {
      const has  = !!owned[b.id];
      const date = has ? new Date(owned[b.id].earnedAt).toLocaleDateString('id-ID') : '';
      return `
        <div class="badge-item ${has ? '' : 'locked'}">
          <div class="badge-icon">${b.icon}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
          ${has ? `<div class="badge-date">${date}</div>` : ''}
        </div>
      `;
    }).join('');
  }

})();
