import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError, apiNotFound } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const savedPlaces = await prisma.savedPlace.findMany({
      where: { userId: session.sub },
      include: { place: true },
      orderBy: { createdAt: "desc" }
    });

    return apiSuccess(savedPlaces.map(sp => sp.place));
  } catch (error) {
    console.error("GET Saved Places Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const body = await req.json();
    const { placeId } = body;
    
    if (!placeId) return apiError("Place ID is required", "VALIDATION_ERROR");

    const place = await prisma.place.findUnique({ where: { id: placeId } });
    if (!place) return apiNotFound("Place");

    const savedPlace = await prisma.savedPlace.upsert({
      where: {
        userId_placeId: {
          userId: session.sub,
          placeId,
        }
      },
      update: {},
      create: {
        userId: session.sub,
        placeId,
      },
      include: { place: true }
    });

    return apiSuccess(savedPlace.place, 201);
  } catch (error) {
    console.error("POST Saved Place Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const placeId = req.nextUrl.searchParams.get("placeId");
    if (!placeId) return apiError("Place ID is required", "VALIDATION_ERROR");

    await prisma.savedPlace.deleteMany({
      where: {
        userId: session.sub,
        placeId,
      }
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error("DELETE Saved Place Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
