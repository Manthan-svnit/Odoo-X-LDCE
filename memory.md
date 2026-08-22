# Memory.md — GlobeTrotter Project Memory

> Shared source of truth: canonical names (must match `Architecture.md` / `Design.md`) + a live tracker of what's done, in progress, and by whom. **Update this file regularly** — the moment work starts, stops, or finishes.
>
> **AI agents:** most of this codebase will be written by AI tools. Any AI that creates, edits, or generates code/files for this project must log what it did in `§ 3` (while working) and `§ 4` (once done) before ending its turn, the same as a human contributor would.

---

## 1. How to Update

- **Starting work?** Add a row to `§ 3`.
- **Finished?** Move that row to `§ 4`, and flip the status in `§ 5`.
- **New canonical name** (screen/table/route)? Add it to `§ 2` first, then use it everywhere.
- Keep entries short. Don't delete `§ 4` history.

---

## 2. Source of Truth

**Stack:** Next.js (App Router) + TypeScript · PostgreSQL + Prisma · TanStack Query · Zustand · Tailwind · React Hook Form + Zod · Recharts · Vercel

**Screens:** Login `/login` · Registration `/register` · Dashboard `/` · Create Trip `/trips/new` · My Trips `/trips` · Itinerary Builder `/trips/[tripId]/builder` · Itinerary View `/trips/[tripId]/view` · City Search (modal) · Activity Search (modal) · Budget `/trips/[tripId]/budget` · Calendar `/trips/[tripId]/calendar` · Shared/Community `/shared/[token]`, `/community` · Profile `/profile` · Admin `/admin`

**DB tables (Prisma models):** `users`, `trips`, `trip_stops`, `places`, `trip_activities`, `expenses`, `budgets`, `saved_places`, `ai_suggestions`

**API base:** `/api/v1` (Route Handlers — full route table in `Architecture.md § 12`)

---

## 3. Currently Being Worked On

*Live. Add your row when you start; remove it when you stop/finish.*

| Who (person or AI) | Working on | Started | Notes |
|---|---|---|---|
| — | — | — | *(none yet)* |

---

## 4. Completed Log

*Append-only, newest on top.*

| Date | What was completed | Files/modules | Notes |
|---|---|---|---|---|
| 2026-08-22 | Optimized Prisma schema: proper `@db.Time(6)` for activity times, `@db.DoublePrecision` for lat/lng, added missing FK indexes (`copiedFromTripId`, `tripActivityId`), fixed `SavedPlace` cascade per Architecture.md | `prisma/schema.prisma`, `.env` | Schema pushed to Neon PostgreSQL — all 9 tables synced |
| 2026-08-22 |  Created initial Prisma schema with all 9 models | `prisma/schema.prisma` | `users`, `trips`, `trip_stops`, `places`, `trip_activities`, `expenses`, `budgets`, `saved_places`, `ai_suggestions` per Architecture.md §6 |

---

## 5. Build Progress Tracker

*Status: `Not started` · `In progress` · `Blocked` · `Done`.*

| Area | Status | Owner | Last updated |
|---|---|---|---|
| Repo scaffold + Prisma schema/migration | Done | AI | 2026-08-22 |
| Auth (register/login/refresh/reset) | Not started | — | — |
| Screens 1–5 (auth, dashboard, trips list, create trip) | Not started | — | — |
| Screens 6–7 (Itinerary Builder / View) | Not started | — | — |
| Screens 8–9 (City / Activity Search) | Not started | — | — |
| Screen 10 (Budget) | Not started | — | — |
| Screen 11 (Calendar) | Not started | — | — |
| Screen 12 (Shared + Community) | Not started | — | — |
| Screen 13 (Profile) | Not started | — | — |
| Screen 14 (Admin, optional) | Not started | — | — |
| API routes — all resources | Not started | — | — |
| External integrations (Places, AI, Cloudinary) | Not started | — | — |
| Design system / component library | Not started | — | — |
| Deployment | Not started | — | — |

---

## 6. Open Questions

| Question | Raised by | Date | Status |
|---|---|---|---|
| — | — | — | *(none yet)* |

---

## 7. Team

| Name | Role / area |
|---|---|
| — | — |