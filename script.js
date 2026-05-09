const textInput = document.getElementById('text-input');
const wpmInput = document.getElementById('wpm-input');
const btnStart = document.getElementById('btn-start');
const wordEl = document.getElementById('word');
const progressEl = document.getElementById('progress-text');

function getOrpIndex(word) {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

function renderWord(word) {
  const i = getOrpIndex(word);
  const before = word.slice(0, i);
  const orp = word.charAt(i);
  const after = word.slice(i + 1);
  wordEl.innerHTML =
    `<span class="word-before">${before}</span>` +
    `<span class="word-orp">${orp}</span>` +
    `<span class="word-after">${after}</span>`;
}

let words = [];
let index = 0;
let intervalId = null;
let running = false;
let commaMultiplier = 1.5;
let periodMultiplier = 2.0;

function getDelay() {
  const wpm = parseInt(wpmInput.value, 10) || 300;
  const base = Math.round(60000 / wpm);
  if (index === 0 || index > words.length) return base;
  const prev = words[index - 1];
  const lastChar = prev.charAt(prev.length - 1);
  if (/[.!?]/.test(lastChar)) return Math.round(base * periodMultiplier);
  if (/[,;:]/.test(lastChar)) return Math.round(base * commaMultiplier);
  return base;
}

function getPlayState() {
  if (running) return 'pause';
  if (words.length === 0 || index >= words.length) return 'start';
  return 'resume';
}

function updatePlayButtons() {
  const state = getPlayState();
  const label = state === 'pause' ? 'Pause' : state === 'resume' ? 'Resume' : 'Start';
  btnStart.textContent = label;
  if (typeof btnReaderPlay !== 'undefined' && btnReaderPlay) btnReaderPlay.textContent = label;
}

function showWord() {
  if (index >= words.length) {
    clearTimeout(intervalId);
    intervalId = null;
    running = false;
    textInput.disabled = false;
    updatePlayButtons();
    return;
  }
  renderWord(words[index]);
  progressEl.textContent = `${wpmInput.value} wpm`;
  index++;
  intervalId = setTimeout(showWord, getDelay());
}

function start() {
  const state = getPlayState();
  if (state === 'pause') return;

  if (state === 'start') {
    const raw = textInput.value.trim();
    if (!raw) return;
    words = raw.split(/\s+/);
    index = 0;
  }

  running = true;
  textInput.disabled = true;
  showWord();
  updatePlayButtons();
}

function pause() {
  clearTimeout(intervalId);
  intervalId = null;
  running = false;
  updatePlayButtons();
}

function togglePlay() {
  if (running) pause();
  else start();
}

btnStart.addEventListener('click', togglePlay);

textInput.addEventListener('input', () => {
  if (!running && words.length > 0) {
    words = [];
    index = 0;
    updatePlayButtons();
  }
});

const btnSettings = document.getElementById('btn-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const drawer = document.getElementById('settings-drawer');
const selectTheme = document.getElementById('select-theme');
const selectFont = document.getElementById('select-font');

function openDrawer() { drawer.classList.remove('closed'); }
function closeDrawer() { drawer.classList.add('closed'); }

function applyTheme(theme) {
  document.body.classList.remove('theme-amber', 'theme-cyan');
  if (theme === 'amber') document.body.classList.add('theme-amber');
  else if (theme === 'cyan') document.body.classList.add('theme-cyan');
}

function applyFont(font) {
  document.body.classList.remove('font-sans', 'font-mono');
  if (font === 'sans') document.body.classList.add('font-sans');
  else if (font === 'mono') document.body.classList.add('font-mono');
}

btnSettings.addEventListener('click', () => drawer.classList.toggle('closed'));
btnCloseSettings.addEventListener('click', closeDrawer);
selectTheme.addEventListener('change', (e) => applyTheme(e.target.value));
selectFont.addEventListener('change', (e) => applyFont(e.target.value));

const STORAGE_KEY = 'speedreader-settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.wpm) wpmInput.value = s.wpm;
    if (s.theme) {
      selectTheme.value = s.theme;
      applyTheme(s.theme);
    }
    if (s.font) {
      selectFont.value = s.font;
      applyFont(s.font);
    }
    if (s.guideWidth != null) {
      rangeGuideWidth.value = s.guideWidth;
      applyGuideWidth(s.guideWidth);
    }
    if (s.guideLength != null) {
      rangeGuideLength.value = s.guideLength;
      applyGuideLength(s.guideLength);
    }
    if (s.guideOffset != null) {
      rangeGuideOffset.value = s.guideOffset;
      applyGuideOffset(s.guideOffset);
    }
    if (s.pauseComma != null) {
      rangePauseComma.value = s.pauseComma;
      applyPauseComma(s.pauseComma);
    }
    if (s.pausePeriod != null) {
      rangePausePeriod.value = s.pausePeriod;
      applyPausePeriod(s.pausePeriod);
    }
    if (s.wordSize != null) {
      rangeWordSize.value = s.wordSize;
      applyWordSize(s.wordSize);
    }
  } catch (e) {
    // ignore corrupt storage
  }
}

function saveSettings() {
  const s = {
    wpm: wpmInput.value,
    theme: selectTheme.value,
    font: selectFont.value,
    guideWidth: rangeGuideWidth.value,
    guideLength: rangeGuideLength.value,
    guideOffset: rangeGuideOffset.value,
    pauseComma: rangePauseComma.value,
    pausePeriod: rangePausePeriod.value,
    wordSize: rangeWordSize.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

wpmInput.addEventListener('change', saveSettings);
selectTheme.addEventListener('change', saveSettings);
selectFont.addEventListener('change', saveSettings);

const btnFullscreen = document.getElementById('btn-fullscreen');
const btnReaderPlay = document.getElementById('btn-reader-play');
const btnReaderFullscreen = document.getElementById('btn-reader-fullscreen');

function enterReaderMode() {
  document.body.classList.add('reader-mode');
}

function exitReaderMode() {
  document.body.classList.remove('reader-mode');
}

function toggleReaderMode() {
  if (document.body.classList.contains('reader-mode')) exitReaderMode();
  else enterReaderMode();
}

btnFullscreen.addEventListener('click', toggleReaderMode);
btnReaderFullscreen.addEventListener('click', exitReaderMode);
btnReaderPlay.addEventListener('click', togglePlay);

updatePlayButtons();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('reader-mode')) {
    exitReaderMode();
  }
  if (e.key === ' ' && document.body.classList.contains('reader-mode')) {
    e.preventDefault();
    togglePlay();
  }
});

const rangeGuideWidth = document.getElementById('range-guide-width');
const rangeGuideLength = document.getElementById('range-guide-length');
const rangeGuideOffset = document.getElementById('range-guide-offset');
const outGuideWidth = document.getElementById('out-guide-width');
const outGuideLength = document.getElementById('out-guide-length');
const outGuideOffset = document.getElementById('out-guide-offset');

function applyGuideWidth(v) {
  document.documentElement.style.setProperty('--guide-width', `${v}px`);
  outGuideWidth.textContent = v;
}
function applyGuideLength(v) {
  document.documentElement.style.setProperty('--guide-length', `${v}px`);
  outGuideLength.textContent = v;
}
function applyGuideOffset(v) {
  document.documentElement.style.setProperty('--guide-offset', `${v}%`);
  outGuideOffset.textContent = v;
}

rangeGuideWidth.addEventListener('input', (e) => applyGuideWidth(e.target.value));
rangeGuideLength.addEventListener('input', (e) => applyGuideLength(e.target.value));
rangeGuideOffset.addEventListener('input', (e) => applyGuideOffset(e.target.value));

const rangePauseComma = document.getElementById('range-pause-comma');
const rangePausePeriod = document.getElementById('range-pause-period');
const outPauseComma = document.getElementById('out-pause-comma');
const outPausePeriod = document.getElementById('out-pause-period');

function applyPauseComma(v) {
  commaMultiplier = parseFloat(v);
  outPauseComma.textContent = commaMultiplier.toFixed(1);
}
function applyPausePeriod(v) {
  periodMultiplier = parseFloat(v);
  outPausePeriod.textContent = periodMultiplier.toFixed(1);
}

rangePauseComma.addEventListener('input', (e) => applyPauseComma(e.target.value));
rangePausePeriod.addEventListener('input', (e) => applyPausePeriod(e.target.value));

const rangeWordSize = document.getElementById('range-word-size');
const outWordSize = document.getElementById('out-word-size');

function applyWordSize(v) {
  document.documentElement.style.setProperty('--word-size', `${v}rem`);
  outWordSize.textContent = parseFloat(v).toFixed(1);
}

rangeWordSize.addEventListener('input', (e) => applyWordSize(e.target.value));

rangeGuideWidth.addEventListener('change', saveSettings);
rangeGuideLength.addEventListener('change', saveSettings);
rangeGuideOffset.addEventListener('change', saveSettings);
rangePauseComma.addEventListener('change', saveSettings);
rangePausePeriod.addEventListener('change', saveSettings);
rangeWordSize.addEventListener('change', saveSettings);

loadSettings();
