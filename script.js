const textInput = document.getElementById('text-input');
const wpmInput = document.getElementById('wpm-input');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
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

function getDelay() {
  const wpm = parseInt(wpmInput.value, 10) || 300;
  return Math.round(60000 / wpm);
}

function showWord() {
  if (index >= words.length) {
    stop();
    return;
  }
  renderWord(words[index]);
  progressEl.textContent = `${index + 1} / ${words.length}`;
  index++;
}

function start() {
  const raw = textInput.value.trim();
  if (!raw) return;

  if (!running) {
    words = raw.split(/\s+/);
    index = 0;
  }

  running = true;
  btnStart.disabled = true;
  btnPause.disabled = false;
  btnStop.disabled = false;
  textInput.disabled = true;

  showWord();
  intervalId = setInterval(showWord, getDelay());
}

function pause() {
  clearInterval(intervalId);
  intervalId = null;
  running = false;
  btnStart.textContent = 'Resume';
  btnStart.disabled = false;
  btnPause.disabled = true;
}

function stop() {
  clearInterval(intervalId);
  intervalId = null;
  running = false;
  words = [];
  index = 0;
  wordEl.textContent = '';
  progressEl.textContent = '0 / 0';
  btnStart.textContent = 'Start';
  btnStart.disabled = false;
  btnPause.disabled = true;
  btnStop.disabled = true;
  textInput.disabled = false;
}

btnStart.addEventListener('click', start);
btnPause.addEventListener('click', pause);
btnStop.addEventListener('click', stop);
