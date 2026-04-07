# Architectural Decisions

Key decisions made during development and the reasoning behind them.

---

## Single HTML File Architecture

**Decision:** Build the entire app as one `index.html` file with no framework and no build step.

**Why:** Earlier attempts with Next.js + Supabase and Lovable both failed due to environment complexity, not product complexity. A single file deployable via `firebase deploy` eliminates the entire class of problems that killed those attempts. Firebase compat SDK loads via CDN script tags — no Node, no bundler, no config files.

**Tradeoff:** Not scalable for a large team or a complex product. Acceptable for a personal tool at this scope.

---

## Firebase Over Supabase

**Decision:** Firebase Hosting + Firestore + Firebase Auth instead of Supabase + Next.js.

**Why:** Firebase works directly from a CDN-loaded script tag in a single HTML file. Supabase requires a server-side runtime or a JavaScript bundler to use properly. Firebase Auth with Google sign-in is one function call. Firestore real-time listeners are simpler than Supabase's Realtime subscriptions for this use case.

---

## Client-Side Sorting Instead of Firestore Compound Queries

**Decision:** Load all recipes from Firestore, then sort and filter entirely in JavaScript.

**Why:** Firestore `where().orderBy()` compound queries require a composite index. Without it, the query silently returns zero results — no error, no warning. Removing `orderBy()` from Firestore queries and sorting client-side avoids this failure mode entirely. At the current recipe count, client-side sorting has no meaningful performance cost.

---

## Admin-Grantable Editor Whitelist

**Decision:** Replaced open authenticated editing with a Firestore-backed `allowedEditors/{uid}` collection. Documents in this collection grant edit access; their absence denies it.

**Why:** Open editing allowed any signed-in Google account to create and publish recipes, which was too permissive. The whitelist gives Jacob control without requiring a full role system. Access can be granted or revoked in the Firebase console with no redeploy.

---

## API Key Stored in localStorage, Never on Server

**Decision:** The Anthropic API key is entered by the user, stored in localStorage, and sent directly to the Anthropic API from the browser. It never touches Firebase or any server Jacob controls.

**Why:** Storing API keys server-side would require a backend proxy or Firebase Cloud Function, adding architecture complexity. localStorage keeps it simple and keeps the key under the user's control. The tradeoff is that the key is visible in browser storage — acceptable for a personal tool used by known users.

---

## `buildSystemPrompt()` Prepends Live Recipe Context

**Decision:** Before every AI Kitchen message, `buildSystemPrompt()` builds a formatted summary of all published recipes and prepends it to the system prompt.

**Why:** Claude has no persistent memory between sessions. Injecting the full recipe list at inference time lets Claude reference existing recipes, suggest variations, and avoid duplicates without any additional infrastructure. No extra Firestore reads — the already-loaded `recipes` array is used directly.

---

## Related Recipes Computed Client-Side, No Extra Reads

**Decision:** Related recipes on the detail page are computed by comparing the current recipe's tags against the already-loaded `recipes` array in memory.

**Why:** Consistent with the client-side filtering approach. No additional Firestore reads, no latency, no index requirements. Tag overlap is computed as a simple set intersection — top 2 results by overlap count.

---

## Two-Branch Git Strategy

**Decision:** All feature work on `dev`. `main` always matches the live Firebase deployment. Merge only when stable.

**Why:** Prevents broken code from reaching production. Firebase deploys from whatever branch you run `firebase deploy` on, so the branch discipline enforces production stability.

---

## Anthropic API Key Moved Server-Side via Cloud Function

**Decision:** Replaced client-side API key storage (localStorage) with a Firebase Cloud Function proxy. The Anthropic API key is stored as a Firebase Secret and never reaches the browser.

**Why:** The original localStorage approach was acceptable for a personal tool with known users, but absorbing API costs for all users required the key to be centralized. A Cloud Function proxy is the standard pattern for this — it keeps the key secure, allows cost control, and removes the onboarding friction of requiring users to supply their own key.

**Tradeoff:** Adds infrastructure complexity (Cloud Functions, Blaze plan, gcloud IAM). Acceptable given the benefit.
