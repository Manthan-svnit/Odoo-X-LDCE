import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createExpenseSchema } from "@/lib/validations";
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

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { expenseDate: 'asc' },
    });

    return apiSuccess(expenses);
  } catch (error) {
    console.error("GET Expenses Error:", error);
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
    const parsed = createExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const data = parsed.data;

    const expense = await prisma.expense.create({
      data: {
        tripId,
        tripActivityId: data.tripActivityId,
        category: data.category,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
      },
    });

    return apiSuccess(expense, 201);
  } catch (error) {
    console.error("POST Expense Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
