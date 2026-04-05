# Changelog

## [v1.0] — Phase 5b Complete (April 2026)

- feat: admin-grantable editor whitelist (allowedEditors Firestore collection)
- fix: Firestore security rules — public reads, authenticated writes, admin-only deletes
- fix: restrict AI to cooking topics only
- fix: remove AI flavor profile defaults
- feat: inject cookbook recipe context into AI system prompt
- feat: expanded AI chat UI with auto-growing input
- feat: favorites visual upgrade (solid/outline SVG heart, gold accent)
- feat: API key onboarding flow with Anthropic link
- feat: serving size scaler on recipe detail page
- feat: print view for recipe detail

## [v0.0] — v0 baseline established

Initial stable version. Single-file app (`index.html`) deployed to Firebase Hosting.

Features at baseline:
- 16 seed recipes across 6 meal types
- Recipe grid with search, filters, and sort
- Recipe detail pages
- Google Sign-in
- Favorites synced to Firestore per user
- Edit recipe (any signed-in user)
- Delete recipe (admin only)
- AI Generate page — multi-turn chat → editable draft → publish

Stack: Firebase compat SDK v10.12.0, Firestore, Google Auth, Anthropic API (`claude-sonnet-4-20250514`), Firebase Hosting.
