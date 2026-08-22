import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateActivitySchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; activityId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId, activityId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const existingActivity = await prisma.tripActivity.findUnique({ 
        where: { id: activityId },
        include: { tripStop: true }
    });
    if (!existingActivity || existingActivity.tripStop.tripId !== tripId) {
        return apiNotFound("Activity");
    }

    const body = await req.json();
    const parsed = updateActivitySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const data = parsed.data;
    
    let startTime = undefined;
    if (data.startTime) {
       startTime = new Date(`1970-01-01T${data.startTime}:00.000Z`);
    }
    
    let endTime = undefined;
    if (data.endTime) {
       endTime = new Date(`1970-01-01T${data.endTime}:00.000Z`);
    }

    const updated = await prisma.tripActivity.update({
      where: { id: activityId },
      data: {
        ...data,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        startTime,
        endTime,
      },
      include: { place: true }
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("PUT Activity Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string; activityId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { tripId, activityId } = await params;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub) return apiForbidden();

    const existingActivity = await prisma.tripActivity.findUnique({ 
        where: { id: activityId },
        include: { tripStop: true }
    });
    if (!existingActivity || existingActivity.tripStop.tripId !== tripId) {
        return apiNotFound("Activity");
    }

    await prisma.tripActivity.delete({ where: { id: activityId } });

    return apiSuccess({ message: "Activity deleted" });
  } catch (error) {
    console.error("DELETE Activity Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
