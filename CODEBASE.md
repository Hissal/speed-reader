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

- **RSVP display**: One word shown at a time in a fixed center position. No eye movement needed.
- **WPM timing**: Interval between words = `60000 / wpm` ms.
- **State machine**: idle → running → paused → idle. Managed via `running` flag and `intervalId`.

## Key Variables (script.js)

| Variable | Purpose |
|----------|---------|
| `words` | Array of words split from input text |
| `index` | Current position in `words` |
| `intervalId` | Reference to `setInterval` — cleared on pause/stop |
| `running` | Boolean — true while actively displaying words |

## Patterns & Conventions

- All DOM references captured once at top of `script.js`
- No modules — single script file
- No external dependencies

## External Services & Dependencies

None.

## Known Gotchas

- `textInput.disabled = true` during reading prevents editing mid-session
- Resume reuses existing `words` array and `index` — does not re-parse text
