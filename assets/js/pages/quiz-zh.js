/**
 * NihonHan - Quiz Mandarin Page
 * Hanzi, Pinyin, Kosakata quiz dengan multiple choice & mode ketik.
 * Fase 13: Tambah Mode Input Jawaban
 */
(() => {
  if (!Router.guard()) return;
  App.init('quiz-zh');

  // ── State ──────────────────────────────────────────────
  let selectedModule = null;
  let selectedType   = 'char-to-meaning';
  let selectedCount  = 10;
  let selectedHLevel = 'all';
  let selectedTheme  = 'all';
  let selectedMode   = 'choice'; // 'choice' | 'input'

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
  bindHskLevelOptions();
  bindVocabThemeOptions();
  bindQuizControls();

  // ── Module cards ───────────────────────────────────────
  function bindModuleCards() {
    document.querySelectorAll('.quiz-module-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.quiz-module-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedModule = card.dataset.module;

        document.getElementById('hskLevelPanel').style.display   = selectedModule === 'hanzi' ? 'block' : 'none';
        document.getElementById('vocabThemePanel').style.display  = selectedModule === 'vocab' ? 'block' : 'none';

        updateTypeOptionsForModule();

        startBtn.disabled    = false;
        startBtn.textContent = 'Mulai Quiz ' + card.querySelector('.card-title').textContent;
      });
    });
  }

  function updateTypeOptionsForModule() {
    const pinyinBtn = document.querySelector('[data-type="char-to-pinyin"]');
    if (selectedModule === 'vocab') {
      pinyinBtn.style.display = 'none';
      if (selectedType === 'char-to-pinyin') {
        selectedType = 'char-to-meaning';
        syncActiveType();
      }
    } else {
      pinyinBtn.style.display = '';
    }
  }

  function syncActiveType() {
    document.querySelectorAll('#typeOptions .quiz-type-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.type === selectedType);
    });
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

  // ── Config options ─────────────────────────────────────
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

  function bindHskLevelOptions() {
    document.querySelectorAll('#hskLevelOptions .quiz-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#hskLevelOptions .quiz-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedHLevel = btn.dataset.hlevel;
      });
    });
  }

  function bindVocabThemeOptions() {
    document.querySelectorAll('#vocabThemeOptions .quiz-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#vocabThemeOptions .quiz-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTheme = btn.dataset.theme;
      });
    });
  }

  // ── Start ──────────────────────────────────────────────
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
      { totalQuestions: selectedCount, timerSeconds: selectedMode === 'input' ? 30 : 20, moduleId: 'quiz-zh-' + selectedModule },
      onFinish
    );

    if (!ok) { App.toast('Gagal membuat soal.', 'error'); return; }

    showScreen('session');
    renderQuestion();
  });

  // ── Dataset ────────────────────────────────────────────
  function getDataset() {
    if (selectedModule === 'hanzi' || selectedModule === 'pinyin') {
      if (selectedHLevel === 'all') return HanziData.all;
      return HanziData.getByHsk(parseInt(selectedHLevel));
    }
    if (selectedModule === 'vocab') {
      if (selectedTheme === 'all') return ZhVocabData.vocab;
      return ZhVocabData.getByTheme(selectedTheme);
    }
    return [];
  }

  // ── Build question ─────────────────────────────────────
  function buildQuestion(item, allItems) {
    if (selectedModule === 'vocab') {
      return buildVocabQuestion(item, allItems);
    }
    return buildHanziQuestion(item, allItems);
  }

  function buildHanziQuestion(item, allItems) {
    if (selectedType === 'char-to-meaning') {
      const wrongs = QuizEngine.pickWrongAnswers(allItems, item.meaning[0], x => x.meaning[0], 3);
      return {
        question    : item.char,
        questionType: 'char',
        answer      : item.meaning[0],
        choices     : QuizEngine.shuffleChoices([item.meaning[0], ...wrongs]),
        hint        : item.pinyin,
        explanation : item.char + ' (' + item.pinyin + ') = ' + item.meaning.join(', '),
        alternatives: item.meaning.slice(1),
      };
    }
    if (selectedType === 'char-to-pinyin') {
      const wrongs = QuizEngine.pickWrongAnswers(allItems, item.pinyin, x => x.pinyin, 3);
      return {
        question    : item.char,
        questionType: 'char',
        answer      : item.pinyin,
        choices     : QuizEngine.shuffleChoices([item.pinyin, ...wrongs]),
        hint        : 'Arti: ' + item.meaning[0],
        explanation : item.char + ' dibaca "' + item.pinyin + '" — ' + item.meaning[0],
      };
    }
    // meaning-to-char
    const wrongs = QuizEngine.pickWrongAnswers(allItems, item.char, x => x.char, 3);
    return {
      question    : item.meaning[0],
      questionType: 'text',
      answer      : item.char,
      choices     : QuizEngine.shuffleChoices([item.char, ...wrongs]),
      hint        : 'Pinyin: ' + item.pinyin,
      explanation : '"' + item.meaning[0] + '" ditulis sebagai ' + item.char + ' (' + item.pinyin + ')',
    };
  }

  function buildVocabQuestion(item, allItems) {
    if (selectedType === 'char-to-meaning') {
      const wrongs = QuizEngine.pickWrongAnswers(allItems, item.meaning, x => x.meaning, 3);
      return {
        question    : item.word,
        questionType: 'char',
        answer      : item.meaning,
        choices     : QuizEngine.shuffleChoices([item.meaning, ...wrongs]),
        hint        : item.pinyin,
        explanation : item.word + ' (' + item.pinyin + ') = ' + item.meaning,
      };
    }
    // meaning-to-char
    const wrongs = QuizEngine.pickWrongAnswers(allItems, item.word, x => x.word, 3);
    return {
      question    : item.meaning,
      questionType: 'text',
      answer      : item.word,
      choices     : QuizEngine.shuffleChoices([item.word, ...wrongs]),
      hint        : 'Pinyin: ' + item.pinyin,
      explanation : '"' + item.meaning + '" = ' + item.word + ' (' + item.pinyin + ')',
    };
  }

  // ── Render question ────────────────────────────────────
  function renderQuestion() {
    const q = QuizEngine.getQuestion();
    if (!q) return;

    const p = QuizEngine.getProgress();
    document.getElementById('progressLabel').textContent = 'Soal ' + (p.current + 1) + ' dari ' + p.total;
    document.getElementById('progressFill').style.width  = ((p.current / p.total) * 100) + '%';
    document.getElementById('scoreNum').textContent       = p.score;

    const qChar  = document.getElementById('qChar');
    const qText  = document.getElementById('qText');
    const qHint  = document.getElementById('qHint');
    const qLabel = document.getElementById('qLabel');

    if (q.questionType === 'char') {
      qChar.textContent   = q.question;
      qChar.style.display = 'flex';
      qText.style.display = 'none';
      if (selectedType === 'char-to-meaning') qLabel.textContent = 'Apa arti karakter ini?';
      else if (selectedType === 'char-to-pinyin') qLabel.textContent = 'Bagaimana bacaan pinyin-nya?';
      else qLabel.textContent = 'Tebak artinya!';
    } else {
      qText.textContent   = q.question;
      qText.style.display = 'block';
      qChar.style.display = 'none';
      qLabel.textContent  = selectedMode === 'input' ? 'Ketik karakternya!' : 'Pilih karakter yang sesuai';
    }
    qHint.textContent = q.hint || '';

    const fb = document.getElementById('feedback');
    fb.className = 'quiz-feedback';
    document.getElementById('nextBtn').style.display = 'none';

    const choicesGrid = document.getElementById('choicesGrid');
    const inputWrap   = document.getElementById('inputWrap');

    if (selectedMode === 'input') {
      choicesGrid.style.display = 'none';
      inputWrap.style.display   = 'flex';

      const inputField    = document.getElementById('quizInputField');
      const inputSubmit   = document.getElementById('inputSubmitBtn');
      const inputSkip     = document.getElementById('inputSkipBtn');
      const correctReveal = document.getElementById('correctReveal');
      const inputHint     = document.getElementById('inputHint');

      inputField.value = '';
      inputField.className = 'quiz-input-field';
      inputField.disabled  = false;
      inputSubmit.disabled = false;
      correctReveal.style.display = 'none';
      correctReveal.innerHTML = '';

      if (selectedType === 'char-to-pinyin') {
        inputHint.textContent = 'Ketik dalam pinyin (contoh: ni hao atau nǐ hǎo)';
      } else if (q.questionType === 'text') {
        inputHint.textContent = 'Ketik karakter Mandarin yang tepat';
      } else {
        inputHint.textContent = 'Ketik arti dalam Bahasa Indonesia';
      }

      setTimeout(function() { inputField.focus(); }, 100);

      inputSubmit.onclick  = function() { submitInputAnswer(q); };
      inputSkip.onclick    = function() { submitInputAnswer(q, true); };
      inputField.onkeydown = function(e) {
        if (e.key === 'Enter' && !inputField.disabled) submitInputAnswer(q);
      };

    } else {
      choicesGrid.style.display = '';
      inputWrap.style.display   = 'none';

      choicesGrid.innerHTML = '';
      q.choices.forEach(function(choice) {
        const btn = document.createElement('button');
        btn.className   = 'quiz-choice';
        btn.textContent = choice;
        btn.addEventListener('click', function() { onAnswer(choice); });
        choicesGrid.appendChild(btn);
      });
    }

    const timerEl = document.getElementById('quizTimer');
    timerEl.className = 'quiz-timer';
    QuizEngine.startTimer(
      function(t) {
        timerEl.textContent = t;
        if (t <= 5) timerEl.classList.add('urgent');
      },
      function() {
        if (selectedMode === 'input') {
          submitInputAnswer(QuizEngine.getQuestion(), true);
        } else {
          onAnswer(null);
        }
      }
    );
  }

  // ── Submit Input Answer ────────────────────────────────
  function submitInputAnswer(q, skip) {
    skip = skip || false;
    const inputField    = document.getElementById('quizInputField');
    const inputSubmit   = document.getElementById('inputSubmitBtn');
    const correctReveal = document.getElementById('correctReveal');

    var userRaw = skip ? '' : inputField.value.trim();

    function normalizePinyin(s) {
      return s.toLowerCase().trim()
        .replace(/[āáǎà]/g, 'a').replace(/[ēéěè]/g, 'e')
        .replace(/[īíǐì]/g, 'i').replace(/[ōóǒò]/g, 'o')
        .replace(/[ūúǔù]/g, 'u').replace(/[ǖǘǚǜ]/g, 'v');
    }

    var userNorm    = normalizePinyin(userRaw);
    var correctNorm = normalizePinyin(q.answer);
    var alternatives = q.alternatives || [];

    var isCorrect = !skip && (
      userNorm === correctNorm ||
      alternatives.some(function(alt) { return normalizePinyin(alt) === userNorm; })
    );

    var choice = skip ? null : (userRaw || null);
    var result = QuizEngine.answer(isCorrect ? q.answer : (choice || '__wrong__'));
    if (!result) return;

    inputField.disabled  = true;
    inputSubmit.disabled = true;

    if (!skip && userRaw) {
      inputField.className = 'quiz-input-field ' + (isCorrect ? 'input-correct' : 'input-wrong');
    }

    if (!isCorrect) {
      correctReveal.style.display = 'block';
      correctReveal.innerHTML = 'Jawaban benar: <strong>' + result.answer + '</strong>';
    }

    var fb     = document.getElementById('feedback');
    var fbIcon = document.getElementById('feedbackIcon');
    var fbText = document.getElementById('feedbackText');

    if (isCorrect) {
      fb.className       = 'quiz-feedback correct show';
      fbIcon.textContent = '✅';
      fbText.innerHTML   = '<strong>Benar!</strong> ' + result.explanation;
      App.toast('Benar! +1', 'success', 1200);
    } else {
      fb.className       = 'quiz-feedback wrong show';
      fbIcon.textContent = skip ? '⏩' : '❌';
      fbText.innerHTML   = '<strong>' + (skip ? 'Dilewati.' : 'Kurang tepat.') + '</strong> ' + result.explanation;
    }

    document.getElementById('scoreNum').textContent = QuizEngine.getProgress().score;
    document.getElementById('nextBtn').style.display = 'block';
  }

  // ── On answer (mode pilih) ─────────────────────────────
  function onAnswer(choice) {
    var result = QuizEngine.answer(choice);
    if (!result) return;

    document.querySelectorAll('.quiz-choice').forEach(function(btn) {
      btn.disabled = true;
      if (btn.textContent === result.answer) btn.classList.add('correct');
      if (btn.textContent === choice && !result.correct) btn.classList.add('wrong');
    });

    var fb     = document.getElementById('feedback');
    var fbIcon = document.getElementById('feedbackIcon');
    var fbText = document.getElementById('feedbackText');

    if (result.correct) {
      fb.className       = 'quiz-feedback correct show';
      fbIcon.textContent = '✅';
      fbText.innerHTML   = '<strong>Benar!</strong>' + result.explanation;
      App.toast('Benar! +1', 'success', 1200);
    } else {
      fb.className       = 'quiz-feedback wrong show';
      fbIcon.textContent = '❌';
      fbText.innerHTML   = '<strong>' + (choice === null ? 'Waktu habis!' : 'Kurang tepat.') + '</strong>' + result.explanation;
    }

    document.getElementById('scoreNum').textContent = QuizEngine.getProgress().score;
    document.getElementById('nextBtn').style.display = 'block';
  }

  // ── Next ───────────────────────────────────────────────
  function bindQuizControls() {
    document.getElementById('nextBtn').addEventListener('click', function() {
      var hasMore = QuizEngine.next();
      if (hasMore) renderQuestion();
    });

    document.getElementById('retryBtn').addEventListener('click', function() {
      showScreen('session');
      var items = getDataset();
      QuizEngine.start(items, buildQuestion, {
        totalQuestions: selectedCount,
        timerSeconds: selectedMode === 'input' ? 30 : 20,
        moduleId: 'quiz-zh-' + selectedModule
      }, onFinish);
      renderQuestion();
    });

    document.getElementById('backToSelectBtn').addEventListener('click', function() {
      showScreen('select');
      renderBadges();
    });
  }

  // ── Finish ─────────────────────────────────────────────
  function onFinish(results, score, total) {
    showScreen('result');

    var pct = Math.round((score / total) * 100);
    var emoji = '😔', title = 'Coba Lagi!';
    if (pct === 100) { emoji = '🏆'; title = 'Sempurna!'; }
    else if (pct >= 80) { emoji = '🎉'; title = 'Luar Biasa!'; }
    else if (pct >= 60) { emoji = '👍'; title = 'Bagus!'; }
    else if (pct >= 40) { emoji = '🙂'; title = 'Lumayan!'; }

    document.getElementById('resultEmoji').textContent    = emoji;
    document.getElementById('resultTitle').textContent    = title;
    document.getElementById('resultSubtitle').textContent = 'Kamu menjawab ' + score + ' dari ' + total + ' soal dengan benar.';
    document.getElementById('resultScoreBig').textContent = score;
    document.getElementById('resultDenom').textContent    = '/ ' + total;
    document.getElementById('statAccuracy').textContent   = pct + '%';
    document.getElementById('statCorrect').textContent    = score;
    document.getElementById('statWrong').textContent      = total - score;

    var circumference = 2 * Math.PI * 60;
    var fillLen = (score / total) * circumference;
    document.getElementById('ringFill').setAttribute('stroke-dasharray', fillLen + ' ' + circumference);

    var list = document.getElementById('reviewList');
    list.innerHTML = results.map(function(r) {
      return '<div class="quiz-review-item">' +
        '<div class="review-icon">' + (r.correct ? '✅' : '❌') + '</div>' +
        '<div class="review-q">' + r.question + '</div>' +
        '<div class="review-a ' + (r.correct ? 'review-correct' : 'review-wrong') + '">' +
          (r.correct ? r.answer : ((r.userAnswer || '—') + ' → ' + r.answer)) +
        '</div>' +
        '</div>';
    }).join('');

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
    var grid  = document.getElementById('badgesGrid');
    var owned = BadgeSystem.getBadges();
    var defs  = BadgeSystem.getAllBadgeDefs();
    grid.innerHTML = defs.map(function(b) {
      var has  = !!owned[b.id];
      var date = has ? new Date(owned[b.id].earnedAt).toLocaleDateString('id-ID') : '';
      return '<div class="badge-item ' + (has ? '' : 'locked') + '">' +
        '<div class="badge-icon">' + b.icon + '</div>' +
        '<div class="badge-name">' + b.name + '</div>' +
        '<div class="badge-desc">' + b.desc + '</div>' +
        (has ? '<div class="badge-date">' + date + '</div>' : '') +
        '</div>';
    }).join('');
  }

})();
