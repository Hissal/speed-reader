# Codebase Overview — SpeedReader

> This file is a living document. Update it as the project evolves.

## Description

SpeedReader allows reading text extremely fast by displaying one word at a time anchored in one position (RSVP — Rapid Serial Visual Presentation).

## Stack

Pure HTML/CSS/JS. No framework, no bundler, no build step. Open `index.html` directly in browser.

## Folder Map

```
SpeedReader/
├── index.html       # App shell and layout
├── style.css        # All styles
├── script.js        # All app logic
├── README.md
├── LICENSE
├── CLAUDE.md        # AI agent context (mirrored in AGENTS.md)
├── AGENTS.md
├── llm-guidelines.md
├── CODEBASE.md      # This file
├── CONVENTIONS.md
├── .gitignore
├── .editorconfig
└── .github/
    └── workflows/
        └── ci.yml
```

## Core Concepts

- **RSVP display**: One word shown at a time. ORP letter centered via CSS Grid `1fr auto 1fr`.
- **ORP (Optimal Recognition Point)**: Spritz-style letter selection by length: 1ch→0, 2-5ch→1, 6-9ch→2, 10-13ch→3, 14+→4.
- **Play state machine**: Single button label derived from `(running, words.length, index)`. States: `start` (idle or finished), `pause` (running), `resume` (paused mid-text). Same label mirrored on inline and reader-mode buttons.
- **WPM timing**: Base = `60000 / wpm` ms. `commaMultiplier` and `periodMultiplier` scale it on `,;:` and `.!?`. Multipliers user-tunable via sliders.
- **Reader mode (fullscreen)**: Independent of playback. Toggling does not pause. ESC exits fullscreen only. Body class `.reader-mode` drives layout.
- **Guide lines**: Two pseudo-elements on `#word-display`. Geometry from CSS vars `--guide-width`, `--guide-length`, `--guide-offset`. Sliders set vars on `document.documentElement`.
- **Word font size**: CSS var `--word-size` (rem). Inline view uses it directly; reader mode multiplies by 1.33 via `calc()`.
- **Themes**: `:root` base + body class overrides for `--orp` and `--guide`.
- **Fonts**: `--font-reader` switched by body class.
- **Persistence**: All settings in localStorage under `speedreader-settings`.

## Key Variables (script.js)

| Variable | Purpose |
|----------|---------|
| `words` | Array of words split from input text |
| `index` | Current position in `words` |
| `intervalId` | Reference to current `setTimeout` — null when paused/finished |
| `running` | Boolean — true while actively displaying words |
| `commaMultiplier` | Pause multiplier for `,;:` (default 1.5) |
| `periodMultiplier` | Pause multiplier for `.!?` (default 2.0) |
| `STORAGE_KEY` | localStorage key for settings persistence |

## Patterns & Conventions

- All DOM references captured once at top of `script.js`
- No modules — single script file
- No external dependencies

## External Services & Dependencies

None.

## Known Gotchas

- ORP centering uses CSS Grid `1fr auto 1fr` so the ORP letter sits dead-center horizontally regardless of word length. Do not switch back to inline-block + width:50% slots — that approach overlaps adjacent letters or wraps to two lines.
- `setTimeout` chain (not `setInterval`) is required for variable per-word delay (punctuation pause).
- Reader mode is CSS-only (`.reader-mode` body class). It does not call the Fullscreen API.
- Mode toggle is decoupled from playback. Entering/exiting fullscreen never starts, pauses, or stops reading.
- Editing the textarea while not running clears `words[]` so the next Start click re-parses the new text.
- Guide line CSS vars are set on `document.documentElement` (not `<body>`) so they cascade everywhere.
- `loadSettings()` runs at the end of `script.js` after all range refs are declared. Don't move it earlier or TDZ errors will fire on first load.
