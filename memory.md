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

| Working on | Started | Notes |
|---|---|---|---|
| — | — | — | *(none currently)* |

---

## 4. Completed Log

*Append-only, newest on top.*

| Date | What was completed | Files/modules | Notes |
|---|---|---|---|---|
| 2026-08-22 | AI (Antigravity) | Phase 14: Admin dashboard (stats, popular cities, recent trips) | `src/app/(app)/admin/page.tsx` | Optional screen, mock data |
| 2026-08-22 | AI (Antigravity) | Phase 13: Community page + shared trip public view | `src/app/(app)/community/page.tsx`, `src/app/shared/[token]/page.tsx` | Search, copy trip actions |
| 2026-08-22 | AI (Antigravity) | Phase 12: Profile page (edit info, preferences, danger zone) | `src/app/(app)/profile/page.tsx` | Mock save, language/currency/public toggle |
| 2026-08-22 | AI (Antigravity) | Phase 11: Calendar page (month grid + day detail sidebar) | `src/app/(app)/calendar/page.tsx` | Interactive month nav, trip/activity markers |
| 2026-08-22 | AI (Antigravity) | Phase 10: Budget page (stats, pie chart, bar chart, category cards) | `src/app/(app)/trips/[tripId]/budget/page.tsx` | Uses recharts; over-budget indicators |
| 2026-08-22 | AI (Antigravity) | Phase 9: Itinerary View (day-by-day + city-by-city toggle, timeline) | `src/app/(app)/trips/[tripId]/view/page.tsx` | Route header, activity blocks |
| 2026-08-22 | AI (Antigravity) | Phase 7-8: Itinerary Builder + Activity Search modal | `src/app/(app)/trips/[tripId]/builder/page.tsx` | Expandable stops, add activity modal |
| 2026-08-22 | AI (Antigravity) | Phase 6: Discover page (city search with region filters) | `src/app/(app)/discover/page.tsx` | Debounced search, filter chips |
| 2026-08-22 | AI (Antigravity) | Phase 5: My Trips page (tab filters, search, grid) | `src/app/(app)/trips/page.tsx` | All/Upcoming/Drafts/Completed tabs |
| 2026-08-22 | AI (Antigravity) | Phase 4: Create Trip page (form with validation) | `src/app/(app)/trips/new/page.tsx` | Name, dates, description |
| 2026-08-22 | AI (Antigravity) | Phase 3: App layout + Dashboard | `src/app/(app)/layout.tsx`, `src/app/(app)/dashboard/page.tsx`, Sidebar, Navbar, TripCard, DestinationCard | Sidebar nav, mobile hamburger, stats cards |
| 2026-08-22 | AI (Antigravity) | Phase 2: Login + Registration pages | `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx` | Split layout, mock auth |
| 2026-08-22 | AI (Antigravity) | Phase 1: Design system + UI components + types + mock data | `tailwind.config.ts`, `globals.css`, `layout.tsx`, `src/types/index.ts`, `src/lib/mockData.ts`, `src/components/ui/*` | Inter font, design tokens, Button/Input/Card/Modal/Badge/EmptyState/Skeleton/SearchBar |
| 2026-08-22 | Manu | Optimized Prisma schema: proper `@db.Time(6)` for activity times, `@db.DoublePrecision` for lat/lng, added missing FK indexes (`copiedFromTripId`, `tripActivityId`), fixed `SavedPlace` cascade per Architecture.md | `prisma/schema.prisma`, `.env` | Schema pushed to Neon PostgreSQL — all 9 tables synced |
| 2026-08-22 | Manu | Created initial Prisma schema with all 9 models | `prisma/schema.prisma` | `users`, `trips`, `trip_stops`, `places`, `trip_activities`, `expenses`, `budgets`, `saved_places`, `ai_suggestions` per Architecture.md §6 |

---

## 5. Build Progress Tracker

*Status: `Not started` · `In progress` · `Blocked` · `Done`.*

| Area | Status | Owner | Last updated |
|---|---|---|---|
| Repo scaffold + Prisma schema/migration | Done | Manu | 2026-08-22 |
| Auth (register/login/refresh/reset) | Done (UI only) | AI | 2026-08-22 |
| Screens 1–5 (auth, dashboard, trips list, create trip) | Done (UI only) | AI | 2026-08-22 |
| Screens 6–7 (Itinerary Builder / View) | Done (UI only) | AI | 2026-08-22 |
| Screens 8–9 (City / Activity Search) | Done (UI only) | AI | 2026-08-22 |
| Screen 10 (Budget) | Done (UI only) | AI | 2026-08-22 |
| Screen 11 (Calendar) | Done (UI only) | AI | 2026-08-22 |
| Screen 12 (Shared + Community) | Done (UI only) | AI | 2026-08-22 |
| Screen 13 (Profile) | Done (UI only) | AI | 2026-08-22 |
| Screen 14 (Admin, optional) | Done (UI only) | AI | 2026-08-22 |
| API routes — all resources | Not started | — | — |
| External integrations (Places, AI, Cloudinary) | Not started | — | — |
| Design system / component library | Done | AI | 2026-08-22 |
| Deployment | Not started | — | — |

---

## 6. Open Questions

| Question | Raised by | Date | Status |
|---|---|---|---|
| All screens use mock data — need backend API integration | AI | 2026-08-22 | Open |
| Auth is UI-only — need JWT/session middleware | AI | 2026-08-22 | Open |

---

## 7. Team

| Name | Role / area |
|---|---|
| Manu | Backend / Prisma / DB |
| AI (Antigravity) | Frontend UI (all screens) |