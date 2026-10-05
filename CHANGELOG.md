# Changelog

All notable changes to Jacob's Cookbook are documented here.

Starting with 5.0, versions follow the v5.0 plan (`docs/v5.0-plan.md`): each phase ships as 5.N, so phase 1 is 5.1. The jump from 1.2.0 reflects the overall iteration count, not a rewrite.

---

## [5.1] — October 2026

### AI Kitchen upgrades
- Model upgraded to Claude Sonnet 5.5 (`claude-sonnet-5-5`). Claude Sonnet 4 is retired on the Claude API, so AI Kitchen needed this to keep working
- Output limit raised from 1,000 to 16,000 tokens so full recipes no longer get cut off
- The Cloud Function now calls Claude through the official Anthropic SDK, which retries automatically on rate limits and server errors
- Refusal fallback: if Sonnet ever declines a request, the API re-runs it on a fallback model
- Replies are read by content type, so a thinking block never shows up as a blank reply. Refused, cut-off, and empty replies show a clear error instead

### Proxy lockdown
- Model, output limit, and effort are set in the Cloud Function. The browser can no longer choose them
- The system prompt (cooking rules + recipe catalog) is built in the function from Firestore. The browser sends only the chat messages, so the cooking-only rules can't be swapped out
- Chat history must be plain user/assistant text, capped at 60 messages or 60K characters

### Prompt caching
- System prompt split into fixed instructions, then the recipe catalog, with a cache breakpoint after it. The conversation is cached as it grows
- From the second message on, about 8.5K tokens per message are read from cache at 10% of the normal input price
- Every call logs token usage, cache reads and writes, and cache diagnostics (`firebase functions:log`)

### Maintenance
- Updated `firebase-functions` to 7.4.0 and `firebase-admin` to 13.10.0

---

## [5.0] — October 2026

### Housekeeping
- Rewrote `.claude/CLAUDE.md` to describe the real stack (single `index.html`, Firebase Hosting + Firestore + Auth, Cloud Function proxy)
- Docs, markdown files, function source, and the archive folder are no longer served publicly by Firebase Hosting
- Git remote no longer stores a GitHub token
- Added the v5.0 plan (`docs/v5.0-plan.md`)

---

## [1.2.0] — April 2026

### Anthropic API Proxy (Cloud Function)
- Added Firebase Cloud Function `anthropicProxy` that proxies all Anthropic API requests server-side
- Anthropic API key stored as a Firebase Secret (never exposed to the client)
- Removed API key onboarding screen — AI Kitchen loads directly for signed-in users
- Upgraded Firebase project to Blaze plan to support Cloud Functions
- Auth check enforced inside the function — unauthenticated requests are rejected

---

## [1.1.0] — April 2026

### Related Recipes
- Recipe detail page now shows up to 2 related recipes below the tags row
- Matches are ranked by tag overlap count — highest overlap shown first
- Rendered as plain clickable names; clicking opens that recipe's detail page
- If no matches exist, nothing renders — no empty section, no header

### AI Similar Recipe Nudge
- Added instruction to `CHAT_SYSTEM` prompting Claude to briefly mention a close existing match before generating
- Triggers only on genuine similarity (same protein + same general technique or flavor profile)
- Never blocks generation — Claude always proceeds if the user wants to continue
- Tone is conversational, not a warning

---

## [1.0.0] — April 2026

### Phase 5b — Full Feature Build (10 features)
- **Firestore security rules** — public reads, authenticated writes, admin-only deletes, user-scoped favorites
- **Admin-grantable editor whitelist** — `allowedEditors/{uid}` Firestore collection; Jacob grants access via Firebase console, no redeploy needed
- **AI cooking guardrail** — system prompt blocks non-cooking topics and jailbreak attempts
- **AI flavor bias fix** — Claude asks about cuisine preference before suggesting; no Asian/Mediterranean defaults
- **AI recipe context injection** — `buildSystemPrompt()` prepends all published recipes to every message; Claude can reference, suggest variations, and avoid duplicates
- **Expanded AI chat UI** — panel fills viewport; input auto-grows to 200px then scrolls; send button anchors to bottom
- **SVG heart favorites** — inline SVG hearts replace star character; outline when unfavorited, solid gold when favorited; no animation
- **API key onboarding** — signed-in users without a saved Anthropic key see an onboarding screen linking to console.anthropic.com; key stored in localStorage only, never touches server
- **Serving size scaler** — live +/− control on recipe detail; handles whole+fraction, bare fraction, integer, and decimal quantities; Firestore data unchanged; resets on each page open
- **Print view** — `@media print` stylesheet hides nav and action bar; scaler buttons hidden but serving count readable; scaled amounts print from current DOM state

### Phase 5a — GitHub Repo Setup
- Public repo initialized at github.com/jacobgreenwald21/jacobs-cookbook
- Branch strategy: `dev` for all feature work, `main` always matches live Firebase deployment
- Commit format: `feat:` / `fix:` / `chore:`
- Docs folder: `decisions.md`, `launch-notes.md`
- Archive folder for pre-Firebase artifacts

### Phase 1–5 — Initial Build
- Single HTML file architecture — no framework, no build step
- Firebase Hosting + Firestore + Firebase Auth (Google sign-in) + Anthropic API
- Firebase compat SDK v10.12.0 via CDN
- Guest browse, filter, sort; Google sign-in; Firestore-synced favorites; user recipe creation and publishing; admin delete; conversational AI recipe generation
