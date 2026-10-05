# Cookbook Project — Claude Code Context

## What This Project Is

Jacob's Cookbook: a personal AI-powered recipe site. NYT Cooking-inspired browsing, plus an AI Kitchen chat that drafts recipes for a human to review and publish. Public read-only browsing; editing is limited to whitelisted Google accounts.

Live: https://jacobs-cookbook.web.app · Firebase project: `jacobs-cookbook` · Current plan: `docs/v5.0-plan.md`

## Stack

- Single `index.html` — all HTML, CSS, and JS in one file. No framework, no bundler, no build step.
- Firebase compat SDK v10.12.0 via CDN script tags (app, auth, firestore, functions)
- Firebase Hosting (serves the project root; see the `firebase.json` ignore list)
- Firestore + Firebase Auth (Google sign-in)
- Cloud Function `anthropicProxy` (`functions/index.js`, Node 24, v2 `onCall`) — forwards AI Kitchen requests to the Anthropic API. Key lives in Firebase Secret `ANTHROPIC_KEY`, never in the browser. CORS locked to the live domain.

Earlier Next.js + Supabase and Lovable attempts were abandoned — see `docs/decisions.md`. Don't reintroduce a framework or build step.

## Code Map (index.html)

- Data: `initData()` loads published recipes into memory; save/update/delete helpers write to Firestore. If `recipes` is empty, `initData()` re-seeds it from the inline `SEED` array (the April snapshot).
- Auth: `signIn()`, `checkAllowedEditor(uid)`, favorites load/save
- Browse: `applyFilters()` + `renderGrid()` — filtering and sorting are client-side on purpose (avoids Firestore composite-index failures)
- Detail: `renderDetail()`, `renderEditDetail()`, serving scaler (`scaleIngredient`, `adjustServings`)
- AI Kitchen: `buildSystemPrompt()` puts the full recipe catalog before `CHAT_SYSTEM` (the AI instructions); `sendChat()` calls the proxy with the model and `max_tokens` hardcoded; `finalizeRecipe()` → `renderDraft()` → `publishDraft()`. Drafts live only in memory until published.

## Firestore

- `recipes/{recipeId}` — only `status == 'published'` is shown
- `favorites/{userId}` — user-scoped
- `allowedEditors/{uid}` — doc present = can edit. Managed in the Firebase console.

Client-side: `ADMIN_UID` (index.html:325) is the admin; editors = admin or anyone with an `allowedEditors` doc. Delete is admin-only in the UI. Server-side security rules live in the Firebase console, not in this repo, and haven't been verified from here.

## Docs

`docs/` holds `decisions.md` (architecture decisions), `launch-notes.md`, `v5.0-plan.md` (current roadmap), `cookbook-handoff-v6.md` (April handoff, superseded by this file), and `site-template-context.md` (reusable single-file Firebase app template).

## Workflow

- All work on `dev`. `main` always matches what's deployed.
- Ship: `git checkout main && git merge dev && git push origin main && firebase deploy`, then `git checkout dev && git merge main && git push origin dev`. Direct merge, no PRs.
- Functions only: `firebase deploy --only functions`
- Version lives in README and CHANGELOG (no VERSION file).
- Never open `index.html` in TextEdit — it corrupts the file.

## Available Skills for This Project

The following gstack and local skills are available and relevant here. Others exist globally but are not part of the cookbook workflow.

**Quality & safety (run during development):**
- `/careful` — blocks destructive commands (rm -rf, DROP TABLE, git push --force) before execution. Active globally; no invocation needed.
- `/freeze` — locks edits to a specified directory while debugging. Use when isolating a bug to a single module.
- `/guard` — combines careful + freeze in one command.
- `/health` — code quality score. Limited here: the project has no linter, type checker, or tests, so there's little for it to run.

**Reviewing code:**
- `/review` (gstack) — adversarial code review with chaos-engineer pass. The main quality gate for this codebase.

**Testing the live site:**
- `/qa` — headless browser QA: navigates the live deployed URL, tests user flows, finds bugs with screenshots. **Currently broken** (as of 2026-10-05): gstack's `browse` binary has a corrupt code signature and macOS kills it on launch, which also breaks `/browse` and gstack's make-pdf. Fix is rebuilding `browse` + `find-browse` from source in the gstack dir. Until then, check the live site by hand.

**Shipping (cookbook only — do not use in skills repo):**
- Ship sequence: `/review` → direct merge + deploy (see Workflow). `/health` optional.
- `/ship` — optional. Assumes a VERSION file and PRs; here it has to work with version-in-README/CHANGELOG and the direct dev → main merge.
- `/document-release` — post-ship doc sync: reads all docs, cross-references the diff, updates README/CHANGELOG/CLAUDE.md.

## Key Rules

- Human-in-the-loop is non-negotiable: AI always produces drafts, never publishes directly
- Never overwrite a published recipe automatically
- One feature per commit; don't touch unrelated code
- Show a plan before making any consequential changes
