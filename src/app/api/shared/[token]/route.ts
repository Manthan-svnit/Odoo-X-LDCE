import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, apiNotFound } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const trip = await prisma.trip.findUnique({
      where: { shareToken: token },
      include: {
        user: { select: { name: true, avatarUrl: true } },
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
      }
    });

    if (!trip || !trip.isPublic || trip.deletedAt) {
      return apiNotFound("Shared Trip");
    }

    return apiSuccess(trip);
  } catch (error) {
    console.error("GET Shared Trip Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
