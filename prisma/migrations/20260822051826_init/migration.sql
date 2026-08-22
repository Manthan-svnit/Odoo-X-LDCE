-- Migration: Create all GlobeTrotter tables
-- Matches Architecture.md § 6.1–6.9 and prisma/schema.prisma

-- ──────────────────────────────────────────────
-- Enums
-- ──────────────────────────────────────────────

CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'PLANNED', 'COMPLETED');
CREATE TYPE "PlaceType" AS ENUM ('CITY', 'ACTIVITY');
CREATE TYPE "ActivityStatus" AS ENUM ('PLANNED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ExpenseCategory" AS ENUM ('TRANSPORT', 'STAY', 'ACTIVITY', 'MEALS', 'OTHER');
CREATE TYPE "BudgetCategory" AS ENUM ('TRANSPORT', 'STAY', 'ACTIVITY', 'MEALS', 'OTHER', 'OVERALL');
CREATE TYPE "AISuggestionStatus" AS ENUM ('PENDING', 'APPLIED', 'DISCARDED', 'FAILED');

-- ──────────────────────────────────────────────
-- § 6.1 users
-- ──────────────────────────────────────────────

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "language_preference" TEXT NOT NULL DEFAULT 'en',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "preferences" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ──────────────────────────────────────────────
-- § 6.2 trips
-- ──────────────────────────────────────────────

CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_photo_url" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "share_token" TEXT,
    "copied_from_trip_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "trips_share_token_key" ON "trips"("share_token");
CREATE INDEX "trips_user_id_idx" ON "trips"("user_id");
CREATE INDEX "trips_copied_from_trip_id_idx" ON "trips"("copied_from_trip_id");

ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "trips" ADD CONSTRAINT "trips_copied_from_trip_id_fkey"
    FOREIGN KEY ("copied_from_trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ──────────────────────────────────────────────
-- § 6.4 places (must exist before trip_stops)
-- ──────────────────────────────────────────────

CREATE TABLE "places" (
    "id" TEXT NOT NULL,
    "type" "PlaceType" NOT NULL,
    "external_provider" TEXT NOT NULL,
    "external_place_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "category" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "cost_index" DECIMAL(6,2),
    "rating" DECIMAL(3,2),
    "image_url" TEXT,
    "metadata" JSONB,
    "cached_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "places_external_provider_external_place_id_key"
    ON "places"("external_provider", "external_place_id");

-- ──────────────────────────────────────────────
-- § 6.3 trip_stops
-- ──────────────────────────────────────────────

CREATE TABLE "trip_stops" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "city_place_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "budget_limit" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_stops_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "trip_stops_trip_id_order_index_idx" ON "trip_stops"("trip_id", "order_index");
CREATE INDEX "trip_stops_city_place_id_idx" ON "trip_stops"("city_place_id");

ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_city_place_id_fkey"
    FOREIGN KEY ("city_place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ──────────────────────────────────────────────
-- § 6.5 trip_activities
-- ──────────────────────────────────────────────

CREATE TABLE "trip_activities" (
    "id" TEXT NOT NULL,
    "trip_stop_id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "scheduled_date" DATE NOT NULL,
    "start_time" TIME(6),
    "end_time" TIME(6),
    "order_index" INTEGER NOT NULL,
    "estimated_cost" DECIMAL(10,2),
    "actual_cost" DECIMAL(10,2),
    "notes" TEXT,
    "status" "ActivityStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "trip_activities_trip_stop_id_scheduled_date_order_index_idx"
    ON "trip_activities"("trip_stop_id", "scheduled_date", "order_index");
CREATE INDEX "trip_activities_place_id_idx" ON "trip_activities"("place_id");

ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_trip_stop_id_fkey"
    FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_place_id_fkey"
    FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ──────────────────────────────────────────────
-- § 6.6 expenses
-- ──────────────────────────────────────────────

CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "trip_activity_id" TEXT,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "expense_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "expenses_trip_id_idx" ON "expenses"("trip_id");
CREATE INDEX "expenses_trip_activity_id_idx" ON "expenses"("trip_activity_id");

ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "expenses" ADD CONSTRAINT "expenses_trip_activity_id_fkey"
    FOREIGN KEY ("trip_activity_id") REFERENCES "trip_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ──────────────────────────────────────────────
-- § 6.7 budgets
-- ──────────────────────────────────────────────

CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "category" "BudgetCategory" NOT NULL,
    "limit_amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "budgets_trip_id_category_key" ON "budgets"("trip_id", "category");

ALTER TABLE "budgets" ADD CONSTRAINT "budgets_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ──────────────────────────────────────────────
-- § 6.8 saved_places
-- ──────────────────────────────────────────────

CREATE TABLE "saved_places" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_places_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "saved_places_user_id_place_id_key" ON "saved_places"("user_id", "place_id");
CREATE INDEX "saved_places_user_id_idx" ON "saved_places"("user_id");
CREATE INDEX "saved_places_place_id_idx" ON "saved_places"("place_id");

ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "saved_places" ADD CONSTRAINT "saved_places_place_id_fkey"
    FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ──────────────────────────────────────────────
-- § 6.9 ai_suggestions
-- ──────────────────────────────────────────────

CREATE TABLE "ai_suggestions" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "prompt_input" JSONB NOT NULL,
    "raw_response" JSONB,
    "status" "AISuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_suggestions_trip_id_idx" ON "ai_suggestions"("trip_id");

ALTER TABLE "ai_suggestions" ADD CONSTRAINT "ai_suggestions_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
