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

- **RSVP display**: One word shown at a time in fixed center position. No eye movement needed.
- **ORP (Optimal Recognition Point)**: One letter per word highlighted as the visual focal point. Spritz-style algorithm picks letter index by word length: 1ch→0, 2-5ch→1, 6-9ch→2, 10-13ch→3, 14+→4.
- **WPM timing**: Base interval = `60000 / wpm` ms. Punctuation extends: 1.5× for `,;:`, 2× for `.!?`.
- **Reader mode**: Fullscreen takeover. Body gets `.reader-mode` class. Hides input/header/drawer. ESC or Exit button leaves mode. Spacebar pauses/resumes.
- **Themes**: CSS custom properties on `:root`. Theme classes on `<body>` (`.theme-amber`, `.theme-cyan`) override `--orp` and `--guide`.
- **Fonts**: `--font-reader` CSS var. Font classes on `<body>` (`.font-sans`, `.font-mono`) switch reader font family.
- **Persistence**: WPM, theme, font saved to `localStorage` under key `speedreader-settings`. Restored on load.

## Key Variables (script.js)

| Variable | Purpose |
|----------|---------|
| `words` | Array of words split from input text |
| `index` | Current position in `words` |
| `intervalId` | Reference to current `setTimeout` — cleared on pause/stop |
| `running` | Boolean — true while actively displaying words |
| `STORAGE_KEY` | localStorage key for settings persistence |

## Patterns & Conventions

- All DOM references captured once at top of `script.js`
- No modules — single script file
- No external dependencies

## External Services & Dependencies

None.

## Known Gotchas

- `textInput.disabled = true` during reading prevents editing mid-session
- Resume reuses existing `words` array and `index` — does not re-parse text
- ORP anchoring uses fixed-width left/right slots (`.word-before` / `.word-after` at 50% each, with `margin-left: -1ch` on after) so the ORP letter stays at horizontal center across word lengths. If you change slot widths, verify ORP stays anchored.
- `setTimeout` chain (not `setInterval`) is required for variable per-word delay (punctuation pause).
- Fullscreen mode is CSS-only (`.reader-mode` body class) — does not use the Fullscreen API. Browser chrome remains visible.
