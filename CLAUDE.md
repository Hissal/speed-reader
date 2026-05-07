# AI Agent Context — SpeedReader

This file provides context for AI assistants and coding agents working in this repository.
It is mirrored as both `CLAUDE.md` and `AGENTS.md` — keep them in sync.

## Project Overview

SpeedReader allows reading text extremely fast by displaying one word at a time anchored in one position (RSVP-style reading).

**Stack:** Pure HTML/CSS/JS — no build step, no framework, runs directly in browser.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | App structure and layout |
| `style.css` | All styles |
| `script.js` | All app logic (word display, timing, controls) |
| `CODEBASE.md` | Architecture, folder map, core concepts |
| `llm-guidelines.md` | Behavioral guidelines for LLMs |
| `CONVENTIONS.md` | Code style, naming, commits, PR process |

## Quick Reference

- No build step — open `index.html` directly in browser
- All logic in `script.js`, no modules or bundler
- Read `CODEBASE.md` before making structural changes
- Follow conventions in `llm-guidelines.md`
- When in doubt, ask before refactoring

## Notes

_Add project-specific conventions, gotchas, or constraints here._
