import { z } from "zod";

// ── Auth ────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  additionalInfo: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Trip ────────────────────────────────────────────────────────────
export const createTripSchema = z
  .object({
    name: z.string().min(1, "Trip name is required").max(200),
    description: z.string().max(2000).optional(),
    coverPhotoUrl: z.string().url().optional().or(z.literal("")),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    currency: z.string().length(3).default("INR"),
    status: z.enum(["DRAFT", "PLANNED", "COMPLETED"]).default("DRAFT"),
  })
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const updateTripSchema = createTripSchema.partial();

// ── Stop ────────────────────────────────────────────────────────────
export const createStopSchema = z
  .object({
    cityPlaceId: z.string().min(1, "City is required"),
    orderIndex: z.number().int().min(0),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    budgetLimit: z.number().positive().optional(),
  })
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: "Stop end date must be on or after start date",
    path: ["endDate"],
  });

export const updateStopSchema = createStopSchema.partial().omit({ cityPlaceId: true });

export const reorderSchema = z.array(
  z.object({ id: z.string(), orderIndex: z.number().int().min(0) })
);

// ── Activity ────────────────────────────────────────────────────────
export const createActivitySchema = z.object({
  placeId: z.string().min(1, "Place is required"),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  orderIndex: z.number().int().min(0),
  estimatedCost: z.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(["PLANNED", "COMPLETED", "CANCELLED"]).default("PLANNED"),
});

export const updateActivitySchema = createActivitySchema.partial().omit({ placeId: true });

// ── Expense ────────────────────────────────────────────────────────
export const createExpenseSchema = z.object({
  category: z.enum(["TRANSPORT", "STAY", "ACTIVITY", "MEALS", "OTHER"]),
  description: z.string().max(500).optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string().length(3).default("INR"),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tripActivityId: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

// ── Budget ────────────────────────────────────────────────────────
export const createBudgetSchema = z.object({
  category: z.enum(["TRANSPORT", "STAY", "ACTIVITY", "MEALS", "OTHER", "OVERALL"]),
  limitAmount: z.number().positive("Limit must be greater than 0"),
  currency: z.string().length(3).default("INR"),
});

// ── Profile ────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  languagePreference: z.string().min(2).max(10).optional(),
  preferences: z.record(z.unknown()).optional(),
});
