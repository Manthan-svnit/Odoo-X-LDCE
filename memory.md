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

| Date | Who (person or AI) | What was completed | Files/modules | Notes |
|---|---|---|---|---|
| 2026-08-22 | AI | Optimized Prisma schema: proper `@db.Time(6)` for activity times, `@db.DoublePrecision` for lat/lng, added missing FK indexes (`copiedFromTripId`, `tripActivityId`), fixed `SavedPlace` cascade per Architecture.md | `prisma/schema.prisma`, `.env` | Schema pushed to Neon PostgreSQL — all 9 tables synced |
| 2026-08-22 | AI | Created initial Prisma schema with all 9 models | `prisma/schema.prisma` | `users`, `trips`, `trip_stops`, `places`, `trip_activities`, `expenses`, `budgets`, `saved_places`, `ai_suggestions` per Architecture.md §6 |

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

## 7. Database Schema Reference

*Exact column names as they appear in PostgreSQL (via Prisma `@@map`). Matches `Architecture.md § 6`.*

### 7.1 `users`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK, default `uuid()` |
| `name` | text | NOT NULL |
| `email` | text | NOT NULL, UNIQUE |
| `password_hash` | text | NOT NULL |
| `avatar_url` | text | nullable |
| `language_preference` | text | NOT NULL, default `'en'` |
| `role` | enum(`USER`, `ADMIN`) | NOT NULL, default `USER` |
| `preferences` | jsonb | nullable |
| `created_at` | timestamptz | NOT NULL, default `now()` |
| `updated_at` | timestamptz | NOT NULL, auto-updated |
| `deleted_at` | timestamptz | nullable (soft delete) |

### 7.2 `trips`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | NOT NULL, FK → `users.id` |
| `name` | text | NOT NULL |
| `description` | text | nullable |
| `cover_photo_url` | text | nullable |
| `start_date` | date | NOT NULL |
| `end_date` | date | NOT NULL |
| `status` | enum(`DRAFT`, `PLANNED`, `COMPLETED`) | NOT NULL, default `DRAFT` |
| `currency` | varchar(3) | NOT NULL, default `'INR'` |
| `is_public` | boolean | NOT NULL, default `false` |
| `share_token` | text | nullable, UNIQUE |
| `copied_from_trip_id` | uuid | nullable, FK → `trips.id` (onDelete: SetNull) |
| `created_at` | timestamptz | NOT NULL, default `now()` |
| `updated_at` | timestamptz | NOT NULL, auto-updated |
| `deleted_at` | timestamptz | nullable (soft delete) |

**Indexes:** `(user_id)`, `(copied_from_trip_id)`, unique `(share_token)`

### 7.3 `trip_stops`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `trip_id` | uuid | NOT NULL, FK → `trips.id` (onDelete: Cascade) |
| `city_place_id` | uuid | NOT NULL, FK → `places.id` |
| `order_index` | int | NOT NULL |
| `start_date` | date | NOT NULL |
| `end_date` | date | NOT NULL |
| `budget_limit` | numeric(12,2) | nullable |
| `created_at` | timestamptz | NOT NULL, default `now()` |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**Indexes:** `(trip_id, order_index)`, `(city_place_id)`

### 7.4 `places`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `type` | enum(`CITY`, `ACTIVITY`) | NOT NULL |
| `external_provider` | text | NOT NULL |
| `external_place_id` | text | NOT NULL |
| `name` | text | NOT NULL |
| `country` | text | nullable |
| `region` | text | nullable |
| `category` | text | nullable |
| `latitude` | double precision | nullable |
| `longitude` | double precision | nullable |
| `cost_index` | numeric(6,2) | nullable |
| `rating` | numeric(3,2) | nullable |
| `image_url` | text | nullable |
| `metadata` | jsonb | nullable |
| `cached_at` | timestamptz | NOT NULL, default `now()` |

**Constraints:** unique `(external_provider, external_place_id)`

### 7.5 `trip_activities`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `trip_stop_id` | uuid | NOT NULL, FK → `trip_stops.id` (onDelete: Cascade) |
| `place_id` | uuid | NOT NULL, FK → `places.id` |
| `scheduled_date` | date | NOT NULL |
| `start_time` | time(6) | nullable |
| `end_time` | time(6) | nullable |
| `order_index` | int | NOT NULL |
| `estimated_cost` | numeric(10,2) | nullable |
| `actual_cost` | numeric(10,2) | nullable |
| `notes` | text | nullable |
| `status` | enum(`PLANNED`, `COMPLETED`, `CANCELLED`) | NOT NULL, default `PLANNED` |
| `created_at` | timestamptz | NOT NULL, default `now()` |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**Indexes:** `(trip_stop_id, scheduled_date, order_index)`, `(place_id)`

### 7.6 `expenses`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `trip_id` | uuid | NOT NULL, FK → `trips.id` (onDelete: Cascade) |
| `trip_activity_id` | uuid | nullable, FK → `trip_activities.id` (onDelete: SetNull) |
| `category` | enum(`TRANSPORT`, `STAY`, `ACTIVITY`, `MEALS`, `OTHER`) | NOT NULL |
| `description` | text | nullable |
| `amount` | numeric(10,2) | NOT NULL |
| `currency` | varchar(3) | NOT NULL, default `'INR'` |
| `expense_date` | date | nullable |
| `created_at` | timestamptz | NOT NULL, default `now()` |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**Indexes:** `(trip_id)`, `(trip_activity_id)`

### 7.7 `budgets`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `trip_id` | uuid | NOT NULL, FK → `trips.id` (onDelete: Cascade) |
| `category` | enum(`TRANSPORT`, `STAY`, `ACTIVITY`, `MEALS`, `OTHER`, `OVERALL`) | NOT NULL |
| `limit_amount` | numeric(12,2) | NOT NULL |
| `currency` | varchar(3) | NOT NULL, default `'INR'` |
| `created_at` | timestamptz | NOT NULL, default `now()` |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**Constraints:** unique `(trip_id, category)`

### 7.8 `saved_places`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | NOT NULL, FK → `users.id` (onDelete: Cascade) |
| `place_id` | uuid | NOT NULL, FK → `places.id` |
| `created_at` | timestamptz | NOT NULL, default `now()` |

**Constraints:** unique `(user_id, place_id)`. **Indexes:** `(user_id)`, `(place_id)`

### 7.9 `ai_suggestions`
| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PK |
| `trip_id` | uuid | NOT NULL, FK → `trips.id` (onDelete: Cascade) |
| `prompt_input` | jsonb | NOT NULL |
| `raw_response` | jsonb | nullable |
| `status` | enum(`PENDING`, `APPLIED`, `DISCARDED`, `FAILED`) | NOT NULL, default `PENDING` |
| `created_at` | timestamptz | NOT NULL, default `now()` |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**Indexes:** `(trip_id)`

---

## 8. Team

| Name | Role / area |
|---|---|
| — | — |