import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiError, apiForbidden, apiNotFound } from "@/lib/api";
import crypto from "crypto";

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

    const body = await req.json();
    const isPublic = body.isPublic === true;

    let shareToken = trip.shareToken;
    if (isPublic && !shareToken) {
        shareToken = crypto.randomBytes(16).toString("hex");
    } else if (!isPublic) {
        shareToken = null;
    }

    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: {
        isPublic,
        shareToken,
      },
    });

    return apiSuccess({ isPublic: updated.isPublic, shareToken: updated.shareToken });
  } catch (error) {
    console.error("POST Share Trip Error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
