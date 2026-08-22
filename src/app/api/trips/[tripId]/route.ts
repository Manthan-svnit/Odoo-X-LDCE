import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateTripSchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: {
            cityPlace: true,
            activities: {
              orderBy: { orderIndex: 'asc' },
              include: { place: true }
            }
          }
        },
        expenses: true,
        budgets: true,
      }
    });

    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    
    // Check ownership or public
    if (trip.userId !== session.sub && !trip.isPublic) {
      return apiForbidden();
    }

    return apiSuccess(trip);
  } catch (error) {
    console.error("GET Trip Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId } = await params;
    const body = await req.json();

    const parsed = updateTripSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const existing = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existing || existing.deletedAt) return apiNotFound("Trip");
    if (existing.userId !== session.sub) return apiForbidden();

    const data = parsed.data;
    
    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("PUT Trip Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId } = await params;

    const existing = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existing || existing.deletedAt) return apiNotFound("Trip");
    if (existing.userId !== session.sub) return apiForbidden();

    await prisma.trip.update({
      where: { id: tripId },
      data: { deletedAt: new Date() },
    });

    return apiSuccess({ message: "Trip deleted" });
  } catch (error) {
    console.error("DELETE Trip Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
