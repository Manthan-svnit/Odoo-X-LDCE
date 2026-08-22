# Team-Assignments.md — GlobeTrotter Work Distribution

> Splits `Phases.md` across four members so each person knows their lane and can work mostly in parallel. Names/screens/tables match `Memory.md § Source of Truth`. **Log all work in `Memory.md § 3/§ 4`** as you go — this file says *who owns what*, `Memory.md` says *what's actually done right now*.

## How the split works

Each person owns a **vertical slice** (their own phases end-to-end: DB → API → UI) rather than everyone touching every layer — fewer merge conflicts, clear ownership. Work happens in **waves** because later phases depend on earlier ones (see `Phases.md § Dependencies`); within a wave, members work in parallel.

---

## Member A — Foundation, Auth & Shipping
**Owns:** Phase 0 (Project Setup), Phase 1 (Authentication), Phase 13 (Deployment), Phase 14 (Demo Prep)

| Phase | What | Screens | Key files |
|---|---|---|---|
| 0 | Next.js scaffold, Tailwind + tokens, Prisma init, CI, `.env.example` | placeholder shells for all 14 screens | root `layout.tsx`, `schema.prisma` (empty), CI config |
| 1 | Register / login / logout / refresh / forgot-password, session middleware | Login, Registration | `middleware.ts`, `app/api/auth/**`, auth store |
| 13 | Vercel deploy, managed Postgres, env vars, connection pooling | — | Vercel config, deploy docs |
| 14 | Demo script, fallback plan, README/slide | — | `README.md` |

**Do first:** Phase 0 blocks everyone — get the repo bootable and pushed on day one so B/C/D can clone and start immediately. Coordinate the `users` model shape with Member B before finishing Phase 1's migration.

---

## Member B — Data & Trips
**Owns:** Phase 2 (Database), Phase 3 (Trip CRUD), Phase 11 (Admin, optional/last)

| Phase | What | Screens | Key files |
|---|---|---|---|
| 2 | Full `schema.prisma` (all 9 tables), migrations, seed script | — | `schema.prisma`, `prisma/seed.ts` |
| 3 | Create Trip, My Trips, edit, soft delete, ownership checks | Dashboard (recent trips), Create Trip, My Trips | `app/api/trips/**`, Trip Card component |
| 11 | Stats, top cities/activities, user management | Admin | `app/api/admin/**` |

**Do first:** start schema design alongside Member A's Phase 1 (you need the final `users` shape before writing FKs for `trips`, `saved_places`, etc.) — sync with A early rather than waiting for Phase 1 to fully finish. Phase 11 is cut first if time runs short.

---

## Member C — Discovery & Itinerary Building
**Owns:** Phase 4 (City/Place Discovery), Phase 5 (Itinerary Builder — Stops), Phase 6 (Activities), Phase 8 (Calendar/Timeline)

| Phase | What | Screens | Key files |
|---|---|---|---|
| 4 | City Search wired to external provider, `places` caching, debounced SearchBar | City Search | `app/api/places/**`, `SearchBar` component |
| 5 | Add/reorder/edit/delete stops | Itinerary Builder (stops) | Server Actions: `addStop`, `updateStop`, `deleteStop`, `reorderStops` |
| 6 | Activity Search, add/remove/reorder activities in a stop | Activity Search, Itinerary Builder (activities) | Server Actions: `addActivity`, `removeActivity`, `reorderActivities` |
| 8 | Calendar grid + vertical timeline toggle, drag-to-reorder | Trip Calendar / Timeline | timeline/calendar components |

**Do first:** Phase 4 needs Phase 2's `places` table and an external provider API key (get the key from A early, it's an env var). Phases 5–6 are the biggest chunk of the app — start Phase 5 as soon as Trip CRUD (Member B, Phase 3) has a working trip to attach stops to.

---

## Member D — Budget, Sharing, AI & Quality
**Owns:** Phase 7 (Budget), Phase 9 (Sharing/Community), Phase 10 (AI, optional), Phase 12 (Testing)

| Phase | What | Screens | Key files |
|---|---|---|---|
| 7 | Totals, category/day charts, over-budget flags, expenses, budget limits | Trip Budget & Cost Breakdown | Server Actions + RSC aggregates, PieChart/BarChart |
| 9 | Public/private toggle, share link, public read-only view, copy trip, community feed | Shared/Public Itinerary View, Community | `toggleTripVisibility`, `copyTrip`, `app/shared/[shareToken]/page.tsx` |
| 10 | AI suggestion panel, staged suggestions, apply/discard | AI panel (inside Itinerary Builder) | `generateAiItinerary`, `applyAiSuggestion` |
| 12 | Unit tests (Zod/services), integration tests (routes/actions), E2E happy-path | — | test suite, Playwright/Cypress script |

**Do first:** Phase 7 needs stops + activities with costs to exist (Member C, Phases 5–6) before totals mean anything — until then, build the Budget UI against seeded/mock data. Phase 10 is the first thing to cut if time is short; Phase 12 can start early by writing tests against whatever's already merged, rather than waiting for everything.

---

## Suggested Waves (parallelism)

| Wave | Who's active | What's happening |
|---|---|---|
| 1 | A (solo) | Phase 0 — everyone else waits on this to clone/start |
| 2 | A + B | Phase 1 (auth) and Phase 2 (schema) in parallel, syncing on the `users` model |
| 3 | B, C | Phase 3 (Trip CRUD) and Phase 4 (Discovery) in parallel once Phase 2 lands |
| 4 | C, D | Phase 5–6 (Stops/Activities) and early Phase 7 (Budget UI on mock data) |
| 5 | C, D | Phase 8 (Calendar) and Phase 9 (Sharing) once 5–7 are stable |
| 6 | D | Phase 10 (AI, if time) and Phase 12 (Testing) |
| 7 | A + everyone | Phase 13 (Deploy) and Phase 14 (Demo prep) — full team dry run |

## Ground rules
- Every phase still needs its owner to update `Memory.md § 3` when starting and `§ 4`/`§ 5` when done — this table is static, `Memory.md` is the live truth.
- Blocked on someone else's phase? Say so in `Memory.md § 6 Open Questions` instead of idling — don't silently context-switch onto someone else's file without a note there.
- MVP (per `Phases.md`) is Phases 0–7 + Phase 9's MUST parts — if the team is behind, everyone reprioritizes toward finishing those before touching Phase 10/11.