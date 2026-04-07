# Changelog

All notable changes to Jacob's Cookbook are documented here.

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
