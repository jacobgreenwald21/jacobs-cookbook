# Cookbook Project — Claude Code Context

## What This Project Is

A personal AI-powered cookbook web app. NYT Cooking-inspired browsing interface with an integrated AI Kitchen chat for creating and adapting recipes. Single admin login. Public read-only browsing.

## Stack

Next.js (App Router) + Supabase (Postgres + Auth + Storage)

## Core Features

- Recipe list view: name + total time per card, /recipes/<slug> detail pages
- Search + filters: keyword, tags, meal type, time buckets, difficulty
- Sort: newest, fastest, alphabetical, difficulty
- Favorites: per-device via localStorage
- Admin only: create, edit, delete recipes
- AI Kitchen: embedded chat to generate/adapt recipes → structured draft → manual review → publish (human-in-the-loop, never auto-publish)
- PDF import: upload → extract → editable draft → publish
- No ratings, no grocery list, no collections

## Key Rules

- Human-in-the-loop is non-negotiable: AI always produces drafts, never publishes directly
- Never overwrite a published recipe automatically
- Build MVP first, expand iteratively
- When adding a feature, do not touch unrelated files
- Show a plan before making any consequential changes
