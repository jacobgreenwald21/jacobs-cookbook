# Launch Notes

Running log of what shipped, when, and any important context.

---

## v1.1.0 — April 2026

**Features shipped:**
- Related recipes on recipe detail page — tag-overlap ranked, up to 2, clickable names, nothing rendered if no matches
- AI similar recipe nudge — Claude mentions close existing matches conversationally before generating; never blocks; triggers on genuine similarity only

**Process:** Both features built on `dev`, smoke tested on deployed `dev`, merged to `main`, deployed.

---

## v1.0.0 — April 2026

**Phase 5b — 10 features built and shipped:**

1. Firestore security rules confirmed correct — public reads, authenticated writes, admin-only deletes
2. Admin-grantable editor whitelist via `allowedEditors` Firestore collection
3. AI cooking-only guardrail in system prompt
4. AI flavor bias fix — Claude asks before suggesting cuisine
5. AI recipe context injection via `buildSystemPrompt()`
6. Expanded AI chat UI — full viewport panel, auto-growing input, anchored send button
7. SVG heart favorites — outline/solid gold, no animation
8. API key onboarding screen with link to Anthropic console
9. Serving size scaler — real-time, handles all quantity formats, non-destructive
10. Print view — `@media print` stylesheet, scaled amounts print correctly

**Phase 5a — Repo setup:**
- GitHub repo initialized: github.com/jacobgreenwald21/jacobs-cookbook
- Branch strategy, commit format, and docs folder established
- `decisions.md` and `launch-notes.md` created

**Initial launch context:**
- App migrated from Base44 (hit prompt limit) to single HTML file + Firebase
- 16 seed recipes migrated via CSV export
- Deployed to https://jacobs-cookbook.web.app
- Admin UID hardcoded: `Ilqx5bsdUMdLQg9hPfDGIrZ7NXB3`

---

## Pre-v1.0 — Development History

Three failed attempts before the current stack:

1. **Next.js + Supabase** — Mac environment issues (conflicting Node, broken PATH, Conda interference). App never ran.
2. **Lovable** — PDF extraction broken due to Node.js libraries incompatible with Deno (Supabase Edge runtime). Abandoned.
3. **Base44** — Fully functional but hit prompt limit with no way to export code or add features.

Current single-file Firebase approach was chosen specifically to eliminate environment complexity.
