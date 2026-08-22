import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createBudgetSchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub && !trip.isPublic) return apiForbidden();

    const budgets = await prisma.budget.findMany({
      where: { tripId },
    });

    return apiSuccess(budgets);
  } catch (error) {
    console.error("GET Budgets Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId } = await params;
    
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const body = await req.json();
    const parsed = createBudgetSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const data = parsed.data;

    // Check if category budget already exists (upsert logic in POST/PUT combined below if needed, but doing simple create/upsert)
    const budget = await prisma.budget.upsert({
      where: {
        tripId_category: {
          tripId,
          category: data.category,
        }
      },
      update: {
        limitAmount: data.limitAmount,
        currency: data.currency,
      },
      create: {
        tripId,
        category: data.category,
        limitAmount: data.limitAmount,
        currency: data.currency,
      },
    });

    return apiSuccess(budget, 201);
  } catch (error) {
    console.error("POST Budget Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  return POST(req, { params }); // Since POST uses upsert, we can just proxy PUT to POST
}
