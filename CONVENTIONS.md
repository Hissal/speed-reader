# Conventions — SpeedReader

> Keep this file short. Decisions only.

## Code Style

- **Formatter:** _TODO_ (Prettier recommended)
- **Linter:** _TODO_ (ESLint recommended)
- **Line length:** 100
- **Quotes:** single
- **Semicolons:** yes

## Naming

- **Files/folders:** `kebab-case`
- **Variables/functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Booleans:** prefix with `is`, `has`, or `should` (e.g. `isRunning`)

## Commits

Format: `<type>: <short description>` (imperative, lowercase, no period)

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Tooling, deps, config |
| `docs` | Documentation only |
| `refactor` | No behavior change |
| `style` | CSS/visual changes only |

## Branches

- `main` — always deployable
- `feat/<name>` — new features
- `fix/<name>` — bug fixes
- `chore/<name>` — maintenance

## Pull Requests

- Keep PRs small and focused
- Self-review before requesting review

## What Goes Where

- All app logic → `script.js`
- All styles → `style.css`
- Structure/markup → `index.html`
