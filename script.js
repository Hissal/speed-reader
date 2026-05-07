const textInput = document.getElementById('text-input');
const wpmInput = document.getElementById('wpm-input');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnStop = document.getElementById('btn-stop');
const wordEl = document.getElementById('word');
const progressEl = document.getElementById('progress-text');

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
  wordEl.textContent = words[index];
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
