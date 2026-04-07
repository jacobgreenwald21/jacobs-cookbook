# Jacob's Cookbook

A personal AI-powered cookbook web app. Built as a functional tool and a BUSN 4400 class project.

**Live:** https://jacobs-cookbook.web.app  
**Version:** v1.2.0

---

## Stack

Single HTML file (`index.html`) — no framework, no build step.

- Firebase Hosting + Firestore + Firebase Auth (Google sign-in)
- Firebase Cloud Functions (Anthropic API proxy)
- Anthropic API (Claude-powered AI Kitchen)
- Firebase compat SDK v10.12.0 via CDN script tags

---

## Features

- Guest browse, filter, sort
- Google sign-in / sign-out
- Firestore-synced favorites (SVG heart, gold when active)
- User recipe creation and publishing
- Admin-grantable editor whitelist
- Admin delete
- Related recipes on detail page (tag-overlap ranked, up to 2)
- Conversational AI recipe generation (AI Kitchen tab)
- AI restricted to cooking topics only
- AI asks about cuisine preference before suggesting — no defaults
- AI knows all published recipes before each conversation
- AI mentions close existing matches naturally before generating
- Server-side Anthropic API proxy — no client-side key required
- Serving size scaler (real-time, resets on page open)
- Print view (clean white stylesheet)
- Expanded AI chat UI with auto-growing input

---

## Deploy
```bash
cd ~/Desktop/AI/Cookbook && firebase deploy
```

⚠️ Never open `index.html` in TextEdit on Mac — it corrupts the file. Always use VS Code or terminal only.

---

## Git Workflow
```bash
# Feature work
git checkout dev
git add . && git commit -m "feat: description" && git push origin dev

# Ship to production
git checkout main && git merge dev && git push origin main && firebase deploy

# Keep dev in sync
git checkout dev && git merge main && git push origin dev
```

---

## Firestore Collections

- `recipes/{recipeId}` — public read, authenticated write, admin delete
- `favorites/{userId}` — user-scoped read/write
- `allowedEditors/{uid}` — authenticated read, admin-only write

---

## Critical IDs

Stored privately — not committed to this repo.
