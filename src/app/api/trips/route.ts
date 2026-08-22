import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createTripSchema } from "@/lib/validations";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    const where: Prisma.TripWhereInput = {
      userId: session.sub,
      deletedAt: null,
    };

    if (status) {
      where.status = status as any;
    }
    if (query) {
      where.name = { contains: query, mode: "insensitive" };
    }

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { startDate: "asc" },
      include: {
        stops: {
          include: { 
            cityPlace: true,
            activities: {
              include: { place: true }
            }
          }
        }
      }
    });

    return apiSuccess(trips);
  } catch (error) {
    console.error("GET Trips Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const body = await req.json();
    const parsed = createTripSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message, "VALIDATION_ERROR");
    }
    
    const data = parsed.data;

    const trip = await prisma.trip.create({
      data: {
        userId: session.sub,
        name: data.name,
        description: data.description,
        coverPhotoUrl: data.coverPhotoUrl,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        currency: data.currency,
        status: data.status,
      },
    });

    return apiSuccess(trip, 201);
  } catch (error) {
    console.error("POST Trip Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
