# Changelog

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
