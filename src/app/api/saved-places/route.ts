import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return apiUnauthorized();

    const savedPlaces = await prisma.savedPlace.findMany({
      where: { userId: session.sub },
      include: { place: true },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(savedPlaces);
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
    const placeId = body.placeId;

    if (!placeId) {
        return apiError("placeId is required", "MISSING_PARAM");
    }

    const existing = await prisma.savedPlace.findUnique({
        where: {
            userId_placeId: {
                userId: session.sub,
                placeId,
            }
        }
    });

    if (existing) {
        // Toggle off
        await prisma.savedPlace.delete({ where: { id: existing.id } });
        return apiSuccess({ saved: false });
    } else {
        // Toggle on
        const saved = await prisma.savedPlace.create({
            data: {
                userId: session.sub,
                placeId,
            }
        });
        return apiSuccess({ saved: true, data: saved }, 201);
    }
  } catch (error) {
    console.error("POST Saved Place Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
