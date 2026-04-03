# Launch Notes — v0 Baseline

**Live URL:** https://jacobs-cookbook.web.app
**Deployed via:** Firebase Hosting
**Baseline date:** April 2026

## What shipped at v0

- 16 seed recipes across breakfast, lunch, dinner, snack, dessert, and other categories
- Recipe grid with search, filters (meal type, difficulty, time), sort (newest, fastest, alphabetical, difficulty), and favorites
- Recipe detail pages (full ingredients, numbered steps, tags, timing badges)
- Google Sign-in — any Google account can sign in
- Favorites synced to Firestore per signed-in user
- Edit recipe form available to any signed-in user (saves to Firestore)
- Delete recipe available to admin only
- AI Generate page (sign-in required) — multi-turn chat with Claude to build a recipe, followed by an editable draft form before publishing
- Firebase Firestore as the live data store; seed data auto-loaded on first visit

## Known limitations at v0

- Admin UID is hardcoded in the client-side JS. Not a security risk for this app (it controls UI only; Firestore rules are the real gate), but it means any UID change requires a redeploy.
- Anthropic API key is stored in the user's `localStorage`. Acceptable for personal use; not suitable if this ever becomes multi-user.
- No Firestore security rules documented here — should be verified before any public traffic beyond the owner.
- No offline support. If Firestore is unreachable, the app falls back to seed data (read-only).
- No image support. Recipe cards and detail pages are text-only.
- No pagination. All published recipes are loaded in a single Firestore query. Will need pagination or infinite scroll at scale.
- Edit access is not limited to admin — any signed-in user can edit recipes. This is intentional for now (single-user app in practice) but worth revisiting.

## Deploy instructions

Prerequisites: Firebase CLI installed and authenticated (`firebase login`).

```
firebase deploy
```

This deploys `index.html` and anything in the project root (per `firebase.json` which sets `public: "."`). The `archive/`, `docs/`, and `.claude/` directories are served but not linked from the app — not a concern.

To deploy hosting only:

```
firebase deploy --only hosting
```

## Firebase project

- **Project ID:** jacobs-cookbook
- **Auth domain:** jacobs-cookbook.firebaseapp.com
- **Storage bucket:** jacobs-cookbook.firebasestorage.app

## Model

The AI Generate feature uses `claude-sonnet-4-20250514` with a max of 1000 tokens per chat message. The system prompt instructs Claude to converse first and only output a JSON recipe object when the user confirms they're ready.
