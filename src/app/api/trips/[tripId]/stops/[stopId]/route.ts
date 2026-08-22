import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateStopSchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; stopId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId, stopId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const existingStop = await prisma.tripStop.findUnique({ where: { id: stopId } });
    if (!existingStop || existingStop.tripId !== tripId) return apiNotFound("Stop");

    const body = await req.json();
    const parsed = updateStopSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const data = parsed.data;

    const updated = await prisma.tripStop.update({
      where: { id: stopId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: { cityPlace: true }
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("PUT Stop Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; stopId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId, stopId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const existingStop = await prisma.tripStop.findUnique({ where: { id: stopId } });
    if (!existingStop || existingStop.tripId !== tripId) return apiNotFound("Stop");

    await prisma.tripStop.delete({ where: { id: stopId } });

    return apiSuccess({ message: "Stop deleted" });
  } catch (error) {
    console.error("DELETE Stop Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
