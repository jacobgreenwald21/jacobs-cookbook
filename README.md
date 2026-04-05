# Jacob's Cookbook

A personal AI-powered cookbook web app. Browse, filter, and search recipes. Sign in to favorite them, edit them, or use the AI chat to generate new ones.

**Live:** https://jacobs-cookbook.web.app

## What it does

- Recipe grid with search, filters (meal type, difficulty, cook time), and sort
- Full recipe detail pages — ingredients, numbered steps, tags, timing
- Google Sign-in to unlock favorites, editing, and AI generation
- AI Generate tab: multi-turn chat with Claude to build a recipe → editable draft → publish to the cookbook
- Admin-only delete (UID hardcoded in `index.html`)
- Admin-grantable editor whitelist via Firestore `allowedEditors` collection
- AI restricted to cooking topics only — cannot be overridden
- AI knows your existing cookbook recipes (injected into system prompt)
- Serving size scaler on recipe detail — scales ingredient quantities in real time
- Print view on recipe detail — clean white layout, hides all UI chrome
- API key onboarding flow for new users with link to Anthropic console

## Stack

- **Frontend:** Single HTML file (`index.html`) — no framework, no build step
- **Database:** Firebase Firestore (real-time listener)
- **Auth:** Firebase Google Auth
- **AI:** Anthropic API (`claude-sonnet-4-20250514`), called client-side with a user-supplied API key
- **Hosting:** Firebase Hosting
- **Fonts:** Lora + DM Sans via Google Fonts CDN
- **Firebase SDK:** Compat v10.12.0 via CDN

## Deploy

Requires Firebase CLI.

```bash
firebase login       # if not already authenticated
firebase deploy      # deploys to jacobs-cookbook.web.app
```

Hosting is configured in `firebase.json` with the project root as public. No build step.

## TextEdit warning

Do not open `index.html` in TextEdit. TextEdit will convert straight quotes to curly quotes and break the JavaScript. Use VS Code or any proper code editor.

## Repo structure

```
index.html          # the entire app
firebase.json       # Firebase Hosting config
README.md
CHANGELOG.md
docs/
  decisions.md      # architecture decisions
  launch-notes.md   # v0 launch state, known limitations, deploy notes
archive/
  README.md
  cookbook-v0-prototype.html   # earlier localStorage-only prototype (no auth, no Firestore)
```
