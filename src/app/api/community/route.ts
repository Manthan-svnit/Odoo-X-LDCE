import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    const where: any = {
      isPublic: true,
      deletedAt: null,
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { stops: { some: { cityPlace: { name: { contains: query, mode: "insensitive" } } } } }
      ];
    }

    const publicTrips = await prisma.trip.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        stops: {
          include: { cityPlace: true }
        }
      }
    });

    return apiSuccess(publicTrips);
  } catch (error) {
    console.error("GET Community Trips Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
