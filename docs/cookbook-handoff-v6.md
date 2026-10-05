# Jacob's Cookbook — Handoff Document
*Updated April 2026 | v6*

---

## How to Use This Document

Drop this into a new chat in the **Cookbook Project** and say which feature you want to tackle. Claude will be hands-on — exact Claude Code prompts, terminal commands, and instructions at every step.

---

## Who You Are — Context for Claude

- UGA senior, graduating soon, recruiting for McKinsey BA role
- Familiar with terminal (CSCI 1302 + recent Claude Code work)
- Claude Code installed (v2.1.91), authenticated under jacob@greenwaldcentral.com, running on Sonnet 4.6 via Claude Pro
- Primary dev environment: VS Code with Claude Code extension (`anthropic.claude-code` v2.1.90)
- Primary AI tools: Claude Projects, Claude Desktop with Cowork, Claude Code (terminal + VS Code extension)

---

## Project Overview

A personal AI-powered cookbook web app — both a functional tool and a BUSN 4400 class project.

- **Live at:** https://jacobs-cookbook.web.app
- **GitHub:** https://github.com/jacobgreenwald21/jacobs-cookbook
- **Version:** v1.2.0 (main and dev in sync)
- **Local path:** `~/Desktop/AI/Cookbook/`
- **Stack:** Single HTML file (`index.html`) — no framework, no build step. Firebase Hosting + Firestore + Firebase Auth (Google sign-in) + Anthropic API via Cloud Function proxy. Firebase compat SDK v10.12.0 via CDN script tags.

---

## Working Style — How We Build

**Claude Code does all file work.** No manual copy-pasting, no opening files in TextEdit. All edits happen via Claude Code in VS Code, which reads and writes `index.html` directly.

**One feature at a time.** Each feature gets its own Claude Code prompt, its own commit, and its own push to `dev` before moving to the next.

**Claude Code prompt format:**
> You are working on `index.html` on the `dev` branch. Confirm with `git checkout dev` first.
>
> Read `index.html` fully before making any changes.
>
> [Specific instructions for the feature]
>
> Do not change anything else — [scope restriction].
>
> After making changes:
> ```
> git add .
> git commit -m "feat/fix/chore: description"
> git push origin dev
> ```

**After each feature:** Claude Code reports back exactly what changed. That summary gets logged before moving to the next item.

**Smoke test before merging.** Deploy `dev` to Firebase, run through the checklist, then and only then merge to `main`.

**Smoke test deploy command:**
```bash
cd ~/Desktop/AI/Cookbook && git checkout dev && firebase deploy
```

**Merge and ship command (when all features pass):**
```bash
git checkout main && git merge dev && git push origin main && firebase deploy
```

**After shipping:** Update all four doc files on `main`, then sync `dev`:
```bash
git checkout dev && git merge main && git push origin dev
```

**Doc files to update after every batch:**
- `CHANGELOG.md`
- `README.md`
- `docs/decisions.md` (if any architectural decision was made)
- `docs/launch-notes.md`

---

## Current State — Everything Working in v1.2.0

- Guest browse, filter, sort
- Google sign-in / sign-out
- Firestore-synced favorites (SVG heart, gold when active)
- User recipe creation and publishing
- Admin-grantable editor whitelist (`allowedEditors` Firestore collection)
- Admin delete (hardcoded UID only)
- Related recipes on detail page (tag-overlap ranked, up to 2, clickable names)
- Conversational AI recipe generation (AI Kitchen tab)
- AI restricted to cooking topics only
- AI has no flavor profile defaults — asks user before suggesting cuisine
- AI knows all published recipes before each conversation (`buildSystemPrompt()`)
- AI mentions close existing matches naturally before generating
- Anthropic API proxied via Firebase Cloud Function (`anthropicProxy`) — key never reaches browser
- No API key onboarding — AI Kitchen loads directly for signed-in users
- Serving size scaler on recipe detail (real-time ingredient rescaling)
- Print view on recipe detail (clean white print stylesheet)
- Expanded AI chat UI with auto-growing textarea input

---

## Remaining Features — Build These Next

All work on `dev`. One at a time. Smoke test. Merge to `main`. Deploy. Update docs.

---

### Feature 1 — Mobile Polish
**Complexity:** Medium
**Where:** CSS `@media` block only — no JavaScript changes
**What:** Three areas need work on small screens:
1. **Filter bar** — currently overflows horizontally; needs to wrap cleanly or stack vertically
2. **Recipe detail page** — spacing and font sizes need tightening for small screens
3. **AI chat panel** — input row and send button need to remain usable when mobile keyboard is open

**Rules:**
- Use `@media (max-width: 768px)` breakpoint consistently throughout
- Do not touch any JavaScript
- Desktop layout must be completely unchanged — only small screen behavior changes

**Commit:** `feat: mobile polish — filter bar, detail page, AI chat`

---

### Feature 2 — Reheat Instructions Button
**Complexity:** Low
**Where:** Recipe detail page
**What:** A button that opens an AI chat pre-prompted to generate reheat instructions for the current recipe.
**Rules:** To be scoped when ready — confirm exact UX before building.

---

### Feature 3 — Early Prep Instructions Button
**Complexity:** Low
**Where:** Recipe detail page
**What:** A button that opens an AI chat pre-prompted to generate early prep / make-ahead instructions for the current recipe.
**Rules:** To be scoped when ready — confirm exact UX before building.

---

### Feature 4 — PDF/URL Upload into Recipe Chat
**Complexity:** High — scope separately
**What:** Allow users to upload a PDF or paste a URL into the AI Kitchen to import a recipe.
**Rules:** Needs proper scoping before building. PDF parsing in-browser is doable; URL scraping may hit CORS issues.

---

## Smoke Test Checklist

Run through this on the deployed `dev` version before merging to `main`.

**Auth**
- [ ] Sign in with Google works
- [ ] Sign out works

**Browse**
- [ ] Recipe cards load
- [ ] Search, filters, sort all work
- [ ] Favorites heart shows outline when unfavorited, solid gold when favorited

**Recipe Detail**
- [ ] Opens correctly
- [ ] Related recipes appear (if tags match) as clickable names
- [ ] Related recipes show nothing if no tag matches
- [ ] Serving scaler +/- adjusts ingredient quantities
- [ ] Print button opens clean white print dialog

**AI Tab**
- [ ] Chat loads directly — no API key prompt
- [ ] Chat panel is large, input auto-expands with text
- [ ] Non-cooking question gets politely redirected
- [ ] Ask something that closely matches an existing recipe — confirm Claude mentions it naturally
- [ ] Ask something unrelated — confirm Claude does not mention a recipe

**Mobile (test on phone or browser DevTools)**
- [ ] Filter bar wraps cleanly — no horizontal overflow
- [ ] Detail page readable and well-spaced
- [ ] AI chat input and send button usable with keyboard open

**Admin (signed in as Jacob)**
- [ ] Delete button appears
- [ ] Edit button appears
- [ ] Both work correctly

---

## Critical Technical Reference

### Deploy Commands
```bash
# Full deploy (functions + hosting)
cd ~/Desktop/AI/Cookbook && firebase deploy

# Functions only
cd ~/Desktop/AI/Cookbook && firebase deploy --only functions

# Hosting only
cd ~/Desktop/AI/Cookbook && firebase deploy --only hosting
```

> ⚠️ Never open `index.html` in TextEdit on Mac — it corrupts the file. Always use VS Code or terminal only.

### Git Workflow
```bash
# Feature work
git checkout dev
git add . && git commit -m "feat: description" && git push origin dev

# Smoke test dev
cd ~/Desktop/AI/Cookbook && git checkout dev && firebase deploy

# Ship to production
git checkout main && git merge dev && git push origin main && firebase deploy

# Keep dev in sync after main changes
git checkout dev && git merge main && git push origin dev
```

### Cloud Function
- **Function name:** `anthropicProxy`
- **Location:** `~/Desktop/AI/Cookbook/functions/index.js`
- **Secret name:** `ANTHROPIC_KEY` (stored in Firebase Secret Manager)
- **Set/update secret:** `firebase functions:secrets:set ANTHROPIC_KEY`
- **View logs:** `firebase functions:log --only anthropicProxy`

### Firestore Collections
- `recipes/{recipeId}` — public read, authenticated write, admin delete
- `favorites/{userId}` — user-scoped read/write (stores `{ ids: [...] }`)
- `allowedEditors/{uid}` — authenticated read, admin-only write; document existing = edit access granted

### Critical IDs (stored privately — not in repo)
- **Admin UID:** `Ilqx5bsdUMdLQg9hPfDGIrZ7NXB3`
- **Admin Gmail:** jacobgreenwald21@gmail.com
- **Firebase project:** jacobs-cookbook

### Granting Editor Access
Firebase console → Firestore → `allowedEditors` collection → Add document → paste UID as Document ID. No fields required. Takes effect on next sign-in. No redeploy needed.

### Hard-Won Lessons
- Firestore `where().orderBy()` compound queries cause silent failures — sort client-side instead
- Firestore real-time listeners need an error callback with seed data fallback
- Google sign-in popup doesn't work from `file://` URLs — must serve from `https://`
- Firebase CLI on Mac requires `sudo npm install -g firebase-tools`
- The `(base)` Conda prefix in terminal is harmless
- Google Workspace custom domain accounts block Firebase project creation — use plain Gmail
- Browser caching serves old versions after deploy — force refresh with `Cmd+Shift+R`
- Gen 2 Firebase callable functions deploy on Cloud Run — requires `gcloud run services add-iam-policy-binding` with `allUsers` + `roles/run.invoker` even for Firebase-authenticated callable functions
- `firebase-functions-test` in devDependencies pulls in jest as a transitive dependency, which breaks Cloud Build's `npm ci` — remove devDependencies entirely from `functions/package.json`
- `npm install --legacy-peer-deps` resolves peer dependency conflicts but must be run after deleting the lock file to generate a clean one
- Doc commits must land on both dev and main — always run `git merge dev` on main before pushing
- The repo is at `~/Desktop/AI/Cookbook` — Claude Code must `cd` there first if run from another directory

---

## How to Start

Say which feature you want to build. Claude will:
1. Give you the exact prompt to paste into Claude Code in VS Code
2. Wait for Claude Code's summary of what changed
3. Move to the next feature or proceed to smoke test
