import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";

export async function POST(
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
                include: { activities: true }
            },
            budgets: true,
        }
    });

    if (!trip || trip.deletedAt) return apiNotFound("Trip");
    if (trip.userId !== session.sub && !trip.isPublic) return apiForbidden();

    // Deep copy transaction
    const newTrip = await prisma.$transaction(async (tx) => {
        const copiedTrip = await tx.trip.create({
            data: {
                userId: session.sub,
                name: `Copy of ${trip.name}`,
                description: trip.description,
                coverPhotoUrl: trip.coverPhotoUrl,
                startDate: trip.startDate,
                endDate: trip.endDate,
                status: "DRAFT",
                currency: trip.currency,
                isPublic: false,
                copiedFromTripId: trip.id,
            }
        });

        for (const stop of trip.stops) {
            const copiedStop = await tx.tripStop.create({
                data: {
                    tripId: copiedTrip.id,
                    cityPlaceId: stop.cityPlaceId,
                    orderIndex: stop.orderIndex,
                    startDate: stop.startDate,
                    endDate: stop.endDate,
                    budgetLimit: stop.budgetLimit,
                }
            });

            for (const activity of stop.activities) {
                await tx.tripActivity.create({
                    data: {
                        tripStopId: copiedStop.id,
                        placeId: activity.placeId,
                        scheduledDate: activity.scheduledDate,
                        startTime: activity.startTime,
                        endTime: activity.endTime,
                        orderIndex: activity.orderIndex,
                        estimatedCost: activity.estimatedCost,
                        status: "PLANNED",
                        notes: activity.notes,
                    }
                });
            }
        }

        for (const budget of trip.budgets) {
            await tx.budget.create({
                data: {
                    tripId: copiedTrip.id,
                    category: budget.category,
                    limitAmount: budget.limitAmount,
                    currency: budget.currency,
                }
            });
        }

        return copiedTrip;
    });

    return apiSuccess(newTrip, 201);
  } catch (error) {
    console.error("POST Copy Trip Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
