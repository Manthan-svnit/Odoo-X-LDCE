import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createActivitySchema } from "@/lib/validations";
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

    const { searchParams } = new URL(req.url);
    const stopId = searchParams.get("stopId");

    const activities = await prisma.tripActivity.findMany({
      where: {
        tripStop: {
          tripId: tripId,
          id: stopId || undefined,
        }
      },
      orderBy: { orderIndex: 'asc' },
      include: { place: true }
    });

    return apiSuccess(activities);
  } catch (error) {
    console.error("GET Activities Error:", error);
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

    const { searchParams } = new URL(req.url);
    const stopId = searchParams.get("stopId");
    if (!stopId) {
       return apiError("stopId query parameter is required", "MISSING_PARAM");
    }

    const stop = await prisma.tripStop.findUnique({ where: { id: stopId } });
    if (!stop || stop.tripId !== tripId) return apiNotFound("Stop");

    const body = await req.json();
    const parsed = createActivitySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const data = parsed.data;

    let startTime = undefined;
    if (data.startTime) {
       // Convert to 1970-01-01 time
       startTime = new Date(`1970-01-01T${data.startTime}:00.000Z`);
    }
    
    let endTime = undefined;
    if (data.endTime) {
       endTime = new Date(`1970-01-01T${data.endTime}:00.000Z`);
    }

    const activity = await prisma.tripActivity.create({
      data: {
        tripStopId: stopId,
        placeId: data.placeId,
        orderIndex: data.orderIndex,
        scheduledDate: new Date(data.scheduledDate),
        startTime,
        endTime,
        estimatedCost: data.estimatedCost,
        notes: data.notes,
        status: data.status,
      },
      include: { place: true }
    });

    return apiSuccess(activity, 201);
  } catch (error) {
    console.error("POST Activity Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
