# Architecture Decisions

## Single-file, no build step

The entire app lives in `index.html`. No framework, no bundler, no node_modules. Firebase and the fonts are loaded via CDN. This keeps the deployment surface minimal — `firebase deploy` pushes one file.

The tradeoff is that the file gets long. Acceptable at this scale; worth revisiting if the codebase grows significantly.

## Firebase compat SDK v10.12.0 (CDN)

Using the compat (v8-style) SDK rather than the modular v9+ SDK. The compat SDK is loaded via three CDN script tags:

- `firebase-app-compat.js`
- `firebase-auth-compat.js`
- `firebase-firestore-compat.js`

Reason: simpler syntax for a single-file app with no module bundler. The compat SDK lets us use `firebase.auth()`, `firebase.firestore()`, etc. directly without imports or tree-shaking concerns.

## Firestore for recipe storage

Recipes are stored in a `recipes` Firestore collection. On first load, the app checks whether Firestore is empty and seeds it from the `SEED` array baked into the JS. After that, the app sets up a real-time `onSnapshot` listener filtered to `status == 'published'`, so the grid updates live if a recipe is added or edited elsewhere.

Fallback: if Firestore fails (network error, permission issue), the app falls back to the SEED array so the page still renders.

## Google Auth for access control

Sign-in is via Google OAuth popup (`signInWithPopup`). Any Google account can sign in. Being signed in unlocks:

- The AI Generate tab
- The favorites system (stored in Firestore per user)
- The Edit button on recipe detail pages

## Admin role via hardcoded UID

There is no roles collection or custom claims. Admin status is determined by comparing `currentUser.uid` to a single hardcoded `ADMIN_UID` constant in the JS. The admin can delete recipes; regular signed-in users can only edit.

This is intentional for a single-admin app. If multi-admin support is ever needed, move to Firestore-based roles or Firebase custom claims.

## Favorites in Firestore (per user)

Favorites are stored in a `favorites/{uid}` document as an array of recipe IDs. This means they sync across devices for a signed-in user. Unauthenticated users cannot favorite anything.

## Anthropic API called directly from the browser

The AI chat sends requests directly to `api.anthropic.com/v1/messages` from client-side JS. This requires the `anthropic-dangerous-direct-browser-access: true` header and the user's API key, which is stored in `localStorage` (not in the codebase).

The user supplies their own API key. There is no server-side proxy. This means the key is visible in the browser's localStorage and network tab — acceptable for a personal single-user app, but not appropriate for a public multi-user product.

## Multi-turn chat for recipe generation

The AI Generate page uses a conversational interface. Claude asks clarifying questions about preferences before generating. The system prompt instructs Claude to converse first and output JSON only when the user confirms they want the recipe. The JSON is parsed client-side and rendered into an editable draft form before the user publishes.

Human-in-the-loop is enforced by design: there is no path from chat to Firestore that bypasses the review step.

## Seed data baked into JS

The 16 initial recipes are stored as a `SEED` constant in the JS. They are written to Firestore once on first init. After that, Firestore is the source of truth and the seed array is only used as a fallback if Firestore is unavailable.
