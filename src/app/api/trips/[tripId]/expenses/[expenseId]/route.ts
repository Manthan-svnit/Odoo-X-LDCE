import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateExpenseSchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId, expenseId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const existingExpense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existingExpense || existingExpense.tripId !== tripId) return apiNotFound("Expense");

    const body = await req.json();
    const parsed = updateExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const data = parsed.data;

    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...data,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
      },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("PUT Expense Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId, expenseId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const existingExpense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existingExpense || existingExpense.tripId !== tripId) return apiNotFound("Expense");

    await prisma.expense.delete({ where: { id: expenseId } });

    return apiSuccess({ message: "Expense deleted" });
  } catch (error) {
    console.error("DELETE Expense Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
