# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vite-powered static landing page.
- `index.html`: primary page structure and content sections.
- `src/main.js`: client-side behavior (reveal-on-scroll and dynamic footer year).
- `src/style.css`: design tokens, layout, component, and responsive styles.
- `public/`: static files served directly by Vite.
- `node_modules/`: installed dependencies (generated; never edit manually).

Automated tests are not set up yet, so validation is currently build + manual UI checks.

## Build, Test, and Development Commands
- `npm install`: install project dependencies.
- `npm run dev`: start local Vite dev server with hot reload.
- `npm run build`: create production bundle in `dist/`.
- `npm run preview`: serve the production build locally for smoke testing.

Run `npm run build` before opening a PR to catch syntax or bundling issues.

## Coding Style & Naming Conventions
- Use modern ES modules and vanilla JS (`type: module`).
- Follow existing 2-space indentation in HTML, CSS, and JS.
- Prefer `const`/`let`; avoid introducing global variables.
- CSS naming uses kebab-case classes (for example, `hero-grid`, `price-card`).
- State classes use the `is-*` pattern (for example, `is-visible`).
- Keep reusable colors/sizes in `:root` CSS variables instead of hardcoding values.

No formatter or linter is configured; keep style consistent with existing files.

## Testing Guidelines
There is no test framework configured today.
- Required checks for each change:
  1. `npm run build` passes.
  2. `npm run preview` works and key UI flows are verified manually.
- Manual checks should cover CTA links, anchor navigation, FAQ toggles, and reveal animations.

If behavior changes are non-trivial, include a short manual test checklist in the PR.

## Commit & Pull Request Guidelines
- Current history uses short, direct commit subjects (example: `First commit`).
- Write concise, imperative commit messages (ideally under 72 characters).
- Keep each commit scoped to one logical change.
- PRs should include:
  1. What changed and why.
  2. Validation steps run.
  3. Screenshots/GIFs for UI changes.
  4. Linked issue/task ID when available.

## Security & Configuration Tips
- Do not commit secrets, credentials, or private keys.
- Preserve safe external-link attributes (`target="_blank"` with `rel="noopener noreferrer"`).
- Re-check Russian copy edits for typos and consistency before merging.
